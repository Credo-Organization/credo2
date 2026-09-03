"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LoginModal } from "@/components/ui/login-modal";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none",
        isScrolled
          ? "bg-[#FAF9F6]/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 py-3 shadow-xs"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* ── Brand Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] group-hover:-rotate-3 transition-transform">
            M
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-zinc-950 dark:text-zinc-100 flex items-center gap-1">
            Minskey
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
          </span>
        </Link>

        {/* ── Center Nav Links ── */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/#how-it-works"
            className="text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/#features"
            className="text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/teams"
            className="text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition-colors"
          >
            Teams
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* ── Right Action: Login Pill Button ── */}
        <div className="hidden md:flex items-center gap-4">
          <LoginModal>
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black transition-all border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] cursor-pointer"
            >
              Sign In
            </button>
          </LoginModal>
        </div>

        {/* ── Mobile Actions ── */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] dark:bg-zinc-900 border-b-2 border-zinc-900 dark:border-zinc-800 px-6 py-5 shadow-lg flex flex-col gap-2 animate-in slide-in-from-top-2">
          <Link
            href="/#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 py-2 flex items-center"
          >
            How it Works
          </Link>
          <Link
            href="/#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 py-2 flex items-center"
          >
            Features
          </Link>
          <Link
            href="/teams"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 py-2 flex items-center"
          >
            Teams
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 py-2 flex items-center"
          >
            Pricing
          </Link>
          <div className="pt-3 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <LoginModal>
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] cursor-pointer"
              >
                Sign In
              </button>
            </LoginModal>
          </div>
        </div>
      )}
    </header>
  );
}
