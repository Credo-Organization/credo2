"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  full_name?: string;
  bio?: string;
  college_name?: string;
  graduation_year?: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      bio: data.bio,
      college_name: data.college_name,
      graduation_year: data.graduation_year,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
