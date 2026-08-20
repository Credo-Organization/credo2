import { GitHubOAuthCallback } from "@/components/github/github-oauth-callback";
import { GitHubConnectForm } from "@/components/github/github-connect-form";
import { GitHubInsights } from "@/components/github/github-insights";
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
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: connection } = await supabase
        .from("github_connections")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (connection) {
        const [{ data: repos }, { data: languages }] = await Promise.all([
          supabase.from("github_repos").select("*").eq("user_id", user.id),
          supabase.from("repo_languages").select("*").eq("user_id", user.id),
        ]);

        return (
          <div className="max-w-6xl mx-auto py-8">
            <GitHubInsights
              connection={connection}
              repos={repos || []}
              languages={languages || []}
            />
          </div>
        );
      }
    }
  } catch (e) {
    console.error("Error loading GitHub connection:", e);
  }

  // 3. Fallback: Show connect form with error notification if any
  return (
    <div className="py-8">
      {error && (
        <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-center">
          <h4 className="text-sm font-semibold text-red-400 mb-1">GitHub Authentication Notice</h4>
          <p className="text-xs text-zinc-400">
            {error === "missing_code"
              ? "OAuth session expired or was cancelled. Please try connecting below."
              : error}
          </p>
        </div>
      )}
      <GitHubConnectForm />
    </div>
  );
}

