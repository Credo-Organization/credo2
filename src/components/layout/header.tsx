"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { MobileNav } from "@/components/layout/mobile-nav";
import { dashboardNav } from "@/config/navigation";

interface HeaderProps {
  user: User;
}

function getPageTitle(pathname: string): string {
  const nav = dashboardNav.find(
    (item) =>
      pathname === item.href || pathname.startsWith(item.href + "/")
  );
  return nav?.title || "Dashboard";
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:px-8">
      {/* Mobile menu trigger */}
      <Sheet>
        <SheetTrigger render={
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-zinc-900">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        } />
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileNav user={user} />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h1>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>
      </div>
    </header>
  );
}
