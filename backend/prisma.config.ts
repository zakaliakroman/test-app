/**
 * Prisma v7 configuration file.
 *
 * Key change from v6: the datasource URL is no longer inside schema.prisma.
 * It lives here instead, read via the type-safe `env()` helper so Prisma
 * can validate that the variable is present before running any commands.
 */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
