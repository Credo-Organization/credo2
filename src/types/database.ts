// ─── Database Types ───
// These map to the Supabase PostgreSQL schema

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  username: string | null;
  bio: string | null;
  headline: string | null;
  country: string | null;
  college_name: string | null;
  degree: string | null;
  graduation_year: string | null;
  experience_level: "beginner" | "intermediate" | "advanced" | null;
  onboarding_completed: boolean;
  github_connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerGoalRecord {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  required_skills: string[];
  created_at: string;
}

export interface ProfileCareerGoal {
  profile_id: string;
  goal_id: number;
  priority: number;
  selected_at: string;
}

export interface GitHubConnection {
  id: number;
  profile_id: string;
  github_user_id: number;
  github_username: string;
  access_token: string;
  avatar_url: string | null;
  profile_url: string | null;
  public_repos: number | null;
  followers: number | null;
  following: number | null;
  connected_at: string;
  last_synced_at: string | null;
  sync_status: "pending" | "syncing" | "completed" | "failed";
}

export interface GitHubRepo {
  id: number;
  connection_id: number;
  github_repo_id: number;
  name: string;
  full_name: string;
  description: string | null;
  is_fork: boolean;
  is_private: boolean;
  primary_language: string | null;
  stars_count: number;
  forks_count: number;
  open_issues: number;
  total_commits: number | null;
  last_commit_at: string | null;
  topics: string[];
  created_at: string | null;
  updated_at: string | null;
  synced_at: string;
}

export interface RepoLanguage {
  id: number;
  repo_id: number;
  language: string;
  bytes: number;
  percentage: number | null;
}

export interface Certificate {
  id: number;
  profile_id: string;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  file_url: string;
  file_type: string | null;
  thumbnail_url: string | null;
  parsed: boolean;
  parsed_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  slug: string;
  name: string;
  category: "language" | "framework" | "tool" | "soft-skill" | "database" | "platform";
  subcategory: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface UserSkill {
  id: number;
  profile_id: string;
  skill_id: number;
  proficiency: number;
  proficiency_label: "novice" | "beginner" | "intermediate" | "advanced" | "expert" | null;
  evidence_count: number;
  github_signal: number | null;
  cert_signal: number | null;
  last_analyzed: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  skill?: Skill;
  evidence?: SkillEvidence[];
}

export interface SkillEvidence {
  id: number;
  user_skill_id: number;
  source_type: "github_repo" | "github_commit" | "github_language" | "certificate";
  source_id: string;
  source_name: string;
  source_url: string | null;
  strength: number | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface Passport {
  id: string;
  profile_id: string;
  version: number;
  status: "draft" | "published" | "archived";
  is_public: boolean;
  title: string | null;
  summary: string | null;
  generated_at: string;
  published_at: string | null;
  snapshot_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  passport_skills?: PassportSkill[];
}

export interface PassportSkill {
  id: number;
  passport_id: string;
  skill_id: number | null;
  skill_name: string;
  proficiency: number | null;
  evidence_summary: string | null;
  display_order: number;
}

export interface Roadmap {
  id: string;
  profile_id: string;
  career_goal_id: number | null;
  title: string;
  summary: string | null;
  total_milestones: number;
  completed_milestones: number;
  estimated_weeks: number | null;
  generated_at: string;
  created_at: string;
  updated_at: string;
  // Joined relations
  milestones?: RoadmapMilestone[];
}

export interface RoadmapMilestone {
  id: number;
  roadmap_id: string;
  title: string;
  description: string | null;
  skill_id: number | null;
  milestone_order: number;
  status: "pending" | "in_progress" | "completed" | "skipped";
  estimated_hours: number | null;
  completed_at: string | null;
  created_at: string;
  // Joined relations
  resources?: MilestoneResource[];
}

export interface MilestoneResource {
  id: number;
  milestone_id: number;
  title: string;
  url: string;
  resource_type: "course" | "tutorial" | "documentation" | "video" | "article" | "project";
  provider: string | null;
  is_free: boolean;
  display_order: number;
}
