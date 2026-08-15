import { PageHeader } from "@/components/shared/page-header";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, connections, and preferences."
        icon={Settings}
      />
      <div className="text-sm text-muted-foreground">
        Settings page coming soon.
      </div>
    </div>
  );
}
