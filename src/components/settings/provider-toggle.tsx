"use client";

import { useState, useTransition } from "react";
import { setAiProvider } from "@/actions/settings";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ProviderToggle({ initialProvider }: { initialProvider: "gemini" | "xai" }) {
  const [provider, setProvider] = useState<"gemini" | "xai">(initialProvider);
  const [isPending, startTransition] = useTransition();

  const handleProviderChange = (value: "gemini" | "xai") => {
    setProvider(value);
    startTransition(async () => {
      try {
        await setAiProvider(value);
        toast.success(`AI Provider updated to ${value === "gemini" ? "Google Gemini 2.5" : "Grok 2 (xAI)"}`);
      } catch (error) {
        toast.error("Failed to update AI provider.");
        setProvider(initialProvider); // Revert
      }
    });
  };

  return (
    <div className="space-y-4">
      <RadioGroup 
        value={provider} 
        onValueChange={handleProviderChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2 border border-border/50 rounded-xl p-4 transition-all hover:bg-muted/50 has-[:checked]:bg-primary/5 has-[:checked]:border-primary/30">
          <RadioGroupItem value="gemini" id="gemini" className="sr-only" />
          <Label 
            htmlFor="gemini" 
            className="flex-1 cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="font-medium text-foreground">Google Gemini 2.5</p>
              <p className="text-sm text-muted-foreground">Fast and reliable baseline model.</p>
            </div>
            {isPending && provider === "gemini" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {provider === "gemini" && !isPending && (
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </Label>
        </div>

        <div className="flex items-center space-x-2 border border-border/50 rounded-xl p-4 transition-all hover:bg-muted/50 has-[:checked]:bg-primary/5 has-[:checked]:border-primary/30">
          <RadioGroupItem value="xai" id="xai" className="sr-only" />
          <Label 
            htmlFor="xai" 
            className="flex-1 cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="font-medium text-foreground">Grok 2 (xAI)</p>
              <p className="text-sm text-muted-foreground">Advanced logic and extraction.</p>
            </div>
            {isPending && provider === "xai" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {provider === "xai" && !isPending && (
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
