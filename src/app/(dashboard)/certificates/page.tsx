import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Award, Plus } from "lucide-react";
import { CertificateUploader } from "@/components/certificates/certificate-uploader";
import { CertificateGrid } from "@/components/certificates/certificate-grid";
import { createClient } from "@/lib/supabase/server";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Certificates"
          description="Upload your certifications and we'll extract skills automatically."
          icon={Award}
        />
        
        {certificates && certificates.length > 0 && (
          <CertificateUploader>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2">
              <Plus className="w-4 h-4" />
              Upload New
            </button>
          </CertificateUploader>
        )}
      </div>

      {!certificates || certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Upload course completions, certifications, or credentials to strengthen your passport."
        >
          <CertificateUploader />
        </EmptyState>
      ) : (
        <CertificateGrid certificates={certificates} />
      )}
    </div>
  );
}
