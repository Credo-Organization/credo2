import { UnifiedOnboardingForm } from "@/components/onboarding/unified-form";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[#FAF9F6] text-zinc-900 overflow-x-hidden select-none">
      {/* ── Background Architectural Dot Grid ── */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Top Bar with Brand & Security Badge ── */}
      <header className="w-full max-w-5xl px-4 py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform shadow-xs">
            M
          </div>
          <span className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors">
            Minskey
          </span>
          <span className="font-doodle text-base sm:text-lg font-bold text-blue-600 -rotate-1 hidden sm:inline">
            • Student Onboarding
          </span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>W3C Verifiable Credentials</span>
        </div>
      </header>

      {/* ── Main Onboarding Form Container ── */}
      <main className="relative z-10 w-full flex items-center justify-center py-6 flex-1">
        <UnifiedOnboardingForm />
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-xs text-zinc-600 font-medium z-10">
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            100% Student Code Privacy
          </span>
          <span>•</span>
          <span>AI AST Syntax Audits</span>
          <span>•</span>
          <span>Anti-Plagiarism Protection</span>
        </div>
      </footer>
    </div>
  );
}
