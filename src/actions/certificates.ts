"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadCertificateMetadata({
  title,
  issuer,
  fileUrl,
  fileType,
  fileName
}: {
  title: string;
  issuer: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Insert into Database
  const { data: certRecord, error: dbError } = await supabase
    .from("certificates")
    .insert({
      profile_id: user.id,
      title: title.trim(),
      issuer: issuer ? issuer.trim() : null,
      issue_date: new Date().toISOString(),
      file_url: fileUrl,
      file_type: fileType,
      parsed: false,
      status: "pending",
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("Database insert error:", dbError);
    // Cleanup storage if DB insert fails
    await supabase.storage.from("certificates").remove([fileName]);
    return { success: false, error: "Failed to save certificate record." };
  }

  // 4. Trigger Automatic Skill Claim Extraction
  try {
    const { extractClaimsFromMultimodal } = await import("@/lib/extractor/document-extractor");
    
    // Default fallback text using metadata
    const extractionText = `Certificate Title: ${title}. Issuer: ${issuer || 'N/A'}. File: ${fileName}`;
    
    // [Elite Engineer Fix] Fetch the file and extract skills visually using Multimodal LLM
    
    // SSRF Protection: Ensure fileUrl is explicitly from our Supabase Storage bucket
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !fileUrl.startsWith(`${supabaseUrl}/storage/v1/object/public/certificates/`)) {
      throw new Error("Invalid file URL: Security exception");
    }

    const response = await fetch(fileUrl);
    let extractionResult: any = { claims: [] };
    
    let fileBuffer: Buffer | null = null;
    let fileMimeType = "application/pdf";
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      
      if (fileUrl.toLowerCase().endsWith(".png")) fileMimeType = "image/png";
      else if (fileUrl.toLowerCase().endsWith(".jpg") || fileUrl.toLowerCase().endsWith(".jpeg")) fileMimeType = "image/jpeg";

      extractionResult = await extractClaimsFromMultimodal(
        fileBuffer,
        fileMimeType,
        extractionText,
        "certificate"
      );
    } else {
      console.warn(`[Document Extractor] Failed to fetch file from storage. Status: ${response.status}`);
    }

    if (extractionResult.claims.length > 0) {
      // Run Anti-Cheat Agent
      const { evaluateEvidenceIntegrity } = await import("@/lib/agents/anti-cheat");
      let integrityData = { integrity_score: 100, integrity_flags: [] as string[], integrity_status: "verified" };
      
      try {
        if (fileBuffer) {
          integrityData = await evaluateEvidenceIntegrity("certificate", {
            fileBuffer: fileBuffer,
            mimeType: fileMimeType,
            metadata: extractionText
          });
        }
      } catch (e) {
        console.error("[uploadCertificateMetadata] Anti-cheat check failed:", e);
      }

      const { data: evidence } = await supabase
        .from("evidence")
        .insert({
          user_id: user.id,
          source_type: "certificate",
          raw_ref: fileUrl,
          status: "processed",
          integrity_score: integrityData.integrity_score,
          integrity_flags: integrityData.integrity_flags,
          integrity_status: integrityData.integrity_status,
          ingested_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (evidence) {
        const claimRecords = extractionResult.claims.map((claim: any) => ({
          evidence_id: evidence.id,
          extracted_text: claim.context_snippet,
          skill_id: claim.skill_id,
          unmapped_label: claim.unmapped_label || claim.claimed_skill,
          match_confidence: claim.skill_id ? 1.0 : 0.5,
          llm_model: process.env.AI_MODEL || "amazon/nova-micro-v1:0",
        }));

        const { error: claimsError } = await supabase.from("evidence_claims").insert(claimRecords);
        if (claimsError) {
          console.error("[uploadCertificateMetadata] Failed to insert evidence claims:", claimsError);
        }

        // Update Certificate Status
        const finalStatus = integrityData.integrity_status === "verified" ? "verified" : "flagged";
        await supabase
          .from("certificates")
          .update({ parsed: true, status: finalStatus })
          .eq("id", certRecord.id);

        // Regenerate Passport to include new skills
        try {
          const { generatePassport } = await import("@/actions/passport");
          await generatePassport();
        } catch (err) {
          console.error("[uploadCertificateMetadata] Failed to regenerate passport:", err);
        }
      } else {
        return { success: false, error: "No skills could be extracted from this document." };
      }
    } else {
      return { success: false, error: "Failed to read file for extraction." };
    }
  } catch (extErr: any) {
    console.error("Claim extraction error:", extErr);
    return { success: false, error: extErr.message || "Failed to process certificate with AI." };
  }

  revalidatePath("/certificates");
  return { success: true };
}

export async function deleteCertificate(id: number, fileUrl: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Delete from Database first (RLS ensures user owns the record)
  const { error: dbError } = await supabase
    .from("certificates")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (dbError) {
    throw new Error("Failed to delete certificate record.");
  }

  // Also delete the associated evidence record (cascade will handle evidence_claims)
  const { error: evidenceError } = await supabase
    .from("evidence")
    .delete()
    .eq("raw_ref", fileUrl)
    .eq("user_id", user.id);
    
  if (evidenceError) {
    console.error("Failed to delete evidence record, orphaned claims may exist:", evidenceError);
  }

  // 2. Extract path from public URL and delete from storage
  // The URL looks like: https://[project].supabase.co/storage/v1/object/public/certificates/[user.id]/[filename]
  const pathParts = fileUrl.split("/certificates/");
  if (pathParts.length > 1) {
    const filePath = pathParts[1];
    const { error: storageError } = await supabase.storage
      .from("certificates")
      .remove([filePath]);
      
    if (storageError) {
      console.error("Failed to delete file from storage, but DB record was deleted:", storageError);
    }
  }

  revalidatePath("/certificates");
  return { success: true };
}
