"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SquadMember {
  name: string;
  role: string;
  skills: string[];
}

export interface Squad {
  id: string;
  name: string;
  track: string;
  problem: string;
  leader: string;
  avatar: string;
  current_members: SquadMember[];
  open_roles: string[];
  required_skills: string[];
  max_members: number;
  discord?: string;
  github_repo?: string;
  synergy_score?: number;
  matched_skills?: string[];
  complementary_note?: string;
}

const BENCHMARK_SHOWCASE_SQUADS: Squad[] = [
  {
    id: "squad-01",
    name: "NeuralForge AI",
    track: "Smart Automation & AI",
    problem: "Autonomous code synthesis, runtime AST analysis & automatic vulnerability repair pipeline for developer tooling.",
    leader: "Arjun Mehta (IIT Bombay)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    current_members: [
      { name: "Arjun M.", role: "ML Lead", skills: ["PyTorch", "Python", "HuggingFace"] },
      { name: "Sneha P.", role: "UI/UX", skills: ["Figma", "React", "TailwindCSS"] }
    ],
    open_roles: ["Backend & LangGraph Architect", "DevOps & Cloud Engineer"],
    required_skills: ["FastAPI", "Python", "Docker", "PostgreSQL", "LangGraph"],
    max_members: 4,
    discord: "discord.gg/neuralforge",
    github_repo: "NeuralForge-SIH/core-agent",
    synergy_score: 96,
    matched_skills: ["Python", "FastAPI", "PostgreSQL"],
    complementary_note: "High Synergy: Your audited FastAPI & LangGraph experience completes their ML backend pipeline."
  },
  {
    id: "squad-02",
    name: "ZeroKnowledge Guild",
    track: "Blockchain & Cybersecurity",
    problem: "Decentralized verifiable identity & anti-sybil proof-of-humanity protocol for public goods.",
    leader: "Priya Sharma (NIT Trichy)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    current_members: [
      { name: "Priya S.", role: "ZK Cryptographer", skills: ["Circom", "Rust", "Solidity"] },
      { name: "Dev K.", role: "Smart Contracts", skills: ["Solidity", "Hardhat", "Go"] }
    ],
    open_roles: ["Frontend Web3 Integration", "Full-Stack Typescript Lead"],
    required_skills: ["TypeScript", "React", "Next.js", "Ethers.js", "TailwindCSS"],
    max_members: 4,
    discord: "discord.gg/zk-guild",
    github_repo: "zk-guild/identity-contracts",
    synergy_score: 92,
    matched_skills: ["TypeScript", "React", "Next.js"],
    complementary_note: "Direct Fit: They need your Next.js & TypeScript skills to build the student verifier dApp interface."
  },
  {
    id: "squad-03",
    name: "AgriSense Drones",
    track: "AgriTech & IoT",
    problem: "Autonomous crop disease detection via edge ML computer vision and multispectral satellite telemetry.",
    leader: "Rohan Verma (BITS Pilani)",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
    current_members: [
      { name: "Rohan V.", role: "Embedded Systems", skills: ["C++", "ROS", "Python"] },
      { name: "Ananya R.", role: "Computer Vision", skills: ["OpenCV", "TensorFlow", "YOLO"] }
    ],
    open_roles: ["Distributed Cloud Pipeline", "Web GIS Dashboard Engineer"],
    required_skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
    max_members: 4,
    discord: "discord.gg/agrisense",
    github_repo: "agrisense-sih/flight-telemetry",
    synergy_score: 84,
    matched_skills: ["React", "Python"],
    complementary_note: "Solid Match: You can lead the web dashboard to render real-time drone telemetry."
  },
  {
    id: "squad-04",
    name: "MediTriage AI",
    track: "MedTech & Healthcare",
    problem: "Real-time emergency room triage queue optimization with automated patient vitals inference.",
    leader: "Vikram Patel (IIIT Hyderabad)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    current_members: [
      { name: "Vikram P.", role: "Data Scientist", skills: ["Python", "Scikit-Learn", "FastAPI"] },
      { name: "Meera J.", role: "Mobile App Dev", skills: ["Flutter", "Dart", "Firebase"] }
    ],
    open_roles: ["Security & Cryptographic Audit Lead", "System Architect"],
    required_skills: ["Node.js", "TypeScript", "Docker", "Security", "GraphQL"],
    max_members: 4,
    discord: "discord.gg/meditriage",
    github_repo: "meditriage/vital-predict",
    synergy_score: 79,
    matched_skills: ["TypeScript"],
    complementary_note: "Complementary: Brings hospital data compliance & security audit rigor."
  }
];

