"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ShieldQuestion, ArrowUpRight, ArrowRight, Users } from "lucide-react";
import { CandidateLookup } from "./candidate-lookup";

export interface ShortlistRow {
  passportId: string;
  name: string;
  college: string;
  headline: string;
  repos: number;
  verified: number;
  flagged: number;
  skills: number;
  savedAt: string;
}

type Filter = "all" | "clean" | "flagged";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All Candidates" },
  { key: "clean", label: "Clean / 0 Flags" },
  { key: "flagged", label: "Flags Detected" },
];

export function ShortlistTable({ rows }: { rows: ShortlistRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(
    () =>
      rows.filter((r) =>
        filter === "flagged" ? r.flagged > 0 : filter === "clean" ? r.flagged === 0 : true
      ),
    [rows, filter]
  );

  const totals = useMemo(
    () => ({
      candidates: rows.length,
      audited: rows.reduce((n, r) => n + r.repos, 0),
      flagged: rows.filter((r) => r.flagged > 0).length,
      skills: rows.length ? Math.round(rows.reduce((n, r) => n + r.skills, 0) / rows.length) : 0,
    }),
    [rows]
  );

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-5 select-none">
        <CandidateLookup />
        <div className="rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-12 shadow-xs transition-colors">
          <div className="max-w-md mx-auto flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border-2 border-zinc-900 dark:border-zinc-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs mb-1">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-base font-black text-zinc-950 dark:text-zinc-100">Your shortlist is empty</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Candidates appear here once you look one up and save them to your active recruitment roster.
              </p>
            </div>

            <ol className="flex flex-col gap-2.5">
              {[
                "A student opens their Minskey passport and shares their token or QR code with you.",
                "Scan the QR code, or copy the ID printed on the passport card.",
                "Paste either one above. Their verified codebase and cryptographic evidence loads instantly.",
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 tabular-nums mt-0.5 shrink-0 w-4">
                    {i + 1}.
                  </span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">{step}</span>
                </li>
              ))}
            </ol>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 pt-3.5">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Example Passport ID:{" "}
                <span className="font-mono text-zinc-950 dark:text-zinc-100 font-bold bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-900 dark:border-zinc-700">
                  CDY26S4611
                </span>
              </p>
              <Link
                href="/recruiter/candidate/CDY26S4611"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer shadow-xs"
              >
                <span>Inspect Demo Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 select-none">
      <CandidateLookup />

      {/* Dense metric strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden shadow-xs">
        {[
          { k: "Candidates", v: totals.candidates },
          { k: "Repos Audited", v: totals.audited },
          { k: "With Flags", v: totals.flagged, warn: totals.flagged > 0 },
          { k: "Avg Skills", v: totals.skills },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-5 py-3.5 bg-white dark:bg-zinc-900 ${i < 3 ? "md:border-r-2 border-zinc-900 dark:border-zinc-700" : ""} ${
              i < 2 ? "border-b-2 md:border-b-0 border-zinc-900 dark:border-zinc-700" : ""
            } ${i === 0 ? "border-r-2 md:border-r-2" : ""}`}
          >
            <div
              className={`font-mono text-2xl font-black tabular-nums leading-none ${
                s.warn ? "text-rose-600 dark:text-rose-400" : "text-zinc-950 dark:text-zinc-100"
              }`}
            >
              {s.v}
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-zinc-500 dark:text-zinc-400 mt-1.5">{s.k}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2" role="group" aria-label="Filter candidates">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const n =
            f.key === "all" ? rows.length : f.key === "flagged" ? totals.flagged : rows.length - totals.flagged;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold border-2 border-zinc-900 dark:border-zinc-700 transition-all cursor-pointer ${
                active
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 font-mono tabular-nums font-black ${active ? "text-white dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-400"}`}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-x-auto shadow-xs bg-white dark:bg-zinc-900 transition-colors">
        <table className="w-full min-w-[46rem] text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/80 border-b-2 border-zinc-900 dark:border-zinc-700">
              {["Candidate", "Institution", "Repos", "Verdict", "Skills", "Saved", ""].map((h, i) => (
                <th
                  key={h || i}
                  scope="col"
                  className={`text-left font-black text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-300 px-4 py-3 ${
                    ["Repos", "Skills"].includes(h) ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.passportId} className="group border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/recruiter/candidate/${r.passportId}`}
                    className="flex flex-col gap-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span className="text-zinc-950 dark:text-zinc-100 font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{r.name}</span>
                    <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-bold">{r.passportId}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 text-xs font-medium">{r.college}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-950 dark:text-zinc-100 font-bold">{r.repos}</td>
                <td className="px-4 py-3">
                  <VerdictPill verified={r.verified} flagged={r.flagged} total={r.repos} />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-950 dark:text-zinc-100 font-bold">{r.skills}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-xs font-medium whitespace-nowrap">{r.savedAt}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/recruiter/candidate/${r.passportId}`}
                    aria-label={`Open ${r.name}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-xs transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {shown.length === 0 && (
          <div className="px-4 py-10 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            No candidates match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

function VerdictPill({ verified, flagged, total }: { verified: number; flagged: number; total: number }) {
  if (total === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
        <ShieldQuestion className="w-3.5 h-3.5" aria-hidden="true" /> Not Audited
      </span>
    );
  }
  if (flagged > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-rose-950 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 px-2 py-0.5 rounded-lg border border-rose-300 dark:border-rose-800 shadow-xs">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
        <span className="font-mono tabular-nums">{flagged}</span> Flagged
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-950 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-xs">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
      <span className="font-mono tabular-nums">{verified}</span> Verified
    </span>
  );
}
