/**
 * TEC Database Client
 * Isolated Prisma Client for tec domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-tec';

// Singleton pattern for database connection
let tecDB;

if (process.env.NODE_ENV === 'production') {
  tecDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEC_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.tecDB) {
    global.tecDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEC_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  tecDB = global.tecDB;
}

export { tecDB };
export default tecDB;
