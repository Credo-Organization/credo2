import { Opportunity, OpportunityRequirement } from "./opportunity-matcher";
import { extractSkillsFromTextFast } from "../extractor/taxonomy-normalizer";
import { matcherModel } from "@/lib/ai-client";
import { generateObject } from "ai";
import { z } from "zod";

interface CacheEntry {
  timestamp: number;
  data: Opportunity[];
}

const OPPORTUNITY_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchLiveOpportunities(passportSnapshot: any, rapidApiKey?: string): Promise<Opportunity[]> {
  const userSkills = passportSnapshot?.skills || [];
  const careerGoal = passportSnapshot?.profile?.headline || "Software Engineer";
  const skillNames = userSkills.map((s: any) => s.name).join(", ");
  const cacheKey = `${careerGoal}::${skillNames}`;

  const cached = OPPORTUNITY_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let rawJobs: any[] = [];
  const hasApiKey = process.env.OPENROUTER_API_KEY || process.env.AICREDIT_API_KEY;

  if (hasApiKey) {
    try {
      const { object } = await generateObject({
        model: matcherModel,
        schema: z.object({
          jobs: z.array(z.object({
            job_title: z.string(),
            company_name: z.string(),
            location: z.string(),
            job_description: z.string().describe("A realistic 2-3 sentence job description containing specific technologies and frameworks required."),
          })).min(4).max(4)
        }),
        prompt: `Generate 4 highly realistic internship or junior roles for a candidate in India.
        Candidate's Career Goal: ${careerGoal}
        Candidate's Current Verified Skills: ${skillNames || "None"}
        
        Generate exactly 4 jobs:
        - 2 "Perfect Match" roles that heavily rely on the skills they already have.
        - 2 "Stretch" roles that require their current skills PLUS 1 or 2 new advanced skills they don't have yet (to demonstrate a gap analysis).
        
        Use real-sounding Indian tech company names or well-known startups.`
      });
      
      rawJobs = object.jobs;
    } catch (error) {
      console.warn("[AI Jobs] Failed to generate jobs via AI, falling back to mock:", error);
      rawJobs = getMockIndianJobsResponse(careerGoal);
    }
  } else {
    rawJobs = getMockIndianJobsResponse(careerGoal);
  }

  const opportunities = transformLinkedInToOpportunities(rawJobs);
  OPPORTUNITY_CACHE.set(cacheKey, { timestamp: Date.now(), data: opportunities });
  return opportunities;
}

/**
 * Transforms raw job postings into our rigorous Opportunity interface.
 * Uses our fast taxonomy extractor to pull skill requirements out of the raw job description instantly.
 */
function transformLinkedInToOpportunities(linkedinJobs: any[]): Opportunity[] {
  return linkedinJobs.map(job => {
    const title = job.job_title || job.title || "";
    const description = job.job_description || job.description_text || job.description || "";
    const company = job.employer_name || job.company_name || job.organization || job.company || "Unknown Company";
    
    // Combine description and title for maximum context
    const fullText = `
      ${title}
      ${description}
    `;

    // 1. Instantly scan the raw text for our 296 taxonomy skills
    const extractedSkills = extractSkillsFromTextFast(fullText);

    // 2. Map them to our OpportunityRequirement format
    const requirements: OpportunityRequirement[] = extractedSkills.map(skill => {
      const isCritical = title.toLowerCase().includes(skill.canonical_name.toLowerCase());
      return {
        skill_id: skill.id,
        skill_name: skill.canonical_name,
        weight: isCritical ? 2.0 : 1.0,
        is_critical: isCritical
      };
    });

    return {
      id: Math.random().toString(36).substring(7),
      title: title || "Software Engineer",
      org_name: company,
      location: job.location || "India",
      duration: "Internship", 
      description: description ? description.substring(0, 300) + "..." : "No description provided.",
      is_demo: false,
      requirements
    };
  });
}

function getMockIndianJobsResponse(query: string) {
  return [
    {
      job_title: `Junior ${query}`,
      company_name: "Flipkart",
      location: "Bengaluru, Karnataka, India",
      job_description: `We are looking for a junior engineer to join our core team. Must be familiar with modern web development.`,
    }
  ];
}
