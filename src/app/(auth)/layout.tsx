import React from "react";
import Link from "next/link";
import { PaperAirplane, DoodleCloud } from "@/components/landing/doodle-elements";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#FAF9F6] bg-dot-grid text-zinc-900 overflow-x-hidden select-none">
      {/* ── Soft Watercolor Pastel Blobs ── */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Floating Doodle Elements ── */}
      <div className="absolute top-8 left-8 sm:left-16 animate-doodle-drift hidden sm:block pointer-events-none">
        <DoodleCloud className="scale-100" />
      </div>

      <div className="absolute top-10 right-8 sm:right-20 animate-doodle-float hidden sm:block pointer-events-none">
        <PaperAirplane className="scale-100" />
      </div>

      {/* ── Top Bar with Return Link ── */}
      <div className="w-full max-w-5xl px-6 py-6 flex items-center justify-between absolute top-0 z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors">
            Minskey
          </span>
          <span className="font-doodle text-xl font-bold text-blue-600 -rotate-2">
            ← Back home
          </span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-12 sm:py-16 mt-6">
        {children}
      </div>

      {/* ── Doodle Bottom Footnote ── */}
      <div className="pb-6 text-center text-xs text-zinc-500 font-medium">
        <span className="font-doodle text-base text-zinc-700 font-bold">
          ⚡ Cryptographic proof • Zero data resale • Pure merit
        </span>
      </div>
    </div>
  );
}
