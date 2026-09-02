"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Bot, FileX, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═════════════════════════════════════════════════════════════════
   DOODLE ACCENT SVGs
   ═════════════════════════════════════════════════════════════════ */

/** Translucent Washi Tape on top of card */
function WashiTape({ className, color = "bg-amber-200/80" }: { className?: string; color?: string }) {
  return (
    <div
      className={cn(
        "absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 rounded-xs border-dashed border-t border-b border-zinc-400/40 backdrop-blur-xs shadow-xs z-30 pointer-events-none rotate-[-1deg]",
        color,
        className
      )}
    />
  );
}

/** Sketched Red Pushpin */
function PushPin({ className }: { className?: string }) {
  return (
    <div className={cn("absolute -top-3 left-4 w-7 h-7 z-30 pointer-events-none", className)}>
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-xs">
        <circle cx="16" cy="12" r="7" fill="#EF4444" stroke="#18181B" strokeWidth="2" />
        <circle cx="14" cy="10" r="2.5" fill="#F87171" />
        <path d="M16 19L16 28" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M11 15C11 17 21 17 21 15" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Wobbly Hand-Drawn Red Ink Strike-Through */
function RedStrikethrough({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 16"
      fill="none"
      className={cn("w-full h-3 text-rose-500 pointer-events-none", className)}
      preserveAspectRatio="none"
    >
      <path
        d="M2 10C35 4 85 14 158 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sketched Red Wobbly Underline */
function RedWobblyUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 14"
      fill="none"
      className={cn("w-full h-3 text-rose-500 pointer-events-none", className)}
    >
      <path
        d="M3 8C28 3 55 12 85 6C105 3 125 10 137 7"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════
   DOODLE PROBLEM SECTION COMPONENT
   ═════════════════════════════════════════════════════════════════ */
export function DoodleProblemSection() {
  const [compareMode, setCompareMode] = useState<"resume" | "passport">("resume");
  return (
    <section className="relative w-full bg-[#FAF9F6] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-zinc-200/80 select-none">
      {/* Background Dot Grid for Paper Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-rose-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] mb-4">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider text-rose-950">
              The Reality of Hiring
            </span>
          </div>

          {/* Cursive Kicker */}
          <span className="font-doodle text-3xl sm:text-4xl text-rose-600 font-bold block mb-1">
            Why traditional resumes fail students ✍️
          </span>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            The paper resume is{" "}
            <span className="relative inline-block text-rose-600">
              broken.
              <RedWobblyUnderline className="absolute -bottom-1 left-0" />
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Recruiters spend 6 seconds scanning PDFs stuffed with self-claimed keywords. AI screeners filter out real builders. Here is why the old way is dead:
          </p>
        </div>

        {/* ── 3 Doodle Problem Cards (Corkboard / Notebook Style) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 w-full items-stretch">
          {/* ────────────────────────────────────────────────────────
              CARD 1: The 6-Second Glance (Yellow Sticky Note)
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
            whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
            className="relative flex flex-col justify-between bg-[#FEF9C3] rounded-2xl border-2 border-zinc-900 p-5 sm:p-7 shadow-[4px_4px_0px_0px_#18181B] rotate-0 sm:rotate-[-1.5deg] transition-transform duration-200"
          >
            <PushPin className="-top-3 left-4" />
            <WashiTape color="bg-amber-300/80" />

            <div>
              {/* Header with Icon & 6s Badge */}
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <Clock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-amber-900 rotate-2">
                  ⏱️ 6 seconds!
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
                The 6-Second Scan
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                Recruiters glance at PDFs for 6 seconds on average. If you don&apos;t match their arbitrary buzzword list instantly, you&apos;re in the trash.
              </p>

              {/* Mock Strikethrough Note Snippet */}
              <div className="relative bg-white/90 rounded-xl border border-dashed border-zinc-400 p-3.5 my-3 shadow-xs">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  On the PDF Resume:
                </span>
                <div className="relative inline-block">
                  <p className="text-sm font-bold text-zinc-800 line-through decoration-rose-500 decoration-3">
                    &quot;Expert in Python, React, AI, Systems&quot;
                  </p>
                  <RedStrikethrough className="absolute top-1 left-0" />
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="font-doodle text-rose-600 font-bold text-base -rotate-1">
                    ↳ &quot;Anyone can write this!&quot;
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Stat Pill */}
            <div className="pt-4 border-t border-amber-300/80 mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Human Attention
              </span>
              <span className="text-xs font-extrabold bg-amber-300 px-2.5 py-1 rounded-full border border-amber-900/40 text-zinc-950">
                75% Unread
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              CARD 2: The ATS Black Hole (Blue Torn Paper)
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
            className="relative flex flex-col justify-between bg-[#E0F2FE] rounded-2xl border-2 border-zinc-900 p-5 sm:p-7 shadow-[4px_4px_0px_0px_#18181B] rotate-0 sm:rotate-[1.2deg] transition-transform duration-200"
          >
            <PushPin className="-top-3 right-6" />
            <WashiTape color="bg-sky-200/80" />

            <div>
              {/* Header with Icon & Stamp Badge */}
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <div className="w-12 h-12 rounded-xl bg-sky-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <Bot className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-rose-600 -rotate-2">
                  🚫 Auto-Filtered
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
                The ATS Black Hole
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                Automated ATS parsers discard over 80% of resumes before a human ever looks at them. A missing keyword ruins months of real hard work.
              </p>

              {/* Sketched Stamp Box */}
              <div className="relative bg-white/90 rounded-xl border border-dashed border-zinc-400 p-3.5 my-3 shadow-xs">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  ATS Bot Verdict:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-700 font-mono font-medium">score: 42/100 (auto-reject)</span>
                  <span className="px-2 py-0.5 rounded border border-rose-500 bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider rotate-[-2deg]">
                    REJECTED
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="font-doodle text-blue-700 font-bold text-base rotate-1">
                    ↳ &quot;Keyword parsing, not skill proof!&quot;
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Stat Pill */}
            <div className="pt-4 border-t border-sky-300/80 mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wide">
                Algorithm Bottleneck
              </span>
              <span className="text-xs font-extrabold bg-sky-300 px-2.5 py-1 rounded-full border border-sky-900/40 text-zinc-950">
                85% Filtered
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────
              CARD 3: Zero Proof of Craft (Lavender Sketch Paper)
              ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
            className="relative flex flex-col justify-between bg-[#F3E8FF] rounded-2xl border-2 border-zinc-900 p-5 sm:p-7 shadow-[4px_4px_0px_0px_#18181B] rotate-0 sm:rotate-[-1deg] transition-transform duration-200"
          >
            <PushPin className="-top-3 left-8" />
            <WashiTape color="bg-purple-300/80" />

            <div>
              {/* Header with Icon & Question Badge */}
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <div className="w-12 h-12 rounded-xl bg-purple-200 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]">
                  <FileX className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-doodle font-bold text-2xl text-purple-900 rotate-1">
                  ❓ Zero Proof
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
                Unverifiable Claims
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                Anyone can copy a project description off GitHub and paste it on their resume. Recruiters have zero cryptographic proof of who actually built it.
              </p>

              {/* Sketched Reality Box */}
              <div className="relative bg-white/90 rounded-xl border border-dashed border-zinc-400 p-3.5 my-3 shadow-xs">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  The Trust Gap:
                </span>
                <p className="text-xs text-zinc-700 leading-tight">
                  &quot;Led architecture for 10k users&quot;
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-doodle text-purple-700 font-bold text-base -rotate-1">
                    ↳ &quot;Show me the git commits!&quot;
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    No Proof
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Stat Pill */}
            <div className="pt-4 border-t border-purple-300/80 mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                Hiring Skepticism
              </span>
              <span className="text-xs font-extrabold bg-purple-300 px-2.5 py-1 rounded-full border border-purple-900/40 text-zinc-950">
                84% Doubt Self-Claims
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── INTERACTIVE BEFORE / AFTER COMPARISON TOGGLE ── */}
        <div className="mt-20 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Handwritten Kicker & Switcher Controls */}
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <span className="font-doodle text-2xl sm:text-3xl text-zinc-900 font-bold rotate-[-0.5deg]">
              Toggle the difference for yourself:
            </span>

            <div className="inline-flex p-1.5 rounded-2xl bg-zinc-200/90 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B]">
              <button
                type="button"
                onClick={() => setCompareMode("resume")}
                className={cn(
                  "px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2",
                  compareMode === "resume"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "text-zinc-700 hover:text-zinc-950"
                )}
              >
                <span>📄 Traditional PDF Resume</span>
                {compareMode === "resume" && (
                  <span className="text-[10px] bg-rose-700 px-1.5 py-0.5 rounded font-bold">
                    Broken
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCompareMode("passport")}
                className={cn(
                  "px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2",
                  compareMode === "passport"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-700 hover:text-zinc-950"
                )}
              >
                <span>🛡️ Minskey Skill Passport</span>
                {compareMode === "passport" && (
                  <span className="text-[10px] bg-blue-800 px-1.5 py-0.5 rounded font-bold">
                    Verified
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Comparison Card Container */}
          <div className="w-full min-h-[380px] relative">
            <AnimatePresence mode="wait">
              {compareMode === "resume" ? (
                <motion.div
                  key="traditional-resume"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="w-full bg-[#FAF9F6] rounded-3xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_#18181B] p-6 sm:p-8 relative overflow-hidden"
                >
                  {/* Visual "CANNOT VERIFY" Stamp */}
                  <div className="absolute top-6 right-6 border-2 border-dashed border-rose-600 rounded-2xl px-4 py-2 bg-rose-50/90 text-rose-700 rotate-[6deg] select-none pointer-events-none shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-widest block text-rose-600">
                      ❌ REJECTED BY SCREENER
                    </span>
                    <span className="text-sm font-black tracking-tight text-rose-800">
                      UNVERIFIED SELF-CLAIMS
                    </span>
                  </div>

                  <div className="max-w-xl space-y-4">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="font-serif text-2xl font-bold text-zinc-900">Student Resume.pdf</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">Applied to 140+ roles &bull; 0 recruiter responses</p>
                    </div>

                    <div>
                      <span className="text-xs font-black uppercase text-zinc-400 tracking-wider block mb-1">
                        Self-Reported Skills Section:
                      </span>
                      <p className="text-sm text-zinc-700 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-zinc-200">
                        &quot;Experienced full-stack engineer proficient in Python, React, Next.js, AI, Machine Learning, PyTorch, Docker, Kubernetes, AWS, GraphQL, and Distributed Microservices.&quot;
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                        <span className="font-bold text-rose-950 block">The Recruiter Reality:</span>
                        <span className="text-rose-700">6-second glance. Keyword-stuffed text that could easily be copy-pasted or written by an AI bot.</span>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                        <span className="font-bold text-rose-950 block">The Outcome:</span>
                        <span className="text-rose-700">Filtered into the ATS black hole without a human ever opening their GitHub repositories.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="minskey-passport"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="w-full bg-white rounded-3xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_#18181B] p-6 sm:p-8 relative overflow-hidden"
                >
                {/* Visual "VERIFIED PROOF" Badge */}
                <div className="absolute top-6 right-6 border-2 border-dashed border-emerald-600 rounded-2xl px-4 py-2 bg-emerald-50 text-emerald-800 rotate-[-4deg] select-none pointer-events-none shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-widest block text-emerald-600">
                    ✅ 100% DETERMINISTIC
                  </span>
                  <span className="text-sm font-black tracking-tight text-emerald-950">
                    CRYPTOGRAPHIC AUDIT
                  </span>
                </div>

                <div className="max-w-xl space-y-4">
                  <div className="border-b border-zinc-200 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-zinc-950">Minskey Skill Identity</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300">
                        Live Verified
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-bold mt-0.5">Scanned from 14 verified repos &bull; SHA-256 signed commits</p>
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase text-zinc-400 tracking-wider block mb-2">
                      Deterministic Competency Evidence:
                    </span>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-zinc-50 border-2 border-zinc-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-mono text-[11px] font-black flex items-center justify-center">TS</span>
                          <span className="font-bold text-xs text-zinc-950">TypeScript Architecture</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          98% High (8 Repos &bull; 14 PRs)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 border-2 border-zinc-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-mono text-[11px] font-black flex items-center justify-center">PY</span>
                          <span className="font-bold text-xs text-zinc-950">Python &amp; Vector Pipelines</span>
                        </div>
                        <span className="text-[11px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                          94% High (0 CVEs &bull; Tested)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-950 block">The Recruiter Reality:</span>
                      <span className="text-emerald-800">Recruiters see raw commit proof, code complexity benchmarks, and accredited certification timestamps in 1 click.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-950 block">The Outcome:</span>
                      <span className="text-emerald-800">Zero ATS guessing. Direct interview fast-track and automatic hackathon squad team compatibility match.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* ── Transition Doodle to Section 3 (Journey Map) ── */}
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-doodle text-2xl sm:text-3xl font-bold text-blue-600 rotate-[-1deg]">
              There&apos;s a vastly better way to prove your skill
            </span>
          </div>

          <svg
            viewBox="0 0 48 64"
            fill="none"
            className="w-8 h-12 text-blue-600 animate-bounce mt-1"
          >
            <path
              d="M24 4C24 20 24 38 24 52M24 52L14 42M24 52L34 42"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="font-doodle text-lg text-zinc-500 font-semibold mt-1">
            Turn your real code into an evidence-backed passport in 6 steps ↓
          </span>
        </div>
      </div>
    </section>
  );
}
