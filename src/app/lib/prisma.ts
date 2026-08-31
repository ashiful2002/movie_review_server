import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

const connectionString = process.env.DATABASE_URL || "";

let prisma: PrismaClient;

try {
  if (connectionString && connectionString !== "undefined") {
    const adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  } else {
    prisma = new PrismaClient();
  }
} catch (e) {
  console.error("Prisma initialization error:", e);
  prisma = new PrismaClient();
}

export { prisma };
