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
    <div className="py-14 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
      <ShieldCheck className="w-9 h-9 text-muted-foreground/30 mb-2.5" />
      <h4 className="text-sm font-bold text-foreground">{label}</h4>
      <p className="text-xs text-muted-foreground max-w-xs mt-1">{hint}</p>
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
        "w-full glass rounded-3xl p-6 shadow-2xl font-sans relative overflow-hidden",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            GitProof™ Deep Audit Engine
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Verification & Evidence Breakdown
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time multi-extension repository inspection, language scores, and cryptographic certificate verification.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-accent/30 p-1 rounded-2xl border border-border/40 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("repos")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "repos"
                ? "bg-background border border-border/50 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
                ? "bg-background border border-border/50 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
                ? "bg-background border border-border/50 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
            <div className="bg-card/40 border border-border/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Scanned Repos
                </span>
                <span className="text-lg font-extrabold text-foreground">{displayRepos.length} Repositories</span>
              </div>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Integrity Verified
                </span>
                <span className="text-lg font-extrabold text-emerald-500">
                  {displayRepos.filter((r) => r.integrity_status === "verified").length} Clean
                </span>
              </div>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Anti-Cheat Score
                </span>
                <span className="text-lg font-extrabold text-foreground">
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
                  className="bg-card/40 hover:bg-card border border-border/50 rounded-2xl p-4 transition-all duration-200 flex flex-col gap-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </span>
                      {repo.url && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground"
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
                      {repo.agreement && (
                        <span className="text-[10px] font-mono text-muted-foreground ml-2">
                          {repo.agreement} models agreed
                        </span>
                      )}
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{repo.description}</p>
                  )}

                  {/* Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
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
                            className="px-2 py-0.5 rounded-md bg-accent border border-border/50 text-[10px] text-foreground/80 font-medium"
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
                  className="bg-card/40 border border-border/50 rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-md"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-sm font-bold text-foreground">{lang.language}</span>
                    </div>

                    <span className="text-xs font-extrabold text-foreground px-2 py-0.5 rounded-md bg-accent font-mono border border-border/50">
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

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <span>{lang.repoCount} active repos</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
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
            <div className="bg-card/40 border border-border/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Accepted & Verified
                </span>
                <span className="text-lg font-extrabold text-emerald-500">
                  {verifiedCertsCount} Certificates
                </span>
              </div>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">
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
                    "bg-card/40 border rounded-2xl p-4 flex flex-col gap-3 transition-all",
                    isAccepted
                      ? "border-border/50 hover:border-emerald-500/40"
                      : "border-rose-500/30 bg-rose-500/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          isAccepted
                            ? "bg-primary/10 border border-primary/20 text-primary"
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
                        )}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground leading-tight">
                          {cert.title}
                        </h4>
                        <span className="text-xs text-muted-foreground font-medium block mt-0.5">
                          Issued by {cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-sm flex-shrink-0">
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
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
                      <span className="text-[11px] text-muted-foreground font-semibold mr-1">
                        Verified Skills:
                      </span>
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-accent border border-border/50 text-[10px] text-foreground/80 font-medium"
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
