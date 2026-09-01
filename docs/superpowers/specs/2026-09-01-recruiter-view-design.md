# Recruiter View

**Date:** 2026-09-01
**Status:** Approved, ready to implement
**Scope:** Next.js only. No new AI calls, no new pipeline, no multi-tenancy.

## Problem

Credify's student side is complete: a student connects GitHub, GitProof audits every
repository through a three-vendor ensemble, and a passport is published at a public
verification URL. That URL already works for a recruiter with no account.

What a recruiter cannot do today is keep anything. There is no way to look at five
candidates, save the three worth interviewing, and come back tomorrow. Every visit
starts from a pasted identifier.

This adds the smallest surface that fixes that, and nothing more.

## What login actually buys

The public verification page stays exactly as it is, unauthenticated. That is a
deliberate product property: a recruiter can verify a candidate without adopting
anything. An account is only required for the two things that genuinely need
persistence.

| Works with no account | Requires an account |
|---|---|
| Verify one passport | Save candidates across sessions |
| See repos, integrity scores, model agreement | Review a saved shortlist |

## Decisions

**Role lives in two places.** `profiles.role` is the record; `user_metadata.role` is
what middleware reads. Writing only the profiles table leaves middleware blind - the
same defect that broke onboarding, where the gate read `user_metadata` while the
action wrote the table.

**Store a reference, never a snapshot.** `saved_candidates` holds a `passport_id`, not
a copy of the student's evidence. A snapshot would make the student's `is_public`
toggle meaningless: they could unshare and the recruiter would still hold their data.
Storing a reference means revocation actually revokes.

**Recruiters never see student onboarding.** The existing gate redirects every
authenticated user without `onboarding_completed` to `/onboarding`, which asks for a
college and graduation year. A recruiter hitting that is trapped: they complete a
student form and land on a student dashboard. Middleware must branch on role before
that gate runs.

**No new AI.** Everything shown is already computed and stored: `integrity_status`,
`integrity_score`, `integrity_flags`, `audit_votes`, canonical skill IDs, certificate
hashes. This feature is a second reader, not a second pipeline.

## Non-goals

Multi-tenancy or campus drives. Messaging between recruiter and student. Job
description ranking (a later phase). Any metric that cannot be traced to stored
evidence - in particular any claim about AI-generated code, which GitProof does not
detect and cannot.

## Data model

```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student'
  CHECK (role IN ('student','recruiter'));

CREATE TABLE IF NOT EXISTS public.saved_candidates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passport_id  TEXT NOT NULL,
  note         TEXT,
  saved_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (recruiter_id, passport_id)
);
```

Row level security restricts every row to its owning recruiter. A recruiter can never
read another recruiter's shortlist.

## Routes

| Route | Who | Purpose |
|---|---|---|
| `/` | anyone | Two entry points: student, recruiter |
| `/recruiter` | recruiter | Shortlist, and the lookup input |
| `/recruiter/candidate/[id]` | recruiter | Evidence for one passport, with save/remove |
| `/verify/passport/[id]` | anyone | Unchanged, still needs no account |

## Middleware

Role is resolved before the onboarding gate:

- recruiter on `/onboarding` or `/dashboard/*` is sent to `/recruiter`
- student on `/recruiter/*` is sent to `/dashboard`
- an unauthenticated user on `/recruiter/*` is sent to `/login`
- students keep the existing onboarding behaviour, unchanged

## What the recruiter sees

Empty shortlist shows one input, nothing else. No sample candidates, no placeholder
charts. Fabricated data was removed from this product deliberately and must not
return through a new surface.

A candidate view shows only what is stored:

- repositories audited, verified, flagged
- per repository: integrity score, flags, and how many models agreed
- verified skills, resolved from canonical skill IDs
- certificates with their SHA-256 digest

A repository that failed its audit shows its flags, and the agreement figure that
produced the verdict. That line is the product: no other platform can render it.

## Testing

Middleware role routing is pure decision logic and is tested without a browser: each
role against each protected path, plus the unauthenticated case. That is where this
feature will break, and it is the same class of redirect-loop bug that shut the
dashboard earlier.

The rest is server components over existing queries and is verified by running the
app.

## Risks

| Risk | Mitigation |
|---|---|
| Redirect loop between `/onboarding` and `/recruiter` | Routing logic extracted as a pure function with tests before any UI |
| Role written to only one of the two places | Both written in the same action; a test asserts the metadata write |
| A recruiter reading another recruiter's shortlist | RLS, not UI filtering |
| Snapshotting student data | Schema stores an identifier only |
