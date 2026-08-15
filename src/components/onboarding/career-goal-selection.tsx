"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { careerGoals } from "@/config/career-goals";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { completeOnboarding } from "@/actions/onboarding";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function CareerGoalSelection() {
  const { personalInfo, careerGoalSlug, setCareerGoalSlug, setStep } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!careerGoalSlug) {
      toast.error("Please select a career goal");
      return;
    }
    
    if (!personalInfo) {
      toast.error("Personal information is missing");
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      await completeOnboarding(personalInfo, careerGoalSlug);
      toast.success("Profile setup complete!");
      // Redirect to dashboard after onboarding completed
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile. Please try again.");
      console.error("Onboarding error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Choose your Career Goal</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Select the role you are aiming for. We will generate a roadmap based on this.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {careerGoals.map((goal) => (
          <button
            key={goal.slug}
            type="button"
            onClick={() => setCareerGoalSlug(goal.slug)}
            className={cn(
              "flex flex-col text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              careerGoalSlug === goal.slug
                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary"
                : "bg-card border-border/60 hover:border-border hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{goal.icon}</span>
              <span className="font-semibold">{goal.title}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {goal.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          disabled={isSubmitting}
          className="h-11 w-full sm:w-auto px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!careerGoalSlug || isSubmitting}
          className="h-11 flex-1 gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              Complete Setup
              <Target className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
