import { timingSafeEqual } from "node:crypto";

/**
 * Escapes a value for interpolation into an inline script block.
 *
 * The OAuth callback builds its response as an HTML string containing a script,
 * and the `error` query parameter was being interpolated raw. Anything outside a
 * conservative allowlist becomes a unicode escape, which neutralises quote
 * breakouts and closing script tags without needing to reason about context.
 */
export function escapeForInlineScript(value: string): string {
  return String(value ?? "").replace(
    /[^a-zA-Z0-9_\-. ]/g,
    (ch) => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0")
  );
}

/**
 * Constant-time comparison of the OAuth state we issued against the one GitHub
 * returned. The previous flow generated a state and never checked it, which left
 * the account-linking step open to CSRF.
 */
export function verifyOAuthState(
  expected: string | undefined | null,
  received: string | null | undefined
): boolean {
  if (!expected || !received) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Success page for the popup. The token is delivered by postMessage to this
 * app's exact origin, never to a wildcard, and never through a URL. A query
 * string would persist it in browser history, referrer headers and server logs.
 */
export function buildOAuthSuccessHtml({
  token,
  login,
  appUrl,
}: {
  token: string;
  login: string;
  appUrl: string;
}): string {
  const origin = new URL(appUrl).origin;
  return `<!DOCTYPE html><html><body><script>
(function () {
  var payload = {
    type: 'GITHUB_AUTH_SUCCESS',
    token: '${escapeForInlineScript(token)}',
    login: '${escapeForInlineScript(login)}'
  };
  if (window.opener) {
    window.opener.postMessage(payload, '${origin}');
    window.close();
  } else {
    window.location.href = '${origin}/github?github_connected=1';
  }
})();
</script></body></html>`;
}

/** Error page for the popup. The code is attacker-influenced, so it is escaped. */
export function buildOAuthErrorHtml({
  code,
  appUrl,
}: {
  code: string;
  appUrl: string;
}): string {
  const origin = new URL(appUrl).origin;
  const safe = escapeForInlineScript(code);
  return `<!DOCTYPE html><html><body><script>
(function () {
  if (window.opener) {
    window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: '${safe}' }, '${origin}');
    window.close();
  } else {
    window.location.href = '${origin}/github?auth_error=1';
  }
})();
</script></body></html>`;
}
