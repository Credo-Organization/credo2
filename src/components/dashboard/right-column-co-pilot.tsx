"use client";

import React, { useState } from "react";
import { SkillGapMatrix, SkillGapItem } from "@/components/dashboard/skill-gap-matrix";
import { AiMentorConsole } from "@/components/dashboard/ai-mentor-console";
import { MentorContext } from "@/actions/ai-mentor";

import { careerGoals } from "@/config/career-goals";

interface RightColumnCoPilotProps {
  careerGoal: string;
  studentName: string;
  verifiedSkills: { name: string; confidence: "High" | "Medium" | "Low" }[];
  missingSkillsAnalysis?: {
    description?: string;
    recommendedTechStack?: string[];
    suggestedProjects?: { name: string; description: string }[];
  };
  githubRepos: number;
  certificates: number;
}

const SKILL_NAME_MAP: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  nextjs: "Next.js",
  tailwindcss: "TailwindCSS",
  git: "Git",
  nodejs: "Node.js",
  python: "Python",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  "rest-api": "REST APIs",
  docker: "Docker",
  linux: "Linux",
  "react-native": "React Native",
  flutter: "Flutter",
  swift: "Swift",
  kotlin: "Kotlin",
  firebase: "Firebase",
  pandas: "Pandas",
  numpy: "NumPy",
  "scikit-learn": "Scikit-Learn",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  kubernetes: "Kubernetes",
  mlops: "MLOps",
  sql: "SQL",
  statistics: "Statistics",
  jupyter: "Jupyter Notebooks",
  aws: "AWS",
  terraform: "Terraform",
  "ci-cd": "CI/CD",
  figma: "Figma",
  prototyping: "Prototyping",
  "user-research": "User Research",
  wireframing: "Wireframing",
  "design-systems": "Design Systems",
};

export function RightColumnCoPilot({
  careerGoal,
  studentName,
  verifiedSkills,
  missingSkillsAnalysis,
  githubRepos,
  certificates,
}: RightColumnCoPilotProps) {
  const [selectedGapPrompt, setSelectedGapPrompt] = useState<string | null>(null);

  // Normalize verified skill names to lower-case set
  const verifiedLower = new Set(
    (verifiedSkills || []).map((s) => s.name.toLowerCase().trim())
  );

  // Find matching career goal benchmarks
  const lowerGoal = (careerGoal || "").toLowerCase();
  const matchedGoal =
    careerGoals.find(
      (g) =>
        lowerGoal.includes(g.title.toLowerCase()) ||
        lowerGoal.includes(g.slug) ||
        g.title.toLowerCase().includes(lowerGoal)
    ) ||
    (lowerGoal.includes("ai") || lowerGoal.includes("ml") || lowerGoal.includes("machine")
      ? careerGoals.find((g) => g.id === "ml-engineer")
      : lowerGoal.includes("data")
      ? careerGoals.find((g) => g.id === "data-scientist")
      : lowerGoal.includes("back")
      ? careerGoals.find((g) => g.id === "backend-dev")
      : lowerGoal.includes("front")
      ? careerGoals.find((g) => g.id === "frontend-dev")
      : careerGoals.find((g) => g.id === "fullstack-dev")) ||
    careerGoals[0];

  // Derive unverified required skills from the chosen pathway
  const requiredList = matchedGoal?.requiredSkills || [];
  const dynamicMissing = requiredList
    .map((slug) => SKILL_NAME_MAP[slug] || slug.charAt(0).toUpperCase() + slug.slice(1))
    .filter((name) => !verifiedLower.has(name.toLowerCase()));

  // If server provided custom recommended tech stack, use it, otherwise use dynamic goal gaps
  const recommendedTech = missingSkillsAnalysis?.recommendedTechStack?.length
    ? missingSkillsAnalysis.recommendedTechStack.filter((t) => !verifiedLower.has(t.toLowerCase()))
    : dynamicMissing.length > 0
    ? dynamicMissing.slice(0, 4)
    : [];

  const missingSkillsList: SkillGapItem[] = recommendedTech.map((tech, idx) => ({
    name: tech,
    category: idx < 2 ? "critical" : "recommended",
    rationale:
      idx === 0
        ? `Core prerequisite for ${careerGoal || "Software Engineering"} pipeline`
        : idx === 1
        ? "Essential architecture standard for modern production environments"
        : "High-value differentiator for competitive roles and portfolio audits",
  }));

  const mentorContext: MentorContext = {
    studentName,
    careerGoal,
    verifiedSkills: verifiedSkills.map((s) => s.name),
    missingSkills: missingSkillsList.map((g) => g.name),
    githubRepos,
    certificates,
    recentProjects: missingSkillsAnalysis?.suggestedProjects?.map((p) => p.name) || [],
  };

  const handleAskMentorForGap = (gapName: string) => {
    setSelectedGapPrompt(gapName);
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-start gap-5 pr-1 pb-4">
      {/* SECTION 1: The Skill Gap (What the student is lagging in) */}
      <SkillGapMatrix
        careerGoal={careerGoal}
        verifiedSkills={verifiedSkills}
        missingSkillsList={missingSkillsList}
        gapDescription={missingSkillsAnalysis?.description}
        onAskMentorForGap={handleAskMentorForGap}
      />

      {/* SECTION 2: Interactive AI Mentor (Live Career Co-Pilot) */}
      <AiMentorConsole
        context={mentorContext}
        initialQuery={selectedGapPrompt}
      />
    </div>
  );
}
