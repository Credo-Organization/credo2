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
      
      if (!res.job_id) {
        throw new Error("No job ID returned.");
      }

      // Poll every 2 seconds
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await checkJobStatus(res.job_id);
          
          if (statusRes.status === "completed") {
            clearInterval(pollInterval);
            setIsGenerating(false);
            toast.success("Skill Passport generated successfully!");
            router.refresh();
          } else if (statusRes.status === "failed") {
            clearInterval(pollInterval);
            setIsGenerating(false);
            toast.error(statusRes.error_message || "Passport generation failed.");
          }
        } catch (err) {
          console.error("Polling error:", err);
          clearInterval(pollInterval);
          setIsGenerating(false);
          toast.error("Failed to check job status.");
        }
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate generation.");
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