export async function fetchLiveSquadsAction(): Promise<Squad[]> {
  try {
    const supabase = await createClient();
    const { data: dbSquads, error } = await supabase
      .from("hackathon_squads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbSquads || dbSquads.length === 0) {
      return BENCHMARK_SHOWCASE_SQUADS;
    }

    const formatted: Squad[] = dbSquads.map((s) => ({
      id: s.id,
      name: s.name,
      track: s.track,
      problem: s.problem,
      leader: s.leader_name,
      avatar: s.avatar_url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      current_members: [{ name: s.leader_name, role: "Team Lead", skills: s.required_skills?.slice(0, 2) || [] }],
      open_roles: s.open_roles || [],
      required_skills: s.required_skills || [],
      max_members: s.max_members || 4,
      discord: s.discord_link || "discord.gg/credo-team",
      github_repo: s.github_repo || "",
      synergy_score: s.synergy_score || 95,
      complementary_note: s.complementary_note || "Live community squad on Minskey SIH Hub.",
    }));

    // Combine user squads on top of benchmark showcase squads
    return [...formatted, ...BENCHMARK_SHOWCASE_SQUADS];
  } catch (err) {
    console.error("fetchLiveSquadsAction error:", err);
    return BENCHMARK_SHOWCASE_SQUADS;
  }
}

export async function createSquadAction(formData: {
  name: string;
  track: string;
  problem: string;
  open_roles: string[];
  required_skills: string[];
  discord_link?: string;
  github_repo?: string;
}): Promise<{ success: boolean; error?: string; squad?: Squad }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please log in to publish a hackathon squad." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const leaderName = profile?.full_name || user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "Team Lead");
    const avatarUrl = profile?.avatar_url || "/avatar-male.webp";

    const { data: newSquadRow, error } = await supabase
      .from("hackathon_squads")
      .insert({
        leader_id: user.id,
        name: formData.name,
        track: formData.track,
        problem: formData.problem,
        leader_name: leaderName,
        avatar_url: avatarUrl,
        open_roles: formData.open_roles,
        required_skills: formData.required_skills,
        max_members: 4,
        discord_link: formData.discord_link || "",
        github_repo: formData.github_repo || "",
        synergy_score: 99,
        complementary_note: "Your live squad is now published to the network.",
      })
      .select("*")
      .single();

    if (error || !newSquadRow) {
      console.error("createSquadAction error:", error);
      return { success: false, error: error?.message || "Failed to publish squad." };
    }

    const newSquad: Squad = {
      id: newSquadRow.id,
      name: newSquadRow.name,
      track: newSquadRow.track,
      problem: newSquadRow.problem,
      leader: newSquadRow.leader_name,
      avatar: newSquadRow.avatar_url,
      current_members: [{ name: newSquadRow.leader_name, role: "Team Lead", skills: newSquadRow.required_skills?.slice(0, 2) || [] }],
      open_roles: newSquadRow.open_roles,
      required_skills: newSquadRow.required_skills,
      max_members: newSquadRow.max_members,
      discord: newSquadRow.discord_link,
      github_repo: newSquadRow.github_repo,
      synergy_score: newSquadRow.synergy_score,
      complementary_note: newSquadRow.complementary_note,
    };

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard/find-team");
    return { success: true, squad: newSquad };
  } catch (err: any) {
    console.error("createSquadAction error:", err);
    return { success: false, error: err?.message || "Internal server error" };
  }
}

export async function applyToSquadAction({
  squadId,
  targetRole,
  pitch,
}: {
  squadId: string;
  targetRole: string;
  pitch: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please log in to apply to squads." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const applicantName = profile?.full_name || user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "Verified Applicant");
    const applicantAvatar = profile?.avatar_url || "/avatar-male.webp";

    const { error } = await supabase.from("squad_applications").insert({
      squad_id: squadId,
      applicant_id: user.id,
      applicant_name: applicantName,
      applicant_avatar: applicantAvatar,
      target_role: targetRole,
      pitch: pitch,
      status: "pending",
    });

    if (error) {
      console.error("applyToSquadAction error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/teams");
    return { success: true };
  } catch (err: any) {
    console.error("applyToSquadAction error:", err);
    return { success: false, error: err?.message || "Application submission failed" };
  }
}
