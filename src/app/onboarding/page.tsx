import { UnifiedOnboardingForm } from "@/components/onboarding/unified-form";

export default function OnboardingPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: 'rgb(10, 10, 10)' }}
    >
      <UnifiedOnboardingForm />
    </div>
  );
}
