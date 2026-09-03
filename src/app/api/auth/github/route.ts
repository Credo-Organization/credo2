import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const OAUTH_STATE_COOKIE = "gh_oauth_state";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing GitHub Client ID" }, { status: 500 });
  }

  const state = randomBytes(16).toString("hex");

  const params: Record<string, string> = {
    client_id: clientId,
    scope: "repo read:user user:email",
    state: state,
  };

  // Determine redirect_uri: explicit env override or dynamically from request host
  let redirectUri = process.env.GITHUB_REDIRECT_URI;
  if (!redirectUri) {
    const url = new URL(request.url);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
    const proto = request.headers.get("x-forwarded-proto") || (url.protocol.replace(":", ""));
    redirectUri = `${proto}://${host}/api/auth/github/callback`;
  }

  params["redirect_uri"] = redirectUri;

  const searchParams = new URLSearchParams(params);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?${searchParams.toString()}`;

  const response = NextResponse.redirect(githubAuthUrl);

  // The state was previously generated and then never checked. Persist it in an
  // httpOnly cookie so the callback can prove the response belongs to a flow
  // this browser actually started.
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
