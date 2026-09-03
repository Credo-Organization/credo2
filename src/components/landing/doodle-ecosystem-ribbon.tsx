"use client";

import React from "react";
import { Award, ShieldCheck, Sparkles, Building2, GraduationCap, Trophy } from "lucide-react";

const ECOSYSTEM_BADGES = [
  { name: "IIT Bombay", type: "Campus Network", icon: GraduationCap },
  { name: "IIT Delhi", type: "Campus Network", icon: GraduationCap },
  { name: "BITS Pilani", type: "Campus Network", icon: GraduationCap },
  { name: "NIT Trichy", type: "Campus Network", icon: GraduationCap },
  { name: "Devfolio Hackathons", type: "Hackathon Partner", icon: Trophy },
  { name: "GitHub Campus", type: "Developer Program", icon: Sparkles },
  { name: "Smart India Hackathon", type: "SIH Finalist Network", icon: Award },
  { name: "YC Founders Network", type: "Hiring Leads", icon: Building2 },
];

export function DoodleEcosystemRibbon() {
  return (
    <section className="w-full bg-[#FAF9F6] dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-800 py-8 select-none overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Caption Label */}
        <div className="text-center mb-5">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 font-mono flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>VERIFIED CODE ACROSS PREMIER BUILDER NETWORKS</span>
          </span>
        </div>

        {/* Marquee / Grid Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {ECOSYSTEM_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] hover:shadow-[3px_3px_0px_0px_#18181B] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-900/40 dark:border-zinc-700 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 tracking-tight leading-none">
                    {b.name}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 font-mono">
                    {b.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
