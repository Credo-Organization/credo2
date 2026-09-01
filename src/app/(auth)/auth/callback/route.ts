import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { POST_LOGIN_COOKIE } from "@/app/recruiter-signup/route";

/**
 * Only same-origin relative paths are honoured. A value like
 * "https://evil.example" or "//evil.example" would otherwise turn this callback
 * into an open redirect that borrows our domain's credibility.
 */
function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // The destination arrives in a cookie, not a query parameter: Supabase matches
  // redirectTo against an allowlist, and adding ?next= to the callback URL makes
  // it miss, which silently drops the user on the Site URL. The query parameter
  // is still read as a fallback for links that carry one.
  const jar = await cookies();
  const next = jar.get(POST_LOGIN_COOKIE)?.value ?? searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redirect based on onboarding status
      const { data: { user } } = await supabase.auth.getUser();
      const onboardingCompleted = user?.user_metadata?.onboarding_completed;

      const target = safeNext(next);
      const destination = target
        ? `${origin}${target}`
        : onboardingCompleted
        ? `${origin}/dashboard`
        : `${origin}/onboarding`;

      const res = NextResponse.redirect(destination);
      // Single use. Left in place it would hijack every later sign-in on this
      // browser, sending a returning student to the recruiter entry point.
      res.cookies.delete(POST_LOGIN_COOKIE);
      return res;
    }
  }

  // Redirect to login with error if auth fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
