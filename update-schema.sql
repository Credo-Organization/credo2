ALTER TABLE public.evidence ADD COLUMN IF NOT EXISTS integrity_score INTEGER;
ALTER TABLE public.evidence ADD COLUMN IF NOT EXISTS integrity_flags JSONB;
ALTER TABLE public.evidence ADD COLUMN IF NOT EXISTS integrity_status TEXT DEFAULT 'pending';

ALTER TABLE public.github_repos ADD COLUMN IF NOT EXISTS integrity_score INTEGER;
ALTER TABLE public.github_repos ADD COLUMN IF NOT EXISTS integrity_flags JSONB;
ALTER TABLE public.github_repos ADD COLUMN IF NOT EXISTS integrity_status TEXT DEFAULT 'pending';
