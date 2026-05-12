import "server-only";

import { PrismaClient } from "@prisma/client";
import { hasDatabase } from "./config";

const globalForPrisma = globalThis as unknown as {
  voiceLeadPrisma?: PrismaClient;
};

export function getPrisma() {
  if (!hasDatabase()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForPrisma.voiceLeadPrisma) {
    globalForPrisma.voiceLeadPrisma = new PrismaClient();
  }

  return globalForPrisma.voiceLeadPrisma;
}
