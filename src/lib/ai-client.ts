import { createOpenAI } from "@ai-sdk/openai";

// 1. Initialize the Universal AI Gateway (AICredits / OpenRouter)
const baseURL = process.env.AI_BASE_URL || process.env.OPENROUTER_BASE_URL || "https://aicredits.in/v1";
const apiKey = process.env.OPENROUTER_API_KEY || process.env.AICREDIT_API_KEY || "";

const providerOptions: any = {
  baseURL,
  apiKey,
  compatibility: "compatible",
};

export const aiProvider = createOpenAI(providerOptions);

// 2. High-Performance, Cost-Effective Task-Specialized Models
// Strategy:
// - Gemini Flash (google/gemini-flash-latest): Sub-second structured JSON, multi-modal evidence extraction.
// - GPT-4o-mini (openai/gpt-4o-mini): Ultra-fast deterministic anti-cheat heuristics & recruiter matching.
// - DeepSeek / Claude / Gemini: Deep reasoning for career coaching & custom gap analysis.

export const EXTRACTOR_MODEL_NAME = process.env.EXTRACTOR_AI_MODEL || "google/gemini-flash-latest";
export const ANTICHEAT_MODEL_NAME = process.env.ANTICHEAT_AI_MODEL || "openai/gpt-4o-mini";
export const COACH_MODEL_NAME = process.env.COACH_AI_MODEL || "google/gemini-flash-latest";
export const MATCHER_MODEL_NAME = process.env.MATCHER_AI_MODEL || "openai/gpt-4o-mini";
export const ROADMAP_MODEL_NAME = process.env.ROADMAP_AI_MODEL || "google/gemini-flash-latest";
export const DEFAULT_MODEL_NAME = process.env.DEFAULT_AI_MODEL || "openai/gpt-4o-mini";

// 3. Exported Model Instances for Direct Use (Standardized on chat completions for universal multi-model proxy support)
export const extractorModel = aiProvider.chat(EXTRACTOR_MODEL_NAME);
export const antiCheatModel = aiProvider.chat(ANTICHEAT_MODEL_NAME);
export const coachModel = aiProvider.chat(COACH_MODEL_NAME);
export const matcherModel = aiProvider.chat(MATCHER_MODEL_NAME);
export const roadmapModel = aiProvider.chat(ROADMAP_MODEL_NAME);
export const multimodalModel = aiProvider.chat(process.env.MULTIMODAL_AI_MODEL || "google/gemini-flash-latest");

// Standard backward-compatible model defaults
export const aiModel = aiProvider.chat(DEFAULT_MODEL_NAME);

/**
 * Dynamic helper to retrieve an instantiated AI model with safe fallback.
 */
export function getModel(modelSlug?: string) {
  if (!modelSlug) return aiModel;
  return aiProvider.chat(modelSlug);
}
