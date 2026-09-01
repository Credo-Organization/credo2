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
  Sparkles,
  Award,
  GitCommit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GitHubCalendar } from "@/components/ui/github-map";

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
    <div className="py-14 flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 transition-colors">
      <ShieldCheck className="w-9 h-9 text-zinc-400 dark:text-zinc-500 mb-2.5" />
      <h4 className="text-sm font-black text-zinc-950 dark:text-zinc-100">{label}</h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1 font-medium">{hint}</p>
    </div>
  );
}

export function AuditBreakdownPanel({
  repos = [],
  languages = [],
  certificates = [],
  className,
}: AuditBreakdownProps) {
  const [activeTab, setActiveTab] = useState<"repos" | "languages" | "certificates" | "activity">("repos");

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
        "w-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#18181B] dark:shadow-[5px_5px_0px_0px_#000000] font-sans relative overflow-hidden select-none transition-colors",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b-2 border-zinc-900 dark:border-zinc-700 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BAE6FD] dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-blue-300 text-xs font-black mb-1.5 shadow-[2px_2px_0px_0px_#18181B]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 stroke-[2.5]" />
            GitProof™ Deep Audit Engine
          </div>
          <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
            Verification & Evidence Breakdown
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
            Real-time multi-extension repository inspection, language scores, commit velocity, and cryptographic certificate verification.
          </p>
        </div>

        {/* Tab Buttons (Non-wrapping Single Line & Color Accented) */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 self-start lg:self-auto shadow-xs overflow-x-auto no-scrollbar max-w-full">
          
          {/* Repos Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("repos")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap h-8.5 shrink-0",
              activeTab === "repos"
                ? "bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/50"
            )}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[2.2] shrink-0" />
            <span>Repos</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-md font-mono text-[10px] font-black border",
                activeTab === "repos"
                  ? "bg-[#BAE6FD] text-blue-950 border-blue-400"
                  : "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
              )}
            >
              {displayRepos.length}
            </span>
          </button>

          {/* Languages Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("languages")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap h-8.5 shrink-0",
              activeTab === "languages"
                ? "bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/50"
            )}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 stroke-[2.2] shrink-0" />
            <span>Languages</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-md font-mono text-[10px] font-black border",
                activeTab === "languages"
                  ? "bg-[#DDD6FE] text-purple-950 border-purple-400"
                  : "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
              )}
            >
              {displayLanguages.length}
            </span>
          </button>

          {/* Certs Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("certificates")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap h-8.5 shrink-0",
              activeTab === "certificates"
                ? "bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/50"
            )}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
            <span>Certs</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-md font-mono text-[10px] font-black border",
                activeTab === "certificates"
                  ? "bg-[#A7F3D0] text-emerald-950 border-emerald-400"
                  : "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
              )}
            >
              {displayCerts.length}
            </span>
          </button>

          {/* Activity Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap h-8.5 shrink-0",
              activeTab === "activity"
                ? "bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/50"
            )}
          >
            <GitCommit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 stroke-[2.2] shrink-0" />
            <span>Activity Log</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

        </div>
      </div>

      {/* TAB CONTENT 1: REPOSITORIES */}
      {activeTab === "repos" && (
        <div className="pt-6 space-y-4 relative z-10">
          
          {/* 3 COLORFUL TOP STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-2">
            
            {/* Card 1: Sky-Blue Scanned Repos */}
            <div className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
              <div className="w-11 h-11 rounded-xl bg-[#BAE6FD] dark:bg-sky-950 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-blue-700 dark:text-sky-300 shadow-[2px_2px_0px_0px_#18181B] shrink-0">
                <FolderGit2 className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-black tracking-wider block">
                  Scanned Repos
                </span>
                <span className="text-lg font-black text-zinc-950 dark:text-zinc-100 block truncate">
                  {displayRepos.length} Repositories
                </span>
              </div>
            </div>

            {/* Card 2: Mint-Emerald Integrity Verified */}
            <div className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
              <div className="w-11 h-11 rounded-xl bg-[#A7F3D0] dark:bg-emerald-950 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shadow-[2px_2px_0px_0px_#18181B] shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-black tracking-wider block">
                  Integrity Verified
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 block truncate">
                  {displayRepos.filter((r) => r.integrity_status === "verified").length} Clean
                </span>
              </div>
            </div>

            {/* Card 3: Lavender-Purple Anti-Cheat Score */}
            <div className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
              <div className="w-11 h-11 rounded-xl bg-[#DDD6FE] dark:bg-purple-950 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-purple-800 dark:text-purple-300 shadow-[2px_2px_0px_0px_#18181B] shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-black tracking-wider block">
                  Anti-Cheat Score
                </span>
                <span className="text-lg font-black text-purple-700 dark:text-purple-400 block truncate">
                  {displayRepos.length === 0
                    ? "No scan yet"
                    : `${Math.round(
                        displayRepos.reduce((sum, r) => sum + (r.integrity_score ?? 0), 0) /
                          displayRepos.length
                      )}% Avg`}
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
                  className="bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 transition-all duration-200 flex flex-col gap-2.5 group shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-black text-zinc-950 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {repo.name}
                      </span>
                      {repo.url && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Anti-cheat status pill with clean tactile styling */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-600 shadow-[1.5px_1.5px_0px_0px_#18181B] dark:shadow-[1.5px_1.5px_0px_0px_#000000]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                          Verified ({repo.integrity_score ?? 98}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-600 shadow-[1.5px_1.5px_0px_0px_#18181B] dark:shadow-[1.5px_1.5px_0px_0px_#000000]">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                          Flagged
                        </span>
                      )}
                      {repo.agreement && (
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 ml-2">
                          {repo.agreement} models agreed
                        </span>
                      )}
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">{repo.description}</p>
                  )}

                  {/* Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-bold text-zinc-950 dark:text-zinc-200">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: langColor }}
                          />
                          {repo.language}
                        </span>
                      )}

                      {typeof repo.stars === "number" && repo.stars > 0 && (
                        <span className="flex items-center gap-1 font-mono text-zinc-600 dark:text-zinc-400">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
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
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[10px] text-zinc-950 dark:text-zinc-100 font-bold"
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
                  className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-md"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-sm font-black text-zinc-950 dark:text-zinc-100">{lang.language}</span>
                    </div>

                    <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 font-mono border border-zinc-200 dark:border-zinc-600">
                      {lang.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: langColor,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-700">
                    <span>{lang.repoCount} active repos</span>
                    <span className="text-zinc-950 dark:text-zinc-100 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
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
            <div className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]">
              <div className="w-11 h-11 rounded-xl bg-[#A7F3D0] dark:bg-emerald-950 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shadow-[2px_2px_0px_0px_#18181B] shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider block">
                  Accepted & Verified
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 block truncate">
                  {verifiedCertsCount} Certificates
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]">
              <div className="w-11 h-11 rounded-xl bg-[#FECDD3] dark:bg-rose-950 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-rose-800 dark:text-rose-300 shadow-[2px_2px_0px_0px_#18181B] shrink-0">
                <XCircle className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider block">
                  Rejected / Flagged
                </span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-400 block truncate">
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
                  className="bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-4 flex flex-col gap-3 transition-all shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#BAE6FD] dark:bg-sky-950 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 text-blue-700 dark:text-sky-300 shadow-[2px_2px_0px_0px_#18181B]">
                        <Award className="w-5 h-5 stroke-[2.3]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-zinc-950 dark:text-zinc-100 leading-tight">
                          {cert.title}
                        </h4>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mt-0.5">
                          Issued by {cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}
                        </span>
                      </div>
                    </div>

                    {/* Status badge with tactile neobrutalist style */}
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-600 shadow-[1.5px_1.5px_0px_0px_#18181B] dark:shadow-[1.5px_1.5px_0px_0px_#000000] flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                        ACCEPTED & VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-600 shadow-[1.5px_1.5px_0px_0px_#18181B] dark:shadow-[1.5px_1.5px_0px_0px_#000000] flex-shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                        REJECTED / FLAGGED
                      </span>
                    )}
                  </div>

                  {/* If rejected, show reason */}
                  {!isAccepted && cert.rejection_reason && (
                    <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                      <span>Rejection reason: {cert.rejection_reason}</span>
                    </div>
                  )}

                  {/* Skills Extracted */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-200 dark:border-zinc-700">
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold mr-1">
                        Verified Skills:
                      </span>
                      {cert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[10px] text-zinc-950 dark:text-zinc-100 font-bold"
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

      {/* TAB CONTENT 4: ACTIVITY / COMMIT VELOCITY */}
      {activeTab === "activity" && (
        <div className="pt-6 space-y-4 relative z-10 animate-fade-in">
          <GitHubCalendar
            title="365-Day Verified Commit Velocity & Pull Request Activity"
            className="border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]"
          />
        </div>
      )}
    </div>
  );
}
