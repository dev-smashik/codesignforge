/**
 * Server-only environment configuration.
 *
 * Import this module exclusively from server code (route handlers, servers,
 * server components, scripts). It is guarded with `server-only` so it can
 * never accidentally reach a client bundle (AGENTS.md §13).
 *
 * Validation is lazy per env layer: only the variables a code path actually
 * needs must be present, so unrelated phases/features do not block startup.
 */
import "server-only";

import { z } from "zod";

const trimmedString = z.string().trim().min(1);
const url = z.string().trim().url();
const httpsOrHttpUrl = url.refine(
  (value) => value.startsWith("http://") || value.startsWith("https://"),
  "Must be an http(s) URL",
);

/** Variables the database layer depends on (Phase 1 foundation). */
const databaseEnvSchema = z.object({
  DATABASE_URL: trimmedString,
  DIRECT_URL: trimmedString.optional(),
  // Empty/missing values (common when a dashboard variable is cleared)
  // fall back to the default instead of failing URL validation.
  NEXT_PUBLIC_APP_URL: z.preprocess(
    (v) => (v == null || v === "" ? "http://localhost:3000" : v),
    httpsOrHttpUrl,
  ),
});

/** Variables the rate limiter depends on (Phase 4+). */
const rateLimitEnvSchema = z.object({
  UPSTASH_REDIS_REST_URL: url,
  UPSTASH_REDIS_REST_TOKEN: trimmedString,
});

/** Variables the email pipeline depends on (Phase 3+). */
const emailEnvSchema = z.object({
  RESEND_API_KEY: trimmedString,
  EMAIL_FROM: trimmedString,
  RESEND_WEBHOOK_SECRET: trimmedString.optional(),
});

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
export type RateLimitEnv = z.infer<typeof rateLimitEnvSchema>;
export type EmailEnv = z.infer<typeof emailEnvSchema>;

type EnvLayerSchema = z.ZodType;

export class MissingEnvError extends Error {
  readonly layer: string;
  readonly missing: string[];

  constructor(layer: string, zodError: z.ZodError) {
    const missing = zodError.issues.map((issue) => issue.path.join("."));
    super(
      `Missing or invalid ${layer} environment variables: ${missing.join(", ")}. ` +
        "See .env.example for the expected variables.",
    );
    this.name = "MissingEnvError";
    this.layer = layer;
    this.missing = missing;
  }
}

function parseEnvLayer<T extends EnvLayerSchema>(
  layer: string,
  schema: T,
): z.output<T> {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    throw new MissingEnvError(layer, result.error);
  }
  return result.data;
}

/** Validated database environment. Call once at the data-access boundary. */
export function requireDatabaseEnv(): DatabaseEnv {
  return parseEnvLayer("database", databaseEnvSchema);
}

/** Validated rate limiter environment. */
export function requireRateLimitEnv(): RateLimitEnv {
  return parseEnvLayer("rate limit", rateLimitEnvSchema);
}

/** Validated email environment. */
export function requireEmailEnv(): EmailEnv {
  return parseEnvLayer("email", emailEnvSchema);
}
