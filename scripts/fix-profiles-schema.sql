-- ════════════════════════════════════════════════════════════════
-- Credify — profiles schema repair
-- Run this in the Supabase SQL editor BEFORE recording the demo.
--
-- Why: src/actions/profile.ts writes `gender`, the dashboard reads
-- `avatar_url`, and find-team / create-teammates select
-- `experience_level`. None of these columns existed on public.profiles,
-- so every profile UPDATE was rejected by Postgres in full.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gender           TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url       TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Backfill onboarding_completed into Auth metadata for any account that
-- already finished onboarding before the middleware fix landed. Without
-- this, existing test accounts stay stuck on /onboarding.
UPDATE auth.users u
SET raw_user_meta_data =
      COALESCE(u.raw_user_meta_data, '{}'::jsonb)
      || jsonb_build_object('onboarding_completed', true)
FROM public.profiles p
WHERE p.id = u.id
  AND p.onboarding_completed IS TRUE;

-- ────────────────────────────────────────────────────────────────
-- Certificates: cryptographic proof columns
--
-- The Proof Inspector renders sha256_hash and issuer_did, but neither
-- column existed. src/actions/certificates.ts now computes a real
-- SHA-256 over the stored file bytes (or the badge's canonical URL for
-- hosted Credly / Open Badges) and writes it here on upload.
-- ────────────────────────────────────────────────────────────────

ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS sha256_hash TEXT,
  ADD COLUMN IF NOT EXISTS issuer_did  TEXT;

CREATE INDEX IF NOT EXISTS idx_certificates_sha256
  ON public.certificates(sha256_hash);

-- Verify
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'certificates')
ORDER BY table_name, ordinal_position;
