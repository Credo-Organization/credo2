"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  ChevronDown,
  User,
  ArrowUpRight,
  Lock,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { StudentPassportIdCard } from "@/components/passport/student-id-card";
import Link from "next/link";

interface PassportSkill {
  id: string;
  name: string;
  level: number;
  evidence: string;
  status: "verified" | "learning" | "gap";
  tag: string;
  fillColor: string;
  accentColor: string;
  repo: string;
  prCount: number;
  commitHash: string;
  testCoverage: string;
}

const PASSPORT_SKILLS: PassportSkill[] = [
  {
    id: "ts",
    name: "TypeScript & Distributed Systems",
    level: 94,
    evidence: "8 Repos · 14 Merged PRs",
    status: "verified",
    tag: "High Confidence",
    fillColor: "bg-blue-600",
    accentColor: "border-blue-600 text-blue-900 bg-blue-50",
    repo: "minskey/distributed-consensus",
    prCount: 14,
    commitHash: "0x8f2a9d4e",
    testCoverage: "98.4%",
  },
  {
    id: "py",
    name: "Python & Model Orchestration",
    level: 91,
    evidence: "6 Repos · Real-time Inference",
    status: "verified",
    tag: "Production Ready",
    fillColor: "bg-emerald-600",
    accentColor: "border-emerald-600 text-emerald-900 bg-emerald-50",
    repo: "developer/vector-embeddings-engine",
    prCount: 9,
    commitHash: "0x71bc29a0",
    testCoverage: "96.1%",
  },
  {
    id: "nx",
    name: "React & Next.js Full-Stack",
    level: 88,
    evidence: "12 Repos · Server Actions & SSR",
    status: "verified",
    tag: "High Velocity",
    fillColor: "bg-sky-600",
    accentColor: "border-sky-600 text-sky-900 bg-sky-50",
    repo: "minskey/web-platform-core",
    prCount: 22,
    commitHash: "0x43ef81b2",
    testCoverage: "94.8%",
  },
  {
    id: "db",
    name: "PostgreSQL & Database Sharding",
    level: 82,
    evidence: "5 Schemas · Partitioning & Indexes",
    status: "verified",
    tag: "Schema Verified",
    fillColor: "bg-purple-600",
    accentColor: "border-purple-600 text-purple-900 bg-purple-50",
    repo: "developer/distributed-ledger-db",
    prCount: 7,
    commitHash: "0x99a15c3d",
    testCoverage: "92.0%",
  },
];

