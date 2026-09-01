/**
 * Renders stored per-model votes as "agreeing/responded" for display.
 *
 * Reads from JSONB written by the ensemble, so every field is treated as
 * untrusted: a row written by an older build, or a partially failed audit, must
 * not throw in a server component. Returns undefined when there is nothing
 * honest to show rather than inventing a figure.
 */
export function agreementFromVotes(votes: unknown): string | undefined {
  if (!Array.isArray(votes) || votes.length === 0) return undefined;

  const responded = votes.filter(
    (v): v is { verdict: { integrity_status: string } } =>
      typeof v === "object" &&
      v !== null &&
      (v as { ok?: unknown }).ok === true &&
      typeof (v as { verdict?: unknown }).verdict === "object" &&
      (v as { verdict?: unknown }).verdict !== null &&
      typeof ((v as { verdict: { integrity_status?: unknown } }).verdict).integrity_status === "string"
  );

  if (responded.length === 0) return undefined;

  const blocs = new Map<string, number>();
  for (const v of responded) {
    const s = v.verdict.integrity_status;
    blocs.set(s, (blocs.get(s) ?? 0) + 1);
  }

  return `${Math.max(...blocs.values())}/${responded.length}`;
}
