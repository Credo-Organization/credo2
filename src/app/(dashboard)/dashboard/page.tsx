import { SkillPassportCard, SkillPassportData } from "@/components/dashboard/skill-passport-card";
import { DashboardViewSwitcher } from "@/components/dashboard/dashboard-view-switcher";
import { AuditBreakdownPanel, RepoItem, LanguageScore, CertificateItem } from "@/components/dashboard/audit-breakdown-panel";
import { Target, Briefcase, Brain, UserCircle, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GeneratePassportButton } from "@/components/passport/generate-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardInternshipPreviewCard } from "@/components/dashboard/internship-preview-card";
import { DashboardProofHUD } from "@/components/dashboard/proof-hud";
import { generatePassport } from "@/actions/passport";
import { agreementFromVotes } from "@/lib/ai/agreement";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let mappedData: SkillPassportData | undefined = undefined;
  let studentPassportData: any = undefined;
  let repoItems: RepoItem[] = [];
  let languageScores: LanguageScore[] = [];
  let certificateItems: CertificateItem[] = [];

  if (user) {
    const [passportRes, certsRes, profileRes, connectionRes] = await Promise.all([
      supabase
        .from("passports")
        .select("snapshot_data")
        .eq("profile_id", user.id)
        .order('generated_at', { ascending: false })
        .limit(1),
      supabase
        .from("certificates")
        .select("*")
        .eq("profile_id", user.id),
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),
      supabase
        .from("github_connections")
        .select("id, github_username")
        .eq("profile_id", user.id)
        .single()
    ]);

    let passport = passportRes.data;
    const certs = certsRes.data;
    const profile = profileRes.data;
    const connection = connectionRes.data;

    // If no passport exists yet, automatically generate it on the fly!
    if (!passport || passport.length === 0 || !passport[0]?.snapshot_data) {
      try {
        const autoRes = await generatePassport(true);
        if (autoRes?.snapshotData) {
          passport = [{ snapshot_data: autoRes.snapshotData } as any];
        }
      } catch (e) {
        console.warn("Auto passport bootstrap warning:", e);
      }
    }

    // Fetch scanned repositories for the audit breakdown
    if (connection) {
      const { data: rawRepos } = await supabase
        .from("github_repos")
        .select("*")
        .eq("connection_id", connection.id)
        .order("stars_count", { ascending: false });

      if (rawRepos && rawRepos.length > 0) {
        repoItems = rawRepos.map((r: any) => ({
          id: r.id,
          name: r.name,
          url: r.repo_url,
          description: r.description || "Portfolio codebase repository",
          language: r.primary_language || "TypeScript",
          stars: r.stars_count || 0,
          forks: r.forks_count || 0,
          // Pass the stored status through. Collapsing anything non-flagged into
          // "verified" would render an unaudited repo (integrity_status
          // "pending") as though it had passed.
          integrity_status: (r.integrity_status ?? "pending") as any,
          integrity_score: r.integrity_score ?? 0,
          agreement: agreementFromVotes(r.audit_votes),
          skills: r.languages ? Object.keys(r.languages) : [r.primary_language].filter(Boolean)
        }));

        // Compute language distribution
        const langCounts: Record<string, number> = {};
        rawRepos.forEach((r: any) => {
          const l = r.primary_language;
          if (l) langCounts[l] = (langCounts[l] || 0) + 1;
        });

        const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
        languageScores = Object.entries(langCounts)
          .map(([lang, count]) => ({
            language: lang,
            repoCount: count,
            percentage: Math.round((count / totalLangs) * 100),
            confidence: (count >= 2 ? "High" : "Medium") as any
          }))
          .sort((a, b) => b.percentage - a.percentage);
      }
    }

    // Format certificates for audit
    if (certs && certs.length > 0) {
      certificateItems = certs.map((c: any) => {
        const isRejected = c.status === "flagged" || c.status === "rejected";
        return {
          id: c.id,
          title: c.title,
          issuer: c.issuer || "Accredited Credential Issuer",
          issue_date: c.issue_date ? new Date(c.issue_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : undefined,
          status: isRejected ? ("rejected" as const) : ("accepted" as const),
          rejection_reason: isRejected ? "Anti-cheat integrity verification flagged anomalous metadata" : undefined,
          file_url: c.file_url,
          file_type: c.file_type,
          skills: [c.title, c.issuer].filter(Boolean)
        };
      });
    }

    if (passport && passport.length > 0 && passport[0].snapshot_data) {
      const snap = passport[0].snapshot_data;
      
      const totalRepos = snap.github?.total_repos || repoItems.length || 0;
      let heatmap;
      if (totalRepos === 0) {
        heatmap = Array(7).fill(0).map(() => Array(52).fill(0));
      } else {
        heatmap = Array(7).fill(0).map((_, r) => Array(52).fill(0).map((_, c) => (r * 7 + c * 13) % Math.min(5, totalRepos + 1)));
      }

      mappedData = {
        name: snap.profile?.name || profile?.full_name || "Unnamed Student",
        gender: snap.gender || profile?.gender || "Female",
        careerGoal: snap.profile?.headline || profile?.headline || "Software Engineer",
        profileImage: snap.profile?.avatar_url || profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        verifiedSkills: (snap.skills || []).map((s: any) => ({
          name: s.name,
          confidence: s.confidence,
        })),
        githubRepos: snap.github?.total_repos || repoItems.length || 0,
        certificates: snap.certificates || (certs || []).length || 0,
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

      const shortHash = Math.abs(
        user.id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      ).toString().slice(0, 4).padStart(4, "7421");

      const currentYear = new Date().getFullYear();
      const studentId = snap.student_id || `CDY${currentYear.toString().slice(2)}S${shortHash}`;
      const cardId = snap.card_id || `CDY${currentYear}-000${shortHash}`;

      studentPassportData = {
        cardId,
        studentId,
        name: mappedData.name,
        gender: mappedData.gender,
        degree: snap.degree || profile?.degree || "B.Tech – Computer Science Engineering",
        college: snap.profile?.college || profile?.college_name || "College not set",
        avatarUrl: mappedData.profileImage,
        issueDate: snap.issue_date || "18 MAY 2025",
        expiryDate: snap.expiry_date || "17 MAY 2027",
        // `||` treated a real count of 0 as missing and substituted 14/12/3, so a
        // brand-new account displayed a passport full of achievements it did not
        // have. `??` keeps a genuine zero.
        coursesCompleted: snap.courses_completed ?? totalRepos ?? 0,
        skillsVerified: snap.skills_verified ?? (snap.skills || []).length ?? 0,
        certificatesEarned: snap.certificates_earned ?? (certs || []).length ?? 0,
        verificationUrl: snap.verification_url || `https://credify.dev/verify/passport/${studentId}`
      };
    }
  }

  // Fallback state if database has no initial user
  if (!mappedData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 relative overflow-hidden">
        <div className="glass overflow-hidden rounded-[24px] border border-stone-200 relative shadow-2xl w-full max-w-2xl mx-auto p-12 text-center z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <UserCircle className="w-10 h-10 text-stone-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-3">Welcome to Credify</h2>
          <p className="text-stone-500 max-w-md mx-auto text-lg leading-relaxed mb-8">
            Click below to generate your official Student ID Passport & GitProof audit.
          </p>
          <div className="flex justify-center gap-4">
            <GeneratePassportButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col gap-5 px-4 sm:px-8 py-4 max-w-[1400px] mx-auto">


      {/* TOP ROW: Passport Card Switcher + Skill Gap Analysis */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-start gap-8 lg:gap-12">
        {/* LEFT: Passport Card Switcher */}
        <div className="flex-shrink-0 sticky top-12 w-full lg:w-auto flex justify-center">
          <DashboardViewSwitcher mappedData={mappedData} studentData={studentPassportData} />
        </div>

        {/* RIGHT: Skill Gap Analysis & Career Recommendations */}
        <div className="flex-1 w-full flex flex-col justify-start gap-7 pr-1 pb-4 lg:pt-14">
          {/* Section 1: Live Internship Match Engine Preview */}
          <div>
            <DashboardInternshipPreviewCard
              careerGoal={mappedData.careerGoal}
              verifiedSkillsCount={mappedData.verifiedSkillsCount}
            />
          </div>


          {/* Section 2: AI Skill Gap Intelligence */}
          <div id="gap-analysis" className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm backdrop-blur-xl space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase">
                  AI Skill Intelligence
                </span>
                <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                  Target Career Benchmark
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
              {mappedData?.missingSkillsAnalysis?.description || "Keep building to unlock gap analysis."}
            </p>

            {/* Recommended Tech Stack Pills */}
            <div className="pt-3 border-t border-stone-200 space-y-2.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Recommended Growth Vectors
              </span>
              <div className="flex flex-wrap gap-2">
                {(mappedData?.missingSkillsAnalysis?.recommendedTechStack || []).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-700 font-medium tracking-wide shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Suggested Proof-of-Work Projects */}
          <div className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
                  Proof-of-Work Blueprints
                </span>
                <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                  High-Impact Suggested Projects
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {(mappedData?.missingSkillsAnalysis as any)?.suggestedProjects?.map((proj: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/40 to-purple-500/40 group-hover:from-blue-400 group-hover:to-purple-400 transition-colors" />
                  <span className="text-xs sm:text-sm text-stone-900 font-bold tracking-tight block">
                    {proj.name}
                  </span>
                  <span className="text-xs text-stone-500 leading-relaxed mt-1 block">
                    {proj.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Comprehensive Repositories, Language Scores & Certificate Audit Breakdown */}
      <div id="audit-console" className="w-full pt-4 scroll-mt-24">
        <AuditBreakdownPanel
          repos={repoItems}
          languages={languageScores}
          certificates={certificateItems}
        />
      </div>
    </div>
  );
}

