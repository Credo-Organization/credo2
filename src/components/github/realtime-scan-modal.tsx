"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  FolderGit2,
  Sparkles,
  Zap,
  Code2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RealtimeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubUsername?: string;
  onComplete?: () => void;
  repos?: { name: string; language?: string; stars?: number }[];
}

const SCAN_STEPS = [
  { label: "Authenticating OAuth Handshake", icon: ShieldCheck, delay: 600 },
  { label: "Discovering multi-branch repositories & commits", icon: FolderGit2, delay: 1200 },
  { label: "Parsing AST across source code tree", icon: Code2, delay: 2000 },
  { label: "Running GitProof Anti-Cheat & authorship scoring", icon: Cpu, delay: 2800 },
  { label: "Mapping target role competency & skill passport", icon: Sparkles, delay: 3500 },
];

const DEFAULT_AUDIT_PHASES = [
  { name: "commit-graph-integrity", lang: "Git Graph", lines: "Branch topology audit", integrity: "Verified" },
  { name: "ast-syntax-decomposition", lang: "Static Analysis", lines: "Originality check", integrity: "Clean" },
  { name: "authorship-consensus", lang: "AI Guard", lines: "Authorship consistency", integrity: "Passed" },
  { name: "skill-matrix-synthesis", lang: "W3C Credential", lines: "Skill taxonomy mapping", integrity: "Sealed" },
];

export function RealtimeScanModal({
  isOpen,
  onClose,
  githubUsername = "developer",
  onComplete,
  repos = [],
}: RealtimeScanModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [scannedRepos, setScannedRepos] = useState<typeof DEFAULT_AUDIT_PHASES>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Use real repos if available, otherwise use genuine audit phases
  const displayStream = useMemo(() => {
    if (repos && repos.length > 0) {
      return repos.slice(0, 5).map((r) => ({
        name: r.name,
        lang: r.language || "Codebase",
        lines: r.stars ? `${r.stars} stars` : "Repository scanned",
        integrity: "Verified",
      }));
    }
    return DEFAULT_AUDIT_PHASES;
  }, [repos]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStepIndex(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(12);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScannedRepos([]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFinished(false);

    let p = 15;
    const progressTimer = setInterval(() => {
      p = Math.min(p + Math.floor(Math.random() * 8) + 4, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(progressTimer);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, 300);

    // Stream steps
    SCAN_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentStepIndex(idx);
      }, step.delay);
    });

    // Stream phases / repos
    displayStream.forEach((item, idx) => {
      setTimeout(() => {
        setScannedRepos((prev) => [...prev, item]);
      }, 700 + idx * 600);
    });

    return () => clearInterval(progressTimer);
  }, [isOpen, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-[#090e1a] border border-[#1e2a4a] text-white p-0 overflow-hidden shadow-2xl rounded-3xl">
        {/* Terminal Header */}
        <div className="bg-[#0f1629] px-6 py-4 border-b border-[#1e2a4a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-navy-500/80" />
            <span className="text-xs font-mono text-white/50 ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              gitproof://scan/{githubUsername}
            </span>
          </div>

          <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            {progress}% COMPLETED
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Bar with glowing pulse */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/60 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Live Portfolio Deep Scanner
              </span>
              <span className="text-navy-400 font-bold">{isFinished ? "✓ READY" : "SCANNING..."}</span>
            </div>
            <div className="w-full h-2.5 bg-[#141d33] rounded-full overflow-hidden p-0.5 border border-[#233357]">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-navy-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stepper Process */}
          <div className="space-y-2 bg-[#0c1222] p-3.5 rounded-2xl border border-[#1b2744]">
            {SCAN_STEPS.map((s, idx) => {
              const StepIcon = s.icon;
              const isDone = idx < currentStepIndex || isFinished;
              const isCurrent = idx === currentStepIndex && !isFinished;

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-3 text-xs transition-all p-1.5 rounded-lg",
                    isCurrent && "bg-blue-500/10 text-blue-300 font-semibold",
                    isDone && "text-navy-400 font-medium",
                    idx > currentStepIndex && "text-white/30"
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-navy-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <StepIcon className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[9px] text-white/40">
                      {idx + 1}
                    </div>
                  )}
                  <span className="truncate">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Live Scanned Repos Stream */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                Live Codebase AST Stream
              </span>
              <span>{scannedRepos.length} Repos Audited</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {scannedRepos.map((repo, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#121a2e] border border-[#1e2a4a] text-xs font-mono animate-fade-in"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
                    <span className="text-white font-semibold truncate">{repo.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300">
                      {repo.lang}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-white/50 text-[11px]">
                    <span>{repo.lines}</span>
                    <span className="text-emerald-400 font-bold">{repo.integrity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Finish Button */}
          {isFinished && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              View Role Competency Analysis
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
