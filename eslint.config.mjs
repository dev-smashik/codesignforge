import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/coming-soon/coming-soon-page.tsx"],
    languageOptions: { parser: tsParser },
    rules: { "@next/next/no-img-element": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
