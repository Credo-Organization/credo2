import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("<your-project>")) {
    return supabaseResponse;
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
    request.nextUrl.pathname.startsWith("/dashboard/settings");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Handle Onboarding Flow
  if (user) {
    const onboardingCompleted = user.user_metadata?.onboarding_completed;
    
    if (!onboardingCompleted && request.nextUrl.pathname !== "/onboarding") {
      // Force user to onboarding if not completed
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    } else if (onboardingCompleted && request.nextUrl.pathname === "/onboarding") {
      // Prevent user from going back to onboarding if already done
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
