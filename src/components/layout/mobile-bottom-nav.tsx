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
    label: "Roles",
    href: "/dashboard/internships",
    icon: Briefcase,
  },
  {
    label: "Squads",
    href: "/dashboard/teams",
    icon: Users,
  },
  {
    label: "Certs",
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 dark:bg-zinc-950/95 backdrop-blur-md border-t-2 border-zinc-900 dark:border-zinc-800 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-1.5 px-2 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto items-center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all touch-target cursor-pointer relative",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-black"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-950/80 border-2 border-zinc-900 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#18181B] scale-105"
                    : "bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isActive && "stroke-[2.5]"
                  )}
                />
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
