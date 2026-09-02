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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AiCoachInsight } from "./ai-coach-insight";
import { RecruiterPreviewModal } from "./recruiter-preview-modal";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  result: MatchResult;
  passportSnapshot: any;
}

export function OpportunityCard({ result, passportSnapshot }: OpportunityCardProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { opportunity, matchScore, matchedSkills, missingSkills } = result;

  const isHighMatch = matchScore >= 75;

  return (
    <>
      <div
        className="bg-white dark:bg-zinc-900 overflow-hidden rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#18181B] dark:hover:shadow-[6px_6px_0px_0px_#000000] transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full select-none"
      >
        {/* Card Header */}
        <div className="p-7 pb-5 border-b-2 border-zinc-900 dark:border-zinc-700 relative z-10 bg-white dark:bg-zinc-900 transition-colors">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                {opportunity.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs">
                  <Building className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" /> {opportunity.org_name}
                </span>
                <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" /> {opportunity.location}
                </span>
                <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" /> {opportunity.duration}
                </span>
              </div>
            </div>

            {/* Match Score Stamped Rubber Seal */}
            <div className="flex items-center sm:flex-col sm:items-end shrink-0 gap-3 sm:gap-0">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-zinc-900 text-xs font-black shadow-xs ${
                  isHighMatch
                    ? "bg-emerald-100 text-emerald-950"
                    : "bg-amber-100 text-amber-950"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>★ {matchScore}% Fit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 space-y-6 flex-1 flex flex-col justify-between relative z-10 bg-white dark:bg-zinc-900 transition-colors">
          {/* Skills Breakdown */}
          <div className="space-y-4 flex-1">
            {/* Matched Skills */}
            {matchedSkills.length > 0 && (
              <div>
                <h4 className="text-[11px] font-black mb-2.5 flex items-center gap-1.5 text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Skills Backed by Proof ({matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border-2 border-zinc-900 font-bold px-3 py-1 text-xs rounded-xl shadow-xs flex items-center gap-1"
                    >
                      <span>{skill.skill_name}</span>
                      {skill.is_critical && (
                        <span className="text-[10px] font-black text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded border border-zinc-900 ml-1">
                          Core
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills (High Contrast WCAG AA Compliant) */}
            {missingSkills.length > 0 && (
              <div>
                <h4 className="text-[11px] font-black mb-2.5 flex items-center gap-1.5 text-rose-800 uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  Unproven / Missing Requirements ({missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      variant="outline"
                      className="border-2 border-rose-300 bg-rose-50 text-rose-950 font-bold px-3 py-1 text-xs rounded-xl shadow-xs"
                    >
                      {skill.skill_name}
                      {skill.is_critical && <span className="ml-1 text-rose-700 font-black">*</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Coach Match Insight */}
          <div className="pt-4 border-t-2 border-dashed border-zinc-300">
            <AiCoachInsight result={result} passportSnapshot={passportSnapshot} />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 bg-stone-50 dark:bg-zinc-800/80 border-t-2 border-zinc-900 dark:border-zinc-700 relative z-10 mt-auto flex items-center gap-3 transition-colors">
          <Button
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full rounded-xl h-12 text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[2px]"
          >
            {isHighMatch ? (
              <>
                <span>Apply with Verified Passport</span>
                <ChevronRight className="w-4 h-4 ml-0.5 opacity-90 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <span>Preview Blind Application</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
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
