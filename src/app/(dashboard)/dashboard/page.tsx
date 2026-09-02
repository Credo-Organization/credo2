import { SkillPassportCard, SkillPassportData } from "@/components/dashboard/skill-passport-card";
import { DashboardViewSwitcher } from "@/components/dashboard/dashboard-view-switcher";
import { AuditBreakdownPanel, RepoItem, LanguageScore, CertificateItem } from "@/components/dashboard/audit-breakdown-panel";
import { RightColumnCoPilot } from "@/components/dashboard/right-column-co-pilot";
import { createClient } from "@/lib/supabase/server";
import { GeneratePassportButton } from "@/components/passport/generate-button";
import { UserCircle } from "lucide-react";
import { DashboardProofHUD } from "@/components/dashboard/proof-hud";
import { agreementFromVotes } from "@/lib/ai/agreement";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let mappedData: SkillPassportData | undefined = undefined;
  let studentPassportData: any = undefined;
  let repoItems: RepoItem[] = [];
  let languageScores: LanguageScore[] = [];
  let certificateItems: CertificateItem[] = [];
  let topMatches: { title: string; orgName?: string; matchScore: number }[] = [];
  let hasPassport = false;

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

    const passport = passportRes.data;
    const certs = certsRes.data;
    const profile = profileRes.data;
    const connection = connectionRes.data;
    hasPassport = Boolean(passport && passport.length > 0);

    // Compute live deterministic internship matches for preview card
    if (passport && passport.length > 0 && passport[0].snapshot_data) {
      try {
        const { matchPassportToLiveOpportunities } = await import("@/lib/matching/opportunity-matcher");
        const allMatches = await matchPassportToLiveOpportunities(passport[0].snapshot_data);
        topMatches = (allMatches || []).slice(0, 2).map((m: any) => ({
          title: m.opportunity?.title || "Engineering Role",
          orgName: m.opportunity?.org_name || "Partner Squad",
          matchScore: m.matchScore || 0,
        }));
      } catch (err) {
        console.error("Failed to load dashboard internship matches:", err);
      }
    }

    // If no passport exists yet, the page renders the fast empty state with GeneratePassportButton

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

      const studentGender = snap.gender || profile?.gender || "male";
      const isFemale = studentGender.toLowerCase() === "female";
      const rawAvatar = snap.profile?.avatar_url || profile?.avatar_url || "";
      const isUnsplashOrEmpty = !rawAvatar || rawAvatar.includes("unsplash.com");
      const studentAvatar = !isUnsplashOrEmpty
        ? rawAvatar
        : (isFemale ? "/avatar-female.webp" : "/avatar-male.webp");

      const shortHash = Math.abs(
        user.id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      ).toString().slice(0, 4).padStart(4, "7421");

      const currentYear = new Date().getFullYear();
      const studentId = snap.student_id || `CDY${currentYear.toString().slice(2)}S${shortHash}`;
      const cardId = snap.card_id || `CDY${currentYear}-000${shortHash}`;

      mappedData = {
        cardId,
        studentId,
        name: snap.profile?.name || profile?.full_name || "Subham Sarangi",
        gender: studentGender,
        careerGoal: snap.profile?.headline || profile?.headline || "AI Engineer",
        profileImage: studentAvatar,
        verifiedSkills: (snap.skills || []).map((s: any) => ({
          name: s.name,
          confidence: s.confidence || "High",
        })),
        githubRepos: snap.github?.total_repos || repoItems.length || 0,
        certificates: snap.certificates || (certs || []).length || 0,
        verifiedSkillsCount: (snap.skills || []).length,
        missingSkills: 0,
        missingSkillsAnalysis: {
          description: snap.insights?.gap_analysis_text || (snap.skills && snap.skills.length > 0
            ? `Verified proficiency in ${snap.skills.slice(0, 3).map((s: any) => s.name).join(", ")}. Next milestone: expand production portfolio for ${snap.profile?.headline || profile?.headline || "Engineering"}.`
            : "Connect your GitHub account and generate your Skill Passport to compute custom AI gap analysis."),
          recommendedTechStack: snap.insights?.recommended_tech_stack || [],
          suggestedProjects: snap.insights?.suggested_projects || []
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
        verificationUrl: snap.verification_url || `https://minskey.dev/verify/passport/${studentId}`
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
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-3">Welcome to Minskey</h2>
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
        <div className="flex-shrink-0 sticky top-6 w-full lg:w-auto flex justify-center">
          <DashboardViewSwitcher mappedData={mappedData} studentData={studentPassportData} />
        </div>

        {/* RIGHT: Skill Gap Analysis & Interactive AI Mentor Co-Pilot */}
        <RightColumnCoPilot
          careerGoal={mappedData.careerGoal}
          studentName={mappedData.name}
          verifiedSkills={mappedData.verifiedSkills}
          missingSkillsAnalysis={mappedData.missingSkillsAnalysis}
          githubRepos={mappedData.githubRepos}
          certificates={mappedData.certificates}
        />
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

