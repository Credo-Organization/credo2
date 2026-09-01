# Multi-Level Model Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route each AI task to an appropriate model, and decide the anti-cheat verdict by majority vote across three models from three different labs.

**Architecture:** Seven small modules under `src/lib/ai/`. A registry declares model capabilities; a limiter bounds concurrency so fan-out does not trip provider rate limits; execute runs one call with timeout; vote tallies results. Model-supplied status labels are discarded and derived from a normalised score, because two of nine probed models contradicted the schema.

**Tech Stack:** TypeScript, Vitest, Vercel AI SDK (`ai@7`), `@ai-sdk/openai`, Supabase.

**Spec:** `docs/superpowers/specs/2026-08-31-multi-model-ensemble-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/ai/registry.ts` | Model ids, capabilities, tier, cost rank, score-scale quirk |
| `src/lib/ai/normalise.ts` | Clamp score, rescale 0-1 responses, derive status |
| `src/lib/ai/limiter.ts` | Bounded-concurrency gate shared by all provider calls |
| `src/lib/ai/health.ts` | Circuit breaker: mark unhealthy, skip, recover |
| `src/lib/ai/vote.ts` | Tally votes into one verdict |
| `src/lib/ai/profiles.ts` | Declarative task to model policy |
| `src/lib/ai/execute.ts` | One model call: limiter, timeout, health accounting |
| `src/lib/ai/ensemble.ts` | Fan out, combine, report agreement |
| `scripts/add-audit-votes.sql` | Adds `evidence.audit_votes` |

Tasks 1 to 5 are pure logic with no network access. Task 6 wires the provider. Tasks 7 to 10 change callers, UI, and config.

---

## Task 1: Model registry

**Files:**
- Create: `src/lib/ai/registry.ts`
- Test: `src/lib/ai/registry.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/registry.test.ts`
Expected: FAIL with `Cannot find module './registry'`

- [ ] **Step 3: Write minimal implementation**

```typescript
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
export const MODELS: ModelSpec[] = [
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/registry.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/registry.ts src/lib/ai/registry.test.ts
git commit -m "feat(ai): model registry populated from capability probe"
```

---

## Task 2: Response normalisation

**Files:**
- Create: `src/lib/ai/normalise.ts`
- Test: `src/lib/ai/normalise.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/normalise.test.ts`
Expected: FAIL with `Cannot find module './normalise'`

- [ ] **Step 3: Write minimal implementation**

```typescript
import { getModel } from "./registry";

export const PASS_THRESHOLD = 70;

export interface RawVerdict {
  integrity_score: number;
  integrity_status: string;
  integrity_flags: string[];
  verified_skills: string[];
}

export interface NormalisedVerdict {
  integrity_score: number;
  integrity_status: "verified" | "flagged";
  integrity_flags: string[];
  verified_skills: string[];
}

/**
 * Two of nine probed models mishandled the schema: one contradicted its own
 * score with its label, another answered on a 0-1 scale. The model's label is
 * therefore discarded and the status derived from a normalised score.
 */
export function normaliseVerdict(raw: RawVerdict, modelId: string): NormalisedVerdict {
  if (typeof raw.integrity_score !== "number" || Number.isNaN(raw.integrity_score)) {
    throw new Error(`Model ${modelId} returned a non-numeric integrity_score`);
  }

  let score = raw.integrity_score;
  const spec = getModel(modelId);
  if (spec?.scaleQuirk === "zero-to-one" && score >= 0 && score <= 1) {
    score = score * 100;
  }
  score = Math.max(0, Math.min(100, score));

  return {
    integrity_score: score,
    integrity_status: score >= PASS_THRESHOLD ? "verified" : "flagged",
    integrity_flags: Array.isArray(raw.integrity_flags) ? raw.integrity_flags : [],
    verified_skills: Array.isArray(raw.verified_skills) ? raw.verified_skills : [],
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/normalise.test.ts src/lib/ai/registry.test.ts`
Expected: PASS, 10 tests total

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/normalise.ts src/lib/ai/normalise.test.ts
git commit -m "feat(ai): derive verdict status from a normalised score"
```

---

## Task 3: Concurrency limiter

**Files:**
- Create: `src/lib/ai/limiter.ts`
- Test: `src/lib/ai/limiter.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, test, expect } from "vitest";
import { createLimiter } from "./limiter";

