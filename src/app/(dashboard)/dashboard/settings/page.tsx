import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { GitHubSettings } from "@/components/settings/github-settings";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  const { data: connection } = await supabase
    .from("github_connections")
    .select("id, github_username, avatar_url, synced_at, profile_id")
    .eq("profile_id", user.id)
    .single();

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in select-none">
      <PageHeader
        title="Account & Profile Settings"
        description="Manage your verified profile, linked GitHub account, and platform preferences."
      />

      <div className="grid gap-8">
        {/* Profile Information Card */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] space-y-6 transition-colors">
          <div className="border-b-2 border-dashed border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">Profile Information</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">Update your personal details and academic credentials reflected on your Skill Passport.</p>
          </div>
          <SettingsForm profile={profile} />
        </div>

        {/* Connected Accounts Card */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] space-y-6 transition-colors">
          <div className="border-b-2 border-dashed border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">Connected Accounts</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">Manage external developer services used for code ingestion and verification.</p>
          </div>
          <GitHubSettings connection={connection} />
        </div>
      </div>
    </div>
  );
}
