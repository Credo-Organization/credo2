import { describe, test, expect } from "vitest";
import { tallyVotes, ModelVote } from "./vote";

const vote = (model: string, score: number, flags: string[] = []): ModelVote => ({
  model,
  ok: true,
  verdict: {
    integrity_score: score,
    integrity_status: score >= 70 ? "verified" : "flagged",
    integrity_flags: flags,
    verified_skills: [],
  },
  latencyMs: 100,
});

const failed = (model: string): ModelVote => ({ model, ok: false, error: "timeout", latencyMs: 45000 });

describe("vote tally", () => {
  test("two of three flagging carries the verdict", () => {
    const r = tallyVotes([vote("a", 10, ["fork"]), vote("b", 20, ["no commits"]), vote("c", 90)]);
    expect(r.integrity_status).toBe("flagged");
  });

  test("uses the median score of the agreeing models", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 30), vote("c", 90)]);
    expect(r.integrity_score).toBe(20);
  });

  test("unions the flags of the agreeing models", () => {
    const r = tallyVotes([vote("a", 10, ["fork"]), vote("b", 20, ["fork", "template readme"]), vote("c", 90)]);
    expect(r.integrity_flags.sort()).toEqual(["fork", "template readme"]);
  });

  test("a tie resolves to pending rather than guessing", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 90)]);
    expect(r.integrity_status).toBe("pending");
  });

  test("fewer than two responses cannot decide anything", () => {
    const r = tallyVotes([vote("a", 10), failed("b"), failed("c")]);
    expect(r.integrity_status).toBe("pending");
  });

  test("no responses at all resolves to pending", () => {
    const r = tallyVotes([failed("a"), failed("b"), failed("c")]);
    expect(r.integrity_status).toBe("pending");
    expect(r.integrity_score).toBe(0);
  });

  test("keeps every individual vote for the audit trail", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 20), failed("c")]);
    expect(r.votes).toHaveLength(3);
    expect(r.votes.filter((v) => v.ok)).toHaveLength(2);
  });

  test("a pending verdict claims no model findings of its own", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 90)]);
    expect(r.integrity_flags).toEqual([]);
  });

  test("a pending verdict explains itself in a separate field", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 90)]);
    expect(r.pending_reason).toMatch(/majority/i);
  });

  test("a decided verdict carries no pending reason", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 20), vote("c", 90)]);
    expect(r.pending_reason).toBeUndefined();
  });
});
