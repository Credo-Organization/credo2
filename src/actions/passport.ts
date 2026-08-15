"use server";

import { createClient } from "@/lib/supabase/server";
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

  let repos = [];
  let languages = [];

  if (connection) {
    const { data: repoData } = await supabase
      .from("github_repos")
      .select("*")
      .eq("connection_id", connection.id);
    repos = repoData || [];

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

  // --- EVIDENCE ENGINE (Heuristic Simulation) ---
  
  // Aggregate languages to compute proficiency
  const skillMap = new Map<string, { bytes: number, certCount: number }>();
  
  languages.forEach((l) => {
    const current = skillMap.get(l.language) || { bytes: 0, certCount: 0 };
    skillMap.set(l.language, { ...current, bytes: current.bytes + l.bytes });
  });

  // Add Certificates to skills
  (certificates || []).forEach((c) => {
    // Basic heuristic: check if title contains a known tech keyword
    const titleLower = c.title.toLowerCase();
    const commonTech = ["aws", "azure", "gcp", "react", "node", "python", "javascript", "typescript", "java", "sql", "docker", "kubernetes"];
    
    let matched = false;
    for (const tech of commonTech) {
      if (titleLower.includes(tech)) {
        const formattedTech = tech.charAt(0).toUpperCase() + tech.slice(1);
        const current = skillMap.get(formattedTech) || { bytes: 0, certCount: 0 };
        skillMap.set(formattedTech, { ...current, certCount: current.certCount + 1 });
        matched = true;
      }
    }
    
    if (!matched) {
      // If no match, add the issuer or generic "Certification" as a skill
      const name = c.issuer || "General Certification";
      const current = skillMap.get(name) || { bytes: 0, certCount: 0 };
      skillMap.set(name, { ...current, certCount: current.certCount + 1 });
    }
  });

  // Calculate scores (Max 100)
  // Max bytes assumed to be ~500,000 for a score of 80. Cert adds 20.
  const MAX_BYTES = 500000;
  const topSkills = Array.from(skillMap.entries())
    .map(([name, data]) => {
      let score = Math.min((data.bytes / MAX_BYTES) * 80, 80);
      score += Math.min(data.certCount * 20, 20);
      return {
        name,
        confidence: Math.round(score),
        sources: [
          ...(data.bytes > 0 ? ["GitHub"] : []),
          ...(data.certCount > 0 ? ["Certificate"] : [])
        ]
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6); // Top 6 skills

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
