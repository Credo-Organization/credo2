import { describe, it, expect } from "vitest";
import { extractPassportId } from "./candidate-lookup";

/**
 * This function is the boundary between whatever a recruiter pastes and a
 * database query. It was extracted from the component specifically so it could
 * be tested at that boundary.
 */
describe("extractPassportId", () => {
  it("passes a plain identifier through unchanged", () => {
    expect(extractPassportId("CDY26S1104")).toBe("CDY26S1104");
  });

  it("pulls the id out of a scanned verify URL", () => {
    expect(extractPassportId("https://credify.app/verify/passport/CDY26S1104")).toBe("CDY26S1104");
  });

  it("pulls the id out of a shared candidate URL", () => {
    expect(extractPassportId("https://credify.app/recruiter/candidate/CDY26S1104")).toBe("CDY26S1104");
  });

  it("ignores a query string and fragment on a scanned URL", () => {
    expect(extractPassportId("https://credify.app/verify/passport/CDY26S1104?src=qr#top")).toBe(
      "CDY26S1104"
    );
  });

  it("uppercases, because ids are generated uppercase and compared exactly", () => {
    expect(extractPassportId("cdy26s1104")).toBe("CDY26S1104");
  });

  it("keeps hyphens, which card ids contain", () => {
    expect(extractPassportId("CDY2026-0001101")).toBe("CDY2026-0001101");
  });

  it("trims surrounding whitespace from a paste", () => {
    expect(extractPassportId("  CDY26S1104\n")).toBe("CDY26S1104");
  });

  it("strips characters that would otherwise reach the query", () => {
    expect(extractPassportId("CDY26S1104'; DROP TABLE passports;--")).toBe(
      "CDY26S1104DROPTABLEPASSPORTS--"
    );
  });

  it("caps length so an oversized paste cannot become an oversized query", () => {
    expect(extractPassportId("A".repeat(200))).toHaveLength(64);
  });

  it("returns empty for input with nothing usable in it", () => {
    expect(extractPassportId("   !!!   ")).toBe("");
  });

  it("strips card label prefixes like 'Student ID:' or 'ID:'", () => {
    expect(extractPassportId("Student ID: CDY26S4611")).toBe("CDY26S4611");
    expect(extractPassportId("ID: CDY2026-0004611")).toBe("CDY2026-0004611");
    expect(extractPassportId("Card ID - CDY2026-0004611")).toBe("CDY2026-0004611");
  });

  it("does not treat an unrelated URL as a match, falling back to sanitising", () => {
    // No /verify/passport/ or /candidate/ segment, so there is no id to lift.
    // The result is a harmless run-together string rather than a wrong lookup.
    expect(extractPassportId("https://example.com/about")).toBe("HTTPSEXAMPLECOMABOUT");
  });
});
