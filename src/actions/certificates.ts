"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadCertificate(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const issuer = formData.get("issuer") as string;

  if (!file || !title) {
    throw new Error("Missing required fields");
  }

  // Generate unique filename to avoid collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  // 1. Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from("certificates")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error("Failed to upload file to storage.");
  }

  // 2. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from("certificates")
    .getPublicUrl(fileName);

  // 3. Insert into Database
  const { error: dbError } = await supabase
    .from("certificates")
    .insert({
      profile_id: user.id,
      title: title.trim(),
      issuer: issuer ? issuer.trim() : null,
      issue_date: new Date().toISOString(), // Use current date for now as upload date
      file_url: publicUrlData.publicUrl,
      file_type: file.type,
      parsed: false,
    });

  if (dbError) {
    console.error("Database insert error:", dbError);
    // Cleanup storage if DB insert fails
    await supabase.storage.from("certificates").remove([fileName]);
    throw new Error("Failed to save certificate record.");
  }

  // 4. Trigger Automatic Skill Claim Extraction from title / metadata
  try {
    const { extractClaimsFromText } = await import("@/lib/extractor/document-extractor");
    const extractionResult = await extractClaimsFromText(
      `Certificate Title: ${title}. Issuer: ${issuer || 'N/A'}. File: ${file.name}`,
      "certificate"
    );

    if (extractionResult.claims.length > 0) {
      const { data: evidence } = await supabase
        .from("evidence")
        .insert({
          user_id: user.id,
          source_type: "certificate",
          raw_ref: publicUrlData.publicUrl,
          status: "processed",
          ingested_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (evidence) {
        const claimRecords = extractionResult.claims.map((claim) => ({
          evidence_id: evidence.id,
          extracted_text: claim.context_snippet,
          skill_id: claim.skill_id,
          unmapped_label: claim.unmapped_label,
          match_confidence: claim.skill_id ? 1.0 : 0.5,
          llm_model: process.env.AI_MODEL || "gemini-2.5-flash",
        }));

        await supabase.from("evidence_claims").insert(claimRecords);
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
