/**
 * Single source of truth for AI provider credentials.
 *
 * Three files previously carried the same live API key as an inline fallback
 * (`process.env.X || "sk-live-..."`). That key reached the public repository and
 * had to be rotated. A silent fallback is what made it seem reasonable: the code
 * kept working with no key configured, so nobody noticed the literal.
 *
 * This throws instead. A missing key is a configuration error and should look
 * like one, immediately, rather than quietly running on someone's credential.
 */
export interface AiCredentials {
  apiKey: string;
  baseURL: string;
}

const PLACEHOLDERS = new Set(["your-ai-api-key", "paste_your_key_here", "changeme", ""]);

export const DEFAULT_AI_BASE_URL = "https://aicredits.in/v1";

export function getAiCredentials(): AiCredentials {
  const apiKey =
    process.env.OPENROUTER_API_KEY?.trim() ||
    process.env.AICREDIT_API_KEY?.trim() ||
    "";

  if (!apiKey || PLACEHOLDERS.has(apiKey)) {
    throw new Error(
      "AI provider key is not configured. Set OPENROUTER_API_KEY (or AICREDIT_API_KEY) in your environment."
    );
  }

  const baseURL =
    process.env.AI_BASE_URL?.trim() ||
    process.env.OPENROUTER_BASE_URL?.trim() ||
    DEFAULT_AI_BASE_URL;

  return { apiKey, baseURL };
}
