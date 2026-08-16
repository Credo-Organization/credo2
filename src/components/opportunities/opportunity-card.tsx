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
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${isMatch ? 'border-primary/50' : 'border-border/50'}`}>
      {/* Decorative gradient for high matches */}
      {isMatch && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400" />
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
            <span className={`text-3xl font-bold ${matchScore >= 80 ? 'text-emerald-500' : matchScore >= 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {matchScore}%
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Match Score</span>
          </div>
        </div>
        <Progress value={matchScore} className={`h-2 mt-4 ${matchScore >= 80 ? '[&>div]:bg-emerald-500' : matchScore >= 50 ? '[&>div]:bg-amber-500' : ''}`} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {opportunity.description}
        </p>

        <div className="space-y-4">
          {/* Matched Skills */}
          {matchedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Skills ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills (Gap Analysis) */}
          {missingSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Missing Requirements ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="outline" className="border-dashed text-muted-foreground">
                    {skill.skill_name}
                    {skill.is_critical && <span className="ml-1 text-destructive">*</span>}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Elite Module 8: AI Coach RAG Insight */}
        <AiCoachInsight result={result} passportSnapshot={passportSnapshot} />
      </CardContent>
      
      <CardFooter className="bg-muted/30 border-t pt-4">
        <Button className="w-full" variant={isMatch ? "default" : "secondary"}>
          {isMatch ? "Apply with Passport" : "Unlock by learning missing skills"}
        </Button>
      </CardFooter>
    </Card>
  );
}
