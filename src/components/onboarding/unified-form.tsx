"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { syncGitHub } from "@/actions/github";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  college_name: z.string().min(2, "College name must be at least 2 characters."),
  degree: z.string().min(2, "Degree must be at least 2 characters."),
  graduation_year: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year."),
  gender: z.string().min(1, "Please select your gender."),
  career_goal: z.string().min(2, "Career goal must be at least 2 characters."),
  github_username: z.string().min(1, "GitHub username is required"),
});

export function UnifiedOnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = await form.trigger([
      "full_name",
      "college_name",
      "degree",
      "graduation_year",
      "gender",
      "career_goal"
    ]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleGitHubVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dummy bypass: skip verification and proceed to document upload
    setStep(3);
  };

  const handleDocumentUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dummy bypass: skip actual upload and finish onboarding
    router.push("/dashboard");
    router.refresh();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // This is preserved but we're bypassing it with the dummy functions for now
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.auth.updateUser({
          data: {
            onboarding_completed: true,
            gender: values.gender,
            career_goal: values.career_goal
          }
        });

        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: values.full_name,
          college_name: values.college_name,
          degree: values.degree,
          graduation_year: values.graduation_year,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      }

      // Sync GitHub profile
      // await syncGitHub(values.github_username);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black mt-12 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {step === 1 && "Tell us about yourself"}
          {step === 2 && "Connect your GitHub"}
          {step === 3 && "Upload Documents"}
        </h2>
        <p className="text-zinc-400 mt-3 text-sm">
          {step === 1 && "This helps us personalize your skill passport and roadmap."}
          {step === 2 && "We'll analyze your public repositories to instantly build your skill passport."}
          {step === 3 && "Upload your certificates or resume to complete your profile."}
        </p>
      </div>

      <Form {...form}>
        <form className="my-8" onSubmit={(e) => e.preventDefault()}>

          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <LabelInputContainer>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </LabelInputContainer>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college_name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <LabelInputContainer>
                      <FormLabel>College / University</FormLabel>
                      <FormControl>
                        <Input placeholder="IIT Delhi" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </LabelInputContainer>
                  </FormItem>
                )}
              />

              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <LabelInputContainer>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="B.Tech CS" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </LabelInputContainer>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="graduation_year"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <LabelInputContainer>
                        <FormLabel>Graduating Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2026" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </LabelInputContainer>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-8 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <LabelInputContainer>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10 border-input bg-transparent dark:bg-transparent">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </LabelInputContainer>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="career_goal"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <LabelInputContainer>
                        <FormLabel>Career Goal</FormLabel>
                        <FormControl>
                          <Input placeholder="Frontend Engineer" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </LabelInputContainer>
                    </FormItem>
                  )}
                />
              </div>

              <button
                className="group/btn relative flex justify-center items-center h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                type="button"
                onClick={handleNextStep}
              >
                Continue &rarr;
                <BottomGradient />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="github_username"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <LabelInputContainer>
                      <FormLabel>GitHub Username</FormLabel>
                      <FormControl>
                        <Input placeholder="torvalds" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </LabelInputContainer>
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-4">
                <button
                  className="group/btn relative flex justify-center items-center h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleGitHubVerify}
                  disabled={loading}
                >
                  Verify and Continue
                  <BottomGradient />
                </button>

                <button
                  className="group/btn relative flex justify-center items-center h-10 w-full rounded-md bg-transparent font-medium text-zinc-400 border border-zinc-800 hover:text-white transition-colors"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  &larr; Back
                  <BottomGradient />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <FileUpload onChange={(files) => console.log(files)} />

              <div className="flex flex-col space-y-4">
                <button
                  className="group/btn relative flex justify-center items-center h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleDocumentUpload}
                  disabled={loading}
                >
                  Finish Onboarding
                  <BottomGradient />
                </button>

                <button
                  className="group/btn relative flex justify-center items-center h-10 w-full rounded-md bg-transparent font-medium text-zinc-400 border border-zinc-800 hover:text-white transition-colors"
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                >
                  &larr; Back
                  <BottomGradient />
                </button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
