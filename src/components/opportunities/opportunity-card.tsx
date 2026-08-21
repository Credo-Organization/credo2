"use client";

import React, { useState } from "react";
import { MatchResult } from "@/lib/matching/opportunity-matcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Lock,
  MapPin,
  Building,
  Clock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  EyeOff,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AiCoachInsight } from "./ai-coach-insight";
import { MultiVectorRadar } from "./multi-vector-radar";
import { RecruiterPreviewModal } from "./recruiter-preview-modal";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  result: MatchResult;
  passportSnapshot: any;
}

export function OpportunityCard({ result, passportSnapshot }: OpportunityCardProps) {
  const [showRadar, setShowRadar] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { opportunity, matchScore, matchedSkills, missingSkills } = result;

  const isHighMatch = matchScore >= 75;
  const isModerateMatch = matchScore >= 50 && matchScore < 75;

  return (
    <>
      <div
        className={cn(
          "glass overflow-hidden rounded-[28px] border relative shadow-2xl transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full",
          isHighMatch
            ? "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
            : isModerateMatch
            ? "border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.08)]"
            : "border-white/[0.06] hover:border-white/15"
        )}
      >
        {/* Dynamic Top Ambient Glow */}
        {isHighMatch && (
          <>
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0" />
          </>
        )}
        {isModerateMatch && (
          <>
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0" />
          </>
        )}

        {/* Card Header */}
        <div className="p-7 pb-5 border-b border-white/[0.06] relative z-10">
          {/* Top Metadata Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.04] border border-white/[0.08] text-white/70">
                <EyeOff className="w-3 h-3 text-emerald-400" />
                Blind Match Ready
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Ed25519 Verified
              </span>
            </div>

            {/* Quick Diagnostic Toggle Button */}
            <button
              onClick={() => setShowRadar(!showRadar)}
              className="text-[11px] text-white/60 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors border border-white/5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{showRadar ? "Hide Diagnostic" : "4-Pillar Diagnostic"}</span>
              {showRadar ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                {opportunity.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-white/60">
                <span className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-xl border border-white/[0.06]">
                  <Building className="w-3.5 h-3.5 text-white/50" /> {opportunity.org_name}
                </span>
                <span className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-xl border border-white/[0.06]">
                  <MapPin className="w-3.5 h-3.5 text-white/50" /> {opportunity.location}
                </span>
                <span className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-xl border border-white/[0.06]">
                  <Clock className="w-3.5 h-3.5 text-white/50" /> {opportunity.duration}
                </span>
              </div>
            </div>

            {/* Match Score Circular Ring */}
            <div className="flex items-center sm:flex-col sm:items-end shrink-0 gap-3 sm:gap-0">
              <div className="relative flex items-center justify-center w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="5"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke={isHighMatch ? "#10b981" : isModerateMatch ? "#f59e0b" : "rgba(255,255,255,0.3)"}
                    strokeWidth="5"
                    strokeDasharray="170"
                    strokeDashoffset={170 - (170 * matchScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span
                  className={cn(
                    "absolute text-base font-black tracking-tight",
                    isHighMatch ? "text-emerald-400" : isModerateMatch ? "text-amber-400" : "text-white/80"
                  )}
                >
                  {matchScore}<span className="text-[10px] font-bold">%</span>
                </span>
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold sm:mt-1">
                Match Fit
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 space-y-6 flex-1 relative z-10 flex flex-col">
          {/* Description */}
          <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
            {opportunity.description}
          </p>

          {/* 4-Pillar Multi-Vector Diagnostic Radar (Expandable / Inline) */}
          {showRadar && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <MultiVectorRadar
                matchScore={matchScore}
                matchedCount={matchedSkills.length}
                totalRequirements={opportunity.requirements.length}
              />
            </div>
          )}

          {/* Skills Breakdown */}
          <div className="space-y-4 flex-1">
            {/* Matched Skills */}
            {matchedSkills.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold mb-2.5 flex items-center gap-1.5 text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Skills Backed by Proof ({matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 font-medium px-3 py-1 text-xs rounded-xl shadow-sm flex items-center gap-1"
                    >
                      <span>{skill.skill_name}</span>
                      {skill.is_critical && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 px-1.5 py-0.2 rounded border border-amber-400/20">
                          Core
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold mb-2.5 flex items-center gap-1.5 text-rose-400/80 uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  Unproven / Missing Requirements ({missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      variant="outline"
                      className="border-rose-500/20 bg-rose-500/5 text-rose-300 font-normal px-3 py-1 text-xs rounded-xl"
                    >
                      {skill.skill_name}
                      {skill.is_critical && <span className="ml-1 text-rose-400 font-bold">*</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Coach Match Insight */}
          <div className="pt-4 border-t border-white/[0.06]">
            <AiCoachInsight result={result} passportSnapshot={passportSnapshot} />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 bg-white/[0.02] border-t border-white/[0.06] relative z-10 mt-auto flex items-center gap-3">
          <Button
            onClick={() => setIsApplyModalOpen(true)}
            className={cn(
              "w-full rounded-2xl h-12 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
              isHighMatch
                ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
            )}
          >
            {isHighMatch ? (
              <>
                <span>Apply with Verified Passport</span>
                <ChevronRight className="w-4 h-4 ml-0.5 opacity-80 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <span>Preview Blind Application</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recruiter Perspective Modal */}
      <RecruiterPreviewModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        result={result}
        passportSnapshot={passportSnapshot}
      />
    </>
  );
}
