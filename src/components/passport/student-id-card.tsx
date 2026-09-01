"use client";

import React, { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { User, GraduationCap, BookOpen, Award, FileBadge } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Deterministic Barcode SVG Generator ---
function BarcodeSVG({ value, height = 40, className }: { value: string; height?: number; className?: string }) {
  const bars = useMemo(() => {
    // Standard pseudo-Code128 deterministic pattern based on char codes
    const result: number[] = [2, 1, 2, 1]; // Start guard
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      const b1 = (code % 3) + 1;
      const b2 = ((code >> 2) % 3) + 1;
      const b3 = ((code >> 4) % 3) + 1;
      const b4 = ((code >> 6) % 2) + 1;
      result.push(b1, b2, b3, b4);
    }
    result.push(2, 3, 1, 2); // Stop guard
    return result;
  }, [value]);

  return (
    <svg viewBox={`0 0 ${bars.length * 3} ${height}`} className={cn("w-full max-w-[180px] h-9", className)}>
      {bars.map((width, idx) => {
        const isBlack = idx % 2 === 0;
        const x = bars.slice(0, idx).reduce((acc, curr) => acc + curr * 1.5, 0);
        return isBlack ? (
          <rect key={idx} x={x} y="0" width={width * 1.5} height={height} fill="#18181B" />
        ) : null;
      })}
    </svg>
  );
}

// --- Credify Holographic Circular Verification Seal ---
function CredifyVerificationSeal() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center select-none">
      {/* Outer Rotated Badge SVG with Text on Path */}
      <svg viewBox="0 0 120 120" className="w-full h-full text-zinc-900 dark:text-zinc-100">
        <defs>
          <path
            id="sealCircleTop"
            d="M 60,60 m -45,0 a 45,45 0 1,1 90,0"
            fill="none"
          />
          <path
            id="sealCircleBottom"
            d="M 60,60 m 45,0 a 45,45 0 1,1 -90,0"
            fill="none"
          />
        </defs>

        {/* Concentric Decorative Rings */}
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        {/* Text Along Path */}
        <text fontSize="7.5" fontWeight="bold" letterSpacing="2.5" fill="currentColor">
          <textPath href="#sealCircleTop" startOffset="50%" textAnchor="middle">
            ★ MINSKEY VERIFIED ★
          </textPath>
        </text>

        <text fontSize="6" fontWeight="bold" letterSpacing="1.8" fill="currentColor">
          <textPath href="#sealCircleBottom" startOffset="50%" textAnchor="middle">
            ACHIEVEMENTS · TRUST · IMPACT
          </textPath>
        </text>

        {/* Inner Double-C Monogram Emblem */}
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
    <svg viewBox="0 0 40 24" className="w-8 h-5 text-zinc-900 dark:text-zinc-100">
      <rect x="2" y="2" width="36" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" />
      <line x1="26" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="12" r="5" fill="currentColor" />
      <circle cx="20" cy="12" r="2" fill="#fff" />
    </svg>
  );
}

export interface StudentPassportProps {
  studentData?: {
    cardId?: string;
    studentId?: string;
    name?: string;
    gender?: string;
    degree?: string;
    college?: string;
    avatarUrl?: string;
    issueDate?: string;
    expiryDate?: string;
    coursesCompleted?: number;
    skillsVerified?: number;
    certificatesEarned?: number;
    verificationUrl?: string;
  };
  className?: string;
}

