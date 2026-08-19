import { MatchResult } from "@/lib/matching/opportunity-matcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, MapPin, Building, Clock, ChevronRight, Sparkles } from "lucide-react";
import { AiCoachInsight } from "./ai-coach-insight";
import { cn } from "@/lib/utils";

export function OpportunityCard({ result, passportSnapshot }: { result: MatchResult, passportSnapshot: any }) {
  const { opportunity, matchScore, matchedSkills, missingSkills } = result;
  
  const isMatch = matchScore >= 75;

  return (
    <div className={cn(
      "glass overflow-hidden rounded-3xl border relative shadow-2xl transition-all duration-500 hover:-translate-y-1 group flex flex-col h-full",
      isMatch 
        ? "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-emerald-500/20" 
        : "border-white/[0.05] hover:border-white/10 hover:shadow-white/5"
    )}>
      {/* Dynamic Backgrounds */}
      {isMatch && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-50" />
        </>
      )}
      {!isMatch && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
      )}

      {/* Header */}
      <div className="p-8 pb-6 border-b border-white/[0.05] relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white leading-tight">{opportunity.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/50">
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                <Building className="w-3.5 h-3.5" /> {opportunity.org_name}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                <MapPin className="w-3.5 h-3.5" /> {opportunity.location}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                <Clock className="w-3.5 h-3.5" /> {opportunity.duration}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end md:text-right shrink-0">
            <div className="relative flex items-center justify-center w-16 h-16">
              {/* Circular Progress Background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle 
                  cx="32" cy="32" r="28" fill="none" 
                  stroke={isMatch ? "#10b981" : "rgba(255,255,255,0.4)"} 
                  strokeWidth="6" 
                  strokeDasharray="175" 
                  strokeDashoffset={175 - (175 * matchScore) / 100}
                  className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <span className={cn(
                "absolute text-lg font-bold tracking-tighter",
                isMatch ? "text-emerald-400" : "text-white"
              )}>
                {matchScore}<span className="text-xs">%</span>
              </span>
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-2">Match</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 space-y-8 flex-1 relative z-10 flex flex-col">
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
          {opportunity.description}
        </p>

        <div className="space-y-6 flex-1">
          {/* Matched Skills */}
          {matchedSkills.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold mb-3 flex items-center gap-2 text-white/50 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Skills ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="secondary" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 font-medium px-3 py-1 text-xs">
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold mb-3 flex items-center gap-2 text-white/50 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                Missing Requirements ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="outline" className="border-rose-500/20 bg-rose-500/5 text-rose-300 font-normal px-3 py-1 text-xs">
                    {skill.skill_name}
                    {skill.is_critical && <span className="ml-1 text-rose-500">*</span>}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* AI Coach Insight */}
        <div className="pt-6 border-t border-white/[0.05]">
          <AiCoachInsight result={result} passportSnapshot={passportSnapshot} />
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-white/[0.02] border-t border-white/[0.05] relative z-10 mt-auto">
        <Button 
          className={cn(
            "w-full rounded-xl h-12 text-sm font-semibold transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
            isMatch 
              ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
              : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
          )}
        >
          {isMatch ? (
            <>Apply with Passport <ChevronRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" /></>
          ) : (
            <>Unlock by learning missing skills <Lock className="w-4 h-4 ml-2 opacity-50" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
