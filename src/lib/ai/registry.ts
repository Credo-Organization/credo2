export type Capability = "json_schema" | "vision";
export type Tier = "fast" | "strong";

export interface ModelSpec {
  id: string;
  capabilities: Capability[];
  tier: Tier;
  /** Lower is cheaper. Orders cascade fallbacks and panel selection. */
  costRank: number;
  /** Some models answer 0-1 where the schema says 0-100. Measured, not assumed. */
  scaleQuirk?: "zero-to-one";
}

// Populated from scripts/probe-models.mjs against aicredits.in on 2026-08-31.
// Models that failed the probe are deliberately absent: qwen-2.5-72b (provider
// 500), claude-3.5-haiku (rate limited), glm-4.5 and mistral-nemo (no strict
// JSON), minimax-m2 (885 output tokens per verdict).
export const MODELS: readonly ModelSpec[] = [
  { id: "google/gemini-2.0-flash", capabilities: ["json_schema", "vision"], tier: "fast", costRank: 1 },
  { id: "openai/gpt-4o-mini", capabilities: ["json_schema", "vision"], tier: "fast", costRank: 2 },
  { id: "deepseek/deepseek-chat", capabilities: ["json_schema"], tier: "fast", costRank: 3 },
  { id: "meta-llama/llama-3.1-70b-instruct", capabilities: ["json_schema"], tier: "strong", costRank: 6, scaleQuirk: "zero-to-one" },
];

export function modelsWith(needs: Capability[]): ModelSpec[] {
  return MODELS.filter((m) => needs.every((n) => m.capabilities.includes(n)));
}

export function getModel(id: string): ModelSpec | undefined {
  return MODELS.find((m) => m.id === id);
}
