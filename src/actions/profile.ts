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
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const isFemale = data.gender?.toLowerCase() === "female";
  const avatarUrl = data.avatar_url || (isFemale ? "/avatar-female.webp" : "/avatar-male.webp");

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
      avatar_url: avatarUrl,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }

  // Synchronize the avatar into existing passport snapshot so it updates everywhere immediately
  try {
    const { data: passport } = await supabase
      .from("passports")
      .select("id, snapshot_data")
      .eq("profile_id", user.id)
      .order("generated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (passport && passport.snapshot_data) {
      const snap = { ...passport.snapshot_data } as any;
      snap.gender = data.gender;
      if (!snap.profile) snap.profile = {};
      snap.profile.gender = data.gender;
      snap.profile.avatar_url = avatarUrl;
      snap.avatar_url = avatarUrl;
      await supabase.from("passports").update({ snapshot_data: snap }).eq("id", passport.id);
    }
  } catch (syncErr) {
    console.error("Failed to sync passport snapshot avatar:", syncErr);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
