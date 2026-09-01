-- Scope student evidence tables to their owner.
--
-- supabase-schema.sql ships these three with `USING (true)`, which means the
-- anon key - the one shipped in every browser bundle - can read every row for
-- every student. Repository names, integrity scores, flags and extracted skill
-- claims were all readable by anyone who opened devtools.
--
-- This was fixed directly against the live database during development and the
-- migration was never captured, so a fresh deployment reopened the hole. That
-- is what this file is for.
--
-- Safe to apply: every cross-user read of these tables goes through the
-- service-role client (the recruiter console and the public passport verifier),
-- which bypasses RLS. The anon-key reads are all a signed-in student reading
-- their own rows, which the new policies still allow. Verified by enumerating
-- every `from("github_repos" | "repo_languages" | "evidence_claims")` call site.
--
-- Idempotent: safe to run more than once.

-- github_repos reaches its owner through github_connections.
DROP POLICY IF EXISTS "Public repos viewable by everyone" ON public.github_repos;
DROP POLICY IF EXISTS "Owners can view their repos" ON public.github_repos;
CREATE POLICY "Owners can view their repos"
  ON public.github_repos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.github_connections c
      WHERE c.id = github_repos.connection_id
        AND c.profile_id = auth.uid()
    )
  );

-- repo_languages reaches its owner through github_repos, then connections.
DROP POLICY IF EXISTS "Repo languages viewable by everyone" ON public.repo_languages;
DROP POLICY IF EXISTS "Owners can view their repo languages" ON public.repo_languages;
CREATE POLICY "Owners can view their repo languages"
  ON public.repo_languages FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.github_repos r
      JOIN public.github_connections c ON c.id = r.connection_id
      WHERE r.id = repo_languages.repo_id
        AND c.profile_id = auth.uid()
    )
  );

-- evidence_claims reaches its owner through evidence.user_id.
--
-- A correct owner-scoped policy already existed alongside this one. Postgres
-- ORs permissive policies together, so the `USING (true)` policy granted
-- everything the owner policy was carefully restricting - dropping it is what
-- makes the existing policy effective.
DROP POLICY IF EXISTS "Users can view evidence claims" ON public.evidence_claims;
DROP POLICY IF EXISTS "Owners can view their evidence claims" ON public.evidence_claims;
CREATE POLICY "Owners can view their evidence claims"
  ON public.evidence_claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.evidence e
      WHERE e.id = evidence_claims.evidence_id
        AND e.user_id = auth.uid()
    )
  );

-- profiles keeps its public SELECT on purpose: /p/[username] renders a shared
-- passport with the anon key and needs the name and college. Do not tighten it
-- without moving that page to the service-role client.

-- Confirm: as the anon key, each of these must return zero rows.
--   SELECT count(*) FROM github_repos;
--   SELECT count(*) FROM repo_languages;
--   SELECT count(*) FROM evidence_claims;
