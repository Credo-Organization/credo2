"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ShieldQuestion, ArrowUpRight, Users } from "lucide-react";
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
  { key: "all", label: "All" },
  { key: "clean", label: "No flags" },
  { key: "flagged", label: "Has flags" },
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
    // An empty first screen is a poor introduction, but the answer is to teach
    // the flow rather than to invent candidates. Everything here is instruction,
    // not fabricated data.
    return (
      <div className="flex flex-col gap-5">
        <CandidateLookup />
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/60 px-6 py-10">
          <div className="max-w-md mx-auto flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Users className="w-6 h-6 text-stone-300 mb-0.5" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-stone-900">Your shortlist is empty</h2>
              <p className="text-[13px] text-stone-500 leading-relaxed">
                Candidates appear here once you look one up and save them.
              </p>
            </div>

            <ol className="flex flex-col gap-2.5">
              {[
                "A student opens their Credify passport and shares it with you.",
                "Scan the QR code, or copy the ID printed on the card.",
                "Paste either one above. Their audited evidence loads instantly.",
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="font-mono text-[11px] text-stone-400 tabular-nums mt-0.5 shrink-0 w-4">
                    {i + 1}
                  </span>
                  <span className="text-[13px] text-stone-600 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <p className="text-[12px] text-stone-500 leading-relaxed border-t border-stone-200 pt-3.5">
              Passport IDs look like{" "}
              <span className="font-mono text-stone-900/60">CDY26S1104</span>. You can also paste a
              full verification link. Only passports a student has chosen to publish will
              resolve.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <CandidateLookup />

      {/* Dense metric strip. Every figure is counted from stored audit results. */}
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl border border-stone-200 overflow-hidden">
        {[
          { k: "Candidates", v: totals.candidates },
          { k: "Repos audited", v: totals.audited },
          { k: "With flags", v: totals.flagged, warn: totals.flagged > 0 },
          { k: "Avg skills", v: totals.skills },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-4 py-3 bg-white ${i < 3 ? "md:border-r border-stone-200" : ""} ${
              i < 2 ? "border-b md:border-b-0 border-stone-200" : ""
            } ${i === 0 ? "border-r md:border-r" : ""}`}
          >
            <div
              className={`font-mono text-xl font-semibold tabular-nums leading-none ${
                s.warn ? "text-rose-600" : "text-stone-900"
              }`}
            >
              {s.v}
            </div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-stone-500 mt-1.5">{s.k}</div>
          </div>
        ))}
      </div>

      {/* Filters. Omitting them is an anti-pattern for a list you evaluate against. */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Filter candidates">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const n =
            f.key === "all" ? rows.length : f.key === "flagged" ? totals.flagged : rows.length - totals.flagged;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                active
                  ? "bg-stone-900 border-stone-300 text-stone-900"
                  : "bg-transparent border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              {f.label}
              <span className="ml-1.5 font-mono tabular-nums text-stone-400">{n}</span>
            </button>
          );
        })}
      </div>

      {/* Table scrolls inside its own container so the page never scrolls sideways. */}
      <div className="rounded-xl border border-stone-200 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm border-collapse">
          <thead>
            <tr className="bg-stone-50">
              {["Candidate", "Institution", "Repos", "Verdict", "Skills", "Saved", ""].map((h, i) => (
                <th
                  key={h || i}
                  scope="col"
                  className={`text-left font-medium text-[10px] uppercase tracking-[0.12em] text-stone-500 px-4 py-2.5 border-b border-stone-200 ${
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
              <tr key={r.passportId} className="group border-b border-stone-200 last:border-b-0 hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/recruiter/candidate/${r.passportId}`}
                    className="flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
                  >
                    <span className="text-stone-900 font-medium leading-tight">{r.name}</span>
                    <span className="font-mono text-[11px] text-stone-500">{r.passportId}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-600 text-[13px]">{r.college}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-700">{r.repos}</td>
                <td className="px-4 py-3">
                  <VerdictPill verified={r.verified} flagged={r.flagged} total={r.repos} />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-700">{r.skills}</td>
                <td className="px-4 py-3 text-stone-400 text-[12px] whitespace-nowrap">{r.savedAt}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/recruiter/candidate/${r.passportId}`}
                    aria-label={`Open ${r.name}`}
                    className="inline-flex items-center justify-center w-11 h-11 -m-1.5 rounded-lg text-stone-300 group-hover:text-stone-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                  >
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {shown.length === 0 && (
          <div className="px-4 py-10 text-center text-[13px] text-stone-400">
            No candidate matches this filter.
          </div>
        )}
      </div>
    </div>
  );
}

/** Verdict is shown as shape plus text, never colour alone. */
function VerdictPill({ verified, flagged, total }: { verified: number; flagged: number; total: number }) {
  if (total === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
        <ShieldQuestion className="w-3.5 h-3.5" aria-hidden="true" /> not audited
      </span>
    );
  }
  if (flagged > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-600">
        <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="font-mono tabular-nums">{flagged}</span> flagged
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
      <span className="font-mono tabular-nums">{verified}</span> verified
    </span>
  );
}
