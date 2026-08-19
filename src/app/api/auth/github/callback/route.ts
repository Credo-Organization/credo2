import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dashboardRedirect = `${appUrl}/github`;

  if (error || !code) {
    console.error("GitHub OAuth Error:", error, errorDescription);
    return NextResponse.redirect(`${dashboardRedirect}?auth_error=${error || "missing_code"}`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing GitHub OAuth credentials in environment");
    return NextResponse.redirect(`${dashboardRedirect}?auth_error=server_configuration_error`);
  }

  try {
    // 1. Exchange the code for an access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token exchange error:", tokenData);
      return NextResponse.redirect(`${dashboardRedirect}?auth_error=${tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch the user's GitHub profile to get their login
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user profile: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const login = userData.login;

    // 3. Redirect back to the frontend with the token and login
    // In a real production app, you would set a secure HTTP-only cookie here, 
    // but we'll stick to the existing architecture of passing it in the URL 
    // to let the frontend server action grab it and persist it in Supabase.
    const redirectUrl = new URL(dashboardRedirect);
    redirectUrl.searchParams.set("github_token", accessToken);
    redirectUrl.searchParams.set("github_login", login);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (err) {
    console.error("Error during GitHub OAuth callback:", err);
    return NextResponse.redirect(`${dashboardRedirect}?auth_error=internal_server_error`);
  }
}
