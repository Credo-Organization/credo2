"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Rocket, Code2, Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useObject } from "@ai-sdk/react";
import { z } from "zod";

const roadmapSchema = z.object({
  learningOrder: z.array(z.object({
    step: z.number(),
    skill: z.string(),
    description: z.string()
  })),
  suggestedProject: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string())
  })
});


interface InteractiveTimelineProps {
  roadmapData: any;
  goalTitle: string;
  missingSkills: string[];
  passportId?: string;
}

export function InteractiveTimeline({ roadmapData: initialRoadmapData, goalTitle, missingSkills, passportId }: InteractiveTimelineProps) {
  
  const { submit, isLoading, object, error } = useObject({
    api: '/api/roadmap',
    schema: roadmapSchema,
    onError: (err) => {
      toast.error(err.message || "Failed to generate roadmap.");
    },
    onFinish: () => {
      toast.success("AI Roadmap generated successfully!");
    }
  });

  const handleGenerate = () => {
    submit({ goalTitle, missingSkills, passportId });
  };

  // Use the streaming object if it exists, otherwise fall back to the initial data
  const roadmapData = object || initialRoadmapData;

  if (!roadmapData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card/40 border border-dashed border-border/60 rounded-3xl text-center">
        <Sparkles className="w-10 h-10 text-emerald-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Generate AI Curriculum</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          Ready to bridge your skill gap? We&apos;ll use Google Gemini to generate a personalized, step-by-step learning path and a custom capstone project designed for you.
        </p>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || missingSkills.length === 0}
          className="gap-2 h-11 px-8 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating Path...</>
          ) : (
            <><Rocket className="w-5 h-5" /> Generate My Roadmap</>
          )}
        </Button>
        {missingSkills.length === 0 && (
          <p className="text-xs text-muted-foreground mt-4">You have acquired all required skills! No roadmap needed.</p>
        )}
      </div>
    );
  }

  const { learningOrder, suggestedProject } = roadmapData;
  
  // Provide safe defaults while streaming
  const safeLearningOrder = learningOrder || [];
  const safeSuggestedProject = suggestedProject || { title: "Drafting Project...", description: "", features: [] };

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      {/* Timeline Steps */}
      <div className="relative border-l-2 border-primary/20 ml-6 md:ml-10 mb-12 space-y-12">
        {safeLearningOrder.map((item: any, i: number) => (
          <div key={i} className="relative pl-8 md:pl-12 group">
            {/* Timeline Node */}
            <div className="absolute w-8 h-8 bg-background border-2 border-primary rounded-full -left-[17px] flex items-center justify-center top-0 shadow-sm shadow-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <span className="text-xs font-bold">{item.step}</span>
            </div>
            
            <Card className="p-6 bg-card/60 hover:bg-card hover:border-primary/40 transition-colors border-border/50">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  {item.skill}
                </h4>
                <Badge variant="outline" className="shrink-0 bg-background/50">Next Step</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          </div>
        ))}
      </div>

      {/* Capstone Project Card */}
      <div className="relative mt-16 pt-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
            Capstone Project
          </Badge>
        </div>
        
        <Card className="glass overflow-hidden border-border/50 p-0 rounded-3xl shadow-xl">
          <div className="bg-primary/5 p-8 border-b border-border/40 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Code2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{safeSuggestedProject.title}</h3>
            <p className="text-muted-foreground">{safeSuggestedProject.description}</p>
          </div>
          
          <div className="p-8 bg-card/40">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Key Features to Build
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {safeSuggestedProject.features?.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border/40">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
