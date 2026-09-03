"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/ui/login-modal";

const HOME_FAQS = [
  {
    question: "What makes Minskey different from LeetCode or HackerRank?",
    answer: "LeetCode tests isolated puzzle-solving in a toy browser IDE. Minskey audits real engineering work in your production repositories: commit graph history, multi-file architecture, AST syntax entropy, and genuine team collaboration.",
  },
  {
    question: "How does the Hackathon Squad Matcher work?",
    answer: "Our engine analyzes verified skill graphs across candidate repositories to compute complementary technical synergy. If your project needs a LangGraph ML engineer and a Next.js frontend lead, Minskey surfaces candidates whose audited code matches that exact stack.",
  },
  {
    question: "Can recruiters see my age, gender, or college tier before reviewing my code?",
    answer: "No. The Recruiter Console supports Blind Cryptographic Evaluation. Candidate profiles are initially presented with anonymized identifiers (e.g. CANDIDATE_#7421) and audited technical merit, preventing unconscious bias and credential elitism.",
  },
  {
    question: "How does Minskey ensure commit authenticity?",
    answer: "Minskey inspects git commit graph timestamps, branch merge topologies, organic code evolution over time, and GPG/Ed25519 commit signatures. Tutorial clones and batch copy-pastes are automatically flagged with low integrity scores.",
  },
  {
    question: "Is Minskey free for students?",
    answer: "Yes! Students can generate their verified skill passport, audit their GitHub repositories, and apply to hackathon squads completely free of charge.",
  },
];

export function DoodleFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#FAF9F6] dark:bg-zinc-950 py-16 sm:py-24 relative select-none transition-colors">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 text-xs font-black text-blue-800 dark:text-blue-300 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS? WE HAVE PROOF.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            Everything you need to know about our cryptographic skill verification and team matching platform.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-black text-zinc-950 dark:text-zinc-100 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#FEF08A] dark:bg-amber-400/30 border border-zinc-900 text-zinc-950 dark:text-amber-200 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-blue-600"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium pl-14 sm:pl-16 border-t-2 border-dashed border-zinc-100 dark:border-zinc-800 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready to start card */}
        <div className="mt-14 p-7 sm:p-8 rounded-3xl bg-zinc-950 text-white border-2 border-zinc-900 shadow-[6px_6px_0px_0px_#18181B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              Ready to verify your genuine engineering capability?
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Join thousands of student builders and engineers showcasing cryptographically verified proof.
            </p>
          </div>

          <LoginModal>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm border-2 border-zinc-100 shadow-[2px_2px_0px_0px_#ffffff] active:translate-y-[1px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </LoginModal>
        </div>

      </div>
    </section>
  );
}
