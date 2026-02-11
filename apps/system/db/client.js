/**
 * System Database Client
 * Isolated Prisma Client for system domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-system';

// Singleton pattern for database connection
let systemDB;

if (process.env.NODE_ENV === 'production') {
  systemDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.systemDB) {
    global.systemDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  systemDB = global.systemDB;
}

export { systemDB };
export default systemDB;
