"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn blue underline swash specifically for the word "Skill"
 */
export function SkillUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-2.5 sm:h-3 text-blue-600", className)}
    >
      <path
        d="M2 6C35 3 85 9 138 5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Three hand-drawn blue accent rays above/left of "Skill" (\ | /)
 */
export function BlueSkillRays({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6 sm:w-7 sm:h-7 text-blue-500", className)}
    >
      <line x1="8" y1="24" x2="2" y2="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="24" y1="24" x2="30" y2="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Three hand-drawn black burst rays above Card 1 (\ | /)
 */
export function CardBurstRays({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-5 text-zinc-900", className)}
    >
      <line x1="8" y1="20" x2="3" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="18" x2="16" y2="4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="24" y1="20" x2="29" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Hand-drawn paper airplane with dashed looping flight trail
 */
export function PaperAirplane({ className }: { className?: string }) {
  return (
    <div className={cn("relative inline-block pointer-events-none select-none", className)}>
      {/* Sketched Airplane Body */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-zinc-900 relative z-10"
      >
        {/* Main wing */}
        <polygon
          points="6,48 58,10 38,56"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Center fold line */}
        <path
          d="M6 48L38 34L58 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Under flap */}
        <polygon
          points="24,42 38,56 38,34"
          fill="#f4f4f5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn minimalist cloud with spark rays
 */
export function DoodleCloud({ className }: { className?: string }) {
  return (
    <div className={cn("relative inline-block pointer-events-none select-none", className)}>
      <svg
        viewBox="0 0 96 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 sm:w-20 h-10 sm:h-12 text-zinc-900"
      >
        {/* Sketched Cloud Outline */}
        <path
          d="M24 46H74C82 46 88 40 88 32C88 25 82 20 75 20C74 12 66 6 56 6C48 6 41 11 38 17C35 15 31 14 27 15C18 17 12 24 13 32C8 34 6 40 10 44C13 46 18 46 24 46Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Curly blue arrow pointing from below CTA to "Start your skill journey"
 */
export function CurlyPointerArrow({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center gap-3 select-none pointer-events-none", className)}>
      {/* Hand-drawn Curving Arrow */}
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 sm:w-11 sm:h-11 text-blue-600 shrink-0"
      >
        <path
          d="M6 10C8 30 18 48 38 48C46 48 50 42 50 36"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M42 38L50 34L54 42"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Handwritten Text with Left & Right accent rays */}
      <div className="relative flex items-center gap-2">
        {/* Left rays */}
        <div className="flex flex-col gap-1 text-blue-400">
          <div className="w-2.5 h-0.5 bg-blue-400 rounded-full -rotate-45" />
          <div className="w-3 h-0.5 bg-blue-400 rounded-full" />
        </div>

        <span className="font-doodle text-xl sm:text-2xl font-bold tracking-wide text-zinc-900 leading-tight">
          Start your
          <br />
          skill journey
        </span>

        {/* Right rays */}
        <div className="flex flex-col gap-1 text-blue-400">
          <div className="w-2.5 h-0.5 bg-blue-400 rounded-full 45" />
          <div className="w-3 h-0.5 bg-blue-400 rounded-full" />
          <div className="w-2.5 h-0.5 bg-blue-400 rounded-full -rotate-45" />
        </div>
      </div>
    </div>
  );
}

/**
 * Sketched student avatar circle with soft yellow backdrop matching the mockup
 */
export function DoodleAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FEF08A] border-2 border-zinc-900 flex items-center justify-center select-none shadow-xs", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-13 h-13 sm:w-16 sm:h-16 text-zinc-900 mt-1"
      >
        {/* Hair back */}
        <path
          d="M16 28C14 36 14 44 18 48C20 42 22 36 22 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M48 28C50 36 50 44 46 48C44 42 42 36 42 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Head */}
        <path
          d="M24 24C24 16 27 12 32 12C37 12 40 16 40 24C40 32 37 36 32 36C27 36 24 32 24 24Z"
          fill="#FEF08A"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Hair front bangs */}
        <path
          d="M22 22C26 18 30 18 32 22C34 18 38 18 42 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Eyes & smile */}
        <circle cx="28" cy="24" r="1.5" fill="currentColor" />
        <circle cx="36" cy="24" r="1.5" fill="currentColor" />
        <path d="M30 28C31 30 33 30 34 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        {/* Shoulders & Shirt */}
        <path
          d="M20 54C22 46 26 44 32 44C38 44 42 46 44 54"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M28 44L32 48L36 44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn laptop wireframe with user circle, text lines, 3-bar chart, and spiral scribble
 */
export function DoodleLaptop({ className, svgClassName }: { className?: string; svgClassName?: string }) {
  return (
    <div className={cn("relative select-none", className)}>
      <svg
        viewBox="0 0 180 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-52 sm:w-60 md:w-68 h-auto text-zinc-900", svgClassName)}
      >
        {/* Laptop Screen Bezel */}
        <rect
          x="20"
          y="12"
          width="130"
          height="80"
          rx="6"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        {/* Screen inner area */}
        <rect x="25" y="17" width="120" height="70" rx="3" fill="#ffffff" />

        {/* User profile avatar on screen */}
        <circle cx="44" cy="35" r="9" stroke="currentColor" strokeWidth="1.8" fill="#f8fafc" />
        <path d="M38 42C39 39 42 38 44 38C46 38 49 39 50 42" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="44" cy="33" r="3" stroke="currentColor" strokeWidth="1.5" />

        {/* Text code placeholder lines */}
        <line x1="60" y1="30" x2="95" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="36" x2="85" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="52" x2="88" y2="52" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="58" x2="75" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

        {/* 3-Bar Chart matching mockup */}
        <rect x="100" y="46" width="6" height="22" rx="1.5" fill="#34d399" stroke="currentColor" strokeWidth="1.4" />
        <rect x="110" y="38" width="6" height="30" rx="1.5" fill="#38bdf8" stroke="currentColor" strokeWidth="1.4" />
        <rect x="120" y="26" width="6" height="42" rx="1.5" fill="#2563eb" stroke="currentColor" strokeWidth="1.4" />

        {/* Laptop Base & Keyboard Plate */}
        <path
          d="M10 94L160 94L172 102C173 103 172 105 170 105H0C-2 105 -3 103 -2 102L10 94Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* Trackpad notch */}
        <path d="M75 95H95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Hand-drawn loopy spring scribble underneath laptop (ee...) */}
      <svg
        viewBox="0 0 90 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -bottom-2 right-4 sm:right-6 w-20 sm:w-24 h-6 text-zinc-900"
      >
        <path
          d="M4 16C12 2 20 2 24 16C28 2 36 2 40 16C44 2 52 2 56 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="68" cy="18" r="1.5" fill="currentColor" />
        <circle cx="76" cy="18" r="1.5" fill="currentColor" />
        <circle cx="84" cy="18" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Bottom trust banner: Heart + "All your skills. Verified. Organized. Ready to share."
 * with blue sketch underline ONLY under "Verified."
 */
export function BottomTrustBadge({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none text-zinc-900 text-xs sm:text-sm font-medium", className)}>
      {/* Hand-drawn blue outline heart */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-blue-600 shrink-0"
      >
        <path
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Sentence with sketch underline only under "Verified." */}
      <div className="flex items-center gap-1">
        <span>All your skills.</span>
        <span className="relative font-bold text-zinc-950 inline-block px-0.5">
          Verified.
          <svg
            viewBox="0 0 60 6"
            fill="none"
            className="absolute -bottom-1 left-0 w-full h-1 text-blue-600"
          >
            <path
              d="M2 3C20 1 45 5 58 3"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>Organized. Ready to share.</span>
      </div>
    </div>
  );
}
