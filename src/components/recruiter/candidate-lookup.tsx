"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";

/**
 * Accepts either a bare passport identifier or a full verification URL.
 *
 * Scanning the QR code on a passport yields a URL, not an identifier, and the
 * empty state tells recruiters to do exactly that - so pasting one has to work.
 * Stripping non-alphanumerics from a URL silently produces a run-together
 * string that resolves to nothing, which reads as "the candidate does not
 * exist" rather than "that is not what this field wanted".
 */
export function extractPassportId(raw: string): string {
  const trimmed = raw.trim();
  const fromUrl =
    trimmed.match(/\/verify\/passport\/([A-Za-z0-9-]+)/) ??
    trimmed.match(/\/candidate\/([A-Za-z0-9-]+)/);
  const candidate = fromUrl ? fromUrl[1] : trimmed;

  // Identifiers are generated uppercase (CDY26S1104) and matched with an exact
  // comparison, so a lowercase paste would report "no passport found" when the
  // passport exists. Normalise rather than blame the reader.
  return candidate.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64).toUpperCase();
}

export function CandidateLookup() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractPassportId(value);

    // Validate on submit rather than on every keystroke, so the field does not
    // scold someone who is still typing.
    if (!id) {
      setError("Enter a passport ID, or paste the link from a scanned QR code.");
      return;
    }
    if (id.length < 4) {
      setError(`"${id}" is too short to be a passport ID. They look like CDY26S1104.`);
      return;
    }

    setError(null);
    router.push(`/recruiter/candidate/${id}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Passport ID or scanned link"
            aria-label="Passport ID or verification link"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "lookup-error" : undefined}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-500 font-mono transition-colors focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-stone-900 text-white text-[13px] font-medium hover:bg-stone-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
        >
          Look up
        </button>
      </div>

      {error && (
        <p
          id="lookup-error"
          role="alert"
          className="flex items-start gap-1.5 text-[12px] text-amber-700/90 leading-snug"
        >
          <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </form>
  );
}
