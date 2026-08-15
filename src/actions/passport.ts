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
  
  // Aggregate languages to compute proficiency based on repository count
  const skillMap = new Map<string, { repoCount: number, certs: string[] }>();
  
  languages.forEach((l) => {
    const current = skillMap.get(l.language) || { repoCount: 0, certs: [] };
    skillMap.set(l.language, { ...current, repoCount: current.repoCount + 1 });
  });

  // Add Certificates to skills
  (certificates || []).forEach((c) => {
    const titleLower = c.title.toLowerCase();
    const commonTech = ["aws", "azure", "gcp", "react", "node", "python", "javascript", "typescript", "java", "sql", "docker", "kubernetes"];
    
    let matched = false;
    for (const tech of commonTech) {
      if (titleLower.includes(tech)) {
        const formattedTech = tech.charAt(0).toUpperCase() + tech.slice(1);
        const current = skillMap.get(formattedTech) || { repoCount: 0, certs: [] };
        skillMap.set(formattedTech, { ...current, certs: [...current.certs, c.title] });
        matched = true;
      }
    }
    
    if (!matched) {
      const name = c.issuer || "General Certification";
      const current = skillMap.get(name) || { repoCount: 0, certs: [] };
      skillMap.set(name, { ...current, certs: [...current.certs, c.title] });
    }
  });

  // Calculate scores and generate evidence cards
  const topSkills = Array.from(skillMap.entries())
    .map(([name, data]) => {
      // Determine Confidence Level
      let confidence = "Low";
      if ((data.repoCount > 0 && data.certs.length > 0) || data.repoCount > 5) {
        confidence = "High";
      } else if (data.repoCount >= 2 || data.certs.length > 0) {
        confidence = "Medium";
      }

      // Generate Evidence Strings
      const evidence = [];
      if (data.repoCount > 0) {
        evidence.push(`${data.repoCount} repositor${data.repoCount === 1 ? 'y' : 'ies'} using ${name}`);
      }
      data.certs.forEach(cert => {
        evidence.push(`Verified certificate: ${cert}`);
      });

      // Internal score just for sorting purposes before slicing
      const sortScore = data.repoCount + (data.certs.length * 3);

      return {
        name,
        confidence,
        evidence,
        _sortScore: sortScore
      };
    })
    .sort((a, b) => b._sortScore - a._sortScore)
    .slice(0, 6)
    .map(({ _sortScore, ...rest }) => rest); // Remove internal sort score before saving


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
