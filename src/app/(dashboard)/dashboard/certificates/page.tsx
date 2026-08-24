import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CertificatesClientHub } from "@/components/certificates/certificates-client-hub";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch certificates from Supabase
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  // No fabricated fallback data here. This product's entire claim is that a
  // credential on screen has been verified, so rendering sample certificates
  // for an empty account would be indistinguishable from the fraud it exists
  // to catch. An empty account shows the uploader's empty state instead.
  const displayCertificates = (certificates || []).map((c) => ({
    ...c,
    status: (c.status as any) || "pending",
  }));

  return (
    <div className="w-full min-h-full px-4 sm:px-8 py-8 max-w-[1400px] mx-auto">
      <CertificatesClientHub
        certificates={displayCertificates}
        studentDid={`did:cdy:ed25519:${user.id.slice(0, 8)}...`}
      />
    </div>
  );
}
