import { describe, test, expect } from "vitest";
import { agreementFromVotes } from "./agreement";

const v = (model: string, status: "verified" | "flagged") => ({
  model,
  ok: true,
  latencyMs: 10,
  verdict: { integrity_score: status === "verified" ? 90 : 10, integrity_status: status, integrity_flags: [], verified_skills: [] },
});

describe("agreement from stored votes", () => {
  test("reports the largest agreeing bloc over responders", () => {
    expect(agreementFromVotes([v("a", "flagged"), v("b", "flagged"), v("c", "verified")])).toBe("2/3");
  });

  test("counts only models that responded", () => {
    expect(agreementFromVotes([v("a", "flagged"), v("b", "flagged"), { model: "c", ok: false, error: "timeout", latencyMs: 1 }])).toBe("2/2");
  });

  test("reports a tie honestly rather than as no agreement", () => {
    expect(agreementFromVotes([v("a", "flagged"), v("b", "verified")])).toBe("1/2");
  });

  test("returns undefined when there are no votes to report", () => {
    expect(agreementFromVotes([])).toBeUndefined();
    expect(agreementFromVotes(null)).toBeUndefined();
    expect(agreementFromVotes(undefined)).toBeUndefined();
  });

  test("survives a malformed stored value", () => {
    expect(agreementFromVotes("not an array" as unknown as unknown[])).toBeUndefined();
    expect(agreementFromVotes([{ nonsense: true } as unknown as never])).toBeUndefined();
  });
});
