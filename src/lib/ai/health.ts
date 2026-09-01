interface HealthOptions {
  threshold: number;
  cooldownMs: number;
  /** Injected so cooldown behaviour is testable without waiting. */
  now?: () => number;
}

/**
 * Skips a model that keeps failing instead of paying its timeout on every call.
 * Several models measured during capability probing were dead or rate-limited;
 * without this, each one costs the ensemble a full timeout per repository.
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
