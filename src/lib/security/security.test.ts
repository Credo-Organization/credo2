import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  escapeForInlineScript,
  verifyOAuthState,
  buildOAuthSuccessHtml,
  buildOAuthErrorHtml,
} from "./oauth-callback";
import { isAuthorizedWorkerRequest } from "./worker-auth";

describe("escapeForInlineScript", () => {
  test("neutralises a single-quote breakout payload", () => {
    const payload = "'+alert(document.cookie)+'";
    expect(escapeForInlineScript(payload)).not.toContain("'");
  });

  test("escapes a closing script tag", () => {
    expect(escapeForInlineScript("</script><img onerror=alert(1)>"))
      .not.toContain("</script>");
  });

  test("leaves an ordinary error code untouched", () => {
    expect(escapeForInlineScript("access_denied")).toBe("access_denied");
  });
});

describe("verifyOAuthState", () => {
  test("rejects when the returned state does not match the issued one", () => {
    expect(verifyOAuthState("a".repeat(32), "b".repeat(32))).toBe(false);
  });

  test("rejects when no state was issued", () => {
    expect(verifyOAuthState(undefined, "b".repeat(32))).toBe(false);
  });

  test("rejects when the callback returns no state", () => {
    expect(verifyOAuthState("a".repeat(32), null)).toBe(false);
  });

  test("accepts a matching state", () => {
    const s = "f3a9c1d0e5b74826f3a9c1d0e5b74826";
    expect(verifyOAuthState(s, s)).toBe(true);
  });
});

describe("buildOAuthSuccessHtml", () => {
  const args = { token: "gho_secrettoken123", login: "subham", appUrl: "https://credify.app" };

  test("targets the app origin instead of a wildcard", () => {
    const html = buildOAuthSuccessHtml(args);
    expect(html).toContain("https://credify.app");
    expect(html).not.toContain("}, '*')");
  });

  test("never places the access token in a URL", () => {
    const html = buildOAuthSuccessHtml(args);
    expect(html).not.toContain("github_token=");
  });
});

describe("buildOAuthErrorHtml", () => {
  test("does not emit an attacker payload unescaped", () => {
    const html = buildOAuthErrorHtml({ code: "'+alert(1)+'", appUrl: "https://credify.app" });
    expect(html).not.toContain("'+alert(1)+'");
  });
});

describe("isAuthorizedWorkerRequest", () => {
  const SECRET = "test-worker-secret";
  beforeEach(() => { process.env.WORKER_SECRET = SECRET; });
  afterEach(() => { delete process.env.WORKER_SECRET; });

  const req = (headers: Record<string, string> = {}) =>
    new Request("https://credify.app/api/process-passport", { method: "POST", headers });

  test("rejects a request with no authorization header", () => {
    expect(isAuthorizedWorkerRequest(req())).toBe(false);
  });

  test("rejects a request with the wrong secret", () => {
    expect(isAuthorizedWorkerRequest(req({ authorization: "Bearer wrong" }))).toBe(false);
  });

  test("accepts a request carrying the configured secret", () => {
    expect(isAuthorizedWorkerRequest(req({ authorization: `Bearer ${SECRET}` }))).toBe(true);
  });

  test("rejects everything when no secret is configured on the server", () => {
    delete process.env.WORKER_SECRET;
    expect(isAuthorizedWorkerRequest(req({ authorization: "Bearer anything" }))).toBe(false);
  });
});
