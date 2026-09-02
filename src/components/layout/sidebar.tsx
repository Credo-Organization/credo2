"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  Users,
  Award,
  Settings,
  LogOut,
  FileCheck2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string; headline?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, headline, gender').eq('id', user.id).single();
        const isFemale = profile?.gender?.toLowerCase() === "female";
        const rawAvatar = profile?.avatar_url || "";
        const isUnsplashOrEmpty = !rawAvatar || rawAvatar.includes("unsplash.com");
        setUserProfile({
          name: profile?.full_name || user.email?.split('@')[0] || "Subham Sarangi",
          avatar: !isUnsplashOrEmpty 
            ? rawAvatar
            : (isFemale ? "/avatar-female.webp" : "/avatar-male.webp"),
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

  return (
    <motion.aside
      initial={false}
      animate={{ width: isMobile ? "100%" : (isCollapsed ? 76 : 260) }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "group relative flex flex-col h-full bg-[#FAF9F6] dark:bg-[#111114] border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_#18181B] flex-shrink-0 select-none transition-colors",
        isMobile ? "w-full" : "rounded-[28px]"
      )}
    >
      {/* Mini Toggle Button */}
      {!isMobile && (
        <button
          onClick={handleToggle}
          className="absolute -right-3.5 top-7 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 transition-all z-30 opacity-0 group-hover:opacity-100 shadow-[2px_2px_0px_0px_#18181B] cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Top: Geometric Minimal Emblem */}
      <div 
        className={cn(
          "flex items-center h-20 px-5 border-b-2 border-zinc-900 dark:border-zinc-700",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}
      >
        <Link href="/dashboard" className="flex items-center space-x-3 group/logo">
          {/* Geometric 4-Quadrant Emblem */}
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#18181B] group-hover/logo:scale-105 transition-all">
            <svg className="w-4 h-4 text-zinc-950 dark:text-zinc-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                <span className="font-black text-base text-zinc-950 dark:text-zinc-100 tracking-tight">
                  Minskey
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Tree Section */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-4 space-y-4 custom-scrollbar">
        {/* Section 1: MAIN NAVIGATION */}
        <div className="space-y-1.5">
          {!isCollapsed && (
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2.5 block mb-1 font-mono">
              Main
            </span>
          )}

          {/* Direct Dashboard Link */}
          <Link href="/dashboard" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-black group cursor-pointer",
                pathname === "/dashboard"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] border-2 border-zinc-900 dark:border-zinc-700"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100"
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                {!isCollapsed && <span>Dashboard Overview</span>}
              </div>
            </div>
          </Link>

          {/* My Applications Link */}
          <Link href="/dashboard/applications" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-black group cursor-pointer",
                pathname.startsWith("/dashboard/applications")
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] border-2 border-zinc-900 dark:border-zinc-700"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100"
              )}
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                {!isCollapsed && <span>My Applications</span>}
              </div>
            </div>
          </Link>

          {/* Hackathon Squads Link */}
          <Link href="/dashboard/teams" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-black group cursor-pointer",
                pathname.startsWith("/dashboard/teams")
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] border-2 border-zinc-900 dark:border-zinc-700"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                {!isCollapsed && <span>Hackathon Squads</span>}
              </div>
            </div>
          </Link>

          {/* Certificates Link */}
          <Link href="/dashboard/certificates" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-black group cursor-pointer",
                pathname.startsWith("/dashboard/certificates")
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] border-2 border-zinc-900 dark:border-zinc-700"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                {!isCollapsed && <span>Certificates</span>}
              </div>
            </div>
          </Link>

          {/* Settings Item */}
          <Link href="/dashboard/settings" className="block">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl p-2.5 transition-all text-xs font-black group cursor-pointer",
                pathname.startsWith("/dashboard/settings")
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[2px_2px_0px_0px_#18181B] border-2 border-zinc-900 dark:border-zinc-700"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                {!isCollapsed && <span>Settings</span>}
              </div>
            </div>
          </Link>
        </div>
      </nav>

      {/* Bottom: Minimal User Profile Capsule */}
      <div className="p-3 border-t-2 border-zinc-900 dark:border-zinc-700 mt-auto space-y-2">
        <div
          className={cn(
            "flex items-center rounded-2xl p-2 bg-white dark:bg-zinc-800/90 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] transition-all",
            isCollapsed ? "justify-center p-2" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 border-2 border-zinc-900 dark:border-zinc-700 relative bg-[#FEF08A]">
              <img
                src={userProfile?.avatar || "/avatar-male.webp"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 truncate">
                  {userProfile?.name || "Subham Sarangi"}
                </span>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium truncate">
                  {userProfile?.headline || "Software Engineer"}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
