import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { getAiCredentials } from "./ai-config";

const saved = { ...process.env };
afterEach(() => { process.env = { ...saved }; });
beforeEach(() => {
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.AICREDIT_API_KEY;
  delete process.env.AI_BASE_URL;
});

describe("AI credential resolution", () => {
  test("throws instead of falling back to a baked-in key", () => {
    expect(() => getAiCredentials()).toThrow(/not configured/i);
  });

  test("never returns a hardcoded sk-live literal", () => {
    process.env.OPENROUTER_API_KEY = "sk-live-fromenv";
    expect(getAiCredentials().apiKey).toBe("sk-live-fromenv");
  });

  test("accepts the legacy AICREDIT_API_KEY name", () => {
    process.env.AICREDIT_API_KEY = "sk-live-legacy";
    expect(getAiCredentials().apiKey).toBe("sk-live-legacy");
  });

  test("prefers OPENROUTER_API_KEY when both are set", () => {
    process.env.AICREDIT_API_KEY = "sk-live-legacy";
    process.env.OPENROUTER_API_KEY = "sk-live-primary";
    expect(getAiCredentials().apiKey).toBe("sk-live-primary");
  });

  test("every consumer resolves one identical base URL", () => {
    process.env.OPENROUTER_API_KEY = "k";
    process.env.AI_BASE_URL = "https://aicredits.in/v1";
    expect(getAiCredentials().baseURL).toBe("https://aicredits.in/v1");
  });

  test("rejects a placeholder key left in an env file", () => {
    process.env.OPENROUTER_API_KEY = "your-ai-api-key";
    expect(() => getAiCredentials()).toThrow(/not configured/i);
  });
});
