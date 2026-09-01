import { z } from "zod";
import { resolveModels } from "./profiles";
import { runOne } from "./execute";
import { tallyVotes, ModelVote, EnsembleVerdict } from "./vote";

export interface EnsembleResult extends EnsembleVerdict {
  /** e.g. "3/3": how many responding models backed the winning verdict. */
  agreement: string;
}

export function combine(votes: ModelVote[]): EnsembleResult {
  const tallied = tallyVotes(votes);
  const responded = votes.filter((v) => v.ok && v.verdict);

  // Largest agreeing bloc over responders. Counting only models that match the
  // final status would report "0/2" for a 1-1 tie, because "pending" is an
  // ensemble outcome that no individual model can return - implying nobody
  // answered when in fact everybody did and they split.
  const blocs = new Map<string, number>();
  for (const v of responded) {
    const s = v.verdict!.integrity_status;
    blocs.set(s, (blocs.get(s) ?? 0) + 1);
  }
  const largest = blocs.size ? Math.max(...blocs.values()) : 0;

  return { ...tallied, agreement: `${largest}/${responded.length}` };
}

/**
 * Fans out to the profile's panel concurrently. The limiter keeps that within
 * provider rate limits, so latency is the slowest member rather than the sum.
 */
export async function runEnsemble<S extends z.ZodTypeAny>(
  profile: string,
  schema: S,
  messages: unknown[]
): Promise<EnsembleResult> {
  const panel = resolveModels(profile);
  const votes = await Promise.all(panel.map((id) => runOne(id, schema, messages)));
  return combine(votes);
}
