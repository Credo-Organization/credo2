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
  /** e.g. "3/3" - how many responding models backed this verdict. */
  agreement?: string;
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

function AuditEmptyState({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="py-14 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-stone-200 bg-white">
      <ShieldCheck className="w-9 h-9 text-stone-400 mb-2.5" />
      <h4 className="text-sm font-bold text-stone-900">{label}</h4>
      <p className="text-xs text-stone-500 max-w-xs mt-1">{hint}</p>
    </div>
  );
}

export function AuditBreakdownPanel({
  repos = [],
  languages = [],
  certificates = [],
  className,
}: AuditBreakdownProps) {
  const [activeTab, setActiveTab] = useState<"repos" | "languages" | "certificates">("repos");

  // These arrays are rendered as audited evidence with integrity scores. Filling
  // them with sample repositories when a user has none would put fabricated
  // "99% verified" results in front of a recruiter, which is precisely what
  // GitProof exists to detect. Empty stays empty.
  const displayRepos: RepoItem[] = repos;
  const displayLanguages: LanguageScore[] = languages;
  const displayCerts: CertificateItem[] = certificates;

  const verifiedCertsCount = displayCerts.filter(
    (c) => c.status === "verified" || c.status === "accepted"
  ).length;
  const flaggedCertsCount = displayCerts.filter(
    (c) => c.status === "flagged" || c.status === "rejected"
  ).length;

  return (
    <div
      className={cn(
        "w-full bg-white border border-stone-200 rounded-3xl p-6 shadow-sm font-sans relative overflow-hidden",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 border border-navy-200 text-navy-600 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            GitProof™ Deep Audit Engine
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            Verification & Evidence Breakdown
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time multi-extension repository inspection, language scores, and cryptographic certificate verification.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-50 p-1 rounded-2xl border border-stone-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("repos")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "repos"
                ? "bg-white border border-stone-200/50 text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
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
                ? "bg-white border border-stone-200/50 text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
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
                ? "bg-white border border-stone-200/50 text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            )}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Certs ({displayCerts.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: REPOSITORIES */}
      {activeTab === "repos" && (
        <div className="pt-6 space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-600">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider block">
                  Scanned Repos
                </span>
                <span className="text-lg font-extrabold text-stone-900">{displayRepos.length} Repositories</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider block">
                  Integrity Verified
                </span>
                <span className="text-lg font-extrabold text-emerald-500">
                  {displayRepos.filter((r) => r.integrity_status === "verified").length} Clean
                </span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider block">
                  Anti-Cheat Score
                </span>
                <span className="text-lg font-extrabold text-stone-900">
                  {displayRepos.length === 0
                    ? "No scan yet"
                    : `${Math.round(
                        displayRepos.reduce((sum, r) => sum + (r.integrity_score ?? 0), 0) /
                          displayRepos.length
                      )}% Avg Confidence`}
                </span>
              </div>
            </div>
          </div>

          {/* Repo List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {displayRepos.length === 0 && (
              <AuditEmptyState label="No repositories scanned yet" hint="Connect GitHub from Settings and GitProof will audit every repository on your account." />
            )}
            {displayRepos.map((repo, idx) => {
              const isVerified = repo.integrity_status === "verified";
              const langColor = LANGUAGE_COLORS[repo.language || ""] || "#60a5fa";

              return (
                <div
                  key={idx}
                  className="bg-white hover:bg-white border border-stone-200/50 rounded-2xl p-4 transition-all duration-200 flex flex-col gap-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold text-stone-900 group-hover:text-navy-600 transition-colors truncate">
                        {repo.name}
                      </span>
                      {repo.url && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Anti-cheat status pill */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 border border-emerald-500/30 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified ({repo.integrity_score ?? 98}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-700">
                          <AlertTriangle className="w-3 h-3" />
                          Flagged
                        </span>
                      )}
                      {repo.agreement && (
                        <span className="text-[10px] font-mono text-muted-foreground ml-2">
                          {repo.agreement} models agreed
                        </span>
                      )}
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-xs text-stone-500 line-clamp-1">{repo.description}</p>
                  )}

                  {/* Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-stone-500">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium text-stone-900/80">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: langColor }}
                          />
                          {repo.language}
                        </span>
                      )}

                      {typeof repo.stars === "number" && repo.stars > 0 && (
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
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
                            className="px-2 py-0.5 rounded-md bg-accent border border-stone-200/50 text-[10px] text-stone-900/80 font-medium"
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
            {displayLanguages.length === 0 && (
              <AuditEmptyState label="No language data yet" hint="Language confidence is derived from your scanned repositories." />
            )}
            {displayLanguages.map((lang, idx) => {
              const langColor = LANGUAGE_COLORS[lang.language] || "#3b82f6";

              return (
                <div
                  key={idx}
                  className="bg-white border border-stone-200/50 rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-md"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-sm font-bold text-stone-900">{lang.language}</span>
                    </div>

                    <span className="text-xs font-extrabold text-stone-900 px-2 py-0.5 rounded-md bg-accent font-mono border border-stone-200/50">
                      {lang.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: langColor,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-200">
                    <span>{lang.repoCount} active repos</span>
                    <span className="text-navy-700 font-semibold flex items-center gap-1">
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
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider block">
                  Accepted & Verified
                </span>
                <span className="text-lg font-extrabold text-emerald-500">
                  {verifiedCertsCount} Certificates
                </span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider block">
                  Rejected / Flagged
                </span>
                <span className="text-lg font-extrabold text-rose-500">
                  {flaggedCertsCount} Certificates
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Cards */}
          <div className="space-y-3">
            {displayCerts.length === 0 && (
              <AuditEmptyState label="No certificates audited yet" hint="Upload a certificate or link a Credly badge to run an integrity check." />
            )}
            {displayCerts.map((cert, idx) => {
              const isAccepted = cert.status === "verified" || cert.status === "accepted";

              return (
                <div
                  key={idx}
                  className={cn(
                    "bg-white border rounded-2xl p-4 flex flex-col gap-3 transition-all",
                    isAccepted
                      ? "border-stone-200/50 hover:border-navy-500/40"
                      : "border-rose-500/30 bg-rose-500/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          isAccepted
                            ? "bg-navy-50 border border-navy-200 text-navy-600"
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
                        )}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 leading-tight">
                          {cert.title}
                        </h4>
                        <span className="text-xs text-stone-500 font-medium block mt-0.5">
                          Issued by {cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-500/30 text-emerald-500 shadow-sm flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACCEPTED & VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-sm flex-shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        REJECTED / FLAGGED
                      </span>
                    )}
                  </div>

                  {/* If rejected, show reason */}
                  {!isAccepted && cert.rejection_reason && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>Rejection reason: {cert.rejection_reason}</span>
                    </div>
                  )}

                  {/* Skills Extracted */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-200">
                      <span className="text-[11px] text-stone-500 font-semibold mr-1">
                        Verified Skills:
                      </span>
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-accent border border-stone-200/50 text-[10px] text-stone-900/80 font-medium"
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
