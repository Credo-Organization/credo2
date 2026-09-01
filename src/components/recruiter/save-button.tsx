"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveCandidate, removeCandidate } from "@/actions/recruiter";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  passportId: string;
  initiallySaved: boolean;
}

export function SaveButton({ passportId, initiallySaved }: SaveButtonProps) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const next = !saved;
    startTransition(async () => {
      const res = next
        ? await saveCandidate(passportId)
        : await removeCandidate(passportId);

      if (res.success) {
        setSaved(next);
        toast.success(next ? "Candidate saved to your shortlist" : "Removed from shortlist");
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed",
        saved
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15"
          : "bg-white/[0.03] border-white/[0.06] text-white hover:bg-white/[0.06]"
      )}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {saved ? "Saved to shortlist" : "Save candidate"}
    </button>
  );
}
