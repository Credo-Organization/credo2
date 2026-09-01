import { createOpenAI } from "@ai-sdk/openai";
import { getAiCredentials } from "@/lib/ai-config";

// 1. Universal AI Gateway. Credentials resolve through one helper so every
// consumer shares a base URL and a single key to rotate.
//
// Resolution is deferred to first use rather than module load. Resolving at
// import time meant a missing key threw while the module was being imported,
// which turns a configuration problem into a build/import crash and makes the
// module impossible to load in tests. Failing on first actual use keeps the
// error loud without making import a side effect.
let _provider: ReturnType<typeof createOpenAI> | null = null;

function getProvider() {
  if (!_provider) {
    const { apiKey, baseURL } = getAiCredentials();
    // `compatibility` is not in this SDK version's type but was being passed at
    // runtime before (the options object was cast to `any`). Kept as-is so
    // provider behaviour does not change as a side effect of this refactor.
    _provider = createOpenAI({ baseURL, apiKey, compatibility: "compatible" } as any);
  }
  return _provider;
}

/** Defers model construction so importing this module never needs credentials. */
function lazyModel(name: () => string) {
  let real: any = null;
  return new Proxy({} as any, {
    get(_t, prop) {
      if (!real) real = getProvider().chat(name());
      const v = Reflect.get(real, prop);
      return typeof v === "function" ? v.bind(real) : v;
    },
  });
}

export const aiProvider = new Proxy({} as ReturnType<typeof createOpenAI>, {
  get(_t, prop) {
    const p = getProvider() as any;
    const v = Reflect.get(p, prop);
    return typeof v === "function" ? v.bind(p) : v;
  },
});

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
export const extractorModel = lazyModel(() => EXTRACTOR_MODEL_NAME);
export const antiCheatModel = lazyModel(() => ANTICHEAT_MODEL_NAME);
export const coachModel = lazyModel(() => COACH_MODEL_NAME);
export const matcherModel = lazyModel(() => MATCHER_MODEL_NAME);
export const roadmapModel = lazyModel(() => ROADMAP_MODEL_NAME);
export const multimodalModel = lazyModel(() => process.env.MULTIMODAL_AI_MODEL || "google/gemini-flash-latest");

// Standard backward-compatible model defaults
export const aiModel = lazyModel(() => DEFAULT_MODEL_NAME);

/**
 * Dynamic helper to retrieve an instantiated AI model with safe fallback.
 */
export function getModel(modelSlug?: string) {
  if (!modelSlug) return aiModel;
  return lazyModel(() => modelSlug);
}
