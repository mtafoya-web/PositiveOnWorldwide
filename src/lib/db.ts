import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { mockPrisma } from "./mock-data";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const shouldUseMockData =
  env.USE_MOCK_DATA === "true" ||
  !env.DATABASE_URL ||
  process.env.NEXT_PHASE === "phase-production-build";

const pool = !shouldUseMockData ? new Pool({ connectionString: env.DATABASE_URL }) : null;
const adapter = pool ? new PrismaPg(pool) : null;

export const prisma =
  globalForPrisma.prisma ||
  (adapter
    ? new PrismaClient({
        adapter,
        log:
          env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })
    : (mockPrisma as unknown as PrismaClient));

if (env.NODE_ENV !== "production" && adapter) globalForPrisma.prisma = prisma;
