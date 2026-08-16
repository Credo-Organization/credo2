import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { normalizeSkill } from "./taxonomy-normalizer";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export interface ExtractedClaim {
  raw_phrase: string;
  claimed_skill: string;
  skill_id: string | null;
  unmapped_label: string | null;
  context_snippet: string;
  source_section: "education" | "projects" | "experience" | "certifications" | "skills_list" | "other";
  self_asserted: boolean;
}

export interface ExtractionResult {
  claims: ExtractedClaim[];
  document_type: "resume" | "certificate" | "project_description";
  raw_text?: string;
}

const claimSchema = z.object({
  raw_phrase: z.string().describe("The exact name of the skill as written"),
  claimed_skill: z.string().describe("Standard technical name (e.g. React, Python)"),
  context_snippet: z.string().describe("EXACT VERBATIM substring from the text proving this skill"),
  source_section: z.enum(["education", "projects", "experience", "certifications", "skills_list", "other"]),
  self_asserted: z.boolean().describe("true if just listed in a skills section, false if backed by a description")
});

const extractionSchema = z.object({
  claims: z.array(claimSchema),
  document_type: z.enum(["resume", "certificate", "project_description"])
});

// Helper for alphanumeric normalization (zero-dependency fuzzy match)
function stripText(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Chunking helper
function chunkText(text: string, maxLength: number = 3000): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += p + "\n\n";
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Fallback: If there were no newlines and the chunk is STILL too massive, slice it forcefully
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length > maxLength) {
      for (let i = 0; i < chunk.length; i += maxLength) {
        finalChunks.push(chunk.substring(i, i + maxLength));
      }
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks.length > 0 ? finalChunks : [text];
}

export async function extractClaimsFromText(
  sourceText: string,
  documentType: "resume" | "certificate" | "project_description" = "resume"
): Promise<ExtractionResult> {
  const cookieStore = await cookies();
  const provider = cookieStore.get("ai_provider")?.value || "gemini";
  
  // 1. Semantic Caching
  const contentHash = crypto.createHash('sha256').update(sourceText + provider + documentType).digest('hex');
  const supabase = await createClient();
  
  const { data: cached } = await supabase
    .from("extraction_cache")
    .select("extracted_data")
    .eq("content_hash", contentHash)
    .single();
    
  if (cached && cached.extracted_data) {
    console.log("[DocumentExtractor] Cache Hit for document");
    return cached.extracted_data as ExtractionResult;
  }

  // 2. Setup AI Model
  let model;
  if (provider === "xai") {
    const xai = createOpenAI({
      baseURL: "https://api.x.ai/v1",
      apiKey: process.env.XAI_API_KEY || "",
    });
    model = xai("grok-2");
  } else {
    const googleAuth = createGoogleGenerativeAI({
      apiKey: process.env.AI_API_KEY || "",
    });
    model = googleAuth(process.env.AI_MODEL || "gemini-2.5-flash");
  }

  // 3. Chunking & Concurrency
  const chunks = chunkText(sourceText, 3000);
  const strippedSource = stripText(sourceText);
  
  console.log(`[DocumentExtractor] Processing ${chunks.length} chunk(s) concurrently`);
  
  const chunkPromises = chunks.map(async (chunk) => {
    const prompt = `You are an evidence extraction engine for technical skill validation.
Analyze this portion of a ${documentType} and extract ALL explicit skill claims.
CRITICAL: For every claim, "context_snippet" MUST be an EXACT VERBATIM SUBSTRING copied directly from the text.

Text Chunk:
"""
${chunk}
"""`;

    try {
      const { object } = await generateObject({
        model,
        schema: extractionSchema,
        prompt
      });
      return object.claims;
    } catch (e) {
      console.error("[DocumentExtractor] Chunk extraction failed", e);
      return [];
    }
  });
  
  const chunkResults = await Promise.all(chunkPromises);
  const allClaims = chunkResults.flat();
  
  // 4. Verification & Deduplication
  const uniqueClaims = new Map<string, ExtractedClaim>();
  
  for (const claim of allClaims) {
    // Alphanumeric Verification
    const strippedSnippet = stripText(claim.context_snippet);
    if (!strippedSnippet || !strippedSource.includes(strippedSnippet)) {
      console.warn(`[DocumentExtractor] Dropped hallucinated claim: "${claim.context_snippet}"`);
      continue;
    }
    
    // Normalization & Deduplication
    const norm = normalizeSkill(claim.claimed_skill);
    let dedupeKey = norm.skill_id || norm.unmapped_label || claim.claimed_skill;
    dedupeKey = dedupeKey.toLowerCase();
    
    if (!uniqueClaims.has(dedupeKey)) {
      uniqueClaims.set(dedupeKey, {
        raw_phrase: claim.raw_phrase,
        claimed_skill: norm.canonical_name,
        skill_id: norm.skill_id,
        unmapped_label: norm.unmapped_label,
        context_snippet: claim.context_snippet,
        source_section: claim.source_section,
        self_asserted: claim.self_asserted
      });
    }
  }

  const result: ExtractionResult = {
    claims: Array.from(uniqueClaims.values()),
    document_type: documentType,
    raw_text: sourceText
  };
  
  // 5. Save to Cache (Fire & Forget)
  supabase.from("extraction_cache").insert({
    content_hash: contentHash,
    extracted_data: result
  }).then(({ error }) => {
    if (error) console.error("[DocumentExtractor] Cache save error:", error);
  });

  return result;
}

