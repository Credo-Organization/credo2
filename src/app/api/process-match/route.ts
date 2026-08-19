import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let jobId: string | null = null;
  try {
    const body = await request.json();
    jobId = body.jobId;

    if (!jobId) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: "Missing jobId" } }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch the match job
    const { data: job, error: jobError } = await supabase
      .from("match_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: "Job not found" } }, { status: 404 });
    }

    // 2. Mark as processing
    await supabase
      .from("match_jobs")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", jobId);

    // 3. Fetch the user's passport data (snapshot_data)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("snapshot_data, github_token")
      .eq("id", job.profile_id)
      .single();

    if (profileError || !profile || !profile.snapshot_data) {
      await supabase
        .from("match_jobs")
        .update({ status: "failed", error_message: "Passport not found. Generate a passport first." })
        .eq("id", jobId);
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: "Passport not found" } }, { status: 400 });
    }

    // 4. Call Python Backend Microservice
    console.log(`[ProcessMatch] Calling Python AI Microservice for job ${jobId}`);
    
    // We send the parsed snapshot_data and the job description to Python
    const evaluatePayload = {
      passport: typeof profile.snapshot_data === "string" ? JSON.parse(profile.snapshot_data) : profile.snapshot_data,
      job_description: job.job_description,
      github_token: profile.github_token || null,
    };

    const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    const pythonResponse = await fetch(`${backendUrl}/api/match/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evaluatePayload),
    });

    if (!pythonResponse.ok) {
      throw new Error(`Python backend failed: ${pythonResponse.statusText}`);
    }

    const aiResult = await pythonResponse.json();

    // 5. Save the result back to Supabase
    const { error: updateError } = await supabase
      .from("match_jobs")
      .update({
        status: "completed",
        match_score: aiResult.match_score || 0,
        gap_analysis: aiResult.gap_analysis || "Analysis failed.",
        explainable_text: aiResult.explainable_text || "No explanation provided.",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (updateError) {
      throw updateError;
    }

    console.log(`[ProcessMatch] Job ${jobId} completed successfully`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[ProcessMatch] Error:", err);
    // Attempt to mark as failed
    if (jobId) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from("match_jobs")
          .update({ status: "failed", error_message: err.message || "Internal server error" })
          .eq("id", jobId);
      } catch (e) {
        console.error("[ProcessMatch] Failed to update error status:", e);
      }
    }

    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: "Internal server error" } }, { status: 500 });
  }
}
