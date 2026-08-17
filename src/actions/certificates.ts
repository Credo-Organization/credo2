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
    throw new Error("Unauthorized");
  }

  // 1. Insert into Database
  const { error: dbError } = await supabase
    .from("certificates")
    .insert({
      profile_id: user.id,
      title: title.trim(),
      issuer: issuer ? issuer.trim() : null,
      issue_date: new Date().toISOString(),
      file_url: fileUrl,
      file_type: fileType,
      parsed: false,
    });

  if (dbError) {
    console.error("Database insert error:", dbError);
    // Cleanup storage if DB insert fails
    await supabase.storage.from("certificates").remove([fileName]);
    throw new Error("Failed to save certificate record.");
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
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      let mimeType = "application/pdf";
      if (fileUrl.toLowerCase().endsWith(".png")) mimeType = "image/png";
      else if (fileUrl.toLowerCase().endsWith(".jpg") || fileUrl.toLowerCase().endsWith(".jpeg")) mimeType = "image/jpeg";

      extractionResult = await extractClaimsFromMultimodal(
        buffer,
        mimeType,
        extractionText,
        "certificate"
      );
    } else {
      console.warn(`[Document Extractor] Failed to fetch file from storage. Status: ${response.status}`);
    }

    if (extractionResult.claims.length > 0) {
      const { data: evidence } = await supabase
        .from("evidence")
        .insert({
          user_id: user.id,
          source_type: "certificate",
          raw_ref: fileUrl,
          status: "processed",
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
          llm_model: process.env.AI_MODEL || "gemini-2.5-flash",
        }));

        const { error: claimsError } = await supabase.from("evidence_claims").insert(claimRecords);
        if (claimsError) {
          console.error("[uploadCertificateMetadata] Failed to insert evidence claims:", claimsError);
        }
      }
    }
  } catch (extErr) {
    console.error("Non-blocking claim extraction error:", extErr);
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
