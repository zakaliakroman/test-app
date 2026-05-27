import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const SEED_CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Learning"];

async function main() {
  console.log("Seeding categories...");

  for (const name of SEED_CATEGORIES) {
    // upsert so the seed is idempotent (safe to re-run)
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Done — seeded: ${SEED_CATEGORIES.join(", ")}`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
