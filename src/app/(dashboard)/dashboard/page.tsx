import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { LayoutDashboard, GitBranch, Award, Shield, Map, ArrowRight, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.full_name || "there";

  const quickActions = [
    {
      title: "Connect GitHub",
      description: "Analyze your repos and commits",
      icon: GitBranch,
      href: "/github",
      color: "text-blue-400",
    },
    {
      title: "Upload Certificates",
      description: "Add your certifications",
      icon: Award,
      href: "/certificates",
      color: "text-amber-400",
    },
    {
      title: "View Passport",
      description: "See your skill passport",
      icon: Shield,
      href: "/passport",
      color: "text-primary",
    },
    {
      title: "Find Opportunities",
      description: "Match with jobs and internships",
      icon: Briefcase,
      href: "/opportunities",
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${displayName.split(" ")[0]}`}
        description="Here's an overview of your skill passport progress."
        icon={LayoutDashboard}
      />

      {/* Profile completeness */}
      <Card className="p-6 bg-card/50 border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Profile Completeness</h3>
          <span className="text-sm text-muted-foreground">25%</span>
        </div>
        <Progress value={25} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Connect GitHub and upload certificates to build your passport.
        </p>
      </Card>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group p-5 bg-card/50 border-border/50 hover:border-border/80 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
                <action.icon className={`h-5 w-5 mb-3 ${action.color}`} />
                <h4 className="text-sm font-semibold mb-1">{action.title}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
                <ArrowRight className="h-4 w-4 mt-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats placeholder */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Skills Discovered", value: "—", sub: "Connect sources" },
          { label: "Evidence Items", value: "—", sub: "No data yet" },
          { label: "Passport Status", value: "Draft", sub: "Not generated" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 bg-card/50 border-border/50">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
