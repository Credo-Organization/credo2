# Recruiter View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a recruiter sign in, look up a student's passport, and keep a shortlist across sessions.

**Architecture:** A second reader over data the student side already produces. Role is resolved in middleware before the existing onboarding gate; routing is a pure tested function. Shortlist rows store a passport identifier, never a copy of the student's evidence.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase (Postgres + RLS), Tailwind, shadcn/ui `base-nova`, lucide icons, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-01-recruiter-view-design.md`

**Visual language to match:** dark glassmorphic panels — `rounded-3xl`, `border border-white/[0.06]`, `bg-[#0a0d14]/70 backdrop-blur-xl`, uppercase mono eyebrow labels at `text-[11px] tracking-widest`, lucide icons in a `w-8 h-8 rounded-xl` tinted tile. Match `src/components/dashboard/audit-breakdown-panel.tsx`.

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/add-recruiter-role.sql` | `profiles.role`, `saved_candidates`, RLS |
| `src/lib/auth/route-for-role.ts` | Pure routing decision, tested |
| `src/lib/supabase/middleware.ts` | Modified: call the decision before the onboarding gate |
| `src/actions/recruiter.ts` | Save, remove, and list shortlist entries |
| `src/app/(recruiter)/recruiter/page.tsx` | Shortlist + lookup |
| `src/app/(recruiter)/recruiter/candidate/[id]/page.tsx` | Evidence for one passport |
| `src/components/recruiter/candidate-lookup.tsx` | The lookup input |
| `src/components/recruiter/shortlist-card.tsx` | One saved candidate |
| `src/components/recruiter/save-button.tsx` | Save / remove toggle |
| `src/app/(marketing)/page.tsx` | Modified: two entry points |

Task 1 is pure logic. Tasks 2 to 7 build outward from it.

---

## Task 1: Role routing decision

**Files:**
- Create: `src/lib/auth/route-for-role.ts`
- Test: `src/lib/auth/route-for-role.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/auth/route-for-role.test.ts`
Expected: FAIL with `Cannot find module './route-for-role'`

- [ ] **Step 3: Write minimal implementation**

```typescript
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
 * asking for their college. The final assertion in the test suite exists to
 * catch a redirect that points at the path it was triggered from, which is how
 * an infinite loop begins.
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
```

**Deliberate behaviour change, do not "restore" it:** the previous gate redirected an
unonboarded user to `/onboarding` from *every* path, including `/` and the public
verification pages. This version only intercepts `/dashboard*`, so a signed-in student
who has not finished onboarding can still read the landing page and open a public
passport link. That is the correct behaviour for pages that work without an account at
all.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/auth/route-for-role.test.ts`
Expected: PASS, 10 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/route-for-role.ts src/lib/auth/route-for-role.test.ts
git commit -m "feat(auth): pure role routing decision with loop protection"
```

---

## Task 2: Database migration

**Files:**
- Create: `scripts/add-recruiter-role.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Recruiter role and shortlist.
--
-- `role` is duplicated into auth.users.raw_user_meta_data by the application,
-- because middleware reads user_metadata and cannot see this table. Writing only
-- here is invisible to routing - the same defect that broke onboarding.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check CHECK (role IN ('student','recruiter'));
  END IF;
END $$;

