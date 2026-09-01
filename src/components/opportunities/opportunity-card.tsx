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
            ? "border-navy-500/30 hover:border-navy-500/50 hover:shadow-[0_10px_30px_rgba(43, 72, 135,0.1)]"
            : isModerateMatch
            ? "border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.08)]"
            : "border-stone-200 hover:border-stone-300"
        )}
      >
        {/* Dynamic Top Ambient Glow */}
        {isHighMatch && (
          <>
            <div className="absolute top-0 right-0 w-72 h-72 bg-navy-500/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy-500/0 via-navy-500/70 to-navy-500/0" />
          </>
        )}
        {isModerateMatch && (
          <>
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0" />
          </>
        )}

        {/* Card Header */}
        <div className="p-7 pb-5 border-b border-stone-200 relative z-10">


          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-navy-700 transition-colors">
                {opportunity.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-stone-500">
                <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200">
                  <Building className="w-3.5 h-3.5 text-stone-500" /> {opportunity.org_name}
                </span>
                <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" /> {opportunity.location}
                </span>
                <span className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-stone-500" /> {opportunity.duration}
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
                    isHighMatch ? "text-navy-700" : isModerateMatch ? "text-amber-400" : "text-stone-700"
                  )}
                >
                  {matchScore}<span className="text-[10px] font-bold">%</span>
                </span>
              </div>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold sm:mt-1">
                Match Fit
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 space-y-6 flex-1 relative z-10 flex flex-col">
          {/* Description */}
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
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
                <h4 className="text-[11px] font-bold mb-2.5 flex items-center gap-1.5 text-emerald-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Skills Backed by Proof ({matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      variant="secondary"
                      className="bg-navy-500/10 text-navy-700 hover:bg-navy-500/20 border border-navy-500/20 font-medium px-3 py-1 text-xs rounded-xl shadow-sm flex items-center gap-1"
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
          <div className="pt-4 border-t border-stone-200">
            <AiCoachInsight result={result} passportSnapshot={passportSnapshot} />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 relative z-10 mt-auto flex items-center gap-3">
          <Button
            onClick={() => setIsApplyModalOpen(true)}
            className={cn(
              "w-full rounded-2xl h-12 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
              isHighMatch
                ? "bg-navy-900 text-white hover:bg-navy-800 shadow-[0_0_25px_rgba(43, 72, 135,0.35)]"
                : "bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200"
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
