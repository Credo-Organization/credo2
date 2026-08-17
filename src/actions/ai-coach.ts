"use server";



export async function generateCoachingInsight(passport: any, job: any) {
  try {
    // Proxy the request to our local FastAPI backend running on port 8000
    const response = await fetch("http://127.0.0.1:8000/api/match/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw_document: JSON.stringify(passport.skills || []),
        job_description: `${job.title} at ${job.org_name}: ${job.description}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI Backend Error:", errorText);
      throw new Error(`FastAPI Backend Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.match_result) {
      const result = data.match_result;
      return `**Match Score: ${result.match_score}%**\n\n### Semantic Gap Analysis\n${result.gap_analysis}\n\n### Explainable Text\n${result.explainable_text}`;
    } else {
      throw new Error("Invalid response format from FastAPI backend.");
    }

  } catch (error) {
    console.error("AI Coach generation failed via FastAPI:", error);
    throw new Error("Failed to generate coaching insight.");
  }
}
