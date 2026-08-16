"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setAiProvider(provider: "gemini" | "xai") {
  const cookieStore = await cookies();
  // Set the cookie to expire in 1 year
  cookieStore.set("ai_provider", provider, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  
  revalidatePath("/settings");
  revalidatePath("/certificates"); // Where extraction happens
  
  return { success: true };
}

export async function getAiProvider(): Promise<"gemini" | "xai"> {
  const cookieStore = await cookies();
  const provider = cookieStore.get("ai_provider")?.value;
  return provider === "xai" ? "xai" : "gemini";
}
