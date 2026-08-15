require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { extractClaimsFromText } = require('./src/lib/extractor/document-extractor');

const sampleResume = `
SUBHAM KUMAR - Full Stack Developer
Experience:
- Developed web application using React, Next.js, and TypeScript.
- Integrated PostgreSQL database with Supabase and Prisma ORM.
- Configured CI/CD deployment pipelines using Docker and GitHub Actions.

Skills:
- JavaScript, Python, Node.js, Tailwind CSS
`;

async function testExtractor() {
  console.log("Testing Document Extractor Agent with Gemini...");
  try {
    const res = await extractClaimsFromText(sampleResume, "resume");
    console.log("Extraction Succeeded!");
    console.log("Extracted Claims:", JSON.stringify(res.claims, null, 2));
  } catch (err) {
    console.error("Test Failed:", err);
  }
}

testExtractor();
