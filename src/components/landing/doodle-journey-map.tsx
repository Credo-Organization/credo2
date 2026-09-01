"use client";

import React from "react";
import { motion } from "motion/react";
import {
  GitBranch,
  Upload,
  ShieldCheck,
  Target,
  Compass,
  Users,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyStep {
  step: string;
  title: string;
  description: string;
  doodleTag: string;
  metric: string;
  icon: React.ElementType;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  tapeColor: string;
  rotation: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: "01",
    title: "Connect GitHub",
    description: "Link your GitHub account in 10 seconds. AI reads commit history, PRs, repos, and language distributions automatically.",
    doodleTag: "⚡ 10-sec OAuth sync",
    metric: "100% Repos Parsed",
    icon: GitBranch,
    cardBg: "bg-[#F0FDF4]",
    badgeBg: "bg-emerald-200",
    badgeText: "text-emerald-950",
    tapeColor: "bg-emerald-300/80",
    rotation: "rotate-[-1.5deg]",
  },
  {
    step: "02",
    title: "Upload Proofs",
    description: "Add hackathon certificates, cloud certifications, and course credentials. Multimodal OCR extracts verified competencies.",
    doodleTag: "📜 Instant credential OCR",
    metric: "Anti-Tamper Scan",
    icon: Upload,
    cardBg: "bg-[#F0F9FF]",
    badgeBg: "bg-sky-200",
    badgeText: "text-sky-950",
    tapeColor: "bg-sky-300/80",
    rotation: "rotate-[1.2deg]",
  },
  {
    step: "03",
    title: "Mint Passport",
    description: "AI cross-references commits with claimed skills, runs plagiarism analysis, and mints your cryptographic skill passport.",
    doodleTag: "🔒 Cryptographic proof",
    metric: "SHA-256 Verified",
    icon: ShieldCheck,
    cardBg: "bg-[#FAF5FF]",
    badgeBg: "bg-purple-200",
    badgeText: "text-purple-950",
    tapeColor: "bg-purple-300/80",
    rotation: "rotate-[-1deg]",
  },
  {
    step: "04",
    title: "Skill Gap Radar",
    description: "Compare your verified proof against your dream company role. Pinpoint the exact libraries or architectures you need next.",
    doodleTag: "🎯 0% to 100% role fit",
    metric: "Benchmark Radar",
    icon: Target,
    cardBg: "bg-[#FEFCE8]",
    badgeBg: "bg-amber-200",
    badgeText: "text-amber-950",
    tapeColor: "bg-amber-300/80",
    rotation: "rotate-[1.5deg]",
  },
  {
    step: "05",
    title: "Dynamic Roadmap",
    description: "Receive a personalized, milestone-driven learning roadmap with curated GitHub issues and projects to close skill gaps.",
    doodleTag: "🗺️ Actionable milestones",
    metric: "Smart Sprint Plan",
    icon: Compass,
    cardBg: "bg-[#EFF6FF]",
    badgeBg: "bg-blue-200",
    badgeText: "text-blue-950",
    tapeColor: "bg-blue-300/80",
    rotation: "rotate-[-1.2deg]",
  },
  {
    step: "06",
    title: "Team Up & Get Hired",
    description: "Share your passport QR code with recruiters or match with verified peers to build winning hackathon squads.",
    doodleTag: "🎉 Top 1% matching",
    metric: "Direct Recruiter Link",
    icon: Users,
    cardBg: "bg-[#FFF1F2]",
    badgeBg: "bg-rose-200",
    badgeText: "text-rose-950",
    tapeColor: "bg-rose-300/80",
    rotation: "rotate-[1.2deg]",
  },
];

