import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { encryptToken, decryptToken } from "./token-crypto";

const KEY = "0".repeat(64); // 32 bytes hex

describe("token encryption at rest", () => {
  beforeEach(() => { process.env.TOKEN_ENCRYPTION_KEY = KEY; });
  afterEach(() => { delete process.env.TOKEN_ENCRYPTION_KEY; });

  test("ciphertext does not contain the plaintext token", () => {
    const enc = encryptToken("gho_supersecrettoken");
    expect(enc).not.toContain("gho_supersecrettoken");
  });

  test("round-trips back to the original token", () => {
    expect(decryptToken(encryptToken("gho_supersecrettoken"))).toBe("gho_supersecrettoken");
  });

  test("encrypting the same token twice yields different ciphertext", () => {
    expect(encryptToken("gho_same")).not.toBe(encryptToken("gho_same"));
  });

  test("rejects a tampered ciphertext instead of returning garbage", () => {
    const enc = encryptToken("gho_supersecrettoken");
    const tampered = enc.slice(0, -2) + (enc.endsWith("aa") ? "bb" : "aa");
    expect(() => decryptToken(tampered)).toThrow();
  });

  test("passes through a legacy plaintext value so existing rows keep working", () => {
    expect(decryptToken("gho_legacyplaintext")).toBe("gho_legacyplaintext");
  });

  test("refuses to encrypt when no key is configured", () => {
    delete process.env.TOKEN_ENCRYPTION_KEY;
    expect(() => encryptToken("gho_x")).toThrow();
  });
});
