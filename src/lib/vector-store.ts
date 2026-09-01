import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getAiCredentials } from "@/lib/ai-config";

// Embeddings run through the same provider config as every other AI call, so
// there is one base URL and one key to rotate. This file previously pinned
// "/api/v1" while the rest of the app used "/v1".
const { apiKey, baseURL } = getAiCredentials();
const aicredit = createOpenAI({ baseURL, apiKey });

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
