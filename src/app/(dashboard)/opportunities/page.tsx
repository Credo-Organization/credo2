import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Briefcase, AlertCircle } from "lucide-react";
import { matchPassportToLiveOpportunities } from "@/lib/matching/opportunity-matcher";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch latest passport
  const { data: passport } = await supabase
    .from("passports")
    .select("snapshot_data")
    .eq("profile_id", user.id)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!passport || !passport.snapshot_data || !passport.snapshot_data.skills) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Matched Opportunities"
          description="Find roles that match your verified skill passport."
          icon={Briefcase}
        />
        <EmptyState
          icon={AlertCircle}
          title="No Passport Found"
          description="You need to generate your Skill Passport before we can match you to opportunities."
        >
          <Link href="/passport">
            <Button>Generate Passport</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }
  let matches: any[] = [];
  let rateLimitHit = false;

  try {
    matches = await matchPassportToLiveOpportunities(passport.snapshot_data);
  } catch (error: any) {
    if (error?.name === "RateLimitError") {
      rateLimitHit = true;
    } else {
      throw error; // Let Next.js error boundary handle other unexpected errors
    }
  }

  if (rateLimitHit) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <PageHeader
          title="Matched Opportunities"
          description="Live roles fetched from LinkedIn that match your verified skill passport."
          icon={Briefcase}
        />
        <EmptyState
          icon={AlertCircle}
          title="API Rate Limit Exceeded"
          description="We are currently experiencing high traffic on the LinkedIn Jobs API. Next.js caching will mitigate this shortly, but for now, please wait a few minutes and try again."
        >
          <Button variant="outline" onClick={() => {}} className="pointer-events-none opacity-50">
            Check Back Soon
          </Button>
        </EmptyState>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader
          title="Matched Opportunities"
          description="Live roles fetched from LinkedIn that match your verified skill passport. Missing skills are highlighted as your career roadmap."
          icon={Briefcase}
        />
        <div className="flex items-center gap-2 text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live Search Active
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {matches.map((result) => (
          <OpportunityCard key={result.opportunity.id} result={result} passportSnapshot={passport.snapshot_data} />
        ))}
        {matches.length === 0 && (
          <div className="text-muted-foreground text-center py-12 col-span-full">
            No opportunities available right now.
          </div>
        )}
      </div>
    </div>
  );
}
