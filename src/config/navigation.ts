import {
  LayoutDashboard,
  UserCircle,
  Users,
  UserPlus,
  Briefcase,
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
    title: "Find Team",
    href: "/dashboard/find-team",
    icon: Users,
  },
  {
    title: "Create Teammates",
    href: "/dashboard/create-teammates",
    icon: UserPlus,
  },
  {
    title: "Internships",
    href: "/dashboard/internships",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
