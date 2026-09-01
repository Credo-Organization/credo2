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
