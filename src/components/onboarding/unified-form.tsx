"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
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
      "Minskey_GitHub_Auth",
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
            ? "GitHub configuration error: Invalid Client Secret. Please verify Minskey settings."
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

  const getCardMotionProps = (cardStep: number) => {
    const diff = cardStep - step;
    
    if (diff === 0) {
      return {
        x: "0%",
        scale: 1,
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
        filter: "blur(0px)",
      };
    } else if (diff === -1) {
      return {
        x: "-112%",
        scale: 0.9,
        opacity: 0.35,
        zIndex: 10,
        pointerEvents: "auto" as const,
        filter: "blur(0.5px)",
      };
    } else if (diff === 1) {
      return {
        x: "112%",
        scale: 0.9,
        opacity: 0.35,
        zIndex: 10,
        pointerEvents: "auto" as const,
        filter: "blur(0.5px)",
      };
    } else {
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

  const stepsMeta = [
    { num: 1, label: "Profile Info", doodle: "Tell us who you are" },
    { num: 2, label: "GitHub Proof", doodle: "Real code audit" },
    { num: 3, label: "Credentials", doodle: "Certs & Resume" },
  ];

  return (
    <div className="relative w-full max-w-7xl overflow-x-clip overflow-y-visible flex flex-col items-center justify-center min-h-[760px] py-4">
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

      {/* ── Doodle Stepper Header ── */}
      <div className="w-full max-w-md mx-auto mb-8 select-none">
        <div className="relative flex items-center justify-between">
          {/* Connector dashed line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-b-2 border-dashed border-zinc-400 -z-0" />

          {stepsMeta.map((s) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as any)}
                className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-full border-2 border-zinc-900 flex items-center justify-center font-bold text-sm transition-all shadow-[2px_2px_0px_0px_rgba(24,24,27,0.95)]",
                    isActive && "bg-blue-600 text-white scale-110",
                    isCompleted && "bg-emerald-400 text-zinc-950",
                    !isActive && !isCompleted && "bg-white text-zinc-600 group-hover:bg-zinc-100"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <span className="font-doodle text-xl">{s.num}</span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-xs font-bold transition-colors whitespace-nowrap",
                    isActive ? "text-zinc-950" : "text-zinc-500"
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3-Step Carousel Stage ── */}
      <div className="relative w-full max-w-[500px] min-h-[660px] flex items-center justify-center">
        {/* ═══════════════ STEP 1: ABOUT YOURSELF ═══════════════ */}
        <motion.div
          ref={step1CardRef}
          animate={getCardMotionProps(1)}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={() => step !== 1 && setStep(1)}
          className={cn(
            "absolute w-full rounded-3xl bg-white border-2 border-zinc-900 p-7 sm:p-9 shadow-[7px_7px_0px_0px_rgba(24,24,27,0.95)] flex flex-col justify-between select-none relative",
            step !== 1 && "cursor-pointer hover:opacity-60 transition-opacity"
          )}
        >
          {/* Pastel Washi Tape Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-200/80 rounded-xs border border-zinc-900/20 shadow-xs pointer-events-none -rotate-1" />

          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-doodle text-2xl text-blue-600 font-bold block mb-1">
              ✨ Step 1 of 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Tell us about yourself
            </h2>
            <p className="text-zinc-600 mt-1 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-normal">
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
                  <FormItem className="space-y-1">
                    <FormLabel className="text-zinc-950 text-xs font-bold">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-sm shadow-xs"
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-rose-700 font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college_name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-zinc-950 text-xs font-bold">College / University</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-sm shadow-xs"
                        placeholder="IIT Delhi / BITS Pilani"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-rose-700 font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3.5">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-zinc-950 text-xs font-bold">Degree</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-sm shadow-xs"
                          placeholder="B.Tech CS"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-rose-700 font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="graduation_year"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-zinc-950 text-xs font-bold">Graduating Year</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-sm shadow-xs"
                          placeholder="2026"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-rose-700 font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-zinc-950 text-xs font-bold">Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl text-sm shadow-xs focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-2 border-zinc-900 text-zinc-950 rounded-xl shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)]">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px] text-rose-700 font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="career_goal"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-zinc-950 text-xs font-bold">Career Goal</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-600 text-sm shadow-xs"
                          placeholder="Full Stack Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-rose-700 font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <button
                type="button"
                onClick={validateAndProceedToStep2}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.95)] hover:translate-x-[1px] hover:translate-y-[1px] mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to GitHub Proof</span>
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
            "absolute w-full rounded-3xl bg-white border-2 border-zinc-900 p-7 sm:p-9 shadow-[7px_7px_0px_0px_rgba(24,24,27,0.95)] flex flex-col justify-between select-none min-h-[560px] relative",
            step !== 2 && "cursor-pointer hover:opacity-60 transition-opacity"
          )}
        >
          {/* Pastel Washi Tape Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-emerald-200/80 rounded-xs border border-zinc-900/20 shadow-xs pointer-events-none rotate-1" />

          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-doodle text-2xl text-emerald-700 font-bold block mb-1">
              ✨ Step 2 of 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Connect your GitHub
            </h2>
            <p className="text-zinc-600 mt-1 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-normal">
              GitProof scans your commit history, repositories, and languages.
            </p>
          </div>

          {/* Sketched Mint-Green Inner Box */}
          <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-white border-2 border-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <svg className="h-8 w-8 fill-zinc-950" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-950">Sync GitHub Account</h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
                Authenticate to automatically import your repositories, commits, and verified skills.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOAuthConnect}
              disabled={isConnecting}
              className="w-full h-12 gap-2.5 bg-white hover:bg-zinc-50 border-2 border-zinc-900 text-zinc-950 rounded-xl font-bold transition-all shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] hover:translate-x-[1px] hover:translate-y-[1px] text-xs sm:text-sm flex items-center justify-center cursor-pointer disabled:opacity-80"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                  <span>Connecting GitHub...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 fill-zinc-950" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Authorize with GitHub</span>
                </>
              )}
            </button>

            {syncStatus && (
              <div className="flex items-center justify-center gap-2 p-2.5 text-xs text-emerald-950 bg-emerald-100 border-2 border-emerald-300 rounded-xl font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-900" />
                <span>{syncStatus}</span>
              </div>
            )}

            {githubError && (
              <div role="alert" className="flex items-center gap-2 p-2.5 text-xs text-rose-950 bg-rose-50 border-2 border-rose-600 rounded-xl text-left font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{githubError}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-6">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.95)] hover:translate-x-[1px] hover:translate-y-[1px] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full h-9 rounded-xl bg-transparent text-zinc-600 hover:text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
            "absolute w-full rounded-3xl bg-white border-2 border-zinc-900 p-7 sm:p-9 shadow-[7px_7px_0px_0px_rgba(24,24,27,0.95)] flex flex-col justify-between select-none min-h-[560px] relative",
            step !== 3 && "cursor-pointer hover:opacity-60 transition-opacity"
          )}
        >
          {/* Pastel Washi Tape Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-sky-200/80 rounded-xs border border-zinc-900/20 shadow-xs pointer-events-none -rotate-1" />

          {/* Header */}
          <div className="text-center mb-5">
            <span className="font-doodle text-2xl text-blue-600 font-bold block mb-1">
              ✨ Step 3 of 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Upload Documents
            </h2>
            <p className="text-zinc-600 mt-1 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-normal">
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
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.95)] hover:translate-x-[1px] hover:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
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
              className="w-full h-9 rounded-xl bg-transparent text-zinc-600 hover:text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
