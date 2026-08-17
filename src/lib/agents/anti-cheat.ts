import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const integritySchema = z.object({
  integrity_score: z.number().min(0).max(100).describe("0-100 score of how authentic this evidence appears"),
  integrity_flags: z.array(z.string()).describe("List of specific red flags found. Empty if verified."),
  integrity_status: z.enum(["verified", "flagged"]).describe("verified if score >= 70, else flagged"),
});

export type IntegrityResult = z.infer<typeof integritySchema>;

export async function evaluateEvidenceIntegrity(
  type: "certificate" | "github",
  payload: {
    fileBuffer?: Buffer;
    mimeType?: string;
    metadata?: string;
    githubData?: any;
  }
): Promise<IntegrityResult> {
  const googleAuth = createGoogleGenerativeAI({
    apiKey: process.env.AI_API_KEY || "",
  });
  const model = googleAuth(process.env.AI_MODEL || "gemini-2.5-flash");

  let systemInstruction = "";
  let messages: any[] = [];

  if (type === "certificate") {
    systemInstruction = `You are an elite forensic document examiner specializing in digital certificates.
Analyze the provided certificate image/PDF and determine its authenticity.
Look for:
- Mismatched fonts or obvious pixel manipulation (cloned text).
- Highly generic "Canva" template designs lacking unique issuer signatures, dates, or credential IDs.
- Inconsistencies between the metadata provided and the visual text.

Provide an integrity score (0-100), a list of specific red flags, and a final status.`;

    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: systemInstruction },
          { type: "text", text: `Metadata Context: ${payload.metadata || "None provided"}` },
          ...(payload.fileBuffer && payload.mimeType
            ? [{ type: "file", data: payload.fileBuffer, mediaType: payload.mimeType }]
            : [])
        ]
      }
    ];
  } else if (type === "github") {
    systemInstruction = `You are a strict technical recruiter evaluating GitHub repository authenticity.
Analyze the provided repository metadata to determine if the candidate actually wrote the code.
Look for:
- Repositories that are direct forks of popular projects with zero or few personal commits.
- "Suspiciously large single-day commits" where thousands of lines of code were uploaded at once (often a sign of a cloned local project pushed to bypass fork detection).
- Lack of meaningful commit history or issues.

Provide an integrity score (0-100), a list of specific red flags, and a final status.`;

    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: systemInstruction },
          { type: "text", text: `GitHub Repo Data:\n${JSON.stringify(payload.githubData, null, 2)}` }
        ]
      }
    ];
  }

  try {
    const { object } = await generateObject({
      model,
      schema: integritySchema,
      messages
    });
    
    return object;
  } catch (e) {
    console.error("[AntiCheatAgent] Evaluation failed:", e);
    // Fail open - assume verified if the AI fails, so we don't block real users
    return {
      integrity_score: 100,
      integrity_flags: [],
      integrity_status: "verified"
    };
  }
}
