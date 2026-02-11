/**
 * Epic Database Client
 * Isolated Prisma Client for epic domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-epic';

// Singleton pattern for database connection
let epicDB;

if (process.env.NODE_ENV === 'production') {
  epicDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.EPIC_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.epicDB) {
    global.epicDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.EPIC_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  epicDB = global.epicDB;
}

export { epicDB };
export default epicDB;
