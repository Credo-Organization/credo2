import { NormalisedVerdict } from "./normalise";

export interface ModelVote {
  model: string;
  ok: boolean;
  verdict?: NormalisedVerdict;
  error?: string;
  latencyMs: number;
}

export interface EnsembleVerdict {
  integrity_score: number;
  integrity_status: "verified" | "flagged" | "pending";
  integrity_flags: string[];
  verified_skills: string[];
  votes: ModelVote[];
  /**
   * Why no verdict was reached. Set only when status is "pending". Kept out of
   * integrity_flags because that field carries model-produced findings, and a
   * UI listing "reasons this repository was flagged" must never mix a synthetic
   * string in with claims a model actually made.
   */
  pending_reason?: string;
}

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

const pending = (votes: ModelVote[]): EnsembleVerdict => ({
  integrity_score: 0,
  integrity_status: "pending",
  integrity_flags: [],
  verified_skills: [],
  votes,
  pending_reason: "models did not reach a majority",
});

/**
 * Majority wins. A tie, or fewer than two usable responses, resolves to pending
 * rather than guessing. Pending is the same state anti-cheat already uses when
 * an audit cannot run, so no new failure mode is introduced.
 */
export function tallyVotes(votes: ModelVote[]): EnsembleVerdict {
  const usable = votes.filter((v) => v.ok && v.verdict);
  if (usable.length < 2) return pending(votes);

  const flagged = usable.filter((v) => v.verdict!.integrity_status === "flagged");
  const verified = usable.filter((v) => v.verdict!.integrity_status === "verified");
  if (flagged.length === verified.length) return pending(votes);

  const winners = flagged.length > verified.length ? flagged : verified;
  const status = flagged.length > verified.length ? "flagged" : "verified";

  return {
    integrity_score: median(winners.map((v) => v.verdict!.integrity_score)),
    integrity_status: status,
    integrity_flags: [...new Set(winners.flatMap((v) => v.verdict!.integrity_flags))],
    verified_skills: [...new Set(winners.flatMap((v) => v.verdict!.verified_skills))],
    votes,
  };
}
