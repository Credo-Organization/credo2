import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PassportCard } from "@/components/passport/passport-card";
import { ShareDialog } from "@/components/passport/share-dialog";
import { GeneratePassportButton } from "@/components/passport/generate-button";

export default async function PassportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the latest passport
  const { data: passport } = await supabase
    .from("passports")
    .select("*")
    .eq("profile_id", user.id)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
    
  const username = profile?.username || user.id;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Skill Passport"
          description="Your evidence-backed professional digital identity."
          icon={Shield}
        />
        
        {passport && (
          <div className="flex items-center gap-3">
            <GeneratePassportButton />
            <ShareDialog isPublic={passport.is_public} username={username} />
          </div>
        )}
      </div>

      {!passport ? (
        <EmptyState
          icon={Shield}
          title="Passport not generated"
          description="We will analyze your GitHub activity and certificates to generate an evidence-backed skill matrix."
        >
          <GeneratePassportButton />
        </EmptyState>
      ) : (
        <div id="passport-card-capture" className="mt-8 animate-fade-in-up p-4 -m-4">
          <PassportCard data={passport.snapshot_data} />
        </div>
      )}
    </div>
  );
}
