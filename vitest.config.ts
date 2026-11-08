import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    // Unit tests must not read the developer's .env — only explicit test values.
    env: { DATABASE_URL: "" },
    passWithNoTests: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // `server-only` is enforced by the React server condition at Next runtime;
      // under Vitest (plain node) we alias it to an empty module.
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
});
