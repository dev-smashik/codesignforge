import { afterEach, describe, expect, it } from "vitest";

import {
  requireDatabaseEnv,
  requireEmailEnv,
  MissingEnvError,
} from "@/lib/env";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("requireDatabaseEnv", () => {
  it("throws MissingEnvError when DATABASE_URL is absent", () => {
    process.env.DATABASE_URL = "";
    expect(() => requireDatabaseEnv()).toThrow(MissingEnvError);
  });

  it("throws for an invalid NEXT_PUBLIC_APP_URL", () => {
    process.env.DATABASE_URL = "postgresql://u:p@localhost:5432/db";
    process.env.NEXT_PUBLIC_APP_URL = "not a url";
    try {
      requireDatabaseEnv();
    } catch (error) {
      expect(error).toBeInstanceOf(MissingEnvError);
      expect((error as MissingEnvError).missing.join(" ")).toContain(
        "NEXT_PUBLIC_APP_URL",
      );
    }
  });

  it("parses valid values and applies defaults", () => {
    process.env.DATABASE_URL = "postgresql://u:p@localhost:5432/db";
    const env = requireDatabaseEnv();
    expect(env.DATABASE_URL).toBe("postgresql://u:p@localhost:5432/db");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });
});

describe("requireEmailEnv", () => {
  it("throws when RESEND_API_KEY is missing", () => {
    process.env.RESEND_API_KEY = "";
    expect(() => requireEmailEnv()).toThrow(MissingEnvError);
  });

  it("accepts a fully configured email environment", () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "CoDesign Forge <hello@example.com>";
    const env = requireEmailEnv();
    expect(env.RESEND_API_KEY).toBe("re_test_key");
  });
});
