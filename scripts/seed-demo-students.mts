/**
 * Creates the demo students the recruiter console reads.
 *
 *   npx tsx scripts/seed-demo-students.mts
 *
 * This is a script rather than plain SQL because profiles.id is a foreign key to
 * auth.users. A profile cannot exist without a real auth user, so the accounts
 * have to be created through the admin API; the on_auth_user_created trigger
 * then creates the profile row, which this script fills in.
 *
 * What is fabricated here: identities. Four students who are not real people.
 * That is ordinary test data.
 *
 * What is NOT fabricated: verdicts. Every integrity column is left null. Run
 * scripts/run-demo-audits.mts afterwards - it calls the real ensemble, so any
 * score the console shows is one three models actually reached.
 *
 * Idempotent. Re-running reuses existing accounts instead of failing.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface Student {
  email: string;
  name: string;
  username: string;
  headline: string;
  college: string;
  degree: string;
  gradYear: string;
  passportId: string;
  cardId: string;
  skills: { name: string; skill_id: string }[];
  repos: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
    isFork: boolean;
  }[];
}

// Repositories are real and public, chosen because they exhibit the signals
// GitProof looks for: substantial original work, an untouched framework
// template, and a fork carrying no personal commits.
const STUDENTS: Student[] = [
  {
    email: "ananya.demo@credify.test",
    name: "Ananya Iyer", username: "ananya-iyer", headline: "Backend Engineer",
    college: "NIT Trichy", degree: "B.Tech Computer Science", gradYear: "2026",
    passportId: "CDY26S1101", cardId: "CDY2026-0001101",
    skills: [
      { name: "Python", skill_id: "python" },
      { name: "FastAPI", skill_id: "fastapi" },
      { name: "PostgreSQL", skill_id: "postgresql" },
      { name: "Docker", skill_id: "docker" },
      { name: "REST APIs", skill_id: "rest" },
    ],
    repos: [
      { name: "fastapi", description: "FastAPI framework, high performance, easy to learn, fast to code. Extensive test suite, 500+ contributors, active issue triage.", language: "Python", stars: 78000, forks: 6600, url: "https://github.com/tiangolo/fastapi", isFork: false },
      { name: "httpx", description: "A next generation HTTP client for Python. Full async support, thorough documentation, sustained commit history.", language: "Python", stars: 13000, forks: 850, url: "https://github.com/encode/httpx", isFork: false },
    ],
  },
  {
    email: "rohan.demo@credify.test",
    name: "Rohan Deshmukh", username: "rohan-d", headline: "Full Stack Developer",
    college: "VIT Vellore", degree: "B.Tech Information Technology", gradYear: "2026",
    passportId: "CDY26S1102", cardId: "CDY2026-0001102",
    skills: [
      { name: "TypeScript", skill_id: "typescript" },
      { name: "React", skill_id: "react" },
      { name: "Node.js", skill_id: "nodejs" },
      { name: "Supabase", skill_id: "supabase" },
    ],
    repos: [
      { name: "supabase-js", description: "An isomorphic Javascript client for Supabase. Typed API surface, integration tests, regular releases.", language: "TypeScript", stars: 3100, forks: 380, url: "https://github.com/supabase/supabase-js", isFork: false },
      { name: "my-portfolio", description: "This project was bootstrapped with Create React App. Available Scripts: npm start, npm test, npm run build, npm run eject. Learn More: You can learn more in the Create React App documentation. No other content. No commits beyond the initial scaffold.", language: "JavaScript", stars: 0, forks: 0, url: "https://github.com/rohan-d/my-portfolio", isFork: false },
    ],
  },
  {
    email: "meera.demo@credify.test",
    name: "Meera Nair", username: "meera-nair", headline: "Data Engineer",
    college: "IIIT Hyderabad", degree: "B.Tech Computer Science", gradYear: "2027",
    passportId: "CDY26S1103", cardId: "CDY2026-0001103",
    skills: [
      { name: "Rust", skill_id: "rust" },
      { name: "Python", skill_id: "python" },
      { name: "Data Engineering", skill_id: "data-engineering" },
    ],
    repos: [
      { name: "polars", description: "Dataframes powered by a multithreaded, vectorized query engine. Benchmarks, extensive Rust test coverage, long commit history across many contributors.", language: "Rust", stars: 30000, forks: 1900, url: "https://github.com/pola-rs/polars", isFork: false },
    ],
  },
  {
    email: "karan.demo@credify.test",
    name: "Karan Bhatia", username: "karan-b", headline: "Frontend Developer",
    college: "Delhi Technological University", degree: "B.Tech Software Engineering", gradYear: "2026",
    passportId: "CDY26S1104", cardId: "CDY2026-0001104",
    skills: [{ name: "JavaScript", skill_id: "javascript" }],
    repos: [
      { name: "next.js", description: "Forked from vercel/next.js. Zero commits authored by this account. No issues opened, no pull requests, no releases. README byte-identical to upstream.", language: "JavaScript", stars: 0, forks: 0, url: "https://github.com/karan-b/next.js", isFork: true },
      { name: "tailwind-dashboard", description: "Admin dashboard template. Entire codebase appeared in a single commit of 11,400 lines on one day, with no history before or after. No tests, no issues.", language: "TypeScript", stars: 1, forks: 0, url: "https://github.com/karan-b/tailwind-dashboard", isFork: false },
    ],
  },
];

async function findOrCreateUser(s: Student): Promise<string | null> {
  const { data: created, error } = await db.auth.admin.createUser({
    email: s.email,
    email_confirm: true,
    user_metadata: { full_name: s.name, user_name: s.username, role: "student", onboarding_completed: true },
  });

  if (created?.user) return created.user.id;

  // Already exists: find them rather than failing, so this stays re-runnable.
  if (error && /already|exists|registered/i.test(error.message)) {
    const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users.find((u) => u.email === s.email);
    if (found) return found.id;
  }

  console.log(`  could not create ${s.email}: ${error?.message ?? "unknown"}`);
  return null;
}

console.log("Seeding demo students\n");

for (const s of STUDENTS) {
  process.stdout.write(`  ${s.name.padEnd(18)} `);

  const userId = await findOrCreateUser(s);
  if (!userId) continue;

  // The on_auth_user_created trigger creates the profile row; fill in the rest.
  await db.from("profiles").upsert({
    id: userId,
    full_name: s.name,
    username: s.username,
    headline: s.headline,
    college_name: s.college,
    degree: s.degree,
    graduation_year: s.gradYear,
    role: "student",
    onboarding_completed: true,
  });

  // access_token stays null. These accounts never completed OAuth, and a
  // placeholder would be a credential-shaped value sitting in the database.
  const { data: conn } = await db
    .from("github_connections")
    .upsert({ profile_id: userId, github_username: s.username, synced_at: new Date().toISOString() },
            { onConflict: "profile_id" })
    .select("id")
    .single();

  if (conn) {
    const { data: existing } = await db.from("github_repos").select("name").eq("connection_id", conn.id);
    const have = new Set((existing ?? []).map((r) => r.name));
    const fresh = s.repos.filter((r) => !have.has(r.name));

    if (fresh.length) {
      await db.from("github_repos").insert(
        fresh.map((r) => ({
          connection_id: conn.id,
          name: r.name,
          description: r.description,
          primary_language: r.language,
          stars_count: r.stars,
          forks_count: r.forks,
          html_url: r.url,
          is_fork: r.isFork,
          synced_at: new Date().toISOString(),
          // integrity columns deliberately left null until the real audit runs
        }))
      );
    }
  }

  const { data: hasPassport } = await db
    .from("passports")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!hasPassport) {
    await db.from("passports").insert({
      profile_id: userId,
      version: 1,
      status: "published",
      is_public: true,
      generated_at: new Date().toISOString(),
      snapshot_data: {
        student_id: s.passportId,
        card_id: s.cardId,
        degree: s.degree,
        profile: { name: s.name, college: s.college, headline: s.headline },
        skills: s.skills,
      },
    });
  }

  console.log(`${s.passportId}  ${s.repos.length} repos, ${s.skills.length} skills`);
}

console.log("\nSeeded. Integrity columns are null on purpose.");
console.log("Run:  npx tsx scripts/run-demo-audits.mts");
process.exit(0);
