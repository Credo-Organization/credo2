import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import { createClient } from "@/lib/supabase/server";

// We use AICredits platform for cost-effective embeddings
const aicredit = createOpenAI({
  baseURL: "https://aicredits.in/api/v1",
  apiKey: process.env.AICREDIT_API_KEY || "sk-live-3c1d02c99d29fbf0b826af39454c2944d7045dea6b4fe022f1ddbe72eaf05068",
});

const embeddingModel = aicredit.embedding("text-embedding-3-small");

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

export async function searchJobRequirements(careerGoal: string, limit: number = 3) {
  // 1. Generate an embedding for the user's career goal
  const queryEmbedding = await generateEmbedding(careerGoal);

  const supabase = await createClient();

  // 2. Query the pgvector matching RPC
  const { data: matchedJobs, error } = await supabase.rpc("match_job_requirements", {
    query_embedding: queryEmbedding,
    match_threshold: 0.3, // 70% similarity threshold (1 - distance)
    match_count: limit,
  });

  if (error) {
    console.error("[VectorStore] Search failed:", error);
    return [];
  }

  return matchedJobs;
}
