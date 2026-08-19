import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing GitHub Client ID" }, { status: 500 });
  }

  // Generate a random state for CSRF protection
  const state = randomBytes(16).toString("hex");

  // Construct GitHub OAuth URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/github/callback`,
    scope: "repo read:user user:email",
    state: state,
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  // Redirect user to GitHub
  return NextResponse.redirect(githubAuthUrl);
}
