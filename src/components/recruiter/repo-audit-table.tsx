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
      <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/60 px-5 py-10 text-center">
        <ShieldQuestion className="w-6 h-6 text-stone-400 mx-auto mb-2" aria-hidden="true" />
        <p className="text-[13px] text-stone-500">
          This candidate has no audited repositories yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 overflow-x-auto">
      <table className="w-full min-w-[44rem] text-sm border-collapse">
        <thead>
          <tr className="bg-stone-50">
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
                className={`text-left font-medium text-[10px] uppercase tracking-[0.12em] text-stone-500 px-4 py-2.5 border-b border-stone-200 ${align}`}
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
                className="border-b border-stone-200 last:border-b-0 hover:bg-stone-50 transition-colors align-top"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900 leading-tight">{r.name}</div>
                  {flags.length > 0 && (
                    <ul className="mt-1.5 flex flex-col gap-0.5">
                      {flags.slice(0, 3).map((f, k) => (
                        <li key={k} className="text-[11px] text-rose-700 leading-snug">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-500 text-[13px] whitespace-nowrap">
                  {r.primary_language ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-mono tabular-nums text-[13px] ${
                      flagged ? "text-rose-700" : verified ? "text-emerald-700" : "text-stone-500"
                    }`}
                  >
                    {r.integrity_score ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap ${
                      flagged ? "text-rose-700" : verified ? "text-emerald-700" : "text-amber-700"
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
                    <span className="font-mono tabular-nums text-[12px] text-stone-600">
                      {agreement}
                      <span className="text-stone-500"> agreed</span>
                    </span>
                  ) : (
                    <span className="text-[12px] text-stone-500">—</span>
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
