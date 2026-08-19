import { GitHubOAuthCallback } from "@/components/github/github-oauth-callback";

export default async function GitHubCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ github_token?: string; github_login?: string; auth_error?: string }>;
}) {
  const params = await searchParams;
  const token = params.github_token;
  const login = params.github_login;
  const error = params.auth_error;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <h3 className="text-xl font-medium text-red-500 mb-2">GitHub Authentication Failed</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!token || !login) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <h3 className="text-xl font-medium text-white mb-2">Missing Authentication Data</h3>
        <p className="text-white/60">Unable to complete GitHub sync. Please try connecting again.</p>
      </div>
    );
  }

  return <GitHubOAuthCallback token={token} login={login} />;
}
