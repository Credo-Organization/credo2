"use client";

import { GitHubConnection, GitHubRepo, RepoLanguage } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Star, Code2, Activity, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageChart } from "./charts/language-chart";
import { RepoList } from "./repo-list";
import { syncGitHub, disconnectGitHub } from "@/actions/github";
import { useState } from "react";
import { toast } from "sonner";

interface GitHubInsightsProps {
  connection: GitHubConnection;
  repos: GitHubRepo[];
  languages: RepoLanguage[];
}

export function GitHubInsights({ connection, repos, languages }: GitHubInsightsProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const totalStars = repos.reduce((acc, repo) => acc + repo.stars_count, 0);
  const totalCommits = repos.reduce((acc, repo) => acc + (repo.total_commits || 0), 0);
  
  // Find top language
  const langMap = new Map<string, number>();
  languages.forEach((l) => {
    langMap.set(l.language, (langMap.get(l.language) || 0) + l.bytes);
  });
  const topLanguage = Array.from(langMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncGitHub(connection.github_username);
      toast.success("GitHub data synced successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sync GitHub data.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect GitHub? This will remove synced data.")) return;
    try {
      setIsDisconnecting(true);
      await disconnectGitHub();
      toast.success("GitHub account disconnected.");
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect.");
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-card/40 p-4 rounded-xl border border-border/50">
        <div className="flex items-center gap-4">
          {connection.avatar_url && (
            <img 
              src={connection.avatar_url} 
              alt={connection.github_username} 
              className="w-12 h-12 rounded-full border border-border"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{connection.github_username}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Connected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDisconnect} disabled={isDisconnecting} className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
            <Trash2 className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Repositories", value: repos.length, icon: BookOpen, color: "text-blue-500" },
          { label: "Total Stars", value: totalStars, icon: Star, color: "text-amber-400" },
          { label: "Top Language", value: topLanguage, icon: Code2, color: "text-emerald-500" },
          { label: "Followers", value: connection.followers || 0, icon: Activity, color: "text-purple-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <LanguageChart languages={languages} />
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top Repositories</h3>
          </div>
          <RepoList repos={repos} />
        </div>
      </div>
    </div>
  );
}
