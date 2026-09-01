"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { syncGitHub } from "@/actions/github";
import { updateProfile } from "@/actions/profile";
import { RealtimeScanModal } from "@/components/github/realtime-scan-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  college_name: z.string().min(2, "College name must be at least 2 characters."),
  degree: z.string().min(2, "Degree must be at least 2 characters."),
  graduation_year: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year."),
  gender: z.string().min(1, "Please select your gender."),
  career_goal: z.string().min(2, "Career goal must be at least 2 characters."),
  github_username: z.string().optional(),
});

export function UnifiedOnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [authLogin, setAuthLogin] = useState<string>("developer");
  const step1CardRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      full_name: "",
      college_name: "",
      degree: "",
      graduation_year: "",
      gender: "",
      career_goal: "",
      github_username: "",
    },
  });

  // Clear red error messages when clicking outside the form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (step1CardRef.current && !step1CardRef.current.contains(event.target as Node)) {
        form.clearErrors();
        setGithubError(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [form]);

  const validateAndProceedToStep2 = async () => {
    const isValid = await form.trigger([
      "full_name",
      "college_name",
      "degree",
      "graduation_year",
      "gender",
      "career_goal",
    ]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleOAuthConnect = () => {
    setGithubError(null);
    setIsConnecting(true);
    setSyncStatus("Waiting for GitHub authorization in popup...");

    const width = 600;
    const height = 750;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/api/auth/github",
      "Credify_GitHub_Auth",
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    const messageHandler = async (event: MessageEvent) => {
      if (event.data?.type === "GITHUB_AUTH_SUCCESS") {
        window.removeEventListener("message", messageHandler);
        setAuthLogin(event.data.login || "developer");
        setIsScanModalOpen(true);
        setSyncStatus("Connected! Running GitProof deep scan across your account...");

        try {
          const syncRes = await syncGitHub(event.data.login, event.data.token);
          if (syncRes.success) {
            setSyncStatus("GitProof scan completed! Advancing...");
          } else {
            setGithubError(syncRes.error || "Failed to scan GitHub repositories.");
          }
        } catch (err: any) {
          setGithubError(err?.message || "Sync failed.");
        } finally {
          setIsConnecting(false);
        }
      } else if (event.data?.type === "GITHUB_AUTH_ERROR") {
        window.removeEventListener("message", messageHandler);
        setGithubError(
          event.data.error === "incorrect_client_credentials"
            ? "GitHub configuration error: Invalid Client Secret. Please verify Credify settings."
            : event.data.error || "Authentication was cancelled."
        );
        setIsConnecting(false);
        setSyncStatus(null);
      }
    };

    window.addEventListener("message", messageHandler);
  };

  const handleDocumentUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const values = form.getValues();
      const res = await updateProfile(values);

      if (!res?.success) {
        toast.error(res?.error || "Could not save your profile. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to save profile", err);
      toast.error(err?.message || "Something went wrong while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get motion styling for each step card based on active step
  const getCardMotionProps = (cardStep: number) => {
    const diff = cardStep - step;
    
    if (diff === 0) {
      // Active center card
      return {
        x: "0%",
        scale: 1,
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
        filter: "blur(0px)",
      };
    } else if (diff === -1) {
      // Left preview card
      return {
        x: "-112%",
        scale: 0.9,
        opacity: 0.3,
        zIndex: 10,
        pointerEvents: "auto" as const,
        filter: "blur(0.5px)",
      };
    } else if (diff === 1) {
      // Right preview card
      return {
        x: "112%",
        scale: 0.9,
        opacity: 0.3,
        zIndex: 10,
        pointerEvents: "auto" as const,
        filter: "blur(0.5px)",
      };
    } else {
      // Hidden cards (> 1 distance)
      return {
        x: diff > 0 ? "230%" : "-230%",
        scale: 0.75,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
        filter: "blur(2px)",
      };
    }
  };

  return (
    <div className="relative w-full max-w-7xl overflow-x-clip overflow-y-visible flex flex-col items-center justify-center min-h-[760px] py-8">
      <RealtimeScanModal
        isOpen={isScanModalOpen}
        onClose={() => {
          setIsScanModalOpen(false);
          setStep(3);
        }}
        githubUsername={authLogin}
        onComplete={() => {
          setTimeout(() => {
            setIsScanModalOpen(false);
            setStep(3);
          }, 800);
        }}
      />

      {/* 3-Step Carousel Stage */}
      <div className="relative w-full max-w-[500px] min-h-[660px] flex items-center justify-center">
        {/* ═══════════════ STEP 1: ABOUT YOURSELF ═══════════════ */}
        <motion.div
          ref={step1CardRef}
          animate={getCardMotionProps(1)}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={() => step !== 1 && setStep(1)}
          className={cn(
            "absolute w-full rounded-[32px] bg-[#fef3c7] border border-amber-200/90 p-7 sm:p-9 shadow-2xl shadow-amber-900/10 flex flex-col justify-between select-none",
            step !== 1 && "cursor-pointer hover:border-amber-300 hover:opacity-50 transition-opacity"
          )}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-950 border border-amber-300/80 mb-3">
              Step 1 of 3
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Tell us about yourself
            </h2>
            <p className="text-amber-950/70 mt-2 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              This helps us personalize your skill passport and roadmap.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-zinc-900 text-xs font-bold">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-[#2a2a2a] border-0 text-zinc-300 rounded-xl placeholder-white placeholder-opacity-100 focus-visible:ring-2 focus-visible:ring-orange-500 text-sm shadow-sm"
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college_name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-zinc-900 text-xs font-bold">College / University</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-[#2a2a2a] border-0 text-zinc-300 rounded-xl placeholder-white placeholder-opacity-100 focus-visible:ring-2 focus-visible:ring-orange-500 text-sm shadow-sm"
                        placeholder="IIT Delhi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-600" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3.5">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-zinc-900 text-xs font-bold">Degree</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-[#2a2a2a] border-0 text-zinc-300 rounded-xl placeholder-white placeholder-opacity-100 focus-visible:ring-2 focus-visible:ring-orange-500 text-sm shadow-sm"
                          placeholder="B.Tech CS"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="graduation_year"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-zinc-900 text-xs font-bold">Graduating Year</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-[#2a2a2a] border-0 text-zinc-300 rounded-xl placeholder-white placeholder-opacity-100 focus-visible:ring-2 focus-visible:ring-orange-500 text-sm shadow-sm"
                          placeholder="2026"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-zinc-900 text-xs font-bold">Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full bg-[#2a2a2a] dark:bg-[#2a2a2a] border-0 text-zinc-300 rounded-xl text-sm placeholder:text-white data-[placeholder]:text-white shadow-sm focus:ring-2 focus:ring-orange-500">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#2a2a2a] border-0 text-zinc-300">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px] text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="career_goal"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-zinc-900 text-xs font-bold">Career Goal</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-[#2a2a2a] border-0 text-zinc-300 rounded-xl placeholder-white placeholder-opacity-100 focus-visible:ring-2 focus-visible:ring-orange-500 text-sm shadow-sm"
                          placeholder="Frontend Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <button
                type="button"
                onClick={validateAndProceedToStep2}
                className="w-full h-12 rounded-xl bg-[#f95700] hover:bg-[#e04e00] active:bg-[#c84600] text-white font-bold text-sm transition-all shadow-md shadow-orange-500/20 mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to GitHub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </Form>
        </motion.div>

        {/* ═══════════════ STEP 2: CONNECT GITHUB ═══════════════ */}
        <motion.div
          animate={getCardMotionProps(2)}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={() => step !== 2 && setStep(2)}
          className={cn(
            "absolute w-full rounded-[32px] bg-[#fef3c7] border border-amber-200/90 p-7 sm:p-9 shadow-2xl shadow-amber-900/10 flex flex-col justify-between select-none min-h-[560px]",
            step !== 2 && "cursor-pointer hover:border-amber-300 hover:opacity-50 transition-opacity"
          )}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-950 border border-amber-300/80 mb-3">
              Step 2 of 3
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Connect your GitHub
            </h2>
            <p className="text-amber-950/70 mt-2 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Live GitProof analysis scans commits and verifies real coding skills.
            </p>
          </div>

          {/* GitHub Connect Box */}
          <div className="bg-amber-100/60 p-6 rounded-2xl border border-amber-300/70 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-amber-900/10 border border-amber-300/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="h-8 w-8 fill-zinc-900" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            <div>
              <h3 className="text-base font-semibold text-zinc-900">Sync GitHub Account</h3>
              <p className="text-xs text-amber-950/70 mt-1 max-w-xs mx-auto">
                Authenticate to automatically import your repositories, commits, and verified skills.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOAuthConnect}
              disabled={isConnecting}
              className="w-full h-11 gap-2.5 bg-white hover:bg-amber-50 border border-amber-300 text-zinc-900 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm flex items-center justify-center cursor-pointer disabled:opacity-80"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 fill-zinc-900" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Connect with GitHub</span>
                </>
              )}
            </button>

            {syncStatus && (
              <div className="flex items-center justify-center gap-2 p-2.5 text-xs text-amber-950 bg-amber-200/70 border border-amber-300/80 rounded-xl">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-950" />
                <span>{syncStatus}</span>
              </div>
            )}

            {githubError && (
              <div className="flex items-center gap-2 p-2.5 text-xs text-red-700 bg-red-100 border border-red-300 rounded-xl text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{githubError}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-6">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full h-11 rounded-xl bg-[#f95700] hover:bg-[#e04e00] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full h-9 rounded-xl bg-transparent text-amber-950/70 hover:text-amber-950 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Step 1</span>
            </button>
          </div>
        </motion.div>

        {/* ═══════════════ STEP 3: UPLOAD DOCUMENTS ═══════════════ */}
        <motion.div
          animate={getCardMotionProps(3)}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={() => step !== 3 && setStep(3)}
          className={cn(
            "absolute w-full rounded-[32px] bg-[#fef3c7] border border-amber-200/90 p-7 sm:p-9 shadow-2xl shadow-amber-900/10 flex flex-col justify-between select-none min-h-[560px]",
            step !== 3 && "cursor-pointer hover:border-amber-300 hover:opacity-50 transition-opacity"
          )}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-950 border border-amber-300/80 mb-3">
              Step 3 of 3
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Upload Documents
            </h2>
            <p className="text-amber-950/70 mt-2 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Upload your certificates or resume to complete your passport.
            </p>
          </div>

          {/* File Upload Dropzone */}
          <div className="my-auto">
            <FileUpload onChange={(files) => console.log("Files:", files)} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-5">
            <button
              type="button"
              onClick={handleDocumentUpload}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#f95700] hover:bg-[#e04e00] active:bg-[#c84600] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Finalizing Passport...</span>
                </>
              ) : (
                <>
                  <span>Finish Onboarding & Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full h-9 rounded-xl bg-transparent text-amber-950/70 hover:text-amber-950 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to GitHub Connect</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

