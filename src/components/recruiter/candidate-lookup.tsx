"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, QrCode } from "lucide-react";
import { PassportScannerModal } from "./passport-scanner-modal";

export function extractPassportId(raw: string): string {
  let trimmed = raw.trim();

  // Strip common label prefixes like "Student ID: CDY26S4611", "ID: CDY2026-0004611", etc.
  trimmed = trimmed.replace(/^(?:student\s*id|card\s*id|passport\s*id|id)\s*[:\-#]?\s*/i, "");

  const fromUrl =
    trimmed.match(/\/verify\/passport\/([A-Za-z0-9-_]+)/i) ??
    trimmed.match(/\/candidate\/([A-Za-z0-9-_]+)/i) ??
    trimmed.match(/\/p\/([A-Za-z0-9-_]+)/i);
  const candidate = fromUrl ? fromUrl[1] : trimmed;

  return candidate.replace(/[^A-Za-z0-9-_]/g, "").slice(0, 64).toUpperCase();
}

export function CandidateLookup() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const router = useRouter();

  const handleLookupId = (targetId: string) => {
    const id = extractPassportId(targetId);
    if (!id) {
      setError("Enter a passport ID, or paste the link from a scanned QR code.");
      return;
    }
    setError(null);
    router.push(`/recruiter/candidate/${id}`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookupId(value);
  };

  return (
    <>
      <form onSubmit={submit} className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <Search
              className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste Student ID, Card ID, or shareable link..."
              aria-label="Passport ID or verification link"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "lookup-error" : undefined}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-mono transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex shrink-0">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="h-11 px-3 sm:px-4 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 text-zinc-900 dark:text-zinc-100 text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Scan QR</span>
            </button>

            <button
              type="submit"
              className="h-11 px-4 sm:px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center"
            >
              Inspect Dossier
            </button>
          </div>
        </div>

        {/* Quick Sample Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="font-medium">Quick inspect:</span>
          <button
            type="button"
            onClick={() => handleLookupId("MSK-2026-IND-0491")}
            className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 font-mono font-bold text-zinc-900 dark:text-zinc-200 hover:text-blue-600 transition-colors cursor-pointer"
          >
            MSK-0491 (Full-Stack & AI)
          </button>
          <button
            type="button"
            onClick={() => handleLookupId("MSK26S1104")}
            className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 font-mono font-bold text-zinc-900 dark:text-zinc-200 hover:text-blue-600 transition-colors cursor-pointer"
          >
            MSK26S1104 (Distributed Systems)
          </button>
          <button
            type="button"
            onClick={() => handleLookupId("MSK26S7421")}
            className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 font-mono font-bold text-zinc-900 dark:text-zinc-200 hover:text-blue-600 transition-colors cursor-pointer"
          >
            MSK26S7421 (AI & ML Engineer)
          </button>
        </div>

        {error && (
          <p
            id="lookup-error"
            role="alert"
            className="flex items-start gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-bold leading-snug"
          >
            <AlertCircle className="w-4 h-4 mt-px shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            {error}
          </p>
        )}
      </form>

      <PassportScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </>
  );
}
