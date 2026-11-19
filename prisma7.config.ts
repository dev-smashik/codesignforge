import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const datasourceUrl = process.env.VERCEL
  ? process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres"
  : env("DIRECT_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
