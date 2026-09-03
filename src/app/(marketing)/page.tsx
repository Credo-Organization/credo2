"use client";

import React from "react";
import { DoodleHeroSection } from "@/components/landing/doodle-hero-section";
import { DoodleEcosystemRibbon } from "@/components/landing/doodle-ecosystem-ribbon";
import { DoodleProblemSection } from "@/components/landing/doodle-problem-section";
import { DoodleProofComparison } from "@/components/landing/doodle-proof-comparison";
import { DoodleJourneyMap } from "@/components/landing/doodle-journey-map";
import { DoodleFeaturesSection } from "@/components/landing/doodle-features-section";
import { DoodlePassportPreview } from "@/components/landing/doodle-passport-preview";
import { DoodleTestimonials } from "@/components/landing/doodle-testimonials";
import { DoodleFAQSection } from "@/components/landing/doodle-faq-section";
import { MobileQuickCTA } from "@/components/landing/mobile-quick-cta";

export default function LandingPage() {
  return (
    <main className="w-full bg-[#FAF9F6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors">
      {/* SECTION 1: Exact Pixel-Matched Doodle Hero */}
      <DoodleHeroSection />

      {/* SECTION 2: Trust & Ecosystem Ribbon (Institutions & Networks) */}
      <DoodleEcosystemRibbon />

      {/* SECTION 3: The Broken Resume Reality (Corkboard Sticky Notes) */}
      <DoodleProblemSection />

      {/* SECTION 4: Interactive Resume vs. Cryptographic Passport Comparison */}
      <DoodleProofComparison />

      {/* SECTION 5: The Proof Pipeline (Code to Career in 6 Steps) */}
      <DoodleJourneyMap />

      {/* SECTION 6: The Proof Toolbelt (Sketchbook Bento Grid) */}
      <DoodleFeaturesSection />

      {/* SECTION 7: The Authentic Skill Passport (Hand-Stamped Ledger) */}
      <DoodlePassportPreview />

      {/* SECTION 8: Polaroid Student & Recruiter Testimonials */}
      <DoodleTestimonials />

      {/* SECTION 9: Interactive FAQ Accordion */}
      <DoodleFAQSection />

      {/* Floating Quick CTA Dock on Mobile */}
      <MobileQuickCTA />
    </main>
  );
}
