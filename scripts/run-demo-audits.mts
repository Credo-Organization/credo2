/**
 * Runs the real anti-cheat ensemble over the seeded demo repositories.
 *
 *   npx tsx scripts/run-demo-audits.mts
 *
 * seed-demo-students.mts deliberately leaves every integrity column NULL. This
 * fills them by calling runEnsemble - the same function the product calls during
 * a GitHub sync, against the same three vendors, with the same schema. Nothing
 * here invents a score. If a repository comes back flagged, three models
 * actually looked at it and a majority actually said so.
 *
 * Repositories that already carry a verdict are skipped, so re-running is cheap
 * and idempotent.
 */
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import fs from "node:fs";
import { runEnsemble } from "@/lib/ai/ensemble";

const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
for (const [k, v] of Object.entries(env)) process.env[k] ??= v as string;

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// The production integrity schema, unchanged.
const integritySchema = z.object({
  integrity_score: z.number().min(0).max(100).describe("0-100 score of how authentic this evidence appears"),
  integrity_flags: z.array(z.string()).describe("Specific red flags found. Empty if verified."),
  integrity_status: z.enum(["verified", "flagged"]).describe("verified if score >= 70, else flagged"),
  verified_skills: z.array(z.string()).describe("Languages, frameworks or tools identified. Empty if none."),
});

const SYSTEM = `You are a strict technical recruiter evaluating GitHub repository authenticity.
Decide whether the candidate actually wrote this code, and extract the technologies used.
Look for:
- Repositories that are direct forks of popular projects with zero or few personal commits.
- Suspiciously large single-day commits where thousands of lines appeared at once.
- Lack of meaningful commit history or issues.
- Generic default READMEs (for example "Create React App" or a Next.js template) indicating low-effort work.
Return an integrity score 0-100, specific red flags, a status, and the verified skills.`;

// Resolve the demo cohort by username rather than a hardcoded id: the seeder
// creates real auth users, so their ids differ per environment.
const DEMO_USERNAMES = ["ananya-iyer", "rohan-d", "meera-nair", "karan-b"];

const { data: profiles } = await db
  .from("profiles")
  .select("id")
  .in("username", DEMO_USERNAMES);

const { data: connections } = await db
  .from("github_connections")
  .select("id")
  .in("profile_id", (profiles ?? []).map((p) => p.id));

const connectionIds = (connections ?? []).map((c) => c.id);

if (connectionIds.length === 0) {
  console.error("No demo connections found. Run scripts/seed-demo-students.mts first.");
  process.exit(1);
}

const { data: repos, error } = await db
  .from("github_repos")
  .select("id, name, description, primary_language, stars_count, forks_count, is_fork, integrity_status")
  .in("connection_id", connectionIds);

if (error) {
  console.error("Could not read demo repositories:", error.message);
  process.exit(1);
}

// The column defaults to 'pending', so an unaudited row is not null - it carries
// that default. Both mean the same thing here: no verdict has been reached yet.
const pending = (repos ?? []).filter(
  (r) => !r.integrity_status || r.integrity_status === "pending"
);
console.log(`${repos?.length ?? 0} demo repositories, ${pending.length} awaiting audit\n`);

if (pending.length === 0) {
  console.log("Nothing to do. Every demo repository already carries a verdict.");
  process.exit(0);
}

let flagged = 0;

for (const repo of pending) {
  process.stdout.write(`  ${repo.name.padEnd(22)} `);

  const messages = [
    {
      role: "user" as const,
      content: [
        { type: "text" as const, text: SYSTEM },
        {
          type: "text" as const,
          text: `Repository: ${repo.name}
Description / README: ${repo.description ?? "none"}
Primary language: ${repo.primary_language ?? "unknown"}
Stars: ${repo.stars_count ?? 0}   Forks: ${repo.forks_count ?? 0}
Is a fork: ${repo.is_fork ? "yes" : "no"}`,
        },
      ],
    },
  ];

  try {
    const result = await runEnsemble("ANTI_CHEAT_VERDICT", integritySchema, messages);

    const { error: writeError } = await db
      .from("github_repos")
      .update({
        integrity_status: result.integrity_status,
        integrity_score: result.integrity_score,
        integrity_flags: result.integrity_flags,
        audit_votes: result.votes,
      })
      .eq("id", repo.id);

    if (writeError) {
      console.log(`write failed: ${writeError.message}`);
      continue;
    }

    if (result.integrity_status === "flagged") flagged++;
    console.log(
      `${result.integrity_status.padEnd(9)} score ${String(result.integrity_score).padEnd(4)} ${result.agreement} agreed` +
        (result.integrity_flags.length ? `  [${result.integrity_flags.slice(0, 2).join("; ")}]` : "")
    );
  } catch (e) {
    console.log(`ensemble unavailable: ${e instanceof Error ? e.message.slice(0, 70) : String(e)}`);
  }
}

console.log(
  `\nDone. ${flagged} of ${pending.length} flagged.` +
    (flagged === 0
      ? "\nNo repository was flagged. The demo is weaker without one - check that the fork and template entries were seeded."
      : "")
);

// Exit explicitly: the provider client keeps a handle open, and letting the
// runtime tear it down on its own trips a libuv assertion on Windows.
process.exit(0);
