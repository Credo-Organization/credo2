# Credify: AI-Driven Verifiable Skill Passport 🚀

Credify is a next-generation career identity platform built for the **Smart India Hackathon (SIH)**. It bridges the gap between academic credentials and industry requirements by generating cryptographically secure, AI-verified "Skill Passports." 

By connecting their GitHub and uploading certificates, students receive a verifiable portfolio that automatically matches them to live job opportunities and generates real-time AI roadmaps to close their skill gaps.

## ✨ Core Architecture & Features

### 1. Enterprise AI Document Extraction Engine
A highly optimized extraction pipeline that parses resumes and certificates to extract verified skills.
* **Vercel AI SDK Integration**: Strictly typed JSON schema extraction seamlessly supporting **Google Gemini** and **xAI (Grok)**.
* **Intelligent Chunking**: Safely parses massive multi-page documents by processing paragraph chunks concurrently via `Promise.all()`.
* **Zero-Dependency Hallucination Prevention**: Features a custom lightning-fast alphanumeric normalizer that verifies LLM output against the source text to prevent AI hallucinations.
* **Semantic DB Caching**: Generates SHA-256 hashes of document content to instantly return cached extractions from Supabase, driving API costs to zero for duplicates.

### 2. Autonomous Job Matching Agent
Matches students to live, hyper-local opportunities.
* **Deterministic Matching**: Cross-references the 296-skill canonical taxonomy to accurately calculate compatibility scores between the student's Passport and live industry jobs.
* **Dynamic Geolocation**: Automatically injects the user's country/location from their Passport profile to fetch highly relevant roles.
* **Resilient Infrastructure**: Gracefully handles Rate Limits (HTTP 429) via RapidAPI/JSearch with beautiful empty-state UI fallbacks and simulated local mock data.

### 3. Real-Time AI Skill Gap Roadmap
* **Streaming AI Generation**: Uses the `@ai-sdk/react` `useObject` hook to stream a personalized career timeline directly to the UI, bypassing Vercel's 15-second serverless timeout limitations.
* **Context-Aware**: Analyzes the specific delta between the user's current verified skills and the requirements of their targeted roles.

### 4. Database Security & Scalability
* **Supabase PostgreSQL**: Fully integrated with custom tables for `passports`, `evidence`, `evidence_claims`, and `extraction_cache`.
* **Enterprise Indexing**: Utilizes B-Tree indexes (e.g., `idx_passports_profile_id`) to ensure O(log n) lookups at scale.
* **Row Level Security (RLS)**: Strictly enforced backend policies guarantee that users can only insert or modify evidence claims that belong to their cryptographically signed profile.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
* **Database & Auth**: [Supabase](https://supabase.com/)
* **AI Orchestration**: [Vercel AI SDK](https://sdk.vercel.ai/) (`@ai-sdk/google`, `@ai-sdk/openai`)
* **External APIs**: GitHub REST API, RapidAPI (JSearch)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Credo-Organization/credo2.git
cd credo2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with the required keys:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Providers
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash
XAI_API_KEY=your_xai_api_key

# Job Matching API
JSEARCH_RAPIDAPI_KEY=your_rapidapi_key
```

### 4. Database Setup
Copy the contents of `supabase-schema.sql` and run it in your Supabase SQL Editor to provision the required tables, RLS policies, and indexes.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

*Designed & Engineered for SIH.*
