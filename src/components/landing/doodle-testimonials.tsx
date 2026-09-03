"use client";

import React from "react";
import { Sparkles, Star, Quote, ShieldCheck } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote: "I shared my Minskey Passport link instead of a standard PDF. The engineering lead checked my AST audit and commit entropy, skipped the take-home assignment, and hired me within 48 hours.",
    author: "Aditya Roy",
    role: "Backend Lead @ YC-Backed Fintech",
    college: "NIT Trichy '25",
    tag: "SKIPPED 3 SCREENING ROUNDS",
    tagBg: "bg-[#DCFCE7] text-emerald-950",
    tilt: "rotate-[-1.5deg]",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "Our hackathon squad was missing a Go & distributed systems engineer. We posted on Minskey and matched with a candidate whose commit history proved real Raft consensus experience. We won 1st place.",
    author: "Meera Sen",
    role: "Smart India Hackathon Finalist",
    college: "BITS Pilani '26",
    tag: "TEAM ASSEMBLED IN 15 MINS",
    tagBg: "bg-[#FEF08A] text-amber-950",
    tilt: "rotate-[1.5deg]",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "As a founder, 90% of resumes are bloated with buzzwords. Minskey lets me see authentic repository entropy and multi-LLM code audit verdicts upfront. It has eliminated fake candidates completely.",
    author: "Vikram Malhotra",
    role: "VP of Engineering @ CloudMatrix",
    college: "Hiring Lead & Open Source Sponsor",
    tag: "70% REDUCED SCREENING TIME",
    tagBg: "bg-[#E0F2FE] text-blue-950",
    tilt: "rotate-[-1deg]",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  },
];

export function DoodleTestimonials() {
  return (
    <section className="w-full bg-[#FAF9F6] dark:bg-zinc-950 py-16 sm:py-24 border-b-2 border-zinc-900 dark:border-zinc-800 relative select-none transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border-2 border-zinc-900 dark:border-zinc-700 text-xs font-black text-pink-950 dark:text-pink-200 shadow-xs rotate-[1deg]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL BUILDER STORIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Proven Code Speaks Louder <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-400">Than Polished Resumes</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            How students and hiring teams are transforming technical recruiting with cryptographic verification.
          </p>
        </div>

        {/* 3 Polaroid Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-zinc-900 rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 p-6 sm:p-7 flex flex-col justify-between shadow-[5px_5px_0px_0px_#18181B] dark:shadow-[5px_5px_0px_0px_#000000] hover:shadow-[7px_7px_0px_0px_#18181B] hover:-translate-y-1 transition-all relative ${t.tilt}`}
            >
              {/* Washi Tape Pin on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#FEF08A]/80 dark:bg-amber-400/40 border border-zinc-900/40 shadow-2xs rotate-[-2deg]" />

              <div className="space-y-4 pt-2">
                {/* Tag Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border border-zinc-900 shadow-2xs ${t.tagBg}`}>
                    {t.tag}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5 mt-6">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 object-cover shrink-0 shadow-xs"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 flex items-center gap-1">
                    {t.author}
                    <ShieldCheck className="w-3 h-3 text-blue-600 inline" />
                  </span>
                  <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 leading-tight">
                    {t.role}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-500 leading-tight mt-0.5">
                    {t.college}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
