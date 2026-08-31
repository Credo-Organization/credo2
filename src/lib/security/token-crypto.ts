import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Authenticated encryption for GitHub OAuth tokens held in github_connections.
 *
 * These were stored as plaintext, so anyone reaching the database (a leaked
 * service-role key, a backup, a misconfigured policy) got working credentials
 * for every connected GitHub account. AES-256-GCM gives confidentiality plus
 * tamper detection, so a modified ciphertext fails loudly rather than
 * decrypting to something unexpected.
 */
const PREFIX = "encv1";

function getKey(): Buffer {
  const hex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error("TOKEN_ENCRYPTION_KEY is not configured; refusing to handle tokens");
  }
  const key = Buffer.from(hex, "hex");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex characters)");
  }
  return key;
}

export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    PREFIX,
    iv.toString("base64"),
    tag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

export function decryptToken(stored: string): string {
  // Rows written before encryption existed hold a raw token. Passing those
  // through keeps existing connections working; they are re-encrypted on the
  // next sync, so the plaintext disappears as accounts are used.
  if (!stored || !stored.startsWith(PREFIX + ".")) return stored;

  const [, ivPart, tagPart, ctPart] = stored.split(".");
  const key = getKey();
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivPart, "base64"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(ctPart, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
