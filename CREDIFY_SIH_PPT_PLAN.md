# 📊 Credify: SIH Presentation Slide Plan

I looked at how "Smart Bloom" won, and mapped our Credify project to their exact 6-slide structure. 

They won because they didn't use walls of text. They used flowcharts, small blocks of text, and kept the technical details easy to digest. Here is what you need to put on each slide:

---

## 🟢 Slide 1: Title & Team 
**What goes here:** Just the standard SIH requirements.
* **Project Title:** Credify - AI-Driven Verifiable Skill Passport
* **Problem Statement Code:** (Fill in your SIH problem code)
* **Team Name:** (Your Team Name)
* **Visuals:** Put the Credify logo here. Keep it clean and minimal.

---

## 🟢 Slide 2: Problem & Solution (Why build Credify?)
📸 **Layout Reference:** Look at the winner's slide titled **"Why Smart Bloom?" & "SmartBloom Solution"** for the layout.

**What goes here:**
1. **The Problem (Left side):**
   * Students collect random certificates, but recruiters don't trust them.
   * Anyone can use ChatGPT to fake a resume or a GitHub repo.
   * Students don't know what skills they actually need to learn to get hired.
2. **Why current tools fail (Middle):**
   * *LinkedIn:* Anyone can lie on it. Recruiters have to check everything manually.
   * *Standard ATS tools:* They just match keywords. They have no idea if a candidate can actually code.
3. **How Credify works (Right side flowchart):**
   * **Step 1:** Connect GitHub & upload certificates.
   * **Step 2:** AI extracts skills and locks them to a strict format (no hallucinations).
   * **Step 3:** Our Anti-Cheat LLM acts as a judge to catch fake work.
   * **Step 4:** The Matcher Agent connects verified skills to real jobs.
   * **Step 5:** An AI Coach tells the student exactly what to learn next.

---

## 🟢 Slide 3: Technical Approach
📸 **Layout Reference:** Look at the winner's slide titled **"Technical Approach"** (with the Methodologies flowchart) for the layout.

**What goes here:**
1. **What's new about this (Left side):**
   * *Smart architecture:* We split the fast Next.js UI from the heavy Python AI processing.
   * *LLM-as-a-Judge:* We use strict data schemas to catch cloned repos without guessing.
   * *In-Memory Search:* We do geographic job matching in under a millisecond without needing a heavy database.
2. **Tech Stack (Top Right):**
   * *Frontend:* Next.js 14, Framer Motion, Tailwind.
   * *Backend:* Python, FastAPI, Supabase.
   * *AI:* Gemini 2.5 Flash, Grok-2, LangGraph.
3. **The Architecture Flow (Bottom Row):**
   * Make 4 distinct blocks matching the reference style:
     * `[Auth & Data Entry]` -> Next.js OAuth & PDF parsing.
     * `[Background Queues]` -> Supabase async tasks (solves serverless timeouts).
     * `[AI Verification]` -> LLM repository audits.
     * `[Job Matching]` -> Cosine similarity mapping.
4. **Visual:** Put our architecture diagram here. Make it look sleek.

---

## 🟢 Slide 4: Feasibility and Viability
📸 **Layout Reference:** Look at the winner's slide titled **"Feasibility and Viability"** (with the Challenges & Solutions blocks) for the layout.

**What goes here:**
1. **Viability (Left side):**
   * *Zero maintenance:* The background queues run themselves. No admin needed.
   * *Scales easily:* The frontend and backend are decoupled, so they scale on their own.
   * *Cheap to run:* We use API aggregators and in-memory search to keep costs near zero.
2. **Feasibility (Top Right):**
   * *Standard hosting:* It runs on Vercel and Supabase, making deployment easy.
   * *Reliable:* If Gemini goes down, we instantly fail over to Grok so the app never breaks.
3. **Challenges we beat (Bottom Row):**
   * **Challenge:** Vercel kept timing out after 10 seconds during heavy AI tasks.
     * **Solution:** We built a custom polling queue in Supabase to run AI tasks in the background.
   * **Challenge:** The AI kept hallucinating fake skills.
     * **Solution:** We forced the LLM to use a strict taxonomy schema so it can only output real, recognized skills.

---

## 🟢 Slide 5: Impact and Benefits
📸 **Layout Reference:** Look at the winner's slide titled **"Impact and Benefits"** for the layout.

**What goes here:**
1. **The Impact (Left side):**
   * **For students:** Gives them a real, step-by-step plan to get hired.
   * **For recruiters:** Cuts technical screening time and costs way down.
   * **For the industry:** Kills resume fraud completely using AI repository analysis.
2. **The Benefits (Right side):**
   * *Always updated:* Connects to live job market data.
   * *Secure:* We use strict Row Level Security to protect user data.
   * *Easy to expand:* Our architecture makes it simple to plug in new AI agents later (like a mock interview bot).

---

## 🟢 Slide 6: Research and References
📸 **Layout Reference:** Look at the winner's slide titled **"Research and References"** for the layout.

**What goes here:**
1. **How it aligns with policy:**
   * **NEP 2020:** Fits perfectly with the push for skill-based education and verifiable digital passports.
   * **Digital India:** Pushes transparency in hiring.
2. **Links (Right side):**
   * Put QR codes here for:
     * **GitHub Repo** 
     * **Live Demo Video**
     * **Live Site URL**
3. **The Science:**
   * Mention that we based this on research around "LLM-as-a-Judge" and cosine similarity for vector search.

---

## 💡 Notes for the Presentation
1. **Keep it visual:** Break up text with colorful, rounded squares just like the winners did.
2. **Brag about Slide 3 & 4:** The judges love to see that you hit a wall and coded your way out of it. Loudly highlight how you bypassed the Vercel timeout issue and fixed AI hallucinations.
3. **Keep the colors matching:** Use Credify's light monochrome/glass aesthetic so the slides look like the app itself.

## 🔤 Typography & SIH Compliance
**CRITICAL RULE:** You must strictly follow the official SIH (Smart India Hackathon) template guidelines. 

* **Fonts:** Use exactly the font families and sizes provided in the official SIH template. Do not deviate to custom fonts, as this can lead to points being deducted for not following instructions.
* **The "CREDIFY" Title:** Keep it exactly as the template dictates.
* **Formatting Tip:** Even within the official fonts, you can still use **Bold** for headers and *Regular* for bullet points to maintain good visual hierarchy and readability without breaking the rules.
