import taxonomyData from "../../../md/pramaan_skill_taxonomy.json";

export interface TaxonomySkill {
  id: string;
  canonical_name: string;
  category: string;
  subcategory: string;
  aliases: string[];
}

// Build fast exact-match lookup dictionary from aliases & canonical names
const aliasMap = new Map<string, TaxonomySkill>();

const skillsArray: TaxonomySkill[] = (taxonomyData as any).skills || [];

skillsArray.forEach((skill) => {
  aliasMap.set(skill.canonical_name.toLowerCase(), skill);
  (skill.aliases || []).forEach((alias) => {
    aliasMap.set(alias.toLowerCase(), skill);
  });
});

export function normalizeSkill(rawSkill: string): { skill_id: string | null; canonical_name: string; unmapped_label: string | null } {
  const normalized = rawSkill.trim().toLowerCase();
  const match = aliasMap.get(normalized);

  if (match) {
    return {
      skill_id: match.id,
      canonical_name: match.canonical_name,
      unmapped_label: null,
    };
  }

  // Check substring matches for technical skills (e.g., "react.js" -> "React")
  for (const [alias, skill] of aliasMap.entries()) {
    if (alias.length > 2 && (normalized.includes(alias) || alias.includes(normalized))) {
      return {
        skill_id: skill.id,
        canonical_name: skill.canonical_name,
        unmapped_label: null,
      };
    }
  }

  // Preserve as unmapped label (NEVER silently drop)
  return {
    skill_id: null,
    canonical_name: rawSkill,
    unmapped_label: rawSkill,
  };
}
