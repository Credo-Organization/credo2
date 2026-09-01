import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { agreementFromVotes } from "@/lib/ai/agreement";

export interface AuditRow {
  name: string;
  primary_language: string | null;
  integrity_status: string | null;
  integrity_score: number | null;
  integrity_flags: unknown;
  audit_votes: unknown;
}

/**
 * Repositories as a table rather than stacked cards. A recruiter is comparing
 * rows, and aligned columns of scores are what makes an outlier visible at a
 * glance. Flagged repositories sort first for the same reason.
 */
export function RepoAuditTable({ repos }: { repos: AuditRow[] }) {
  if (repos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-10 text-center">
        <ShieldQuestion className="w-6 h-6 text-white/20 mx-auto mb-2" aria-hidden="true" />
        <p className="text-[13px] text-white/45">
          This candidate has no audited repositories yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-x-auto">
      <table className="w-full min-w-[44rem] text-sm border-collapse">
        <thead>
          <tr className="bg-white/[0.03]">
            {[
              ["Repository", ""],
              ["Language", ""],
              ["Integrity", "text-right"],
              ["Verdict", ""],
              ["Panel", "text-right"],
            ].map(([h, align]) => (
              <th
                key={h}
                scope="col"
                className={`text-left font-medium text-[10px] uppercase tracking-[0.12em] text-white/35 px-4 py-2.5 border-b border-white/[0.07] ${align}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {repos.map((r, i) => {
            const flagged = r.integrity_status === "flagged";
            const verified = r.integrity_status === "verified";
            const flags = Array.isArray(r.integrity_flags) ? (r.integrity_flags as string[]) : [];
            const agreement = agreementFromVotes(r.audit_votes);

            return (
              <tr
                key={i}
                className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.035] transition-colors align-top"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white leading-tight">{r.name}</div>
                  {flags.length > 0 && (
                    <ul className="mt-1.5 flex flex-col gap-0.5">
                      {flags.slice(0, 3).map((f, k) => (
                        <li key={k} className="text-[11px] text-rose-200/65 leading-snug">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 text-white/50 text-[13px] whitespace-nowrap">
                  {r.primary_language ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-mono tabular-nums text-[13px] ${
                      flagged ? "text-rose-300" : verified ? "text-emerald-300" : "text-white/45"
                    }`}
                  >
                    {r.integrity_score ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap ${
                      flagged ? "text-rose-300" : verified ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    {flagged ? (
                      <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : verified ? (
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ShieldQuestion className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    {r.integrity_status ?? "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {agreement ? (
                    <span className="font-mono tabular-nums text-[12px] text-white/55">
                      {agreement}
                      <span className="text-white/30"> agreed</span>
                    </span>
                  ) : (
                    <span className="text-[12px] text-white/25">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
