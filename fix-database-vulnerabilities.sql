-- ════════════════════════════════════════════════════════════════
-- DATABASE VULNERABILITY FIXES
-- Run this in your Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════

-- 1. FIX AUTH TRIGGER (Prevent Broken Signups on Username Collision)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'user_name'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Because ID collisions are handled above, this MUST be a username collision.
    -- Insert them safely with a NULL username.
    INSERT INTO public.profiles (id, full_name, username)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NULL
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. PATCH PRIVATE DATA LEAK (Secure AI Evidence Claims)
-- Drop the globally public policy
DROP POLICY IF EXISTS "Users can view evidence claims" ON public.evidence_claims;
-- Create a secure join policy so only the owner of the evidence can see the claims
CREATE POLICY "Users can view own evidence claims" ON public.evidence_claims 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.evidence
    WHERE public.evidence.id = evidence_claims.evidence_id
    AND public.evidence.user_id = auth.uid()
  )
);

-- 3. IMPLEMENT UPDATED_AT TIMESTAMP TRACKING
-- Create the reusable trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the profiles table
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- 4. ENFORCE UNIQUE GITHUB CONNECTIONS
-- Prevent multiple users from linking the same GitHub account
ALTER TABLE public.github_connections 
DROP CONSTRAINT IF EXISTS github_connections_github_username_key;

ALTER TABLE public.github_connections 
ADD CONSTRAINT github_connections_github_username_key UNIQUE (github_username);
