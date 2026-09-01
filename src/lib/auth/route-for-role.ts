export type Role = "student" | "recruiter";

export interface RouteInput {
  role: Role | string | undefined;
  onboarded: boolean;
  path: string;
}

/**
 * Returns the path to redirect to, or null to allow the request through.
 *
 * Extracted from middleware as a pure function because this is where the
 * feature breaks: the existing onboarding gate redirects every authenticated
 * user without `onboarding_completed`, which would trap a recruiter in a form
 * asking for their college. The final test exists to catch a redirect that
 * points at the path that triggered it, which is how an infinite loop begins.
 *
 * Deliberate behaviour change: the previous gate intercepted every path,
 * including "/" and the public verification pages. This only intercepts
 * /dashboard*, so a signed-in student who has not finished onboarding can still
 * read pages that work without an account at all.
 */
export function routeForRole({ role, onboarded, path }: RouteInput): string | null {
  const isRecruiter = role === "recruiter";
  const onRecruiter = path === "/recruiter" || path.startsWith("/recruiter/");
  const onDashboard = path === "/dashboard" || path.startsWith("/dashboard/");
  const onOnboarding = path === "/onboarding";

  if (isRecruiter) {
    if (onRecruiter) return null;
    if (onDashboard || onOnboarding) return "/recruiter";
    return null;
  }

  if (onRecruiter) return "/dashboard";
  if (!onboarded && onDashboard) return "/onboarding";
  if (onboarded && onOnboarding) return "/dashboard";
  return null;
}
