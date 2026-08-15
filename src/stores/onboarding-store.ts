import { create } from "zustand";

export interface PersonalInfo {
  full_name: string;
  country: string;
  college_name: string;
  degree: string;
  graduation_year: string;
}

interface OnboardingState {
  step: number;
  personalInfo: PersonalInfo | null;
  careerGoalSlug: string | null;
  setStep: (step: number) => void;
  setPersonalInfo: (info: PersonalInfo) => void;
  setCareerGoalSlug: (slug: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  personalInfo: null,
  careerGoalSlug: null,
  setStep: (step) => set({ step }),
  setPersonalInfo: (info) => set({ personalInfo: info }),
  setCareerGoalSlug: (slug) => set({ careerGoalSlug: slug }),
  reset: () => set({ step: 1, personalInfo: null, careerGoalSlug: null }),
}));
