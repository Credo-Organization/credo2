"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Bot, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateCoachingInsight } from "@/actions/ai-coach";
import { MatchResult } from "@/lib/matching/opportunity-matcher";

export function AiCoachInsight({ result, passportSnapshot }: { result: MatchResult, passportSnapshot: any }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskCoach = async () => {
    if (insight) {
      setIsOpen(!isOpen);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsOpen(true);
      const generatedInsight = await generateCoachingInsight(passportSnapshot, result.opportunity);
      setInsight(generatedInsight);
    } catch (err) {
      setError("The AI Coach is currently unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleAskCoach}
        className="w-full flex items-center justify-between text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Bot className="w-4 h-4" />
          {insight ? "View AI Coach Analysis" : "Ask AI Coach for Match Analysis"}
        </span>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          insight && (isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)
        )}
      </Button>

      {isOpen && (
        <div className="mt-4 glass bg-emerald-500/5 border border-emerald-500/20 rounded-xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-5 relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-emerald-400/70 space-y-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <p className="text-sm font-medium animate-pulse tracking-wide">Analyzing semantic match...</p>
              </div>
            ) : error ? (
              <p className="text-sm text-rose-400 font-medium">{error}</p>
            ) : (
              <div className="prose prose-sm prose-invert prose-emerald max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h3 className="text-lg font-bold text-emerald-300 mt-0" {...props} />,
                    h2: ({node, ...props}) => <h4 className="text-md font-semibold text-emerald-300 mt-4 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h5 className="text-sm font-semibold text-emerald-300 mt-3 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="text-white/70 leading-relaxed mb-3" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-white/60 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-emerald-200 font-semibold" {...props} />,
                  }}
                >
                  {insight || ""}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
