"use client";

import React, { useState } from "react";
import { SkillPassportCard, SkillPassportData } from "@/components/dashboard/skill-passport-card";
import { StudentPassportIdCard, StudentPassportProps } from "@/components/passport/student-id-card";
import { CreditCard, LayoutDashboard, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  mappedData: SkillPassportData;
  studentData: StudentPassportProps["studentData"];
}

export function DashboardViewSwitcher({ mappedData, studentData }: Props) {
  const [viewMode, setViewMode] = useState<"id-card" | "analytics">("id-card");

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = studentData?.verificationUrl || window.location.href;
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
    <div className="flex flex-col gap-5 w-full max-w-[440px] flex-shrink-0">
      {/* Top Controls Bar - Unified Theme */}
      <div className="flex items-center justify-between gap-3 p-1.5 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm backdrop-blur-xl transition-colors">
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-800 p-1 rounded-xl border border-stone-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode("id-card")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "id-card"
                ? "bg-white dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 shadow-sm scale-[1.02]"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Official ID Card
          </button>

          <button
            type="button"
            onClick={() => setViewMode("analytics")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "analytics"
                ? "bg-white dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 shadow-sm scale-[1.02]"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Interactive Matrix
          </button>
        </div>

        <div className="flex items-center gap-1.5 pr-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="h-8 px-2.5 text-xs text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg gap-1.5 font-medium cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrint}
            className="h-8 px-2.5 text-xs text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg gap-1.5 font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
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
