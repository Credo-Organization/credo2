"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface SuggestedProjectItem {
  name: string;
  description: string;
}

interface BlueprintCardsProps {
  projects: SuggestedProjectItem[];
  careerGoal?: string;
  hasPassport?: boolean;
}

export function BlueprintCards({
  projects = [],
  careerGoal = "Software Engineer",
}: BlueprintCardsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const displayProjects: SuggestedProjectItem[] =
    projects.length > 0
      ? projects
      : [
          {
            name: "Real-time Collaboration Workspace",
            description: "Build using React, Go WebSockets, and PostgreSQL to master full-stack state and concurrency.",
          },
          {
            name: "Microservices E-Commerce API",
            description: "Dockerize independent Go services (auth, inventory, payments) to learn container orchestration.",
          },
          {
            name: "GraphQL Analytics Dashboard",
            description: "Aggregate complex data via GraphQL into a modern Tailwind dashboard.",
          },
        ];

  const handleCopySpec = (proj: SuggestedProjectItem, idx: number) => {
    const promptText = `Act as a Principal Staff Engineer. I am preparing for a role as a ${careerGoal}.
I need a production-grade architecture blueprint to build this portfolio project:
Project: "${proj.name}"
Description: "${proj.description}"

Please provide:
1. Recommended modern tech stack and directory architecture.
2. Core database schema or data contracts.
3. Step-by-step implementation milestones with automated test strategies.
4. Key challenges to highlight on my GitHub README to impress engineering hiring managers.`;

    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(promptText);
      setCopiedIndex(idx);
      toast.success(`Copied blueprint prompt for "${proj.name}"!`);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {displayProjects.map((proj, idx) => {
        const isCopied = copiedIndex === idx;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-stone-200/80 dark:border-zinc-700 bg-stone-50/70 dark:bg-zinc-800/60 hover:bg-stone-100/70 dark:hover:bg-zinc-800 transition-all relative overflow-hidden group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Subtle Left Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-purple-500/50 group-hover:from-blue-500 group-hover:to-purple-500 transition-colors" />

            <div className="min-w-0 flex-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="font-doodle text-sm font-bold text-purple-700 dark:text-purple-300 select-none">
                  #{idx + 1}
                </span>
                <span className="text-sm font-bold text-stone-900 dark:text-zinc-100 tracking-tight block truncate">
                  {proj.name}
                </span>
              </div>
              <span className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed mt-1 block">
                {proj.description}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopySpec(proj, idx)}
              className={cn(
                "h-8 px-3 rounded-lg border text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-[0.98]",
                isCopied
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
              )}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-doodle text-xs font-bold text-emerald-800">Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy AI Blueprint</span>
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
