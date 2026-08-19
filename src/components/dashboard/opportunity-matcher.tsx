"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { matchOpportunity, checkMatchJobStatus } from "@/actions/matcher";

export function OpportunityMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (jobId && (status === "pending" || status === "processing")) {
      interval = setInterval(async () => {
        const res = await checkMatchJobStatus(jobId);
        
        if (res.error) {
          setError(res.error);
          setStatus("failed");
          clearInterval(interval);
          return;
        }

        setStatus(res.status);

        if (res.status === "completed") {
          setResult({
            match_score: res.match_score,
            gap_analysis: res.gap_analysis,
            explainable_text: res.explainable_text,
          });
          clearInterval(interval);
        } else if (res.status === "failed") {
          setError(res.error_message || "Match failed.");
          clearInterval(interval);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;
    
    setError(null);
    setResult(null);
    setStatus("pending");
    
    const res = await matchOpportunity(jobDescription);
    if (res.error) {
      setError(res.error);
      setStatus("failed");
      return;
    }

    setJobId(res.jobId);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Opportunity Matcher</h2>
          <p className="text-sm text-zinc-400">Compare your AI Passport against a real job description.</p>
        </div>
      </div>

      <Textarea 
        placeholder="Paste an internship or job description here..."
        className="min-h-[120px] mb-4 bg-white/[0.02] border-white/10 text-white focus-visible:ring-white/20 placeholder:text-zinc-600"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        disabled={status === "pending" || status === "processing"}
      />

      <Button 
        onClick={handleMatch}
        disabled={!jobDescription.trim() || status === "pending" || status === "processing"}
        className="w-full bg-white text-black hover:bg-zinc-200 h-11 font-medium"
      >
        {(status === "pending" || status === "processing") ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Profile...
          </>
        ) : "Evaluate Match"}
      </Button>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 flex gap-3 text-red-900 text-sm">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {result && status === "completed" && (
        <div className="mt-6 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <span className="font-medium text-zinc-300">Match Score</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${result.match_score > 70 ? 'text-green-400' : 'text-amber-400'}`}>
                {result.match_score}%
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-zinc-200 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              Verdict
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {result.explainable_text}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-zinc-200 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-400" />
              Gap Analysis
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {result.gap_analysis}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
