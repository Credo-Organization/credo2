"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { careerGoals } from "@/config/career-goals";
import type { PersonalInfo } from "@/stores/onboarding-store";

export async function completeOnboarding(
  personalInfo: PersonalInfo,
  careerGoalSlug: string
) {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Validate the career goal exists in our config
  const goal = careerGoals.find((g) => g.slug === careerGoalSlug);
  if (!goal) {
    throw new Error("Invalid career goal");
  }

  // 1. Upsert the user's profile
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: personalInfo.full_name,
      country: personalInfo.country,
      college_name: personalInfo.college_name,
      degree: personalInfo.degree,
      graduation_year: personalInfo.graduation_year,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  // 2. Fetch or create the career goal in the database (since we are using config as source of truth for now, we must ensure it exists in DB to satisfy foreign keys if profile_career_goals is used)
  // For simplicity and since we don't have seed data, let's just store the goal slug in the profile for now if profile_career_goals requires a seeded ID.
  // Wait, let's look at the database schema. `profile_career_goals` uses `goal_id: number`.
  // If the career_goals table isn't seeded, this will fail. Let's try to upsert the goal first to be safe.
  
  const { data: dbGoal, error: goalUpsertError } = await supabase
    .from("career_goals")
    .upsert({
      slug: goal.slug,
      title: goal.title,
      description: goal.description,
      icon: goal.icon,
      category: goal.category,
      required_skills: goal.requiredSkills,
    }, { onConflict: "slug" })
    .select("id")
    .single();

  if (goalUpsertError) {
    console.error("Error upserting career goal:", goalUpsertError);
    // Proceed anyway, maybe we can just rely on the config
  } else if (dbGoal) {
    // 3. Link profile to career goal
    await supabase
      .from("profile_career_goals")
      .upsert({
        profile_id: user.id,
        goal_id: dbGoal.id,
        priority: 1,
      }, { onConflict: "profile_id,goal_id" });
  }

  revalidatePath("/dashboard");
  return { success: true };
}
