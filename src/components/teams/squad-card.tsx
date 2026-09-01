"use client";

import React, { useState } from "react";
import { Users, ShieldCheck, Sparkles, Send, ExternalLink, GitBranch, MessageSquare, CheckCircle2 } from "lucide-react";
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
      <div className="group relative rounded-3xl border border-stone-200 bg-white shadow-sm p-6 backdrop-blur-xl transition-all duration-300 hover:border-stone-300 hover:shadow-lg flex flex-col justify-between">
        {/* Subtle Top Gradient Glow */}
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-navy-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />

        <div className="space-y-4">
          {/* Header: Track Pill & Synergy Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-stone-100 border border-stone-200 text-stone-700">
              {squad.track}
            </span>

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                isHighSynergy
                  ? "bg-navy-500/10 border-navy-500/30 text-navy-700 shadow-[0_0_12px_rgba(43, 72, 135,0.15)]"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{synergyScore}% Synergy</span>
            </div>
          </div>

          {/* Squad Title & Lead */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-stone-200 flex-shrink-0 bg-stone-50">
              <img src={squad.avatar} alt={squad.name} className="w-full h-full object-cover" />
            </div>

            <div className="overflow-hidden flex-1">
              <h3 className="text-base font-bold text-stone-900 tracking-tight group-hover:text-navy-700 transition-colors truncate">
                {squad.name}
              </h3>
              <p className="text-xs text-stone-500 truncate flex items-center gap-1">
                Lead: <span className="text-stone-700 font-medium">{squad.leader}</span>
              </p>
            </div>
          </div>

          {/* Problem Statement */}
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
            {squad.problem}
          </p>

          {/* Complementary AI Fit Callout */}
          {squad.complementary_note && (
            <div className="p-3 rounded-2xl bg-navy-500/[0.04] border border-navy-500/15 text-[11px] text-navy-700 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
              <span>{squad.complementary_note}</span>
            </div>
          )}

          {/* Open Roles & Skills Needed */}
          <div className="space-y-2 pt-1 border-t border-stone-200">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-500 uppercase tracking-wider font-bold">
                Looking For
              </span>
              <span className="text-stone-500 font-mono">
                {squad.current_members.length}/{squad.max_members} Filled
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {squad.open_roles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-[11px] font-semibold text-stone-800"
                >
                  ⚡ {role}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {squad.required_skills.map((skill) => {
                const isMatched = (squad.matched_skills || []).includes(skill) || userSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                      isMatched
                        ? "bg-navy-500/15 border-navy-500/30 text-navy-700 font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-500"
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
        <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-stone-200">
          <div className="flex items-center gap-2">
            {squad.github_repo && (
              <a
                href={`https://github.com/${squad.github_repo}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
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
                className="p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                title="Join Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            )}
          </div>

          <Button
            onClick={() => setIsApplyOpen(true)}
            className="h-9 px-4 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Send className="w-3.5 h-3.5" />
            Apply with Passport
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
