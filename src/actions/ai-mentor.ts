"use server";

import { coachModel } from "@/lib/ai-client";
import { generateText } from "ai";

export interface MentorMessage {
  role: "user" | "assistant";
  content: string;
}

export interface MentorContext {
  studentName?: string;
  careerGoal?: string;
  verifiedSkills?: string[];
  missingSkills?: string[];
  githubRepos?: number;
  certificates?: number;
  recentProjects?: string[];
}

export async function askAiMentor(
  userQuery: string,
  context: MentorContext,
  history: MentorMessage[] = []
): Promise<string> {
  try {
    const verifiedSkillsStr = context.verifiedSkills?.join(", ") || "TypeScript, React, Python";
    const missingSkillsStr = context.missingSkills?.join(", ") || "Distributed Systems, Docker Orchestration, Vector DBs";
    const careerGoal = context.careerGoal || "AI Engineer";
    const studentName = context.studentName || "Candidate";

    const systemPrompt = `You are "Credo AI Mentor", a world-class Principal Staff Engineer and Senior Technical Career Coach.
You are coaching ${studentName}, who is actively preparing for an industry role as a "${careerGoal}".

Candidate Verified Profile:
- Target Role: ${careerGoal}
- Verified Core Skills: ${verifiedSkillsStr}
- Current Skill Gaps / Lagging Skills: ${missingSkillsStr}
- Verified GitHub Repos: ${context.githubRepos || 0}
- Verified Certificates: ${context.certificates || 0}

Your Style & Principles:
1. Ground every recommendation in their real verified skills and exact missing gaps.
2. Be direct, deeply technical, practical, and highly motivating.
3. When suggesting code architectures or projects, provide concrete directory structures, tech stack choices, or step-by-step milestones.
4. Format your responses with clean GitHub Markdown (headers, bullet points, bold keywords, and short code snippets where helpful).
5. Keep answers focused, high-density, and actionable (avoid generic fluff).`;

    const conversationHistoryStr = history
      .slice(-4)
      .map((m) => `${m.role === "user" ? "Student" : "Mentor"}: ${m.content}`)
      .join("\n\n");

    const fullPrompt = `${conversationHistoryStr ? `Recent Conversation:\n${conversationHistoryStr}\n\n` : ""}Student's Question: "${userQuery}"

Provide an actionable, encouraging, and structured mentor response.`;

    const { text } = await generateText({
      model: coachModel,
      system: systemPrompt,
      prompt: fullPrompt,
    });

    return text;
  } catch (error: any) {
    console.error("AI Mentor generation failed:", error);
    // Fallback contextual response if API key is rate-limited or offline
    const careerGoal = context.careerGoal || "AI Engineer";
    const missingTop = context.missingSkills?.[0] || "Distributed Systems";

    return `### 💡 Mentor Strategy for ${careerGoal}

Based on your verified skills (**${context.verifiedSkills?.slice(0, 3).join(", ") || "TypeScript, React"}**), you are well-positioned for junior to mid-level engineering pipelines!

#### 🎯 Highest-ROI Gap to Bridge: **${missingTop}**
1. **Week 1 Milestone:** Build a lightweight microservice or worker pool demonstrating asynchronous queue processing and Docker containerization.
2. **Portfolio Evidence:** Publish a clear architecture diagram on your GitHub repository README showing throughput metrics and error handling.
3. **Interview Highlight:** Be prepared to explain trade-offs between sync REST vs. async message queues.

*Feel free to ask for a specific code blueprint or interview simulation for this milestone!*`;
  }
}
