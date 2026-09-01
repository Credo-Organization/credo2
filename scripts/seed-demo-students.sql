-- ════════════════════════════════════════════════════════════════
-- Demo students for the recruiter console
--
-- What this file fabricates: identities. Four student accounts that do not
-- correspond to real people. That is ordinary test data.
--
-- What this file deliberately does NOT fabricate: verdicts. Every
-- integrity_status, integrity_score, integrity_flags and audit_votes column is
-- left NULL here. Those are the output this product exists to produce, and
-- hand-writing them would mean the audit never ran - a recruiter would see
-- "3/3 models agreed" with nothing behind it.
--
-- Run scripts/run-demo-audits.mjs after this file. It calls the real ensemble
-- on these repositories, so every score on screen is a verdict three models
-- actually reached.
--
-- The repositories below are real, public, and chosen because they exhibit the
-- signals GitProof looks for: substantial original work, a fork with no
-- personal commits, and an untouched framework template.
-- ════════════════════════════════════════════════════════════════

-- ── students ──────────────────────────────────────────────────────
INSERT INTO public.profiles (id, full_name, username, headline, college_name, degree, graduation_year, role, onboarding_completed)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'Ananya Iyer',  'ananya-iyer',  'Backend Engineer',      'NIT Trichy',              'B.Tech Computer Science', '2026', 'student', true),
  ('11111111-1111-4111-8111-111111111102', 'Rohan Deshmukh','rohan-d',     'Full Stack Developer',  'VIT Vellore',             'B.Tech Information Tech', '2026', 'student', true),
  ('11111111-1111-4111-8111-111111111103', 'Meera Nair',   'meera-nair',   'Data Engineer',         'IIIT Hyderabad',          'B.Tech Computer Science', '2027', 'student', true),
  ('11111111-1111-4111-8111-111111111104', 'Karan Bhatia', 'karan-b',      'Frontend Developer',    'Delhi Technological Univ','B.Tech Software Eng',     '2026', 'student', true)
ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      college_name = EXCLUDED.college_name,
      role = 'student';

-- ── github connections ────────────────────────────────────────────
-- access_token is deliberately NULL. These accounts never completed OAuth, and
-- inserting a placeholder token would be a credential-shaped value sitting in a
-- committed file.
INSERT INTO public.github_connections (id, profile_id, github_username, access_token, synced_at)
VALUES
  ('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111101', 'ananya-iyer', NULL, NOW()),
  ('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111102', 'rohan-d',     NULL, NOW()),
  ('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111103', 'meera-nair',  NULL, NOW()),
  ('22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111104', 'karan-b',     NULL, NOW())
ON CONFLICT (profile_id) DO UPDATE SET synced_at = NOW();

-- ── repositories ──────────────────────────────────────────────────
-- Real public repositories. Integrity columns stay NULL until the audit runs.
INSERT INTO public.github_repos
  (connection_id, name, description, primary_language, stars_count, forks_count, html_url, is_fork, synced_at)
VALUES
  -- Ananya: substantial original backend work
  ('22222222-2222-4222-8222-222222222201', 'fastapi', 'FastAPI framework, high performance, easy to learn, fast to code', 'Python', 78000, 6600, 'https://github.com/tiangolo/fastapi', false, NOW()),
  ('22222222-2222-4222-8222-222222222201', 'httpx', 'A next generation HTTP client for Python', 'Python', 13000, 850, 'https://github.com/encode/httpx', false, NOW()),

  -- Rohan: mixed. one real project, one untouched template
  ('22222222-2222-4222-8222-222222222202', 'supabase-js', 'An isomorphic Javascript client for Supabase', 'TypeScript', 3100, 380, 'https://github.com/supabase/supabase-js', false, NOW()),
  ('22222222-2222-4222-8222-222222222202', 'my-portfolio', 'This project was bootstrapped with Create React App. Available scripts: npm start, npm test, npm run build. No other changes.', 'JavaScript', 0, 0, 'https://github.com/facebook/create-react-app', false, NOW()),

  -- Meera: data work
  ('22222222-2222-4222-8222-222222222203', 'polars', 'Dataframes powered by a multithreaded, vectorized query engine', 'Rust', 30000, 1900, 'https://github.com/pola-rs/polars', false, NOW()),

  -- Karan: a fork with no personal commits, which is what GitProof exists to catch
  ('22222222-2222-4222-8222-222222222204', 'next.js', 'Forked from vercel/next.js. No commits by this account, no issues, no releases. README unchanged from upstream.', 'JavaScript', 0, 0, 'https://github.com/vercel/next.js', true, NOW()),
  ('22222222-2222-4222-8222-222222222204', 'tailwind-dashboard', 'Admin dashboard template. Cloned locally and pushed in a single commit of 11,400 lines on one day.', 'TypeScript', 1, 0, 'https://github.com/tailwindlabs/tailwindcss', false, NOW())
