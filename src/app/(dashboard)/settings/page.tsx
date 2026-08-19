import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { GitHubSettings } from "@/components/settings/github-settings";
import { ProviderToggle } from "@/components/settings/provider-toggle";
import { getAiProvider } from "@/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    .select("*")
    .eq("profile_id", user.id)
    .single();

  const provider = await getAiProvider();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your profile, connections, and platform preferences."
      />

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and academic background.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm profile={profile} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your connected external services.</CardDescription>
          </CardHeader>
          <CardContent>
            <GitHubSettings connection={connection} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Preferences</CardTitle>
            <CardDescription>Choose the AI model that powers your skill extraction and insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderToggle initialProvider={provider} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
