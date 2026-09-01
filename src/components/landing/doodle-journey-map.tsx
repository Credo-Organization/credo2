"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch,
  Upload,
  ShieldCheck,
  Target,
  Compass,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Terminal,
  FileCheck,
  Lock,
  Zap,
  Award,
  Play,
  Pause,
  Check,
  Copy,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StageData {
  id: string;
  stepNumber: string;
  tabLabel: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badgeBg: string;
}

const STAGES: StageData[] = [
  {
    id: "github",
    stepNumber: "01",
    tabLabel: "Connect GitHub",
    tag: "⚡ 10-Sec Ingestion",
    title: "Instant GitHub Code Audit",
    subtitle: "Automated Commit & Repository Parser",
    description: "Link your GitHub account with OAuth. Our background ingestion engine parses commits, PRs, and language distributions, verifying authentic code authorship in seconds.",
    icon: GitBranch,
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-400",
  },
  {
    id: "ocr",
    stepNumber: "02",
    tabLabel: "Upload Proofs",
    tag: "📜 Multimodal OCR",
    title: "Accredited Credential OCR",
    subtitle: "Tamper-Proof Document Analysis",
    description: "Upload hackathon awards, cloud certifications, and degree certificates. Vision AI extracts accredited competency claims and cryptographically fingerprints the file with SHA-256.",
    icon: Upload,
    badgeBg: "bg-sky-100 text-sky-900 border-sky-400",
  },
  {
    id: "mint",
    stepNumber: "03",
    tabLabel: "Mint Passport",
    tag: "🔒 SHA-256 Consensus",
    title: "Multi-Agent Consensus Minting",
    subtitle: "Anti-Cheat Verification Ledger",
    description: "A 3-agent ensemble cross-references commits with claimed skills, weeds out boilerplate, and mints an immutable, portable skill passport with a unique Student ID.",
    icon: ShieldCheck,
    badgeBg: "bg-purple-100 text-purple-900 border-purple-400",
  },
  {
    id: "radar",
    stepNumber: "04",
    tabLabel: "Skill Gap Radar",
    tag: "🎯 Role Calibration",
    title: "Market Role Benchmarking",
    subtitle: "Real-Time Competency Delta",
    description: "Calibrate your verified portfolio against target industry roles (e.g., AI Engineer, Full-Stack Lead). Pinpoint your exact lagging libraries and architecture milestones.",
    icon: Target,
    badgeBg: "bg-amber-100 text-amber-900 border-amber-400",
  },
  {
    id: "roadmap",
    stepNumber: "05",
    tabLabel: "Dynamic Roadmap",
    tag: "🗺️ AI Sprint Action",
    title: "Grounded AI Mentor Blueprint",
    subtitle: "14-Day Tactical Study Plan",
    description: "Your AI Career Mentor generates project blueprints, curated GitHub repositories, and simulated mock interview questions grounded strictly in your real skill gaps.",
    icon: Compass,
    badgeBg: "bg-blue-100 text-blue-900 border-blue-400",
  },
  {
    id: "hire",
    stepNumber: "06",
    tabLabel: "Team Up & Hire",
    tag: "🎉 Recruiter Ledger",
    title: "Direct Recruiter Verification",
    subtitle: "Bypass The Resume Black Hole",
    description: "Share your passport QR code with hiring managers. Recruiters inspect audited commit diffs and accredited proof ledgers in one click, skipping traditional resume filters.",
    icon: Users,
    badgeBg: "bg-rose-100 text-rose-900 border-rose-400",
  },
];

