/**
 * Life Database Client
 * Isolated Prisma Client for life domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-life';

// Singleton pattern for database connection
let lifeDB;

if (process.env.NODE_ENV === 'production') {
  lifeDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.LIFE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.lifeDB) {
    global.lifeDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.LIFE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  lifeDB = global.lifeDB;
}

export { lifeDB };
export default lifeDB;
