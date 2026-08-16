"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mt-4 pt-4 border-t border-border/50">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAskCoach}
        className="w-full flex items-center justify-between text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30 border-indigo-500/20"
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
        <Card className="mt-4 bg-indigo-950/10 border-indigo-500/20 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <CardContent className="p-4 relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6 text-indigo-400/70 space-y-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <p className="text-sm font-medium animate-pulse">Analyzing semantic match...</p>
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <div className="prose prose-sm prose-invert prose-indigo max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h3 className="text-lg font-bold text-indigo-300 mt-0" {...props} />,
                    h2: ({node, ...props}) => <h4 className="text-md font-semibold text-indigo-300 mt-4 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h5 className="text-sm font-semibold text-indigo-300 mt-3 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed mb-3" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-muted-foreground space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-indigo-200 font-semibold" {...props} />,
                  }}
                >
                  {insight || ""}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
