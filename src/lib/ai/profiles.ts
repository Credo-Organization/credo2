import { Capability, modelsWith } from "./registry";
import { modelHealth } from "./health";

type HealthLike = { isHealthy(id: string): boolean };

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
export function resolveModels(name: string, health: HealthLike = modelHealth): string[] {
  const p = PROFILES[name];
  if (!p) throw new Error(`Unknown task profile: ${name}`);

  const eligible = modelsWith(p.needs)
    .filter((m) => health.isHealthy(m.id))
    .sort((a, b) => a.costRank - b.costRank);

  if (p.mode === "single") return eligible.slice(0, 1).map((m) => m.id);

  const seen = new Set<string>();
  const panel: string[] = [];
  for (const m of eligible) {
    // split("/")[0]: every current registry id has exactly one slash, so this
    // is a safe vendor key today. A future id with no slash would fall back
    // to the whole id, which is always unique and so would never dedupe.
    const vendor = m.id.split("/")[0];
    if (seen.has(vendor)) continue;
    seen.add(vendor);
    panel.push(m.id);
    if (panel.length === (p.size ?? 3)) break;
  }

  // A single model is not an ensemble: it can never reach a majority, so
  // vote.ts would return "pending" no matter what it said. Fail here instead
  // of spending a provider call to learn that. Two vendors agreeing is still
  // real evidence, so only one is treated as unfieldable.
  if (panel.length < 2) {
    throw new Error(
      `Task profile ${name} needs at least 2 healthy models, found ${panel.length}`
    );
  }
  return panel;
}
