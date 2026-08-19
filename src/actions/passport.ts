"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeSkill } from "@/lib/extractor/taxonomy-normalizer";
import { revalidatePath } from "next/cache";
import { aiModel } from "@/lib/ai-client";
import { generateObject } from "ai";
import { z } from "zod";

export async function generatePassport() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Insert a pending job
  const { data: job, error: jobError } = await supabase
    .from("passport_jobs")
    .insert({
      profile_id: user.id,
      status: "pending"
    })
    .select("id")
    .single();

  if (jobError || !job) {
    console.error("Failed to create passport job:", jobError);
    throw new Error("Failed to start passport generation.");
  }

  // 2. Trigger the background API route asynchronously (Fire and forget)
  // We don't await the fetch so it doesn't block
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  
  fetch(`${baseUrl}/api/process-passport`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_id: job.id, user_id: user.id })
  }).catch(err => {
    console.error("[generatePassport] Background fetch failed to initiate:", err);
  });

  return { success: true, job_id: job.id };
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
