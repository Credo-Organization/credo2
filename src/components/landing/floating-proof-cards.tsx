"use client";

import React from "react";
import { motion } from "motion/react";
import { Award, Trophy } from "lucide-react";
import { DoodleAvatar, DoodleLaptop } from "./doodle-elements";

export function FloatingProofCards() {
  return (
    <div className="relative w-full max-w-[600px] h-[520px] sm:h-[550px] mx-auto select-none">
      {/* ── CARD 1: GitHub Activity (Aligned right under the background burst rays) ── */}
      <div className="absolute top-4 sm:top-6 right-2 sm:right-6 z-20 w-[270px] sm:w-[305px]">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          className="relative bg-white rounded-2xl border-2 border-zinc-900 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Green Checkmark Badge on Top-Right */}
          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#34D399] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-zinc-950">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Mint Green GitHub Badge */}
            <div className="w-12 h-12 rounded-full bg-[#A7F3D0] flex items-center justify-center shrink-0 border border-emerald-300">
              <svg className="w-7 h-7 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-zinc-950 tracking-tight">GitHub Activity</span>
              <span className="text-xs text-zinc-500 font-medium leading-tight mt-0.5">
                Real contributions.
                <br />
                Real impact.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Student Avatar (Nestled right over the background yellow circle) ── */}
      <div className="absolute top-[182px] sm:top-[190px] left-6 sm:left-10 z-20">
        <DoodleAvatar className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] bg-transparent border-2 border-zinc-900 shadow-none" />
      </div>

      {/* ── CARD 2: Certifications (Aligned at the end of the dashed arrow) ── */}
      <div className="absolute top-[175px] sm:top-[180px] right-0 sm:right-2 z-20 w-[270px] sm:w-[305px]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          className="relative bg-white rounded-2xl border-2 border-zinc-900 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Green Checkmark Badge */}
          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#34D399] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-zinc-950">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Soft Blue Medal Badge */}
            <div className="w-12 h-12 rounded-full bg-[#BAE6FD] flex items-center justify-center shrink-0 border border-sky-300">
              <Award className="w-7 h-7 text-blue-600 stroke-[2.2]" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-zinc-950 tracking-tight">Certifications</span>
              <span className="text-xs text-zinc-500 font-medium leading-tight mt-0.5">
                Verified knowledge.
                <br />
                Proven skills.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Doodle Laptop Wireframe (Aligned right on top of background coil scribble) ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 sm:left-4 z-10">
        <DoodleLaptop svgClassName="w-52 sm:w-60" />
      </div>

      {/* ── CARD 3: Achievements (Aligned directly over the purple watercolor blob) ── */}
      <div className="absolute bottom-10 sm:bottom-12 right-2 sm:right-4 z-20 w-[270px] sm:w-[305px]">
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          className="relative bg-white rounded-2xl border-2 border-zinc-900 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Green Checkmark Badge */}
          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#34D399] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-zinc-950">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Soft Lavender Trophy Badge */}
            <div className="w-12 h-12 rounded-full bg-[#DDD6FE] flex items-center justify-center shrink-0 border border-purple-300">
              <Trophy className="w-7 h-7 text-purple-600 stroke-[2.2]" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-zinc-950 tracking-tight">Achievements</span>
              <span className="text-xs text-zinc-500 font-medium leading-tight mt-0.5">
                Milestones that
                <br />
                set you apart.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
