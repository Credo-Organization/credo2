import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, ChevronRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CandidateLookup } from "@/components/recruiter/candidate-lookup";

interface SavedCandidateRow {
  passport_id: string;
  saved_at: string | null;
}

export default async function RecruiterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: savedRows } = await supabase
    .from("saved_candidates")
    .select("passport_id, saved_at")
    .eq("recruiter_id", user.id)
    .order("saved_at", { ascending: false });

  const candidates: SavedCandidateRow[] = savedRows ?? [];

  return (
    <div className="min-h-screen bg-[#050811] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Recruiter Console
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Candidate Shortlist</h1>
          <p className="text-sm text-white/50 mt-1">
            Look up a student&apos;s published Credify passport by ID, and keep track of the
            candidates you&apos;re considering.
          </p>
        </div>

        {/* Lookup */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6">
          <span className="text-[11px] font-bold tracking-widest uppercase text-white/40 block mb-3">
            Find a candidate
          </span>
          <CandidateLookup />
        </div>

        {/* Shortlist */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#0a0d14]/70 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold text-white">Saved Candidates ({candidates.length})</h2>
          </div>

          {candidates.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/[0.08]">
              <Users className="w-9 h-9 text-white/20 mb-2.5" />
              <h4 className="text-sm font-bold text-white/70">No candidates yet</h4>
              <p className="text-xs text-white/40 max-w-xs mt-1">
                Ask a student for their passport ID, or scan the QR code on their passport,
                to look them up and add them to your shortlist.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {candidates.map((candidate) => (
                <Link
                  key={candidate.passport_id}
                  href={`/recruiter/candidate/${candidate.passport_id}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-mono font-semibold text-white block truncate">
                      {candidate.passport_id}
                    </span>
                    <span className="text-xs text-white/40">
                      Saved{" "}
                      {candidate.saved_at
                        ? new Date(candidate.saved_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "recently"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
