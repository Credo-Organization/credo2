"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Award,
  ChevronDown,
  Sparkles,
  Lock,
  FileBadge,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificateUploader } from "@/components/certificates/certificate-uploader";
import { GitHubCalendar } from "@/components/ui/github-map";

const GITHUB_GREENS = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];

// --- Helper for Skill Badges ---
function getIconForSkill(name: string) {
  const iconClass = "w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100";
  switch (name.toLowerCase()) {
    case "typescript":
      return <span className="font-mono text-[9px] font-black text-blue-600">TS</span>;
    case "javascript":
      return <span className="font-mono text-[9px] font-black text-amber-500">JS</span>;
    case "python":
      return <span className="font-mono text-[9px] font-black text-blue-500">PY</span>;
    case "next.js":
    case "nextjs":
      return <span className="font-mono text-[9px] font-black text-zinc-900 dark:text-zinc-100">N</span>;
    case "css":
    case "html":
      return <span className="font-mono text-[9px] font-black text-orange-500">&lt;/&gt;</span>;
    default:
      return <Sparkles className={iconClass} />;
  }
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// --- Credify Holographic Circular Verification Seal ---
function CredifyVerificationSeal() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center select-none">
      <svg viewBox="0 0 120 120" className="w-full h-full text-zinc-900 dark:text-zinc-100">
        <defs>
          <path
            id="sealCircleTopCard"
            d="M 60,60 m -45,0 a 45,45 0 1,1 90,0"
            fill="none"
          />
          <path
            id="sealCircleBottomCard"
            d="M 60,60 m 45,0 a 45,45 0 1,1 -90,0"
            fill="none"
          />
        </defs>

        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        <text className="text-[8px] font-black uppercase tracking-[0.24em] fill-current">
          <textPath href="#sealCircleTopCard" startOffset="50%" textAnchor="middle">
            • MINSKEY VERIFIED •
          </textPath>
        </text>

        <text className="text-[7.5px] font-black uppercase tracking-[0.24em] fill-current opacity-80">
          <textPath href="#sealCircleBottomCard" startOffset="50%" textAnchor="middle">
            OFFICIAL MATRIX
          </textPath>
        </text>

        <g transform="translate(36, 36) scale(0.8)">
          <path
            d="M 30 5 L 10 15 L 10 35 C 10 48 30 58 30 58 C 30 58 50 48 50 35 L 50 15 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 40 10 L 20 10 C 10 10 5 15 5 25 L 5 35 C 5 45 10 50 20 50 L 40 50 L 40 42 L 20 42 C 15 42 13 40 13 35 L 13 25 C 13 20 15 18 20 18 L 40 18 Z"
            fill="currentColor"
          />
          <path
            d="M 50 18 L 30 18 C 22 18 18 22 18 30 L 18 40 C 18 48 22 52 30 52 L 50 52 L 50 44 L 30 44 C 25 44 24 42 24 38 L 24 32 C 24 28 25 26 30 26 L 50 26 Z"
            fill="currentColor"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}

// --- Circuit Badge Icon ---
function CircuitBadgeIcon() {
  return (
    <svg viewBox="0 0 40 24" className="w-8 h-5 text-zinc-900 dark:text-zinc-100 shrink-0">
      <rect x="2" y="2" width="36" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" />
      <line x1="26" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="12" r="5" fill="currentColor" />
      <circle cx="20" cy="12" r="2" fill="#fff" />
    </svg>
  );
}

export type SkillPassportData = {
  cardId?: string;
  studentId?: string;
  name: string;
  gender?: string;
  careerGoal: string;
  profileImage?: string;
  verifiedSkills: { name: string; confidence: "High" | "Medium" | "Low"; iconName?: string }[];
  githubRepos: number;
  certificates: number;
  verifiedSkillsCount: number;
  missingSkills: number;
  missingSkillsAnalysis?: {
    description: string;
    recommendedTechStack: string[];
    suggestedProjects?: { name: string; description: string }[];
  };
  githubHeatmap?: number[][];
  evidence: {
    githubRepos: { name: string; url: string; language: string; stars: number }[];
    certificates: { name: string; issuer: string; url: string }[];
  };
};

