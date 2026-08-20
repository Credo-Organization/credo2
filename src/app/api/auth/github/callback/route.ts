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
    const errCode = error || "missing_code";
    return new Response(
      `<!DOCTYPE html>
      <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: '${errCode}' }, '*');
            window.close();
          } else {
            window.location.href = '${dashboardRedirect}?auth_error=${errCode}';
          }
        </script>
      </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing GitHub OAuth credentials in environment");
    return new Response(
      `<!DOCTYPE html>
      <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: 'server_configuration_error' }, '*');
            window.close();
          } else {
            window.location.href = '${dashboardRedirect}?auth_error=server_configuration_error';
          }
        </script>
      </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
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
      return new Response(
        `<!DOCTYPE html>
        <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: '${tokenData.error}' }, '*');
              window.close();
            } else {
              window.location.href = '${dashboardRedirect}?auth_error=${tokenData.error}';
            }
          </script>
        </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      );
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

    // 3. Popup friendly response: notify opener window and close popup
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head><title>GitHub Connected</title></head>
      <body style="background:#09090b;color:#fafafa;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;">
          <h2 style="font-size:18px;margin-bottom:8px;">GitHub Connected Successfully</h2>
          <p style="font-size:14px;color:#a1a1aa;">Importing your profile & closing window...</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'GITHUB_AUTH_SUCCESS', 
              token: '${accessToken}', 
              login: '${login}' 
            }, '*');
            setTimeout(() => window.close(), 300);
          } else {
            window.location.href = '${dashboardRedirect}?github_token=${accessToken}&github_login=${login}';
          }
        </script>
      </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );

  } catch (err: any) {
    console.error("Error during GitHub OAuth callback:", err);
    return new Response(
      `<!DOCTYPE html>
      <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: 'internal_server_error' }, '*');
            window.close();
          } else {
            window.location.href = '${dashboardRedirect}?auth_error=internal_server_error';
          }
        </script>
      </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

