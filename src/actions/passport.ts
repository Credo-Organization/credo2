"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeSkill } from "@/lib/extractor/taxonomy-normalizer";
import { revalidatePath } from "next/cache";

export async function generatePassport() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch Profile and Goal
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, profile_career_goals(goal_id)")
    .eq("id", user.id)
    .single();

  // 2. Fetch GitHub Connection, Repos, and Languages
  const { data: connection } = await supabase
    .from("github_connections")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  let repos: any[] = [];
  let languages = [];
  let flaggedReposCount = 0;

  if (connection) {
    const { data: repoDataRaw } = await supabase
      .from("github_repos")
      .select("*")
      .eq("connection_id", connection.id);
      
    // Filter out flagged repos
    repos = (repoDataRaw || []).filter(r => r.integrity_status !== "flagged");
    flaggedReposCount = (repoDataRaw || []).filter(r => r.integrity_status === "flagged").length;

    if (repos.length > 0) {
      const repoIds = repos.map(r => r.id);
      const { data: langData } = await supabase
        .from("repo_languages")
        .select("*")
        .in("repo_id", repoIds);
      languages = langData || [];
    }
  }

  // 3. Fetch Certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", user.id);

  // --- EVIDENCE GRADING ENGINE (Module 3) ---
  
  const { data: evidenceData, error: evidenceError } = await supabase
    .from("evidence")
    .select(`
      id,
      source_type,
      raw_ref,
      integrity_status,
      evidence_claims (
        extracted_text,
        unmapped_label,
        skill_id,
        match_confidence
      )
    `)
    .eq("user_id", user.id);

  if (evidenceError) {
    console.error("[Passport] Failed to fetch evidence data:", evidenceError);
  }

  const skillMap = new Map<string, { repoCount: number, certCitations: string[], skill_id?: string }>();
  
  // 1. Process GitHub Languages
  languages.forEach((l) => {
    // Format to canonical name and get skill_id
    const normalized = normalizeSkill(l.language);
    const formatted = normalized.canonical_name;
    const current = skillMap.get(formatted) || { repoCount: 0, certCitations: [] };
    skillMap.set(formatted, { 
      ...current, 
      repoCount: current.repoCount + 1,
      skill_id: normalized.skill_id || current.skill_id 
    });
  });

  // 2. Process AI Extracted Claims
  const validCertUrls = new Set((certificates || []).map(c => c.file_url));

  if (evidenceData) {
    evidenceData.forEach((ev: { id: string; source_type: string; raw_ref: string; integrity_status?: string; evidence_claims?: { unmapped_label?: string; skill_id?: string; extracted_text?: string }[] }) => {
      // Ignore evidence flagged by Anti-Cheat
      if (ev.integrity_status === "flagged") return;

      if (ev.source_type === "certificate") {
        // [Elite Self-Healing] Auto-delete orphaned evidence from legacy data leaks
        if (!validCertUrls.has(ev.raw_ref)) {
          console.warn(`[Passport] Self-healing orphaned evidence: ${ev.raw_ref}`);
          // Fire and forget delete
          supabase.from("evidence").delete().eq("id", ev.id).then();
          return;
        }

        if (ev.evidence_claims) {
          ev.evidence_claims.forEach((claim) => {
            // Use skill_id if mapped, else fallback
            const name = claim.unmapped_label || claim.skill_id;
            if (name) {
              // Capitalize for display consistency
              const formatted = name.charAt(0).toUpperCase() + name.slice(1);
              const current = skillMap.get(formatted) || { repoCount: 0, certCitations: [] };
              skillMap.set(formatted, { 
                ...current, 
                certCitations: [...current.certCitations, `AI Extracted: "${claim.extracted_text}"`],
                skill_id: claim.skill_id || current.skill_id
              });
            }
          });
        }
      }
    });
  }

  // 3. Compute Grading Levels (Level 1 - 3)
  let flaggedEvidenceCount = 0;
  if (evidenceData) {
    flaggedEvidenceCount = evidenceData.filter((ev: any) => ev.integrity_status === "flagged").length;
  }
  const has_flagged_items = (flaggedReposCount + flaggedEvidenceCount) > 0;

  const topSkills = Array.from(skillMap.entries())
    .map(([name, data]) => {
      // Evidence Grading Engine Logic
      // Level 1: Low (Single repo or unverified cert)
      // Level 2: Medium (2+ repos or multiple certs)
      // Level 3: High (GitHub + Cert corroboration, or highly active GitHub)
      
      let confidence = "Low";
      if ((data.repoCount > 0 && data.certCitations.length > 0) || data.repoCount > 5) {
        confidence = "High";
      } else if (data.repoCount >= 2 || data.certCitations.length > 1) {
        confidence = "Medium";
      }

      const evidence = [];
      if (data.repoCount > 0) {
        evidence.push(`${data.repoCount} repositor${data.repoCount === 1 ? 'y' : 'ies'} using ${name}`);
      }
      
      // Push specific AI extracted citations
      data.certCitations.forEach(citation => {
        evidence.push(citation);
      });

      // Internal score for sorting
      const sortScore = data.repoCount + (data.certCitations.length * 3);

      return {
        name,
        skill_id: data.skill_id, // Add skill_id for the Opportunity Matcher
        confidence,
        evidence,
        _sortScore: sortScore
      };
    })
    .sort((a, b) => b._sortScore - a._sortScore)
    .slice(0, 6)
    .map(({ _sortScore, ...rest }) => rest);


  const snapshotData = {
    profile: {
      name: profile?.full_name || profile?.username || "Unknown",
      headline: profile?.headline || "Software Engineer",
      country: profile?.country,
      college: profile?.college_name,
    },
    github: {
      username: connection?.github_username,
      total_repos: repos.length,
      total_stars: repos.reduce((acc, r) => acc + r.stars_count, 0),
    },
    certificates: (certificates || []).length,
    skills: topSkills,
    has_flagged_items,
    top_projects: repos.sort((a, b) => b.stars_count - a.stars_count).slice(0, 2).map(r => ({
      name: r.name,
      description: r.description,
      language: r.primary_language,
      stars: r.stars_count
    }))
  };

  // 4. Upsert Passport
  const { data: existingPassport } = await supabase
    .from("passports")
    .select("id, version")
    .eq("profile_id", user.id)
    .single();

  const { error: passportError } = await supabase
    .from("passports")
    .upsert({
      id: existingPassport?.id || undefined,
      profile_id: user.id,
      version: (existingPassport?.version || 0) + 1,
      status: "published",
      is_public: false,
      title: `${profile?.full_name || 'My'} Skill Passport`,
      snapshot_data: snapshotData,
      generated_at: new Date().toISOString(),
    });

  if (passportError) {
    console.error("Passport generation error:", passportError);
    throw new Error("Failed to generate passport.");
  }

  revalidatePath("/passport");
  return { success: true };
}

export async function togglePassportVisibility(isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("passports")
    .update({ is_public: isPublic })
    .eq("profile_id", user.id);

  if (error) {
    throw new Error("Failed to update visibility.");
  }

  revalidatePath("/passport");
  return { success: true };
}
