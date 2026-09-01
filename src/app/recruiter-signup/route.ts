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

  const role = user.user_metadata?.role;

  // An account that already has a role keeps it. Converting a student to a
  // recruiter because they opened a link would silently cost them their
  // passport, their audited repositories and their internship matches.
  if (role === "recruiter") return NextResponse.redirect(`${origin}/recruiter`);
  if (role === "student") return NextResponse.redirect(`${origin}/dashboard`);

  await setRoleRecruiter();
  return NextResponse.redirect(`${origin}/recruiter`);
}
