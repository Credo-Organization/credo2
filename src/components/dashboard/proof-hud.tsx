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
    <div className="w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left: Security & Proof Pill Badges */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>W3C DID: Ed25519 Verified</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <FolderGit2 className="w-3.5 h-3.5 text-blue-700" />
          <span>GitProof Physics: {repoCount} Repos Audited</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
          <EyeOff className="w-3.5 h-3.5 text-purple-700" />
          <span>Blind Shield Active ({studentId})</span>
        </div>
      </div>

      {/* Right: Quick Match Action */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/dashboard/internships">
          <Button
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs h-9 px-4 shadow-sm flex items-center gap-1.5"
          >
            <span>Live Internship Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