const DEFAULT_MALE_STUDENT_AVATAR = "/avatar-male.webp";
const DEFAULT_FEMALE_STUDENT_AVATAR = "/avatar-female.webp";

const DUMMY_DATA: SkillPassportData = {
  cardId: "CDY2026-0004611",
  studentId: "CDY26S4611",
  name: "Subham Sarangi",
  gender: "male",
  careerGoal: "AI Engineer",
  profileImage: DEFAULT_MALE_STUDENT_AVATAR,
  verifiedSkills: [
    { name: "TypeScript", confidence: "High", iconName: "typescript" },
    { name: "CSS", confidence: "Medium", iconName: "css" },
    { name: "JavaScript", confidence: "High", iconName: "javascript" },
    { name: "Python", confidence: "High", iconName: "python" },
    { name: "Next.js", confidence: "Medium", iconName: "nextjs" },
    { name: "HTML", confidence: "Medium", iconName: "html" },
  ],
  githubRepos: 14,
  certificates: 1,
  verifiedSkillsCount: 6,
  missingSkills: 0,
  missingSkillsAnalysis: {
    description: "Strong software engineering foundation with room to expand in distributed architectures and model serving pipelines.",
    recommendedTechStack: ["PostgreSQL", "Go", "Docker", "GraphQL"]
  },
  evidence: {
    githubRepos: [
      { name: "ai-orchestrator", url: "https://github.com/developer/ai-orchestrator", language: "TypeScript", stars: 12 },
      { name: "code-parser", url: "https://github.com/developer/code-parser", language: "Python", stars: 8 },
      { name: "dev-portfolio", url: "https://github.com/developer/dev-portfolio", language: "Next.js", stars: 5 },
    ],
    certificates: [
      { name: "AWS Certified Developer", issuer: "Amazon Web Services", url: "https://aws.amazon.com/verification" },
    ]
  }
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-2 select-none font-mono">
      <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
      {children}
    </h3>
  );
}

