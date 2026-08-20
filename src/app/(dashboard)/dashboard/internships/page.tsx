import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { matchPassportToLiveOpportunities } from "@/lib/matching/opportunity-matcher";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GeneratePassportButton } from "@/components/passport/generate-button";

export default async function InternshipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's latest passport
  const { data: passportData } = await supabase
    .from("passports")
    .select("*")
    .eq("profile_id", user.id)
    .order("generated_at", { ascending: false })
    .limit(1);

  const passport = passportData?.[0];

  let hasGithubConnection = false;
  if (!passport || !passport.snapshot_data) {
    const { data: connection } = await supabase
      .from("github_connections")
      .select("id")
      .eq("profile_id", user.id)
      .single();
      
    if (connection) {
      hasGithubConnection = true;
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-foreground/[0.02] blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="glass overflow-hidden rounded-[24px] border border-white/[0.05] relative shadow-2xl w-full max-w-2xl mx-auto p-12 text-center z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Briefcase className="w-10 h-10 text-white/60" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">No Passport Found</h2>
          <p className="text-white/60 max-w-md mx-auto text-lg leading-relaxed mb-8">
            You need an AI-generated Skill Passport to unlock personalized internship matches. 
          </p>
          <div className="flex justify-center gap-4">
            {hasGithubConnection ? (
              <GeneratePassportButton />
            ) : (
              <Link href="/dashboard/settings">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full px-6 bg-transparent">
                  Connect GitHub
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Run the matching algorithm
  let matchResults: any[] = [];
  let errorMsg = null;
  try {
    matchResults = await matchPassportToLiveOpportunities(passport.snapshot_data);
  } catch (error: any) {
    errorMsg = "Failed to generate AI opportunities. Please try again later.";
  }

  return (
    <div className="w-full min-h-full p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/[0.02] blur-[100px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/[0.02] blur-[100px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">Internship Matches</h1>
          <p className="text-white/60">Personalized opportunities based on your Skill Passport gap analysis.</p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-sm font-medium glass backdrop-blur-md">
            {errorMsg}
          </div>
        )}

        {matchResults.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl glass shadow-2xl">
            <p className="text-white/50 text-lg">No matches found for your current skill profile. Try adding more skills!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {matchResults.map((result, i) => (
              <div key={result.opportunity.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <OpportunityCard 
                  result={result} 
                  passportSnapshot={passport.snapshot_data} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
