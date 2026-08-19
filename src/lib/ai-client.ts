import { createOpenAI } from "@ai-sdk/openai";

// 1. Initialize the AI Provider globally
const aicredit = createOpenAI({
  baseURL: "https://aicredits.in/api/v1",
  apiKey: process.env.AICREDIT_API_KEY || "sk-live-3c1d02c99d29fbf0b826af39454c2944d7045dea6b4fe022f1ddbe72eaf05068",
});

// 2. Export standardized models for cost-effectiveness and stability
// We standardize on gpt-4o-mini for maximum speed and cost efficiency on the AICredits platform.

export const aiModel = aicredit("gpt-4o-mini");
export const multimodalModel = aicredit("gpt-4o-mini"); // gpt-4o-mini supports image inputs as well
