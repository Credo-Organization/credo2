"use client";

import React, { useState } from "react";
import { SkillPassportCard, SkillPassportData } from "@/components/dashboard/skill-passport-card";
import { StudentPassportIdCard, StudentPassportProps } from "@/components/passport/student-id-card";
import { CreditCard, LayoutDashboard, Share2, Printer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  mappedData: SkillPassportData;
  studentData: StudentPassportProps["studentData"];
}

export function DashboardViewSwitcher({ mappedData, studentData }: Props) {
  const [viewMode, setViewMode] = useState<"id-card" | "analytics">("id-card");

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const studentId = studentData?.studentId || mappedData?.studentId || "CDY26S4611";
      const url = `${window.location.origin}/verify/passport/${studentId}`;
      navigator.clipboard.writeText(url);
      toast.success("Verifiable Passport URL copied to clipboard!");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[440px] flex-shrink-0">
      {/* Top Controls Bar - Unified Tactile Neobrutalist Theme & Perfect Alignment */}
      <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] transition-colors">
        
        {/* Left Segmented Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-300 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode("id-card")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer",
              viewMode === "id-card"
                ? "bg-[#FEF08A] text-amber-950 border-2 border-zinc-900 shadow-[1.5px_1.5px_0px_0px_#18181B]"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60"
            )}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <span>ID Card</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("analytics")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer",
              viewMode === "analytics"
                ? "bg-[#BAE6FD] text-blue-950 border-2 border-zinc-900 shadow-[1.5px_1.5px_0px_0px_#18181B]"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span>Matrix</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="h-8 px-3 text-xs text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-[#DCFCE7] hover:text-emerald-950 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl flex items-center gap-1.5 font-black shadow-[2px_2px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-8 px-3 text-xs text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-[#EDE9FE] hover:text-purple-950 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl flex items-center gap-1.5 font-black shadow-[2px_2px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Render Section */}
      <div className="w-full flex justify-center">
        {viewMode === "id-card" ? (
          <div className="animate-in fade-in duration-300 transition-all w-full flex justify-center">
            <StudentPassportIdCard studentData={studentData} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 w-full flex justify-center">
            <SkillPassportCard data={mappedData} />
          </div>
        )}
      </div>
    </div>
  );
}
