/**
 * Legend Database Client
 * Isolated Prisma Client for legend domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-legend';

// Singleton pattern for database connection
let legendDB;

if (process.env.NODE_ENV === 'production') {
  legendDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.LEGEND_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.legendDB) {
    global.legendDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.LEGEND_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  legendDB = global.legendDB;
}

export { legendDB };
export default legendDB;
