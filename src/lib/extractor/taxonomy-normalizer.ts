import taxonomyData from "../../../md/pramaan_skill_taxonomy.json";

export interface TaxonomySkill {
  id: string;
  canonical_name: string;
  category: string;
  subcategory: string;
  aliases: string[];
}

// Build fast exact-match lookup dictionary from aliases & canonical names
export const aliasMap = new Map<string, TaxonomySkill>();

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

/**
 * Fast keyword extraction based on the 296-skill taxonomy.
 * Uses regex word boundaries to find known skills in raw text without LLM latency.
 */
export function extractSkillsFromTextFast(text: string): TaxonomySkill[] {
  const foundSkills = new Map<string, TaxonomySkill>();
  const lowerText = text.toLowerCase();
  
  // Iterate through all known aliases (e.g., "react", "node.js", "docker")
  for (const [alias, skill] of aliasMap.entries()) {
    // Escape special regex characters in alias
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Instead of \b (which fails on non-word chars like + in C++) or \s (which fails on punctuation),
    // use lookarounds to ensure we aren't matching inside a larger word.
    // (?<![\w]) ensures the char before isn't a letter/number/underscore.
    // (?![\w]) ensures the char after isn't a letter/number/underscore.
    const regex = new RegExp(`(?<![\\w])${escapedAlias}(?![\\w])`, 'i');

    if (regex.test(lowerText) || (alias.length > 3 && lowerText.includes(alias))) {
      foundSkills.set(skill.id, skill);
    }
  }

  return Array.from(foundSkills.values());
}
