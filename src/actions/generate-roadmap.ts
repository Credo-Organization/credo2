"use server";

import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

export async function generateAiRoadmap(goalTitle: string, missingSkills: string[]) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch current passport to update
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("profile_id", user.id)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!passport) {
    throw new Error("No passport found. Generate one first.");
  }

  const apiKey = process.env.AI_API_KEY;
  let parsedRoadmap;

  if (!apiKey || apiKey === "your-ai-api-key") {
    // Fallback Mock for testing if no API key is provided
    console.warn("No valid AI_API_KEY provided. Using mocked roadmap.");
    parsedRoadmap = {
      learningOrder: missingSkills.map((skill, index) => ({
        step: index + 1,
        skill: skill,
        description: `Learn the fundamentals of ${skill} and build small functional components.`
      })),
      suggestedProject: {
        title: `${goalTitle} Capstone Project`,
        description: `A comprehensive project utilizing ${missingSkills.join(", ")}.`,
        features: ["Authentication", "Database Integration", "Responsive UI"]
      }
    };
  } else {
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are an expert technical career coach. The user wants to become a ${goalTitle}.
They already have some skills, but they are missing the following critical skills: ${missingSkills.join(", ")}.

Generate a learning roadmap in strictly valid JSON format matching this schema:
{
  "learningOrder": [
    {
      "step": number, // chronological order
      "skill": "string",
      "description": "string" // brief 1-sentence description of what to focus on
    }
  ],
  "suggestedProject": {
    "title": "string",
    "description": "string",
    "features": ["string"] // 3-4 key features they must build to practice the missing skills
  }
}

Do not include markdown blocks or any other text. Output ONLY valid JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
      });

      const responseText = response.text?.replace(/```json/g, "").replace(/```/g, "").trim() || "{}";
      parsedRoadmap = JSON.parse(responseText);
    } catch (e: any) {
      console.error("AI Generation Error:", e);
      throw new Error("Failed to generate AI roadmap. " + e.message);
    }
  }

  // Append to passport snapshot_data
  const updatedSnapshot = {
    ...passport.snapshot_data,
    roadmap: parsedRoadmap
  };

  const { error: updateError } = await supabase
    .from("passports")
    .update({ snapshot_data: updatedSnapshot })
    .eq("id", passport.id);

  if (updateError) {
    throw new Error("Failed to save roadmap to passport.");
  }

  revalidatePath("/roadmap");
  return { success: true, roadmap: parsedRoadmap };
}
