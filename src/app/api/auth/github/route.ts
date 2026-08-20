import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing GitHub Client ID" }, { status: 500 });
  }

  // Generate a random state for CSRF protection
  const state = randomBytes(16).toString("hex");

  const params: Record<string, string> = {
    client_id: clientId,
    scope: "repo read:user user:email",
    state: state,
  };

  // Only pass redirect_uri if explicitly configured, otherwise GitHub uses registered callback
  if (process.env.GITHUB_REDIRECT_URI) {
    params["redirect_uri"] = process.env.GITHUB_REDIRECT_URI;
  }

  const searchParams = new URLSearchParams(params);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?${searchParams.toString()}`;

  // Redirect user to GitHub
  return NextResponse.redirect(githubAuthUrl);
}