const defer = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("bounded concurrency", () => {
  test("never runs more than the cap at once", async () => {
    const limit = createLimiter(2);
    let running = 0;
    let peak = 0;

    await Promise.all(
      Array.from({ length: 8 }, () =>
        limit(async () => {
          running++;
          peak = Math.max(peak, running);
          await defer(10);
          running--;
        })
      )
    );

    expect(peak).toBeLessThanOrEqual(2);
  });

  test("runs every queued task", async () => {
    const limit = createLimiter(2);
    const done: number[] = [];
    await Promise.all(Array.from({ length: 5 }, (_, i) => limit(async () => { done.push(i); })));
    expect(done).toHaveLength(5);
  });

  test("a rejected task frees its slot", async () => {
    const limit = createLimiter(1);
    await expect(limit(async () => { throw new Error("boom"); })).rejects.toThrow("boom");
    await expect(limit(async () => "after")).resolves.toBe("after");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/limiter.test.ts`
Expected: FAIL with `Cannot find module './limiter'`

- [ ] **Step 3: Write minimal implementation**

```typescript
/**
 * Probing five models by three calls concurrently drew Too Many Requests from
 * three providers. The ensemble has that shape by design, three models per
 * repository, so every provider call passes through a shared gate.
 */
export function createLimiter(maxConcurrent: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const release = () => {
    active--;
    queue.shift()?.();
  };

  return async function limit<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= maxConcurrent) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }
    active++;
    try {
      return await fn();
    } finally {
      release();
    }
  };
}

export const providerLimiter = createLimiter(Number(process.env.AI_MAX_CONCURRENCY || 4));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/limiter.test.ts`
Expected: PASS, 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/limiter.ts src/lib/ai/limiter.test.ts
git commit -m "feat(ai): bounded concurrency for provider calls"
```

---

## Task 4: Circuit breaker

**Files:**
- Create: `src/lib/ai/health.ts`
- Test: `src/lib/ai/health.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, test, expect, beforeEach } from "vitest";
import { createHealthTracker } from "./health";

describe("model health", () => {
  let health: ReturnType<typeof createHealthTracker>;
  beforeEach(() => { health = createHealthTracker({ threshold: 3, cooldownMs: 1000 }); });

  test("a fresh model is healthy", () => {
    expect(health.isHealthy("a")).toBe(true);
  });

  test("stays healthy below the failure threshold", () => {
    health.recordFailure("a");
    health.recordFailure("a");
    expect(health.isHealthy("a")).toBe(true);
  });

  test("opens the circuit at the threshold", () => {
    health.recordFailure("a");
    health.recordFailure("a");
    health.recordFailure("a");
    expect(health.isHealthy("a")).toBe(false);
  });

  test("a success clears accumulated failures", () => {
    health.recordFailure("a");
    health.recordFailure("a");
    health.recordSuccess("a");
    health.recordFailure("a");
    expect(health.isHealthy("a")).toBe(true);
  });

  test("failures are tracked per model", () => {
    health.recordFailure("a");
    health.recordFailure("a");
    health.recordFailure("a");
    expect(health.isHealthy("b")).toBe(true);
  });

  test("recovers once the cooldown has elapsed", () => {
    let now = 0;
    const h = createHealthTracker({ threshold: 1, cooldownMs: 500, now: () => now });
    h.recordFailure("a");
    expect(h.isHealthy("a")).toBe(false);
    now = 600;
    expect(h.isHealthy("a")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/health.test.ts`
Expected: FAIL with `Cannot find module './health'`

- [ ] **Step 3: Write minimal implementation**

```typescript
interface HealthOptions {
  threshold: number;
  cooldownMs: number;
  /** Injected so cooldown behaviour is testable without waiting. */
  now?: () => number;
}

/**
 * Skips a model that keeps failing instead of paying its timeout on every call.
 * Without this a dead model costs the ensemble one full timeout per repository.
 */
export function createHealthTracker(opts: HealthOptions) {
  const now = opts.now ?? (() => Date.now());
  const failures = new Map<string, number>();
  const openedAt = new Map<string, number>();

  return {
    isHealthy(id: string): boolean {
      const opened = openedAt.get(id);
      if (opened === undefined) return true;
      if (now() - opened >= opts.cooldownMs) {
        openedAt.delete(id);
        failures.delete(id);
        return true;
      }
      return false;
    },
    recordFailure(id: string): void {
      const n = (failures.get(id) ?? 0) + 1;
      failures.set(id, n);
      if (n >= opts.threshold) openedAt.set(id, now());
    },
    recordSuccess(id: string): void {
      failures.delete(id);
      openedAt.delete(id);
    },
  };
}

export const modelHealth = createHealthTracker({ threshold: 3, cooldownMs: 60_000 });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/health.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/health.ts src/lib/ai/health.test.ts
git commit -m "feat(ai): circuit breaker skips repeatedly failing models"
```

---

## Task 5: Voting

**Files:**
- Create: `src/lib/ai/vote.ts`
- Test: `src/lib/ai/vote.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, test, expect } from "vitest";
import { tallyVotes, ModelVote } from "./vote";

const vote = (model: string, score: number, flags: string[] = []): ModelVote => ({
  model,
  ok: true,
  verdict: {
    integrity_score: score,
    integrity_status: score >= 70 ? "verified" : "flagged",
    integrity_flags: flags,
    verified_skills: [],
  },
  latencyMs: 100,
});

const failed = (model: string): ModelVote => ({ model, ok: false, error: "timeout", latencyMs: 45000 });

describe("vote tally", () => {
  test("two of three flagging carries the verdict", () => {
    const r = tallyVotes([vote("a", 10, ["fork"]), vote("b", 20, ["no commits"]), vote("c", 90)]);
    expect(r.integrity_status).toBe("flagged");
  });

  test("uses the median score of the agreeing models", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 30), vote("c", 90)]);
    expect(r.integrity_score).toBe(20);
  });

  test("unions the flags of the agreeing models", () => {
    const r = tallyVotes([vote("a", 10, ["fork"]), vote("b", 20, ["fork", "template readme"]), vote("c", 90)]);
    expect(r.integrity_flags.sort()).toEqual(["fork", "template readme"]);
  });

  test("a tie resolves to pending rather than guessing", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 90)]);
    expect(r.integrity_status).toBe("pending");
  });

  test("fewer than two responses cannot decide anything", () => {
    const r = tallyVotes([vote("a", 10), failed("b"), failed("c")]);
    expect(r.integrity_status).toBe("pending");
  });

  test("no responses at all resolves to pending", () => {
    const r = tallyVotes([failed("a"), failed("b"), failed("c")]);
    expect(r.integrity_status).toBe("pending");
    expect(r.integrity_score).toBe(0);
  });

  test("keeps every individual vote for the audit trail", () => {
    const r = tallyVotes([vote("a", 10), vote("b", 20), failed("c")]);
    expect(r.votes).toHaveLength(3);
    expect(r.votes.filter((v) => v.ok)).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/vote.test.ts`
Expected: FAIL with `Cannot find module './vote'`

- [ ] **Step 3: Write minimal implementation**

```typescript
import { NormalisedVerdict } from "./normalise";

export interface ModelVote {
  model: string;
  ok: boolean;
  verdict?: NormalisedVerdict;
  error?: string;
  latencyMs: number;
}

export interface EnsembleVerdict {
  integrity_score: number;
  integrity_status: "verified" | "flagged" | "pending";
  integrity_flags: string[];
  verified_skills: string[];
  votes: ModelVote[];
}

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

const pending = (votes: ModelVote[]): EnsembleVerdict => ({
  integrity_score: 0,
  integrity_status: "pending",
  integrity_flags: ["audit_inconclusive: models did not reach a majority"],
  verified_skills: [],
  votes,
});

/**
 * Majority wins. A tie, or fewer than two usable responses, resolves to pending
 * rather than guessing. Pending is the same state anti-cheat already uses when
 * an audit cannot run, so no new failure mode is introduced.
 */
export function tallyVotes(votes: ModelVote[]): EnsembleVerdict {
  const usable = votes.filter((v) => v.ok && v.verdict);
  if (usable.length < 2) return pending(votes);

  const flagged = usable.filter((v) => v.verdict!.integrity_status === "flagged");
  const verified = usable.filter((v) => v.verdict!.integrity_status === "verified");
  if (flagged.length === verified.length) return pending(votes);

  const winners = flagged.length > verified.length ? flagged : verified;
  const status = flagged.length > verified.length ? "flagged" : "verified";

  return {
    integrity_score: median(winners.map((v) => v.verdict!.integrity_score)),
    integrity_status: status,
    integrity_flags: [...new Set(winners.flatMap((v) => v.verdict!.integrity_flags))],
    verified_skills: [...new Set(winners.flatMap((v) => v.verdict!.verified_skills))],
    votes,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/vote.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/vote.ts src/lib/ai/vote.test.ts
git commit -m "feat(ai): majority voting with pending on ties"
```

---

## Task 6: Task profiles

**Files:**
- Create: `src/lib/ai/profiles.ts`
- Test: `src/lib/ai/profiles.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, test, expect } from "vitest";
import { PROFILES, resolveModels } from "./profiles";

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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/profiles.test.ts`
Expected: FAIL with `Cannot find module './profiles'`

- [ ] **Step 3: Write minimal implementation**

```typescript
import { Capability, modelsWith } from "./registry";
import { modelHealth } from "./health";

export interface Profile {
  mode: "single" | "ensemble";
  needs: Capability[];
  size?: number;
  cascade?: boolean;
}

export const PROFILES: Record<string, Profile> = {
  ANTI_CHEAT_VERDICT: { mode: "ensemble", needs: ["json_schema"], size: 3 },
  CERT_FORENSICS: { mode: "single", needs: ["json_schema", "vision"], cascade: true },
  COACH: { mode: "single", needs: [], cascade: true },
  ROADMAP: { mode: "single", needs: ["json_schema"], cascade: true },
  JOBS: { mode: "single", needs: ["json_schema"], cascade: true },
};

/**
 * Picks cheapest-first among healthy models that meet the profile's needs.
 * For an ensemble it takes at most one model per vendor, because correlated
 * models fail together and their agreement would carry no information.
 */
export function resolveModels(name: string): string[] {
  const p = PROFILES[name];
  if (!p) throw new Error(`Unknown task profile: ${name}`);

  const eligible = modelsWith(p.needs)
    .filter((m) => modelHealth.isHealthy(m.id))
    .sort((a, b) => a.costRank - b.costRank);

  if (p.mode === "single") return eligible.slice(0, 1).map((m) => m.id);

  const seen = new Set<string>();
  const panel: string[] = [];
  for (const m of eligible) {
    const vendor = m.id.split("/")[0];
    if (seen.has(vendor)) continue;
    seen.add(vendor);
    panel.push(m.id);
    if (panel.length === (p.size ?? 3)) break;
  }
  return panel;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/profiles.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/profiles.ts src/lib/ai/profiles.test.ts
git commit -m "feat(ai): declarative task profiles with vendor-diverse panels"
```

---

## Task 7: Single-model execution

**Files:**
- Create: `src/lib/ai/execute.ts`

- [ ] **Step 1: Write the implementation**

There is no unit test here. This module is a thin wrapper over the network and
is exercised by the manual verification at the end of the plan. All decision
logic it depends on is already covered by Tasks 2 to 5.

```typescript
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
    const object = await providerLimiter(() =>
      Promise.race([
        generateObject({
          model: aiProvider.chat(modelId),
          schema,
          messages: messages as never,
          maxOutputTokens: 1024,
        }).then((r) => r.object),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs)
        ),
      ])
    );
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: exits 0

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai/execute.ts
git commit -m "feat(ai): single-model execution with timeout and health accounting"
```

---

## Task 8: Ensemble entry point

**Files:**
- Create: `src/lib/ai/ensemble.ts`
- Test: `src/lib/ai/ensemble.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, test, expect } from "vitest";
import { combine } from "./ensemble";
import { ModelVote } from "./vote";

const v = (model: string, score: number): ModelVote => ({
  model,
  ok: true,
  latencyMs: 10,
  verdict: {
    integrity_score: score,
    integrity_status: score >= 70 ? "verified" : "flagged",
    integrity_flags: [],
    verified_skills: [],
  },
});

describe("ensemble combination", () => {
  test("reports how many models agreed, for the audit trail", () => {
    const r = combine([v("a", 10), v("b", 20), v("c", 90)]);
    expect(r.agreement).toBe("2/3");
  });

  test("counts only responding models in the denominator", () => {
    const r = combine([v("a", 10), v("b", 20), { model: "c", ok: false, error: "timeout", latencyMs: 30000 }]);
    expect(r.agreement).toBe("2/2");
  });

  test("carries the verdict through unchanged", () => {
    expect(combine([v("a", 10), v("b", 20), v("c", 90)]).integrity_status).toBe("flagged");
  });

  test("reports no agreement when nothing responded", () => {
    const r = combine([{ model: "a", ok: false, error: "timeout", latencyMs: 1 }]);
    expect(r.agreement).toBe("0/0");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai/ensemble.test.ts`
Expected: FAIL with `Cannot find module './ensemble'`

- [ ] **Step 3: Write minimal implementation**

```typescript
import { z } from "zod";
import { resolveModels } from "./profiles";
import { runOne } from "./execute";
import { tallyVotes, ModelVote, EnsembleVerdict } from "./vote";

export interface EnsembleResult extends EnsembleVerdict {
  /** e.g. "3/3": how many responding models backed the winning verdict. */
  agreement: string;
}

export function combine(votes: ModelVote[]): EnsembleResult {
  const tallied = tallyVotes(votes);
  const responded = votes.filter((v) => v.ok && v.verdict);
  const agreeing = responded.filter((v) => v.verdict!.integrity_status === tallied.integrity_status);
  return { ...tallied, agreement: `${agreeing.length}/${responded.length}` };
}

/**
 * Fans out to the profile's panel concurrently. The limiter keeps that within
 * provider rate limits, so latency is the slowest member rather than the sum.
 */
export async function runEnsemble<S extends z.ZodTypeAny>(
  profile: string,
  schema: S,
  messages: unknown[]
): Promise<EnsembleResult> {
  const panel = resolveModels(profile);
  const votes = await Promise.all(panel.map((id) => runOne(id, schema, messages)));
  return combine(votes);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai/ && npx tsc --noEmit`
Expected: PASS, all `src/lib/ai` tests; tsc exits 0

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/ensemble.ts src/lib/ai/ensemble.test.ts
git commit -m "feat(ai): ensemble fan-out with agreement reporting"
```

---

## Task 9: Persist the votes and use the ensemble

**Files:**
- Create: `scripts/add-audit-votes.sql`
- Modify: `src/lib/agents/anti-cheat.ts`
- Modify: `src/actions/github.ts`

- [ ] **Step 1: Write the migration**

```sql
-- scripts/add-audit-votes.sql
-- Stores each model's individual verdict so a flag is auditable rather than
-- asserted. Drives the "3 of 3 models flagged this" line in the audit console.
ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS audit_votes JSONB;

COMMENT ON COLUMN public.evidence.audit_votes IS
  'Per-model ensemble votes: model id, normalised score, derived status, flags, latency, ok.';
```

- [ ] **Step 2: Widen the result type in `src/lib/agents/anti-cheat.ts`**

Replace the existing `IntegrityResult` type with:

```typescript
export type IntegrityResult = Omit<z.infer<typeof integritySchema>, "integrity_status"> & {
  integrity_status: "verified" | "flagged" | "pending";
  audit_votes?: unknown[];
  agreement?: string;
};
```

- [ ] **Step 3: Route the github branch through the ensemble**

Add the import at the top of `src/lib/agents/anti-cheat.ts`:

```typescript
import { runEnsemble } from "@/lib/ai/ensemble";
```

In `evaluateEvidenceIntegrity`, replace the single `generateObject` call for the
`github` case with:

```typescript
    if (type === "github") {
      const result = await runEnsemble("ANTI_CHEAT_VERDICT", integritySchema, messages);
      return {
        integrity_score: result.integrity_score,
        integrity_status: result.integrity_status,
        integrity_flags: result.integrity_flags,
        verified_skills: Array.from(new Set([...result.verified_skills, ...verifiedSkills])),
        audit_votes: result.votes,
        agreement: result.agreement,
      };
    }
```

Leave the `certificate` branch on the existing single-model path. Certificate
forensics needs vision, and only two registry models support it, so it cannot
form a three-vendor panel.

- [ ] **Step 4: Persist the votes in `src/actions/github.ts`**

In the `evidence` insert that already sets `integrity_status`, add:

```typescript
          audit_votes: integrityData.audit_votes ?? null,
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm test`
Expected: tsc exits 0; all tests pass

- [ ] **Step 6: Commit**

```bash
git add scripts/add-audit-votes.sql src/lib/agents/anti-cheat.ts src/actions/github.ts
git commit -m "feat(ai): decide the anti-cheat verdict by ensemble vote"
```

---

## Task 10: Surface agreement, configure, document

**Files:**
- Modify: `src/app/(dashboard)/dashboard/page.tsx`
- Modify: `src/components/dashboard/audit-breakdown-panel.tsx`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Carry agreement through the dashboard mapping**

In `src/app/(dashboard)/dashboard/page.tsx`, inside the `repoItems` map, add
this property alongside `integrity_status`:

```typescript
          agreement: Array.isArray(r.audit_votes)
            ? `${(r.audit_votes as { ok: boolean; verdict?: { integrity_status: string } }[])
                .filter((v) => v.ok && v.verdict?.integrity_status === r.integrity_status).length}/${
                (r.audit_votes as { ok: boolean }[]).filter((v) => v.ok).length}`
            : undefined,
```

- [ ] **Step 2: Add the field to the panel type**

In `src/components/dashboard/audit-breakdown-panel.tsx`, add to the `RepoItem`
interface:

```typescript
  agreement?: string;
```

- [ ] **Step 3: Render it beside the integrity badge**

Inside the repo card, immediately after the element showing integrity status:

```tsx
{repo.agreement && (
  <span className="text-[10px] font-mono text-muted-foreground">
    {repo.agreement} models agreed
  </span>
)}
```

- [ ] **Step 4: Document configuration**

Append to `.env.example`:

```
# Maximum concurrent provider calls. The ensemble fans out three models per
# repository; probing without a cap drew Too Many Requests from three providers.
AI_MAX_CONCURRENCY=4

# Per-call timeout before a model counts as a non-responder.
AI_CALL_TIMEOUT_MS=30000
```

- [ ] **Step 5: Document the ensemble**

Add to the key features list in `README.md`:

```markdown
* **Multi-Model Anti-Cheat Ensemble**: Repository integrity is decided by majority
  vote across three models from three different labs (`openai/gpt-4o-mini`,
  `google/gemini-2.0-flash`, `deepseek/deepseek-chat`). Model-supplied status
  labels are discarded and derived from a normalised score, because probing found
  models that contradicted their own scores. A tie, or fewer than two responses,
  resolves to `pending` rather than guessing. Every individual vote is stored on
  the evidence row.
```

- [ ] **Step 6: Verify the whole suite**

Run: `npm test && npx tsc --noEmit && npx eslint src/lib/ai`
Expected: all tests pass; tsc exits 0; eslint exits 0

- [ ] **Step 7: Commit**

```bash
git add "src/app/(dashboard)/dashboard/page.tsx" src/components/dashboard/audit-breakdown-panel.tsx .env.example README.md
git commit -m "feat(ui): show model agreement, document ensemble configuration"
```

---

## Manual verification after implementation

1. Apply `scripts/add-audit-votes.sql` in the Supabase SQL editor.
2. Set `AI_MAX_CONCURRENCY` and `AI_CALL_TIMEOUT_MS` locally and in Vercel.
3. Connect a GitHub account containing a fork with no commits.
4. Open the GitProof audit console. The fork should read `flagged` with an
   agreement figure such as `3/3`.
5. Query one evidence row and confirm `audit_votes` holds three entries with
   distinct model ids and per-model latencies.
6. Re-run `node scripts/probe-models.mjs` before any demo. Providers remove and
   degrade models without notice, and the registry is only as current as its
   last probe.
