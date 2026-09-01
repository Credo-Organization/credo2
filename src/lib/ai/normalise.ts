import { getModel } from "./registry";

export const PASS_THRESHOLD = 70;

export interface RawVerdict {
  integrity_score: number;
  integrity_status: string;
  integrity_flags: string[];
  verified_skills: string[];
}

export interface NormalisedVerdict {
  integrity_score: number;
  integrity_status: "verified" | "flagged";
  integrity_flags: string[];
  verified_skills: string[];
}

/**
 * Two of nine probed models mishandled the schema: one contradicted its own
 * score with its label, another answered on a 0-1 scale. The model's label is
 * therefore discarded and the status derived from a normalised score.
 */
export function normaliseVerdict(raw: RawVerdict, modelId: string): NormalisedVerdict {
  if (!Number.isFinite(raw.integrity_score)) {
    throw new Error(`Model ${modelId} returned a non-numeric integrity_score`);
  }

  let score = raw.integrity_score;
  const spec = getModel(modelId);
  // Only models measured as answering on a 0-1 scale are rescaled, and only
  // when the value actually falls in that range. For those models 1 means a
  // perfect score, not one point out of a hundred - they express a near-fake
  // as 0.01, never as 1. Do not "simplify" the range check away: an
  // unconditional rescale would turn a genuine 1/100 into a perfect 100.
  if (spec?.scaleQuirk === "zero-to-one" && score >= 0 && score <= 1) {
    score = score * 100;
  }
  score = Math.max(0, Math.min(100, score));

  return {
    integrity_score: score,
    integrity_status: score >= PASS_THRESHOLD ? "verified" : "flagged",
    integrity_flags: Array.isArray(raw.integrity_flags) ? raw.integrity_flags : [],
    verified_skills: Array.isArray(raw.verified_skills) ? raw.verified_skills : [],
  };
}
