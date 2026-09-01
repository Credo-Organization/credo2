"use client";

import React from "react";
import { motion } from "motion/react";
import {
  FileBadge,
  GitBranch,
  ShieldCheck,
  Target,
  Compass,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/ui/login-modal";

export function DoodleFeaturesSection() {
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
        <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-950">
              The Proof Toolbelt
            </span>
          </div>

          <span className="font-doodle text-3xl sm:text-4xl text-emerald-600 font-bold block mb-1">
            Engineered for developers who prefer code over talk 🛠️
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            Everything you need to{" "}
            <span className="relative inline-block text-blue-600">
              prove your skills.
              <svg viewBox="0 0 160 14" fill="none" className="w-full h-3 text-blue-500 pointer-events-none absolute -bottom-1 left-0">
                <path d="M3 8C35 3 75 12 115 6C135 3 145 9 157 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-4 text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Replace self-reported ratings with evidence-backed engineering tools built for campus developers, hackathon competitors, and technical recruiters.
          </p>
        </div>

        {/* ── BENTO SKETCHBOOK GRID (No moving marquee!) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {/* ────────────────────────────────────────────────────────
              FEATURE 1: The Evidence-Backed Skill Passport (Hero Bento - Spans 2 Cols)
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="lg:col-span-2 relative rounded-2xl border-2 border-zinc-900 bg-[#ECFDF5] p-6 sm:p-8 shadow-[5px_5px_0px_0px_#18181B] flex flex-col justify-between transition-transform duration-200"
          >
            {/* Top Washi Tape */}
            <div className="absolute -top-3 left-12 w-28 h-5 rounded-xs bg-emerald-300/80 border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none -rotate-1" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <FileBadge className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-emerald-800 rotate-1">
                  ★ Core Credential
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-3">
                The Evidence-Backed Skill Passport
              </h3>

              <p className="text-zinc-700 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                A living, cryptographic record of your engineering capability. Instead of listing words like &quot;React&quot; or &quot;Node.js&quot;, every single competency is linked to public git commits, pull requests, and verified certificates.
              </p>

              {/* Hand-drawn Proof Pill Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  "Tamper-proof SHA-256 integrity hash",
                  "Direct code diff and commit attribution",
                  "Accredited license and certificate OCR",
                  "One-click verified public profile link",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/80 rounded-xl border border-zinc-900/20 px-3 py-2 text-xs sm:text-sm font-semibold text-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-300/80 mt-2 flex items-center justify-between">
              <span className="font-doodle text-lg font-bold text-emerald-950">
                ↳ &quot;Your real code is your ultimate credential.&quot;
              </span>
              <span className="text-xs font-black bg-emerald-300 text-zinc-950 px-3 py-1 rounded-full border border-emerald-800/40">
                100% Cryptographic
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              FEATURE 2: AI GitHub Analyzer
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative rounded-2xl border-2 border-zinc-900 bg-[#F0F9FF] p-6 sm:p-7 shadow-[5px_5px_0px_0px_#18181B] flex flex-col justify-between rotate-[0.8deg] transition-transform duration-200"
          >
            <div className="absolute -top-3 right-10 w-24 h-5 rounded-xs bg-sky-300/80 border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none rotate-1" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <GitBranch className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-sky-800 -rotate-1">
                  ⚡ AST Code Parser
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-2">
                Deep Git Code Ingestion
              </h3>

              <p className="text-zinc-700 text-sm leading-relaxed mb-4">
                Analyzes commit velocity, codebase complexity, code review habits, and branch architecture to surface skills you didn&apos;t even know you had.
              </p>

              {/* Sketched Code Chip Box */}
              <div className="bg-white/80 rounded-xl border border-dashed border-zinc-400 p-3 my-2 text-xs font-mono text-zinc-700 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span>commit: 4f9a2e</span>
                  <span className="text-emerald-700 font-bold">14 repos parsed</span>
                </div>
                <div className="font-bold text-zinc-900">
                  TypeScript · Go · Python · Docker
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-300/80 mt-2 flex items-center justify-between">
              <span className="font-doodle text-lg font-bold text-sky-950">
                ↳ Automated audit
              </span>
              <span className="text-xs font-black bg-sky-300 text-zinc-950 px-2.5 py-0.5 rounded-full border border-sky-800/40">
                10-sec Sync
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              FEATURE 3: Plagiarism & Anti-Cheat Sentinel
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative rounded-2xl border-2 border-zinc-900 bg-[#FEFCE8] p-6 sm:p-7 shadow-[5px_5px_0px_0px_#18181B] flex flex-col justify-between rotate-[-1deg] transition-transform duration-200"
          >
            <div className="absolute -top-3 left-8 w-24 h-5 rounded-xs bg-amber-300/80 border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none -rotate-1" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-amber-900 rotate-1">
                  🛡️ Anti-Cheat
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-2">
                Anti-Cheat Sentinel
              </h3>

              <p className="text-zinc-700 text-sm leading-relaxed mb-4">
                Detects forked repositories, tutorial copy-pasting, and AI-generated commit spam so honest student engineers get the credit they deserve.
              </p>

              {/* Status Box */}
              <div className="bg-white/80 rounded-xl border border-dashed border-zinc-400 p-3 my-2 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900">Fork Detection: Clean</div>
                  <div className="text-zinc-500 text-[11px]">Authenticity Score: 98%</div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-black uppercase">
                  VERIFIED
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-300/80 mt-2 flex items-center justify-between">
              <span className="font-doodle text-lg font-bold text-amber-950">
                ↳ Fair for builders
              </span>
              <span className="text-xs font-black bg-amber-300 text-zinc-950 px-2.5 py-0.5 rounded-full border border-amber-800/40">
                Zero Plagiarism
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              FEATURE 4: Skill Gap Radar
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative rounded-2xl border-2 border-zinc-900 bg-[#FAF5FF] p-6 sm:p-7 shadow-[5px_5px_0px_0px_#18181B] flex flex-col justify-between rotate-[1deg] transition-transform duration-200"
          >
            <div className="absolute -top-3 right-8 w-24 h-5 rounded-xs bg-purple-300/80 border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none rotate-1" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <Target className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-purple-900 -rotate-1">
                  🎯 Spider Radar
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-2">
                Live Skill Gap Radar
              </h3>

              <p className="text-zinc-700 text-sm leading-relaxed mb-4">
                Benchmark your proven stack against your dream company role (e.g. Senior Full-Stack at Google/Stripe) to see what to build next.
              </p>

              {/* Spider Chart Mockup Box */}
              <div className="bg-white/80 rounded-xl border border-dashed border-zinc-400 p-3 my-2 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-zinc-900 block">Target: Distributed Systems</span>
                  <span className="text-zinc-500 text-[11px]">Match: 82% · Gap: gRPC, Redis</span>
                </div>
                <span className="font-doodle font-bold text-lg text-purple-700">
                  +18% to Goal
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-300/80 mt-2 flex items-center justify-between">
              <span className="font-doodle text-lg font-bold text-purple-950">
                ↳ Clear direction
              </span>
              <span className="text-xs font-black bg-purple-300 text-zinc-950 px-2.5 py-0.5 rounded-full border border-purple-800/40">
                Real-Time
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              FEATURE 5: Dynamic Milestone Roadmap
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative rounded-2xl border-2 border-zinc-900 bg-[#EFF6FF] p-6 sm:p-7 shadow-[5px_5px_0px_0px_#18181B] flex flex-col justify-between rotate-[-0.8deg] transition-transform duration-200"
          >
            <div className="absolute -top-3 left-10 w-24 h-5 rounded-xs bg-blue-300/80 border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none -rotate-1" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <Compass className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-blue-900 rotate-1">
                  🗺️ Action Plan
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-2">
                Personalized Roadmaps
              </h3>

              <p className="text-zinc-700 text-sm leading-relaxed mb-4">
                Never wonder what to code on weekends. AI generates a personalized milestone learning path with real GitHub issues to build and ship.
              </p>

              {/* Milestone Box */}
              <div className="bg-white/80 rounded-xl border border-dashed border-zinc-400 p-3 my-2 text-xs flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">Sprint 1: Dockerize Node App</span>
                  <span className="text-emerald-700 font-bold">Done ✓</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Sprint 2: Redis Caching Layer</span>
                  <span className="text-blue-700 font-bold">In Progress</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-300/80 mt-2 flex items-center justify-between">
              <span className="font-doodle text-lg font-bold text-blue-950">
                ↳ Stop guessing
              </span>
              <span className="text-xs font-black bg-blue-300 text-zinc-950 px-2.5 py-0.5 rounded-full border border-blue-800/40">
                Actionable
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              FEATURE 6: SIH Hackathon Squad Matcher (Large - Spans full or 2 on desktop)
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative lg:col-span-3 rounded-2xl border-2 border-zinc-900 bg-[#FFF1F2] p-6 sm:p-8 shadow-[5px_5px_0px_0px_#18181B] flex flex-col sm:flex-row items-center justify-between gap-6 transition-transform duration-200"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-5 rounded-xs bg-rose-300/80 border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none rotate-1" />

            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-rose-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <Users className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-rose-800">
                  🤝 Smart India Hackathon & Peer Matcher
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-2">
                Team Up With Verified Engineers
              </h3>

              <p className="text-zinc-700 text-sm sm:text-base leading-relaxed font-normal">
                Winning hackathons and shipping great software requires complementary skills, not friends who all code frontend. Find teammates with verified backend, ML, or cloud capabilities and form unstoppable squads.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              <LoginModal>
                <button
                  type="button"
                  className="w-full sm:w-auto h-12 px-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Squads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </LoginModal>
              <span className="font-doodle text-base font-bold text-rose-800">
                ↳ 100% verified skills, zero freeloaders
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
