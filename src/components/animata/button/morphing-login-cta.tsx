"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface MorphingLoginCtaProps {
  text?: string;
  className?: string;
}

interface AnimationCoords {
  startTop: number;
  startLeft: number;
  startWidth: number;
  startHeight: number;
  targetTop: number;
  targetLeft: number;
  targetWidth: number;
  targetHeight: number;
}

export default function MorphingLoginCta({
  text = "Get started",
  className,
}: MorphingLoginCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<AnimationCoords | null>(null);
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateCoords = (): AnimationCoords | null => {
    if (!buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    const winW = typeof window !== "undefined" ? window.innerWidth : 1000;
    const winH = typeof window !== "undefined" ? window.innerHeight : 800;

    const targetWidth = Math.min(390, winW - 32);
    const targetHeight = Math.min(480, winH - 40);
    const targetLeft = (winW - targetWidth) / 2;
    const targetTop = (winH - targetHeight) / 2;

    return {
      startTop: rect.top,
      startLeft: rect.left,
      startWidth: rect.width,
      startHeight: rect.height,
      targetTop,
      targetLeft,
      targetWidth,
      targetHeight,
    };
  };

  const handleOpen = () => {
    const calculated = calculateCoords();
    if (calculated) {
      setCoords(calculated);
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    const calculated = calculateCoords();
    if (calculated) {
      setCoords(calculated);
    }
    setIsOpen(false);
  };

  // Close on Escape key press or Click Outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setError(null);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (
      !supabaseUrl ||
      supabaseUrl.includes("your-project-ref") ||
      supabaseUrl.includes("mock-project")
    ) {
      setError(
        "Please set your real NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in the .env file to enable Google Login."
      );
      return;
    }
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setError(err?.message || "Failed to initiate Google login");
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (
      !supabaseUrl ||
      supabaseUrl.includes("your-project-ref") ||
      supabaseUrl.includes("mock-project")
    ) {
      setError(
        "Please set your real NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in the .env file to enable GitHub Login."
      );
      return;
    }
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setError(err?.message || "Failed to initiate GitHub login");
    }
  };

  const handleEmailLogin = async () => {
    setError(null);
    setIsLoading(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setError("Check your email for the confirmation link!");
        }
      } else {
        setError(signInError.message);
      }
    } else {
      window.location.reload();
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* 
        TRIGGER BUTTON (in normal flow):
        Anchored firmly with fixed dimensions so page text never shifts
      */}
      <div className="relative inline-flex items-center justify-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          className={cn(
            "group/start flex h-12 w-44 items-center justify-center gap-3 rounded-lg bg-amber-100 p-2 font-bold transition-all duration-150 hover:bg-orange-600 cursor-pointer shadow-lg active:scale-95",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            className
          )}
        >
          <span
            className={cn(
              "text-orange-600 text-sm font-bold transition-colors duration-100 ease-in-out group-hover/start:text-amber-100"
            )}
          >
            {text}
          </span>
          <div
            className={cn(
              "relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full transition-transform duration-100",
              "bg-orange-600 group-hover/start:bg-amber-100"
            )}
          >
            <div className="absolute left-0 flex h-7 w-14 -translate-x-1/2 items-center justify-center transition-transform duration-200 ease-in-out group-hover/start:translate-x-0">
              <ArrowRight
                size={16}
                className={cn(
                  "size-7 transform p-1 text-orange-600 opacity-0 group-hover/start:opacity-100"
                )}
              />
              <ArrowRight
                size={16}
                className={cn(
                  "size-7 transform p-1 text-amber-100 opacity-100 transition-transform duration-300 ease-in-out group-hover/start:opacity-0"
                )}
              />
            </div>
          </div>
        </button>
      </div>

      {/* 
        PORTAL OVERLAY:
        Pill-shaped Frosted Glass Role Switcher inside card
      */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <div className="fixed inset-0 z-[100] pointer-events-auto">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  onClick={handleClose}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                />

                {/* Morphing Card */}
                <motion.div
                  ref={cardRef}
                  initial={{
                    top: coords.startTop,
                    left: coords.startLeft,
                    width: coords.startWidth,
                    height: coords.startHeight,
                    borderRadius: 8,
                    backgroundColor: "#fef3c7",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    opacity: 1,
                  }}
                  animate={{
                    top: coords.targetTop,
                    left: coords.targetLeft,
                    width: coords.targetWidth,
                    height: coords.targetHeight,
                    borderRadius: 20,
                    backgroundColor: "#fef3c7",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    opacity: 1,
                  }}
                  exit={{
                    top: coords.startTop,
                    left: coords.startLeft,
                    width: coords.startWidth,
                    height: coords.startHeight,
                    borderRadius: 8,
                    backgroundColor: "#fef3c7",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                  className="fixed z-10 border border-amber-200/90 text-left overflow-hidden bg-[#fef3c7] shadow-2xl shadow-amber-900/10"
                >
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-4 right-4 h-7 w-7 rounded-full bg-amber-200/70 hover:bg-amber-200 active:bg-amber-300 text-amber-950 border border-amber-300/60 flex items-center justify-center transition-colors cursor-pointer z-20"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>

                  {/* Form Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: 0.06 }}
                    className="p-5 sm:p-6 h-full flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="flex flex-col items-start pr-6 gap-1">
                      <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-0.5">
                        Welcome back!
                      </h3>

                      {/* Pill-shaped Frosted Glass Segmented Control */}
                      <div className="relative w-full p-1 rounded-full bg-amber-200/60 backdrop-blur-md border border-amber-300/70 grid grid-cols-2 gap-1 shadow-inner my-1">
                        <button
                          type="button"
                          onClick={() => setRole("student")}
                          className={cn(
                            "relative z-10 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer select-none",
                            role === "student" ? "text-amber-950" : "text-amber-900/60 hover:text-amber-950"
                          )}
                        >
                          {role === "student" && (
                            <motion.div
                              layoutId="morphRolePill"
                              className="absolute inset-0 rounded-full bg-white shadow-sm border border-amber-300/40"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 25,
                              }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5" />
                            Student
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole("recruiter")}
                          className={cn(
                            "relative z-10 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer select-none",
                            role === "recruiter" ? "text-amber-950" : "text-amber-900/60 hover:text-amber-950"
                          )}
                        >
                          {role === "recruiter" && (
                            <motion.div
                              layoutId="morphRolePill"
                              className="absolute inset-0 rounded-full bg-white shadow-sm border border-amber-300/40"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 25,
                              }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" />
                            Recruiter
                          </span>
                        </button>
                      </div>

                      {/* Subtitle with seamless transition */}
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={role}
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.15 }}
                          className="text-zinc-600 text-[11px] leading-tight"
                        >
                          {role === "student"
                            ? "Turn GitHub activity & certificates into an evidence-backed skill passport."
                            : "Discover verified talent, evaluate skill passports, and hire with proof."}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {error && (
                      <div className="text-red-600 text-xs bg-red-50/90 p-2 rounded-lg border border-red-200 my-0.5">
                        {error}
                      </div>
                    )}

                    {/* Inputs & Action Form */}
                    <div className="flex flex-col gap-2.5 my-1">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="morph-email" className="text-zinc-800 text-[11px] font-semibold">
                          Email
                        </Label>
                        <input
                          id="morph-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="youremail@yourdomain.com"
                          className="w-full h-9 px-3 rounded-lg bg-white/80 border border-amber-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white text-xs transition-all shadow-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label htmlFor="morph-password" className="text-zinc-800 text-[11px] font-semibold">
                          Password
                        </Label>
                        <input
                          id="morph-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create or enter password"
                          className="w-full h-9 px-3 rounded-lg bg-white/80 border border-amber-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white text-xs transition-all shadow-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleEmailLogin}
                        disabled={isLoading}
                        className="w-full h-9 text-xs font-semibold mt-1 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-lg transition-colors cursor-pointer shadow-md active:scale-[0.99] flex items-center justify-center"
                      >
                        {isLoading ? "Signing in..." : `Sign in as ${role === "student" ? "Student" : "Recruiter"}`}
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-0.5">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-amber-200/80" />
                      </div>
                      <div className="relative flex justify-center text-[11px]">
                        <span className="bg-[#fef3c7] px-2.5 text-zinc-500 font-medium">or continue with</span>
                      </div>
                    </div>

                    {/* OAuth Providers */}
                    <div className={cn("grid gap-2.5", role === "student" ? "grid-cols-2" : "grid-cols-1")}>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="h-9 bg-white/80 hover:bg-white active:bg-amber-100 border border-amber-200/90 text-zinc-800 rounded-lg flex items-center justify-center transition-colors cursor-pointer gap-2 font-medium shadow-xs text-xs"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span className="text-zinc-800 font-medium">
                          {role === "student" ? "Google" : "Continue with Google"}
                        </span>
                      </button>

                      {role === "student" && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          type="button"
                          onClick={handleGithubLogin}
                          className="h-9 bg-white/80 hover:bg-white active:bg-amber-100 border border-amber-200/90 text-zinc-800 rounded-lg flex items-center justify-center transition-colors cursor-pointer gap-2 font-medium shadow-xs text-xs"
                        >
                          <svg className="h-3.5 w-3.5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <span className="text-zinc-800 font-medium">GitHub</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
