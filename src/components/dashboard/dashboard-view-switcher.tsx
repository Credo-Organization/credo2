"use client";

import React, { useState } from "react";
import { SkillPassportCard, SkillPassportData } from "@/components/dashboard/skill-passport-card";
import { StudentPassportIdCard, StudentPassportProps } from "@/components/passport/student-id-card";
import { CreditCard, LayoutDashboard, Share2, Download, Printer } from "lucide-react";
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
    <div className="flex flex-col gap-6 w-full max-w-[620px] flex-shrink-0">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-3 p-1.5 bg-[#0f1424] border border-[#1e2a4a] rounded-2xl">
        <div className="flex items-center gap-1 bg-[#090d19] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode("id-card")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "id-card"
                ? "bg-white text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Official ID Card
          </button>

          <button
            type="button"
            onClick={() => setViewMode("analytics")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "analytics"
                ? "bg-white text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
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
            className="h-8 px-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrint}
            className="h-8 px-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
        </div>
      </div>

      {/* Main Render Section */}
      <div className="w-full flex justify-center">
        {viewMode === "id-card" ? (
          <div className="animate-fade-in transition-all">
            <StudentPassportIdCard studentData={studentData} />
          </div>
        ) : (
          <div className="animate-fade-in w-full">
            <SkillPassportCard data={mappedData} />
          </div>
        )}
      </div>
    </div>
  );
}
