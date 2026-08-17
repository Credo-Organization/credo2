import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, GitBranch, Award, Shield, Briefcase, ArrowRight, Sparkles, FileCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { Highlighter } from "@/components/ui/highlighter";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.full_name || "there";
  const firstName = displayName.split(" ")[0];

  const quickActions = [
    {
      title: "Connect GitHub",
      description: "Analyze your repos and commits",
      icon: GitBranch,
      href: "/github",
      color: "text-zinc-900",
      bg: "bg-zinc-100",
      border: "group-hover:border-zinc-300",
      glow: "group-hover:shadow-md"
    },
    {
      title: "Upload Certificates",
      description: "Add your certifications",
      icon: Award,
      href: "/certificates",
      color: "text-zinc-900",
      bg: "bg-zinc-100",
      border: "group-hover:border-zinc-300",
      glow: "group-hover:shadow-md"
    },
    {
      title: "View Passport",
      description: "See your skill passport",
      icon: Shield,
      href: "/passport",
      color: "text-zinc-900",
      bg: "bg-zinc-100",
      border: "group-hover:border-zinc-300",
      glow: "group-hover:shadow-md"
    },
    {
      title: "Find Opportunities",
      description: "Match with jobs & internships",
      icon: Briefcase,
      href: "/opportunities",
      color: "text-zinc-900",
      bg: "bg-zinc-100",
      border: "group-hover:border-zinc-300",
      glow: "group-hover:shadow-md"
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2 animate-fade-in-up mt-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <span className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">Dashboard Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-1">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl font-normal">
          Track your skill progress, manage your evidence, and find roles that match your true capabilities.
        </p>
      </div>

      {/* Profile Completeness */}
      <div className="animate-fade-in-up [animation-delay:150ms]">
        <Card className="p-6 bg-card border-border shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Profile Completeness
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect GitHub and upload certificates to build a stronger passport.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-zinc-900">25%</span>
              </div>
            </div>
            
            {/* Minimalist stark progress bar */}
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
              <div 
                className="h-full bg-zinc-900 transition-all duration-1000 ease-out"
                style={{ width: "25%" }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up [animation-delay:300ms]">
        <h3 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-4">
          Quick Actions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={action.href} href={action.href} className="block outline-none">
              <Card className={`group relative p-5 bg-card border-border shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full ${action.border} ${action.glow}`}>
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105 border border-zinc-200/60 ${action.bg}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-1">{action.title}</h4>
                  <p className="text-xs text-muted-foreground mb-4 flex-grow line-clamp-2">{action.description}</p>
                  
                  <div className="mt-auto flex items-center text-xs font-semibold text-indigo-600">
                    Get started
                    <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid sm:grid-cols-3 gap-4 animate-fade-in-up [animation-delay:450ms]">
        {[
          { label: "Skills Discovered", value: "0", sub: "Connect sources", icon: Sparkles },
          { label: "Evidence Items", value: "0", sub: "No data yet", icon: FileCheck },
          { label: "Passport Status", value: "Draft", sub: "Not generated", icon: Shield },
        ].map((stat, i) => (
          <Card key={stat.label} className="relative p-5 bg-card border-border shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold tracking-tight text-zinc-900">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5">
              <stat.icon className="w-16 h-16 text-zinc-900" />
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
