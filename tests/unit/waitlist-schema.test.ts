import { describe, expect, it } from "vitest";

import { normalizeEmail, parseSignupInput } from "@/modules/waitlist/schema";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  User@Example.COM ")).toBe("user@example.com");
  });
});

describe("parseSignupInput", () => {
  it("accepts a valid consented signup and normalizes the email", () => {
    const result = parseSignupInput({
      email: "  Reader@Example.com ",
      consent: true,
    });
    expect(result).toEqual({
      ok: true,
      input: {
        email: "reader@example.com",
        consent: true,
        website: "",
        signupSource: undefined,
        referrer: undefined,
      },
    });
  });

  it("rejects missing consent", () => {
    const result = parseSignupInput({ email: "a@b.com" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("consent_required");
  });

  it("rejects consent: false", () => {
    const result = parseSignupInput({ email: "a@b.com", consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("consent_required");
  });

  it("rejects invalid emails", () => {
    for (const email of ["not-an-email", "a@", "@b.com", "a b@c.com"]) {
      const result = parseSignupInput({ email, consent: true });
      expect(result.ok).toBe(false);
      if (!result.ok && result.code === "invalid_email") {
        continue;
      }
      // Some shapes fail the initial zod bounds instead — also fine.
      expect(result).toEqual(expect.objectContaining({ ok: false }));
    }
  });

  it("rejects oversized payloads at the schema boundary", () => {
    const result = parseSignupInput({
      email: `${"a".repeat(320)}@example.com`,
      consent: true,
    });
    expect(result.ok).toBe(false);
  });
});
