"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { disconnectGitHub } from "@/actions/github";
import { Code2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GitHubConnection } from "@/types/database";

export function GitHubSettings({ connection }: { connection: GitHubConnection | null }) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = () => {
    const backendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://localhost:8000";
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `${backendUrl}/auth/login`;
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect GitHub? This will stop future syncs.")) return;
    
    setIsDisconnecting(true);
    const result = await disconnectGitHub();
    
    if (result.success) {
      toast.success("GitHub account disconnected.");
    } else {
      toast.error(result.error || "Failed to disconnect.");
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card/40">
      <div className="flex items-center gap-4">
        {connection?.avatar_url ? (
          <img src={connection.avatar_url} alt="GitHub Avatar" className="w-12 h-12 rounded-full border border-border" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center border border-border">
            <Code2 className="w-6 h-6 text-zinc-500" />
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-zinc-900">
            {connection ? connection.github_username : "Connect GitHub"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {connection ? "Your GitHub account is connected." : "Connect to sync your repositories and generate skills."}
          </p>
        </div>
      </div>

      <div>
        {connection ? (
          <Button variant="ghost" onClick={handleDisconnect} disabled={isDisconnecting} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            {isDisconnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect} className="bg-zinc-900 text-white hover:bg-zinc-800">
            <Code2 className="w-4 h-4 mr-2" />
            Connect GitHub
          </Button>
        )}
      </div>
    </div>
  );
}
