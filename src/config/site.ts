export const siteConfig = {
  name: "Minskey",
  description:
    "AI-powered Skill Passport that transforms your GitHub activity and certifications into an evidence-backed professional identity.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  creator: "Minskey",
  keywords: [
    "skill passport",
    "github analysis",
    "career roadmap",
    "skill verification",
    "professional identity",
    "student portfolio",
    "internship",
    "skill gap analysis",
  ],
  links: {
    github: "https://github.com/soumxyz/minskey",
  },
} as const;
