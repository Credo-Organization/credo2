"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  GitBranch, 
  Code2, 
  Sparkles, 
  ArrowRight,
  AlertTriangle,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/ui/login-modal";

export function DoodleProofComparison() {
  const [activeTab, setActiveTab] = useState<"passport" | "resume">("passport");

  return (
    <section className="w-full bg-[#FAF9F6] dark:bg-zinc-950 py-16 sm:py-24 border-b-2 border-zinc-900 dark:border-zinc-800 relative select-none transition-colors">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-zinc-900 text-xs font-black text-zinc-950 shadow-xs rotate-[-1deg]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE COMPARISON</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Why Hiring Leads Throw Out Resumes <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-400">And Hire From Minskey</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            See the exact difference between an easily faked PDF bullet point and a cryptographically proven skill record.
          </p>

          {/* Interactive Switcher Buttons */}
          <div className="pt-3 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("passport")}
                className={cn(
                  "px-4 sm:px-6 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2",
                  activeTab === "passport"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>The Minskey Passport (Evidence)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("resume")}
                className={cn(
                  "px-4 sm:px-6 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2",
                  activeTab === "resume"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                )}
              >
                <FileText className="w-4 h-4" />
                <span>The Legacy Resume (Claims)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "passport" ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 p-6 sm:p-9 shadow-[6px_6px_0px_0px_#18181B] dark:shadow-[6px_6px_0px_0px_#000000] relative animate-in fade-in zoom-in-95 duration-200">
              
              {/* Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-zinc-900 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-zinc-950 dark:text-zinc-100">
                      W3C Verifiable Credential · Verified Identity
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      DID:did:minskey:ed25519:7a4c9e18b4...
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border-2 border-zinc-900 shadow-xs">
                  ✓ 98.4% AST VERIFIED
                </span>
              </div>

              {/* Verified Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-900 dark:border-zinc-700 space-y-1 shadow-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>SYNTAX TREE (AST)</span>
                  </div>
                  <div className="text-xl font-black text-zinc-950 dark:text-zinc-100">14,280 Lines</div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Verified Go, TypeScript & Python across 12 repos
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-900 dark:border-zinc-700 space-y-1 shadow-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-purple-600" />
                    <span>COMMIT GRAPH ENTROPY</span>
                  </div>
                  <div className="text-xl font-black text-zinc-950 dark:text-zinc-100">Organic Growth</div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    184 commits across 9 months. Zero batch imports.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-zinc-900 dark:border-zinc-700 space-y-1 shadow-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI CONSENSUS AUDIT</span>
                  </div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">3/3 Models Agreed</div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Gemini Pro + DeepSeek + Nemotron certified
                  </div>
                </div>
              </div>

              {/* Recruiter Outcome Banner */}
              <div className="p-4 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/40 border-2 border-zinc-900 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                    Recruiter Verdict & Action
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                    Fast-tracked directly to the final system architecture round. 0 screening rounds needed.
                  </p>
                </div>
                <LoginModal>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] cursor-pointer whitespace-nowrap"
                  >
                    Build Your Passport
                  </button>
                </LoginModal>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-400 dark:border-zinc-700 p-6 sm:p-9 shadow-[6px_6px_0px_0px_#A1A1AA] dark:shadow-[6px_6px_0px_0px_#27272A] relative animate-in fade-in zoom-in-95 duration-200">
              
              {/* Unverified Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-rose-700 dark:text-rose-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-zinc-950 dark:text-zinc-100 line-through text-zinc-400">
                      Standard PDF Resume Document
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      File: Alex_Resume_Updated_v4.pdf
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border-2 border-zinc-900 shadow-xs">
                  ❌ UNVERIFIABLE CLAIMS
                </span>
              </div>

              {/* Bullet Points with Red Flags */}
              <div className="my-6 space-y-3">
                {[
                  { claim: "Expert in Kubernetes, Distributed Systems, Microservices & Docker", issue: "Zero commit proof. 85% of applicants copy-paste this from job descriptions." },
                  { claim: "Built scalable backend architecture serving 1,000,000 requests/sec", issue: "Tutorial clone repo. Single commit push with generic boilerplates." },
                  { claim: "Certified AI Engineer from online course platform", issue: "Vanity certificate. No verifiable code execution or AST assessment." },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                        {item.claim}
                      </div>
                      <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                        Flag: {item.issue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recruiter Outcome Banner */}
              <div className="p-4 rounded-2xl bg-rose-100/70 dark:bg-rose-950/40 border-2 border-zinc-900 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-black uppercase tracking-wider text-rose-950 dark:text-rose-200">
                    Recruiter Verdict & Friction
                  </div>
                  <p className="text-xs text-rose-900 dark:text-rose-300 font-medium">
                    Sent to generic applicant tracking pile. Subjected to 3 rounds of generic LeetCode screening.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("passport")}
                  className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] cursor-pointer whitespace-nowrap"
                >
                  See The Verified Fix →
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
