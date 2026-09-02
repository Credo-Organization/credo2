"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-30 flex flex-row items-center justify-between px-4 py-3 border-b-2 border-zinc-900 dark:border-zinc-800 bg-[#FAF9F6]/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xs w-full shrink-0 select-none">
      {/* Mobile Logo */}
      <Link href="/dashboard" className="flex items-center space-x-2.5 touch-target">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center shadow-xs">
          <svg className="w-4 h-4 text-zinc-950 dark:text-zinc-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
          </svg>
        </div>
        <span className="font-black text-base text-zinc-950 dark:text-zinc-100 tracking-tight">
          Minskey
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {/* Hamburger Menu & Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger 
            render={
              <button 
                aria-label="Open Navigation Drawer"
                className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle Menu</span>
              </button>
            }
          />
          <SheetContent side="left" className="p-0 bg-transparent border-none w-[min(300px,85vw)]" showCloseButton={false}>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Mobile navigation sidebar for Minskey</SheetDescription>
            <div className="h-full w-full" onClick={(e) => {
               // Close on link click
               if ((e.target as HTMLElement).closest("a") || (e.target as HTMLElement).closest("button[title='Sign Out']")) {
                 setOpen(false);
               }
            }}>
              <Sidebar isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