export function StudentPassportIdCard({ studentData, className }: StudentPassportProps) {
  const cardId = studentData?.cardId || "CDY2026-0004611";
  const studentId = studentData?.studentId || "CDY26S4611";
  const name = studentData?.name || "Subham Sarangi";
  const gender = studentData?.gender || "male";
  const degree = studentData?.degree || "Bachelor of Technology";
  const issueDate = studentData?.issueDate || "01 SEP 2026";
  const expiryDate = studentData?.expiryDate || "01 SEP 2028";
  const coursesCompleted = studentData?.coursesCompleted ?? 14;
  const skillsVerified = studentData?.skillsVerified ?? 6;
  const certificatesEarned = studentData?.certificatesEarned ?? 1;

  const verificationUrl =
    studentData?.verificationUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/verify/passport/${studentId}`
      : `https://minskey.dev/verify/passport/${studentId}`);

  // Default Illustrated Doodle Avatar if none provided
  const fallbackFemale = "/avatar-female.webp";
  const fallbackMale = "/avatar-male.webp";
  
  const rawAvatar = studentData?.avatarUrl?.trim();
  const isUnsplashOrEmpty = !rawAvatar || rawAvatar.includes("unsplash.com");
  const avatarUrl =
    !isUnsplashOrEmpty
      ? rawAvatar
      : (gender.toLowerCase() === "female" ? fallbackFemale : fallbackMale);

  return (
    <div
      className={cn(
        "w-full max-w-[440px] bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 rounded-3xl p-6 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_#18181B] relative font-sans select-none overflow-hidden transition-all",
        className
      )}
    >
      {/* Background Watermark Security Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#18181B 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top Header: ID & Circuit Icon */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-900 dark:border-zinc-700 relative z-10">
        <span className="text-xs font-black tracking-wider text-zinc-950 dark:text-zinc-100 uppercase font-mono">
          ID: {cardId}
        </span>
        <CircuitBadgeIcon />
      </div>

      {/* Holder Info */}
      <div className="pt-3 pb-2 relative z-10">
        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block mb-0.5 font-mono">
          HOLDER
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight">
          {name}
        </h1>

        <div className="flex flex-col gap-0.5 mt-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span className="capitalize">{gender}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span className="truncate">{degree}</span>
          </div>
        </div>
      </div>

      {/* Photo & Seal Row */}
      <div className="grid grid-cols-2 gap-4 items-center my-3 relative z-10">
        {/* Student Portrait */}
        <div className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-[#FEF08A] overflow-hidden shadow-[2px_2px_0px_0px_#18181B] flex items-center justify-center p-1">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover object-top rounded-xl"
          />
        </div>

        {/* Verification Seal */}
        <div className="flex items-center justify-center">
          <CredifyVerificationSeal />
        </div>
      </div>

      {/* Student ID, Barcode & Issue Dates */}
      <div className="grid grid-cols-2 gap-3 items-start pt-2 pb-2 relative z-10">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block font-mono">
            STUDENT ID
          </span>
          <span className="text-xs font-black tracking-wider text-zinc-950 dark:text-zinc-100 block mb-1 font-mono">
            {studentId}
          </span>
          <BarcodeSVG value={studentId} />
        </div>

        <div className="flex flex-col gap-1.5 pl-2">
          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block font-mono">
              DATE OF ISSUE
            </span>
            <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100 tracking-wide font-mono">
              {issueDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block font-mono">
              VALID UNTIL
            </span>
            <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100 tracking-wide font-mono">
              {expiryDate}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-0.5 w-full bg-zinc-900 dark:bg-zinc-700 my-2" />

      {/* Statistics Row: Courses / Skills / Certs */}
      <div className="grid grid-cols-3 divide-x-2 divide-zinc-900 dark:divide-zinc-700 text-center py-1.5 relative z-10">
        <div className="px-1 flex flex-col items-center">
          <BookOpen className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 mb-0.5" />
          <span className="text-[8px] font-black tracking-wider text-zinc-500 uppercase leading-tight font-mono">
            COURSES COMPLETED
          </span>
          <span className="text-sm font-black text-zinc-950 dark:text-white mt-0.5 font-mono">
            {coursesCompleted.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="px-1 flex flex-col items-center">
          <Award className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 mb-0.5" />
          <span className="text-[8px] font-black tracking-wider text-zinc-500 uppercase leading-tight font-mono">
            SKILLS VERIFIED
          </span>
          <span className="text-sm font-black text-zinc-950 dark:text-white mt-0.5 font-mono">
            {skillsVerified.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="px-1 flex flex-col items-center">
          <FileBadge className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 mb-0.5" />
          <span className="text-[8px] font-black tracking-wider text-zinc-500 uppercase leading-tight font-mono">
            CERTIFICATES EARNED
          </span>
          <span className="text-sm font-black text-zinc-950 dark:text-white mt-0.5 font-mono">
            {certificatesEarned.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