/** Hand-drawn curved horizontal arrow connector between cards */
function DoodleConnectorArrow({ className }: { className?: string }) {
  return (
    <div className={cn("hidden lg:flex items-center justify-center -mx-3 z-30 select-none pointer-events-none", className)}>
      <svg
        viewBox="0 0 70 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-8 text-zinc-900"
      >
        <path
          d="M4 16C18 8 32 24 46 16C54 11 60 14 64 16"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M54 9L64 16L55 23"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Sketched Pushpin */
function PushPin({ className }: { className?: string }) {
  return (
    <div className={cn("absolute -top-3 left-4 w-6 h-6 z-30 pointer-events-none", className)}>
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-xs">
        <circle cx="16" cy="12" r="6" fill="#3B82F6" stroke="#18181B" strokeWidth="2" />
        <circle cx="14" cy="10" r="2" fill="#93C5FD" />
        <path d="M16 18L16 26" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function DoodleJourneyMap() {
  const row1 = JOURNEY_STEPS.slice(0, 3);
  const row2 = JOURNEY_STEPS.slice(3, 6);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative bg-[#FAF9F6] border-b border-zinc-200/80 overflow-hidden select-none">
      {/* Background Dot Matrix for Paper Texture */}
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
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-blue-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider text-blue-950">
              The Proof Pipeline
            </span>
          </div>

          <span className="font-doodle text-3xl sm:text-4xl text-blue-600 font-bold block mb-1">
            From raw GitHub code to career leverage 🚀
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            How Minskey works in{" "}
            <span className="relative inline-block text-blue-600">
              6 steps.
              <svg viewBox="0 0 140 14" fill="none" className="w-full h-3 text-blue-500 pointer-events-none absolute -bottom-1 left-0">
                <path d="M3 8C28 3 55 12 85 6C105 3 125 10 137 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-4 text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            No self-reported skill ratings or unverifiable claims. An automated, tamper-proof pipeline that transforms your real code into an evidence-backed passport.
          </p>
        </div>

        {/* ── ROW 1: Steps 01 -> 02 -> 03 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch relative">
          {row1.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.step}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
                  className={cn(
                    "relative rounded-2xl border-2 border-zinc-900 p-6 sm:p-7 flex flex-col justify-between shadow-[4px_4px_0px_0px_#18181B] transition-transform duration-200",
                    item.cardBg,
                    item.rotation
                  )}
                >
                  <PushPin />
                  {/* Washi Tape */}
                  <div
                    className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-xs border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none -rotate-1",
                      item.tapeColor
                    )}
                  />

                  {/* Card Content */}
                  <div>
                    {/* Header: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-4 pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-doodle text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">
                          {item.step}
                        </span>
                        <span className="font-doodle text-lg font-bold text-blue-600">
                          Step
                        </span>
                      </div>

                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl border-2 border-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#18181B]",
                          item.badgeBg
                        )}
                      >
                        <Icon className={cn("w-6 h-6", item.badgeText)} />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-zinc-950 tracking-tight mb-2">
                      {item.title}
                    </h3>

                    <p className="text-zinc-700 text-sm leading-relaxed font-normal mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Tag & Metric */}
                  <div className="pt-3 border-t-2 border-dashed border-zinc-900/15 flex items-center justify-between mt-2">
                    <span className="font-doodle text-lg font-bold text-zinc-800">
                      {item.doodleTag}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-zinc-900/30 bg-white/80 text-zinc-900">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.metric}
                    </span>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Mid-Board Hand-Drawn Loop Connector (Desktop) ── */}
        <div className="hidden lg:flex items-center justify-end pr-16 my-8 select-none relative">
          <div className="flex items-center gap-3 mr-4">
            <span className="font-doodle text-2xl font-bold text-blue-600 rotate-1">
              Data Verified! Next: Actionable Growth 🎯
            </span>
          </div>

          <svg
            viewBox="0 0 180 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-44 h-20 text-zinc-900"
          >
            <path
              d="M10 12 C130 12 160 30 160 50 C160 70 130 75 30 75"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="6 6"
            />
            <path
              d="M48 66L30 75L48 84"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Mobile vertical divider */}
        <div className="lg:hidden flex justify-center my-6 text-zinc-900">
          <ArrowDown className="w-8 h-8 animate-bounce text-blue-600" />
        </div>

        {/* ── ROW 2: Steps 04 -> 05 -> 06 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch relative">
          {row2.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
                className={cn(
                  "relative rounded-2xl border-2 border-zinc-900 p-6 sm:p-7 flex flex-col justify-between shadow-[4px_4px_0px_0px_#18181B] transition-transform duration-200",
                  item.cardBg,
                  item.rotation
                )}
              >
                <PushPin />
                {/* Washi Tape */}
                <div
                  className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-xs border-dashed border-t border-b border-zinc-400/50 backdrop-blur-xs shadow-xs pointer-events-none rotate-1",
                    item.tapeColor
                  )}
                />

                {/* Card Content */}
                <div>
                  <div className="flex items-center justify-between mb-4 pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-doodle text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">
                        {item.step}
                      </span>
                      <span className="font-doodle text-lg font-bold text-blue-600">
                        Step
                      </span>
                    </div>

                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl border-2 border-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#18181B]",
                        item.badgeBg
                      )}
                    >
                      <Icon className={cn("w-6 h-6", item.badgeText)} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-zinc-950 tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-zinc-700 text-sm leading-relaxed font-normal mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Footer Tag & Metric */}
                <div className="pt-3 border-t-2 border-dashed border-zinc-900/15 flex items-center justify-between mt-2">
                  <span className="font-doodle text-lg font-bold text-zinc-800">
                    {item.doodleTag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-zinc-900/30 bg-white/80 text-zinc-900">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item.metric}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
