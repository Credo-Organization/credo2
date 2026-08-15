"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generatePassport } from "@/actions/passport";
import { toast } from "sonner";

export function GeneratePassportButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await generatePassport();
      toast.success("Skill Passport generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate passport.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2 h-11 px-8 text-base">
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Analyzing Evidence...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          Generate My Passport
        </>
      )}
    </Button>
  );
}
