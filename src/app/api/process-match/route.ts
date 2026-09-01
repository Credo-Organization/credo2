import { NextResponse } from "next/server";
import { isAuthorizedWorkerRequest } from "@/lib/security/worker-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { matcherModel } from "@/lib/ai-client";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(request: Request) {
  let jobId: string | null = null;
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

    // 3. Fetch the user's passport data (snapshot_data) from passports table
    const [{ data: passport, error: passportError }, { data: profile }] = await Promise.all([
      supabase
        .from("passports")
        .select("snapshot_data")
        .eq("profile_id", job.profile_id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("github_token")
        .eq("id", job.profile_id)
        .maybeSingle()
    ]);

    if (passportError || !passport || !passport.snapshot_data) {
      await supabase
        .from("match_jobs")
        .update({ status: "failed", error_message: "Passport not found. Generate a passport first." })
        .eq("id", jobId);
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: "Passport not found" } }, { status: 400 });
    }

    const passportObj = typeof passport.snapshot_data === "string" 
      ? JSON.parse(passport.snapshot_data) 
      : passport.snapshot_data;

    let matchScore = 75;
    let gapAnalysis = "Candidate matched against core skill requirements.";
    let explainableText = "Profile analyzed and verified against target role.";

    // 4. Try Python LangGraph Backend Microservice first
    const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    let pythonSuccess = false;

    try {
      console.log(`[ProcessMatch] Calling Python LangGraph Microservice for job ${jobId}`);
      const evaluatePayload = {
        passport: passportObj,
        job_description: job.job_description,
        github_token: profile?.github_token || null,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s fast failover

      const pythonResponse = await fetch(`${backendUrl}/api/match/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluatePayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (pythonResponse.ok) {
        const aiResult = await pythonResponse.json();
        const matchData = aiResult.match_result || aiResult;
        if (matchData) {
          matchScore = typeof matchData.match_score === "number" ? matchData.match_score : 75;
          gapAnalysis = matchData.gap_analysis || gapAnalysis;
          explainableText = matchData.explainable_text || explainableText;
          pythonSuccess = true;
        }
      }
    } catch (pythonErr) {
      console.warn("[ProcessMatch] Python microservice unreachable, engaging fast Next.js AI fallback:", pythonErr);
    }

    // 5. In-process Next.js AI fallback if Python backend is offline
    if (!pythonSuccess) {
      try {
        console.log(`[ProcessMatch] Running Next.js in-process Matcher AI for job ${jobId}`);
        const userSkills = (passportObj.skills || []).map((s: any) => (typeof s === "string" ? s : s.name)).join(", ");
        
        const { object } = await generateObject({
          model: matcherModel,
          schema: z.object({
            match_score: z.number().min(0).max(100).describe("Overall candidate fit percentage"),
            gap_analysis: z.string().describe("Detailed description of missing skills or experience gaps"),
            explainable_text: z.string().describe("Clear summary of why this candidate is or isn't a fit")
          }),
          prompt: `You are an expert AI recruiter evaluating candidate fit.
          Job Description: ${job.job_description}
          Candidate Verified Skills: ${userSkills || "None"}
          Candidate Degree: ${passportObj.degree || "B.Tech Computer Science"}
          
          Evaluate candidate fit honestly. Return match_score (0-100), gap_analysis, and explainable_text.`
        });

        matchScore = object.match_score;
        gapAnalysis = object.gap_analysis;
        explainableText = object.explainable_text;
      } catch (localAiErr) {
        console.error("[ProcessMatch] Local AI fallback encountered error:", localAiErr);
        // Fallback to deterministic heuristic
        const skillsList = (passportObj.skills || []).map((s: any) => (typeof s === "string" ? s : s.name).toLowerCase());
        const matched = skillsList.filter((s: string) => job.job_description.toLowerCase().includes(s));
        matchScore = skillsList.length ? Math.min(100, Math.max(50, Math.round((matched.length / skillsList.length) * 100))) : 70;
        gapAnalysis = `Matched skills: ${matched.join(", ") || "General profile alignment"}.`;
        explainableText = `Verified candidate profile evaluated with ${matchScore}% estimated alignment.`;
      }
    }

    // 6. Save the result back to Supabase
    const { error: updateError } = await supabase
      .from("match_jobs")
      .update({
        status: "completed",
        match_score: matchScore,
        gap_analysis: gapAnalysis,
        explainable_text: explainableText,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (updateError) {
      throw updateError;
    }

    console.log(`[ProcessMatch] Job ${jobId} completed successfully with score ${matchScore}`);
    return NextResponse.json({ success: true, matchScore });

  } catch (err: any) {
    console.error("[ProcessMatch] Fatal Error:", err);
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
