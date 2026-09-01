"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Briefcase, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * The role toggle above only changed a label. Selecting "Recruiter" and
   * signing in still landed on the student dashboard, because nothing carried
   * the choice through the OAuth round trip.
   *
   * It travels in a cookie rather than on the callback URL: Supabase matches
   * redirectTo against an allowlist, and appending a query string makes it miss,
   * which silently drops the user on the project's Site URL.
   */
  const rememberRoleChoice = () => {
    if (role === "recruiter") {
      document.cookie = `post_login_next=${encodeURIComponent("/recruiter-signup")}; path=/; max-age=600; samesite=lax`;
      return;
    }
    // Selecting Student must clear the cookie, not merely decline to set it.
    // Arriving from the landing page's recruiter link leaves one behind with a
    // ten minute life; without this, toggling back to Student and signing in
    // still routed through /recruiter-signup.
    document.cookie = "post_login_next=; path=/; max-age=0; samesite=lax";
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("your-project-ref") || supabaseUrl.includes("mock-project")) {
      setError("Please set your real NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in the .env file to enable Google Login.");
      return;
    }
    try {
      rememberRoleChoice();
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
    if (!supabaseUrl || supabaseUrl.includes("your-project-ref") || supabaseUrl.includes("mock-project")) {
      setError("Please set your real NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in the .env file to enable GitHub Login.");
      return;
    }
    try {
      rememberRoleChoice();
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
    // The button reads "Sign in as Recruiter", so this path has to honour the
    // choice too. It never reaches /auth/callback - it reloads in place - so
    // the cookie alone would not be read; the reload target is set explicitly
    // below once the sign-in succeeds.
    rememberRoleChoice();

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
      window.location.assign(role === "recruiter" ? "/recruiter-signup" : "/dashboard");
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
          <Shield className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Credify</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Transform your skills into a verified passport
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full glass rounded-2xl p-6 space-y-5 border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Pill-shaped Frosted Glass Segmented Control */}
        <div className="relative w-full p-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 grid grid-cols-2 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={cn(
              "relative z-10 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer select-none",
              role === "student" ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            {role === "student" && (
              <motion.div
                layoutId="authPageRolePill"
                className="absolute inset-0 rounded-full bg-zinc-800 border border-white/15 shadow-md"
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
              "relative z-10 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer select-none",
              role === "recruiter" ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            {role === "recruiter" && (
              <motion.div
                layoutId="authPageRolePill"
                className="absolute inset-0 rounded-full bg-zinc-800 border border-white/15 shadow-md"
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

        <AnimatePresence mode="wait">
          <motion.p
            key={role}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            className="text-center text-xs text-muted-foreground"
          >
            {role === "student"
              ? "Continue as a student to generate and share your verified skill passport."
              : "Continue as a recruiter to discover and evaluate verified talent."}
          </motion.p>
        </AnimatePresence>

        {error && (
          <div className="text-red-400 text-xs bg-red-400/10 p-2.5 rounded-lg border border-red-400/20">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email" className="text-zinc-200 font-normal text-xs">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="youremail@yourdomain.com"
              className="h-11 bg-[#1c1c1c] border-0 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700 rounded-lg text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-password" className="text-zinc-200 font-normal text-xs">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create or enter password"
              className="h-11 bg-[#1c1c1c] border-0 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700 rounded-lg text-sm"
            />
          </div>

          <Button
            onClick={handleEmailLogin}
            disabled={isLoading}
            className="w-full h-11 text-xs font-semibold mt-1 bg-[#2a2a2a] hover:bg-white text-white hover:text-black rounded-lg border-0 transition-colors shadow-sm cursor-pointer"
          >
            {isLoading ? "Signing in..." : `Sign in as ${role === "student" ? "Student" : "Recruiter"}`}
          </Button>
        </div>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#18181b] px-3 text-zinc-400 font-medium">or continue with</span>
          </div>
        </div>

        <div className={cn("grid gap-3", role === "student" ? "grid-cols-2" : "grid-cols-1")}>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            size="lg"
            className="w-full gap-2.5 h-11 text-xs font-medium bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
            <span>{role === "student" ? "Google" : "Continue with Google"}</span>
          </Button>

          {role === "student" && (
            <Button
              onClick={handleGithubLogin}
              variant="outline"
              size="lg"
              className="w-full gap-2.5 h-11 text-xs font-medium bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground/60">
        Powered by evidence-based skill verification
      </p>
    </div>
  );
}
