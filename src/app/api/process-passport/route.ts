import { NextResponse } from "next/server";
import { isAuthorizedWorkerRequest } from "@/lib/security/worker-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { coachModel } from "@/lib/ai-client";
import { generateObject } from "ai";
import { z } from "zod";
import { normalizeSkill } from "@/lib/extractor/taxonomy-normalizer";

export const maxDuration = 60; 

export async function POST(request: Request) {
  let job_id: string | null = null;
  // This route uses the service-role client, which bypasses RLS, and accepts an
  // account identifier from the caller. It must never be reachable unauthenticated.
  if (!isAuthorizedWorkerRequest(request)) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Missing or invalid worker credentials" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    job_id = body.job_id;
    const user_id = body.user_id;

    if (!job_id || !user_id) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: "Missing job_id or user_id" } }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Update status to processing
    await supabase
      .from("passport_jobs")
      .update({ status: "processing" })
      .eq("id", job_id);

    // 2. Fetch Profile and Goal
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, profile_career_goals(goal_id)")
      .eq("id", user_id)
      .single();

    // 3. Fetch GitHub Connection, Repos
    const { data: connection } = await supabase
      .from("github_connections")
      .select("*")
      .eq("profile_id", user_id)
      .single();

    let repos: any[] = [];
    let flaggedReposCount = 0;

    if (connection) {
      const { data: repoDataRaw } = await supabase
        .from("github_repos")
        .select("*")
        .eq("connection_id", connection.id);
        
      repos = (repoDataRaw || []).filter(r => r.integrity_status !== "flagged");
      flaggedReposCount = (repoDataRaw || []).filter(r => r.integrity_status === "flagged").length;
    }

    // 4. Fetch Certificates
    const { data: certificates } = await supabase
      .from("certificates")
      .select("*")
      .eq("profile_id", user_id);

    // 5. Build Skill Map
    const skillMap = new Map<string, { repoCount: number, certCitations: string[], skill_id?: string }>();
    
    repos.forEach(r => {
      const lang = r.primary_language;
      if (lang) {
        const normalized = normalizeSkill(lang);
        const skillKey = normalized.canonical_name;
        const current = skillMap.get(skillKey) || { repoCount: 0, certCitations: [] };
        skillMap.set(skillKey, { ...current, repoCount: current.repoCount + 1, skill_id: normalized.skill_id || undefined });
      }
    });

    const { data: evidenceData } = await supabase
      .from("evidence")
      .select("id, source_type, raw_ref, integrity_status, evidence_claims(unmapped_label, skill_id, extracted_text)")
      .eq("user_id", user_id);

    const validCertUrls = new Set((certificates || []).map(c => c.file_url));

    if (evidenceData) {
      evidenceData.forEach((ev: any) => {
        if (ev.integrity_status === "flagged") return;
        if (ev.source_type === "certificate") {
          if (!validCertUrls.has(ev.raw_ref)) return; 
        }
        if (ev.evidence_claims) {
          ev.evidence_claims.forEach((claim: any) => {
            const name = claim.unmapped_label || claim.skill_id;
            if (name) {
              const formatted = name.charAt(0).toUpperCase() + name.slice(1);
              const current = skillMap.get(formatted) || { repoCount: 0, certCitations: [] };
              skillMap.set(formatted, { 
                ...current, 
                certCitations: [...current.certCitations, `AI Extracted: "${claim.extracted_text}"`],
                skill_id: claim.skill_id || current.skill_id
              });
            }
          });
        }
      });
    }

    // 6. Compute Grading
    const flaggedEvidenceCount = evidenceData ? evidenceData.filter((ev: any) => ev.integrity_status === "flagged").length : 0;
    const has_flagged_items = (flaggedReposCount + flaggedEvidenceCount) > 0;

    const topSkills = Array.from(skillMap.entries())
      .map(([name, data]) => {
        let confidence = "Low";
        if ((data.repoCount > 0 && data.certCitations.length > 0) || data.repoCount > 5) {
          confidence = "High";
        } else if (data.repoCount >= 2 || data.certCitations.length > 1) {
          confidence = "Medium";
        }

        const evidence = [];
        if (data.repoCount > 0) evidence.push(`${data.repoCount} repos using ${name}`);
        data.certCitations.forEach(citation => evidence.push(citation));

        return { name, skill_id: data.skill_id, confidence, evidence, _sortScore: data.repoCount + (data.certCitations.length * 3) };
      })
      .sort((a, b) => b._sortScore - a._sortScore)
      .slice(0, 6)
      .map(({ _sortScore, ...rest }) => rest);

    // 7. AI Gap Analysis (with RAG)
    let insights = null;
    try {
      const skillNames = topSkills.map(s => s.name).join(", ");
      const careerGoal = profile?.headline || "Software Engineer";
      
      // RAG Integration: Fetch real-world job requirements
      const { searchJobRequirements } = await import("@/lib/vector-store");
      const matchedJobs = await searchJobRequirements(careerGoal, 3);
      
      const jobContext = matchedJobs && matchedJobs.length > 0
        ? `Real-world job requirements for similar roles:\n` + matchedJobs.map((j: any) => 
            `- ${j.role_title}: Requires ${Array.isArray(j.required_skills) ? j.required_skills.join(", ") : JSON.stringify(j.required_skills)}`
          ).join("\n")
        : "No specific real-world data available. Rely on general industry knowledge.";

      const { object } = await generateObject({
        model: coachModel,
        schema: z.object({
          gap_analysis_text: z.string().describe("A 1-sentence supportive analysis of what skills the user lacks for their career goal based on their current skills."),
          recommended_tech_stack: z.array(z.string()).describe("List of 4 recommended technologies to learn next."),
          suggested_projects: z.array(z.object({ name: z.string(), description: z.string() })).describe("List of 3 specific, portfolio-building projects to build these skills.")
        }),
        prompt: `Analyze this candidate's skill profile against their career goal.
        Career Goal: ${careerGoal}
        Current Verified Skills: ${skillNames || "None yet"}
        
        ${jobContext}
        
        Provide a realistic, concise gap analysis basing your recommendations strictly on the real-world job requirements provided above. Assume they are a beginner if they have no skills.`,
      });
      insights = object;
    } catch (err) {
      console.error("[ProcessPassport] AI Insights generation failed:", err);
    }

    // Generate deterministic Student ID & Card ID
    const shortHash = Math.abs(
      (user_id as string).split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString().slice(0, 4).padStart(4, "7421");

    const currentYear = new Date().getFullYear();
    const studentId = `CDY${currentYear.toString().slice(2)}S${shortHash}`;
    const cardId = `CDY${currentYear}-000${shortHash}`;

    // Issue and Valid Until Dates
    const issueDateObj = new Date();
    const expiryDateObj = new Date();
    expiryDateObj.setFullYear(issueDateObj.getFullYear() + 2);

    const formatCardDate = (d: Date) => {
      const day = d.getDate().toString().padStart(2, "0");
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const issueDate = formatCardDate(issueDateObj);
    const expiryDate = formatCardDate(expiryDateObj);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify/passport/${studentId}`;

    const snapshotData = {
      card_id: cardId,
      student_id: studentId,
      issue_date: issueDate,
      expiry_date: expiryDate,
      verification_url: verificationUrl,
      degree: profile?.degree || "B.Tech – Computer Science Engineering",
      gender: profile?.gender || "Female",
      courses_completed: repos.length,
      skills_verified: topSkills.length,
      certificates_earned: (certificates || []).length,
      profile: {
        name: profile?.full_name || profile?.username || "Unnamed Student",
        headline: profile?.headline || "Software Engineer",
        country: profile?.country,
        college: profile?.college_name || "",
        avatar_url: profile?.avatar_url && !profile.avatar_url.includes("unsplash.com")
          ? profile.avatar_url 
          : (profile?.gender?.toLowerCase() === "female" ? "/avatar-female.webp" : "/avatar-male.webp"),
        gender: profile?.gender || "male",
        degree: profile?.degree || "B.Tech – Computer Science Engineering",
      },
      github: {
        username: connection?.github_username,
        total_repos: repos.length,
        total_stars: repos.reduce((acc: number, r: any) => acc + r.stars_count, 0),
      },
      certificates: (certificates || []).length,
      skills: topSkills,
      has_flagged_items,
      top_projects: repos.sort((a: any, b: any) => b.stars_count - a.stars_count).slice(0, 2).map((r: any) => ({
        name: r.name, description: r.description, language: r.primary_language, stars: r.stars_count
      })),
      insights
    };


    // 8. Upsert Passport
    const { data: existingPassport } = await supabase
      .from("passports")
      .select("id, version")
      .eq("profile_id", user_id)
      .single();

    const { error: passportError } = await supabase
      .from("passports")
      .upsert({
        id: existingPassport?.id || undefined,
        profile_id: user_id,
        version: (existingPassport?.version || 0) + 1,
        status: "published",
        is_public: false,
        title: `${profile?.full_name || 'My'} Skill Passport`,
        snapshot_data: snapshotData,
        generated_at: new Date().toISOString()
      });

    if (passportError) throw passportError;

    // 9. Update job status
    await supabase
      .from("passport_jobs")
      .update({ status: "completed", result_data: snapshotData, completed_at: new Date().toISOString() })
      .eq("id", job_id);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[ProcessPassport] Fatal error:", error);
    
    // Attempt to mark as failed
    if (job_id) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from("passport_jobs")
          .update({ status: "failed", error_message: error.message || "Internal server error" })
          .eq("id", job_id);
      } catch (e) {
        console.error("[ProcessPassport] Failed to update error status:", e);
      }
    }

    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || "Internal server error" } }, { status: 500 });
  }
}
