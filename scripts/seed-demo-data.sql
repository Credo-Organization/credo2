-- =========================================================================
-- Credify Demo Data Seeder (Hackathon Edition)
-- Run this script in your Supabase SQL Editor to instantly populate 
-- the database with perfect demo data for the live pitch.
-- =========================================================================

-- 1. Create a Demo Student Profile
INSERT INTO public.profiles (id, email, full_name, display_name, username, bio, headline, college_name, experience_level, onboarding_completed, github_connected)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Fixed ID for demo
  'demo.student@credify.ai',
  'Aman Kumar',
  'Aman',
  'amank-dev',
  'Building the future of web apps.',
  'Aspiring Full Stack Developer',
  'IIT Delhi',
  'intermediate',
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Core Skills for the Demo Student
INSERT INTO public.skills (id, slug, name, category, icon, color)
VALUES 
  (1001, 'react', 'React', 'framework', 'react-icon', 'bg-blue-500'),
  (1002, 'typescript', 'TypeScript', 'language', 'ts-icon', 'bg-blue-600'),
  (1003, 'nodejs', 'Node.js', 'framework', 'node-icon', 'bg-emerald-500'),
  (1004, 'postgresql', 'PostgreSQL', 'database', 'pg-icon', 'bg-violet-500'),
  (1005, 'aws', 'AWS', 'platform', 'aws-icon', 'bg-amber-500')
ON CONFLICT (id) DO NOTHING;

-- 3. Map Skills to the Student (UserSkills)
INSERT INTO public.user_skills (id, profile_id, skill_id, proficiency, proficiency_label, evidence_count)
VALUES 
  (2001, '00000000-0000-0000-0000-000000000001', 1001, 92, 'expert', 8),
  (2002, '00000000-0000-0000-0000-000000000001', 1002, 87, 'advanced', 6),
  (2003, '00000000-0000-0000-0000-000000000001', 1003, 78, 'intermediate', 5),
  (2004, '00000000-0000-0000-0000-000000000001', 1004, 65, 'beginner', 3),
  (2005, '00000000-0000-0000-0000-000000000001', 1005, 28, 'novice', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Create a Published Passport
INSERT INTO public.passports (id, profile_id, version, status, is_public, title, summary)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  1,
  'published',
  true,
  'Full Stack Engineering Passport',
  'A verified record of Full Stack engineering capabilities backed by 24 GitHub repositories and 3 certifications.'
) ON CONFLICT (id) DO NOTHING;

-- 5. Link Skills to the Passport
INSERT INTO public.passport_skills (id, passport_id, skill_id, skill_name, proficiency, display_order)
VALUES 
  (3001, '11111111-1111-1111-1111-111111111111', 1001, 'React', 92, 1),
  (3002, '11111111-1111-1111-1111-111111111111', 1002, 'TypeScript', 87, 2),
  (3003, '11111111-1111-1111-1111-111111111111', 1003, 'Node.js', 78, 3)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Mock Jobs (Career Goals / Opportunities)
INSERT INTO public.career_goals (id, slug, title, description, category)
VALUES 
  (4001, 'frontend-engineer', 'Frontend Engineer (React)', 'Build immersive user interfaces using React and modern CSS.', 'Engineering'),
  (4002, 'fullstack-engineer', 'Full Stack Developer', 'End-to-end development using Node.js and React.', 'Engineering')
ON CONFLICT (id) DO NOTHING;

-- Demo data is now seeded! Your live demo will have a perfect profile ready to show.
