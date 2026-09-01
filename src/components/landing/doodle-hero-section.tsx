"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Award, 
  Trophy, 
  CheckCircle2,
  Heart,
} from "lucide-react";
import { LoginModal } from "@/components/ui/login-modal";
import {
  BlueSkillRays,
  SkillUnderline,
  CurlyPointerArrow,
  PaperAirplane,
  DoodleCloud,
  DoodleLaptop,
  CardBurstRays,
} from "./doodle-elements";

export function DoodleHeroSection() {
  const [avatarGender, setAvatarGender] = useState<"male" | "female">("female");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-[#FAF9F6] pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden border-b border-zinc-200/60 select-none">
      
      {/* Background Architectural Dot Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#71717A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: HERO HEADLINE & VALUE PROP
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">

            {/* Handwritten "The Future of" */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative mb-1"
            >
              <span className="font-doodle text-4xl sm:text-5xl lg:text-6xl text-zinc-900 font-bold tracking-normal block leading-tight">
                The Future of
              </span>
            </motion.div>

            {/* "Skill Identity." with blue underline & radiant rays */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-5"
            >
              <div className="absolute -top-5 -left-7 pointer-events-none">
                <BlueSkillRays />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-zinc-950">
                <span className="relative inline-block text-blue-600 mr-3">
                  Skill
                  <SkillUnderline className="absolute -bottom-1 left-0 w-full" />
                </span>
                Identity.
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed mb-7 font-normal"
            >
              Turn GitHub activity, certifications, and achievements into an evidence-backed skill passport and find the right teammates.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3.5 mb-6"
            >
              <LoginModal>
                <button
                  type="button"
                  className="h-12 px-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center gap-2 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#18181B] transition-all cursor-pointer"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </LoginModal>

              <LoginModal>
                <button
                  type="button"
                  className="h-12 px-7 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-zinc-900 text-zinc-950 font-black text-sm shadow-[3px_3px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#18181B] transition-all cursor-pointer"
                >
                  I&apos;m a recruiter
                </button>
              </LoginModal>
            </motion.div>

            {/* Curly Pointer Arrow */}
            <div className="ml-1">
              <CurlyPointerArrow />
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: ANIMATED DOODLE DEVELOPER STAGE
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
            
            {/* The Staged Canvas Container */}
            <div className="relative w-full max-w-[560px] h-[480px] sm:h-[500px] select-none">
              
              {/* ── PURE ORGANIC WATERCOLOR CLOUD WASHES (Zero Ghosting, 100% Crisp) ── */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Upper Sky Blue Watercolor Cloud Wash */}
                <div 
                  className="absolute top-0 right-2 w-[420px] sm:w-[480px] h-[320px] rounded-[55%_45%_65%_35%/45%_55%_35%_65%] bg-gradient-to-br from-[#BAE6FD]/90 via-[#93C5FD]/60 to-[#E0F2FE]/40 blur-2xl"
                />
                
                {/* Lower Lavender Purple Watercolor Cloud Wash */}
                <div 
                  className="absolute bottom-2 right-0 w-[340px] sm:w-[400px] h-[300px] rounded-[45%_55%_40%_60%/60%_40%_55%_45%] bg-gradient-to-tl from-[#DDD6FE]/90 via-[#C4B5FD]/70 to-[#EDE9FE]/50 blur-2xl"
                />

                {/* Center Soft Cyan/Amber Watercolor Blend */}
                <div 
                  className="absolute top-20 right-16 w-[280px] h-[260px] rounded-full bg-gradient-to-tr from-[#E0F2FE]/70 via-[#FEF3C7]/40 to-[#DDD6FE]/60 blur-3xl"
                />

                {/* Delicate Watercolor Stipple Speckles Texture */}
                <div 
                  className="absolute top-6 right-4 w-[400px] h-[420px] opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(#4F46E5 0.75px, transparent 0.75px), radial-gradient(#0284C7 0.75px, transparent 0.75px)",
                    backgroundSize: "16px 16px, 24px 24px",
                    backgroundPosition: "0 0, 8px 8px",
                  }}
                />
              </div>

              {/* Top-Left: Sketched Doodle Cloud */}
              <motion.div 
                animate={{ x: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-6 pointer-events-none z-10"
              >
                <DoodleCloud className="scale-90" />
              </motion.div>

              {/* Top-Right: Sketched Paper Airplane with Flight Trail */}
              <motion.div 
                animate={{ 
                  x: [0, 8, 0], 
                  y: [0, -7, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 right-4 pointer-events-none z-30"
              >
                <PaperAirplane />
              </motion.div>

              {/* ── Left Half: Student Avatar & Laptop ── */}
              <div className="absolute left-4 sm:left-7 top-[110px] z-20">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  {/* Avatar Yellow Circle */}
                  <button
                    type="button"
                    onClick={() => setAvatarGender(avatarGender === "male" ? "female" : "male")}
                    title="Click to toggle male/female student doodle"
                    className="relative group cursor-pointer"
                  >
                    <div className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-full bg-[#FEF08A] border-2 border-zinc-900 flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
                      <img
                        src={avatarGender === "male" ? "/avatar-male.webp" : "/avatar-female.webp"}
                        alt="Student Doodle Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                </motion.div>
              </div>

              {/* Hand-Drawn Laptop Wireframe with Live Display Chart */}
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 left-1 sm:left-3 z-10"
              >
                <DoodleLaptop svgClassName="w-56 sm:w-64" />
              </motion.div>

              {/* ── Dynamic Dashed Flow Connectors with Arrowheads ── */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 560 500"
                fill="none"
              >
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#18181B" />
                  </marker>
                </defs>

                {/* Curved arrow from left to Card 1 */}
                <path
                  d="M 120 135 C 155 105, 185 70, 235 60"
                  stroke="#18181B"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                  className={hoveredCard === 1 ? "stroke-emerald-600 opacity-100" : "opacity-60"}
                />

                {/* Dashed connector from Avatar to Card 2 */}
                <path
                  d="M 130 165 C 165 180, 195 200, 240 215"
                  stroke="#18181B"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  className={hoveredCard === 2 ? "stroke-blue-600 opacity-100" : "opacity-60"}
                />

                {/* Dashed connector from Card 1 to Airplane */}
                <path
                  d="M 460 70 C 500 50, 520 30, 525 20"
                  stroke="#18181B"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  className="opacity-50"
                />

                {/* Dashed connector from Laptop to Card 3 */}
                <path
                  d="M 120 380 C 160 380, 190 375, 240 370"
                  stroke="#18181B"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  className={hoveredCard === 3 ? "stroke-purple-600 opacity-100" : "opacity-60"}
                />
              </svg>

              {/* ── CARD 1: GitHub Activity (Top Right) ── */}
              <div className="absolute top-[28px] right-2 sm:right-5 z-20 w-[270px] sm:w-[295px]">
                {/* 3 Accent Burst Rays Above Card 1 */}
                <div className="absolute -top-5 right-12 pointer-events-none">
                  <CardBurstRays />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4 }
                  }}
                  whileHover={{ scale: 1.03, x: -3 }}
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative bg-white rounded-2xl border-2 border-zinc-900 p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] transition-all cursor-pointer"
                >
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#34D399] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#A7F3D0] flex items-center justify-center shrink-0 border border-emerald-300">
                      <svg className="w-7 h-7 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-black text-sm sm:text-base text-zinc-950 tracking-tight">
                        GitHub Activity
                      </span>
                      <span className="text-xs text-zinc-500 font-bold leading-tight mt-0.5">
                        Real contributions.
                        <br />
                        Real impact.
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── CARD 2: Certifications (Middle Right) ── */}
              <div className="absolute top-[180px] right-1 sm:right-3 z-20 w-[270px] sm:w-[295px]">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, 5, 0],
                  }}
                  transition={{ 
                    y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4, delay: 0.1 }
                  }}
                  whileHover={{ scale: 1.03, x: -3 }}
                  onMouseEnter={() => setHoveredCard(2)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative bg-white rounded-2xl border-2 border-zinc-900 p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] transition-all cursor-pointer"
                >
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#34D399] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#BAE6FD] flex items-center justify-center shrink-0 border border-sky-300">
                      <Award className="w-7 h-7 text-blue-600 stroke-[2.4]" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-black text-sm sm:text-base text-zinc-950 tracking-tight">
                        Certifications
                      </span>
                      <span className="text-xs text-zinc-500 font-bold leading-tight mt-0.5">
                        Verified knowledge.
                        <br />
                        Proven skills.
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── CARD 3: Achievements (Bottom Right) ── */}
              <div className="absolute bottom-[24px] right-2 sm:right-5 z-20 w-[270px] sm:w-[295px]">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -4, 0],
                  }}
                  transition={{ 
                    y: { duration: 5.0, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4, delay: 0.2 }
                  }}
                  whileHover={{ scale: 1.03, x: -3 }}
                  onMouseEnter={() => setHoveredCard(3)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative bg-white rounded-2xl border-2 border-zinc-900 p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] hover:shadow-[5px_5px_0px_0px_#18181B] transition-all cursor-pointer"
                >
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#34D399] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#DDD6FE] flex items-center justify-center shrink-0 border border-purple-300">
                      <Trophy className="w-7 h-7 text-purple-600 stroke-[2.4]" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-black text-sm sm:text-base text-zinc-950 tracking-tight">
                        Achievements
                      </span>
                      <span className="text-xs text-zinc-500 font-bold leading-tight mt-0.5">
                        Milestones that
                        <br />
                        set you apart.
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>

          </div>

        </div>

        {/* ── BOTTOM TAGLINE (Matching exact reference image) ── */}
        <div className="w-full flex justify-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-zinc-900 select-none">
            <Heart className="w-4 h-4 text-blue-600 fill-none stroke-[2.5]" />
            <span className="relative font-extrabold text-zinc-950">
              All your skills.
              <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-blue-500 rounded-full" />
            </span>
            <span className="text-zinc-700">Verified. Organized. Ready to share.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
