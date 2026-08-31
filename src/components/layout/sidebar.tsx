"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Users,
  Award,
  Settings,
  LogOut,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("passport");
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string; headline?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, headline').eq('id', user.id).single();
        setUserProfile({
          name: profile?.full_name || user.email?.split('@')[0] || "Subham Sarangi",
          avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          headline: profile?.headline || "Software Engineer",
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isMobile ? "100%" : (isCollapsed ? 76 : 260) }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "group relative flex flex-col h-full bg-[#090b10] border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex-shrink-0 backdrop-blur-2xl select-none",
        isMobile ? "w-full" : "rounded-[28px]"
      )}
    >
      {/* Mini Toggle Button */}
      {!isMobile && (
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-[#121622] border border-white/[0.12] text-white/60 hover:text-white transition-all z-30 opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Top: Geometric Minimal Emblem */}
      <div 
        className={cn(
          "flex items-center h-20 px-5 border-b border-white/[0.05]",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}
      >
        <Link href="/dashboard" className="flex items-center space-x-3 group/logo">
          {/* Geometric 4-Quadrant Emblem */}
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center flex-shrink-0 group-hover/logo:bg-white/[0.1] transition-all">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
            </svg>
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold text-sm text-white tracking-tight">
                  Credo
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Tree Section */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-4 space-y-4 custom-scrollbar">
        {/* Section 1: MAIN NAVIGATION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2.5 block mb-1">
              Main
            </span>
          )}

          {/* Group 1: Skill Passport & Sub-tree */}
          <div>
            <div
              onClick={() => toggleSection("passport")}
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all group cursor-pointer text-xs font-semibold",
                pathname === "/dashboard"
                  ? "bg-white/[0.08] text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/[0.08]"
                  : "text-white/70 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-white/70 group-hover:text-white" />
                {!isCollapsed && <span>Passport</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-white/40 transition-transform duration-200",
                    openSection === "passport" ? "rotate-0" : "-rotate-90"
                  )}
                />
              )}
            </div>

            {/* Tree Branches (Direct reference from screenshot 2 & 3) */}
            {!isCollapsed && openSection === "passport" && (
              <div className="ml-4 pl-3.5 mt-1 space-y-1 border-l border-white/[0.08] relative">
                <Link
                  href="/dashboard"
                  onClick={() => {
                    if (typeof window !== "undefined" && pathname === "/dashboard") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs transition-colors relative",
                    pathname === "/dashboard"
                      ? "text-white font-semibold bg-white/[0.04]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                  )}
                >
                  <span className="truncate">Overview</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">
                    Live
                  </span>
                </Link>

                <Link
                  href="/dashboard#gap-analysis"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      const el = document.getElementById("gap-analysis");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors"
                >
                  <span className="truncate">Gap Analysis</span>
                </Link>

                <Link
                  href="/dashboard#audit-console"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      const el = document.getElementById("audit-console");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors"
                >
                  <span className="truncate">GitProof Audit</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: OPPORTUNITIES & TEAMS */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2.5 block mb-1">
              Explore
            </span>
          )}

          {/* Internships Item */}
          <Link href="/dashboard/internships" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-semibold group cursor-pointer",
                pathname.startsWith("/dashboard/internships")
                  ? "bg-white/[0.08] text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/[0.08]"
                  : "text-white/70 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-white/70 group-hover:text-white" />
                {!isCollapsed && <span>Internships</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20">
                  AI Fit
                </span>
              )}
            </div>
          </Link>

          {/* Hackathon Teams Item */}
          <Link href="/dashboard/find-team" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-semibold group cursor-pointer",
                pathname.startsWith("/dashboard/find-team") || pathname.startsWith("/dashboard/create-teammates")
                  ? "bg-white/[0.08] text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/[0.08]"
                  : "text-white/70 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-white/70 group-hover:text-white" />
                {!isCollapsed && <span>Hackathon Squads</span>}
              </div>
            </div>
          </Link>
        </div>

        {/* Section 3: ACCREDITATION & PREFERENCES */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2.5 block mb-1">
              Accreditation
            </span>
          )}

          {/* Certificates Item */}
          <Link href="/dashboard/certificates" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-semibold group cursor-pointer",
                pathname.startsWith("/dashboard/certificates")
                  ? "bg-white/[0.08] text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/[0.08]"
                  : "text-white/70 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-white/70 group-hover:text-white" />
                {!isCollapsed && <span>Certificates</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                  DID
                </span>
              )}
            </div>
          </Link>

          {/* Settings Item */}
          <Link href="/dashboard/settings" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-semibold group cursor-pointer",
                pathname.startsWith("/dashboard/settings")
                  ? "bg-white/[0.08] text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/[0.08]"
                  : "text-white/70 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-white/70 group-hover:text-white" />
                {!isCollapsed && <span>Settings</span>}
              </div>
            </div>
          </Link>
        </div>
      </nav>

      {/* Bottom: Minimal User Profile Capsule (Inspired by Image 2 & 3) */}
      <div className="p-3 border-t border-white/[0.06] mt-auto">
        <div
          className={cn(
            "flex items-center rounded-2xl p-2 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all",
            isCollapsed ? "justify-center p-2" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 relative">
              <img
                src={userProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="text-xs font-bold text-white truncate">
                  {userProfile?.name || "Subham Sarangi"}
                </span>
                <span className="text-[10px] text-white/40 truncate">
                  {userProfile?.headline || "Software Engineer"}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
