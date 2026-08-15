"use client";

import { useOnboardingStore } from "@/stores/onboarding-store";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { PersonalInfoForm } from "@/components/onboarding/personal-info-form";
import { CareerGoalSelection } from "@/components/onboarding/career-goal-selection";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background bg-grid">
      <div className="w-full max-w-xl mx-auto glass rounded-2xl p-6 sm:p-10 shadow-2xl relative z-10">
        <StepIndicator currentStep={step} />
        
        {step === 1 && <PersonalInfoForm />}
        {step === 2 && <CareerGoalSelection />}
      </div>
      <div className="glow fixed inset-0 pointer-events-none -z-10 opacity-60" />
    </div>
  );
}
