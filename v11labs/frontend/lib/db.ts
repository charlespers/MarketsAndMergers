import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // During build time, return a mock client to avoid errors
    // The actual client will be created at runtime when DATABASE_URL is available
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return {} as PrismaClient
    }
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
