"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Building,
  CheckCircle2,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterCategory = "all" | "high-match" | "direct-fit" | "remote" | "verified-only";
export type SortOption = "match-desc" | "match-asc" | "company-az" | "title-az";

interface OpportunityFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
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
  const filterChips: { id: FilterCategory; label: string; icon?: React.ElementType; count?: number }[] = [
    { id: "all", label: "All Opportunities", count: totalCount },
    { id: "high-match", label: "🔥 Top Match (≥75%)", count: highMatchCount },
    { id: "direct-fit", label: "⚡ Direct Fit Ready" },
    { id: "remote", label: "🏢 Remote / Hybrid" },
    { id: "verified-only", label: "🛡️ 100% Backed Proof" },
  ];

  return (
    <div className="space-y-4">
      {/* Top Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-white/50 block font-medium">Matched Roles</span>
            <span className="text-xl font-bold text-white tracking-tight">{totalCount}</span>
          </div>
          <Building className="w-5 h-5 text-white/30" />
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-400/70 block font-medium">Top Match Fit</span>
            <span className="text-xl font-bold text-emerald-400 tracking-tight">{highMatchCount}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400/50" />
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-blue-400/70 block font-medium">Avg Fit Index</span>
            <span className="text-xl font-bold text-blue-400 tracking-tight">{avgMatch}%</span>
          </div>
          <TrendingUp className="w-5 h-5 text-blue-400/50" />
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-500/[0.03] border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-purple-400/70 block font-medium">Blind Matching</span>
            <span className="text-xs font-bold text-purple-300 tracking-tight">Active (Merit)</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-purple-400/50" />
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by role title, company, or required skill (e.g. TypeScript, React)..."
            className="pl-10 pr-10 h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 rounded-2xl focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/40 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50 whitespace-nowrap hidden sm:inline">Sort by:</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-11 px-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/90 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 cursor-pointer"
          >
            <option value="match-desc" className="bg-[#0c0e14] text-white">
              Highest Match %
            </option>
            <option value="match-asc" className="bg-[#0c0e14] text-white">
              Lowest Match %
            </option>
            <option value="company-az" className="bg-[#0c0e14] text-white">
              Company (A–Z)
            </option>
            <option value="title-az" className="bg-[#0c0e14] text-white">
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
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer",
                isActive
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <span>{chip.label}</span>
              {chip.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    isActive ? "bg-emerald-500/30 text-emerald-200" : "bg-white/10 text-white/50"
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
