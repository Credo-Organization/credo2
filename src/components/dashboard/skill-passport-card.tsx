"use client";

import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  FileBadge,
  Target,
  User,
  CheckCircle2,
  Code2,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CertificateUploader } from "@/components/certificates/certificate-uploader";

// Skill Icons Mapping
const SKILL_ICONS: Record<string, string> = {
  typescript: "TS",
  javascript: "JS",
  python: "PY",
  react: "RE",
  nextjs: "NX",
  html: "H5",
  css: "C3",
  fastapi: "FA",
  docker: "DK",
  git: "GT",
  sql: "SQ",
  graphql: "QL",
  tailwind: "TW",
  nodejs: "ND",
};

function getIconForSkill(name: string) {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const glyph = SKILL_ICONS[key] || name.slice(0, 2).toUpperCase();
  return (
    <span className="font-mono font-black text-[10px] tracking-tighter text-[#0b2559] dark:text-[#a5c7ff]">
      {glyph}
    </span>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

// --- Credify Holographic Circular Verification Seal ---
function CredifyVerificationSeal() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center select-none shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full text-[#0b2559] dark:text-[#7baaff]">
        <defs>
          <path id="matrixSealTop" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0" fill="none" />
          <path id="matrixSealBottom" d="M 60,60 m 45,0 a 45,45 0 1,1 -90,0" fill="none" />
        </defs>

        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        <text fontSize="7.5" fontWeight="bold" letterSpacing="2.5" fill="currentColor">
          <textPath href="#matrixSealTop" startOffset="50%" textAnchor="middle">
            ★ MINSKEY VERIFIED ★
          </textPath>
        </text>

        <text fontSize="6" fontWeight="bold" letterSpacing="1.8" fill="currentColor">
          <textPath href="#matrixSealBottom" startOffset="50%" textAnchor="middle">
            ACHIEVEMENTS · TRUST · IMPACT
          </textPath>
        </text>

        <g transform="translate(42, 42) scale(0.6)">
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
    <svg viewBox="0 0 40 24" className="w-8 h-5 text-[#0b2559] dark:text-[#7baaff] shrink-0">
      <rect x="2" y="2" width="36" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" />
      <line x1="26" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="12" r="5" fill="currentColor" />
      <circle cx="20" cy="12" r="2" fill="#fff" />
    </svg>
  );
}

// Month Labels for Heatmap
const MONTH_LABELS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

// Authentic GitHub Contribution Colors
const GITHUB_GREENS = [
  "transparent",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

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
  githubHeatmap: number[][];
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
  githubHeatmap: Array(7).fill(0).map((_, r) => Array(52).fill(0).map((_, c) => (r * 7 + c * 13) % 5)),
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
    <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0b2559] dark:text-[#a5c7ff] flex items-center gap-1.5 mb-2.5 select-none">
      <Sparkles className="w-3.5 h-3.5 text-[#0b2559] dark:text-[#a5c7ff]" />
      {children}
    </h3>
  );
}

