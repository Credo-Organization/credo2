import { UnifiedOnboardingForm } from "@/components/onboarding/unified-form";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/bg-image.png')" }}
      />
      
      {/* White Overlay with 40% opacity */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />
      
      {/* Onboarding Form */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <UnifiedOnboardingForm />
      </div>
    </div>
  );
}

