import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "../lib/vector-store";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyJobs = [
  {
    role_title: "Full Stack React Engineer",
    industry: "Tech",
    required_skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js"],
    description: "Build scalable web applications using React, Next.js, and Postgres.",
  },
  {
    role_title: "AI/ML Python Engineer",
    industry: "AI Startup",
    required_skills: ["Python", "PyTorch", "TensorFlow", "LangChain", "SQL"],
    description: "Develop machine learning models and LLM agents using Python and PyTorch.",
  },
  {
    role_title: "Data Analyst",
    industry: "Finance",
    required_skills: ["SQL", "Python", "Tableau", "Excel", "Pandas"],
    description: "Analyze financial data and build dashboards using SQL and Tableau.",
  },
  {
    role_title: "Frontend Developer (Vue)",
    industry: "E-commerce",
    required_skills: ["Vue.js", "JavaScript", "HTML", "CSS", "Tailwind"],
    description: "Create pixel-perfect e-commerce storefronts using Vue.js.",
  },
  {
    role_title: "DevOps Engineer",
    industry: "Cloud Infrastructure",
    required_skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
    description: "Manage cloud infrastructure and deployment pipelines on AWS.",
  }
];

async function seedJobs() {
  console.log("Seeding job requirements into pgvector...");

  for (const job of dummyJobs) {
    console.log(`Generating embedding for: ${job.role_title}`);
    const embedding = await generateEmbedding(`${job.role_title} ${job.description} ${job.required_skills.join(" ")}`);
    
    const { error } = await supabase
      .from("job_requirements")
      .insert({
        role_title: job.role_title,
        industry: job.industry,
        required_skills: job.required_skills,
        description: job.description,
        embedding: embedding
      });

    if (error) {
      console.error(`Error inserting ${job.role_title}:`, error);
    } else {
      console.log(`Successfully inserted ${job.role_title}`);
    }
  }

  console.log("Seeding complete!");
}

seedJobs().catch(console.error);
