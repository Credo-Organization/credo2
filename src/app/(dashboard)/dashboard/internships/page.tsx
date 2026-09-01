import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { matchPassportToLiveOpportunities } from "@/lib/matching/opportunity-matcher";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { GeneratePassportButton } from "@/components/passport/generate-button";
import { InternshipsClientHub } from "@/components/opportunities/internships-client-hub";

export default async function InternshipsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

        <div className="glass overflow-hidden rounded-[24px] border border-stone-200 relative shadow-2xl w-full max-w-2xl mx-auto p-12 text-center z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Briefcase className="w-10 h-10 text-stone-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-3">No Passport Found</h2>
          <p className="text-stone-500 max-w-md mx-auto text-lg leading-relaxed mb-8">
            You need an AI-generated Skill Passport to unlock personalized internship matches.
          </p>
          <div className="flex justify-center gap-4">
            {hasGithubConnection ? (
              <GeneratePassportButton />
            ) : (
              <Link href="/dashboard/settings">
                <Button
                  variant="outline"
                  className="border-stone-200 text-stone-900 hover:bg-stone-50 rounded-full px-6 bg-transparent"
                >
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
    <div className="w-full min-h-full p-6 sm:p-10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-navy-500/[0.03] blur-[120px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900">
              Internship Opportunities
            </h1>

          </div>


        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-sm font-medium glass backdrop-blur-md">
            {errorMsg}
          </div>
        )}

        {/* Client Hub with Realtime Filtering, Search, 4-Pillar Radar and Recruiter Preview */}
        <InternshipsClientHub
          initialResults={matchResults}
          passportSnapshot={passport.snapshot_data}
        />
      </div>
    </div>
  );
}