export function SkillPassportCard({ data = DUMMY_DATA }: { data?: SkillPassportData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cardId = data.cardId || "CDY2026-0004611";

  // Dynamic Doodle Avatar Selection
  const avatarUrl = useMemo(() => {
    const raw = data.profileImage || "";
    const isUnsplashOrEmpty = !raw || raw.includes("unsplash.com");
    if (isUnsplashOrEmpty) {
      return data.gender?.toLowerCase() === "female"
        ? DEFAULT_FEMALE_STUDENT_AVATAR
        : DEFAULT_MALE_STUDENT_AVATAR;
    }
    return raw;
  }, [data.profileImage, data.gender]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[440px] bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 rounded-3xl p-6 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] relative font-sans select-none overflow-hidden transition-all"
    >
      {/* Background Watermark Security Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#18181B 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top Header: ID & Circuit Microchip Icon */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-900 dark:border-zinc-700 relative z-10">
        <span className="text-xs font-black tracking-wider text-zinc-950 dark:text-zinc-100 uppercase font-mono">
          ID: {cardId}
        </span>
        <CircuitBadgeIcon />
      </div>

      {/* SECTION 1: IDENTITY (Avatar, Holder Info & Verification Seal) */}
      <div className="pt-3 pb-2 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Illustrated Doodle Avatar Container */}
          <div className="w-[68px] h-[68px] rounded-2xl bg-[#FEF08A] border-2 border-zinc-900 dark:border-zinc-700 p-1 flex items-center justify-center relative overflow-hidden shadow-[2px_2px_0px_0px_#18181B] shrink-0">
            <img 
              src={avatarUrl} 
              alt={data.name} 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Holder Metadata */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block font-mono">
              HOLDER
            </span>
            <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight truncate">
              {data.name}
            </h1>

            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 pt-0.5 truncate">
              <Target className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
              <span className="truncate">{data.careerGoal}</span>
            </div>
          </div>
        </div>

        {/* Holographic Verification Seal */}
        <div className="shrink-0 flex items-center justify-center">
          <CredifyVerificationSeal />
        </div>
      </div>

      {/* SECTION 2: CREDENTIAL TRIPLE METRIC ROW */}
      <div className="my-2.5 py-2 px-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 grid grid-cols-3 divide-x-2 divide-zinc-900 dark:divide-zinc-700 text-center shadow-[2px_2px_0px_0px_#18181B] relative z-10">
        <div className="px-1">
          <div className="flex items-center justify-center gap-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-0.5 font-mono">
            <GithubIcon className="w-2.5 h-2.5 text-zinc-900 dark:text-zinc-100" />
            <span>REPOS</span>
          </div>
          <div className="text-lg font-black text-zinc-950 dark:text-white leading-none font-mono">
            {String(data.githubRepos).padStart(2, "0")}
          </div>
        </div>

        <div className="px-1">
          <div className="flex items-center justify-center gap-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-0.5 font-mono">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            <span>VERIFIED</span>
          </div>
          <div className="text-lg font-black text-zinc-950 dark:text-white leading-none font-mono">
            {String(data.verifiedSkillsCount).padStart(2, "0")}
          </div>
        </div>

        <div className="px-1">
          <div className="flex items-center justify-center gap-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-0.5 font-mono">
            <FileBadge className="w-2.5 h-2.5 text-zinc-900 dark:text-zinc-100" />
            <span>CERTS</span>
          </div>
          <div className="text-lg font-black text-zinc-950 dark:text-white leading-none font-mono">
            {String(data.certificates).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* SECTION 3: VERIFIED SKILLS GRID */}
      <div className="pt-2 pb-2 relative z-10">
        <SectionTitle>Verified Competency Matrix</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {data.verifiedSkills.map((skill) => (
            <div 
              key={skill.name}
              className="flex items-center justify-between bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 p-2 rounded-xl shadow-2xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-700 border border-zinc-900 dark:border-zinc-600 flex items-center justify-center shrink-0">
                  {getIconForSkill(skill.name)}
                </div>
                <span className="text-zinc-950 dark:text-zinc-100 font-bold text-xs truncate">
                  {skill.name}
                </span>
              </div>
              
              <span className={cn(
                "px-1.5 py-0.2 rounded text-[8px] font-black border font-mono shrink-0",
                skill.confidence === "High" 
                  ? "bg-emerald-100 text-emerald-950 border-emerald-400" 
                  : "bg-blue-100 text-blue-950 border-blue-400"
              )}>
                {skill.confidence}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: GITHUB ACTIVITY HEATMAP (Full Verified Engine) */}
      <div className="pt-1 pb-1 relative z-10">
        <SectionTitle>Deterministic Code Contribution</SectionTitle>
        <GitHubCalendar
          showSummary={false}
          showLegend={true}
          maxWeeks={31}
          blockSize={8}
          blockMargin={2}
          blockRadius={2}
          colors={GITHUB_GREENS}
          className="border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-2xl p-3 shadow-2xs"
        />
      </div>

      {/* SECTION 5: EVIDENCE VAULT DRAWER */}
      <div className="pt-2 border-t-2 border-zinc-900 dark:border-zinc-700 mt-2 relative z-10">
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition-colors p-1 cursor-pointer font-mono"
        >
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>EVIDENCE VAULT ({data.evidence.githubRepos.length + data.evidence.certificates.length})</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", drawerOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-2 pt-2"
            >
              {/* Repos list */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-zinc-500 font-mono block">Linked Repositories:</span>
                {data.evidence.githubRepos.map((repo, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[10px]">
                    <span className="font-bold text-zinc-950 dark:text-zinc-100">{repo.name}</span>
                    <span className="text-zinc-500 font-mono">{repo.language}</span>
                  </div>
                ))}
              </div>

              {/* Cert Uploader */}
              <div className="pt-2">
                <CertificateUploader />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
