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

  test("holds the cap when callers re-enter as soon as their previous call resolves", async () => {
    // The regression that shipped: release() freed the slot and a new caller
    // claimed it before the dequeued waiter resumed, so both ran.
    const limit = createLimiter(2);
    let running = 0;
    let peak = 0;

    const chain = async () => {
      for (let i = 0; i < 4; i++) {
        await limit(async () => {
          running++;
          peak = Math.max(peak, running);
          await defer(5);
          running--;
        });
      }
    };

    await Promise.all(Array.from({ length: 6 }, chain));
    expect(peak).toBeLessThanOrEqual(2);
  });

  test("rejects a cap that would deadlock every call", () => {
    expect(() => createLimiter(0)).toThrow(/positive integer/i);
    expect(() => createLimiter(-1)).toThrow(/positive integer/i);
  });

  test("rejects a cap that would disable limiting entirely", () => {
    expect(() => createLimiter(NaN)).toThrow(/positive integer/i);
  });
});
