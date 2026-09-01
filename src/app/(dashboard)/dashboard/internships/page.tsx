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

        <div className="bg-white dark:bg-zinc-900 overflow-hidden rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[6px_6px_0px_0px_#18181B] dark:shadow-[6px_6px_0px_0px_#000000] w-full max-w-2xl mx-auto p-12 text-center z-10 transition-colors">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-zinc-900 dark:border-zinc-700 shadow-xs">
            <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 mb-3">No Passport Found</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto text-base leading-relaxed mb-8 font-medium">
            You need an AI-generated Skill Passport to unlock personalized internship matches.
          </p>
          <div className="flex justify-center gap-4">
            {hasGithubConnection ? (
              <GeneratePassportButton />
            ) : (
              <Link href="/dashboard/settings">
                <Button
                  variant="outline"
                  className="border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl px-6 h-11 font-black shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] bg-white dark:bg-zinc-800 cursor-pointer transition-all"
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
      {/* Decorative Background Elements - absolute positioning prevents expensive continuous GPU repaints on scroll */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-navy-500/[0.025] blur-3xl rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.025] blur-3xl rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100">
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
