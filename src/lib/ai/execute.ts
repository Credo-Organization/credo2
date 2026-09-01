import { generateObject } from "ai";
import { z } from "zod";
import { aiProvider } from "@/lib/ai-client";
import { providerLimiter } from "./limiter";
import { modelHealth } from "./health";
import { normaliseVerdict, RawVerdict } from "./normalise";
import { ModelVote } from "./vote";

export const DEFAULT_TIMEOUT_MS = Number(process.env.AI_CALL_TIMEOUT_MS || 30_000);

/**
 * Runs one model and returns a vote. Never throws: a failed model is simply a
 * vote we do not have, and the tally decides what that means.
 */
export async function runOne<S extends z.ZodTypeAny>(
  modelId: string,
  schema: S,
  messages: unknown[],
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<ModelVote> {
  const started = Date.now();
  try {
    const object = await providerLimiter(async () => {
      // Promise.race only stops us waiting; the request keeps running and keeps
      // its concurrency slot until it settles on its own. Aborting actually
      // cancels it, so a slow provider cannot quietly shrink the effective cap.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const r = await generateObject<S, "object">({
          model: aiProvider.chat(modelId),
          schema,
          messages: messages as never,
          maxOutputTokens: 1024,
          abortSignal: controller.signal,
        });
        return r.object;
      } catch (err) {
        if (controller.signal.aborted) {
          throw new Error(`timeout after ${timeoutMs}ms`);
        }
        throw err;
      } finally {
        clearTimeout(timer);
      }
    });
    modelHealth.recordSuccess(modelId);
    return {
      model: modelId,
      ok: true,
      verdict: normaliseVerdict(object as RawVerdict, modelId),
      latencyMs: Date.now() - started,
    };
  } catch (e: unknown) {
    modelHealth.recordFailure(modelId);
    const msg = e instanceof Error ? e.message : String(e);
    return { model: modelId, ok: false, error: msg.slice(0, 200), latencyMs: Date.now() - started };
  }
}
