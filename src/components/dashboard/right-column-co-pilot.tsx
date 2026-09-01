"use client";

import React, { useState } from "react";
import { SkillGapMatrix, SkillGapItem } from "@/components/dashboard/skill-gap-matrix";
import { AiMentorConsole } from "@/components/dashboard/ai-mentor-console";
import { MentorContext } from "@/actions/ai-mentor";

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

export function RightColumnCoPilot({
  careerGoal,
  studentName,
  verifiedSkills,
  missingSkillsAnalysis,
  githubRepos,
  certificates,
}: RightColumnCoPilotProps) {
  const [selectedGapPrompt, setSelectedGapPrompt] = useState<string | null>(null);

  // Formulate missing skills list from recommended tech stack or defaults
  const recommendedTech = missingSkillsAnalysis?.recommendedTechStack?.length
    ? missingSkillsAnalysis.recommendedTechStack
    : [
        "PostgreSQL",
        "Go",
        "Docker",
        "GraphQL",
      ];

  const missingSkillsList: SkillGapItem[] = recommendedTech.map((tech, idx) => ({
    name: tech,
    category: idx < 2 ? "critical" : "recommended",
    rationale: idx === 0 
      ? "Core prerequisite for backend scalability & data pipelines" 
      : idx === 1 
      ? "Standard production deployment & microservice requirement" 
      : "High-value differentiator for modern AI & web architectures",
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
