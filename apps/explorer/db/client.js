/**
 * Explorer Database Client
 * Isolated Prisma Client for explorer domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-explorer';

// Singleton pattern for database connection
let explorerDB;

if (process.env.NODE_ENV === 'production') {
  explorerDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.EXPLORER_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.explorerDB) {
    global.explorerDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.EXPLORER_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  explorerDB = global.explorerDB;
}

export { explorerDB };
export default explorerDB;
