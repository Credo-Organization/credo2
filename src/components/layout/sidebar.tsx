"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { dashboardNav } from "@/config/navigation";
import { Shield, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserMenu } from "@/components/layout/user-menu";

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 relative z-20",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-14 items-center border-b border-border", collapsed ? "justify-center" : "px-4")}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 shrink-0">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight truncate">
              Credify
            </span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 h-8 w-8 text-zinc-500 hover:text-zinc-900"
            onClick={() => setCollapsed(true)}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {dashboardNav.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-zinc-100 text-zinc-900 shadow-sm border border-zinc-200/60"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3 flex flex-col gap-2">
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            onClick={() => setCollapsed(false)}
            title="Expand Sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
        <UserMenu user={user} collapsed={collapsed} />
      </div>
    </aside>
  );
}
