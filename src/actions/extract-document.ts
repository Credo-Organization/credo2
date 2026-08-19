"use server";

import { extractClaimsFromText } from "@/lib/extractor/document-extractor";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function parseDocumentAction(text: string, documentType: "resume" | "certificate" | "project_description") {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Document text cannot be empty.");
  }

  // 1. Extract and normalize claims with Gemini + 296-skill taxonomy
  const extractionResult = await extractClaimsFromText(text, documentType);

  // 2. Persist evidence record into database
  const { data: evidence, error: evidenceError } = await supabase
    .from("evidence")
    .insert({
      user_id: user.id,
      source_type: documentType,
      raw_ref: text.substring(0, 200),
      status: "processed",
      ingested_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (evidenceError) {
    console.error("[Database] Error creating evidence record:", evidenceError);
    // Continue even if evidence table has schema differences, return extracted data to user
  } else if (evidence && extractionResult.claims.length > 0) {
    // 3. Persist individual claims into evidence_claims table
    const claimRecords = extractionResult.claims.map((claim) => ({
      evidence_id: evidence.id,
      extracted_text: claim.context_snippet,
      skill_id: claim.skill_id,
      unmapped_label: claim.unmapped_label,
      match_confidence: claim.skill_id ? 1.0 : 0.5,
      llm_model: process.env.AI_MODEL || "amazon/nova-micro-v1:0",
    }));

    const { error: claimsError } = await supabase
      .from("evidence_claims")
      .insert(claimRecords);

    if (claimsError) {
      console.error("[Database] Error persisting evidence claims:", claimsError);
    }
  }

  revalidatePath("/passport");
  revalidatePath("/certificates");

  return { success: true, data: extractionResult };
}
