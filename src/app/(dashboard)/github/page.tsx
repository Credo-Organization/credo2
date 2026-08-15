import { PageHeader } from "@/components/shared/page-header";
import { GitBranch } from "lucide-react";
import { GitHubConnectForm } from "@/components/github/github-connect-form";
import { GitHubInsights } from "@/components/github/github-insights";
import { createClient } from "@/lib/supabase/server";

export default async function GithubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="GitHub Integration"
        description="Connect your GitHub account to analyze your repositories and discover skills."
        icon={GitBranch}
      />
      
      {!connection ? (
        <GitHubConnectForm />
      ) : (
        <GitHubInsights 
          connection={connection} 
          repos={repos} 
          languages={languages} 
        />
      )}
    </div>
  );
}
