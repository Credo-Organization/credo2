import { describe, test, expect } from "vitest";
import { MODELS, modelsWith, getModel } from "./registry";

describe("model registry", () => {
  test("every registered model declares its capabilities", () => {
    for (const m of MODELS) {
      expect(typeof m.id).toBe("string");
      expect(Array.isArray(m.capabilities)).toBe(true);
    }
  });

  test("finds models that support strict json schema", () => {
    const ids = modelsWith(["json_schema"]).map((m) => m.id);
    expect(ids).toContain("openai/gpt-4o-mini");
    expect(ids).toContain("google/gemini-2.0-flash");
    expect(ids).toContain("deepseek/deepseek-chat");
  });

  test("deepseek is excluded from vision work", () => {
    const ids = modelsWith(["vision"]).map((m) => m.id);
    expect(ids).not.toContain("deepseek/deepseek-chat");
  });

  test("looks a model up by id", () => {
    expect(getModel("openai/gpt-4o-mini")?.tier).toBe("fast");
  });

  test("returns undefined for an unknown model", () => {
    expect(getModel("nope/not-real")).toBeUndefined();
  });

  test("model ids are unique, since the panel dedupes on them", () => {
    expect(new Set(MODELS.map((m) => m.id)).size).toBe(MODELS.length);
  });
});
