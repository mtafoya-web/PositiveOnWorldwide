import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPrisma() {
  const datasourceUrl = process.env.DATABASE_URL?.trim();

  if (!datasourceUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const prisma = globalThis.prismaGlobal ?? new PrismaClient({
    adapter: new PrismaPg({ connectionString: datasourceUrl })
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
  }

  return prisma;
}
