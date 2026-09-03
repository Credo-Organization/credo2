"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, Award, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Passport",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Job Matching",
    href: "/dashboard/internships",
    icon: Briefcase,
  },
  {
    label: "Hackathon Squads",
    href: "/dashboard/teams",
    icon: Users,
  },
  {
    label: "Certificates",
    href: "/dashboard/certificates",
    icon: Award,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t-2 border-zinc-900 dark:border-zinc-800 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] pt-2 px-3 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) ||
              (item.href === "/dashboard/internships" &&
                pathname.startsWith("/dashboard/applications"));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex items-center justify-center p-1 touch-target cursor-pointer group"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200",
                  isActive
                    ? "bg-[#BAE6FD] dark:bg-sky-950/80 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] text-blue-700 dark:text-sky-300 scale-105"
                    : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 active:scale-95"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive ? "stroke-[2.5]" : "stroke-[2]"
                  )}
                />
              </div>

              {isActive && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
