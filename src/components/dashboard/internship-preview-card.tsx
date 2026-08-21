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
    <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-[#0a0d14] to-black/60 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Live Opportunity Engine
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                100% Merit
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              Personalized Internship Matches
            </h3>
          </div>
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

      <p className="text-xs text-white/70 leading-relaxed mb-4">
        Based on your <strong>{verifiedSkillsCount} verified skills</strong>, our AI engine has matched you with top-tier internships evaluating candidates via zero-bias Blind Merit Matching.
      </p>

      {/* Quick Preview Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.06]">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-white truncate">AI Engineering Intern</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 ml-2">100%</span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-white truncate">Full-Stack Developer</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 ml-2">85%</span>
        </div>
      </div>
    </div>
  );
}
