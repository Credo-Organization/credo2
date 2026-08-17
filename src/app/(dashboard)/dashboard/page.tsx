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
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "group-hover:border-blue-400/50",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]"
    },
    {
      title: "Upload Certificates",
      description: "Add your certifications",
      icon: Award,
      href: "/certificates",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "group-hover:border-amber-400/50",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]"
    },
    {
      title: "View Passport",
      description: "See your skill passport",
      icon: Shield,
      href: "/passport",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "group-hover:border-primary/50",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(255,152,0,0.3)]"
    },
    {
      title: "Find Opportunities",
      description: "Match with jobs & internships",
      icon: Briefcase,
      href: "/opportunities",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "group-hover:border-emerald-400/50",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]"
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2 animate-fade-in-up">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 shadow-inner">
            <LayoutDashboard className="h-5 w-5 text-zinc-300" />
          </div>
          <span className="text-sm font-medium tracking-wider uppercase">Dashboard Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back, <ShimmerText text={firstName} className="inline-block" />
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Track your skill progress, manage your evidence, and find roles that match your true capabilities.
        </p>
      </div>

      {/* Profile Completeness */}
      <div className="animate-fade-in-up [animation-delay:150ms]">
        <Card className="p-6 relative overflow-hidden bg-card/40 backdrop-blur-md border-white/10 shadow-2xl group transition-all duration-500 hover:border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Profile Completeness
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect GitHub and upload certificates to build a stronger passport.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-foreground">25%</span>
              </div>
            </div>
            
            {/* Custom glowing progress bar */}
            <div className="h-3 w-full bg-zinc-900/50 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
              <div 
                className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full shadow-[0_0_15px_rgba(255,152,0,0.5)] transition-all duration-1000 ease-out relative"
                style={{ width: "25%" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up [animation-delay:300ms]">
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <Highlighter action="highlight" color="#FF9800">Quick Actions</Highlighter>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={action.href} href={action.href} className="block outline-none">
              <Card className={`group relative p-6 bg-card/40 backdrop-blur-md border-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full overflow-hidden ${action.border} ${action.glow}`}>
                {/* Subtle radial gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner border border-white/5 ${action.bg}`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h4 className="text-base font-semibold mb-2 group-hover:text-white transition-colors">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{action.description}</p>
                  
                  <div className="mt-auto flex items-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Get started
                    <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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
          { label: "Skills Discovered", value: "—", sub: "Connect sources", icon: Sparkles, color: "text-violet-400" },
          { label: "Evidence Items", value: "—", sub: "No data yet", icon: FileCheck, color: "text-blue-400" },
          { label: "Passport Status", value: "Draft", sub: "Not generated", icon: Shield, color: "text-zinc-400" },
        ].map((stat, i) => (
          <Card key={stat.label} className="relative p-6 bg-card/40 backdrop-blur-md border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
              <stat.icon className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
