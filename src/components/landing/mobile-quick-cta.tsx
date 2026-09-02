"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { LoginModal } from "@/components/ui/login-modal";

export function MobileQuickCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after scrolling past the hero (e.g. 350px)
      if (!isDismissed) {
        setIsVisible(window.scrollY > 350);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="md:hidden fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] left-3 right-3 sm:left-4 sm:right-4 z-40 select-none"
        >
          <div className="bg-white/95 backdrop-blur-md border-2 border-zinc-900 rounded-2xl p-2.5 px-3.5 shadow-[4px_4px_0px_0px_#18181B] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                M
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-xs text-zinc-950 truncate">
                  Minskey Passport
                </span>
                <span className="text-[10px] text-zinc-500 font-bold truncate">
                  Free for student builders
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <LoginModal>
                <button
                  type="button"
                  className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </LoginModal>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                aria-label="Dismiss quick dock"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
