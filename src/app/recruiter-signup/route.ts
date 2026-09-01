import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { setRoleRecruiter } from "@/actions/recruiter";

/**
 * Entry point for someone choosing the recruiter path.
 *
 * A route handler rather than a page because it renders nothing, and because
 * only a handler may set a cookie - a Server Component cannot set one during
 * render.
 *
 * The intended destination is carried in a cookie rather than a `next` query
 * parameter on the OAuth callback URL. Supabase matches `redirectTo` against an
 * allowlist, and an entry for `/auth/callback` does not match
 * `/auth/callback?next=...`; the mismatch silently sends the user to the
 * project's Site URL instead, which lands them on the marketing page with no
 * error. A cookie keeps the callback URL constant, so it matches the allowlist
 * in every environment without extra configuration per deploy domain.
 */
export const POST_LOGIN_COOKIE = "post_login_next";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const res = NextResponse.redirect(`${origin}/login`);
    res.cookies.set(POST_LOGIN_COOKIE, "/recruiter-signup", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
    return res;
  }

  // This guard previously read user_metadata.role and treated a missing value
  // as "no role yet, safe to convert". Nothing in the application ever writes
  // "student" there - onboarding writes only onboarding_completed - so every
  // real student carried `undefined` and fell straight through to conversion.
  // Opening this link cost them their dashboard, and nothing in the UI undid it.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "recruiter") {
    return NextResponse.redirect(`${origin}/recruiter`);
  }

  // profiles.role cannot stand in for the metadata field on its own: the
  // on_auth_user_created trigger gives every account a row with the 'student'
  // default, so a first-time recruiter is indistinguishable from a student by
  // role alone. What separates them is whether the account has student-side
  // history. An account that finished onboarding, or holds a passport or a
  // linked GitHub account, has something to lose and keeps it.
  if (user.user_metadata?.onboarding_completed) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const [{ count: passports }, { count: connections }] = await Promise.all([
    supabase.from("passports").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("github_connections").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
  ]);

  if ((passports ?? 0) > 0 || (connections ?? 0) > 0) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const result = await setRoleRecruiter();
  if (!result.success) {
    return NextResponse.redirect(`${origin}/login?error=recruiter_signup_failed`);
  }
  return NextResponse.redirect(`${origin}/recruiter`);
}
