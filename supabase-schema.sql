-- ════════════════════════════════════════════════════════════════
-- CREDORA / PRAMAAN — Idempotent Database Schema Migration File
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wizuwacevushwlegfgyu/sql/new
-- ════════════════════════════════════════════════════════════════

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  headline TEXT,
  country TEXT,
  college_name TEXT,
  degree TEXT,
  graduation_year TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. CAREER GOALS TABLE
CREATE TABLE IF NOT EXISTS public.career_goals (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  required_skills JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Career goals are viewable by everyone" ON public.career_goals;
CREATE POLICY "Career goals are viewable by everyone" ON public.career_goals FOR SELECT USING (true);

-- 3. PROFILE CAREER GOALS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.profile_career_goals (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_id INTEGER REFERENCES public.career_goals(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, goal_id)
);

ALTER TABLE public.profile_career_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own career goals" ON public.profile_career_goals;
CREATE POLICY "Users can view own career goals" ON public.profile_career_goals FOR SELECT USING (auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can manage own career goals" ON public.profile_career_goals;
CREATE POLICY "Users can manage own career goals" ON public.profile_career_goals FOR ALL USING (auth.uid() = profile_id);

-- 4. GITHUB CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.github_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  github_username TEXT NOT NULL,
  access_token TEXT,
  avatar_url TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own github connection" ON public.github_connections;
CREATE POLICY "Users can view own github connection" ON public.github_connections FOR SELECT USING (auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can manage own github connection" ON public.github_connections;
CREATE POLICY "Users can manage own github connection" ON public.github_connections FOR ALL USING (auth.uid() = profile_id);

-- 5. GITHUB REPOS TABLE
CREATE TABLE IF NOT EXISTS public.github_repos (
  id SERIAL PRIMARY KEY,
  connection_id UUID REFERENCES public.github_connections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stars_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  primary_language TEXT,
  html_url TEXT,
  is_fork BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public repos viewable by everyone" ON public.github_repos;
CREATE POLICY "Public repos viewable by everyone" ON public.github_repos FOR SELECT USING (true);

-- 6. REPO LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS public.repo_languages (
  id SERIAL PRIMARY KEY,
  repo_id INTEGER REFERENCES public.github_repos(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  bytes INTEGER DEFAULT 0
);

ALTER TABLE public.repo_languages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Repo languages viewable by everyone" ON public.repo_languages;
CREATE POLICY "Repo languages viewable by everyone" ON public.repo_languages FOR SELECT USING (true);

-- 7. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date TIMESTAMPTZ,
  file_url TEXT NOT NULL,
  file_type TEXT,
  parsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can manage own certificates" ON public.certificates;
CREATE POLICY "Users can manage own certificates" ON public.certificates FOR ALL USING (auth.uid() = profile_id);

-- 8. EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  raw_ref TEXT,
  storage_path TEXT,
  issuer_id TEXT,
  status TEXT DEFAULT 'pending',
  ingested_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own evidence" ON public.evidence;
CREATE POLICY "Users can view own evidence" ON public.evidence FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own evidence" ON public.evidence;
CREATE POLICY "Users can insert own evidence" ON public.evidence FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. EVIDENCE CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.evidence_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id UUID REFERENCES public.evidence(id) ON DELETE CASCADE,
  extracted_text TEXT NOT NULL,
  skill_id TEXT,
  unmapped_label TEXT,
  match_confidence NUMERIC DEFAULT 1.0,
  llm_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.evidence_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view evidence claims" ON public.evidence_claims;
CREATE POLICY "Users can view evidence claims" ON public.evidence_claims FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert evidence claims" ON public.evidence_claims;
-- Only allow inserting claims if the user owns the parent evidence record
CREATE POLICY "Users can insert evidence claims" ON public.evidence_claims FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.evidence
    WHERE public.evidence.id = evidence_id
    AND public.evidence.user_id = auth.uid()
  )
);

-- 10. PASSPORTS TABLE
CREATE TABLE IF NOT EXISTS public.passports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'published',
  is_public BOOLEAN DEFAULT FALSE,
  title TEXT,
  snapshot_data JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public passports viewable by everyone" ON public.passports;
CREATE POLICY "Public passports viewable by everyone" ON public.passports FOR SELECT USING (is_public OR auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can manage own passports" ON public.passports;
CREATE POLICY "Users can manage own passports" ON public.passports FOR ALL USING (auth.uid() = profile_id);

-- ════════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES (Prevents Sequential Scans)
-- ════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_passports_profile_id ON public.passports(profile_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON public.evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_claims_evidence_id ON public.evidence_claims(evidence_id);

-- ════════════════════════════════════════════════════════════════
-- AI EXTRACTION CACHE
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.extraction_cache (
  content_hash TEXT PRIMARY KEY,
  extracted_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.extraction_cache ENABLE ROW LEVEL SECURITY;
-- Internal table used by Server Actions, no public access required
DROP POLICY IF EXISTS "Deny public access to extraction_cache" ON public.extraction_cache;
CREATE POLICY "Deny public access to extraction_cache" ON public.extraction_cache FOR ALL USING (false);
