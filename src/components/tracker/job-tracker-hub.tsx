"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Calendar,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  Send,
  GitCommit,
  ArrowRight,
  FileCheck2,
  X,
  Clock3,
  Award,
  Filter,
} from "lucide-react";
import {
  JobApplication,
  ApplicationStage,
} from "@/types/job-tracker";
import {
  getStoredApplications,
  syncApplicationsFromSupabase,
  updateApplicationStage,
  deleteApplication,
  addApplication,
} from "@/lib/storage/job-applications";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STAGE_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All Applications" },
  { id: "dispatched", label: "Dispatched" },
  { id: "audited", label: "Audited" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interviews" },
  { id: "offered", label: "Offers" },
];

const STAGE_BADGES: Record<ApplicationStage, { label: string; class: string }> = {
  dispatched: {
    label: "Proof Dispatched",
    class: "bg-[#FEF08A] text-amber-950 border-amber-400 dark:bg-amber-900 dark:text-amber-100",
  },
  audited: {
    label: "GitProof Verified",
    class: "bg-[#A7F3D0] text-emerald-950 border-emerald-400 dark:bg-emerald-900 dark:text-emerald-100",
  },
  shortlisted: {
    label: "Shortlisted",
    class: "bg-[#BAE6FD] text-blue-950 border-blue-400 dark:bg-blue-900 dark:text-blue-100",
  },
  interview: {
    label: "Interview Scheduled",
    class: "bg-[#DDD6FE] text-purple-950 border-purple-400 dark:bg-purple-900 dark:text-purple-100",
  },
  offered: {
    label: "Offer Extended",
    class: "bg-[#6EE7B7] text-emerald-950 border-emerald-500 dark:bg-emerald-800 dark:text-emerald-100",
  },
  rejected: {
    label: "Archived",
    class: "bg-[#FECDD3] text-rose-950 border-rose-400 dark:bg-rose-900 dark:text-rose-100",
  },
};

const STAGES_LIST: { id: ApplicationStage; label: string }[] = [
  { id: "dispatched", label: "Dispatched" },
  { id: "audited", label: "Audited" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "offered", label: "Offered" },
];

