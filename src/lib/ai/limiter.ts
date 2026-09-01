/**
 * Probing five models by three calls concurrently drew Too Many Requests from
 * three providers. The ensemble has that shape by design, three models per
 * repository, so every provider call passes through a shared gate.
 */
export function createLimiter(maxConcurrent: number) {
  if (!Number.isFinite(maxConcurrent) || maxConcurrent < 1) {
    // Failing loudly beats the alternatives: a cap of 0 deadlocks every call
    // forever, and NaN disables limiting entirely, which is the exact opposite
    // of what this module exists to do.
    throw new Error(`createLimiter requires a positive integer, received ${maxConcurrent}`);
  }
  const cap = Math.floor(maxConcurrent);

  let active = 0;
  const queue: Array<() => void> = [];

  const release = () => {
    const next = queue.shift();
    if (next) {
      // Hand the slot directly to the waiter. `active` is deliberately NOT
      // decremented: the slot is transferred, not freed. Decrementing here and
      // letting the resumed waiter re-increment leaves a microtask-wide window
      // in which a new caller reads an under-counted `active` and takes the
      // same slot, which measurably pushed concurrency to 4 under a cap of 2.
      next();
    } else {
      active--;
    }
  };

  return async function limit<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= cap) {
      // Resuming means release() already transferred a slot to us, so `active`
      // must not be incremented again here.
      await new Promise<void>((resolve) => queue.push(resolve));
    } else {
      active++;
    }
    try {
      return await fn();
    } finally {
      release();
    }
  };
}

/** Env values are operator input, so treat anything unusable as "use the default". */
function parseCap(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  if (raw === undefined || raw.trim() === "" || !Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

export const providerLimiter = createLimiter(parseCap(process.env.AI_MAX_CONCURRENCY, 4));
