import { describe, test, expect } from "vitest";
import { normaliseVerdict } from "./normalise";

describe("verdict normalisation", () => {
  test("overrides a label that contradicts its own score", () => {
    // deepseek-chat returned exactly this: three flags, score 20, "verified".
    const r = normaliseVerdict(
      { integrity_score: 20, integrity_status: "verified", integrity_flags: ["a", "b", "c"], verified_skills: [] },
      "deepseek/deepseek-chat"
    );
    expect(r.integrity_status).toBe("flagged");
  });

  test("rescales a model that answers on a 0-1 scale", () => {
    // llama-3.1-70b returned 0.42 where the schema says 0-100.
    const r = normaliseVerdict(
      { integrity_score: 0.42, integrity_status: "flagged", integrity_flags: [], verified_skills: [] },
      "meta-llama/llama-3.1-70b-instruct"
    );
    expect(r.integrity_score).toBe(42);
  });

  test("treats a score of 70 as the pass boundary", () => {
    const r = normaliseVerdict(
      { integrity_score: 70, integrity_status: "flagged", integrity_flags: [], verified_skills: [] },
      "openai/gpt-4o-mini"
    );
    expect(r.integrity_status).toBe("verified");
  });

  test("clamps a score above the range", () => {
    const r = normaliseVerdict(
      { integrity_score: 480, integrity_status: "verified", integrity_flags: [], verified_skills: [] },
      "openai/gpt-4o-mini"
    );
    expect(r.integrity_score).toBe(100);
  });

  test("rejects a non-numeric score", () => {
    expect(() =>
      normaliseVerdict(
        { integrity_score: "high" as unknown as number, integrity_status: "verified", integrity_flags: [], verified_skills: [] },
        "openai/gpt-4o-mini"
      )
    ).toThrow(/numeric/i);
  });

  test("does not rescale a quirked model that already answers on 0-100", () => {
    const r = normaliseVerdict(
      { integrity_score: 50, integrity_status: "verified", integrity_flags: [], verified_skills: [] },
      "meta-llama/llama-3.1-70b-instruct"
    );
    expect(r.integrity_score).toBe(50);
    expect(r.integrity_status).toBe("flagged");
  });

  test("a quirked model's 1.0 means a perfect score, not one out of a hundred", () => {
    const r = normaliseVerdict(
      { integrity_score: 1, integrity_status: "flagged", integrity_flags: [], verified_skills: [] },
      "meta-llama/llama-3.1-70b-instruct"
    );
    expect(r.integrity_score).toBe(100);
  });

  test("clamps a score below the range", () => {
    const r = normaliseVerdict(
      { integrity_score: -10, integrity_status: "verified", integrity_flags: [], verified_skills: [] },
      "openai/gpt-4o-mini"
    );
    expect(r.integrity_score).toBe(0);
  });

  test("coerces malformed flag and skill fields to empty arrays", () => {
    const r = normaliseVerdict(
      {
        integrity_score: 90,
        integrity_status: "verified",
        integrity_flags: null as unknown as string[],
        verified_skills: undefined as unknown as string[],
      },
      "openai/gpt-4o-mini"
    );
    expect(r.integrity_flags).toEqual([]);
    expect(r.verified_skills).toEqual([]);
  });
});