export function JobTrackerHub() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Application Form State
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newLocation, setNewLocation] = useState("Remote / Hybrid");
  const [newSalary, setNewSalary] = useState("₹60,000 / mo");
  const [newMatchScore, setNewMatchScore] = useState(88);

  const loadApps = () => {
    setApplications(getStoredApplications());
  };

  useEffect(() => {
    loadApps();
    syncApplicationsFromSupabase().then((apps) => {
      if (apps && apps.length > 0) {
        setApplications(apps);
      }
    });

    const handleUpdate = () => loadApps();
    window.addEventListener("minskey-applications-updated", handleUpdate);

    // Subscribe to live Postgres Realtime updates on job_applications
    const supabase = createClient();
    const channel = supabase
      .channel("job_applications_live_stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_applications" },
        () => {
          syncApplicationsFromSupabase().then((apps) => {
            if (apps && apps.length > 0) {
              setApplications(apps);
            }
          });
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("minskey-applications-updated", handleUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (activeFilter === "all") return true;
      return app.status === activeFilter;
    });
  }, [applications, searchQuery, activeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const dispatched = applications.filter((a) => a.status === "dispatched").length;
    const audited = applications.filter((a) => a.status === "audited" || a.status === "shortlisted").length;
    const interview = applications.filter((a) => a.status === "interview" || a.status === "offered").length;
    return { total, dispatched, audited, interview };
  }, [applications]);

  const handleAdvanceStage = (app: JobApplication, nextStage: ApplicationStage) => {
    updateApplicationStage(app.id, nextStage);
    toast.success(`${app.company} application updated to "${STAGE_BADGES[nextStage].label}"!`);
    if (selectedApp && selectedApp.id === app.id) {
      setSelectedApp({ ...selectedApp, status: nextStage });
    }
  };

  const handleDelete = (id: string, company: string) => {
    const appToRestore = applications.find((a) => a.id === id);
    deleteApplication(id);
    if (selectedApp?.id === id) setSelectedApp(null);
    toast.success(`Removed application for ${company}`, {
      action: appToRestore
        ? {
            label: "Undo",
            onClick: () => {
              addApplication(appToRestore);
              toast.success(`Restored application for ${company}`);
            },
          }
        : undefined,
    });
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) {
      toast.error("Please enter company name and role title.");
      return;
    }

    const created = await addApplication({
      company: newCompany.trim(),
      role: newRole.trim(),
      location: newLocation.trim(),
      salary: newSalary.trim(),
      matchScore: Number(newMatchScore) || 85,
      passportId: "CDY26S4611",
      status: "dispatched",
      gitProofScore: 95,
      verifiedSkills: ["Full-Stack", "Verified Passport", "GitProof"],
      notes: "Direct application logged to tracker.",
      recruiterNotes: "Candidate submitted verified digital credential.",
    });

    setNewCompany("");
    setNewRole("");
    setIsAddModalOpen(false);
    toast.success(`Application for ${created.company} saved!`);
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* Top Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
            Total Pipeline
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-100">
              {stats.total}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-zinc-500 truncate">Active</span>
          </div>
        </div>

        <div className="bg-amber-500/[0.06] dark:bg-amber-950/25 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase text-amber-900 dark:text-amber-300 block mb-1">
            Proof Dispatched
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-3xl font-black text-amber-950 dark:text-amber-200">
              {stats.dispatched}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-amber-800 dark:text-amber-300 truncate">In Review</span>
          </div>
        </div>

        <div className="bg-emerald-500/[0.06] dark:bg-emerald-950/25 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase text-emerald-900 dark:text-emerald-300 block mb-1">
            Evidence Audited
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-200">
              {stats.audited}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">Verified</span>
          </div>
        </div>

        <div className="bg-purple-500/[0.06] dark:bg-purple-950/25 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase text-purple-900 dark:text-purple-300 block mb-1">
            Interview Rounds
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-3xl font-black text-purple-950 dark:text-purple-200">
              {stats.interview}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-purple-800 dark:text-purple-300 truncate">Technical</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Action */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by company, role, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-all"
          />
        </div>

        {/* Stage Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap">
          {STAGE_FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer",
                activeFilter === tab.id
                  ? "bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-[2px_2px_0px_0px_#18181B]"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Log Application Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-3.5 rounded-xl bg-[#A7F3D0] hover:bg-[#6EE7B7] text-emerald-950 text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Log Application</span>
        </button>
      </div>

      {/* HIGH-DENSITY APPLICATION TABLE (Clean Linear Style) */}
      <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-900 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-[10px] uppercase font-black text-zinc-500">
                <th className="p-3.5 pl-5">Company & Role</th>
                <th className="p-3.5">Status Stage</th>
                <th className="p-3.5">Role Fit</th>
                <th className="p-3.5">GitProof Consensus</th>
                <th className="p-3.5">Applied Date</th>
                <th className="p-3.5 pr-5 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-100 dark:divide-zinc-800 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-400 font-bold">
                    No applications match your filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const badge = STAGE_BADGES[app.status] || STAGE_BADGES.dispatched;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="p-3.5 pl-5">
                        <div className="font-black text-zinc-950 dark:text-zinc-100 text-sm group-hover:text-blue-600 transition-colors">
                          {app.company}
                        </div>
                        <div className="text-zinc-500 font-medium text-xs">
                          {app.role} • <span className="text-zinc-400">{app.location}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[11px] font-black border font-mono shadow-2xs inline-block",
                            badge.class
                          )}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono font-black text-zinc-900 dark:text-zinc-100">
                        {app.matchScore}%
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-mono font-black text-emerald-700 dark:text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {app.gitProofScore || 95}% Original
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-zinc-500 text-xs">
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-xs font-black border-2 border-zinc-900 shadow-[1.5px_1.5px_0px_0px_#18181B] active:translate-y-[1px] cursor-pointer"
                        >
                          Inspect ➔
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-OVER INSPECTION DRAWER */}
      {selectedApp && (
        <div className="fixed inset-0 z-[9999] flex justify-end select-none">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedApp(null)}
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer Window */}
          <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 border-l-2 border-zinc-900 shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b-2 border-zinc-900 dark:border-zinc-800 bg-[#FAF9F6] dark:bg-zinc-950 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-zinc-900">
                    DID #{selectedApp.passportId}
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black border font-mono",
                      STAGE_BADGES[selectedApp.status]?.class
                    )}
                  >
                    {STAGE_BADGES[selectedApp.status]?.label}
                  </span>
                </div>
                <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                  {selectedApp.company}
                </h3>
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  {selectedApp.role} • {selectedApp.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="w-9 h-9 rounded-xl border-2 border-zinc-900 flex items-center justify-center font-black hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Advance Stage Control */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border-2 border-zinc-900 dark:border-zinc-700 space-y-2">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-500">
                  STAGE SIMULATOR
                </span>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {STAGES_LIST.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleAdvanceStage(selectedApp, s.id)}
                      className={cn(
                        "p-1.5 rounded-xl text-[10px] font-mono font-black border-2 transition-all cursor-pointer text-center",
                        selectedApp.status === s.id
                          ? "bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 shadow-[2px_2px_0px_0px_#18181B]"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 border-zinc-900 hover:bg-zinc-100"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cryptographic Proof Dossier Card */}
              <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-[3px_3px_0px_0px_#18181B] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-zinc-950 dark:text-zinc-100">
                      Cryptographic Proof Bundle
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Tamper-Proof
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-300">
                    <span className="text-[9px] font-mono uppercase font-bold text-emerald-800 block">
                      GitProof Consensus
                    </span>
                    <span className="text-base font-black text-emerald-950">
                      {selectedApp.gitProofScore || 95}% Verified
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-500/[0.06] border border-blue-300">
                    <span className="text-[9px] font-mono uppercase font-bold text-blue-800 block">
                      Role Match
                    </span>
                    <span className="text-base font-black text-blue-950">
                      {selectedApp.matchScore}% Fit
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block mb-1.5">
                    Verified Competencies Attached
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedApp.verifiedSkills || ["TypeScript", "Distributed Systems", "Docker"]).map(
                      (s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black bg-[#A7F3D0] text-emerald-950 border border-zinc-900 shadow-2xs"
                        >
                          ✓ {s}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Recruiter / Hiring Feedback */}
              <div className="p-4 rounded-2xl bg-[#FEF08A] dark:bg-amber-950/40 border-2 border-zinc-900 dark:border-zinc-700 text-amber-950 dark:text-amber-200 space-y-1">
                <span className="text-[10px] font-mono uppercase font-black block">
                  HIRING TEAM AUDIT FEEDBACK
                </span>
                <p className="text-xs font-semibold leading-relaxed">
                  {selectedApp.recruiterNotes || "Application actively under review by technical lead."}
                </p>
                {selectedApp.interviewDate && (
                  <p className="text-[11px] font-mono font-bold mt-2 pt-2 border-t border-amber-900/20 text-amber-900 dark:text-amber-300">
                    📅 Interview Date: {new Date(selectedApp.interviewDate).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Chronological Activity & Audit Stream */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100 font-mono block">
                  APPLICATION ACTIVITY STREAM
                </span>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-700">
                  {(selectedApp.timeline || [
                    {
                      timestamp: selectedApp.appliedAt,
                      label: "Passport Proof Dispatched",
                      detail: "Cryptographic credential token submitted.",
                      actor: "student",
                    },
                  ]).map((event, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-900 bg-white dark:bg-zinc-800 absolute -left-[23px] top-0.5 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-zinc-950 dark:text-zinc-100">
                            {event.label}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {new Date(event.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {event.detail && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            {event.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t-2 border-zinc-900 dark:border-zinc-800 bg-[#FAF9F6] dark:bg-zinc-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDelete(selectedApp.id, selectedApp.company)}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-black border-2 border-transparent hover:border-rose-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Withdraw Application</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-black border-2 border-zinc-900 cursor-pointer shadow-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Log Custom Application */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
          />
          <form
            onSubmit={handleCreateCustom}
            className="relative w-full max-w-md rounded-3xl border-2 border-zinc-900 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_#18181B] z-10 overflow-hidden flex flex-col p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-900 dark:border-zinc-800 mb-4">
              <div>
                <h3 className="text-base font-black text-zinc-950 dark:text-zinc-100">
                  Log Job Application
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Track campus drives, referral, or external submissions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl border-2 border-zinc-900 flex items-center justify-center text-zinc-700 font-black hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono font-black uppercase text-zinc-500 block mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlassian, Stripe, Zepto"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-100 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-black uppercase text-zinc-500 block mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Systems Engineer Intern"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-100 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono font-black uppercase text-zinc-500 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-100 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-black uppercase text-zinc-500 block mb-1">
                    Stipend / Salary
                  </label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-100 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-zinc-900 dark:border-zinc-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border-2 border-zinc-900 text-xs font-black hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#A7F3D0] hover:bg-[#6EE7B7] text-emerald-950 border-2 border-zinc-900 text-xs font-black shadow-[2px_2px_0px_0px_#18181B] cursor-pointer"
              >
                Save to Tracker
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
