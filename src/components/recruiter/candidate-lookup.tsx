"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, QrCode } from "lucide-react";
import { PassportScannerModal } from "./passport-scanner-modal";

export function extractPassportId(raw: string): string {
  const trimmed = raw.trim();
  const fromUrl =
    trimmed.match(/\/verify\/passport\/([A-Za-z0-9-_]+)/) ??
    trimmed.match(/\/candidate\/([A-Za-z0-9-_]+)/) ??
    trimmed.match(/\/p\/([A-Za-z0-9-_]+)/);
  const candidate = fromUrl ? fromUrl[1] : trimmed;

  return candidate.replace(/[^A-Za-z0-9-_]/g, "").slice(0, 64).toUpperCase();
}

export function CandidateLookup() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractPassportId(value);

    if (!id) {
      setError("Enter a passport ID, or paste the link from a scanned QR code.");
      return;
    }
    if (id.length < 4) {
      setError(`"${id}" is too short to be a passport ID. They look like MSK26S1104.`);
      return;
    }

    setError(null);
    router.push(`/recruiter/candidate/${id}`);
  };

  return (
    <>
      <form onSubmit={submit} className="flex flex-col gap-2">
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <div className="relative flex-1 min-w-[240px]">
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
              placeholder="Search candidate by Passport ID or paste scanned link..."
              aria-label="Passport ID or verification link"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "lookup-error" : undefined}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 font-mono transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="h-11 px-4 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 text-zinc-900 dark:text-zinc-100 text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Scan QR / ID</span>
          </button>

          <button
            type="submit"
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[1px] transition-all cursor-pointer shrink-0"
          >
            Inspect Dossier
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
