"use client";

import React from "react";
import { Search, X, SlidersHorizontal, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type FilterCategory = "all" | "high-match" | "direct-fit" | "remote" | "verified-only";
export type SortOption = "match-desc" | "match-asc" | "company-az" | "title-az";

interface OpportunityFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  highMatchCount: number;
  avgMatch: number;
}

export function OpportunityFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  totalCount,
  highMatchCount,
  avgMatch,
}: OpportunityFilterBarProps) {
  const filterChips: { id: FilterCategory; label: string; count?: number }[] = [
    { id: "all", label: "All Opportunities", count: totalCount },
    { id: "high-match", label: "★ 75%+ High Match", count: highMatchCount },
    { id: "direct-fit", label: "Direct Skill Fit" },
    { id: "remote", label: "Remote / Hybrid" },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by role title, company, or required skill (e.g. TypeScript, React)..."
            className="pl-10 pr-10 h-11 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600 text-sm shadow-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 p-1 font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-700 dark:text-zinc-300 font-bold whitespace-nowrap hidden sm:inline">Sort:</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
          >
            <option value="match-desc" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100">
              Highest Match %
            </option>
            <option value="match-asc" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100">
              Lowest Match %
            </option>
            <option value="company-az" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100">
              Company (A–Z)
            </option>
            <option value="title-az" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100">
              Role Title (A–Z)
            </option>
          </select>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onFilterChange(chip.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border-2 border-zinc-900 dark:border-zinc-700 cursor-pointer",
                isActive
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs"
              )}
            >
              <span>{chip.label}</span>
              {chip.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-black",
                    isActive ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100"
                  )}
                >
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
