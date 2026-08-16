import { PageHeader } from "@/components/shared/page-header";
import { Settings, Sparkles, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAiProvider } from "@/actions/settings";
import { ProviderToggle } from "@/components/settings/provider-toggle";

export default async function SettingsPage() {
  const currentProvider = await getAiProvider();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <PageHeader
        title="Settings"
        description="Manage your account, connections, and preferences."
        icon={Settings}
      />
      
      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Provider Preference
            </CardTitle>
            <CardDescription>
              Choose which AI model handles your document extraction and skill mapping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderToggle initialProvider={currentProvider} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 opacity-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Other Settings
            </CardTitle>
            <CardDescription>
              More configuration options coming soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
