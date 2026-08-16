import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

const roadmapSchema = z.object({
  learningOrder: z.array(z.object({
    step: z.number(),
    skill: z.string(),
    description: z.string()
  })),
  suggestedProject: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string())
  })
});

export async function POST(req: Request) {
  const { goalTitle, missingSkills, passportId } = await req.json();

  if (!goalTitle || !missingSkills || !passportId) {
    return new Response('Missing required fields', { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const prompt = `You are an expert technical career coach. The user wants to become a ${goalTitle}.
They already have some skills, but they are missing the following critical skills: ${missingSkills.join(", ")}.

Generate a learning roadmap matching the JSON schema.
For 'learningOrder', provide chronologically ordered steps to learn each skill with a 1-sentence description.
For 'suggestedProject', design a capstone project utilizing the missing skills.`;

  const result = streamObject({
    model: google('gemini-2.5-pro'),
    schema: roadmapSchema,
    prompt: prompt,
    onFinish: async ({ object }) => {
      if (object) {
        // Automatically save to the database in the background after the stream finishes!
        const { data: passport } = await supabase
          .from("passports")
          .select("snapshot_data")
          .eq("id", passportId)
          .single();
          
        if (passport) {
          const updatedSnapshot = {
            ...passport.snapshot_data,
            roadmap: object
          };
          await supabase
            .from("passports")
            .update({ snapshot_data: updatedSnapshot })
            .eq("id", passportId);
        }
      }
    }
  });

  return result.toTextStreamResponse();
}
