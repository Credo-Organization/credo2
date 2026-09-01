import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ShortlistTable, type ShortlistRow } from "@/components/recruiter/shortlist-table";

export default async function RecruiterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Own shortlist only. RLS enforces this at the database, not here.
  const { data: saved } = await supabase
    .from("saved_candidates")
    .select("passport_id, saved_at")
    .eq("recruiter_id", user.id)
    .order("saved_at", { ascending: false });

  const ids = (saved ?? []).map((s) => s.passport_id);
  let rows: ShortlistRow[] = [];

  if (ids.length > 0) {
    // Passports, repositories and connections are read with the service-role
    // client: their RLS policies scope reads to the owning student, and a
    // recruiter is not the owner. is_public is what authorises this view, so it
    // is applied as an explicit filter rather than left to the policy.
    const admin = createAdminClient();

    const { data: passports } = await admin
      .from("passports")
      .select("snapshot_data, profile_id, profiles(full_name, college_name, headline)")
      .eq("is_public", true)
      .in("snapshot_data->>student_id", ids);

    const profileIds = (passports ?? []).map((p) => p.profile_id).filter(Boolean);

    const { data: connections } = profileIds.length
      ? await admin.from("github_connections").select("id, profile_id").in("profile_id", profileIds)
      : { data: [] };

    const connectionIds = (connections ?? []).map((c) => c.id);

    const { data: repos } = connectionIds.length
      ? await admin
          .from("github_repos")
          .select("connection_id, integrity_status")
          .in("connection_id", connectionIds)
      : { data: [] };

    const connectionToProfile = new Map((connections ?? []).map((c) => [c.id, c.profile_id]));
    const stats = new Map<string, { repos: number; verified: number; flagged: number }>();
    for (const r of repos ?? []) {
      const pid = connectionToProfile.get(r.connection_id);
      if (!pid) continue;
      const s = stats.get(pid) ?? { repos: 0, verified: 0, flagged: 0 };
      s.repos++;
      if (r.integrity_status === "verified") s.verified++;
      if (r.integrity_status === "flagged") s.flagged++;
      stats.set(pid, s);
    }

    const savedAt = new Map((saved ?? []).map((s) => [s.passport_id, s.saved_at]));

    rows = (passports ?? [])
      .map((p) => {
        const snap = (p.snapshot_data ?? {}) as {
          student_id?: string;
          skills?: unknown[];
          profile?: { name?: string; college?: string; headline?: string };
        };
        const prof = p.profiles as { full_name?: string; college_name?: string; headline?: string } | null;
        const id = snap.student_id ?? "";
        const s = stats.get(p.profile_id) ?? { repos: 0, verified: 0, flagged: 0 };
        const when = savedAt.get(id);

        return {
          passportId: id,
          name: prof?.full_name || snap.profile?.name || id,
          college: prof?.college_name || snap.profile?.college || "Institution not stated",
          headline: prof?.headline || snap.profile?.headline || "",
          repos: s.repos,
          verified: s.verified,
          flagged: s.flagged,
          skills: Array.isArray(snap.skills) ? snap.skills.length : 0,
          savedAt: when
            ? new Date(when).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
            : "",
        };
      })
      // Preserve the order the recruiter saved them in.
      .sort((a, b) => ids.indexOf(a.passportId) - ids.indexOf(b.passportId));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          Recruiter console
        </span>
        <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-100">Candidate shortlist</h1>
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
          Every figure below comes from an audit that actually ran. Open a candidate to see which
          models reached each verdict.
        </p>
      </header>

      <ShortlistTable rows={rows} />
    </div>
  );
}
