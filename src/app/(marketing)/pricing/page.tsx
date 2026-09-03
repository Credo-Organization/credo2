"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Building, 
  Zap, 
  Award, 
  ArrowRight, 
  Lock, 
  HelpCircle, 
  Users, 
  CheckCircle2,
  Code2,
  GitBranch,
  Shield,
  FileCheck
} from "lucide-react";
import { LoginModal } from "@/components/ui/login-modal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is the Builder tier really free forever?",
    a: "Yes! Any student or self-taught developer can generate a verified Skill Passport, audit their GitHub repositories, and join hackathon squads completely free of charge.",
  },
  {
    q: "How does Minskey detect AI-generated vibe coding or plagiarism?",
    a: "Minskey runs deep Abstract Syntax Tree (AST) static analysis combined with commit graph entropy and multi-LLM consensus (Google Gemini, DeepSeek, and Nemotron). We audit commit timestamp distribution, organic code evolution, and author cryptographic identity.",
  },
  {
    q: "Can my company integrate Minskey with our existing ATS?",
    a: "Yes. The Recruiter Talent Console supports instant CSV and webhook exports compatible with Greenhouse, Lever, Ashby, and Workday, allowing hiring teams to ingest verified candidate dossiers directly into candidate pipelines.",
  },
  {
    q: "Can I cancel or switch my plan at any time?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your Pro Fellow or Recruiter subscription at any time with zero lock-in or cancellation penalties.",
  },
  {
    q: "Are student credentials compliant with open standards?",
    a: "Every published passport adheres to W3C Verifiable Credentials (DID) specifications and is cryptographically signed with Ed25519 keypairs, making credentials permanently verifiable independent of any single centralized platform.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const isAnnual = billingCycle === "annual";

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-28 pb-24 relative select-none overflow-hidden transition-colors">
      {/* Background Architectural Dot Matrix */}
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#71717A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border-2 border-zinc-900 dark:border-zinc-700 text-xs font-black text-blue-700 dark:text-blue-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT, EVIDENCE-FIRST PRICING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1]">
            Invest in Proof, <br className="hidden sm:inline" />
            <span className="relative inline-block mt-1">
              Not Resume Fiction.
              <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#FEF08A] dark:bg-amber-400/30 -z-10 -rotate-1" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            From students proving their genuine engineering capabilities to high-growth tech teams hiring with zero resume noise.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer",
                  !isAnnual
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                )}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5",
                  isAnnual
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                )}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#FEF08A] text-zinc-950 border border-zinc-900">
                  SAVE 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 3-TIER PRICING CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          
          {/* TIER 1: BUILDER FREE */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 p-7 sm:p-8 flex flex-col justify-between shadow-[5px_5px_0px_0px_#18181B] dark:shadow-[5px_5px_0px_0px_#000000] relative">
            <div className="space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 inline-block shadow-xs">
                  STUDENTS & BUILDERS
                </span>
                <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 mt-3">
                  Builder
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 font-medium leading-relaxed">
                  Everything you need to verify your code, create your cryptographic DID passport, and join hackathons.
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-b-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-950 dark:text-zinc-50">₹0</span>
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">/ forever free</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  No credit card required
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {[
                  "1 Public Verifiable Skill Passport DID",
                  "Static AST audit across up to 15 Repos",
                  "Organic commit graph entropy verification",
                  "Unlimited Hackathon Squad Matcher access",
                  "10 AI Career Mentor inferences per day",
                  "Shareable verified dossier link",
                  "Embeddable GitHub README verified badge",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-600 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <LoginModal className="w-full block">
                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-black text-sm border-2 border-zinc-900 dark:border-zinc-600 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Create Free Passport</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </LoginModal>
            </div>
          </div>

          {/* TIER 2: PRO FELLOW (FEATURED) */}
          <div className="bg-[#FEFCE8] dark:bg-amber-950/20 rounded-3xl border-2 border-zinc-900 dark:border-amber-500/60 p-7 sm:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_#18181B] dark:shadow-[8px_8px_0px_0px_#000000] relative scale-100 lg:-translate-y-2">
            
            {/* Washi Tape "MOST POPULAR" Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FEF08A] border-2 border-zinc-900 text-zinc-950 font-black text-[11px] uppercase tracking-wider px-4 py-0.5 rounded-full shadow-xs rotate-[-1deg]">
              ★ MOST POPULAR FOR JOB SEEKERS
            </div>

            <div className="space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 text-blue-900 dark:text-blue-200 inline-block shadow-xs">
                  CANDIDATE BOOST
                </span>
                <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 mt-3">
                  Pro Fellow
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 font-medium leading-relaxed">
                  For engineers actively applying to high-paying remote internships, top product startups, and global teams.
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-b-2 border-dashed border-zinc-900/20 dark:border-zinc-700">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-950 dark:text-zinc-50">
                    {isAnnual ? "₹399" : "₹499"}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">/ month</span>
                </div>
                <div className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-1">
                  {isAnnual ? "Billed annually (₹4,788/yr)" : "Billed monthly"}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {[
                  "Everything in Builder tier, plus:",
                  "Continuous multi-branch repository monitoring",
                  "Multi-Model Consensus (Gemini Pro + Nemotron + Grok)",
                  "Top 5% Verified Candidate Badge on Recruiter Shortlists",
                  "Unlimited AI Career Mentor sessions & 14-day gap roadmaps",
                  "Printable Cryptographic Student ID Card with QR key",
                  "Priority candidate indexing in talent discovery searches",
                  "Dedicated Discord Pro Fellow role & technical community",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className={i === 3 ? "font-black text-zinc-950 dark:text-zinc-50" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <LoginModal className="w-full block">
                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B] active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Upgrade to Pro Fellow</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </LoginModal>
            </div>
          </div>

          {/* TIER 3: RECRUITER TALENT CONSOLE */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 p-7 sm:p-8 flex flex-col justify-between shadow-[5px_5px_0px_0px_#18181B] dark:shadow-[5px_5px_0px_0px_#000000] relative">
            <div className="space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E0F2FE] dark:bg-sky-950/60 border-2 border-zinc-900 dark:border-zinc-700 text-sky-950 dark:text-sky-200 inline-block shadow-xs">
                  HIRING TEAMS & TECH LEADS
                </span>
                <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 mt-3">
                  Recruiter Console
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 font-medium leading-relaxed">
                  For engineering managers and talent teams who want to filter candidates by actual code, not claims.
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-b-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-950 dark:text-zinc-50">
                    {isAnnual ? "₹7,999" : "₹9,999"}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">/ month</span>
                </div>
                <div className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-1">
                  {isAnnual ? "Billed annually (14-day free trial)" : "14-day free trial"}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {[
                  "Unlimited Candidate Passport lookups & audits",
                  "Blind Anti-Bias Evaluation Console with private notes",
                  "Deep AST Code Entropy & AI-generation forensic reports",
                  "Direct 1-Click Verified Interview Invitations",
                  "ATS & CSV Export (Greenhouse, Lever, Ashby)",
                  "Custom talent filters by verified library & architecture",
                  "Dedicated Account Architect & priority phone support",
                  "Custom college hackathon talent batch reports",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/recruiter-signup"
                className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B] active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start 14-Day Recruiter Trial</span>
                <Building className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── FEATURE MATRIX COMPARISON TABLE ── */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100">
              Detailed Plan Comparison
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              A comprehensive breakdown of features across all three tiers.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl shadow-[6px_6px_0px_0px_#18181B] dark:shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                    <th className="p-4 sm:p-5 font-black text-zinc-950 dark:text-zinc-100 text-sm w-2/5">Capability</th>
                    <th className="p-4 sm:p-5 font-black text-zinc-950 dark:text-zinc-100 text-center w-1/5">Builder Free</th>
                    <th className="p-4 sm:p-5 font-black text-blue-600 dark:text-blue-400 text-center w-1/5 bg-[#FEFCE8] dark:bg-amber-950/30">Pro Fellow</th>
                    <th className="p-4 sm:p-5 font-black text-zinc-950 dark:text-zinc-100 text-center w-1/5">Recruiter</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { name: "Public Verifiable Passport DID", free: "1 Passport", pro: "1 Passport", rec: "Unlimited Lookups" },
                    { name: "Repositories Audited", free: "Up to 15", pro: "Unlimited", rec: "Unlimited" },
                    { name: "AST Code Analysis", free: "Standard AST", pro: "Deep Multi-Branch", rec: "Forensic Decomposition" },
                    { name: "Multi-Model AI Consensus", free: "Single Model", pro: "3 Models (Gemini+Nemotron)", rec: "Full Audit Logs" },
                    { name: "AI Mentor Career Sessions", free: "10 per day", pro: "Unlimited", rec: "N/A" },
                    { name: "Hackathon Squad Matcher", free: true, pro: true, rec: "Sponsor Access" },
                    { name: "Top 5% Recruiter Badge", free: false, pro: true, rec: "N/A" },
                    { name: "Blind Evaluation Console", free: false, pro: false, rec: true },
                    { name: "ATS Integration (Greenhouse/Lever)", free: false, pro: false, rec: true },
                    { name: "Cryptographic QR ID Card", free: "Digital Only", pro: "High-Res Export", rec: "Scanner API" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-zinc-900 dark:text-zinc-200">{row.name}</td>
                      <td className="p-4 sm:p-5 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                        {typeof row.free === "boolean" ? (
                          row.free ? <Check className="w-4 h-4 mx-auto text-emerald-600 stroke-[3]" /> : <span className="text-zinc-400">—</span>
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-zinc-950 dark:text-zinc-100 font-black bg-[#FEFCE8]/50 dark:bg-amber-950/20">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? <Check className="w-4 h-4 mx-auto text-blue-600 stroke-[3]" /> : <span className="text-zinc-400">—</span>
                        ) : (
                          row.pro
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-zinc-900 dark:text-zinc-200 font-bold">
                        {typeof row.rec === "boolean" ? (
                          row.rec ? <Check className="w-4 h-4 mx-auto text-zinc-950 dark:text-zinc-100 stroke-[3]" /> : <span className="text-zinc-400">—</span>
                        ) : (
                          row.rec
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── PRICING FAQS ── */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              Everything you need to know about our verification tiers and subscriptions.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-5 sm:p-6 rounded-2xl shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] space-y-2"
              >
                <h4 className="text-sm sm:text-base font-black text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 border border-zinc-900 dark:border-zinc-700 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                    Q
                  </span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM STAMP BANNER ── */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-8 text-center shadow-[6px_6px_0px_0px_#18181B] dark:shadow-[6px_6px_0px_0px_#000000] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center mx-auto shadow-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
            100% Cryptographic Verification Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
            Every credential generated on Minskey is backed by verifiable Ed25519 signatures, commit AST hashes, and open standards. Zero vanity certificates, zero unverified buzzwords.
          </p>
          <div className="pt-2">
            <LoginModal>
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181B] active:translate-y-[2px] transition-all cursor-pointer"
              >
                Claim Your Free Skill Passport
              </button>
            </LoginModal>
          </div>
        </div>

      </div>
    </div>
  );
}