export function DoodlePassportPreview() {
  const [copied, setCopied] = useState(false);
  const [avatarGender, setAvatarGender] = useState<"male" | "female">("male");
  const [expandedSkill, setExpandedSkill] = useState<string | null>("ts");

  const studentData = {
    cardId: avatarGender === "male" ? "CDY2026-0004611" : "CDY2026-0009823",
    studentId: avatarGender === "male" ? "CDY26S4611" : "CDY26S9823",
    name: avatarGender === "male" ? "Subham Sarangi" : "Aanya Sharma",
    gender: avatarGender === "male" ? "Male" : "Female",
    degree: "Bachelor of Technology – Computer Science",
    college: "National Institute of Technology",
    avatarUrl: avatarGender === "male" ? "/avatar-male.webp" : "/avatar-female.webp",
    issueDate: "01 SEP 2026",
    expiryDate: "01 SEP 2028",
    coursesCompleted: 14,
    skillsVerified: 6,
    certificatesEarned: 1,
    verificationUrl: "https://minskey.dev/verify/passport/demo",
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/verify/passport/demo`);
      setCopied(true);
      toast.success("Verifiable Passport URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section id="preview" className="py-20 sm:py-28 relative bg-[#FAF9F6] border-b border-zinc-200/80 overflow-hidden select-none">
      {/* Background Dot Matrix */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-blue-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-bold text-xs uppercase tracking-wider text-blue-950">
              Deterministic Proof. Zero Fluff.
            </span>
          </div>

          <span className="font-doodle text-3xl sm:text-4xl text-blue-600 font-bold block mb-1">
            What recruiters see when you share your link 📄
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            The authentic{" "}
            <span className="relative inline-block text-blue-600">
              Skill Passport.
              <svg viewBox="0 0 160 14" fill="none" className="w-full h-3 text-blue-500 pointer-events-none absolute -bottom-1 left-0">
                <path d="M3 8C35 3 75 12 115 6C135 3 145 9 157 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-4 text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Every competency is tied directly to GitHub pull requests, commit timestamps, and accredited certifications with cryptographic verification.
          </p>
        </div>

        {/* ── SIDE-BY-SIDE VERTICAL ID CARD + INTERACTIVE SKILL LEDGER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: Authentic Vertical Official ID Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Top Washi Tape Sticker */}
            <div className="relative w-full max-w-[420px] flex justify-center mb-[-12px] z-30 pointer-events-none">
              <div className="w-32 h-6 rounded-xs bg-amber-300/80 border-dashed border-t border-b border-zinc-400/60 shadow-xs -rotate-2" />
            </div>

            {/* Rendered Vertical ID Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <StudentPassportIdCard studentData={studentData} className="w-full max-w-[420px]" />
            </motion.div>

            {/* Gender Toggle Pill Under Card */}
            <div className="mt-4 flex items-center gap-2 p-1.5 rounded-2xl bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B]">
              <span className="text-[11px] font-bold text-zinc-500 pl-2">Toggle Preview:</span>
              <button
                type="button"
                onClick={() => setAvatarGender("male")}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  avatarGender === "male"
                    ? "bg-blue-100 text-blue-950 border border-blue-300 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Subham (Male)
              </button>
              <button
                type="button"
                onClick={() => setAvatarGender("female")}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  avatarGender === "female"
                    ? "bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Aanya (Female)
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Verified Competency Ledger & Proof Inspector */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Main Ledger Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border-2 border-zinc-900 bg-white shadow-[6px_6px_0px_0px_#18181B] p-6 sm:p-7 relative overflow-hidden"
            >
              {/* Ledger Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest text-blue-700 uppercase block">
                      Audited Proof Ledger
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-300">
                      LIVE SNAPSHOT
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-950 tracking-tight mt-0.5">
                    Verified Competencies
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 border-zinc-900 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer self-start sm:self-center"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Link!" : "Copy Passport URL"}</span>
                </button>
              </div>

              {/* Skills Interactive List */}
              <div className="space-y-3">
                {PASSPORT_SKILLS.map((skill, index) => {
                  const isExpanded = expandedSkill === skill.id;
                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        "rounded-2xl border-2 border-zinc-900 bg-[#FAF9F6] transition-all overflow-hidden",
                        isExpanded ? "shadow-[3px_3px_0px_0px_#18181B]" : "shadow-xs"
                      )}
                    >
                      {/* Skill Summary Row */}
                      <button
                        type="button"
                        onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                        className="w-full p-3.5 sm:p-4 flex flex-col gap-2 text-left cursor-pointer hover:bg-stone-50/80 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-xs font-black text-zinc-400 shrink-0">
                              #{index + 1}
                            </span>
                            <span className="font-black text-xs sm:text-sm text-zinc-950 truncate">
                              {skill.name}
                            </span>
                            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0", skill.accentColor)}>
                              {skill.tag}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-[11px] font-bold text-zinc-600">
                              {skill.evidence}
                            </span>
                            <span className="font-doodle font-bold text-base text-blue-600">
                              {skill.level}%
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform duration-200", isExpanded && "rotate-180")} />
                          </div>
                        </div>

                        {/* Progress Meter */}
                        <div className="relative h-2 rounded-full border border-zinc-900 bg-zinc-100 overflow-hidden">
                          <div
                            className={cn("h-full transition-all duration-700", skill.fillColor)}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </button>

                      {/* Expandable Repository & Proof Inspection Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t-2 border-dashed border-zinc-300 bg-white p-3.5 sm:p-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                                <span className="text-[9px] uppercase font-black text-zinc-400 block mb-0.5">
                                  Primary Repository
                                </span>
                                <span className="font-mono font-bold text-zinc-900 text-[11px] block truncate">
                                  {skill.repo}
                                </span>
                              </div>

                              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                                <span className="text-[9px] uppercase font-black text-zinc-400 block mb-0.5">
                                  Automated Tests
                                </span>
                                <span className="font-bold text-emerald-700 text-[11px]">
                                  {skill.testCoverage} Passing
                                </span>
                              </div>

                              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                                <span className="text-[9px] uppercase font-black text-zinc-400 block mb-0.5">
                                  Signed Commit
                                </span>
                                <span className="font-mono text-zinc-600 text-[11px]">
                                  {skill.commitHash} &bull; GPG
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recruiter Trust Seal & Direct Verification Action */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-5 rounded-3xl border-2 border-zinc-900 bg-[#FAF9F6] shadow-[3px_3px_0px_0px_#18181B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border-2 border-zinc-900 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Cryptographically Verifiable
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">
                    Tamper-proof SHA-256 passport snapshot signed by Minskey Protocol.
                  </p>
                </div>
              </div>

              <Link href="/verify/passport/demo" className="shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto h-9 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Verify Live Passport</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
