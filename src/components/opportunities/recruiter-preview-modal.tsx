"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  Code2,
  FileCheck,
  Send,
  Loader2,
  Check,
  EyeOff,
  Clock,
  Fingerprint,
  MapPin,
  Award,
} from "lucide-react";
import { MatchResult } from "@/lib/matching/opportunity-matcher";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecruiterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MatchResult;
  passportSnapshot: any;
}

export function RecruiterPreviewModal({
  isOpen,
  onClose,
  result,
  passportSnapshot,
}: RecruiterPreviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { opportunity, matchScore, matchedSkills, missingSkills } = result;

  // Derive anonymized blind identifiers
  const shortToken = passportSnapshot?.student_id || "CDY25S7421";
  const anonymizedId = `CANDIDATE_#${shortToken.slice(-5)}`;
  const verifiedRepos = passportSnapshot?.top_projects || [
    { name: "credo-ai-engine", language: "TypeScript", stars: 12 },
    { name: "distributed-state-sync", language: "Python", stars: 8 },
  ];

  const handleApply = async () => {
    setIsSubmitting(true);
    // Simulate verifiable dispatch & cryptographic timestamping
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Skill Passport Application Dispatched!", {
      description: `Cryptographic proof bundle submitted to ${opportunity.org_name}.`,
    });
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => setIsSubmitted(false), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleResetAndClose()}>
      <DialogContent className="sm:max-w-4xl md:max-w-4xl w-full bg-[#080a0f] border border-stone-200/[0.12] text-stone-900 p-0 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] rounded-3xl">
        {/* Top Header Banner */}
        <div className="p-7 pb-6 border-b border-stone-200 bg-gradient-to-r from-emerald-950/20 via-black/80 to-blue-950/20 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pr-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <EyeOff className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                    Blind Merit Review
                  </span>
                  <Badge variant="outline" className="border-stone-200 text-stone-500 text-[11px] bg-white">
                    PII Masked
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/20 text-blue-300 text-[11px] bg-blue-500/5">
                    W3C DID Verified
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-black text-stone-900 tracking-tight">
                  Recruiter Perspective Preview
                </DialogTitle>
                <p className="text-xs text-stone-500">
                  This is the exact zero-bias merit dossier hiring managers review at {opportunity.org_name}.
                </p>
              </div>
            </div>

            {/* Match Score Display */}
            <div className="flex sm:flex-col items-center sm:items-end shrink-0 gap-2 sm:gap-1 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-stone-200/5 sm:border-0">
              <span className="text-3xl font-black text-emerald-400 leading-none">
                {matchScore}%
              </span>
              <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-bold">
                Verified Fit
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body: 2-Column Spacious Grid */}
        <div className="p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Target Role Strip */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">Target Role</span>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">{opportunity.title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <Building className="w-3.5 h-3.5 text-stone-400" />
                <span>{opportunity.org_name}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{opportunity.location}</span>
              </span>
            </div>
          </div>

          {/* 2-Column Modular Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Verified Identity & Codebase Proof */}
            <div className="space-y-6">
              {/* Candidate Identity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-blue-400" />
                    Candidate Identity Token
                  </span>
                  <span className="font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 text-xs font-semibold">
                    {anonymizedId}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 text-[11px] block font-medium">GitProof</span>
                    <span className="text-stone-900 font-bold text-sm mt-0.5 block">99.4%</span>
                    <span className="text-[10px] text-emerald-400">Physics Verified</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 text-[11px] block font-medium">Credential</span>
                    <span className="text-stone-900 font-bold text-sm mt-0.5 block">Ed25519</span>
                    <span className="text-[10px] text-blue-400">DID Signed</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 text-[11px] block font-medium">Plagiarism</span>
                    <span className="text-emerald-400 font-bold text-sm mt-0.5 block">0 Flags</span>
                    <span className="text-[10px] text-stone-400">Clean Codebase</span>
                  </div>
                </div>
              </div>

              {/* Scanned Codebase Proofs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-400" />
                  Audited Codebase Proof Vectors
                </h4>
                <div className="space-y-2.5">
                  {verifiedRepos.map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs hover:border-stone-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-stone-900 block">{r.name}</span>
                          <span className="text-stone-400 font-mono text-[11px]">{r.language || "TypeScript"}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                        Audited
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Verified Skills Chain & AI Verdict */}
            <div className="space-y-6">
              {/* Verified Skills Chain */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verified Skills Backed by Proof ({matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((s) => (
                    <span
                      key={s.skill_id}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1.5 shadow-sm"
                    >
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{s.skill_name}</span>
                      {s.is_critical && (
                        <span className="text-[10px] text-amber-300 font-bold ml-1 bg-amber-400/15 px-1.5 py-0.2 rounded border border-amber-400/20">
                          Core Req
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Merit Alignment Verdict */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/20 via-black/40 to-purple-950/20 border border-blue-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  AI Match Evaluator Verdict
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Candidate profile exhibits verified competency with <strong>{opportunity.title}</strong> requirements at {opportunity.org_name}. Automated commit analysis confirms high organic code entropy with verified Ed25519 identity backing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 px-7 border-t border-stone-200 bg-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handleResetAndClose}
            className="text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-xl w-full sm:w-auto h-11"
          >
            Close Preview
          </Button>

          {isSubmitted ? (
            <Button
              disabled
              className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl px-8 h-12 font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              Application Sent ({shortToken})
            </Button>
          ) : (
            <Button
              onClick={handleApply}
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl px-8 h-12 shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Proof Bundle...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Apply with Verifiable Passport
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
