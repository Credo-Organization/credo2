"use client";

import React from "react";
import { ShieldCheck, EyeOff, FolderGit2, Sparkles, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProofHUDProps {
  studentId?: string;
  repoCount?: number;
  certCount?: number;
}

export function DashboardProofHUD({
  studentId = "CDY25S7421",
  repoCount = 4,
  certCount = 2,
}: ProofHUDProps) {
  return (
    <div className="w-full rounded-2xl border border-stone-200 bg-gradient-to-r from-emerald-950/20 via-black/60 to-blue-950/20 p-4 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left: Security & Proof Pill Badges */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>W3C DID: Ed25519 Verified</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
          <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
          <span>GitProof Physics: {repoCount} Repos Audited</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <EyeOff className="w-3.5 h-3.5 text-purple-400" />
          <span>Blind Shield Active ({studentId})</span>
        </div>
      </div>

      {/* Right: Quick Match Action */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/dashboard/internships">
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs h-9 px-4 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
          >
            <span>Live Internship Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
