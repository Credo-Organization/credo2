import { SkillPassportCard, SkillPassportData } from "@/components/dashboard/skill-passport-card";
import { Target, Briefcase, Brain, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GeneratePassportButton } from "@/components/passport/generate-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OpportunityMatcher } from "@/components/dashboard/opportunity-matcher";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let mappedData: SkillPassportData | undefined = undefined;

  if (user) {
    const [{ data: passport }, { data: certs }] = await Promise.all([
      supabase
        .from("passports")
        .select("snapshot_data")
        .order('generated_at', { ascending: false })
        .limit(1),
      supabase
        .from("certificates")
        .select("title, issuer, file_url")
        .eq("profile_id", user.id)
    ]);

    if (passport && passport.length > 0 && passport[0].snapshot_data) {
      const snap = passport[0].snapshot_data;
      
      // Compute dynamic heatmap logic
      const totalRepos = snap.github?.total_repos || 0;
      let heatmap;
      if (totalRepos === 0) {
        heatmap = Array(7).fill(0).map(() => Array(52).fill(0));
      } else {
        heatmap = Array(7).fill(0).map((_, r) => Array(52).fill(0).map((_, c) => (r * 7 + c * 13) % Math.min(5, totalRepos + 1)));
      }

      mappedData = {
        name: snap.profile?.name || "Unknown",
        gender: "Developer",
        careerGoal: snap.profile?.headline || "Software Engineer",
        profileImage: "https://github.com/shadcn.png",
        verifiedSkills: (snap.skills || []).map((s: any) => ({
          name: s.name,
          confidence: s.confidence,
        })),
        githubRepos: snap.github?.total_repos || 0,
        certificates: snap.certificates || 0,
        verifiedSkillsCount: (snap.skills || []).length,
        missingSkills: 0,
        missingSkillsAnalysis: {
          description: snap.insights?.gap_analysis_text || "Keep building to unlock gap analysis.",
          recommendedTechStack: snap.insights?.recommended_tech_stack || ["PostgreSQL", "Go", "Docker", "GraphQL"],
          suggestedProjects: snap.insights?.suggested_projects || [
            {
              name: "Real-time Collaboration Workspace",
              description: "Build using React, Go WebSockets, and PostgreSQL to master full-stack state and concurrency."
            },
            {
              name: "Microservices E-Commerce API",
              description: "Dockerize independent Go services (auth, inventory, payments) to learn container orchestration."
            },
            {
              name: "GraphQL Analytics Dashboard",
              description: "Aggregate complex data via GraphQL into a modern Tailwind dashboard."
            }
          ]
        },
        githubHeatmap: heatmap,
        evidence: {
          githubRepos: (snap.top_projects || []).map((p: any) => ({
            name: p.name,
            url: p.url || "#",
            language: p.language || "Unknown",
            stars: p.stars || 0
          })),
          certificates: (certs || []).map((c: any) => ({
            name: c.title,
            issuer: c.issuer || "Unknown Issuer",
            url: c.file_url || "#"
          }))
        }
      };
    }
  }

  if (!mappedData) {
    let hasGithubConnection = false;
    if (user) {
      const { data: connection } = await supabase
        .from("github_connections")
        .select("id")
        .eq("profile_id", user.id)
        .single();
      if (connection) hasGithubConnection = true;
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-foreground/[0.02] blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="glass overflow-hidden rounded-[24px] border border-white/[0.05] relative shadow-2xl w-full max-w-2xl mx-auto p-12 text-center z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <UserCircle className="w-10 h-10 text-white/60" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Dashboard Empty</h2>
          <p className="text-white/60 max-w-md mx-auto text-lg leading-relaxed mb-8">
            You need to generate an AI Skill Passport before we can analyze your profile.
          </p>
          <div className="flex justify-center gap-4">
            {hasGithubConnection ? (
              <GeneratePassportButton />
            ) : (
              <Link href="/settings">
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

  return (
    <div className="w-full min-h-full flex items-start justify-start pl-8 relative gap-6 lg:gap-10 py-12">
      {/* LEFT: Passport Card */}
      <div className="transform scale-[0.75] xl:scale-[0.85] 2xl:scale-90 origin-top-left transition-transform duration-300 flex-shrink-0 sticky top-12">
        <SkillPassportCard data={mappedData} />
      </div>

      {/* RIGHT: Skill Gap Analysis */}
      <div className="flex-1 max-w-[440px] hidden lg:flex flex-col justify-start gap-8 pr-8 pb-12">
        
        {/* Section 1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Brain className="w-4 h-4 text-white/40" />
            <h3 className="text-[12px] font-bold tracking-widest text-white/50 uppercase">
              Skill Gap Analysis
            </h3>
          </div>
          <div>
            <p className="text-[15px] text-white/70 leading-relaxed font-medium">
              {mappedData?.missingSkillsAnalysis?.description || "Keep building to unlock gap analysis."}
            </p>
          </div>
        </div>
        
        {/* Section 2 */}
        <div className="flex flex-col gap-4 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-white/40" />
            <h3 className="text-[12px] font-bold tracking-widest text-white/50 uppercase">
              Recommended Tech Stack
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(mappedData?.missingSkillsAnalysis?.recommendedTechStack || []).map((tech: string) => (
              <span key={tech} className="px-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-[13px] text-white/90 font-medium tracking-wide">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col gap-4 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-white/40" />
            <h3 className="text-[12px] font-bold tracking-widest text-white/50 uppercase">
              Suggested Projects
            </h3>
          </div>
          <div className="flex flex-col gap-5 mt-2">
            {(mappedData?.missingSkillsAnalysis as any)?.suggestedProjects?.map((proj: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-2 p-4 rounded-[16px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 group-hover:bg-white/30 transition-colors" />
                <span className="text-[14px] text-white font-semibold tracking-tight">{proj.name}</span>
                <span className="text-[13px] text-white/60 leading-relaxed">{proj.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Opportunity Matcher */}
        <div className="pt-6 border-t border-white/[0.06]">
          <OpportunityMatcher />
        </div>

      </div>
    </div>
  );
}
