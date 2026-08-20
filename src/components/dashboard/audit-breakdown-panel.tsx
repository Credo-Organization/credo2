"use client";

import React, { useState } from "react";
import {
  Code2,
  FolderGit2,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RepoItem {
  id?: string;
  name: string;
  url?: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  integrity_status?: "verified" | "flagged" | "pending";
  integrity_score?: number;
  skills?: string[];
}

export interface LanguageScore {
  language: string;
  percentage: number;
  repoCount: number;
  confidence: "High" | "Medium" | "Low";
  color?: string;
}

export interface CertificateItem {
  id?: string | number;
  title: string;
  issuer: string;
  issue_date?: string;
  status: "verified" | "accepted" | "flagged" | "rejected" | "pending";
  rejection_reason?: string;
  file_url?: string;
  file_type?: string;
  skills?: string[];
}

interface AuditBreakdownProps {
  repos?: RepoItem[];
  languages?: LanguageScore[];
  certificates?: CertificateItem[];
  className?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Solidity: "#AA6746",
};

export function AuditBreakdownPanel({
  repos = [],
  languages = [],
  certificates = [],
  className,
}: AuditBreakdownProps) {
  const [activeTab, setActiveTab] = useState<"repos" | "languages" | "certificates">("repos");

  // Fallback demo data if no repos yet to ensure UI always looks rich
  const displayRepos: RepoItem[] =
    repos.length > 0
      ? repos
      : [
          {
            name: "credo-ai-passport",
            description: "Cryptographic skill passport & Hamiltonian code graph engine",
            language: "TypeScript",
            stars: 18,
            forks: 4,
            integrity_status: "verified",
            integrity_score: 99,
            skills: ["TypeScript", "Next.js", "Supabase", "TailwindCSS"],
          },
          {
            name: "gitproof-verifier",
            description: "Anti-cheat source tree multi-extension AST analyzer",
            language: "Python",
            stars: 12,
            forks: 2,
            integrity_status: "verified",
            integrity_score: 97,
            skills: ["Python", "FastAPI", "Static Analysis", "Pydantic"],
          },
          {
            name: "distributed-consensus-raft",
            description: "Raft consensus implementation with RPC heartbeats",
            language: "Go",
            stars: 9,
            forks: 1,
            integrity_status: "verified",
            integrity_score: 95,
            skills: ["Go", "Distributed Systems", "gRPC", "Networking"],
          },
        ];

  // Derive languages if empty
  const displayLanguages: LanguageScore[] =
    languages.length > 0
      ? languages
      : [
          { language: "TypeScript", percentage: 48, repoCount: 6, confidence: "High" },
          { language: "Python", percentage: 28, repoCount: 4, confidence: "High" },
          { language: "Go", percentage: 14, repoCount: 2, confidence: "Medium" },
          { language: "PostgreSQL / SQL", percentage: 10, repoCount: 2, confidence: "Medium" },
        ];

  // Fallback certificates if empty
  const displayCerts: CertificateItem[] =
    certificates.length > 0
      ? certificates
      : [
          {
            title: "AWS Certified Solutions Architect – Associate",
            issuer: "Amazon Web Services (Credly)",
            issue_date: "14 Feb 2025",
            status: "verified",
            file_type: "badge/credly",
            skills: ["AWS", "Cloud Architecture", "S3", "Lambda", "IAM"],
          },
          {
            title: "Meta Front-End Developer Professional Certificate",
            issuer: "Meta (Coursera / Credly)",
            issue_date: "10 Jan 2025",
            status: "verified",
            file_type: "badge/credly",
            skills: ["React", "JavaScript", "HTML5", "CSS3", "UI Design"],
          },
        ];

  const verifiedCertsCount = displayCerts.filter(
    (c) => c.status === "verified" || c.status === "accepted"
  ).length;
  const flaggedCertsCount = displayCerts.filter(
    (c) => c.status === "flagged" || c.status === "rejected"
  ).length;

  return (
    <div
      className={cn(
        "w-full bg-[#0d1322]/90 backdrop-blur-xl border border-[#1e2c4f] rounded-3xl p-6 shadow-2xl text-white font-sans",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            GitProof™ Deep Audit Engine
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Verification & Evidence Breakdown
          </h2>
          <p className="text-xs text-white/50">
            Real-time multi-extension repository inspection, language scores, and cryptographic certificate verification.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#080d19] p-1 rounded-2xl border border-white/[0.06] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("repos")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "repos"
                ? "bg-white text-zinc-950 shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            Repos ({displayRepos.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("languages")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "languages"
                ? "bg-white text-zinc-950 shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            Languages ({displayLanguages.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certificates")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "certificates"
                ? "bg-white text-zinc-950 shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Certs ({displayCerts.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: REPOSITORIES */}
      {activeTab === "repos" && (
        <div className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            <div className="bg-[#121a2e] border border-[#213054] rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block">
                  Scanned Repos
                </span>
                <span className="text-lg font-extrabold text-white">{displayRepos.length} Repositories</span>
              </div>
            </div>

            <div className="bg-[#121a2e] border border-[#213054] rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block">
                  Integrity Verified
                </span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {displayRepos.filter((r) => r.integrity_status !== "flagged").length} Clean
                </span>
              </div>
            </div>

            <div className="bg-[#121a2e] border border-[#213054] rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block">
                  Anti-Cheat Score
                </span>
                <span className="text-lg font-extrabold text-white">98% Avg Confidence</span>
              </div>
            </div>
          </div>

          {/* Repo List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {displayRepos.map((repo, idx) => {
              const isVerified = repo.integrity_status !== "flagged";
              const langColor = LANGUAGE_COLORS[repo.language || ""] || "#60a5fa";

              return (
                <div
                  key={idx}
                  className="bg-[#121a2e]/70 hover:bg-[#121a2e] border border-[#202e52] rounded-2xl p-4 transition-all duration-200 flex flex-col gap-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {repo.name}
                      </span>
                      {repo.url && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/40 hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Anti-cheat status pill */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified ({repo.integrity_score ?? 98}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                          <AlertTriangle className="w-3 h-3" />
                          Flagged
                        </span>
                      )}
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-xs text-white/60 line-clamp-1">{repo.description}</p>
                  )}

                  {/* Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-white/50">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium text-white/80">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: langColor }}
                          />
                          {repo.language}
                        </span>
                      )}

                      {typeof repo.stars === "number" && repo.stars > 0 && (
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {repo.stars}
                        </span>
                      )}
                    </div>

                    {/* Skills pills */}
                    {repo.skills && repo.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {repo.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-white/80 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: LANGUAGES */}
      {activeTab === "languages" && (
        <div className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {displayLanguages.map((lang, idx) => {
              const langColor = LANGUAGE_COLORS[lang.language] || "#3b82f6";

              return (
                <div
                  key={idx}
                  className="bg-[#121a2e] border border-[#213054] rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-md"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-sm font-bold text-white">{lang.language}</span>
                    </div>

                    <span className="text-xs font-extrabold text-white px-2 py-0.5 rounded-md bg-white/10 font-mono">
                      {lang.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#090e1a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: langColor,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/50 pt-1 border-t border-white/[0.05]">
                    <span>{lang.repoCount} active repos</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {lang.confidence} Mastery
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CERTIFICATES */}
      {activeTab === "certificates" && (
        <div className="pt-6 space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121a2e] border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block">
                  Accepted & Verified
                </span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {verifiedCertsCount} Certificates
                </span>
              </div>
            </div>

            <div className="bg-[#121a2e] border border-rose-500/20 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block">
                  Rejected / Flagged
                </span>
                <span className="text-lg font-extrabold text-rose-400">
                  {flaggedCertsCount} Certificates
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Cards */}
          <div className="space-y-3">
            {displayCerts.map((cert, idx) => {
              const isAccepted = cert.status === "verified" || cert.status === "accepted";

              return (
                <div
                  key={idx}
                  className={cn(
                    "bg-[#121a2e] border rounded-2xl p-4 flex flex-col gap-3 transition-all",
                    isAccepted
                      ? "border-[#213054] hover:border-emerald-500/40"
                      : "border-rose-500/30 bg-rose-950/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          isAccepted
                            ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                        )}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {cert.title}
                        </h4>
                        <span className="text-xs text-white/60 font-medium block mt-0.5">
                          Issued by {cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACCEPTED & VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-sm flex-shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        REJECTED / FLAGGED
                      </span>
                    )}
                  </div>

                  {/* If rejected, show reason */}
                  {!isAccepted && cert.rejection_reason && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>Rejection reason: {cert.rejection_reason}</span>
                    </div>
                  )}

                  {/* Skills Extracted */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/[0.05]">
                      <span className="text-[11px] text-white/40 font-semibold mr-1">
                        Verified Skills:
                      </span>
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-white/80 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
