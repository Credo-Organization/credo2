import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSkillGapAnalysis } from "@/actions/roadmap";
import { SkillGapCard } from "@/components/roadmap/skill-gap-card";
import { InteractiveTimeline } from "@/components/roadmap/interactive-timeline";
import { createClient } from "@/lib/supabase/server";

export default async function RoadmapPage() {
  const data = await getSkillGapAnalysis();
  
  // Fetch passport to see if roadmap already exists
  let roadmapData = null;
  let passportId = null;
  if (data?.hasPassport) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: passport } = await supabase
        .from("passports")
        .select("id, snapshot_data")
        .eq("profile_id", user.id)
        .order("version", { ascending: false })
        .limit(1)
        .single();
      
      if (passport) {
        passportId = passport.id;
      }
      
      if (passport?.snapshot_data?.roadmap) {
        roadmapData = passport.snapshot_data.roadmap;
      }
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Roadmap"
        description="Your personalized learning path based on skill gap analysis."
        icon={Map}
      />
      
      {!data || !data.hasPassport ? (
        <EmptyState
          icon={Map}
          title="No roadmap yet"
          description={!data ? "Select a career goal in your settings to get started." : "Generate your skill passport first, then get a personalized career roadmap."}
        >
          {!data ? (
            <Link href="/onboarding">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Select Career Goal
              </Button>
            </Link>
          ) : (
            <Link href="/passport">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Passport
              </Button>
            </Link>
          )}
        </EmptyState>
      ) : (
        <div className="animate-fade-in-up">
          <SkillGapCard goal={data.targetGoal} analysis={data.analysis!} />
          
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-6">AI-Powered Curriculum</h3>
            <InteractiveTimeline 
              roadmapData={roadmapData}
              goalTitle={data.targetGoal.title}
              missingSkills={data.analysis!.missingSkills}
              passportId={passportId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
