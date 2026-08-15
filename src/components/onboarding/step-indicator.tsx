import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Career Goal" },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-sm mx-auto mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Circle */}
          <div className="relative flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                currentStep > step.number
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === step.number
                  ? "bg-background border-primary text-primary"
                  : "bg-background border-border text-muted-foreground"
              )}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-semibold text-sm">{step.number}</span>
              )}
            </div>
            {/* Label */}
            <span
              className={cn(
                "absolute top-12 text-xs font-medium whitespace-nowrap",
                currentStep >= step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          </div>

          {/* Line separator */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-24 h-[2px] mx-2 transition-colors duration-300",
                currentStep > step.number ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
