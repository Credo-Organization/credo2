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
      <div className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-10 text-center transition-colors">
        <ShieldQuestion className="w-6 h-6 text-zinc-400 dark:text-zinc-500 mx-auto mb-2" aria-hidden="true" />
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">
          This candidate has no audited repositories yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-x-auto shadow-xs bg-white dark:bg-zinc-900 transition-colors">
      <table className="w-full min-w-[44rem] text-sm border-collapse">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/80 border-b-2 border-zinc-900 dark:border-zinc-700">
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
                className={`text-left font-black text-[10px] uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400 px-4 py-3 border-b-2 border-zinc-900 dark:border-zinc-700 ${align}`}
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
                className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors align-top"
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-zinc-950 dark:text-zinc-100 leading-tight">{r.name}</div>
                  {flags.length > 0 && (
                    <ul className="mt-1.5 flex flex-col gap-0.5">
                      {flags.slice(0, 3).map((f, k) => (
                        <li key={k} className="text-[11px] text-rose-600 dark:text-rose-400 font-medium leading-snug">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-[13px] font-medium whitespace-nowrap">
                  {r.primary_language ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-mono tabular-nums text-[13px] font-black ${
                      flagged ? "text-rose-600 dark:text-rose-400" : verified ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {r.integrity_score ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap px-2 py-0.5 rounded-lg border ${
                      flagged 
                        ? "text-rose-950 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800" 
                        : verified 
                        ? "text-emerald-950 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800" 
                        : "text-amber-950 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800"
                    }`}
                  >
                    {flagged ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                    ) : verified ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <ShieldQuestion className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    )}
                    {r.integrity_status ?? "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {agreement ? (
                    <span className="font-mono tabular-nums text-[12px] text-zinc-700 dark:text-zinc-300 font-bold">
                      {agreement}
                      <span className="text-zinc-500 dark:text-zinc-400 font-normal"> agreed</span>
                    </span>
                  ) : (
                    <span className="text-[12px] text-zinc-500 dark:text-zinc-400">—</span>
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
