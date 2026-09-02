import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routeForRole } from "@/lib/auth/route-for-role";

const DEFAULT_ANON_KEY = "sb_publishable_hGB52K6xuHwyS4sWs512SQ_L1nE4sNU";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wizuwacevushwlegfgyu.supabase.co";
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey || supabaseAnonKey.startsWith("eyJhbGci") || supabaseAnonKey.includes("mock-anon-key")) {
    supabaseAnonKey = DEFAULT_ANON_KEY;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );


  // Refresh the auth token — important!
  // Do not remove this line. It refreshes the user's session
  // on every request and ensures the session stays alive.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes — redirect to login if not authenticated
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/onboarding") ||
    request.nextUrl.pathname.startsWith("/github") ||
    request.nextUrl.pathname.startsWith("/certificates") ||
    request.nextUrl.pathname.startsWith("/passport") ||
    request.nextUrl.pathname.startsWith("/roadmap") ||
    request.nextUrl.pathname.startsWith("/dashboard/settings") ||
    request.nextUrl.pathname === "/recruiter" ||
    request.nextUrl.pathname.startsWith("/recruiter/");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Handle role-based routing. The decision is a pure function so it can be
  // tested for redirect loops without a browser.
  if (user) {
    const target = routeForRole({
      role: user.user_metadata?.role,
      onboarded: Boolean(user.user_metadata?.onboarding_completed),
      path: request.nextUrl.pathname,
    });

    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login, to their own home. Sending a
  // recruiter to /dashboard would work, because the block above bounces them on
  // to /recruiter, but it costs a needless round trip through a route they are
  // not allowed to see.
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = user.user_metadata?.role === "recruiter" ? "/recruiter" : "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
