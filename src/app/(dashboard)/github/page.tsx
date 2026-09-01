import { GitHubOAuthCallback } from "@/components/github/github-oauth-callback";
import { GitHubConnectForm } from "@/components/github/github-connect-form";
import { GitHubInsights } from "@/components/github/github-insights";
import { RoleCompetencyAnalyzer } from "@/components/github/role-competency-analyzer";
import { createClient } from "@/lib/supabase/server";

export default async function GitHubDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ github_token?: string; github_login?: string; auth_error?: string }>;
}) {
  const params = await searchParams;
  const token = params.github_token;
  const login = params.github_login;
  const error = params.auth_error;

  // 1. If actively processing an OAuth callback with token & login:
  if (token && login) {
    return <GitHubOAuthCallback token={token} login={login} />;
  }

  // 2. Fetch existing connection from Supabase for current user
  let connectionData = null;
  let reposData = [];
  let languagesData = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: connection } = await supabase
        .from("github_connections")
        .select("id, github_username, avatar_url, synced_at, profile_id")
        .or(`profile_id.eq.${user.id},user_id.eq.${user.id}`)
        .maybeSingle();

      if (connection) {
        connectionData = connection;
        const [{ data: repos }, { data: languages }] = await Promise.all([
          supabase.from("github_repos").select("*").or(`profile_id.eq.${user.id},user_id.eq.${user.id},connection_id.eq.${connection.id}`),
          supabase.from("repo_languages").select("*").or(`profile_id.eq.${user.id},user_id.eq.${user.id}`),
        ]);
        reposData = repos || [];
        languagesData = languages || [];
      }
    }
  } catch (e) {
    console.error("Error loading GitHub connection:", e);
  }

  if (connectionData) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <GitHubInsights
          connection={connectionData}
          repos={reposData}
          languages={languagesData}
        />
      </div>
    );
  }

  // 3. Fallback: Show connect form + Role Competency Requirements Preview
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {error && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
          <h4 className="text-sm font-semibold text-red-700 mb-1">GitHub Authentication Notice</h4>
          <p className="text-xs text-stone-500">
            {error === "missing_code"
              ? "OAuth session expired or was cancelled. Please try connecting below."
              : error}
          </p>
        </div>
      )}

      <GitHubConnectForm />

      {/* Role Competency Preview */}
      <div className="pt-4">
        <RoleCompetencyAnalyzer />
      </div>
    </div>
  );
}


