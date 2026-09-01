import { describe, test, expect } from "vitest";
import { PROFILES, resolveModels } from "./profiles";

const allHealthy = { isHealthy: () => true };
const unhealthy = (...ids: string[]) => ({ isHealthy: (id: string) => !ids.includes(id) });

describe("task profiles", () => {
  test("the anti-cheat verdict draws three models", () => {
    expect(resolveModels("ANTI_CHEAT_VERDICT")).toHaveLength(3);
  });

  test("the anti-cheat panel spans three different vendors", () => {
    const vendors = new Set(resolveModels("ANTI_CHEAT_VERDICT").map((id) => id.split("/")[0]));
    expect(vendors.size).toBe(3);
  });

  test("certificate forensics only selects vision-capable models", () => {
    expect(resolveModels("CERT_FORENSICS")).not.toContain("deepseek/deepseek-chat");
  });

  test("single-model profiles resolve to exactly one model", () => {
    expect(resolveModels("COACH")).toHaveLength(1);
  });

  test("an unknown profile is a programming error", () => {
    expect(() => resolveModels("NOT_A_PROFILE")).toThrow(/unknown task profile/i);
  });

  test("every profile declares a mode", () => {
    for (const p of Object.values(PROFILES)) {
      expect(["single", "ensemble"]).toContain(p.mode);
    }
  });

  test("drops an unhealthy model from the panel", () => {
    const panel = resolveModels("ANTI_CHEAT_VERDICT", unhealthy("google/gemini-2.0-flash"));
    expect(panel).not.toContain("google/gemini-2.0-flash");
  });

  test("still fields a panel when one vendor is unhealthy", () => {
    const panel = resolveModels("ANTI_CHEAT_VERDICT", unhealthy("google/gemini-2.0-flash"));
    expect(panel.length).toBeGreaterThanOrEqual(2);
  });

  test("refuses a panel that cannot reach a majority", () => {
    const health = unhealthy(
      "google/gemini-2.0-flash",
      "openai/gpt-4o-mini",
      "deepseek/deepseek-chat"
    );
    expect(() => resolveModels("ANTI_CHEAT_VERDICT", health)).toThrow(/at least 2 healthy models/i);
  });

  test("uses the shared tracker by default", () => {
    expect(resolveModels("ANTI_CHEAT_VERDICT")).toHaveLength(3);
    expect(resolveModels("ANTI_CHEAT_VERDICT", allHealthy)).toHaveLength(3);
  });
});
