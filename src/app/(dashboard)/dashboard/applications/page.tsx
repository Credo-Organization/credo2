import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobTrackerHub } from "@/components/tracker/job-tracker-hub";
import { FileCheck2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full min-h-full px-4 sm:px-8 py-8 max-w-[1400px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B]">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100">
              My Applications
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Track where you&apos;ve applied, recruiter reviews, and upcoming interviews.
          </p>
        </div>

        <Link href="/dashboard/internships">
          <button
            type="button"
            className="h-10 px-4 rounded-xl bg-[#BAE6FD] hover:bg-sky-200 text-blue-950 text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <span>Browse Matched Roles</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </Link>
      </div>

      {/* Main Tracker Client Hub */}
      <JobTrackerHub />
    </div>
  );
}
