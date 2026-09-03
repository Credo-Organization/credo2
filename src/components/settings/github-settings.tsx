"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { disconnectGitHub } from "@/actions/github";
import { Code2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GitHubConnection } from "@/types/database";
import { GitHubCalendar } from "@/components/ui/github-map";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl bg-zinc-50 dark:bg-zinc-800 shadow-xs transition-colors">
        <div className="flex items-center gap-4">
          {connection?.avatar_url ? (
            <img src={connection.avatar_url} alt="GitHub Avatar" className="w-12 h-12 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center border-2 border-zinc-900 dark:border-zinc-700 shadow-xs">
              <Code2 className="w-6 h-6 text-zinc-950 dark:text-zinc-100" />
            </div>
          )}
          
          <div>
            <h4 className="font-black text-zinc-950 dark:text-zinc-100 text-base">
              {connection ? connection.github_username : "Connect GitHub"}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              {connection ? "Your GitHub account is connected and actively scanned." : "Connect to sync your repositories and generate verifiable skills."}
            </p>
          </div>
        </div>

        <div>
          {connection ? (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="border-2 border-rose-600 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl font-bold h-11 px-4 cursor-pointer shadow-xs active:translate-y-[1px]"
            >
              {isDisconnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              className="bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl border-2 border-zinc-900 dark:border-zinc-700 h-11 px-5 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] cursor-pointer transition-all"
            >
              <Code2 className="w-4 h-4 mr-2" />
              Connect GitHub
            </Button>
          )}
        </div>
      </div>

      {/* Synchronized GitHub Contribution Heatmap */}
      <div className="pt-2 w-full min-w-0 max-w-full overflow-hidden">
        <GitHubCalendar
          title={connection ? `${connection.github_username}'s Git Activity Heatmap` : "Live Commit Velocity Preview"}
          className="border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_0px_#18181B] dark:shadow-[3px_3px_0px_0px_#000000] w-full min-w-0 max-w-full overflow-hidden"
        />
      </div>
    </div>
  );
}
