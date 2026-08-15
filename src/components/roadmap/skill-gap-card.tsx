import { CareerGoal } from "@/config/career-goals";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillGapCardProps {
  goal: CareerGoal;
  analysis: {
    acquiredSkills: string[];
    missingSkills: string[];
    alignmentPercentage: number;
  };
}

export function SkillGapCard({ goal, analysis }: SkillGapCardProps) {
  const { acquiredSkills, missingSkills, alignmentPercentage } = analysis;

  return (
    <div className="glass overflow-hidden rounded-3xl border border-border/50 relative shadow-2xl w-full max-w-4xl mx-auto">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header Section */}
      <div className="p-8 pb-6 border-b border-border/40 flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center border-2 border-primary/20 shrink-0 text-3xl">
            {goal.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold tracking-tight">{goal.title}</h2>
            </div>
            <p className="text-muted-foreground font-medium text-sm">{goal.description}</p>
          </div>
        </div>
        
        {/* Alignment Score */}
        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto bg-background/50 p-4 rounded-2xl border border-border/40 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alignment Score</span>
          </div>
          <div className="flex items-end gap-1">
            <span className={cn("text-4xl font-bold tracking-tighter", 
              alignmentPercentage >= 80 ? "text-emerald-500" : 
              alignmentPercentage >= 40 ? "text-amber-500" : "text-destructive"
            )}>
              {alignmentPercentage}%
            </span>
          </div>
          <Progress value={alignmentPercentage} className="h-1.5 w-32 mt-3" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 relative z-10">
        
        {/* Acquired Skills */}
        <div className="p-8 flex flex-col bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-foreground tracking-tight">Acquired Skills</h3>
            <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-none">
              {acquiredSkills.length} Verified
            </Badge>
          </div>
          
          <div className="flex flex-col gap-3">
            {acquiredSkills.length > 0 ? (
              acquiredSkills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <span className="font-medium text-sm text-emerald-700 dark:text-emerald-400 capitalize">{skill.replace("-", " ")}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                No required skills acquired yet.
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-8 flex flex-col bg-destructive/5">
          <div className="flex items-center gap-2 mb-6">
            <XCircle className="w-5 h-5 text-destructive/80" />
            <h3 className="text-base font-semibold text-foreground tracking-tight">Missing Skills</h3>
            <Badge variant="secondary" className="ml-auto bg-destructive/20 text-destructive shadow-none hover:bg-destructive/20 border-none">
              {missingSkills.length} Remaining
            </Badge>
          </div>
          
          <div className="flex flex-col gap-3">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-background/50">
                  <span className="font-medium text-sm text-foreground/80 capitalize">{skill.replace("-", " ")}</span>
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                </div>
              ))
            ) : (
              <div className="text-sm text-emerald-500 font-medium p-4 text-center border border-emerald-500/20 bg-emerald-500/10 rounded-lg">
                All required skills acquired! 🎉
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
