"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function CandidateLookup() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = value.replace(/[^A-Za-z0-9-]/g, "");
    if (!id) return;
    router.push(`/recruiter/candidate/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passport ID, e.g. CDY26S7421"
          aria-label="Look up a candidate by passport ID"
          className="w-full h-11 pl-10 pr-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors flex-shrink-0"
      >
        Look up
      </button>
    </form>
  );
}
