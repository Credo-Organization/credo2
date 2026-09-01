"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex flex-row items-center justify-between px-4 py-4 border-b border-stone-200 bg-[#f4f1eb] shadow-sm z-40 w-full shrink-0">
      {/* Mobile Logo */}
      <Link href="/dashboard" className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-white/60 border border-stone-200 flex items-center justify-center">
          <svg className="w-4 h-4 text-stone-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
          </svg>
        </div>
        <span className="font-bold text-sm text-stone-900 tracking-tight">
          Credo
        </span>
      </Link>

      {/* Hamburger Menu & Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger 
          render={
            <button className="p-2 -mr-2 text-stone-500 hover:text-stone-900 hover:bg-white/60 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle Menu</span>
            </button>
          }
        />
        <SheetContent side="left" className="p-0 bg-transparent border-none w-[280px]" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Mobile navigation sidebar for Credify</SheetDescription>
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
  );
}
