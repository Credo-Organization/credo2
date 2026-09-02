"use client";

import React from "react";
import { ArrowUpRight, Sparkles, Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SkillGapItem {
  name: string;
  category: "critical" | "recommended";
  rationale?: string;
}

interface SkillGapMatrixProps {
  careerGoal?: string;
  verifiedSkills?: { name: string; confidence: "High" | "Medium" | "Low" }[];
  missingSkillsList?: SkillGapItem[];
  gapDescription?: string;
  onAskMentorForGap?: (skillName: string) => void;
}

export function SkillGapMatrix({
  careerGoal = "Software Engineer",
  verifiedSkills = [],
  missingSkillsList = [],
  gapDescription,
  onAskMentorForGap,
}: SkillGapMatrixProps) {
  const totalRelevantSkills = verifiedSkills.length + missingSkillsList.length;
  const readinessPercent = totalRelevantSkills > 0 
    ? Math.round((verifiedSkills.length / totalRelevantSkills) * 100)
    : verifiedSkills.length > 0 ? 100 : 0;

  const defaultDescription =
    gapDescription ||
    `Proficient in full-stack architecture with strong TypeScript foundation. Next milestone: Advanced Distributed Systems & Cloud Orchestration.`;

  return (
    <div className="w-full rounded-3xl bg-[#FAF9F6] dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] p-5 select-none overflow-hidden transition-colors">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-zinc-900 dark:border-zinc-700">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight truncate">
            Target Benchmark: <span>{careerGoal}</span>
          </h3>
        </div>

        {/* Tactile Pastel Stamp Badge */}
        <div className="shrink-0 self-start sm:self-center border-2 border-zinc-900 dark:border-zinc-700 bg-[#FEF08A] dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 px-3 py-1 rounded-2xl -rotate-1 shadow-[2px_2px_0px_0px_#18181B] flex items-center gap-1.5">
          <Target className="w-4 h-4 text-amber-900 dark:text-amber-300" />
          <span className="text-xs sm:text-sm font-black tracking-tight">
            {readinessPercent}% Role Readiness
          </span>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="my-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-800/90 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-950 dark:text-zinc-100 mb-2">
          <span className="font-black">Market Competency Delta</span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] dark:bg-sky-950/60 text-blue-950 dark:text-sky-300 border border-blue-300 dark:border-sky-800">
            ~2 milestones away from 95% match
          </span>
        </div>

        <div className="w-full h-3 rounded-full border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-[#A7F3D0] via-[#BAE6FD] to-[#DDD6FE] border border-zinc-900/30 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(readinessPercent, 20), 100)}%` }}
          />
        </div>
      </div>

      {/* 2-Column Grid: Verified vs. Lagging Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        
        {/* LEFT: Verified in Passport */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100 font-mono">
              VERIFIED IN PASSPORT ({verifiedSkills.length})
            </span>
            <span className="font-mono text-[9px] font-black px-2 py-0.5 rounded-md bg-[#A7F3D0] dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 border border-zinc-900 dark:border-zinc-700 shadow-2xs">
              PROVEN
            </span>
          </div>

          {verifiedSkills.length === 0 ? (
            <div className="p-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/40 text-center">
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                No verified skills detected yet
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1">
                Sync your GitHub account or upload accredited certificates to prove competencies
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {verifiedSkills.slice(0, 6).map((skill, idx) => (
                <div
                  key={idx}
                  className="p-2.5 px-3 rounded-xl bg-emerald-500/[0.06] hover:bg-emerald-500/[0.09] dark:bg-emerald-950/30 dark:hover:bg-emerald-950/45 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span className="text-xs font-black text-zinc-950 dark:text-zinc-100">
                      {skill.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {skill.confidence || "High"} Confidence
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Lagging Gaps to Bridge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100 font-mono">
              LAGGING GAPS ({missingSkillsList.length})
            </span>
            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">
              {missingSkillsList.length > 0 ? "Click to ask AI ↓" : "All cleared ✓"}
            </span>
          </div>

          {missingSkillsList.length === 0 ? (
            <div className="p-4 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 text-center">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                🎯 All core benchmark skills proven
              </p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                Your portfolio matches the prerequisites for this career pathway
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {missingSkillsList.slice(0, 6).map((gap, idx) => {
                const isCritical = gap.category === "critical";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onAskMentorForGap?.(gap.name)}
                    className={cn(
                      "w-full text-left p-2.5 px-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] hover:shadow-[3px_3px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-between gap-2 cursor-pointer group",
                      isCritical
                        ? "bg-rose-500/[0.06] hover:bg-rose-500/[0.10] dark:bg-rose-950/30 dark:hover:bg-rose-950/45"
                        : "bg-amber-500/[0.06] hover:bg-amber-500/[0.10] dark:bg-amber-950/30 dark:hover:bg-amber-950/45"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 group-hover:underline transition-all truncate">
                        {gap.name}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border font-mono shrink-0",
                          isCritical
                            ? "bg-[#FECDD3] text-rose-950 border-rose-400 dark:bg-rose-900 dark:text-rose-200 dark:border-rose-700"
                            : "bg-[#FEF08A] text-amber-950 border-amber-400 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700"
                        )}
                      >
                        {isCritical ? "CRITICAL" : "GROWTH"}
                      </span>
                    </div>

                    <div className="w-5 h-5 rounded-md bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 group-hover:bg-[#BAE6FD] group-hover:text-blue-950 group-hover:border-zinc-900 transition-colors shrink-0 shadow-2xs">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
