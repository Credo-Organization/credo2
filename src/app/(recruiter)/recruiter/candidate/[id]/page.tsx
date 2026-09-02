import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { SaveButton } from "@/components/recruiter/save-button";
import { RepoAuditTable, type AuditRow } from "@/components/recruiter/repo-audit-table";
import { ShieldQuestion, ArrowLeft, Award } from "lucide-react";
import Link from "next/link";

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const safeId = id.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(safeId);
  const upperSafeId = safeId.toUpperCase();
  const filterOr = isUuid
    ? `id.eq.${safeId},snapshot_data->>student_id.eq.${upperSafeId},snapshot_data->>card_id.eq.${upperSafeId}`
    : `snapshot_data->>student_id.eq.${upperSafeId},snapshot_data->>card_id.eq.${upperSafeId},snapshot_data->>student_id.eq.${safeId},snapshot_data->>card_id.eq.${safeId}`;

  const admin = createAdminClient();
  let { data: passport } = safeId
    ? await admin
        .from("passports")
        .select("*, profiles(id, full_name, college_name, degree, headline)")
        .eq("is_public", true)
        .or(filterOr)
        .limit(1)
        .maybeSingle()
    : { data: null };

  // Fallback: If not matched by passport IDs, check if safeId matches a profile username or name
  if (!passport && safeId) {
    const { data: profileMatch } = await admin
      .from("profiles")
      .select("id")
      .or(`username.ilike.${safeId},full_name.ilike.%${safeId}%`)
      .limit(1)
      .maybeSingle();

    if (profileMatch?.id) {
      const { data: matchedPassport } = await admin
        .from("passports")
        .select("*, profiles(id, full_name, college_name, degree, headline)")
        .eq("profile_id", profileMatch.id)
        .eq("is_public", true)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (matchedPassport) {
        passport = matchedPassport;
      }
    }
  }

  if (!passport) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ShieldQuestion className="w-7 h-7 text-amber-700 dark:text-amber-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-zinc-950 dark:text-zinc-100 mb-2">No Published Passport Found</h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed font-medium">
          Nothing matches <span className="font-mono font-bold text-zinc-950 dark:text-zinc-100">{id}</span>. Either the
          identifier is incorrect, or the student has not publicly shared this passport.
        </p>
        <Link
          href="/recruiter"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white mt-6 transition-colors rounded-xl px-4 py-2 border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Shortlist
        </Link>
      </div>
    );
  }

  const snap = (passport.snapshot_data ?? {}) as {
    student_id?: string;
    skills?: { name: string }[];
    profile?: { name?: string; college?: string; headline?: string };
  };

  const canonicalId = snap.student_id ?? safeId;
  const profile = passport.profiles as {
    id?: string;
    full_name?: string;
    college_name?: string;
    headline?: string;
  } | null;

  const { data: connection } = profile?.id
    ? await admin.from("github_connections").select("id").eq("profile_id", profile.id).maybeSingle()
    : { data: null };

  const { data: repos } = connection
    ? await admin
        .from("github_repos")
        .select("name, primary_language, integrity_status, integrity_score, integrity_flags, audit_votes")
        .eq("connection_id", connection.id)
    : { data: [] };

  const { data: certs } = profile?.id
    ? await admin.from("certificates").select("title, issuer, sha256_hash").eq("profile_id", profile.id)
    : { data: [] };

  const { data: saved } = user
    ? await supabase
        .from("saved_candidates")
        .select("id")
        .eq("recruiter_id", user.id)
        .eq("passport_id", canonicalId)
        .maybeSingle()
    : { data: null };

  const list = ([...(repos ?? [])] as AuditRow[]).sort(
    (a, b) => (a.integrity_score ?? 101) - (b.integrity_score ?? 101)
  );
  const verified = list.filter((r) => r.integrity_status === "verified").length;
  const flagged = list.filter((r) => r.integrity_status === "flagged").length;
  const skills = snap.skills ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 select-none">
      <Link
        href="/recruiter"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white w-fit transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Shortlist
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-6 rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xs transition-colors">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Candidate Verification Dossier
          </span>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-100">
            {profile?.full_name || snap.profile?.name || safeId}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            {profile?.headline || snap.profile?.headline || "Software Engineer"} ·{" "}
            <span className="font-bold text-zinc-950 dark:text-zinc-100">{profile?.college_name || snap.profile?.college || "Institution not stated"}</span> ·{" "}
            <span className="font-mono text-zinc-500 dark:text-zinc-400 font-bold">{safeId}</span>
          </p>
        </div>
        <SaveButton passportId={canonicalId} initiallySaved={Boolean(saved)} />
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden shadow-xs bg-white dark:bg-zinc-900 transition-colors">
        {[
          { k: "Repositories", v: list.length },
          { k: "Verified Clean", v: verified },
          { k: "Integrity Flags", v: flagged, warn: flagged > 0 },
          { k: "Certificates", v: certs?.length ?? 0 },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-5 py-3.5 bg-white dark:bg-zinc-900 ${i < 3 ? "md:border-r-2 border-zinc-900 dark:border-zinc-700" : ""} ${
              i < 2 ? "border-b-2 md:border-b-0 border-zinc-900 dark:border-zinc-700" : ""
            } ${i === 0 || i === 2 ? "border-r-2 md:border-r-2" : ""}`}
          >
            <div
              className={`font-mono text-2xl font-black tabular-nums leading-none ${
                s.warn ? "text-rose-600 dark:text-rose-400" : "text-zinc-950 dark:text-zinc-100"
              }`}
            >
              {s.v}
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-zinc-500 dark:text-zinc-400 mt-1.5">{s.k}</div>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
            GitProof™ Repository Ingestion & Integrity
          </h2>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Lowest integrity sorted first</span>
        </div>
        <RepoAuditTable repos={list} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 p-6 flex flex-col gap-3 bg-white dark:bg-zinc-900 shadow-xs transition-colors">
          <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100 flex items-center justify-between">
            <span>Verified Skills</span>
            <span className="font-mono text-zinc-500 dark:text-zinc-400 font-bold">{skills.length}</span>
          </h2>
          {skills.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">No verified skills detected yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <li
                  key={i}
                  className="px-3 py-1.5 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-100 shadow-xs"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 p-6 flex flex-col gap-3 bg-white dark:bg-zinc-900 shadow-xs transition-colors">
          <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100 flex items-center justify-between">
            <span>Verifiable Certificates</span>
            <span className="font-mono text-zinc-500 dark:text-zinc-400 font-bold">{certs?.length ?? 0}</span>
          </h2>
          {(certs?.length ?? 0) === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">No certificates uploaded.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {certs!.map((c, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
                    <Award className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 block truncate">{c.title}</span>
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                      {c.issuer || "Issuer not stated"}
                      {c.sha256_hash ? " · SHA-256 sealed" : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
