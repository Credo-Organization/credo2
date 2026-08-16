"use server";

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function generateCoachingInsight(passport: any, job: any) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY is missing from environment variables.");
  }

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const prompt = `You are an elite, highly intelligent Career Coach. 

Here is a candidate's verified Skill Passport (verified skills they possess):
${JSON.stringify(passport.skills || [], null, 2)}

Here is a live Job Opportunity they are looking at:
Title: ${job.title}
Company: ${job.org_name}
Description: ${job.description}

Do a strict, semantic analysis of the candidate's skills versus the job's requirements. 
Keep your response under 250 words. Format it beautifully in Markdown.

Include:
1. **Semantic Match Summary**: Why are they a fit? (E.g. if they know Python and the job wants Data Science, explain the connection).
2. **Strengths**: What verified skills make them stand out?
3. **Gap Analysis**: What critical skills are they missing, and what should they learn next to guarantee an interview?

Do NOT be overly positive. Be realistic, sharp, and highly strategic.`;

  try {
    const { text } = await generateText({
      model: google(process.env.AI_MODEL || "gemini-2.5-flash"),
      prompt: prompt,
      temperature: 0.2, // Low temperature for factual, analytical reasoning
    });

    return text;
  } catch (error) {
    console.error("AI Coach generation failed:", error);
    throw new Error("Failed to generate coaching insight.");
  }
}
