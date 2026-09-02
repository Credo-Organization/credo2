import { JobApplication, ApplicationStage } from "@/types/job-tracker";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "minskey_job_applications_v3";

export const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: "app-atl-01",
    company: "Atlassian",
    role: "AI & Distributed Systems Intern",
    location: "Bengaluru (Hybrid)",
    salary: "₹85,000 / mo",
    matchScore: 94,
    passportId: "CDY26S4611",
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "interview",
    gitProofScore: 98,
    verifiedSkills: ["TypeScript", "Python", "Docker", "Distributed Systems"],
    notes: "Applied via Minskey Verified Passport with cryptographically signed commits.",
    recruiterNotes: "Passed automated code integrity check (3/3 models agreed). Invited to 45m Technical Systems Round.",
    interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Passport Proof Dispatched",
        detail: "Blind cryptographic token generated and submitted to Atlassian Gateway.",
        actor: "student",
      },
      {
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        label: "GitProof Anti-Cheat Consensus Verified",
        detail: "3/3 AI consensus models verified 14 commits with 0% duplication.",
        actor: "gitproof",
      },
      {
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        label: "Recruiter Shortlisted Dossier",
        detail: "Lead SRE Engineer flagged portfolio as top 5% competency benchmark.",
        actor: "recruiter",
      },
      {
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        label: "Round 1 Technical Interview Scheduled",
        detail: "Virtual systems architecture session booked via Google Meet.",
        actor: "recruiter",
      },
    ],
  },
  {
    id: "app-rzp-02",
    company: "Razorpay",
    role: "Full-Stack Platform Engineer Intern",
    location: "Bengaluru (On-site)",
    salary: "₹70,000 / mo",
    matchScore: 89,
    passportId: "CDY26S4611",
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "shortlisted",
    gitProofScore: 95,
    verifiedSkills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    notes: "Focused on API architecture and database indexing proofs.",
    recruiterNotes: "Verified 8 public GitHub repos. Shortlisted by Core Payments Team.",
    timeline: [
      {
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Passport Dispatched",
        detail: "Application token verified by Razorpay campus recruitment hook.",
        actor: "student",
      },
      {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Evidence Audited",
        detail: "Automated repo audit scored 95/100 code originality.",
        actor: "gitproof",
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Candidate Shortlisted",
        detail: "Moving to hiring manager portfolio review.",
        actor: "recruiter",
      },
    ],
  },
  {
    id: "app-zpt-03",
    company: "Zepto",
    role: "Backend & Systems Infrastructure Intern",
    location: "Mumbai (Hybrid)",
    salary: "₹65,000 / mo",
    matchScore: 82,
    passportId: "CDY26S4611",
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "audited",
    gitProofScore: 92,
    verifiedSkills: ["Go", "Python", "Redis", "Kafka"],
    notes: "Instant blind dispatch via QR credential token.",
    recruiterNotes: "Cryptographic passport verified. Portfolio bundle under review by Talent Ops.",
    timeline: [
      {
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Application Received",
        detail: "Credentials verified on public Minskey ledger.",
        actor: "student",
      },
      {
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Codebase Integrity Passed",
        detail: "Zero plagiarism detected across 6 backend microservices.",
        actor: "gitproof",
      },
    ],
  },
  {
    id: "app-swg-04",
    company: "Swiggy",
    role: "Frontend Engineer Intern (Consumer App)",
    location: "Bengaluru (Hybrid)",
    salary: "₹60,000 / mo",
    matchScore: 78,
    passportId: "CDY26S4611",
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "dispatched",
    gitProofScore: 90,
    verifiedSkills: ["Next.js", "Tailwind CSS", "TypeScript", "UI/UX"],
    notes: "Submitted after completing Frontend Specialist benchmark.",
    recruiterNotes: "Application queued in applicant tracking feed.",
    timeline: [
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Proof Dispatched",
        detail: "Awaiting recruiter review batch.",
        actor: "student",
      },
    ],
  },
];

// Map Supabase DB Row to Client Interface
function mapDbRowToApplication(row: any): JobApplication {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location || "Remote / Hybrid",
    salary: row.salary || undefined,
    status: row.status,
    matchScore: row.match_score || 85,
    gitProofScore: row.gitproof_score || 95,
    passportId: row.passport_id || "CDY26S4611",
    verifiedSkills: row.verified_skills || [],
    notes: row.notes || undefined,
    recruiterNotes: row.recruiter_notes || undefined,
    interviewDate: row.interview_date || undefined,
    timeline: row.timeline || [],
    appliedAt: row.applied_at || new Date().toISOString(),
  };
}

