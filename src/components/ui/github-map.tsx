"use client";

import React, { useMemo, useState } from "react";
import { format, subDays, parseISO } from "date-fns";
import { GitCommit, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const GITHUB_GREENS = [
  "var(--heatmap-level-0, #e4e4e7)",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

export const MINSKEY_INKS = [
  "var(--heatmap-level-0, #e4e4e7)",
  "#bfdbfe",
  "#60a5fa",
  "#2563eb",
  "#1d4ed8",
];

export const MONO_SKETCH = [
  "var(--heatmap-level-0, #e4e4e7)",
  "#d4d4d8",
  "#a1a1aa",
  "#52525b",
  "#18181b",
];

export interface ContributionDay {
  date: string;
  count: number;
}

export interface GitHubCalendarProps {
  data?: ContributionDay[];
  colors?: string[];
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  showLegend?: boolean;
  showSummary?: boolean;
  className?: string;
  title?: string;
  maxWeeks?: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAY_LABELS = [
  { label: "", day: 0 },
  { label: "Mon", day: 1 },
  { label: "", day: 2 },
  { label: "Wed", day: 3 },
  { label: "", day: 4 },
  { label: "Fri", day: 5 },
  { label: "", day: 6 },
];

export function GitHubCalendar({
  data,
  colors = GITHUB_GREENS,
  blockSize = 11,
  blockMargin = 3,
  blockRadius = 2.5,
  showLegend = true,
  showSummary = true,
  className,
  title = "GitProof™ Activity Log & Commit Velocity",
  maxWeeks,
}: GitHubCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Fallback mock generation if no data provided
  const calendarData = useMemo(() => {
    if (data && data.length > 0) return data;
    return generateMockContributions();
  }, [data]);

  const totalContributions = useMemo(() => {
    return calendarData.reduce((acc, curr) => acc + curr.count, 0);
  }, [calendarData]);

  // Organize data into week columns of 7 days
  const { weeks, monthHeaders } = useMemo(() => {
    const sorted = [...calendarData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const weekColumns: { days: (ContributionDay | null)[] }[] = [];
    let currentWeek: (ContributionDay | null)[] = [];
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    sorted.forEach((dayItem) => {
      const dateObj = parseISO(dayItem.date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
      const month = dateObj.getMonth();

      // Pad beginning if first item isn't Sunday
      if (weekColumns.length === 0 && currentWeek.length === 0 && dayOfWeek > 0) {
        for (let p = 0; p < dayOfWeek; p++) {
          currentWeek.push(null);
        }
      }

      currentWeek.push(dayItem);

      if (currentWeek.length === 7) {
        weekColumns.push({ days: currentWeek });
        // Check if month changed in this week
        if (month !== lastMonth) {
          months.push({ label: MONTH_NAMES[month], colIndex: weekColumns.length - 1 });
          lastMonth = month;
        }
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weekColumns.push({ days: currentWeek });
    }

    let finalWeeks = weekColumns;
    let finalMonths = months;

    if (maxWeeks && maxWeeks > 0 && weekColumns.length > maxWeeks) {
      const offset = weekColumns.length - maxWeeks;
      finalWeeks = weekColumns.slice(offset);
      finalMonths = months
        .filter((m) => m.colIndex >= offset)
        .map((m) => ({ label: m.label, colIndex: m.colIndex - offset }));
    }

    return { weeks: finalWeeks, monthHeaders: finalMonths };
  }, [calendarData, maxWeeks]);

  // Helper to map commit count to color index (0..4)
  const getLevelColor = (count: number) => {
    if (count === 0) return colors[0] || "var(--heatmap-level-0, #e4e4e7)";
    if (count <= 2) return colors[1] || "#9be9a8";
    if (count <= 5) return colors[2] || "#40c463";
    if (count <= 9) return colors[3] || "#30a14e";
    return colors[4] || "#216e39";
  };

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_#18181B] select-none transition-colors relative",
        className
      )}
    >
      {/* Header Summary */}
      {showSummary && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-zinc-900/30">
                <GitCommit className="w-3 h-3 text-emerald-600" />
                Audited Timeline
              </span>
              <span className="text-xs text-zinc-500 font-mono font-bold">
                52-Week Scan
              </span>
            </div>
            <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl border-2 border-zinc-900 bg-zinc-50 dark:bg-zinc-800 shadow-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black text-zinc-950 dark:text-zinc-100">
                {totalContributions.toLocaleString()}{" "}
                <span className="font-medium text-zinc-600 dark:text-zinc-400">commits & PRs</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid Container */}
      <div className="overflow-x-auto pb-1 custom-scrollbar">
        <div className="min-w-fit flex flex-col gap-1">
          {/* Month Labels Row */}
          <div className="flex text-[10px] font-bold text-zinc-500 font-mono pl-7 h-4 relative">
            {monthHeaders.map((m, idx) => (
              <span
                key={`${m.label}-${idx}`}
                className="absolute"
                style={{
                  left: `${m.colIndex * (blockSize + blockMargin) + 28}px`,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid: Day labels + Week Columns */}
          <div className="flex items-start gap-1">
            {/* Day Labels Column (Mon, Wed, Fri) */}
            <div
              className="flex flex-col text-[9px] font-bold font-mono text-zinc-400 w-6 shrink-0 justify-between select-none"
              style={{ height: `${7 * (blockSize + blockMargin) - blockMargin}px` }}
            >
              {DAY_LABELS.map((d, i) => (
                <span
                  key={i}
                  style={{ height: `${blockSize}px`, lineHeight: `${blockSize}px` }}
                  className="text-right pr-1"
                >
                  {d.label}
                </span>
              ))}
            </div>

            {/* Weeks columns */}
            <div className="flex" style={{ gap: `${blockMargin}px` }}>
              {weeks.map((week, wIndex) => (
                <div
                  key={wIndex}
                  className="flex flex-col"
                  style={{ gap: `${blockMargin}px` }}
                >
                  {week.days.map((day, dIndex) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${wIndex}-${dIndex}`}
                          style={{
                            width: `${blockSize}px`,
                            height: `${blockSize}px`,
                          }}
                        />
                      );
                    }

                    const bg = getLevelColor(day.count);

                    return (
                      <div
                        key={day.date}
                        aria-label={`${day.count} contributions on ${day.date}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            date: day.date,
                            count: day.count,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="transition-transform duration-150 hover:scale-140 hover:z-20 cursor-pointer border border-black/10 dark:border-white/10"
                        style={{
                          width: `${blockSize}px`,
                          height: `${blockSize}px`,
                          borderRadius: `${blockRadius}px`,
                          backgroundColor: bg,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Legend */}
      {showLegend && (
        <div className="flex items-center justify-between gap-2 pt-2.5 mt-2.5 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
          <span className="font-mono text-[9px] text-zinc-500 truncate">
            {maxWeeks ? "Source: Scanned GitHub commits" : "Source: Scanned GitHub commit history & PR merges"}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-bold">Less</span>
            <div className="flex items-center gap-0.5">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-xs border border-zinc-900/40 dark:border-zinc-600 shadow-2xs"
                  style={{ backgroundColor: c }}
                  title={`Level ${i}`}
                />
              ))}
            </div>
            <span className="text-[9px] font-bold">More</span>
          </div>
        </div>
      )}

      {/* Floating Tactile Tooltip */}
      {hoveredDay && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-3 py-1.5 rounded-xl border-2 border-zinc-900 text-xs font-black shadow-[3px_3px_0px_0px_#18181B] animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y}px`,
          }}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-emerald-400 dark:text-emerald-600 font-black">
              {hoveredDay.count}
            </span>
            <span>{hoveredDay.count === 1 ? "contribution" : "contributions"}</span>
          </div>
          <div className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono font-bold mt-0.5">
            {format(parseISO(hoveredDay.date), "EEE, MMM d, yyyy")}
          </div>
        </div>
      )}
    </div>
  );
}

export function generateMockContributions(): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i--) {
    const day = subDays(today, i);
    const dayOfWeek = day.getDay();
    const normalized = Math.abs(
      (Math.sin(i * 12.9898 + (i % 7)) * 43758.5453) % 1
    );
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const count = isWeekend
      ? normalized > 0.7
        ? Math.floor(normalized * 4)
        : 0
      : normalized > 0.3
        ? Math.floor(normalized * 12) + 1
        : 0;

    result.push({ date: format(day, "yyyy-MM-dd"), count });
  }

  return result;
}

export function GitHubMapDemo() {
  const data = useMemo(() => generateMockContributions(), []);

  return (
    <div className="w-full">
      <GitHubCalendar data={data} colors={GITHUB_GREENS} />
    </div>
  );
}

export function GitHubCalendarExample({ colors }: { colors?: string[] }) {
  const data = useMemo(() => generateMockContributions(), []);

  return (
    <div className="w-full flex items-center justify-center h-full">
      <GitHubCalendar data={data} colors={colors} />
    </div>
  );
}
