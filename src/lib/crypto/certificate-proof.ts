import { createHash } from "node:crypto";

/**
 * SHA-256 digest of the exact bytes held in the certificates bucket.
 *
 * This value is what the Proof Inspector shows the recruiter, so it has to be
 * computed server-side from the stored file. Hashing client-supplied metadata
 * (or trusting a hash sent up by the browser) would verify nothing at all.
 */
export function sha256Hex(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * SHA-256 over a canonical string identifier.
 *
 * Used for hosted badges (Credly, Open Badges) where there is no uploaded file
 * to fingerprint. The digest commits to the badge's immutable public URL, which
 * is the thing a verifier actually resolves.
 */
export function sha256Text(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/**
 * Deterministic issuer identifier derived from the issuing body's name.
 *
 * The same issuer always resolves to the same DID, so multiple certificates
 * from one authority are attributable to a single identity.
 */
export function issuerDid(issuer?: string | null): string {
  const slug = (issuer || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `did:cdy:issuer:${slug || "unverified-issuer"}`;
}
