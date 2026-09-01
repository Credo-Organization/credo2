"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * A top bar rather than the student sidebar. A recruiter has two destinations -
 * the shortlist and a candidate - so a rail of navigation would be mostly empty
 * space. This keeps the full width for the table, which is what they came for.
 */
export function RecruiterHeader({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl?: string;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-stone-200/70 bg-[#fdf8f0]/85 px-4 py-3 backdrop-blur-md sm:px-6">
      <Link href="/recruiter" className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-navy-50 text-navy-700">
          <Briefcase className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-stone-900">Credify</span>
          <span className="truncate text-[11px] text-stone-500">Recruiter console</span>
        </span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account menu"
          className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-white py-1 pl-1 pr-3 outline-none transition-colors hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-400"
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={avatarUrl} alt="" />
            <AvatarFallback className="bg-stone-100 text-[11px] text-stone-600">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[10rem] truncate text-[13px] font-medium text-stone-700 sm:block">
            {name}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium text-stone-900">{name}</p>
            <p className="truncate text-xs text-stone-500">{email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
