-- Recruiter role and shortlist.
--
-- `role` is duplicated into auth.users.raw_user_meta_data by the application,
-- because middleware reads user_metadata and cannot see this table. Writing only
-- here is invisible to routing - the same defect that broke onboarding, where the
-- gate read user_metadata while the action wrote the profiles row.
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

-- A shortlist entry stores an identifier, never a copy of the student's evidence.
-- A snapshot would survive the student revoking is_public, making their consent
-- toggle meaningless.
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
