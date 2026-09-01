"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Users, Search, PlusCircle, Sparkles, Filter, ShieldCheck, Flag, AlignLeft, UserPlus, Send, CheckCircle2 } from "lucide-react";
import { Squad, SquadCard } from "./squad-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const INITIAL_SQUADS: Squad[] = [
  {
    id: "squad-01",
    name: "NeuralForge AI",
    track: "Smart Automation & AI",
    problem: "Autonomous code synthesis, runtime AST analysis & automatic vulnerability repair pipeline for developer tooling.",
    leader: "Arjun Mehta (IIT Bombay)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    current_members: [
      {"name": "Arjun M.", "role": "ML Lead", "skills": ["PyTorch", "Python", "HuggingFace"]},
      {"name": "Sneha P.", "role": "UI/UX", "skills": ["Figma", "React", "TailwindCSS"]}
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
      {"name": "Priya S.", "role": "ZK Cryptographer", "skills": ["Circom", "Rust", "Solidity"]},
      {"name": "Dev K.", "role": "Smart Contracts", "skills": ["Solidity", "Hardhat", "Go"]}
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
      {"name": "Rohan V.", "role": "Embedded Systems", "skills": ["C++", "ROS", "Python"]},
      {"name": "Ananya R.", "role": "Computer Vision", "skills": ["OpenCV", "TensorFlow", "YOLO"]}
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
      {"name": "Vikram P.", "role": "Data Scientist", "skills": ["Python", "Scikit-Learn", "FastAPI"]},
      {"name": "Meera J.", "role": "Mobile App Dev", "skills": ["Flutter", "Dart", "Firebase"]}
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

const TRACK_CHIPS = [
  "All Tracks",
  "Smart Automation & AI",
  "Blockchain & Cybersecurity",
  "AgriTech & IoT",
  "MedTech & Healthcare"
];

interface TeamsClientHubProps {
  initialTab?: "browse" | "create";
  userSkills?: string[];
  careerGoal?: string;
}

export function TeamsClientHub({
  initialTab = "browse",
  userSkills = ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
  careerGoal = "Full Stack Engineer"
}: TeamsClientHubProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "create">(initialTab);
  const [squads, setSquads] = useState(INITIAL_SQUADS);
  const [selectedTrack, setSelectedTrack] = useState("All Tracks");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"synergy" | "members">("synergy");

  // Form states for creating a squad requirement
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState(TRACK_CHIPS[1]);
  const [description, setDescription] = useState("");
  const [openRoles, setOpenRoles] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [leaderName, setLeaderName] = useState("Subham Sarangi");
  const [discord, setDiscord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync synergy scores from FastAPI backend
  useEffect(() => {
    const fetchBackendSynergy = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${backendUrl}/api/team/synergy-match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_skills: userSkills,
            career_goal: careerGoal
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.teams?.length > 0) {
            setSquads(data.teams);
          }
        }
      } catch (err) {
        console.log("FastAPI synergy match fallback active");
      }
    };
    fetchBackendSynergy();
  }, [userSkills, careerGoal]);

  const filteredSquads = useMemo(() => {
    return squads.filter((squad) => {
      const matchesTrack = selectedTrack === "All Tracks" || squad.track === selectedTrack;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        squad.name.toLowerCase().includes(q) ||
        squad.problem.toLowerCase().includes(q) ||
        squad.open_roles.some((r) => r.toLowerCase().includes(q)) ||
        squad.required_skills.some((s) => s.toLowerCase().includes(q));

      return matchesTrack && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "synergy") {
        return (b.synergy_score || 0) - (a.synergy_score || 0);
      }
      return a.current_members.length - b.current_members.length;
    });
  }, [squads, selectedTrack, searchQuery, sortBy]);

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !description || !openRoles) {
      toast.error("Please fill in team name, description, and open roles.");
      return;
    }

    setIsSubmitting(true);

    const newSquad: Squad = {
      id: `squad-${Date.now().toString(36)}`,
      name: teamName,
      track: track,
      problem: description,
      leader: leaderName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      current_members: [{ name: leaderName, role: "Team Lead", skills: userSkills.slice(0, 3) }],
      open_roles: openRoles.split(",").map((s) => s.trim()).filter(Boolean),
      required_skills: requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      max_members: 4,
      discord: discord || "discord.gg/credo-team",
      synergy_score: 99,
      complementary_note: "Your squad is now live on the SIH Team Matcher network."
    };

    setTimeout(() => {
      setSquads([newSquad, ...squads]);
      setIsSubmitting(false);
      toast.success("Squad requirement published successfully!");
      setActiveTab("browse");
      // Reset form
      setTeamName("");
      setDescription("");
      setOpenRoles("");
      setRequiredSkills("");
    }, 600);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl border border-stone-200 bg-white shadow-sm backdrop-blur-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-700">
              SIH 2026 Hackathon Network
            </span>
            <span className="text-xs text-stone-500 font-mono">
              Live Team Matcher
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Hackathon Squad Matcher
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
            Discover squads seeking your verified skills or recruit complementary teammates with cryptographically proven GitHub and certificate evidence.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 border border-stone-200 self-start md:self-auto relative z-10">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "browse"
                ? "bg-stone-100 text-stone-900 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Browse Squads ({squads.length})
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "create"
                ? "bg-stone-100 text-stone-900 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Post Requirement
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE SQUADS */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Redesigned 2-Tier Command & Filter Bar */}
          <div className="p-4 rounded-3xl bg-white shadow-sm border border-stone-200 backdrop-blur-xl shadow-xl space-y-3.5">
            {/* Tier 1: Search & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search problem statement, open role, or tech stack (e.g. FastAPI, ZK, PyTorch)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 focus:bg-stone-100 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-900 text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Controls: Stats & Sorter */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px] font-mono text-stone-500 whitespace-nowrap">
                  <strong className="text-emerald-700 font-bold">{filteredSquads.length}</strong> Squads
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-500 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="synergy" className="bg-white text-stone-900">Top Synergy Fit</option>
                    <option value="members" className="bg-white text-stone-900">Most Open Slots</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tier 2: Track Filter Chips with Icons (No Scrollbars) */}
            <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mr-1">
                Tracks:
              </span>
              {TRACK_CHIPS.map((chip) => {
                const isSelected = selectedTrack === chip;
                let icon = "🌐";
                if (chip.includes("AI")) icon = "🤖";
                if (chip.includes("Blockchain")) icon = "🔐";
                if (chip.includes("AgriTech")) icon = "🌾";
                if (chip.includes("MedTech")) icon = "🏥";

                return (
                  <button
                    key={chip}
                    onClick={() => setSelectedTrack(chip)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-bold"
                        : "bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    <span className="text-xs">{icon}</span>
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Squads Grid */}
          {filteredSquads.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-stone-200 bg-stone-50/60">
              <Users className="w-10 h-10 text-stone-400 mb-3" />
              <h3 className="text-base font-bold text-stone-900">No squads match your filters</h3>
              <p className="text-xs text-stone-500 max-w-sm mt-1 mb-4">
                Try adjusting your search query or track filter to explore other hackathon teams.
              </p>
              <Button
                onClick={() => {
                  setSelectedTrack("All Tracks");
                  setSearchQuery("");
                }}
                className="text-xs bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 h-8 px-4 rounded-xl"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSquads.map((squad) => (
                <SquadCard key={squad.id} squad={squad} userSkills={userSkills} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POST SQUAD REQUIREMENT */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-stone-200 bg-white shadow-sm backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleCreateSquad} className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Post Team Teammate Requirement</h3>
              <p className="text-xs text-stone-500">
                Broadcast your hackathon problem statement to match with students carrying verified skills.
              </p>
            </div>

            {/* Team Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-stone-500" />
                Squad / Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Quantum Coders"
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* Track Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Hackathon Track
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
              >
                {TRACK_CHIPS.filter((t) => t !== "All Tracks").map((t) => (
                  <option key={t} value={t} className="bg-white text-stone-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-stone-500" />
                Problem Statement & Project Vision
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem you're tackling and the architecture you're building..."
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                required
              />
            </div>

            {/* Open Roles & Skills Needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Open Roles (comma-separated)
                </label>
                <input
                  type="text"
                  value={openRoles}
                  onChange={(e) => setOpenRoles(e.target.value)}
                  placeholder="e.g. Backend Lead, ZK Researcher"
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Required Tech Stack
                </label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  placeholder="e.g. FastAPI, Docker, PyTorch"
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            {/* Discord / Contact Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Squad Discord / Contact Invite
              </label>
              <input
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="discord.gg/your-squad"
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTab("browse")}
                className="text-xs text-stone-500 hover:text-stone-900 h-9 px-4 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black h-9 px-6 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {isSubmitting ? "Publishing Squad..." : "Publish Squad Requirement"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
