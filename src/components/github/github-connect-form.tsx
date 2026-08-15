"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { syncGitHub } from "@/actions/github";
import { GitBranch, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function GitHubConnectForm() {
  const [username, setUsername] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setIsSyncing(true);
      await syncGitHub(username.trim());
      toast.success("GitHub account connected and synced successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to connect to GitHub");
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-fade-in-up">
      <div className="glass p-8 rounded-2xl shadow-xl border border-border/50 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <GitBranch className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Connect GitHub</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your GitHub username to sync your repositories, languages, and contribution statistics.
        </p>

        <form onSubmit={handleSync} className="space-y-4 text-left">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              GitHub Username
            </label>
            <Input
              id="username"
              placeholder="e.g. torvalds"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSyncing}
              required
              className="h-11"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 gap-2" 
            disabled={!username.trim() || isSyncing}
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Syncing Profile...
              </>
            ) : (
              <>
                Connect Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