export function SkillPassportCard({ data = DUMMY_DATA }: { data?: SkillPassportData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, setHoveredCell] = useState<{ count: number; x: number; y: number } | null>(null);

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

  // Ensure 7 rows by 52 columns matrix
  const heatmapData = useMemo(() => {
    if (data.githubHeatmap && data.githubHeatmap.length === 7) {
      return data.githubHeatmap;
    }
    return Array(7).fill(0).map((_, r) => Array(52).fill(0).map((_, c) => (r * 7 + c * 13) % 5));
  }, [data.githubHeatmap]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[440px] mx-auto bg-[#f8fbff] dark:bg-[#071329] text-[#091b3d] dark:text-[#e0edff] rounded-[32px] border border-[#d2e2f8] dark:border-[#1e3a6a] relative font-sans select-none overflow-hidden transition-colors"
      style={{
        boxShadow: "0 30px 80px -15px rgba(11, 37, 89, 0.22), 0 0 0 1.5px rgba(11, 37, 89, 0.10)",
      }}
    >
      {/* Background Watermark Security Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0b2559 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 p-5 sm:p-6 pb-4">
        
        {/* Top Header: ID & Circuit Microchip Icon */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e1ecfb] dark:border-[#1e3a6a]">
          <span className="text-[11px] font-extrabold tracking-wider text-[#0b2559] dark:text-[#a5c7ff] uppercase">
            ID: {cardId}
          </span>
          <CircuitBadgeIcon />
        </div>

        {/* SECTION 1: IDENTITY (Avatar, Holder Info & Verification Seal) */}
        <div className="pt-3.5 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Illustrated Doodle Avatar Container */}
            <div className="w-[72px] h-[72px] rounded-2xl bg-[#fdf8ee] dark:bg-[#0e2249] border-2 border-[#d2e2f8] dark:border-[#274b85] p-1 flex items-center justify-center relative overflow-hidden shadow-xs shrink-0">
              <img 
                src={avatarUrl} 
                alt={data.name} 
                className="w-full h-full object-contain" 
              />
            </div>

            {/* Holder Metadata */}
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[9px] font-extrabold tracking-widest text-[#4b648b] dark:text-[#8ba7d6] uppercase block">
                HOLDER
              </span>
              <h1 className="text-xl font-black tracking-tight text-[#08152e] dark:text-[#f0f6ff] leading-tight truncate">
                {data.name}
              </h1>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#304870] dark:text-[#a0bee8] pt-0.5 truncate">
                <Target className="w-3 h-3 text-[#0b2559] dark:text-[#7baaff] shrink-0" />
                <span className="truncate">{data.careerGoal}</span>
              </div>
            </div>
          </div>

          {/* Holographic Verification Seal */}
          <div className="shrink-0 flex items-center justify-center">
            <CredifyVerificationSeal />
          </div>
        </div>

        {/* SECTION 2: CREDENTIAL TRIPLE METRIC ROW (Inspired by Official ID Card) */}
        <div className="my-2 py-2.5 px-3 rounded-2xl bg-white/70 dark:bg-[#0a1e42]/60 border border-[#e1ecfb] dark:border-[#1e3a6a] grid grid-cols-3 divide-x divide-[#e1ecfb] dark:divide-[#1e3a6a] text-center shadow-2xs">
          <div className="px-1">
            <div className="flex items-center justify-center gap-1 text-[9px] font-extrabold text-[#4b648b] dark:text-[#8ba7d6] uppercase tracking-wider mb-0.5">
              <GithubIcon className="w-2.5 h-2.5 text-[#0b2559] dark:text-[#7baaff]" />
              <span>REPOS</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#08152e] dark:text-[#f0f6ff] leading-none">
              {String(data.githubRepos).padStart(2, "0")}
            </div>
          </div>

          <div className="px-1">
            <div className="flex items-center justify-center gap-1 text-[9px] font-extrabold text-[#4b648b] dark:text-[#8ba7d6] uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
              <span>VERIFIED</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#08152e] dark:text-[#f0f6ff] leading-none">
              {String(data.verifiedSkillsCount).padStart(2, "0")}
            </div>
          </div>

          <div className="px-1">
            <div className="flex items-center justify-center gap-1 text-[9px] font-extrabold text-[#4b648b] dark:text-[#8ba7d6] uppercase tracking-wider mb-0.5">
              <FileBadge className="w-2.5 h-2.5 text-[#0b2559] dark:text-[#7baaff]" />
              <span>CERTS</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#08152e] dark:text-[#f0f6ff] leading-none">
              {String(data.certificates).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* SECTION 3: VERIFIED SKILLS GRID */}
        <div className="pt-3 pb-2">
          <SectionTitle>Verified Competency Matrix</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {data.verifiedSkills.map((skill) => (
              <div 
                key={skill.name}
                className="flex items-center justify-between bg-white dark:bg-[#0a1e42] border border-[#d2e2f8] dark:border-[#1e3a6a] p-2 rounded-xl shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-[#f0f6ff] dark:bg-[#142d59] border border-[#d2e2f8] dark:border-[#274b85] flex items-center justify-center shrink-0">
                    {getIconForSkill(skill.name)}
                  </div>
                  <span className="text-[#08152e] dark:text-[#f0f6ff] font-bold text-xs truncate">
                    {skill.name}
                  </span>
                </div>
                
                <span className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-extrabold border shrink-0",
                  skill.confidence === "High" 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800" 
                    : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                )}>
                  {skill.confidence}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: GITHUB ACTIVITY HEATMAP */}
        <div className="pt-2 pb-1">
          <SectionTitle>Deterministic Code Contribution</SectionTitle>
          <div className="w-full bg-white dark:bg-[#0a1e42] border border-[#d2e2f8] dark:border-[#1e3a6a] rounded-2xl p-3 shadow-2xs overflow-x-auto custom-scrollbar">
            
            <div className="flex gap-2 min-w-max items-start">
              {/* Row Day Labels */}
              <div className="flex flex-col justify-between text-[9px] font-bold text-[#8ba7d6] dark:text-[#5a7eb8] pt-4 pb-0.5 h-[68px]">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div className="flex flex-col gap-1">
                {/* Months Header */}
                <div className="flex text-[8px] font-bold text-[#5e7ea8] dark:text-[#8ba7d6] h-3.5">
                  {MONTH_LABELS.map((month, i) => (
                    <div key={i} className="w-[36px] text-left shrink-0">
                      {month}
                    </div>
                  ))}
                </div>

                {/* 7 rows x 52 columns Grid */}
                <div className="flex flex-col gap-[2px]">
                  {heatmapData.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex gap-[2px]">
                      {row.map((intensity, colIndex) => {
                        const levelColor = GITHUB_GREENS[Math.min(intensity, 4)];
                        return (
                          <div 
                            key={`cell-${rowIndex}-${colIndex}`} 
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredCell({ count: intensity, x: rect.left, y: rect.top });
                            }}
                            onMouseLeave={() => setHoveredCell(null)}
                            style={{
                              backgroundColor: intensity === 0 ? undefined : levelColor,
                            }}
                            className={cn(
                              "w-[6px] h-[6px] rounded-[1px] flex-shrink-0 transition-transform hover:scale-125 cursor-pointer",
                              intensity === 0 && "bg-[#e8f1fc] dark:bg-[#13284d]"
                            )}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption & Legend */}
            <div className="flex items-center justify-between text-[10px] font-medium text-[#4b648b] dark:text-[#8ba7d6] mt-2 min-w-max pl-4 pr-1">
              <span>Learned consistency. Built momentum.</span>
              <div className="flex items-center gap-1 text-[9px] text-[#5e7ea8] dark:text-[#7baaff]">
                <span>Less</span>
                <div className="flex gap-[2px] items-center">
                  <div className="w-[6px] h-[6px] rounded-[1px] bg-[#e8f1fc] dark:bg-[#13284d]" />
                  <div className="w-[6px] h-[6px] rounded-[1px] bg-[#9be9a8]" />
                  <div className="w-[6px] h-[6px] rounded-[1px] bg-[#40c463]" />
                  <div className="w-[6px] h-[6px] rounded-[1px] bg-[#30a14e]" />
                  <div className="w-[6px] h-[6px] rounded-[1px] bg-[#216e39]" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 5: EVIDENCE SOURCES DRAWER */}
      <div className="border-t border-[#e1ecfb] dark:border-[#1e3a6a] bg-white/40 dark:bg-[#071329]/40 transition-colors">
        <button 
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full flex items-center justify-between p-3 px-5 text-[#304870] dark:text-[#a0bee8] hover:bg-white dark:hover:bg-[#0a1e42] hover:text-[#08152e] dark:hover:text-[#f0f6ff] transition-colors cursor-pointer"
        >
          <span className="text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#0b2559] dark:text-[#7baaff]" />
            Accredited Evidence & Repositories
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", drawerOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {drawerOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-5 pb-4 pt-1 space-y-3"
            >
              <div>
                <span className="text-[9px] font-extrabold text-[#4b648b] dark:text-[#8ba7d6] uppercase tracking-wider block mb-1.5">
                  Verified Repositories ({data.evidence.githubRepos.length})
                </span>
                <div className="space-y-1.5">
                  {data.evidence.githubRepos.map((repo) => (
                    <a 
                      key={repo.name}
                      href={repo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0a1e42] border border-[#d2e2f8] dark:border-[#1e3a6a] text-xs font-semibold text-[#08152e] dark:text-[#f0f6ff] hover:border-[#b5d3fb] transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <GithubIcon className="w-3 h-3 text-[#0b2559] dark:text-[#7baaff] shrink-0" />
                        <span className="truncate font-mono text-[11px]">{repo.name}</span>
                      </div>
                      <span className="text-[10px] text-[#4b648b] dark:text-[#8ba7d6] font-mono">
                        {repo.language}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-extrabold text-[#4b648b] dark:text-[#8ba7d6] uppercase tracking-wider block mb-1.5">
                  Accredited Certificates ({data.evidence.certificates.length})
                </span>
                <div className="space-y-1.5">
                  {data.evidence.certificates.map((cert) => (
                    <a 
                      key={cert.name}
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0a1e42] border border-[#d2e2f8] dark:border-[#1e3a6a] text-xs font-semibold text-[#08152e] dark:text-[#f0f6ff] hover:border-[#b5d3fb] transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileBadge className="w-3 h-3 text-[#0b2559] dark:text-[#7baaff] shrink-0" />
                        <span className="truncate text-[11px]">{cert.name}</span>
                      </div>
                      <span className="text-[10px] text-[#4b648b] dark:text-[#8ba7d6]">
                        {cert.issuer}
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-2.5">
                  <CertificateUploader />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
