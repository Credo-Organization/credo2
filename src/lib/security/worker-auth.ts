import { timingSafeEqual } from "node:crypto";

/**
 * Guards the background worker routes.
 *
 * Both worker routes use the Supabase service-role client, which bypasses RLS
 * entirely, and process-passport took `user_id` straight from the request body.
 * Without this check any unauthenticated caller could drive them against an
 * arbitrary account. Fails closed when WORKER_SECRET is unset, so a missing
 * environment variable cannot silently reopen the routes.
 */
export function isAuthorizedWorkerRequest(request: Request): boolean {
  const secret = process.env.WORKER_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return false;

  const provided = Buffer.from(header.slice("Bearer ".length), "utf8");
  const expected = Buffer.from(secret, "utf8");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
