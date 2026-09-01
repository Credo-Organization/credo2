"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
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
  careerGoal = "AI Engineer",
  verifiedSkills = [
    { name: "TypeScript", confidence: "High" },
    { name: "CSS", confidence: "Medium" },
    { name: "JavaScript", confidence: "High" },
    { name: "Python", confidence: "High" },
  ],
  missingSkillsList = [
    { name: "PostgreSQL", category: "critical", rationale: "Core prerequisite for backend scalability & data pipelines" },
    { name: "Go", category: "critical", rationale: "Standard production deployment & microservice requirement" },
    { name: "Docker", category: "recommended", rationale: "High-value differentiator for modern AI & web architectures" },
    { name: "GraphQL", category: "recommended", rationale: "High-value differentiator for modern AI & web architectures" },
  ],
  gapDescription,
  onAskMentorForGap,
}: SkillGapMatrixProps) {
  const totalRelevantSkills = verifiedSkills.length + missingSkillsList.length;
  const readinessPercent = totalRelevantSkills > 0 
    ? Math.round((verifiedSkills.length / totalRelevantSkills) * 100)
    : 60;

  const defaultDescription =
    gapDescription ||
    `Proficient in full-stack architecture with strong TypeScript foundation. Next milestone: Advanced Distributed Systems & Cloud Orchestration.`;

  return (
    <div className="w-full rounded-3xl bg-[#FAF9F6] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181B] p-5 select-none overflow-hidden">
      
      {/* Top Header: Clean Typography, No Logos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-zinc-900">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
            SKILL GAP INTELLIGENCE
          </span>
          <h3 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight mt-0.5">
            Target Benchmark: <span className="underline decoration-zinc-900 decoration-2 underline-offset-4">{careerGoal}</span>
          </h3>
        </div>

        {/* Minimal Stamp Badge */}
        <div className="self-start sm:self-center border-2 border-dashed border-zinc-900 bg-white px-3 py-1 rounded-2xl -rotate-1 shadow-xs">
          <span className="font-doodle text-sm sm:text-base font-bold text-zinc-950">
            🎯 {readinessPercent}% Role Readiness
          </span>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="my-3 p-3 rounded-2xl bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B]">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-950 mb-1.5">
          <span>Market Competency Delta</span>
          <span className="font-doodle text-xs text-zinc-600 font-bold">
            ~2 milestones away from 95% match
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full border-2 border-zinc-900 bg-zinc-100 overflow-hidden relative">
          <div 
            className="h-full bg-zinc-950 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(Math.max(readinessPercent, 20), 100)}%` }}
          />
        </div>

        <p className="text-xs text-zinc-600 font-normal leading-relaxed mt-2">
          {defaultDescription}
        </p>
      </div>

      {/* 2-Column Grid: Verified vs. Lagging Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        
        {/* LEFT: Verified in Passport */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-zinc-950">
              VERIFIED IN PASSPORT ({verifiedSkills.length})
            </span>
            <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-800 border border-zinc-400">
              PROVEN
            </span>
          </div>

          <div className="space-y-1.5">
            {verifiedSkills.slice(0, 4).map((skill, idx) => (
              <div
                key={idx}
                className="p-2 px-3 rounded-xl bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] flex items-center justify-between"
              >
                <span className="text-xs font-black text-zinc-950">
                  {skill.name}
                </span>

                <span className="text-[10px] font-bold font-doodle px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-400">
                  {skill.confidence} Confidence
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Lagging Gaps to Bridge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-zinc-950">
              LAGGING GAPS ({missingSkillsList.length})
            </span>
            <span className="font-doodle text-xs text-zinc-500 font-bold">
              Click to ask AI ↓
            </span>
          </div>

          <div className="space-y-1.5">
            {missingSkillsList.map((gap, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onAskMentorForGap?.(gap.name)}
                className="w-full text-left p-2 px-3 rounded-xl bg-white hover:bg-zinc-50 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] hover:shadow-[3px_3px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-between gap-2 cursor-pointer group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-zinc-950 group-hover:underline transition-all truncate">
                      {gap.name}
                    </span>
                    <span className="text-[8.5px] font-bold uppercase px-1.5 py-0.2 rounded-md border border-zinc-900 bg-zinc-100 text-zinc-950">
                      {gap.category === "critical" ? "CRITICAL" : "GROWTH"}
                    </span>
                  </div>

                  {gap.rationale && (
                    <span className="text-[9.5px] text-zinc-600 block truncate mt-0.5 font-medium">
                      {gap.rationale}
                    </span>
                  )}
                </div>

                <div className="w-5 h-5 rounded-md bg-zinc-100 border border-zinc-900 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
