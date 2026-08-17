"use server";

import { createClient } from "@/lib/supabase/server";
import { Octokit } from "octokit";
import { revalidatePath } from "next/cache";

export async function syncGitHub(username: string) {
  const supabase = await createClient();
  const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN, // Optional, but increases rate limits
  });

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Fetch GitHub User Profile
    const { data: ghUser } = await octokit.rest.users.getByUsername({
      username,
    });

    // 2. Upsert GitHub Connection in Supabase
    const { data: connection, error: connectionError } = await supabase
      .from("github_connections")
      .upsert(
        {
          profile_id: user.id,
          github_user_id: ghUser.id,
          github_username: ghUser.login,
          access_token: "public_only", // Since we only ask for username, we don't have OAuth token yet
          avatar_url: ghUser.avatar_url,
          profile_url: ghUser.html_url,
          public_repos: ghUser.public_repos,
          followers: ghUser.followers,
          following: ghUser.following,
          last_synced_at: new Date().toISOString(),
          sync_status: "completed",
        },
        { onConflict: "profile_id,github_user_id" }
      )
      .select("id")
      .single();

    if (connectionError || !connection) {
      console.error("Connection Error:", connectionError);
      throw new Error("Failed to save GitHub connection.");
    }

    // 3. Fetch Repositories
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      type: "owner",
      sort: "pushed",
      per_page: 30, // Fetch up to 30 active repos
    });

    // Filter out forks and empty repos to save DB space
    const relevantRepos = repos.filter((r) => !r.fork && (r.size || 0) > 0);

    for (const repo of relevantRepos) {
      // 4. Upsert Repo
      const { data: savedRepo, error: repoError } = await supabase
        .from("github_repos")
        .upsert(
          {
            connection_id: connection.id,
            github_repo_id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            is_fork: repo.fork,
            is_private: repo.private,
            primary_language: repo.language,
            stars_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            open_issues: repo.open_issues_count,
            last_commit_at: repo.pushed_at,
            topics: repo.topics || [],
            synced_at: new Date().toISOString(),
          },
          { onConflict: "github_repo_id" }
        )
        .select("id")
        .single();

      if (repoError || !savedRepo) {
        console.error("Repo save error:", repoError);
        continue;
      }

      // 5. Fetch Languages for top/active repos (limit API calls)
      if (repo.stargazers_count! > 0 || repo.language) {
        try {
          const { data: languages } = await octokit.rest.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });

          // Delete existing languages for this repo before inserting new ones
          await supabase.from("repo_languages").delete().eq("repo_id", savedRepo.id);

          const totalBytes = Object.values(languages).reduce((acc: number, bytes: unknown) => acc + (bytes as number), 0);

          const langInserts = Object.entries(languages).map(([lang, bytes]) => ({
            repo_id: savedRepo.id,
            language: lang,
            bytes: bytes as number,
            percentage: totalBytes > 0 ? ((bytes as number) / totalBytes) * 100 : 0,
          }));

          if (langInserts.length > 0) {
            await supabase.from("repo_languages").insert(langInserts);
          }
        } catch (langError) {
          console.error(`Failed to fetch languages for ${repo.name}`, langError);
        }
      }
    }

    revalidatePath("/github");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("GitHub Sync Error:", err);
    
    // Update sync status to failed
    await supabase
      .from("github_connections")
      .update({ sync_status: "failed" })
      .eq("profile_id", user.id);

    throw new Error(err.message || "Failed to sync GitHub data.");
  }
}

export async function disconnectGitHub() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  // RLS will ensure we only delete this user's connection. 
  // Cascading deletes on the database side should handle repos and languages, 
  // but let's explicitly delete the connection to be safe.
  const { error } = await supabase
    .from("github_connections")
    .delete()
    .eq("profile_id", user.id);

  if (error) {
    throw new Error("Failed to disconnect GitHub");
  }

  revalidatePath("/github");
  return { success: true };
}
