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
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const next = !saved;
    startTransition(async () => {
      const res = next
        ? await saveCandidate(passportId)
        : await removeCandidate(passportId);

      if (res.success) {
        setSaved(next);
        toast.success(
          next ? "Candidate saved to your shortlist" : "Removed from shortlist"
        );
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-black transition-all cursor-pointer select-none",
        "border-2 border-zinc-900 dark:border-zinc-700",
        "shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]",
        "hover:-translate-y-0.5 active:translate-y-[1px] active:translate-x-[1px] active:shadow-none",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
        saved
          ? isHovered
            ? "bg-rose-50 text-rose-900 border-zinc-900 dark:bg-rose-950/40 dark:text-rose-300"
            : "bg-[#BAE6FD] hover:bg-sky-200 text-blue-950 dark:bg-sky-950/70 dark:text-sky-200"
          : "bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100"
      )}
      title={saved ? "Click to remove candidate from shortlist" : "Save candidate to your shortlist"}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : saved ? (
        isHovered ? (
          <Bookmark className="w-4 h-4 stroke-[2.5] text-rose-600 dark:text-rose-400 shrink-0" />
        ) : (
          <BookmarkCheck className="w-4 h-4 stroke-[2.5] text-blue-700 dark:text-sky-400 shrink-0" />
        )
      ) : (
        <Bookmark className="w-4 h-4 stroke-[2.5] text-zinc-700 dark:text-zinc-300 shrink-0" />
      )}
      
      <span>
        {isPending
          ? "Updating..."
          : saved
          ? isHovered
            ? "Remove from shortlist"
            : "Saved to shortlist"
          : "Save to shortlist"}
      </span>
    </button>
  );
}
