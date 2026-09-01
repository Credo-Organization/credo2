import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redirect based on onboarding status
      const { data: { user } } = await supabase.auth.getUser();
      const onboardingCompleted = user?.user_metadata?.onboarding_completed;

      const target = safeNext(next);
      if (target) {
        return NextResponse.redirect(`${origin}${target}`);
      }

      if (onboardingCompleted) {
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
    }
  }

  // Redirect to login with error if auth fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
