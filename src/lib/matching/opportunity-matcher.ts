import fs from "fs";
import path from "path";
import { fetchLiveOpportunities } from "./linkedin-jobs";

export interface OpportunityRequirement {
  skill_id: string;
  skill_name: string;
  weight: number;
  is_critical: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  org_name: string;
  location: string;
  duration: string;
  description: string;
  is_demo: boolean;
  requirements: OpportunityRequirement[];
}

export interface MatchResult {
  opportunity: Opportunity;
  matchScore: number;
  matchedSkills: OpportunityRequirement[];
  missingSkills: OpportunityRequirement[];
}

export async function matchPassportToLiveOpportunities(passportSnapshot: any): Promise<MatchResult[]> {
  const rapidApiKey = process.env.JSEARCH_RAPIDAPI_KEY;
  const opportunities = await fetchLiveOpportunities(passportSnapshot, rapidApiKey);
  
  if (!opportunities.length) return [];
  
  // Extract user skills from passport snapshot
  const userSkills = passportSnapshot?.skills || [];
  
  // Create a fast lookup map. We rely STRICTLY on skill_id for deterministic matching.
  const userSkillIds = new Set(userSkills.map((s: any) => s.skill_id).filter(Boolean));

  const results: MatchResult[] = opportunities.map(opp => {
    let totalWeight = 0;
    let earnedWeight = 0;
    const matchedSkills: OpportunityRequirement[] = [];
    const missingSkills: OpportunityRequirement[] = [];

    opp.requirements.forEach(req => {
      totalWeight += req.weight;
      
      const match = req.skill_id && userSkillIds.has(req.skill_id);
      
      if (match) {
        earnedWeight += req.weight;
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    const matchScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

    return {
      opportunity: opp,
      matchScore,
      matchedSkills,
      missingSkills
    };
  });

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
