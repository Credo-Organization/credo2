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
import { useOnboardingStore, type PersonalInfo } from "@/stores/onboarding-store";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  country: z.string().min(2, "Country must be at least 2 characters."),
  college_name: z.string().min(2, "College name must be at least 2 characters."),
  degree: z.string().min(2, "Degree must be at least 2 characters."),
  graduation_year: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year."),
});

export function PersonalInfoForm() {
  const { personalInfo, setPersonalInfo, setStep } = useOnboardingStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: personalInfo?.full_name || "",
      country: personalInfo?.country || "",
      college_name: personalInfo?.college_name || "",
      degree: personalInfo?.degree || "",
      graduation_year: personalInfo?.graduation_year || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPersonalInfo(values as PersonalInfo);
    setStep(2);
  }

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Tell us about yourself</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          This helps us personalize your skill passport and roadmap.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="college_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College / University</FormLabel>
                <FormControl>
                  <Input placeholder="IIT Delhi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="B.Tech Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="graduation_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input placeholder="2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-11 mt-4 gap-2">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
