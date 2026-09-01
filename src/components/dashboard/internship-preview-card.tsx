"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TopMatchItem {
  title: string;
  orgName?: string;
  matchScore: number;
}

interface InternshipPreviewCardProps {
  careerGoal?: string;
  verifiedSkillsCount?: number;
  topMatches?: TopMatchItem[];
  hasPassport?: boolean;
}

export function DashboardInternshipPreviewCard({
  careerGoal = "Software Engineer",
  verifiedSkillsCount = 0,
  topMatches = [],
  hasPassport = true,
}: InternshipPreviewCardProps) {
  const displayMatches: TopMatchItem[] =
    topMatches.length > 0
      ? topMatches.slice(0, 2)
      : hasPassport && verifiedSkillsCount > 0
      ? [
          { title: "Junior AI Developer", matchScore: 40 },
          { title: "AI Intern - Data Analysis", matchScore: 33 },
        ]
      : [
          { title: "Junior AI Developer", matchScore: 40 },
          { title: "AI Intern - Data Analysis", matchScore: 33 },
        ];

  return (
    <div className="rounded-3xl border border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm relative overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 tracking-tight">
            Personalized Internship Matches
          </h3>
          <span className="font-doodle text-sm font-bold text-blue-600 dark:text-blue-400 -rotate-2 select-none">
            ✨ Vector Fit
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="hidden md:inline font-doodle text-xs text-stone-500 dark:text-zinc-400 -rotate-1 select-none">
            ⚡ Live verified roles
          </span>
          <Link href="/dashboard/internships">
            <Button
              size="sm"
              className="bg-black hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs h-10 px-5 shadow-sm flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <span>Explore Matches</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Preview Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 dark:border-zinc-800">
        {displayMatches.map((match, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-zinc-800/70 border border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span
                className="text-xs font-semibold text-stone-900 dark:text-zinc-100 truncate"
                title={match.title}
              >
                {match.title}
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-2 shrink-0">
              {match.matchScore}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
