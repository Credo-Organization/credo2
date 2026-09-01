# Multi-Level Model Selection for Credify

**Date:** 2026-08-31
**Status:** Approved in principle, pending implementation
**Scope:** Next.js AI layer (`src/lib/ai/*`). Python backend keeps deterministic work only.

## Problem

Seven per-agent model slots exist in `src/lib/ai-client.ts`, none are configured,
and four default to `gemini-flash`. Provider billing confirms the result: one
model accounts for 95% of spend (Rs 84.53 of Rs 88.99). The same model that
extracts evidence also judges whether that evidence is fraudulent, with no
second opinion.

Anti-cheat is the load-bearing claim of the product. Until 2026-08-31 it had
never returned a real verdict: every call failed with HTTP 400 because
`verified_skills` was declared `.optional()`, which drops it from the strict
structured-output `required` set. The catch block then returned
`integrity_score: 100, integrity_status: "verified"`, so an outage was
indistinguishable from a pass. Both are now fixed; this spec builds on that.

## Decisions

| Decision | Choice |
|---|---|
| Routing model | Ensemble with majority voting |
| Ensemble scope | Anti-cheat verdict only; everything else single model with cascade |
| Verdict rule | Majority of 3; ties and insufficient responses resolve to `pending` |
| Location | Next.js. The Python `llm_client` is retired; nothing calls it on the verification path |

Rejected: an orchestrator LLM (adds a round-trip and a non-deterministic
decision that cannot be defended to a judge asking why a repo scored as it did)
and ensembling every call site (3x spend on calls where accuracy is irrelevant).

## Measured model capability

Probed against `https://aicredits.in/v1` on 2026-08-31 with the production
integrity schema. Full script: `scripts/probe-models.mjs`.

| Model | Strict JSON | Vision | JSON latency | Verdict on a known-fake repo |
|---|---|---|---|---|
| `openai/gpt-4o-mini` | yes | yes | 8.2s | flagged, score 20 |
| `google/gemini-2.0-flash` | yes | yes | 4.1s | flagged, score 0 |
| `deepseek/deepseek-chat` | yes | no | 4.6s | score 20, label wrong |
| `meta-llama/llama-3.1-70b-instruct` | yes | no | 41.4s | flagged, score 0.42 |
| `minimax/minimax-m2` | yes | no | 12.0s | flagged, 885 output tokens |
| `qwen/qwen-2.5-72b-instruct` | no | no | - | provider 500 |
| `anthropic/claude-3.5-haiku` | no | no | - | rate limited |
| `z-ai/glm-4.5` | no | no | - | timed out at 45s |
| `mistralai/mistral-nemo` | no | no | - | all upstream providers failed |

### Three findings that change the design

**Models disagree with themselves.** `deepseek-chat` returned three red flags
and a score of 20, then labelled the repo `verified`. The schema states
"verified if score >= 70, else flagged". The model's own label is therefore not
trustworthy input.

**Score scales vary.** `llama-3.1-70b` returned `0.42` where the schema
specifies 0-100. A naive threshold would read a genuine 0.85 as a fail.

**Concurrency triggers rate limits.** Probing five models by three calls
concurrently produced `Too Many Requests` from three providers. The ensemble has
the same shape: three models per repository, and a twenty-repo scan is sixty
concurrent calls.

## Panel

| Role | Model | Rationale |
|---|---|---|
| Vote 1 | `openai/gpt-4o-mini` | OpenAI |
| Vote 2 | `google/gemini-2.0-flash` | Google |
| Vote 3 | `deepseek/deepseek-chat` | DeepSeek |
| Certificate forensics | `google/gemini-2.0-flash` | fastest of the two models that accept images |
| Coach, roadmap | `google/gemini-2.0-flash` | user is waiting |
| Jobs, matching | `openai/gpt-4o-mini` | low stakes, high volume |

Three separate labs is the point. Correlated models fail together, so their
agreement carries no information. All three are cheap and answer in under nine
seconds, so three votes cost less than one frontier call.

## Architecture

Five modules under `src/lib/ai/`, each independently testable.

| Module | Responsibility | Depends on |
|---|---|---|
| `registry.ts` | Model id, capabilities, tier, cost rank, `reasoning` flag | nothing |
| `health.ts` | Circuit breaker; repeated failures mark a model unhealthy and it is skipped | nothing |
| `limiter.ts` | Bounded concurrency across all provider calls | nothing |
| `execute.ts` | One call: timeout, retry, cascade to next-strongest on failure | registry, health, limiter |
| `ensemble.ts` | Fan out to N models, normalise, vote | execute, registry |

`router.ts` maps a task profile to model(s). Task profiles are declarative:

```
ANTI_CHEAT_VERDICT: { mode: "ensemble", size: 3, needs: ["json_schema"] }
CERT_FORENSICS:     { mode: "single", needs: ["json_schema", "vision"] }
ROADMAP | COACH | JOBS: { mode: "single", tier: "fast", cascade: true }
```

## Normalisation, before any vote is counted

Applied to every model response:

1. Clamp `integrity_score` to a number. Reject non-numeric.
2. If the score is between 0 and 1 inclusive and the model is known to emit a
   0-1 scale, multiply by 100. Otherwise clamp to 0-100.
3. **Derive** `integrity_status` from the normalised score: `>= 70` is
   `verified`, below is `flagged`. The model's own label is discarded.

This turns `deepseek-chat`'s contradictory response into a correct one and
removes an entire class of incoherent verdicts.

## Voting

- Models run concurrently through `limiter.ts`, so latency is the slowest
  member rather than the sum, without exceeding provider limits.
- At least two successful responses are required. Fewer resolves to `pending`.
- Majority on the derived status wins. A tie resolves to `pending`.
- Final score is the median of the agreeing models. Flags are their union.
- `pending` is the existing state introduced when anti-cheat was made to fail
  closed. No new failure mode is added.

## Persistence

Add `audit_votes JSONB` to `evidence`. Each row records model id, normalised
score, derived status, flags, latency, and whether the call succeeded.

This makes the verdict auditable rather than asserted, and drives the UI line
"3 of 3 models independently flagged this repository", which is the visible
payoff of the whole design.

## Testing

Voting, normalisation, and health transitions are pure functions and are tested
without network access, following the TDD approach used for the security work
earlier today: a stub reproducing current behaviour first, so each test is seen
to fail for the right reason.

Cases: majority agreement; tie resolves to `pending`; fewer than two responses
resolves to `pending`; a 0-1 score is rescaled; a contradictory label is
overridden by the derived status; an unhealthy model is skipped; the limiter
never exceeds its cap.

## Non-goals

Ensembling any call site other than the anti-cheat verdict. Replacing the
provider. An orchestrator LLM. Vision on models that do not support it.

## Risks

| Risk | Mitigation |
|---|---|
| Rate limits under fan-out | `limiter.ts`; measured, not assumed |
| Model removed or degraded by the provider | `registry.ts` plus circuit breaker; `probe-models.mjs` re-run before demos |
| Ensemble cost on large accounts | Panel is three cheap models; anti-cheat is the only ensembled path |
| Provider returns 0-1 scores from a new model | Normalisation clamps rather than trusting |
