"use server";



import { coachModel } from "@/lib/ai-client";
import { generateText } from "ai";

export async function generateCoachingInsight(passport: any, job: any) {
  try {
    const userSkills = passport?.skills || [];
    const skillNames = userSkills.map((s: any) => s.name).join(", ");
    
    const { text } = await generateText({
      model: coachModel,
      system: "You are an expert career coach helping a junior developer land a job.",
      prompt: `Analyze this candidate's fit for this specific role.
      
      Role: ${job.title} at ${job.org_name}
      Job Description: ${job.description}
      
      Candidate's Current Verified Skills: ${skillNames || "None"}
      
      Write a highly encouraging, 3-paragraph semantic gap analysis explaining:
      1. Why they are a good fit for this role based on their current skills.
      2. Exactly what they need to learn to be a PERFECT match (the gap).
      3. A specific, actionable next step.
      
      Format with markdown headings and bold text.`
    });

    return text;

  } catch (error: any) {
    console.error("AI Coach generation failed:", error);
    throw new Error(error.message || "Failed to generate coaching insight.");
  }
}
