"use client";

import { Badge } from "@/components/ui/badge";
import { ShieldCheck, GitBranch, Award, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvidenceGrid } from "./evidence-grid";

interface PassportCardProps {
  data: any; // The JSON snapshot data
  className?: string;
}

export function PassportCard({ data, className }: PassportCardProps) {
  if (!data) return null;

  const { profile, github, certificates, skills, top_projects } = data;

  return (
    <div className={cn("glass overflow-hidden rounded-3xl border border-border/50 relative shadow-2xl w-full max-w-4xl mx-auto", className)}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/[0.02] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-foreground/[0.03] blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header Profile Section */}
      <div className="p-8 pb-6 border-b border-border/40 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center border-2 border-primary/20 shrink-0">
            {/* If we had an avatar URL in the snapshot we'd use img, fallback to icon */}
            <UserCircle2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium">{profile.headline}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {profile.country && <span>📍 {profile.country}</span>}
              {profile.college && <span>🎓 {profile.college}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 shrink-0 md:items-end">
          <Badge variant="outline" className="px-3 py-1 font-semibold text-xs border-border bg-muted/50 text-foreground">
            Verified Profile
          </Badge>
          <div className="text-xs text-muted-foreground">
            ID: CRED-VERIFIED
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border/40 relative z-10">
        
        {/* Left Column: Metrics & Projects */}
        <div className="md:col-span-2 p-8 flex flex-col gap-8 bg-card/20">
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground/80 uppercase tracking-wider">Evidence Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl border border-border/60 shadow-sm">
                <GitBranch className="w-5 h-5 mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold">{github.total_repos || 0}</div>
                <div className="text-xs text-muted-foreground">Repositories</div>
              </div>
              <div className="glass p-4 rounded-xl border border-border/60 shadow-sm">
                <Award className="w-5 h-5 mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold">{certificates || 0}</div>
                <div className="text-xs text-muted-foreground">Certifications</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground/80 uppercase tracking-wider">Highlighted Projects</h3>
            <div className="space-y-3">
              {(top_projects || []).map((project: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-border/60 bg-card shadow-sm hover:bg-accent/50 transition-colors">
                  <div className="font-semibold text-sm text-foreground mb-1">{project.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{project.description || "No description provided."}</div>
                </div>
              ))}
              {(!top_projects || top_projects.length === 0) && (
                <div className="text-sm text-muted-foreground">No projects found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Grid */}
        <div className="md:col-span-3 p-8 flex flex-col bg-background/40">
          <h3 className="text-sm font-semibold mb-6 text-foreground/80 uppercase tracking-wider">Verified Skills</h3>
          <EvidenceGrid skills={skills || []} />
        </div>
      </div>
    </div>
  );
}
