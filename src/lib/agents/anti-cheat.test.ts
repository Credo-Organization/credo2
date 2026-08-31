import { describe, test, expect } from "vitest";
import { auditUnavailableResult } from "./anti-cheat";

describe("anti-cheat failure mode", () => {
  test("does not report evidence as verified when the audit could not run", () => {
    expect(auditUnavailableResult().integrity_status).not.toBe("verified");
  });

  test("does not award a passing integrity score on failure", () => {
    expect(auditUnavailableResult().integrity_score).toBe(0);
  });

  test("records why the audit is missing", () => {
    expect(auditUnavailableResult().integrity_flags.join(" ")).toMatch(/unavailable/i);
  });

  test("claims no verified skills when nothing was examined", () => {
    expect(auditUnavailableResult().verified_skills).toEqual([]);
  });
});
