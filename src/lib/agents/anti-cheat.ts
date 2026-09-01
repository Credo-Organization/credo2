import { generateObject } from "ai";
import { antiCheatModel, extractorModel, multimodalModel } from "@/lib/ai-client";
import { runEnsemble } from "@/lib/ai/ensemble";
import { z } from "zod";

const integritySchema = z.object({
  integrity_score: z.number().min(0).max(100).describe("0-100 score of how authentic this evidence appears"),
  integrity_flags: z.array(z.string()).describe("List of specific red flags found. Empty if verified."),
  integrity_status: z.enum(["verified", "flagged"]).describe("verified if score >= 70, else flagged"),
  // NOT .optional(): OpenAI strict structured outputs require every key in
  // `properties` to appear in `required`, and an optional field is omitted from
  // it. That mismatch made the provider reject every single call with a 400,
  // which meant the catch below silently marked all evidence authentic.
  verified_skills: z.array(z.string()).describe("Programming languages, frameworks, or tools identified in the evidence. Empty array if none."),
});

// The model may only answer verified/flagged. "pending" is ours: it marks
// evidence whose audit could not be completed, which must never be presented as
// a pass.
export type IntegrityResult = Omit<z.infer<typeof integritySchema>, "integrity_status"> & {
  integrity_status: "verified" | "flagged" | "pending";
  audit_votes?: unknown[];
  agreement?: string;
};

/**
 * Result used when the integrity check cannot run at all.
 *
 * This previously returned score 100 / "verified" so an outage would not block
 * real users. The effect was that any provider failure silently certified every
 * repository and certificate as authentic, which is indistinguishable from a
 * genuine pass. Failing to "pending" keeps users unblocked while making it
 * visible that nothing was actually checked.
 */
export function auditUnavailableResult(): IntegrityResult {
  return {
    integrity_score: 0,
    integrity_flags: ["audit_unavailable: integrity check could not be completed"],
    integrity_status: "pending",
    verified_skills: [],
  };
}

export async function evaluateEvidenceIntegrity(
  type: "certificate" | "github",
  payload: {
    fileBuffer?: Buffer;
    mimeType?: string;
    metadata?: string;
    githubData?: any;
  }
): Promise<IntegrityResult> {
  const model = payload.fileBuffer ? multimodalModel : antiCheatModel;

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
    systemInstruction = `You are a strict technical recruiter evaluating GitHub repository authenticity and extracting hard skills.
Analyze the provided repository metadata, languages, and README to determine if the candidate actually wrote the code, and extract the exact technologies used.
Look for:
- Repositories that are direct forks of popular projects with zero or few personal commits.
- "Suspiciously large single-day commits" where thousands of lines of code were uploaded at once (often a sign of a cloned local project pushed to bypass fork detection).
- Lack of meaningful commit history or issues.
- Generic default READMEs (e.g. "Create React App" or "Next.js template") that indicate low-effort projects.

Provide an integrity score (0-100), a list of specific red flags, a final status, and an array of all verified skills found.

Example 1 (Low Effort/Clone):
Repo: Next-js-demo. Languages: { "TypeScript": 1000 }. README: "This is a [Next.js](https://nextjs.org/) project bootstrapped with \`create-next-app\`."
Score: 30. Flags: ["Default create-next-app README", "No custom description"]. Skills: ["Next.js", "TypeScript"]. Status: "flagged"

Example 2 (Real Project):
Repo: credo-web. Languages: { "TypeScript": 45000, "CSS": 2000 }. README: "Credify is a verifiable skill passport built for SIH. We use Supabase for PostgreSQL RLS..."
Score: 95. Flags: []. Skills: ["TypeScript", "CSS", "Supabase", "PostgreSQL"]. Status: "verified"`;

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
    let verifiedSkills: string[] = [];
    
    // For GitHub, we use a specialized fast/cheap model to extract stack first
    if (type === "github") {
      const extractionModel = extractorModel;
      const extractionSchema = z.object({
        skills: z.array(z.string()).describe("List of exact programming languages, frameworks, or tools used in the repo.")
      });
      
      try {
        const { object: skillsObj } = await generateObject({
          model: extractionModel,
          schema: extractionSchema,
          messages: [
            {
              role: "user",
              content: `Extract all technical skills from this repository metadata: ${JSON.stringify(payload.githubData, null, 2)}`
            }
          ]
        });
        verifiedSkills = skillsObj.skills;
      } catch (e) {
        console.error("[AntiCheatAgent] Fast extraction failed:", e);
      }
    }

    if (type === "github") {
      // Three models from three vendors vote. resolveModels throws when fewer
      // than two are healthy, which is a precondition failure rather than a
      // verdict, so it is caught here and reported as an audit that could not
      // run - never as a pass.
      let result;
      try {
        result = await runEnsemble("ANTI_CHEAT_VERDICT", integritySchema, messages);
      } catch (e) {
        console.error("[AntiCheatAgent] Ensemble unavailable:", e);
        return auditUnavailableResult();
      }

      return {
        integrity_score: result.integrity_score,
        integrity_status: result.integrity_status,
        integrity_flags: result.integrity_flags,
        // Skills extracted cheaply earlier are additive, but only when the
        // panel actually cleared the repository.
        verified_skills:
          result.integrity_status === "verified"
            ? Array.from(new Set([...result.verified_skills, ...verifiedSkills]))
            : result.verified_skills,
        audit_votes: result.votes,
        agreement: result.agreement,
      };
    }

    const { object } = await generateObject({
      model,
      schema: integritySchema,
      messages
    });

    return object;
  } catch (e) {
    console.error("[AntiCheatAgent] Evaluation failed:", e);
    return auditUnavailableResult();
  }
}
