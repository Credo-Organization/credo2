"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  GitBranch,
  Upload,
  ShieldCheck,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Terminal,
  FileCheck,
  Lock,
  Award,
  Pin,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Handcrafted Sketched Pushpin */
function PushPin({ color = "#3B82F6", className }: { color?: string; className?: string }) {
  return (
    <div className={cn("absolute -top-3 left-4 w-6 h-6 z-30 pointer-events-none drop-shadow-xs", className)}>
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <circle cx="16" cy="12" r="6" fill={color} stroke="#18181B" strokeWidth="2" />
        <circle cx="14" cy="10" r="2" fill="#FFFFFF" opacity="0.6" />
        <path d="M16 18L16 26" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Handcrafted Washi Tape */
function WashiTape({ className, color = "bg-amber-300/80" }: { className?: string; color?: string }) {
  return (
    <div
      className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-xs border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none -rotate-1 z-20",
        color,
        className
      )}
    />
  );
}

export function DoodleFeaturesSection() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <section id="features" className="py-20 sm:py-28 relative bg-[#FAF9F6] border-b border-zinc-200/80 overflow-hidden select-none">
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] mb-4">
            <Pin className="w-3.5 h-3.5 text-amber-800" />
            <span className="font-bold text-xs uppercase tracking-wider text-amber-950">
              The Proof Whiteboard
            </span>
          </div>

          <span className="font-doodle text-2xl sm:text-3xl text-amber-700 font-bold block mb-1">
            📌 Real artifacts pinned across an engineer&apos;s working canvas
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            Everything you need to{" "}
            <span className="relative inline-block text-amber-600">
              prove your skills.
              <svg viewBox="0 0 160 14" fill="none" className="w-full h-3 text-amber-500 pointer-events-none absolute -bottom-1 left-0">
                <path d="M3 8C35 3 75 12 115 6C135 3 145 9 157 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-4 text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            No rigid split containers or resume summaries. Real code diffs, OCR scans, and anti-cheat consensus pinned into an authentic proof ecosystem.
          </p>
        </div>

        {/* ── THE FREEFORM WHITEBOARD CANVAS (OPTION 2) ── */}
        <div className="relative w-full min-h-[820px] lg:min-h-[700px] flex flex-col justify-between">
          
          {/* BACKGROUND HAND-DRAWN CONNECTING ARROWS (Desktop Only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            {/* Arrow 1: AST (Top Left) -> Center Anti-Cheat */}
            <svg className="absolute top-28 left-[38%] w-32 h-20 text-zinc-400" viewBox="0 0 120 80" fill="none">
              <path d="M10 20C40 10 80 40 105 60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M95 58L105 60L103 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="30" y="32" className="text-[10px] font-doodle fill-zinc-600 font-bold">audited for forks</text>
            </svg>

            {/* Arrow 2: OCR Certificate (Top Right) -> Center Anti-Cheat */}
            <svg className="absolute top-28 right-[36%] w-32 h-20 text-zinc-400" viewBox="0 0 120 80" fill="none">
              <path d="M110 20C80 10 40 40 15 60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M17 48L15 60L25 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="35" y="32" className="text-[10px] font-doodle fill-zinc-600 font-bold">issuer DID scan</text>
            </svg>

            {/* Arrow 3: Center Anti-Cheat -> Bottom Left Gap Radar */}
            <svg className="absolute bottom-40 left-[34%] w-36 h-28 text-zinc-400" viewBox="0 0 140 100" fill="none">
              <path d="M80 10C50 30 20 60 15 85" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M10 75L15 85L25 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="40" y="55" className="text-[10px] font-doodle fill-zinc-600 font-bold">benchmarked</text>
            </svg>

            {/* Arrow 4: Center Anti-Cheat -> Bottom Right Recruiter Ticket */}
            <svg className="absolute bottom-40 right-[34%] w-36 h-28 text-zinc-400" viewBox="0 0 140 100" fill="none">
              <path d="M60 10C90 30 120 60 125 85" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M115 80L125 85L130 75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="45" y="55" className="text-[10px] font-doodle fill-zinc-600 font-bold">fast-tracked</text>
            </svg>
          </div>

          {/* ── WHITEBOARD ARTIFACTS (Scattered Organic Grid) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 relative z-10 items-start">
            
            {/* ────────────────────────────────────────────────────────
                ARTIFACT 1: AST Code Ingestion Sticky Note (Top Left, 4 Cols)
                ──────────────────────────────────────────────────────── */}
            <motion.div
              whileHover={{ scale: 1.02, rotate: 0 }}
              className="lg:col-span-4 rounded-3xl bg-[#FEF08A] border-2 border-zinc-900 p-6 shadow-[5px_5px_0px_0px_#18181B] rotate-[-2.5deg] relative transition-transform"
            >
              <PushPin color="#EF4444" />
              <div className="flex items-center justify-between mb-3 pt-2">
                <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-md bg-white border border-zinc-900 shadow-2xs">
                  ARTIFACT #01
                </span>
                <span className="font-doodle text-xs font-bold text-amber-900">
                  ⚡ 10-Sec AST Sieve
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-2xs">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-zinc-950">
                  Deep Git Code Ingestion
                </h3>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed mb-4">
                Parses raw Abstract Syntax Trees, commit velocity, and branch history to prove authentic code contribution.
              </p>

              {/* Code Snippet */}
              <div className="rounded-xl bg-zinc-950 p-3 font-mono text-[10px] text-zinc-300 border border-zinc-800 shadow-inner space-y-1">
                <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-1 text-[9px]">
                  <span>git-ingest ~ live</span>
                  <span className="text-emerald-400">PASSED</span>
                </div>
                <p className="text-emerald-400">✓ 14 public repos (1,420 commits)</p>
                <p className="text-zinc-400">↳ 94% original author contribution</p>
                <p className="text-zinc-300">↳ TypeScript (65%) · Go (25%) · Python (10%)</p>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-400/80 flex items-center justify-between text-[11px] font-doodle font-bold text-amber-950">
                <span>↳ &quot;Zero fake lines.&quot;</span>
                <span className="font-mono text-[9px] bg-white px-2 py-0.5 rounded border border-zinc-900">SHA: a1c94f</span>
              </div>
            </motion.div>

            {/* ────────────────────────────────────────────────────────
                ARTIFACT 2: Anti-Cheat Sentinel Center Seal (Center, 4 Cols)
                ──────────────────────────────────────────────────────── */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: 0 }}
              className="lg:col-span-4 rounded-3xl bg-[#FAF5FF] border-2 border-zinc-900 p-6 sm:p-7 shadow-[6px_6px_0px_0px_#18181B] rotate-[1.5deg] relative transition-transform flex flex-col justify-between"
            >
              <WashiTape color="bg-purple-300/90" />
              
              <div>
                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-md bg-purple-950 text-white border border-purple-800">
                    CENTRAL INTEGRITY CORE
                  </span>
                  <span className="font-doodle text-xs font-bold text-purple-700">
                    3/3 Consensus
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-200 border-2 border-zinc-900 flex items-center justify-center text-purple-950 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-950">
                    Anti-Cheat Sentinel
                  </h3>
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed mb-4">
                  Multi-agent ensemble that filters out cloned repositories, tutorial copy-pasting, and AI boilerplate dumps.
                </p>

                {/* Status Indicator Box */}
                <div className="p-3 rounded-2xl bg-white border-2 border-zinc-900 shadow-xs space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-purple-900">Plagiarism Sieve:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] border border-emerald-300">
                      0 FORK VIOLATIONS
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 border border-zinc-300 overflow-hidden">
                    <div className="w-[98%] h-full bg-purple-600 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Authenticity: 98.4%</span>
                    <span>Entropy: High</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-200 flex items-center justify-between">
                <span className="font-doodle text-xs font-bold text-purple-900">
                  ★ Cryptographically Signed
                </span>
                <span className="font-mono text-[9px] bg-purple-100 text-purple-950 px-2 py-0.5 rounded border border-purple-300 font-black">
                  CDY26S7421
                </span>
              </div>
            </motion.div>

            {/* ────────────────────────────────────────────────────────
                ARTIFACT 3: Multimodal Vision OCR Document (Top Right, 4 Cols)
                ──────────────────────────────────────────────────────── */}
            <motion.div
              whileHover={{ scale: 1.02, rotate: 0 }}
              className="lg:col-span-4 rounded-3xl bg-[#F0F9FF] border-2 border-zinc-900 p-6 shadow-[5px_5px_0px_0px_#18181B] rotate-[-1.8deg] relative transition-transform"
            >
              <PushPin color="#0EA5E9" />
              <div className="flex items-center justify-between mb-3 pt-2">
                <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-md bg-white border border-zinc-900 shadow-2xs">
                  ARTIFACT #02
                </span>
                <span className="font-doodle text-xs font-bold text-sky-900">
                  📜 Vision OCR
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-sky-200 border-2 border-zinc-900 flex items-center justify-center text-sky-950 shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-zinc-950">
                  Accredited Proof OCR
                </h3>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed mb-4">
                Multimodal OCR extracts accredited skill claims, issuing authority DIDs, and timestamps from certificates.
              </p>

              {/* Verified Document Pill */}
              <div className="p-3 rounded-xl bg-white border-2 border-zinc-900 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-black text-zinc-950">AWS Solutions Architect</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 font-mono text-[9px] font-black border border-sky-300">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600 font-mono">
                  Issuer: Amazon Web Services · DID Signature: 0x8f4a...92b1
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-sky-300/80 flex items-center justify-between text-[11px] font-doodle font-bold text-sky-950">
                <span>↳ &quot;Tamper-proof credentials.&quot;</span>
                <span className="font-mono text-[9px] bg-sky-200 px-2 py-0.5 rounded border border-sky-400 font-bold">100% Match</span>
              </div>
            </motion.div>

            {/* ────────────────────────────────────────────────────────
                ARTIFACT 4: Skill Gap Spider Radar (Bottom Left, 6 Cols)
                ──────────────────────────────────────────────────────── */}
            <motion.div
              whileHover={{ scale: 1.01, rotate: 0 }}
              className="lg:col-span-6 rounded-3xl bg-[#ECFDF5] border-2 border-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_0px_#18181B] rotate-[1.2deg] relative transition-transform"
            >
              <WashiTape color="bg-emerald-300/90" />
              <div className="flex items-center justify-between mb-3 pt-1">
                <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-md bg-white border border-zinc-900 shadow-2xs">
                  ARTIFACT #03
                </span>
                <span className="font-doodle text-xs font-bold text-emerald-800">
                  🎯 Role Calibration
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-200 border-2 border-zinc-900 flex items-center justify-center text-emerald-950 shadow-2xs">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-zinc-950">
                  Skill Gap Spider Radar
                </h3>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed mb-4">
                Calibrates your verified competencies against 50+ real-world industry hiring rubrics (AI Engineer, Full-Stack Lead).
              </p>

              {/* Interactive Radar Pill Bar */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-zinc-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-950">Target Benchmark: AI Engineer</span>
                  <span className="font-doodle text-xs font-bold text-rose-600">60% Match (2 Gaps)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900">
                    ✓ Verified: Python, TypeScript, LLMs
                  </div>
                  <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900">
                    ⚠️ Gap: Distributed Systems, Go
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ────────────────────────────────────────────────────────
                ARTIFACT 5: Recruiter Verification Boarding Pass (Bottom Right, 6 Cols)
                ──────────────────────────────────────────────────────── */}
            <motion.div
              whileHover={{ scale: 1.01, rotate: 0 }}
              className="lg:col-span-6 rounded-3xl bg-[#FFF1F2] border-2 border-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_0px_#18181B] rotate-[-1.5deg] relative transition-transform"
            >
              <PushPin color="#F43F5E" />
              <div className="flex items-center justify-between mb-3 pt-1">
                <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-md bg-white border border-zinc-900 shadow-2xs">
                  ARTIFACT #04
                </span>
                <span className="font-doodle text-xs font-bold text-rose-800">
                  🎉 Fast-Track Hiring
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-rose-200 border-2 border-zinc-900 flex items-center justify-center text-rose-950 shadow-2xs">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-zinc-950">
                  Recruiter Verification Ledger
                </h3>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed mb-4">
                Recruiters scan student passport QR codes to inspect commit evidence in under 10 seconds, bypassing resume screening.
              </p>

              {/* Recruiter Boarding Pass Pill */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-zinc-950 block">Direct Interview Invite</span>
                    <span className="text-[10px] text-zinc-600 font-mono">1-Click Recruiter Handoff Cleared</span>
                  </div>
                </div>
                <a
                  href="/recruiter"
                  className="px-3 py-1.5 rounded-xl bg-zinc-950 text-white font-bold text-xs border border-zinc-900 hover:bg-zinc-800 transition-colors shadow-2xs"
                >
                  Recruiter Portal →
                </a>
              </div>
            </motion.div>

          </div>

          {/* Bottom Floating Whiteboard Banner */}
          <div className="mt-14 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 px-6 rounded-2xl bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181B]">
              <span className="font-doodle text-sm sm:text-base font-bold text-zinc-900">
                🚀 All 5 whiteboard artifacts compile into your single verifiable Skill Passport ID.
              </span>
              <a
                href="/login"
                className="px-4 py-1.5 rounded-xl bg-amber-400 text-zinc-950 text-xs font-black border-2 border-zinc-900 hover:bg-amber-300 transition-colors shadow-2xs"
              >
                Mint Yours Free →
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
