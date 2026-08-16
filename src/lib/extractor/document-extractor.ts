import { GoogleGenAI } from "@google/genai";
import { normalizeSkill } from "./taxonomy-normalizer";
import { cookies } from "next/headers";

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

/**
 * Extract skill claims from raw text using Gemini AI structured output.
 * Enforces mechanical verbatim verification: context_snippet must exist in source_text.
 * Automatically normalizes claims against the 296-skill taxonomy.
 */
export async function extractClaimsFromText(
  sourceText: string,
  documentType: "resume" | "certificate" | "project_description" = "resume"
): Promise<ExtractionResult> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey || apiKey === "your-ai-api-key") {
    throw new Error("Missing or invalid AI_API_KEY environment variable.");
  }

  // Gemini is instantiated lazily below if needed

  const prompt = `
You are an evidence extraction engine for technical skill validation.
Analyze the following ${documentType} text and extract ALL explicit skill claims, credentials, and technical project references.

CRITICAL INSTRUCTIONS:
1. For every claim, "context_snippet" MUST be an EXACT VERBATIM SUBSTRING copied directly from the text.
2. "claimed_skill" should be the standard technical skill name (e.g. "React", "Python", "PostgreSQL", "Docker", "Machine Learning").
3. "source_section" must be one of: "education", "projects", "experience", "certifications", "skills_list", "other".
4. "self_asserted" is true if it's just listed in a skills section, false if backed by project/experience description.

Document Text:
"""
${sourceText}
"""

Return strictly valid JSON matching this schema:
{
  "claims": [
    {
      "raw_phrase": "string",
      "claimed_skill": "string",
      "context_snippet": "string",
      "source_section": "education" | "projects" | "experience" | "certifications" | "skills_list" | "other",
      "self_asserted": boolean
    }
  ],
  "document_type": "${documentType}"
}

Do not include markdown code blocks or explanatory text. Return ONLY the JSON object.
`;

  try {
    const cookieStore = await cookies();
    const provider = cookieStore.get("ai_provider")?.value || "gemini";
    let responseText = "";

    if (provider === "xai") {
      const xaiKey = process.env.XAI_API_KEY;
      if (!xaiKey) throw new Error("Missing XAI_API_KEY environment variable.");
      
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${xaiKey}`,
        },
        body: JSON.stringify({
          model: "grok-2",
          messages: [
            {
              role: "system",
              content: "You are an AI that strictly outputs valid JSON without markdown wrapping."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`xAI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      responseText = data.choices[0].message.content;
    } else {
      // Default to Gemini
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: process.env.AI_MODEL || "gemini-2.5-flash",
        contents: prompt,
      });
      responseText = response.text || "";
    }

    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim() || "{}";
    const parsed = JSON.parse(responseText);

    // 1. Mechanical anti-hallucination check: drop any claim where snippet isn't verbatim in text
    // 2. Normalize every claim against the 296-skill taxonomy
    const validatedClaims: ExtractedClaim[] = (parsed.claims || [])
      .filter((claim: any) => {
        if (!claim.context_snippet) return false;
        const isVerbatim = sourceText.toLowerCase().includes(claim.context_snippet.toLowerCase().trim());
        if (!isVerbatim) {
          console.warn(`[DocumentExtractor] Dropped non-verbatim claim snippet: "${claim.context_snippet}"`);
        }
        return isVerbatim;
      })
      .map((claim: any) => {
        const norm = normalizeSkill(claim.claimed_skill);
        return {
          raw_phrase: claim.raw_phrase,
          claimed_skill: norm.canonical_name,
          skill_id: norm.skill_id,
          unmapped_label: norm.unmapped_label,
          context_snippet: claim.context_snippet,
          source_section: claim.source_section,
          self_asserted: claim.self_asserted,
        };
      });

    return {
      document_type: parsed.document_type || documentType,
      claims: validatedClaims,
      raw_text: sourceText,
    };
  } catch (error: any) {
    console.error("[DocumentExtractor] Extraction Error:", error);
    throw new Error(`Extraction failed: ${error.message}`);
  }
}
