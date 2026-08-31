import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyOAuthState,
  buildOAuthSuccessHtml,
  buildOAuthErrorHtml,
} from "@/lib/security/oauth-callback";
import { OAUTH_STATE_COOKIE } from "../route";

const HTML = { headers: { "Content-Type": "text/html" } };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const returnedState = searchParams.get("state");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const fail = (c: string) => new Response(buildOAuthErrorHtml({ code: c, appUrl }), HTML);

  const jar = await cookies();
  const issuedState = jar.get(OAUTH_STATE_COOKIE)?.value;

  if (error || !code) {
    return fail(error || "missing_code");
  }

  // CSRF: the callback must correspond to an authorize request this browser made.
  if (!verifyOAuthState(issuedState, returnedState)) {
    console.error("GitHub OAuth state mismatch");
    return fail("state_mismatch");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("Missing GitHub OAuth credentials in environment");
    return fail("server_configuration_error");
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      console.error("GitHub token exchange error:", tokenData);
      return fail(tokenData.error);
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user profile: ${userResponse.statusText}`);
    }

    const { login } = await userResponse.json();

    const response = new Response(
      buildOAuthSuccessHtml({ token: accessToken, login, appUrl }),
      HTML
    );
    // Single-use state.
    const cleared = NextResponse.next();
    cleared.cookies.delete(OAUTH_STATE_COOKIE);
    return response;
  } catch (err) {
    console.error("Error during GitHub OAuth callback:", err);
    return fail("internal_server_error");
  }
}
