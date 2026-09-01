"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles, Send, GitBranch, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SquadApplyModal } from "./squad-apply-modal";

export interface Squad {
  id: string;
  name: string;
  track: string;
  problem: string;
  leader: string;
  avatar: string;
  current_members: { name: string; role: string; skills: string[] }[];
  open_roles: string[];
  required_skills: string[];
  max_members: number;
  discord?: string;
  github_repo?: string;
  synergy_score?: number;
  matched_skills?: string[];
  complementary_note?: string;
}

interface SquadCardProps {
  squad: Squad;
  userSkills?: string[];
}

export function SquadCard({ squad, userSkills = [] }: SquadCardProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const synergyScore = squad.synergy_score || 88;
  const isHighSynergy = synergyScore >= 80;

  return (
    <>
      <div className="group relative rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-[5px_5px_0px_0px_#18181B] dark:shadow-[5px_5px_0px_0px_#000000] hover:shadow-[7px_7px_0px_0px_#18181B] dark:hover:shadow-[7px_7px_0px_0px_#000000] hover:-translate-y-1 p-6 transition-all duration-300 flex flex-col justify-between select-none">
        <div className="space-y-4">
          {/* Header: Track Badge & Stamped Synergy Seal */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-stone-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100">
              {squad.track}
            </span>

            {/* Stamped Rubber Seal */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 text-xs font-black shadow-xs ${
                isHighSynergy
                  ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-300"
                  : "bg-sky-100 dark:bg-blue-950/70 text-blue-950 dark:text-blue-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>★ {synergyScore}% Synergy</span>
            </div>
          </div>

          {/* Squad Title & Lead */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-zinc-900 dark:border-zinc-700 flex-shrink-0 bg-stone-50 dark:bg-zinc-800 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]">
              <img src={squad.avatar} alt={squad.name} className="w-full h-full object-cover" />
            </div>

            <div className="overflow-hidden flex-1">
              <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {squad.name}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1 font-medium">
                Lead: <span className="text-zinc-950 dark:text-zinc-100 font-bold">{squad.leader}</span>
              </p>
            </div>
          </div>

          {/* Problem Statement */}
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2 font-normal">
            {squad.problem}
          </p>

          {/* Complementary AI Fit Callout */}
          {squad.complementary_note && (
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-blue-950/40 border-2 border-zinc-900 dark:border-zinc-700 text-[11px] text-zinc-950 dark:text-zinc-100 leading-relaxed flex items-start gap-2 shadow-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{squad.complementary_note}</span>
            </div>
          )}

          {/* Open Roles: Perforated Detachable Ticket Look */}
          <div className="space-y-2 pt-2 border-t-2 border-dashed border-zinc-300 dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-950 dark:text-zinc-100 uppercase tracking-wider font-black">
                Open Squad Roles
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 font-mono font-bold">
                {squad.current_members.length}/{squad.max_members} Filled
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {squad.open_roles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-dashed border-zinc-900 dark:border-zinc-700 text-[11px] font-black text-amber-950 dark:text-amber-300 shadow-xs"
                >
                  ⚡ {role}
                </span>
              ))}
            </div>

            {/* Required Skills Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {squad.required_skills.map((skill) => {
                const isMatched = (squad.matched_skills || []).includes(skill) || userSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono border-2 border-zinc-900 dark:border-zinc-700 transition-all ${
                      isMatched
                        ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-300 font-black shadow-xs"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                    }`}
                  >
                    {isMatched ? `✓ ${skill}` : skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {squad.github_repo && (
              <a
                href={`https://github.com/${squad.github_repo}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all"
                title="View GitHub Repository"
              >
                <GitBranch className="w-4 h-4" />
              </a>
            )}
            {squad.discord && (
              <a
                href={`https://${squad.discord}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all"
                title="Join Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            )}
          </div>

          <Button
            onClick={() => setIsApplyOpen(true)}
            className="h-10 px-4 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apply with Passport</span>
          </Button>
        </div>
      </div>

      <SquadApplyModal
        squad={squad}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        userSkills={userSkills}
      />
    </>
  );
}
