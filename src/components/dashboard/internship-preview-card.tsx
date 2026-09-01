"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InternshipPreviewCardProps {
  careerGoal?: string;
  verifiedSkillsCount?: number;
}

export function DashboardInternshipPreviewCard({
  careerGoal = "Software Engineer",
  verifiedSkillsCount = 12,
}: InternshipPreviewCardProps) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm relative overflow-hidden group">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 tracking-tight">
            Personalized Internship Matches
          </h3>
        </div>

        <Link href="/dashboard/internships">
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs h-10 px-4 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-2 cursor-pointer group-hover:scale-[1.02] transition-transform"
          >
            <span>Explore Matches</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>


      {/* Quick Preview Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-200">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-900 truncate">AI Engineering Intern</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 ml-2">100%</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-900 truncate">Full-Stack Developer</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 ml-2">85%</span>
        </div>
      </div>
    </div>
  );
}
