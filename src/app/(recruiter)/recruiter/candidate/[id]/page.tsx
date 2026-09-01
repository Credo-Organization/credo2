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

  // is_public is the authorisation. The service-role client is used because the
  // student owns these rows and a recruiter is not the owner, so the filter has
  // to be explicit rather than left to a policy.
  const admin = createAdminClient();
  const { data: passport } = safeId
    ? await admin
        .from("passports")
        .select("*, profiles(id, full_name, college_name, degree, headline)")
        .eq("is_public", true)
        .or(`snapshot_data->>student_id.eq.${safeId},snapshot_data->>card_id.eq.${safeId}`)
        .limit(1)
        .maybeSingle()
    : { data: null };

  if (!passport) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <ShieldQuestion className="w-6 h-6 text-amber-700" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">No published passport found</h1>
        <p className="text-[13px] text-stone-500 max-w-sm mx-auto leading-relaxed">
          Nothing matches <span className="font-mono text-stone-700">{id}</span>. Either the
          identifier is wrong, or the student has not shared this passport.
        </p>
        <Link
          href="/recruiter"
          className="inline-flex items-center gap-2 text-[13px] text-stone-500 hover:text-stone-900 mt-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to shortlist
        </Link>
      </div>
    );
  }

  const snap = (passport.snapshot_data ?? {}) as {
    student_id?: string;
    skills?: { name: string }[];
    profile?: { name?: string; college?: string; headline?: string };
  };

  // This page resolves by student id or by the card id printed on the physical
  // card, but the shortlist is keyed on the student id alone. Everything that
  // touches saved_candidates below uses the resolved id rather than whichever
  // one was typed, so saving, removing and the initial button state agree.
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

  // Flagged first: the exception is what a recruiter needs to see, not the norm.
  const list = ([...(repos ?? [])] as AuditRow[]).sort(
    (a, b) => (a.integrity_score ?? 101) - (b.integrity_score ?? 101)
  );
  const verified = list.filter((r) => r.integrity_status === "verified").length;
  const flagged = list.filter((r) => r.integrity_status === "flagged").length;
  const skills = snap.skills ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <Link
        href="/recruiter"
        className="inline-flex items-center gap-1.5 text-[12px] text-stone-500 hover:text-stone-900 w-fit transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Shortlist
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Candidate
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            {profile?.full_name || snap.profile?.name || safeId}
          </h1>
          <p className="text-[13px] text-stone-500">
            {profile?.headline || snap.profile?.headline || "No headline"} ·{" "}
            {profile?.college_name || snap.profile?.college || "Institution not stated"} ·{" "}
            <span className="font-mono text-stone-500">{safeId}</span>
          </p>
        </div>
        <SaveButton passportId={canonicalId} initiallySaved={Boolean(saved)} />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl border border-stone-200 overflow-hidden">
        {[
          { k: "Repositories", v: list.length },
          { k: "Verified", v: verified },
          { k: "Flagged", v: flagged, warn: flagged > 0 },
          { k: "Certificates", v: certs?.length ?? 0 },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-4 py-3 bg-white ${i < 3 ? "md:border-r border-stone-200" : ""} ${
              i < 2 ? "border-b md:border-b-0 border-stone-200" : ""
            } ${i === 0 || i === 2 ? "border-r md:border-r" : ""}`}
          >
            <div
              className={`font-mono text-xl font-semibold tabular-nums leading-none ${
                s.warn ? "text-rose-700" : "text-stone-900"
              }`}
            >
              {s.v}
            </div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-stone-500 mt-1.5">{s.k}</div>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            GitProof audit
          </h2>
          <span className="text-[11px] text-stone-500">lowest integrity first</span>
        </div>
        <RepoAuditTable repos={list} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-stone-200 p-4 flex flex-col gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Verified skills
            <span className="ml-1.5 font-mono tabular-nums text-stone-500">{skills.length}</span>
          </h2>
          {skills.length === 0 ? (
            <p className="text-[13px] text-stone-500">No verified skills yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <li
                  key={i}
                  className="px-2.5 py-1 rounded-md border border-stone-200 bg-stone-50 text-[12px] text-stone-700"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-stone-200 p-4 flex flex-col gap-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Certificates
            <span className="ml-1.5 font-mono tabular-nums text-stone-500">{certs?.length ?? 0}</span>
          </h2>
          {(certs?.length ?? 0) === 0 ? (
            <p className="text-[13px] text-stone-500">No certificates uploaded.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {certs!.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Award className="w-3.5 h-3.5 text-stone-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-[13px] text-stone-900 block truncate leading-tight">{c.title}</span>
                    <span className="text-[11px] text-stone-500">
                      {c.issuer || "Issuer not stated"}
                      {c.sha256_hash ? " · SHA-256 verified" : ""}
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
