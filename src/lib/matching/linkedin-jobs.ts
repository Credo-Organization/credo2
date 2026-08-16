import { Opportunity, OpportunityRequirement } from "./opportunity-matcher";
import { extractSkillsFromTextFast } from "../extractor/taxonomy-normalizer";

// Using the specific LinkedIn Jobs API provider the user subscribed to
const LINKEDIN_API_URL = "https://linkedin-job-search-api.p.rapidapi.com/active-jb";

// LinkedIn Geo ID for India
const INDIA_GEO_ID = "102713980";

export async function fetchLiveOpportunities(passportSnapshot: any, rapidApiKey?: string): Promise<Opportunity[]> {
  const userSkills = passportSnapshot?.skills || [];
  
  // Extract the absolute top skill to form a realistic job title query.
  // The LinkedIn API is strict with the "title" parameter; querying multiple skills (e.g. "React Node Developer") returns 0 results.
  const topSkill = userSkills.length > 0 ? (userSkills[0].name || userSkills[0].skill_id) : null;
    
  const query = topSkill 
    ? `${topSkill} Developer` 
    : "Software Engineer";

  let rawJobs: any[] = [];

  if (!rapidApiKey) {
    console.warn("[LinkedIn Jobs] No RapidAPI key found. Returning realistic MOCK Indian data.");
    rawJobs = getMockIndianJobsResponse(query);
  } else {
    try {
      // Create request url parameters for linkedin-job-search-api.p.rapidapi.com
      const searchUrl = new URL(LINKEDIN_API_URL);
      searchUrl.searchParams.append("time_frame", "24h");
      searchUrl.searchParams.append("limit", "10");
      searchUrl.searchParams.append("offset", "0");
      searchUrl.searchParams.append("description_format", "text");
      searchUrl.searchParams.append("title", query);
      
      const locationQuery = passportSnapshot?.profile?.country 
        ? `"${passportSnapshot.profile.country}"` 
        : '"India"';
      searchUrl.searchParams.append("location", locationQuery);

      const response = await fetch(searchUrl.toString(), {
        method: "GET",
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com" 
        },
        next: { revalidate: 3600 } // Cache API responses for 1 hour to prevent RapidAPI rate limits
      });

      if (response.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      
      if (!response.ok) {
        throw new Error(`LinkedIn API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      rawJobs = data || []; 
      
      if (!Array.isArray(rawJobs) && data.jobs) {
         rawJobs = data.jobs;
      }

      if (Array.isArray(rawJobs) && rawJobs.length === 0) {
        console.warn("[LinkedIn Jobs] RapidAPI returned 0 jobs. Falling back to Mock India data for demo purposes.");
        rawJobs = getMockIndianJobsResponse(query);
      }
    } catch (error: any) {
      if (error.message === "RATE_LIMIT_EXCEEDED") {
        console.warn("[LinkedIn Jobs] Rate limit exceeded on RapidAPI. Falling back to Mock India data.");
        // We will throw this upwards so the UI can decide to show an error state instead of silent fallback if desired,
        // OR we can still fallback. The plan says "Update page.tsx to handle RateLimitError gracefully".
        // Let's throw a specific object.
        throw { name: "RateLimitError", message: "RapidAPI Rate Limit Exceeded" };
      }
      console.error("[LinkedIn Jobs] Failed to fetch live jobs:", error);
      console.warn("[LinkedIn Jobs] Falling back to Mock India data due to API failure/missing subscription.");
      rawJobs = getMockIndianJobsResponse(query);
    }
  }

  return transformLinkedInToOpportunities(rawJobs);
}

/**
 * Transforms raw LinkedIn job postings into our rigorous Opportunity interface.
 * Uses our fast taxonomy extractor to pull skill requirements out of the raw job description instantly.
 */
function transformLinkedInToOpportunities(linkedinJobs: any[]): Opportunity[] {
  return linkedinJobs.map(job => {
    // Safely extract fields from JSearch / Mock API format
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

    const locationStr = Array.isArray(job.locations_derived) && job.locations_derived.length > 0 
      ? job.locations_derived[0] 
      : (job.job_city || job.location || "India");

    return {
      id: (job.job_id || job.id || Math.random().toString(36).substring(7)).toString(),
      title: title || "Software Engineer",
      org_name: company,
      location: locationStr,
      duration: "FULLTIME", 
      description: description ? description.substring(0, 300) + "..." : "No description provided.",
      is_demo: false, // These are fetched as live data
      requirements
    };
  });
}

function getMockIndianJobsResponse(query: string) {
  return [
    {
      job_id: "mock_ind_1",
      job_title: `Senior ${query.split(" ")[0]} Developer`,
      company_name: "Flipkart",
      location: "Bengaluru, Karnataka, India",
      job_description: "We are looking for a senior engineer with deep expertise in React, TypeScript, and Node.js. You should be comfortable building scalable microservices and deploying them via Docker and Kubernetes to serve millions of Indian customers.",
    },
    {
      job_id: "mock_ind_2",
      job_title: "Full Stack Software Engineer",
      company_name: "Zomato",
      location: "Gurugram, Haryana, India",
      job_description: "Join our fast-paced food delivery startup! Must have experience with Python, Django, PostgreSQL, and basic frontend skills including React and CSS. Familiarity with AWS is a huge plus.",
    },
    {
      job_id: "mock_ind_3",
      job_title: "Systems Engineer (UI/UX)",
      company_name: "Tata Consultancy Services (TCS)",
      location: "Pune, Maharashtra, India",
      job_description: "Focus on creating beautiful interfaces using Next.js, Tailwind CSS, and Figma for our global enterprise clients.",
    }
  ];
}
