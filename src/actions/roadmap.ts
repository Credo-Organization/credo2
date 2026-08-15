"use server";

import { createClient } from "@/lib/supabase/server";
import { careerGoals } from "@/config/career-goals";

export async function getSkillGapAnalysis() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch Career Goal
  const { data: profileGoal } = await supabase
    .from("profile_career_goals")
    .select("goal_id")
    .eq("profile_id", user.id)
    .single();

  if (!profileGoal) return null;

  const targetGoal = careerGoals.find(g => g.id === profileGoal.goal_id);
  if (!targetGoal) return null;

  // Fetch Passport
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("profile_id", user.id)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!passport) return { targetGoal, hasPassport: false };

  const acquiredSkills: string[] = [];
  const missingSkills: string[] = [];

  const passportSkills = (passport.snapshot_data?.skills || []).map((s: any) => s.name.toLowerCase());

  targetGoal.requiredSkills.forEach(reqSkill => {
    // Normalizing for matching (e.g. react-native vs react native, nodejs vs node)
    const normalizedReq = reqSkill.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Check if the required skill exists in passport skills (or vice versa, since passport might say "React" and req is "react")
    const match = passportSkills.some((ps: string) => {
      const normalizedPs = ps.replace(/[^a-z0-9]/g, "");
      // Special case for node/nodejs
      if ((normalizedReq === "nodejs" && normalizedPs === "node") || (normalizedReq === "node" && normalizedPs === "nodejs")) return true;
      return normalizedPs.includes(normalizedReq) || normalizedReq.includes(normalizedPs);
    });

    if (match) {
      acquiredSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const alignmentPercentage = Math.round((acquiredSkills.length / targetGoal.requiredSkills.length) * 100);

  return {
    targetGoal,
    hasPassport: true,
    analysis: {
      acquiredSkills,
      missingSkills,
      alignmentPercentage
    }
  };
}
