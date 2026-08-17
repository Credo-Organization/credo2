import { createClient } from "@/lib/supabase/server";
import { PassportCard } from "@/components/passport/passport-card";
import { notFound } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicPassportPage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Find profile by username or ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .or(`username.eq.${username},id.eq.${username}`)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch the latest public passport for this user
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_public", true)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!passport) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Passport Private or Not Found</h1>
        <p className="text-muted-foreground mb-8">This user&apos;s skill passport is currently private.</p>
        <Link href="/" className="text-primary hover:underline font-medium">
          Create your own on Credify
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Credify</span>
          </Link>
        </div>
        
        <div className="animate-fade-in-up">
          <PassportCard data={passport.snapshot_data} />
        </div>
        
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by evidence-backed skill verification.</p>
          <Link href="/" className="text-primary hover:underline mt-2 inline-block">
            Build your own digital identity
          </Link>
        </div>
      </div>
    </div>
  );
}
