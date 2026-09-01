/**
 * Proves the student evidence tables are not readable with the anon key.
 *
 *   node scripts/verify-rls.mjs
 *
 * The anon key ships inside every browser bundle, so anything it can read is
 * public whether or not the UI shows it. This connects exactly as an anonymous
 * visitor would and counts what comes back. Non-zero means the RLS policies in
 * scripts/fix-rls-student-data.sql have not been applied, or were overridden by
 * a permissive policy left in place - Postgres ORs permissive policies
 * together, so one `USING (true)` re-opens everything.
 *
 * Exits non-zero on a leak, so it can gate a deploy.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env");
  process.exit(2);
}

// No session: this is a drive-by visitor, not a signed-in student.
const db = createClient(url, anon, { auth: { persistSession: false } });

const TABLES = ["github_repos", "repo_languages", "evidence_claims", "certificates", "evidence"];

let leaked = 0;

for (const table of TABLES) {
  const { count, error } = await db.from(table).select("*", { count: "exact", head: true });

  if (error) {
    // A permission error is the desired outcome for a locked-down table.
    console.log(`  ok      ${table.padEnd(18)} anon blocked (${error.code || error.message})`);
    continue;
  }

  if (count && count > 0) {
    console.log(`  LEAK    ${table.padEnd(18)} anon read ${count} row(s)`);
    leaked++;
  } else {
    console.log(`  ok      ${table.padEnd(18)} anon read 0 rows`);
  }
}

if (leaked > 0) {
  console.error(
    `\n${leaked} table(s) readable by the anon key.\n` +
      "Apply scripts/fix-rls-student-data.sql, then re-run.\n" +
      "If it still leaks, look for a leftover `USING (true)` SELECT policy on that table."
  );
  process.exit(1);
}

console.log("\nNo student data readable with the anon key.");
