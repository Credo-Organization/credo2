import { MatchResult } from "@/lib/matching/opportunity-matcher";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, MapPin, Building, Clock } from "lucide-react";
import { AiCoachInsight } from "./ai-coach-insight";

export function OpportunityCard({ result, passportSnapshot }: { result: MatchResult, passportSnapshot: any }) {
  const { opportunity, matchScore, matchedSkills, missingSkills } = result;
  
  const isMatch = matchScore >= 75;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-md border border-border group ${isMatch ? 'hover:border-zinc-400' : ''}`}>
      {/* Black top border indicator for high matches instead of colored gradient */}
      {isMatch && (
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900" />
      )}
      
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <CardTitle className="text-xl font-bold">{opportunity.title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {opportunity.org_name}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {opportunity.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {opportunity.duration}</span>
            </CardDescription>
          </div>
          
          <div className="flex flex-col items-start md:items-end md:text-right shrink-0">
            <span className="text-4xl font-extrabold tracking-tight text-zinc-900">
              {matchScore}%
            </span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Match Score</span>
          </div>
        </div>
        <Progress value={matchScore} className="h-2 mt-5 bg-zinc-100 border border-zinc-200 [&>div]:bg-zinc-900 [&>div]:transition-all [&>div]:duration-1000" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {opportunity.description}
        </p>

        <div className="space-y-4">
          {/* Matched Skills */}
          {matchedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-zinc-900 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-zinc-900" />
                Verified Skills ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="secondary" className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-zinc-200 font-medium">
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills (Gap Analysis) */}
          {missingSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-zinc-500 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-zinc-500" />
                Missing Requirements ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="outline" className="border-dashed border-zinc-300 text-zinc-500 font-normal">
                    {skill.skill_name}
                    {skill.is_critical && <span className="ml-1 font-bold text-zinc-900">*</span>}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Elite Module 8: AI Coach RAG Insight */}
        <AiCoachInsight result={result} passportSnapshot={passportSnapshot} />
      </CardContent>
      
      <CardFooter className="bg-zinc-50 border-t border-border pt-4">
        <Button 
          className={isMatch ? "w-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm" : "w-full bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900"} 
          variant={isMatch ? "default" : "outline"}
        >
          {isMatch ? "Apply with Passport" : "Unlock by learning missing skills"}
        </Button>
      </CardFooter>
    </Card>
  );
}
