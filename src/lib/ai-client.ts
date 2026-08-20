import { createOpenAI } from "@ai-sdk/openai";

// 1. Initialize the AI Provider globally using OpenRouter
const openRouter = createOpenAI({
  baseURL: "https://aicredits.in/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

// 2. Export standardized models for cost-effectiveness and stability
// We standardize on a fast, cheap model through OpenRouter
export const aiModel = openRouter("openai/gpt-4o-mini");
export const multimodalModel = openRouter("openai/gpt-4o-mini");

