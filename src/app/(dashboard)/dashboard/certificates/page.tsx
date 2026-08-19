import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CertificateUploader } from "@/components/certificates/certificate-uploader";
import { FileBadge, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-8 lg:p-12 relative overflow-y-auto">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-foreground/[0.02] blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Certificates</h1>
          <p className="text-white/60">Upload and verify your certificates to boost your Skill Passport.</p>
        </div>
        <CertificateUploader />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {!certificates || certificates.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FileBadge className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No certificates yet</h3>
            <p className="text-white/50 text-center max-w-sm mb-6">Upload your first certificate to get it verified by our backend engine.</p>
            <CertificateUploader />
          </div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="glass overflow-hidden rounded-[16px] border border-white/[0.05] relative shadow-lg p-6 hover:border-white/[0.1] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                  <FileBadge className="w-5 h-5" />
                </div>
                {cert.status === 'verified' && (
                  <div className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                )}
                {cert.status === 'pending' && (
                  <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium flex items-center gap-1.5">
                    Pending
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1 truncate">{cert.title}</h3>
              <p className="text-white/60 text-sm mb-4 truncate">{cert.issuer}</p>
              
              <a href={cert.file_url} target="_blank" rel="noreferrer" className="block w-full">
                <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 text-white border-none h-9">
                  View Document
                </Button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
