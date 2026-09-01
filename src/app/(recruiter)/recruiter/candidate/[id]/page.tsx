import Link from "next/link";
import {
  ArrowLeft,
  ShieldQuestion,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  Award,
  ShieldCheck,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { SaveButton } from "@/components/recruiter/save-button";
import { agreementFromVotes } from "@/lib/ai/agreement";

function safeId(raw: string): string {
  return raw.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);
}

interface RepoRow {
  name: string;
  primary_language: string | null;
  integrity_status: string | null;
  integrity_score: number | null;
  integrity_flags: unknown;
  audit_votes: unknown;
}

interface CertRow {
  title: string;
  issuer: string | null;
  sha256_hash: string | null;
}

interface CandidateProfile {
  id: string;
  full_name: string | null;
  college_name: string | null;
  degree: string | null;
}

function flagsToList(flags: unknown): string[] {
  if (!Array.isArray(flags)) return [];
  return flags.filter((f): f is string => typeof f === "string");
}

function statusBadgeClasses(status: string | null): string {
  if (status === "verified") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  if (status === "flagged") return "bg-rose-500/10 border-rose-500/30 text-rose-400";
  return "bg-amber-500/10 border-amber-500/30 text-amber-400";
}

function statusIcon(status: string | null) {
  if (status === "verified") return <CheckCircle2 className="w-3 h-3" />;
  if (status === "flagged") return <AlertTriangle className="w-3 h-3" />;
  return <ShieldQuestion className="w-3 h-3" />;
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const safe = safeId(id);

  const admin = createAdminClient();

  const { data: passport } = safe
    ? await admin
        .from("passports")
        .select("*, profiles(id, full_name, college_name, degree)")
        .eq("is_public", true)
        .or(`snapshot_data->>student_id.eq.${safe},snapshot_data->>card_id.eq.${safe}`)
        .limit(1)
        .maybeSingle()
    : { data: null };

  if (!passport) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
          <ShieldQuestion className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">No published passport found</h1>
        <p className="text-sm text-white/50 max-w-sm">
          No published Credify passport matches
          <span className="font-mono text-white/70"> {id}</span>. Either the
          identifier is wrong, or the student has not shared this passport
          publicly.
        </p>
        <Link
          href="/recruiter"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mt-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shortlist
        </Link>
      </div>
    );
  }

  const profile = (passport as { profiles?: CandidateProfile | null }).profiles ?? null;

  let repos: RepoRow[] = [];
  if (profile?.id) {
    const { data: connection } = await admin
      .from("github_connections")
      .select("id")
      .eq("profile_id", profile.id)
      .maybeSingle();

    if (connection) {
      const { data: repoRows } = await admin
        .from("github_repos")
        .select("name, primary_language, integrity_status, integrity_score, integrity_flags, audit_votes")
        .eq("connection_id", connection.id)
        .order("integrity_score", { ascending: true });
      repos = repoRows ?? [];
    }
  }

  const { data: certRows } = profile?.id
    ? await admin
        .from("certificates")
        .select("title, issuer, sha256_hash")
        .eq("profile_id", profile.id)
    : { data: null };
  const certificates: CertRow[] = certRows ?? [];

  // Whether this recruiter has already saved this candidate must respect RLS,
  // so it goes through the normal client rather than the admin one used above.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initiallySaved = false;
  if (user) {
    const { data: savedRow } = await supabase
      .from("saved_candidates")
      .select("id")
      .eq("recruiter_id", user.id)
      .eq("passport_id", safe)
      .maybeSingle();
    initiallySaved = !!savedRow;
  }

  const snapshot = (passport as { snapshot_data?: Record<string, unknown> | null }).snapshot_data;
  const rawSkills = snapshot && Array.isArray(snapshot.skills) ? snapshot.skills : [];
  const skills = rawSkills.filter(
    (s): s is { name: string } =>
      typeof s === "object" && s !== null && typeof (s as { name?: unknown }).name === "string"
  );

  const verifiedCount = repos.filter((r) => r.integrity_status === "verified").length;
  const flaggedCount = repos.filter((r) => r.integrity_status === "flagged").length;

  const displayName = profile?.full_name || "Unnamed Candidate";
  const subtitle = [profile?.degree, profile?.college_name].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-[#050811] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/recruiter"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shortlist
        </Link>

        {/* Header */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Credify Passport
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{displayName}</h1>
            {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
            <p className="text-xs font-mono text-white/40 mt-1">{safe}</p>
          </div>
          <SaveButton passportId={safe} initiallySaved={initiallySaved} />
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/40 block mb-1.5">
              Repositories
            </span>
            <span className="text-xl font-extrabold text-white">{repos.length}</span>
          </div>
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/40 block mb-1.5">
              Verified
            </span>
            <span className="text-xl font-extrabold text-emerald-400">{verifiedCount}</span>
          </div>
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/40 block mb-1.5">
              Flagged
            </span>
            <span className="text-xl font-extrabold text-rose-400">{flaggedCount}</span>
          </div>
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/40 block mb-1.5">
              Certificates
            </span>
            <span className="text-xl font-extrabold text-white">{certificates.length}</span>
          </div>
        </div>

        {/* GitProof audit section */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold text-white">GitProof Audit</h2>
          </div>

          {repos.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/[0.08]">
              <FolderGit2 className="w-8 h-8 text-white/20 mb-2.5" />
              <h4 className="text-sm font-bold text-white/70">No repositories audited</h4>
              <p className="text-xs text-white/40 max-w-xs mt-1">
                This candidate has not connected a GitHub account, or GitProof has not
                completed a scan yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {repos.map((repo, idx) => {
                const flags = flagsToList(repo.integrity_flags);
                const agreement = agreementFromVotes(repo.audit_votes);
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-white truncate">{repo.name}</span>
                        {repo.primary_language && (
                          <span className="text-xs text-white/40">{repo.primary_language}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClasses(
                            repo.integrity_status
                          )}`}
                        >
                          {statusIcon(repo.integrity_status)}
                          {repo.integrity_status ?? "pending"} ({repo.integrity_score ?? 0}%)
                        </span>
                        {agreement && (
                          <span className="text-[10px] font-mono text-white/40">
                            {agreement} models agreed
                          </span>
                        )}
                      </div>
                    </div>
                    {flags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {flags.map((flag, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-medium"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Skills & Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-white">Verified Skills</h2>
            </div>
            {skills.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/[0.08]">
                <Sparkles className="w-7 h-7 text-white/20 mb-2" />
                <p className="text-xs text-white/40 max-w-xs">
                  No verified skills are attached to this passport yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/80 font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-white">Certificates</h2>
            </div>
            {certificates.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/[0.08]">
                <Award className="w-7 h-7 text-white/20 mb-2" />
                <p className="text-xs text-white/40 max-w-xs">
                  No certificates have been uploaded for this candidate.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{cert.title}</h4>
                      <p className="text-xs text-white/40 truncate">
                        {cert.issuer || "Unknown issuer"}
                      </p>
                      {cert.sha256_hash && (
                        <p className="text-[10px] font-mono text-white/30 truncate mt-0.5">
                          sha256:{cert.sha256_hash.slice(0, 16)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