export async function extractClaimsFromMultimodal(
  fileBuffer: Buffer,
  mimeType: string,
  fallbackText: string,
  documentType: "resume" | "certificate" | "project_description" = "certificate"
): Promise<ExtractionResult> {
  const cookieStore = await cookies();
  const provider = cookieStore.get("ai_provider")?.value || "gemini";
  
  let model;
  if (provider === "xai") {
    // xAI does not support multimodal file uploads via the standard Vercel AI SDK structure yet,
    // so we fallback to the text extraction pipeline if the user forced xAI.
    return extractClaimsFromText(fallbackText, documentType);
  } else {
    const googleAuth = createGoogleGenerativeAI({
      apiKey: process.env.AI_API_KEY || "",
    });
    model = googleAuth(process.env.AI_MODEL || "gemini-2.5-flash");
  }

  const systemInstruction = `You are an elite evidence extraction engine for technical skill validation.
Analyze the attached ${documentType} (which could be a scanned image or PDF).
Extract ALL explicit technical skill claims.
For every claim, "context_snippet" MUST be an EXACT VERBATIM SUBSTRING copied directly from the document.
If you cannot extract exact text, describe the visual context as closely as possible.`;

  try {
    const { object } = await generateObject({
      model,
      schema: extractionSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: systemInstruction },
            { type: "text", text: `Metadata Fallback: ${fallbackText}` },
            { type: "file", data: fileBuffer, mediaType: mimeType }
          ]
        }
      ]
    });
    
    // Normalize logic
    const uniqueClaims = new Map<string, ExtractedClaim>();
    object.claims.forEach(claim => {
      const norm = normalizeSkill(claim.claimed_skill);
      const key = norm.canonical_name;
      if (!uniqueClaims.has(key)) {
        uniqueClaims.set(key, {
          ...claim,
          skill_id: norm.skill_id,
          unmapped_label: norm.skill_id ? null : norm.canonical_name
        });
      }
    });

    return {
      claims: Array.from(uniqueClaims.values()),
      document_type: documentType
    };
  } catch (e) {
    console.error("[DocumentExtractor] Multimodal extraction failed:", e);
    // Fallback to text extraction if the model rejected the file
    return extractClaimsFromText(fallbackText, documentType);
  }
}
