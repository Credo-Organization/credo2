"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  full_name?: string;
  bio?: string;
  college_name?: string;
  graduation_year?: string;
  gender?: string;
  career_goal?: string;
  degree?: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // The middleware gate reads `user_metadata.onboarding_completed` from Supabase
  // Auth, NOT the profiles table. Write it here first so the dashboard unlocks
  // even if the profiles update below fails on a schema mismatch.
  const { error: metaError } = await supabase.auth.updateUser({
    data: { onboarding_completed: true },
  });

  if (metaError) {
    console.error("Auth metadata update error:", metaError);
    return { success: false, error: metaError.message || "Failed to complete onboarding" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      headline: data.career_goal || data.bio,
      college_name: data.college_name,
      graduation_year: data.graduation_year,
      gender: data.gender,
      degree: data.degree,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