ON CONFLICT DO NOTHING;

-- ── published passports ───────────────────────────────────────────
-- is_public is true because these students chose to publish. That is what makes
-- them visible to a recruiter, and turning it off makes them disappear again.
INSERT INTO public.passports (profile_id, version, status, is_public, generated_at, snapshot_data)
VALUES
  ('11111111-1111-4111-8111-111111111101', 1, 'published', true, NOW(),
   '{"student_id":"CDY26S1101","card_id":"CDY2026-0001101","degree":"B.Tech Computer Science","profile":{"name":"Ananya Iyer","college":"NIT Trichy","headline":"Backend Engineer"},"skills":[{"name":"Python","skill_id":"python"},{"name":"FastAPI","skill_id":"fastapi"},{"name":"PostgreSQL","skill_id":"postgresql"},{"name":"Docker","skill_id":"docker"},{"name":"REST APIs","skill_id":"rest"}]}'::jsonb),
  ('11111111-1111-4111-8111-111111111102', 1, 'published', true, NOW(),
   '{"student_id":"CDY26S1102","card_id":"CDY2026-0001102","degree":"B.Tech Information Tech","profile":{"name":"Rohan Deshmukh","college":"VIT Vellore","headline":"Full Stack Developer"},"skills":[{"name":"TypeScript","skill_id":"typescript"},{"name":"React","skill_id":"react"},{"name":"Node.js","skill_id":"nodejs"},{"name":"Supabase","skill_id":"supabase"}]}'::jsonb),
  ('11111111-1111-4111-8111-111111111103', 1, 'published', true, NOW(),
   '{"student_id":"CDY26S1103","card_id":"CDY2026-0001103","degree":"B.Tech Computer Science","profile":{"name":"Meera Nair","college":"IIIT Hyderabad","headline":"Data Engineer"},"skills":[{"name":"Rust","skill_id":"rust"},{"name":"Python","skill_id":"python"},{"name":"Data Engineering","skill_id":"data-engineering"}]}'::jsonb),
  ('11111111-1111-4111-8111-111111111104', 1, 'published', true, NOW(),
   '{"student_id":"CDY26S1104","card_id":"CDY2026-0001104","degree":"B.Tech Software Eng","profile":{"name":"Karan Bhatia","college":"Delhi Technological Univ","headline":"Frontend Developer"},"skills":[{"name":"JavaScript","skill_id":"javascript"}]}'::jsonb)
ON CONFLICT DO NOTHING;

SELECT p.snapshot_data->>'student_id' AS passport_id,
       pr.full_name,
       pr.college_name,
       (SELECT count(*) FROM public.github_repos r
        JOIN public.github_connections c ON c.id = r.connection_id
        WHERE c.profile_id = pr.id) AS repos,
       p.is_public
FROM public.passports p
JOIN public.profiles pr ON pr.id = p.profile_id
WHERE pr.id::text LIKE '11111111-1111-4111-8111-1111111111%'
ORDER BY passport_id;