export function DoodleJourneyMap() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Auto-advance stages every 5 seconds if not paused by user
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeStage = STAGES[activeIdx];

  const handleCopyHash = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("8f4a19c8d23b7e41fa80c92157a4192b");
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative bg-[#FAF9F6] border-b border-zinc-200/80 overflow-hidden select-none">
      {/* Background Dot Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-blue-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-bold text-xs uppercase tracking-wider text-blue-950">
              Interactive Proof Simulator
            </span>
          </div>

          <span className="font-doodle text-2xl sm:text-3xl text-blue-600 font-bold block mb-1">
            ⚡ Click any pipeline stage to inspect the live engine
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            How real code becomes your{" "}
            <span className="relative inline-block text-blue-600">
              verified passport.
              <svg viewBox="0 0 160 14" fill="none" className="w-full h-3 text-blue-500 pointer-events-none absolute -bottom-1 left-0">
                <path d="M3 8C35 3 75 12 115 6C135 3 145 9 157 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-4 text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            An automated, tamper-proof verification studio that audits your authentic engineering output.
          </p>
        </div>

        {/* ── THE INTERACTIVE STUDIO STAGE (CONCEPT 1) ── */}
        <div className="relative w-full rounded-3xl bg-[#FAF9F6] border-2 border-zinc-900 shadow-[6px_6px_0px_0px_#18181B] p-5 sm:p-8 overflow-hidden">
          {/* Top Washi Tape Sticker */}
          <div className="absolute -top-3 left-12 w-32 h-5.5 rounded-xs bg-[#FEF08A]/90 border-dashed border-t border-b border-zinc-500/60 shadow-xs -rotate-1 z-20 pointer-events-none" />

          {/* Top Stage Bar: Title & Auto-Play Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-zinc-900 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse border border-zinc-900" />
              <span className="font-mono text-xs font-black uppercase tracking-widest text-zinc-900">
                PIPELINE SIMULATOR ~ STAGE {activeStage.stepNumber} OF 06
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="px-3 py-1 rounded-xl bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] text-xs font-bold text-zinc-900 hover:bg-zinc-100 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-zinc-900" />
                    <span>Pause Demo</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-zinc-900" />
                    <span>Auto Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2-Column Studio: Left Stepper Rail + Right Live Morphing Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* LEFT RAIL: 6 Interactive Station Buttons (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {STAGES.map((stage, idx) => {
                const isActive = idx === activeIdx;
                const Icon = stage.icon;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setActiveIdx(idx);
                      setIsAutoPlaying(false);
                    }}
                    className={cn(
                      "w-full text-left p-3 sm:p-3.5 rounded-2xl border-2 border-zinc-900 transition-all flex items-center justify-between gap-3 cursor-pointer relative",
                      isActive
                        ? "bg-zinc-950 text-white shadow-[3px_3px_0px_0px_#18181B] translate-x-1"
                        : "bg-white hover:bg-zinc-50 text-zinc-950 shadow-[2px_2px_0px_0px_#18181B] hover:shadow-[3px_3px_0px_0px_#18181B]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Step Number Circle */}
                      <span
                        className={cn(
                          "w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border-2",
                          isActive
                            ? "bg-white text-zinc-950 border-white"
                            : "bg-zinc-100 text-zinc-900 border-zinc-900"
                        )}
                      >
                        {stage.stepNumber}
                      </span>

                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-black block truncate">
                          {stage.tabLabel}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-medium block truncate",
                            isActive ? "text-zinc-300 font-mono" : "text-zinc-500 font-doodle"
                          )}
                        >
                          {stage.tag}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform",
                        isActive ? "text-white translate-x-0.5" : "text-zinc-400"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            {/* RIGHT STAGE: Live Morphing Viewport (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="w-full flex-1 rounded-2xl bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181B] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                
                {/* Active Stage Heading */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border", activeStage.badgeBg)}>
                      {activeStage.tag}
                    </span>
                    <span className="font-doodle text-xs text-zinc-500 font-bold">
                      Verified Engine v2.0
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                    {activeStage.title}
                  </h3>
                  <span className="text-xs font-bold text-zinc-500 block mb-3">
                    {activeStage.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mb-5">
                    {activeStage.description}
                  </p>
                </div>

                {/* DYNAMIC LIVE SIMULATOR VIEWPORT */}
                <div className="w-full mt-auto">
                  <AnimatePresence mode="wait">
                    
                    {/* STAGE 01: Terminal Git Ingestion Stream */}
                    {activeStage.id === "github" && (
                      <motion.div
                        key="stage-github"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 border-2 border-zinc-900 shadow-inner space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[10px] text-zinc-500">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <Terminal className="w-3.5 h-3.5" />
                            gitproof-audit-worker ~ live
                          </span>
                          <span className="text-zinc-500">SHA: a1c94f2</span>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <p className="text-emerald-400">✓ Ingested 14 public repos (1,420 commits)</p>
                          <p className="text-zinc-300">↳ Detected 94% original author contribution</p>
                          <p className="text-zinc-400">↳ Language breakdown: TypeScript (65%) · Go (25%) · Python (10%)</p>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mt-2">
                          <div className="w-full h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500" />
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 02: Document OCR Scanner */}
                    {activeStage.id === "ocr" && (
                      <motion.div
                        key="stage-ocr"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-sky-50/70 p-4 border-2 border-zinc-900 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-sky-700" />
                            <div>
                              <span className="text-xs font-black text-zinc-950 block">AWS Certified Solutions Architect</span>
                              <span className="text-[10px] text-zinc-600 font-mono">Issued by Amazon Web Services</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-950 text-[10px] font-black font-mono border border-sky-400">
                            OCR VALIDATED
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-zinc-300 text-[11px] font-medium text-zinc-700">
                          <span className="font-doodle text-sky-800 font-bold block">✓ Extracted Skill Claims:</span>
                          <span className="text-zinc-900 font-mono text-[10px]">Cloud Orchestration · Distributed Storage · IAM Policies</span>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 03: Cryptographic Minting Vault */}
                    {activeStage.id === "mint" && (
                      <motion.div
                        key="stage-mint"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-[#FAF5FF] p-4 border-2 border-zinc-900 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-purple-700" />
                            <div>
                              <span className="text-xs font-black text-zinc-950 block">Minskey Passport Ledger</span>
                              <span className="text-[10px] text-purple-800 font-mono font-bold">ID: CDY26S7421</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-950 text-[10px] font-black font-mono border border-purple-400">
                            3/3 AGENTS APPROVED
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 text-white font-mono text-[10px]">
                          <span className="truncate max-w-[220px] text-purple-300">SHA-256: 8f4a19c8d23b7e41fa80c92157a4192b</span>
                          <button
                            type="button"
                            onClick={handleCopyHash}
                            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 04: Role Calibration Radar */}
                    {activeStage.id === "radar" && (
                      <motion.div
                        key="stage-radar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-[#FEFCE8] p-4 border-2 border-zinc-900 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600 block">Target Benchmark</span>
                            <span className="text-sm font-black text-zinc-950">AI Engineer (~95% Match Potential)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-doodle text-lg font-black text-rose-600 block">60% Match</span>
                            <span className="text-[9px] text-zinc-600 font-bold">2 Gaps to Bridge</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                          <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-950">
                            ✓ Verified: TypeScript, Python, LLMs
                          </div>
                          <div className="p-2 rounded-lg bg-rose-100 border border-rose-400 text-rose-950">
                            ⚠️ Gaps: PostgreSQL, Go Microservices
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 05: Dynamic AI Sprint Roadmap */}
                    {activeStage.id === "roadmap" && (
                      <motion.div
                        key="stage-roadmap"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-[#EFF6FF] p-4 border-2 border-zinc-900 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-zinc-950">14-Day Sprint: Close PostgreSQL Gap</span>
                          <span className="font-doodle text-xs font-bold text-blue-700">Sprint 1 of 2</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] font-medium text-zinc-800">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Milestone 1: Indexing & Connection Pooling Repo</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-600">
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 flex items-center justify-center text-[8px]">2</span>
                            <span>Milestone 2: Distributed Database Concurrency Blueprint</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 06: Recruiter Verification Ledger */}
                    {activeStage.id === "hire" && (
                      <motion.div
                        key="stage-hire"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 p-4 border-2 border-zinc-900 flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border-2 border-zinc-900 shadow-2xs flex items-center justify-center text-zinc-950">
                            <Award className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-zinc-950 block">Audited Candidate Ready</span>
                            <span className="text-[10px] text-zinc-600 font-medium">1-Click Recruiter Handoff</span>
                          </div>
                        </div>
                        <a
                          href="/recruiter"
                          className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-900 transition-colors shadow-2xs"
                        >
                          View Dossier →
                        </a>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Callout Ribbon */}
          <div className="mt-6 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="font-doodle text-xs sm:text-sm font-bold text-zinc-700">
              ⚡ Over 1,200 student developers have minted tamper-proof skill passports.
            </span>
            <a
              href="/login"
              className="font-mono text-xs font-black text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>Mint Your Free Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