-- A shortlist entry stores an identifier, never a copy of the student's
-- evidence. A snapshot would survive the student revoking `is_public`, making
-- their consent toggle meaningless.
CREATE TABLE IF NOT EXISTS public.saved_candidates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passport_id  TEXT NOT NULL,
  note         TEXT,
  saved_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (recruiter_id, passport_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_candidates_recruiter
  ON public.saved_candidates(recruiter_id);

ALTER TABLE public.saved_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recruiters read own shortlist" ON public.saved_candidates;
CREATE POLICY "recruiters read own shortlist"
  ON public.saved_candidates FOR SELECT USING (auth.uid() = recruiter_id);

DROP POLICY IF EXISTS "recruiters manage own shortlist" ON public.saved_candidates;
CREATE POLICY "recruiters manage own shortlist"
  ON public.saved_candidates FOR ALL USING (auth.uid() = recruiter_id);

SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('profiles','saved_candidates')
ORDER BY table_name, ordinal_position;
```

- [ ] **Step 2: Commit**

```bash
git add scripts/add-recruiter-role.sql
git commit -m "feat(db): recruiter role and shortlist schema"
```

---

## Task 3: Wire routing into middleware

**Files:**
- Modify: `src/lib/supabase/middleware.ts`

- [ ] **Step 1: Replace the onboarding block**

Find the block that begins `// Handle Onboarding Flow` and ends before
`// Redirect authenticated users away from login`. Replace the whole block with:

```typescript
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
```

Add the import at the top of the file:

```typescript
import { routeForRole } from "@/lib/auth/route-for-role";
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm test`
Expected: tsc exits 0; all tests pass

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/middleware.ts
git commit -m "feat(auth): route by role before the onboarding gate"
```

---

## Task 4: Recruiter server actions

**Files:**
- Create: `src/actions/recruiter.ts`

- [ ] **Step 1: Write the implementation**

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Identifiers come from a URL, so they are constrained before reaching a query. */
function safeId(raw: string): string {
  return raw.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);
}

export async function setRoleRecruiter() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Written to auth metadata as well as the table: middleware reads metadata and
  // cannot see the profiles row.
  const { error: metaError } = await supabase.auth.updateUser({
    data: { role: "recruiter", onboarding_completed: true },
  });
  if (metaError) return { success: false, error: metaError.message };

  await supabase.from("profiles").update({ role: "recruiter" }).eq("id", user.id);

  revalidatePath("/recruiter");
  return { success: true };
}

export async function saveCandidate(passportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const id = safeId(passportId);
  if (!id) return { success: false, error: "That passport ID is not valid." };

  const { error } = await supabase
    .from("saved_candidates")
    .upsert({ recruiter_id: user.id, passport_id: id }, { onConflict: "recruiter_id,passport_id" });

  if (error) return { success: false, error: "Could not save this candidate." };

  revalidatePath("/recruiter");
  revalidatePath(`/recruiter/candidate/${id}`);
  return { success: true };
}

export async function removeCandidate(passportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("saved_candidates")
    .delete()
    .eq("recruiter_id", user.id)
    .eq("passport_id", safeId(passportId));

  if (error) return { success: false, error: "Could not remove this candidate." };

  revalidatePath("/recruiter");
  revalidatePath(`/recruiter/candidate/${safeId(passportId)}`);
  return { success: true };
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint src/actions/recruiter.ts`
Expected: both exit 0

- [ ] **Step 3: Commit**

```bash
git add src/actions/recruiter.ts
git commit -m "feat(recruiter): shortlist actions with identifier sanitising"
```

---

## Task 5: Candidate evidence page

**Files:**
- Create: `src/app/(recruiter)/recruiter/candidate/[id]/page.tsx`
- Create: `src/components/recruiter/save-button.tsx`

- [ ] **Step 1: Write the save button**

```tsx
"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { saveCandidate, removeCandidate } from "@/actions/recruiter";
import { toast } from "sonner";

export function SaveButton({ passportId, initiallySaved }: { passportId: string; initiallySaved: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();

  const toggle = () =>
    start(async () => {
      const res = saved ? await removeCandidate(passportId) : await saveCandidate(passportId);
      if (!res.success) {
        toast.error(res.error ?? "Something went wrong.");
        return;
      }
      setSaved(!saved);
      toast.success(saved ? "Removed from shortlist" : "Saved to shortlist");
    });

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-2 h-10 px-5 rounded-2xl text-xs font-semibold border transition-colors disabled:opacity-60 ${
        saved
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15"
          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.07]"
      }`}
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      {saved ? "Saved" : "Save to shortlist"}
    </button>
  );
}
```

- [ ] **Step 2: Write the candidate page**

```tsx
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { agreementFromVotes } from "@/lib/ai/agreement";
import { SaveButton } from "@/components/recruiter/save-button";
import { ShieldCheck, ShieldAlert, ShieldQuestion, ArrowLeft, Award, GitBranch } from "lucide-react";
import Link from "next/link";

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const safeId = id.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: passport } = safeId
    ? await admin
        .from("passports")
        .select("*, profiles(id, full_name, college_name, degree)")
        .eq("is_public", true)
        .or(`snapshot_data->>student_id.eq.${safeId},snapshot_data->>card_id.eq.${safeId}`)
        .limit(1)
        .maybeSingle()
    : { data: null };

  if (!passport) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-5">
          <ShieldQuestion className="w-7 h-7 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">No published passport found</h1>
        <p className="text-sm text-white/50 max-w-sm mx-auto">
          Nothing matches <span className="font-mono text-white/70">{id}</span>. Either the
          identifier is wrong, or the student has not shared this passport.
        </p>
        <Link href="/recruiter" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mt-7">
          <ArrowLeft className="w-4 h-4" /> Back to shortlist
        </Link>
      </div>
    );
  }

  const snap = passport.snapshot_data ?? {};
  const profile = passport.profiles as { id?: string; full_name?: string; college_name?: string } | null;

  const { data: repos } = profile?.id
    ? await admin
        .from("github_repos")
        .select("name, primary_language, integrity_status, integrity_score, integrity_flags, audit_votes")
        .eq("connection_id", (
          await admin.from("github_connections").select("id").eq("profile_id", profile.id).single()
        ).data?.id ?? "")
        .order("integrity_score", { ascending: true })
    : { data: [] };

  const { data: certs } = profile?.id
    ? await admin.from("certificates").select("title, issuer, sha256_hash").eq("profile_id", profile.id)
    : { data: [] };

  const { data: saved } = user
    ? await supabase.from("saved_candidates").select("id").eq("recruiter_id", user.id).eq("passport_id", safeId).maybeSingle()
    : { data: null };

  const list = repos ?? [];
  const verified = list.filter((r) => r.integrity_status === "verified").length;
  const flagged = list.filter((r) => r.integrity_status === "flagged").length;
  const skills: { name: string }[] = snap.skills ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-7">
      <Link href="/recruiter" className="inline-flex items-center gap-2 text-xs text-white/45 hover:text-white w-fit">
        <ArrowLeft className="w-3.5 h-3.5" /> Shortlist
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Candidate</span>
          <h1 className="text-3xl font-black tracking-tight text-white">{profile?.full_name || safeId}</h1>
          <p className="text-sm text-white/50">
            {profile?.college_name || "Institution not stated"} · <span className="font-mono">{safeId}</span>
          </p>
        </div>
        <SaveButton passportId={safeId} initiallySaved={Boolean(saved)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { k: "Repositories", v: list.length },
          { k: "Verified", v: verified },
          { k: "Flagged", v: flagged },
          { k: "Certificates", v: certs?.length ?? 0 },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-4">
            <span className="text-2xl font-bold text-white tabular-nums block">{s.v}</span>
            <span className="text-[11px] text-white/40 uppercase tracking-wider">{s.k}</span>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase">GitProof audit</span>
            <h2 className="text-sm font-bold text-white">Every repository, independently scored</h2>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-white/45 py-6 text-center">This candidate has no audited repositories.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {list.map((r, i) => {
              const ok = r.integrity_status === "verified";
              const bad = r.integrity_status === "flagged";
              const agreement = agreementFromVotes(r.audit_votes);
              return (
                <div key={i} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-white">{r.name}</span>
                    <div className="flex items-center gap-2.5">
                      {agreement && (
                        <span className="text-[10px] font-mono text-white/40">{agreement} models agreed</span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${
                          ok
                            ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
                            : bad
                            ? "text-rose-300 bg-rose-500/10 border-rose-500/25"
                            : "text-amber-300 bg-amber-500/10 border-amber-500/25"
                        }`}
                      >
                        {ok ? <ShieldCheck className="w-3 h-3" /> : bad ? <ShieldAlert className="w-3 h-3" /> : <ShieldQuestion className="w-3 h-3" />}
                        {r.integrity_status ?? "pending"} · {r.integrity_score ?? 0}
                      </span>
                    </div>
                  </div>
                  {Array.isArray(r.integrity_flags) && r.integrity_flags.length > 0 && (
                    <p className="text-xs text-rose-200/70">{r.integrity_flags.join(" · ")}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6 flex flex-col gap-3.5">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Verified skills</span>
          {skills.length === 0 ? (
            <p className="text-sm text-white/45">No verified skills yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-white/90">
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6 flex flex-col gap-3.5">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Certificates</span>
          {(certs?.length ?? 0) === 0 ? (
            <p className="text-sm text-white/45">No certificates uploaded.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {certs!.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-white/35 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm text-white block truncate">{c.title}</span>
                    <span className="text-[11px] text-white/40">
                      {c.issuer || "Issuer not stated"}
                      {c.sha256_hash ? " · SHA-256 verified" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint "src/app/(recruiter)" src/components/recruiter`
Expected: both exit 0

- [ ] **Step 4: Commit**

```bash
git add "src/app/(recruiter)" src/components/recruiter/save-button.tsx
git commit -m "feat(recruiter): candidate evidence page with model agreement"
```

---

## Task 6: Shortlist page

**Files:**
- Create: `src/app/(recruiter)/recruiter/page.tsx`
- Create: `src/components/recruiter/candidate-lookup.tsx`

- [ ] **Step 1: Write the lookup input**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function CandidateLookup() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const id = value.trim().replace(/[^A-Za-z0-9-]/g, "");
    if (id) router.push(`/recruiter/candidate/${id}`);
  };

  return (
    <form onSubmit={go} className="flex gap-2.5 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passport ID, e.g. CDY26S7421"
          aria-label="Passport ID"
          className="w-full h-11 pl-10 pr-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25"
        />
      </div>
      <button
        type="submit"
        className="h-11 px-5 rounded-2xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors"
      >
        Look up
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Write the shortlist page**

```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CandidateLookup } from "@/components/recruiter/candidate-lookup";
import { Users, ArrowRight } from "lucide-react";

export default async function RecruiterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: saved } = await supabase
    .from("saved_candidates")
    .select("passport_id, saved_at")
    .eq("recruiter_id", user.id)
    .order("saved_at", { ascending: false });

  const list = saved ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Recruiter</span>
        <h1 className="text-3xl font-black tracking-tight text-white">Shortlist</h1>
        <p className="text-sm text-white/50">
          Look up a candidate by the ID on their Credify passport. Saved candidates stay here.
        </p>
      </div>

      <CandidateLookup />

      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/[0.09] bg-white/[0.01] py-16 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
            <Users className="w-6 h-6 text-white/25" />
          </div>
          <h2 className="text-base font-bold text-white">No candidates yet</h2>
          <p className="text-sm text-white/45 max-w-sm">
            Ask a student for the ID on their passport, or scan its QR code. Their audited
            evidence appears here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
            {list.length} saved
          </span>
          {list.map((c) => (
            <Link
              key={c.passport_id}
              href={`/recruiter/candidate/${c.passport_id}`}
              className="group rounded-2xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-4 flex items-center justify-between gap-4 hover:border-white/[0.15] transition-colors"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-white font-mono truncate">{c.passport_id}</span>
                <span className="text-[11px] text-white/40">
                  Saved {new Date(c.saved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint "src/app/(recruiter)" src/components/recruiter`
Expected: both exit 0

- [ ] **Step 4: Commit**

```bash
git add "src/app/(recruiter)/recruiter/page.tsx" src/components/recruiter/candidate-lookup.tsx
git commit -m "feat(recruiter): shortlist page with empty state"
```

---

## Task 7: Two entry points on the landing page

**Files:**
- Modify: `src/app/(marketing)/page.tsx`
- Create: `src/app/recruiter-signup/page.tsx`

- [ ] **Step 1: Write the recruiter signup handoff**

This page runs after Google login when the user chose the recruiter path. It marks
the role and forwards to the recruiter area.

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRoleRecruiter } from "@/actions/recruiter";

export default async function RecruiterSignup() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/recruiter-signup");

  await setRoleRecruiter();
  redirect("/recruiter");
}
```

- [ ] **Step 2: Add the second entry point to the hero**

In `src/app/(marketing)/page.tsx`, locate the hero call-to-action and add a second
button beside the existing one. Keep the existing student button exactly as it is.

```tsx
<Link
  href="/recruiter-signup"
  className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/[0.06] transition-colors"
>
  I&apos;m a recruiter
</Link>
```

Place it in the same flex container as the existing button so the two sit side by
side, and give that container `flex-wrap gap-3 justify-center` if it does not
already wrap.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm test && npx eslint src/app`
Expected: tsc 0; all tests pass; eslint 0

- [ ] **Step 4: Commit**

```bash
git add "src/app/(marketing)/page.tsx" src/app/recruiter-signup/page.tsx
git commit -m "feat(recruiter): recruiter entry point on the landing page"
```

---

## Manual verification after implementation

1. Run `scripts/add-recruiter-role.sql` in the Supabase SQL editor.
2. Sign in with a **new** Google account via the recruiter button. Confirm it lands on
   `/recruiter` and is never shown the student onboarding form.
3. From that account, open `/dashboard` directly. Confirm it redirects to `/recruiter`.
4. Sign in as an existing student. Confirm `/dashboard` still works and `/recruiter`
   redirects back to `/dashboard`.
5. Look up a published passport ID. Confirm repositories, integrity scores and the
   `2/3 models agreed` line render.
6. Save the candidate, reload, confirm it persists. Remove it, confirm it disappears.
7. Look up an unpublished or unknown ID. Confirm the not-found state, not an error.
