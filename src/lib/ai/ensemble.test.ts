import { describe, test, expect } from "vitest";
import { combine } from "./ensemble";
import { ModelVote } from "./vote";

const v = (model: string, score: number): ModelVote => ({
  model,
  ok: true,
  latencyMs: 10,
  verdict: {
    integrity_score: score,
    integrity_status: score >= 70 ? "verified" : "flagged",
    integrity_flags: [],
    verified_skills: [],
  },
});

describe("ensemble combination", () => {
  test("reports how many models agreed, for the audit trail", () => {
    const r = combine([v("a", 10), v("b", 20), v("c", 90)]);
    expect(r.agreement).toBe("2/3");
  });

  test("counts only responding models in the denominator", () => {
    const r = combine([v("a", 10), v("b", 20), { model: "c", ok: false, error: "timeout", latencyMs: 30000 }]);
    expect(r.agreement).toBe("2/2");
  });

  test("carries the verdict through unchanged", () => {
    expect(combine([v("a", 10), v("b", 20), v("c", 90)]).integrity_status).toBe("flagged");
  });

  test("reports no agreement when nothing responded", () => {
    const r = combine([{ model: "a", ok: false, error: "timeout", latencyMs: 1 }]);
    expect(r.agreement).toBe("0/0");
  });

  test("a tie reports the split honestly rather than as no agreement", () => {
    const r = combine([v("a", 10), v("b", 90)]);
    expect(r.integrity_status).toBe("pending");
    expect(r.agreement).toBe("1/2");
  });

  test("a unanimous panel reports full agreement", () => {
    const r = combine([v("a", 10), v("b", 20), v("c", 30)]);
    expect(r.agreement).toBe("3/3");
  });
});
