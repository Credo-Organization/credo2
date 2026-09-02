import { UnifiedOnboardingForm } from "@/components/onboarding/unified-form";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-3.5 sm:p-8 bg-[#FAF9F6] text-zinc-900 overflow-y-auto touch-scroll select-none">
      {/* ── Background Architectural Dot Grid ── */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(#D4D4D8 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />



      {/* ── Main Onboarding Form Container ── */}
      <main className="relative z-10 w-full flex items-center justify-center py-6 flex-1">
        <UnifiedOnboardingForm />
      </main>


    </div>
  );
}
