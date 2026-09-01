import { describe, test, expect } from "vitest";
import { routeForRole } from "./route-for-role";

describe("role routing", () => {
  test("a recruiter never sees student onboarding", () => {
    expect(routeForRole({ role: "recruiter", onboarded: false, path: "/onboarding" })).toBe("/recruiter");
  });

  test("a recruiter is kept out of the student dashboard", () => {
    expect(routeForRole({ role: "recruiter", onboarded: true, path: "/dashboard" })).toBe("/recruiter");
    expect(routeForRole({ role: "recruiter", onboarded: true, path: "/dashboard/internships" })).toBe("/recruiter");
  });

  test("a recruiter already on a recruiter route is left alone", () => {
    expect(routeForRole({ role: "recruiter", onboarded: true, path: "/recruiter" })).toBeNull();
    expect(routeForRole({ role: "recruiter", onboarded: false, path: "/recruiter/candidate/CDY1" })).toBeNull();
  });

  test("an unonboarded student is still sent to onboarding", () => {
    expect(routeForRole({ role: "student", onboarded: false, path: "/dashboard" })).toBe("/onboarding");
  });

  test("an onboarded student is kept off recruiter routes", () => {
    expect(routeForRole({ role: "student", onboarded: true, path: "/recruiter" })).toBe("/dashboard");
  });

  test("an onboarded student cannot revisit onboarding", () => {
    expect(routeForRole({ role: "student", onboarded: true, path: "/onboarding" })).toBe("/dashboard");
  });

  test("an onboarded student on the dashboard is left alone", () => {
    expect(routeForRole({ role: "student", onboarded: true, path: "/dashboard" })).toBeNull();
  });

  test("a missing role is treated as student", () => {
    expect(routeForRole({ role: undefined, onboarded: false, path: "/dashboard" })).toBe("/onboarding");
  });

  test("public routes are never redirected", () => {
    expect(routeForRole({ role: "recruiter", onboarded: true, path: "/verify/passport/CDY1" })).toBeNull();
    expect(routeForRole({ role: "student", onboarded: true, path: "/" })).toBeNull();
  });

  test("an unonboarded student can still read public pages", () => {
    // The previous gate bounced them to /onboarding from every path, including
    // pages that work with no account at all.
    expect(routeForRole({ role: "student", onboarded: false, path: "/" })).toBeNull();
    expect(routeForRole({ role: "student", onboarded: false, path: "/verify/passport/CDY1" })).toBeNull();
  });

  test("no input produces a redirect back to the same path", () => {
    for (const role of ["student", "recruiter", undefined] as const) {
      for (const onboarded of [true, false]) {
        for (const path of ["/dashboard", "/onboarding", "/recruiter", "/"]) {
          expect(routeForRole({ role, onboarded, path })).not.toBe(path);
        }
      }
    }
  });
});
