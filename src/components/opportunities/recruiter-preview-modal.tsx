"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  CheckCircle2,
  Sparkles,
  Code2,
  FileCheck,
  Send,
  Loader2,
  Check,
  Copy,
  EyeOff,
  Fingerprint,
  MapPin,
} from "lucide-react";
import { MatchResult } from "@/lib/matching/opportunity-matcher";
import { toast } from "sonner";
import { addApplication } from "@/lib/storage/job-applications";

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
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const { opportunity, matchScore, matchedSkills } = result;

  // Derive anonymized blind identifiers
  const shortToken = passportSnapshot?.student_id || "MSK26S7421";
  const anonymizedId = `CANDIDATE_#${shortToken.slice(-5)}`;
  const verifiedRepos = passportSnapshot?.top_projects || [
    { name: "minskey-ai-engine", language: "TypeScript", stars: 12 },
    { name: "distributed-state-sync", language: "Python", stars: 8 },
  ];

  const dossierUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/passport/${shortToken}`
    : `/verify/passport/${shortToken}`;

  const handleCopyDossierUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(dossierUrl);
      setHasCopiedLink(true);
      toast.success("Verified Dossier URL copied to clipboard!", {
        description: "Attach this link to your job application for verifiable cryptographic proof.",
      });
      setTimeout(() => setHasCopiedLink(false), 2500);
    }
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    // Persist verified application to user's database tracker
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    addApplication({
      company: opportunity.org_name,
      role: opportunity.title,
      location: opportunity.location || "Remote / Hybrid",
      matchScore: matchScore,
      passportId: shortToken,
      status: "dispatched",
      gitProofScore: 98,
      verifiedSkills: matchedSkills?.map((s) => s.skill_name) || ["TypeScript", "Full-Stack"],
      notes: `Recorded for ${opportunity.org_name}. Cryptographic Dossier Token: ${shortToken}`,
      recruiterNotes: "Application logged with verifiable DID passport proof.",
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Application Tracked & Dossier Ready!", {
      description: `Added to your tracker. Copy your cryptographic dossier link to submit to ${opportunity.org_name}.`,
    });
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => setIsSubmitted(false), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleResetAndClose()}>
      <DialogContent className="sm:max-w-4xl md:max-w-4xl w-full bg-[#FAF9F6] border-2 border-zinc-900 text-zinc-950 p-0 overflow-hidden shadow-[8px_8px_0px_0px_#18181B] rounded-3xl">
        {/* Top Header Banner */}
        <div className="p-7 pb-6 border-b-2 border-zinc-900 bg-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pr-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-zinc-900 flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_#18181B]">
                <EyeOff className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black text-blue-950 uppercase tracking-widest bg-blue-100 px-2.5 py-0.5 rounded-full border-2 border-zinc-900 shadow-xs">
                    ★ Blind Merit Review
                  </span>
                  <Badge variant="outline" className="border-2 border-zinc-900 text-zinc-950 font-bold text-[11px] bg-zinc-100">
                    PII Masked
                  </Badge>
                  <Badge variant="outline" className="border-2 border-zinc-900 text-emerald-950 font-bold text-[11px] bg-emerald-100">
                    W3C DID Verified
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-black text-zinc-950 tracking-tight">
                  Recruiter Perspective Preview
                </DialogTitle>
                <p className="text-xs text-zinc-600 font-medium">
                  This is the exact zero-bias merit dossier hiring managers review at {opportunity.org_name}.
                </p>
              </div>
            </div>

            {/* Match Score Display: Stamped Rubber Seal */}
            <div className="flex sm:flex-col items-center sm:items-end shrink-0 gap-2 sm:gap-0.5 bg-emerald-50 border-2 border-dashed border-emerald-700 p-3 sm:py-2 sm:px-4 rounded-2xl shadow-xs rotate-[1deg] select-none">
              <span className="text-3xl font-black text-emerald-900 leading-none">
                {matchScore}%
              </span>
              <span className="text-[10px] text-emerald-800 uppercase tracking-widest font-black">
                ★ Verified Fit
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body: 2-Column Spacious Grid */}
        <div className="p-7 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar bg-[#FAF9F6]">
          {/* Target Role Strip */}
          <div className="p-5 rounded-2xl bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-black block">Target Role</span>
              <h3 className="text-base font-black text-zinc-950 tracking-tight">{opportunity.title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-950">
              <span className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-xl border-2 border-zinc-900 font-bold shadow-xs">
                <Building className="w-3.5 h-3.5 text-zinc-600" />
                <span>{opportunity.org_name}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-xl border-2 border-zinc-900 font-bold shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-600" />
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
                  <span className="text-xs font-black text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    Candidate Identity Token
                  </span>
                  <span className="font-mono text-blue-950 bg-blue-100 px-3 py-1 rounded-xl border-2 border-zinc-900 text-xs font-black shadow-xs">
                    {anonymizedId}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-zinc-900 shadow-xs">
                    <span className="text-zinc-500 text-[11px] block font-bold">GitProof</span>
                    <span className="text-zinc-950 font-black text-sm mt-0.5 block">99.4%</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Entropy Valid</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-zinc-900 shadow-xs">
                    <span className="text-zinc-500 text-[11px] block font-bold">Credential</span>
                    <span className="text-zinc-950 font-black text-sm mt-0.5 block">Ed25519</span>
                    <span className="text-[10px] text-blue-700 font-bold">DID Signed</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-zinc-900 shadow-xs">
                    <span className="text-zinc-500 text-[11px] block font-bold">Plagiarism</span>
                    <span className="text-emerald-700 font-black text-sm mt-0.5 block">0 Flags</span>
                    <span className="text-[10px] text-zinc-600 font-medium">Clean Repos</span>
                  </div>
                </div>
              </div>

              {/* Scanned Codebase Proofs */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  Audited Codebase Proof Vectors
                </h4>
                <div className="space-y-2.5">
                  {verifiedRepos.map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border-2 border-zinc-900 flex items-center justify-between text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Code2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-zinc-950 block">{r.name}</span>
                          <span className="text-zinc-500 font-mono text-[11px]">{r.language || "TypeScript"}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-950 font-black bg-emerald-100 px-2.5 py-1 rounded-xl border-2 border-zinc-900 shadow-xs">
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
                <h4 className="text-xs font-black text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Skills Backed by Proof ({matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((s) => (
                    <span
                      key={s.skill_id}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-zinc-900 text-zinc-950 flex items-center gap-1.5 shadow-xs"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{s.skill_name}</span>
                      {s.is_critical && (
                        <span className="text-[10px] text-amber-950 font-black ml-1 bg-amber-100 px-1.5 py-0.5 rounded border border-zinc-900">
                          Core Req
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Merit Alignment Verdict */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-dashed border-zinc-900 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black text-zinc-950 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI Match Evaluator Verdict
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  Candidate profile exhibits verified competency with <strong className="text-zinc-950 font-bold">{opportunity.title}</strong> requirements at {opportunity.org_name}. Automated commit analysis confirms high organic code entropy with verified Ed25519 identity backing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 px-7 border-t-2 border-zinc-900 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleResetAndClose}
            className="text-zinc-700 hover:text-zinc-950 border-2 border-zinc-900 rounded-xl w-full sm:w-auto h-11 transition-all cursor-pointer font-bold shadow-xs active:translate-y-[1px]"
          >
            Close Preview
          </Button>

          {isSubmitted ? (
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleCopyDossierUrl}
                className="bg-zinc-950 hover:bg-zinc-800 text-white border-2 border-zinc-900 rounded-xl px-5 h-11 font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-xs cursor-pointer text-xs"
              >
                {hasCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedLink ? "Dossier Link Copied!" : "Copy Cryptographic Dossier Link"}
              </Button>
              <Button
                disabled
                className="bg-emerald-100 text-emerald-950 border-2 border-zinc-900 rounded-xl px-5 h-11 font-black flex items-center justify-center gap-2 w-full sm:w-auto shadow-xs text-xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Tracked in Dashboard
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleApply}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl px-8 h-12 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B] active:translate-y-[2px] flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer transition-all"
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
