"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeSkill } from "@/lib/extractor/taxonomy-normalizer";
import { revalidatePath } from "next/cache";
import { careerGoals } from "@/config/career-goals";

const SKILL_NAME_MAP: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  nextjs: "Next.js",
  tailwindcss: "TailwindCSS",
  git: "Git",
  nodejs: "Node.js",
  python: "Python",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  "rest-api": "REST APIs",
  docker: "Docker",
  linux: "Linux",
  "react-native": "React Native",
  flutter: "Flutter",
  swift: "Swift",
  kotlin: "Kotlin",
  firebase: "Firebase",
  pandas: "Pandas",
  numpy: "NumPy",
  "scikit-learn": "Scikit-Learn",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  kubernetes: "Kubernetes",
  mlops: "MLOps",
  sql: "SQL",
  statistics: "Statistics",
  jupyter: "Jupyter Notebooks",
  aws: "AWS",
  terraform: "Terraform",
  "ci-cd": "CI/CD",
  figma: "Figma",
  prototyping: "Prototyping",
  "user-research": "User Research",
  wireframing: "Wireframing",
  "design-systems": "Design Systems",
};

export async function generatePassport(skipRevalidate: boolean = false) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Insert/update job
  const { data: job } = await supabase
    .from("passport_jobs")
    .insert({
      profile_id: user.id,
      status: "processing"
    })
    .select("id")
    .single();

  const jobId = job?.id || "temp-job";

  try {
    // 2. Fetch User Profile, GitHub Data & Certificates in Parallel
    const [{ data: profile }, { data: connection }, { data: certificates }, { data: evidenceData }] = await Promise.all([
      supabase.from("profiles").select("*, profile_career_goals(goal_id)").eq("id", user.id).single(),
      supabase.from("github_connections").select("*").eq("profile_id", user.id).single(),
      supabase.from("certificates").select("*").eq("profile_id", user.id),
      supabase.from("evidence").select("id, source_type, raw_ref, integrity_status, integrity_score, evidence_claims(unmapped_label, skill_id, extracted_text)").eq("user_id", user.id)
    ]);

    let repos: any[] = [];
    if (connection) {
      const { data: repoDataRaw } = await supabase
        .from("github_repos")
        .select("*")
        .eq("connection_id", connection.id);
      repos = repoDataRaw || [];
    }

    // 3. Build Skill Map
    const skillMap = new Map<string, { repoCount: number, certCitations: string[], skill_id?: string }>();
    
    repos.forEach((r: any) => {
      const lang = r.primary_language;
      if (lang) {
        const normalized = normalizeSkill(lang);
        const skillKey = normalized.canonical_name;
        const current = skillMap.get(skillKey) || { repoCount: 0, certCitations: [] };
        skillMap.set(skillKey, { ...current, repoCount: current.repoCount + 1, skill_id: normalized.skill_id || undefined });
      }
    });

    if (evidenceData) {
      evidenceData.forEach((ev: any) => {
        if (ev.integrity_status === "flagged") return;
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

    if (certificates && certificates.length > 0) {
      certificates.forEach((c: any) => {
        if (c.status === "flagged" || c.status === "rejected") return;
        const title = c.title?.trim();
        if (title) {
          const current = skillMap.get(title) || { repoCount: 0, certCitations: [] };
          skillMap.set(title, {
            ...current,
            certCitations: [...current.certCitations, `Certificate: ${c.issuer || "Verified"}`],
          });
        }
      });
    }

    const topSkills = Array.from(skillMap.entries())
      .map(([name, data]) => {
        let confidence = "Low";
        if ((data.repoCount > 0 && data.certCitations.length > 0) || data.repoCount >= 3) {
          confidence = "High";
        } else if (data.repoCount >= 1 || data.certCitations.length > 0) {
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

    // 4. Generate deterministic Student ID & Card ID
    const shortHash = Math.abs(
      user.id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString().slice(0, 4).padStart(4, "7421");

    const currentYear = new Date().getFullYear();
    const studentId = `CDY${currentYear.toString().slice(2)}S${shortHash}`;
    const cardId = `CDY${currentYear}-000${shortHash}`;

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

    // Dynamic role pathway & missing skills derivation
    const userHeadline = profile?.headline || "Software Engineer";
    const lowerHeadline = userHeadline.toLowerCase();
    const matchedGoal =
      careerGoals.find(
        (g) =>
          lowerHeadline.includes(g.title.toLowerCase()) ||
          lowerHeadline.includes(g.slug) ||
          g.title.toLowerCase().includes(lowerHeadline)
      ) ||
      (lowerHeadline.includes("ai") || lowerHeadline.includes("ml") || lowerHeadline.includes("machine")
        ? careerGoals.find((g) => g.id === "ml-engineer")
        : lowerHeadline.includes("data")
        ? careerGoals.find((g) => g.id === "data-scientist")
        : lowerHeadline.includes("back")
        ? careerGoals.find((g) => g.id === "backend-dev")
        : lowerHeadline.includes("front")
        ? careerGoals.find((g) => g.id === "frontend-dev")
        : careerGoals.find((g) => g.id === "fullstack-dev")) ||
      careerGoals[0];

    const verifiedSkillNames = new Set(topSkills.map((s) => s.name.toLowerCase()));
    const unverifiedTechStack = (matchedGoal?.requiredSkills || [])
      .map((slug) => SKILL_NAME_MAP[slug] || slug.charAt(0).toUpperCase() + slug.slice(1))
      .filter((name) => !verifiedSkillNames.has(name.toLowerCase()))
      .slice(0, 4);

    const recommendedTechStack = unverifiedTechStack.length > 0
      ? unverifiedTechStack
      : ["Docker", "Kubernetes", "CI/CD", "PostgreSQL"].filter((t) => !verifiedSkillNames.has(t.toLowerCase()));

    const insights = {
      gap_analysis_text: topSkills.length > 0
        ? `Verified proficiency in ${topSkills.slice(0, 3).map((s) => s.name).join(", ")}. Targeted milestone for ${userHeadline}: ${recommendedTechStack.slice(0, 2).join(" & ") || "Advanced Architecture"}.`
        : `Connect your GitHub account or upload certificates to benchmark your profile for ${userHeadline}.`,
      recommended_tech_stack: recommendedTechStack,
      suggested_projects: [
        {
          name: `${userHeadline} Production Service`,
          description: `Build a production-ready application implementing ${recommendedTechStack[0] || "core protocols"} and modern automated testing.`,
        },
        {
          name: "Scalable Infrastructure Architecture",
          description: `Deploy containerized services using ${recommendedTechStack[1] || "Docker"} with continuous integration pipelines.`,
        },
      ],
    };

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
        country: profile?.country || "India",
        college: profile?.college_name || "",
        avatar_url: profile?.avatar_url && !profile.avatar_url.includes("unsplash.com") 
          ? profile.avatar_url 
          : (profile?.gender?.toLowerCase() === "female" ? "/avatar-female.webp" : "/avatar-male.webp"),
        gender: profile?.gender || "male",
        degree: profile?.degree || "B.Tech – Computer Science Engineering",
      },
      github: {
        username: connection?.github_username || "developer",
        total_repos: repos.length,
        total_stars: repos.reduce((acc: number, r: any) => acc + (r.stars_count || 0), 0),
      },
      certificates: (certificates || []).length,
      skills: topSkills,
      has_flagged_items: false,
      // No invented projects. A passport that lists repositories the student
      // never wrote is the exact failure this product exists to prevent.
      top_projects: repos.slice(0, 2).map((r: any) => ({
        name: r.name, description: r.description || "Portfolio project", language: r.primary_language || "TypeScript", stars: r.stars_count || 0
      })),
      insights
    };

    // 5. Upsert Passport
    const { data: existingPassport } = await supabase
      .from("passports")
      .select("id, version")
      .eq("profile_id", user.id)
      .single();

    await supabase
      .from("passports")
      .upsert({
        id: existingPassport?.id || undefined,
        profile_id: user.id,
        version: (existingPassport?.version || 0) + 1,
        status: "published",
        is_public: true,
        title: `${profile?.full_name || 'My'} Skill Passport`,
        snapshot_data: snapshotData,
        generated_at: new Date().toISOString()
      });

    // 6. Update job status to completed
    if (job?.id) {
      await supabase
        .from("passport_jobs")
        .update({ status: "completed", result_data: snapshotData, completed_at: new Date().toISOString() })
        .eq("id", job.id);
    }

    if (!skipRevalidate) {
      revalidatePath("/dashboard");
      revalidatePath("/passport");
    }

    return { success: true, job_id: jobId, status: "completed", snapshotData };
  } catch (error: any) {
    console.error("[generatePassport] Error:", error);
    if (job?.id) {
      await supabase
        .from("passport_jobs")
        .update({ status: "failed", error_message: error.message || "Error" })
        .eq("id", job.id);
    }
    return { success: false, error: error.message || "Failed to generate passport." };
  }
}


export async function togglePassportVisibility(isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("passports")
    .update({ is_public: isPublic })
    .eq("profile_id", user.id);

  if (error) {
    throw new Error("Failed to update visibility.");
  }

  revalidatePath("/passport");
  return { success: true };
}

export async function checkJobStatus(job_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("passport_jobs")
    .select("status, error_message")
    .eq("id", job_id)
    .single();

  if (error || !data) {
    throw new Error("Job not found.");
  }
  
  if (data.status === "completed") {
    revalidatePath("/dashboard");
    revalidatePath("/passport");
  }

  return data;
}
