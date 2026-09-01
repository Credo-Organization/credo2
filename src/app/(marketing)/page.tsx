"use client";

import React from "react";
import { DoodleHeroSection } from "@/components/landing/doodle-hero-section";
import { DoodleProblemSection } from "@/components/landing/doodle-problem-section";
import { DoodleJourneyMap } from "@/components/landing/doodle-journey-map";
import { DoodleFeaturesSection } from "@/components/landing/doodle-features-section";
import { DoodlePassportPreview } from "@/components/landing/doodle-passport-preview";
import { MobileQuickCTA } from "@/components/landing/mobile-quick-cta";

export default function LandingPage() {
  return (
    <main className="w-full bg-[#FAF9F6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors">
      {/* SECTION 1: Exact Pixel-Matched Doodle Hero */}
      <DoodleHeroSection />

      {/* SECTION 2: The Broken Resume Reality (Corkboard Sticky Notes) */}
      <DoodleProblemSection />

      {/* SECTION 3: The Proof Pipeline (Code to Career in 6 Steps) */}
      <DoodleJourneyMap />

      {/* SECTION 4: The Proof Toolbelt (Sketchbook Bento Grid) */}
      <DoodleFeaturesSection />

      {/* SECTION 5: The Authentic Skill Passport (Hand-Stamped Ledger) */}
      <DoodlePassportPreview />

      {/* Floating Quick CTA Dock on Mobile */}
      <MobileQuickCTA />
    </main>
  );
}
