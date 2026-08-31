"use server";

import { createClient } from "@/lib/supabase/server";

export async function matchOpportunity(jobDescription: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to match opportunities." };
  }

  // Insert a pending job
  const { data: job, error } = await supabase
    .from("match_jobs")
    .insert({
      profile_id: user.id,
      job_description: jobDescription,
      status: "pending",
    })
    .select()
    .single();

  if (error || !job) {
    console.error("Error creating match job:", error);
    return { error: "Failed to queue match request." };
  }

  // Trigger the background worker API route without awaiting it
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  fetch(`${appUrl}/api/process-match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WORKER_SECRET ?? ""}`,
    },
    body: JSON.stringify({ jobId: job.id }),
  }).catch((err) => console.error("Failed to trigger process-match:", err));

  return { jobId: job.id };
}

export async function checkMatchJobStatus(jobId: string) {
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from("match_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return { error: "Job not found" };
  }

  return {
    status: job.status,
    match_score: job.match_score,
    gap_analysis: job.gap_analysis,
    explainable_text: job.explainable_text,
    error_message: job.error_message,
  };
}
