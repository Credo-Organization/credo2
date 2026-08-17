import { GitHubRepo } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Star, GitFork, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RepoListProps {
  repos: GitHubRepo[];
}

export function RepoList({ repos }: RepoListProps) {
  // Sort by stars and activity
  const topRepos = [...repos]
    .sort((a, b) => b.stars_count - a.stars_count || new Date(b.last_commit_at || 0).getTime() - new Date(a.last_commit_at || 0).getTime())
    .slice(0, 6);

  if (topRepos.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-xl border-zinc-200 bg-zinc-50/50">
        <p className="text-sm font-medium text-zinc-500">No public repositories found.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {topRepos.map((repo) => (
        <Card key={repo.id} className="p-5 bg-card border border-border hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col h-full group">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-zinc-900 flex items-center gap-2 truncate">
              <BookOpen className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
              <a 
                href={`https://github.com/${repo.full_name}`} 
                target="_blank" 
                rel="noreferrer"
                className="hover:underline truncate"
              >
                {repo.name}
              </a>
            </h4>
            {repo.primary_language && (
              <Badge variant="outline" className="text-xs shrink-0 font-medium border-zinc-200 text-zinc-600 bg-zinc-50">
                {repo.primary_language}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {repo.description || "No description provided."}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span>{repo.stars_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{repo.forks_count}</span>
            </div>
            {repo.last_commit_at && (
              <div className="ml-auto">
                Updated {formatDistanceToNow(new Date(repo.last_commit_at), { addSuffix: true })}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
