import {
  LayoutDashboard,
  GitBranch,
  Award,
  Shield,
  Briefcase,
  Map,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export const dashboardNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "GitHub",
    href: "/github",
    icon: GitBranch,
  },
  {
    title: "Certificates",
    href: "/certificates",
    icon: Award,
  },
  {
    title: "Passport",
    href: "/passport",
    icon: Shield,
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    icon: Briefcase,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
