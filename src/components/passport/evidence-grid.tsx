import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillEvidence {
  name: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string[];
}

interface EvidenceGridProps {
  skills: SkillEvidence[];
}

export function EvidenceGrid({ skills }: EvidenceGridProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-8 text-center bg-card/50 rounded-2xl border border-border/50">
        No evidence found to map skills yet. 
        <br /> Connect GitHub or upload certificates.
      </div>
    );
  }

  const confidenceColors = {
    High: "bg-navy-500/10 text-navy-700 border-navy-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div 
          key={index} 
          className="group flex flex-col p-4 bg-card border border-border/50 rounded-xl hover:border-primary/40 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className={cn("w-4 h-4", 
                skill.confidence === "High" ? "text-navy-700" : 
                skill.confidence === "Medium" ? "text-amber-500" : "text-slate-500"
              )} />
              <h4 className="font-semibold text-foreground tracking-tight">{skill.name}</h4>
            </div>
            <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-semibold shadow-none", confidenceColors[skill.confidence])}>
              {skill.confidence} Confidence
            </Badge>
          </div>
          
          <div className="space-y-2 mt-1">
            {skill.evidence.map((ev, i) => (
              <div key={i} className="flex items-start text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-primary/60" />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
