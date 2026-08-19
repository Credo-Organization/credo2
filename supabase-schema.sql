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
DROP POLICY IF EXISTS "Authenticated users can insert career goals" ON public.career_goals;
CREATE POLICY "Authenticated users can insert career goals" ON public.career_goals FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can update career goals" ON public.career_goals;
CREATE POLICY "Authenticated users can update career goals" ON public.career_goals FOR UPDATE TO authenticated USING (true);

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
  integrity_score INTEGER,
  integrity_flags JSONB,
  integrity_status TEXT DEFAULT 'pending',
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
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can manage own certificates" ON public.certificates;
CREATE POLICY "Users can manage own certificates" ON public.certificates FOR ALL USING (auth.uid() = profile_id);

-- ════════════════════════════════════════════════════════════════
-- DATABASE TRIGGERS
-- ════════════════════════════════════════════════════════════════

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  raw_ref TEXT,
  storage_path TEXT,
  issuer_id TEXT,
  status TEXT DEFAULT 'pending',
  integrity_score INTEGER,
  integrity_flags JSONB,
  integrity_status TEXT DEFAULT 'pending',
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

-- ════════════════════════════════════════════════════════════════
-- ASYNC JOBS (For Passport Generation)
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.passport_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result_data JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.passport_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own jobs" ON public.passport_jobs;
CREATE POLICY "Users can view own jobs" ON public.passport_jobs FOR SELECT USING (auth.uid() = profile_id);
DROP POLICY IF EXISTS "Users can insert own jobs" ON public.passport_jobs;
CREATE POLICY "Users can insert own jobs" ON public.passport_jobs FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ════════════════════════════════════════════════════════════════
-- RAG / PGVECTOR (For AI Skill Gap Analysis)
-- ════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

CREATE TABLE IF NOT EXISTS public.job_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_title TEXT NOT NULL,
  industry TEXT,
  required_skills JSONB,
  description TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Job requirements viewable by everyone" ON public.job_requirements;
CREATE POLICY "Job requirements viewable by everyone" ON public.job_requirements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only authenticated admins can modify jobs" ON public.job_requirements;
-- Note: Replace true with appropriate admin check if needed. Keeping it open for authenticated users for now.
CREATE POLICY "Only authenticated admins can modify jobs" ON public.job_requirements FOR ALL USING (auth.role() = 'authenticated');

-- Match function for RAG
CREATE OR REPLACE FUNCTION match_job_requirements (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  role_title TEXT,
  industry TEXT,
  required_skills JSONB,
  description TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    job_requirements.id,
    job_requirements.role_title,
    job_requirements.industry,
    job_requirements.required_skills,
    job_requirements.description,
    1 - (job_requirements.embedding <=> query_embedding) AS similarity
  FROM job_requirements
  WHERE 1 - (job_requirements.embedding <=> query_embedding) > match_threshold
  ORDER BY job_requirements.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 8. MATCH JOBS QUEUE (For Async LangGraph Execution)
CREATE TABLE IF NOT EXISTS public.match_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  match_score INTEGER,
  gap_analysis TEXT,
  explainable_text TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.match_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own match jobs" ON public.match_jobs;
CREATE POLICY "Users can view their own match jobs" ON public.match_jobs FOR SELECT TO authenticated USING (profile_id = auth.uid());
DROP POLICY IF EXISTS "Users can insert their own match jobs" ON public.match_jobs;
CREATE POLICY "Users can insert their own match jobs" ON public.match_jobs FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
DROP POLICY IF EXISTS "Service role can update match jobs" ON public.match_jobs;
CREATE POLICY "Service role can update match jobs" ON public.match_jobs FOR UPDATE TO service_role USING (true);
