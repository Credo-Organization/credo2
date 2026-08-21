"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck,
  CreditCard,
  Settings,
  Users,
  Briefcase,
  Award,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SIDEBAR_ITEMS = [
  { name: "Skill Passport", href: "/dashboard", icon: CreditCard },
  { name: "Internships", href: "/dashboard/internships", icon: Briefcase, badge: "AI Match" },
  { name: "Hackathon Teams", href: "/dashboard/find-team", icon: Users },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<{name: string, avatar: string, email?: string} | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
        setUserProfile({
          name: profile?.full_name || user.email?.split('@')[0] || "Jane Doe",
          avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          email: user.email
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

  const NavItem = ({ item }: { item: typeof SIDEBAR_ITEMS[0] }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link href={item.href} className="w-full">
        <div
          className={cn(
            "flex items-center rounded-xl transition-all duration-200 group cursor-pointer relative",
            isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 space-x-3",
            isActive
              ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.3)] font-semibold"
              : "text-white/60 hover:bg-white/[0.04] hover:text-white"
          )}
        >
          {/* Active Accent Pip */}
          {isActive && !isCollapsed && (
            <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          )}

          <Icon
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors",
              isActive ? "text-emerald-400" : "text-white/60 group-hover:text-white"
            )}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
          
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center justify-between w-full overflow-hidden whitespace-nowrap"
              >
                <span className="text-[13px] tracking-tight">
                  {item.name}
                </span>

                {item.badge && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 rounded-full shadow-sm ml-auto">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="group relative flex flex-col h-full bg-[#080a0f]/95 border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex-shrink-0 rounded-3xl backdrop-blur-2xl"
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-[#121620] border border-white/[0.12] text-white/70 hover:text-white transition-all z-30 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top: Bespoke Brand Logo */}
      <div 
        className={cn(
          "flex items-center h-20 px-5 border-b border-white/[0.06]",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}
      >
        <Link href="/dashboard" className="flex items-center space-x-3 group/logo">
          {/* Logo Glyph */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-white/20 group-hover/logo:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col overflow-hidden whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-white tracking-tight leading-none">
                    Credo
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    v2.0
                  </span>
                </div>
                <span className="text-[10px] font-medium text-white/50 tracking-wider uppercase mt-0.5">
                  AI Skill Passport
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Middle: Navigation Items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-5 flex flex-col gap-1.5 custom-scrollbar">
        {SIDEBAR_ITEMS.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Bottom: User Profile & Logout */}
      <div className="p-3.5 border-t border-white/[0.06] mt-auto flex flex-col gap-2 bg-white/[0.01]">
        <div className={cn(
          "flex items-center rounded-2xl p-2 transition-colors bg-white/[0.02] border border-white/[0.04]",
          isCollapsed ? "justify-center p-2" : "space-x-3"
        )}>
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-sm relative">
            <img
              src={userProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#080a0f]" />
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col overflow-hidden whitespace-nowrap flex-1"
              >
                <span className="text-xs font-bold text-white truncate">
                  {userProfile?.name || "Student"}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium truncate flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  W3C Verified DID
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center rounded-xl transition-all group cursor-pointer w-full text-white/50 hover:bg-rose-500/10 hover:text-rose-300 text-xs font-medium",
            isCollapsed ? "justify-center p-2.5" : "px-3 py-2 space-x-2.5"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-rose-400 text-white/50 transition-colors" strokeWidth={1.8} />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Disconnect / Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
