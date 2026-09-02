export type ApplicationStage = 
  | "dispatched"
  | "audited"
  | "shortlisted"
  | "interview"
  | "offered"
  | "rejected";

export interface TimelineEvent {
  timestamp: string;
  label: string;
  detail?: string;
  actor: "student" | "recruiter" | "gitproof";
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary?: string;
  matchScore: number;
  passportId: string;
  appliedAt: string;
  status: ApplicationStage;
  gitProofScore?: number;
  verifiedSkills?: string[];
  notes?: string;
  recruiterNotes?: string;
  interviewDate?: string;
  timeline?: TimelineEvent[];
}
