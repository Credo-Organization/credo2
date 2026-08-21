"use client";

import React, { useState, useMemo } from "react";
import { MatchResult } from "@/lib/matching/opportunity-matcher";
import { OpportunityCard } from "./opportunity-card";
import {
  OpportunityFilterBar,
  FilterCategory,
  SortOption,
} from "./opportunity-filter-bar";
import { Briefcase, Search, Sparkles, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InternshipsClientHubProps {
  initialResults: MatchResult[];
  passportSnapshot: any;
}

export function InternshipsClientHub({
  initialResults,
  passportSnapshot,
}: InternshipsClientHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("match-desc");

  // Filter and sort the opportunities in memory with sub-millisecond latency
  const filteredAndSortedResults = useMemo(() => {
    let list = [...initialResults];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const titleMatch = r.opportunity.title.toLowerCase().includes(q);
        const orgMatch = r.opportunity.org_name.toLowerCase().includes(q);
        const skillMatch = r.opportunity.requirements.some((req) =>
          req.skill_name.toLowerCase().includes(q)
        );
        const descMatch = r.opportunity.description.toLowerCase().includes(q);
        return titleMatch || orgMatch || skillMatch || descMatch;
      });
    }

    // 2. Category Filter
    if (activeFilter === "high-match") {
      list = list.filter((r) => r.matchScore >= 75);
    } else if (activeFilter === "direct-fit") {
      list = list.filter((r) => r.missingSkills.length === 0 || r.matchScore >= 85);
    } else if (activeFilter === "remote") {
      list = list.filter(
        (r) =>
          r.opportunity.location.toLowerCase().includes("remote") ||
          r.opportunity.location.toLowerCase().includes("hybrid") ||
          r.opportunity.location.toLowerCase().includes("india")
      );
    } else if (activeFilter === "verified-only") {
      list = list.filter((r) => r.matchedSkills.length >= 2);
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (activeSort === "match-desc") {
        return b.matchScore - a.matchScore;
      }
      if (activeSort === "match-asc") {
        return a.matchScore - b.matchScore;
      }
      if (activeSort === "company-az") {
        return a.opportunity.org_name.localeCompare(b.opportunity.org_name);
      }
      if (activeSort === "title-az") {
        return a.opportunity.title.localeCompare(b.opportunity.title);
      }
      return 0;
    });

    return list;
  }, [initialResults, searchQuery, activeFilter, activeSort]);

  // Compute stats
  const totalCount = initialResults.length;
  const highMatchCount = initialResults.filter((r) => r.matchScore >= 75).length;
  const avgMatch =
    totalCount > 0
      ? Math.round(initialResults.reduce((acc, r) => acc + r.matchScore, 0) / totalCount)
      : 0;

  return (
    <div className="space-y-8">
      {/* Search, Filter & Stats Command Bar */}
      <OpportunityFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        totalCount={totalCount}
        highMatchCount={highMatchCount}
        avgMatch={avgMatch}
      />

      {/* Grid of Results */}
      {filteredAndSortedResults.length === 0 ? (
        <div className="text-center py-16 px-6 border border-white/[0.06] rounded-3xl bg-white/[0.01] backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <FilterX className="w-7 h-7 text-white/40" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Matching Opportunities Found</h3>
          <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
            No internships match your current search criteria or active filters. Try loosening your filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            className="border-white/10 text-white hover:bg-white/5 rounded-full px-6"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
          {filteredAndSortedResults.map((result, i) => (
            <div
              key={result.opportunity.id}
              className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <OpportunityCard
                result={result}
                passportSnapshot={passportSnapshot}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
