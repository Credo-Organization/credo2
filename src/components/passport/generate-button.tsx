"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generatePassport, checkJobStatus } from "@/actions/passport";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GeneratePassportButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await generatePassport();
      
      if (res.success) {
        toast.success("Skill Passport generated successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Passport generation failed.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate generation.");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2 h-11 px-8 text-base">
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Building Passport...
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
