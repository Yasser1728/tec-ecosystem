/**
 * FundX Database Client
 * Isolated Prisma Client for fundx domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-fundx';

// Singleton pattern for database connection
let fundxDB;

if (process.env.NODE_ENV === 'production') {
  fundxDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.FUNDX_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.fundxDB) {
    global.fundxDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.FUNDX_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  fundxDB = global.fundxDB;
}

export { fundxDB };
export default fundxDB;
