"use server";

import { createClient } from "@/lib/supabase/server";
import { Octokit } from "octokit";
import { revalidatePath } from "next/cache";

export async function syncGitHub(username: string, token: string) {
  const supabase = await createClient();
  const octokit = new Octokit({
    auth: token,
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: ghUser } = await octokit.rest.users.getByUsername({ username });

    const { data: connection, error: connectionError } = await supabase
      .from("github_connections")
      .upsert(
        {
          profile_id: user.id,
          github_username: ghUser.login,
          access_token: token,
          avatar_url: ghUser.avatar_url,
          synced_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" }
      )
      .select("id")
      .single();

    if (connectionError || !connection) {
      console.error("Connection Error:", connectionError);
      return { success: false, error: "Failed to save GitHub connection." };
    }

    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      type: "owner",
      sort: "pushed",
      per_page: 30,
    });

    const relevantRepos = repos.filter((r) => !r.fork && (r.size || 0) > 0).slice(0, 5);
    const { evaluateEvidenceIntegrity } = await import("@/lib/agents/anti-cheat");

    // Clear old repos for this connection to avoid duplicates
    await supabase.from("github_repos").delete().eq("connection_id", connection.id);

    await Promise.all(relevantRepos.map(async (repo) => {
      let languages: Record<string, number> = {};
      if (repo.stargazers_count! > 0 || repo.language) {
        try {
          const { data: langData } = await octokit.rest.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });
          languages = langData as Record<string, number>;
        } catch (langError) {
          console.error(`Failed to fetch languages for ${repo.name}`, langError);
        }
      }

      let readmeSnippet = "None";
      try {
        const { data: readmeData } = await octokit.rest.repos.getReadme({
          owner: username,
          repo: repo.name,
        });
        if (readmeData && !Array.isArray(readmeData) && readmeData.content) {
          const decoded = Buffer.from(readmeData.content, 'base64').toString('utf-8');
          readmeSnippet = decoded.substring(0, 1500);
        }
      } catch (readmeError) {
        // Ignore 404s
      }

      let integrityData = { integrity_score: 100, integrity_flags: [] as string[], integrity_status: "verified", verified_skills: [] as string[] };
      try {
        const aiResult = await evaluateEvidenceIntegrity("github", {
          githubData: {
            name: repo.name,
            description: repo.description,
            size: repo.size,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            pushed_at: repo.pushed_at,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            languages: languages,
            readme_snippet: readmeSnippet
          }
        });
        integrityData = { ...integrityData, ...aiResult } as any;
      } catch (e) {
        console.error(`[AntiCheat] Failed to verify GitHub repo ${repo.name}`, e);
      }

      const { data: savedRepo, error: repoError } = await supabase
        .from("github_repos")
        .insert({
          connection_id: connection.id,
          name: repo.name,
          description: repo.description,
          is_fork: repo.fork,
          primary_language: repo.language,
          stars_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          html_url: repo.html_url,
          integrity_score: integrityData.integrity_score,
          integrity_flags: integrityData.integrity_flags,
          integrity_status: integrityData.integrity_status,
          synced_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (repoError || !savedRepo) {
        console.error("Repo save error:", repoError);
        return;
      }

      const langInserts = Object.entries(languages).map(([lang, bytes]) => ({
        repo_id: savedRepo.id,
        language: lang,
        bytes: bytes as number,
      }));

      if (langInserts.length > 0) {
        await supabase.from("repo_languages").insert(langInserts);
      }

      // Save extracted skills to evidence table if verified
      if (integrityData.integrity_status === "verified" && integrityData.verified_skills && integrityData.verified_skills.length > 0) {
        const { data: evidenceRecord, error: evError } = await supabase.from("evidence").insert({
          user_id: user.id,
          source_type: "github",
          raw_ref: repo.html_url,
          status: "verified",
          integrity_score: integrityData.integrity_score,
          integrity_status: integrityData.integrity_status,
          integrity_flags: integrityData.integrity_flags
        }).select("id").single();

        if (evidenceRecord && !evError) {
          const claims = integrityData.verified_skills.map((skill: string) => ({
            evidence_id: evidenceRecord.id,
            extracted_text: `Used ${skill} in repository ${repo.name}`,
            unmapped_label: skill,
            match_confidence: 1.0,
            llm_model: "amazon/nova-micro-v1:0"
          }));
          if (claims.length > 0) {
            await supabase.from("evidence_claims").insert(claims);
          }
        }
      }
    }));

    revalidatePath("/github");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("GitHub Sync Error:", err);
    return { success: false, error: err.message || "Failed to sync GitHub data." };
  }
}

export async function disconnectGitHub() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("github_connections")
    .delete()
    .eq("profile_id", user.id);

  if (error) {
    return { success: false, error: "Failed to disconnect GitHub" };
  }

  revalidatePath("/github");
  return { success: true };
}