// Fetch from Supabase with fallback to local cache
export async function syncApplicationsFromSupabase(): Promise<JobApplication[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return getStoredApplications();
    }

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("profile_id", user.id)
      .order("applied_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase fetch warning:", error?.message);
      return getStoredApplications();
    }

    if (data.length === 0) {
      // Seed default applications into Supabase for this user so their initial experience is populated
      for (const def of DEFAULT_APPLICATIONS) {
        await supabase.from("job_applications").insert({
          profile_id: user.id,
          company: def.company,
          role: def.role,
          location: def.location,
          salary: def.salary,
          status: def.status,
          match_score: def.matchScore,
          gitproof_score: def.gitProofScore,
          passport_id: def.passportId,
          verified_skills: def.verifiedSkills,
          notes: def.notes,
          recruiter_notes: def.recruiterNotes,
          interview_date: def.interviewDate,
          timeline: def.timeline,
          applied_at: def.appliedAt,
        });
      }
      return DEFAULT_APPLICATIONS;
    }

    const mapped = data.map(mapDbRowToApplication);
    saveStoredApplications(mapped);
    return mapped;
  } catch (err) {
    console.error("syncApplicationsFromSupabase error:", err);
    return getStoredApplications();
  }
}

export function getStoredApplications(): JobApplication[] {
  if (typeof window === "undefined") return DEFAULT_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
      return DEFAULT_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read applications from localStorage:", err);
    return DEFAULT_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: JobApplication[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    window.dispatchEvent(new Event("minskey-applications-updated"));
  } catch (err) {
    console.error("Failed to save applications to localStorage:", err);
  }
}

export async function addApplication(newApp: Omit<JobApplication, "id" | "appliedAt">): Promise<JobApplication> {
  const current = getStoredApplications();
  const created: JobApplication = {
    ...newApp,
    id: `app-${Date.now()}`,
    appliedAt: new Date().toISOString(),
    timeline: [
      {
        timestamp: new Date().toISOString(),
        label: "Proof Bundle Dispatched",
        detail: "Cryptographic credential token submitted via Minskey blind dispatch.",
        actor: "student",
      },
    ],
  };

  // Optimistic local update
  const updated = [created, ...current];
  saveStoredApplications(updated);

  // Async persist to Supabase
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase.from("job_applications").insert({
        profile_id: user.id,
        company: created.company,
        role: created.role,
        location: created.location,
        salary: created.salary,
        status: created.status,
        match_score: created.matchScore,
        gitproof_score: created.gitProofScore,
        passport_id: created.passportId,
        verified_skills: created.verifiedSkills,
        notes: created.notes,
        recruiter_notes: created.recruiterNotes,
        timeline: created.timeline,
        applied_at: created.appliedAt,
      }).select().single();

      if (data) {
        created.id = data.id;
      }
    }
  } catch (err) {
    console.error("Failed to persist application to Supabase:", err);
  }

  return created;
}

export async function updateApplicationStage(id: string, newStatus: ApplicationStage): Promise<void> {
  const current = getStoredApplications();
  const stageLabels: Record<ApplicationStage, string> = {
    dispatched: "Application Dispatched",
    audited: "Evidence Audited by GitProof",
    shortlisted: "Shortlisted by Hiring Team",
    interview: "Technical Interview Scheduled",
    offered: "Offer Extended",
    rejected: "Archived Application",
  };

  const newTimelineEvent = {
    timestamp: new Date().toISOString(),
    label: stageLabels[newStatus],
    detail: `Candidate status transitioned to ${newStatus.toUpperCase()}`,
    actor: (newStatus === "dispatched" ? "student" : "recruiter") as "student" | "recruiter",
  };

  let targetApp: JobApplication | undefined;

  const updated = current.map((app) => {
    if (app.id !== id) return app;
    targetApp = {
      ...app,
      status: newStatus,
      timeline: [newTimelineEvent, ...(app.timeline || [])],
    };
    return targetApp;
  });

  saveStoredApplications(updated);

  // Sync update to Supabase
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && targetApp) {
      // If the ID is a UUID, update in Supabase
      if (id.includes("-") && id.length > 20 && !id.startsWith("app-")) {
        await supabase
          .from("job_applications")
          .update({
            status: newStatus,
            timeline: targetApp.timeline,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("profile_id", user.id);
      }
    }
  } catch (err) {
    console.error("Failed to sync stage update to Supabase:", err);
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const current = getStoredApplications();
  const updated = current.filter((app) => app.id !== id);
  saveStoredApplications(updated);

  // Sync delete to Supabase
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && !id.startsWith("app-")) {
      await supabase
        .from("job_applications")
        .delete()
        .eq("id", id)
        .eq("profile_id", user.id);
    }
  } catch (err) {
    console.error("Failed to delete application from Supabase:", err);
  }
}
