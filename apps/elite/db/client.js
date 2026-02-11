/**
 * Elite Database Client
 * Isolated Prisma Client for elite domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-elite';

// Singleton pattern for database connection
let eliteDB;

if (process.env.NODE_ENV === 'production') {
  eliteDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ELITE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.eliteDB) {
    global.eliteDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ELITE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  eliteDB = global.eliteDB;
}

export { eliteDB };
export default eliteDB;
