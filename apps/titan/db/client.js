/**
 * Titan Database Client
 * Isolated Prisma Client for titan domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-titan';

// Singleton pattern for database connection
let titanDB;

if (process.env.NODE_ENV === 'production') {
  titanDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TITAN_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.titanDB) {
    global.titanDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TITAN_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  titanDB = global.titanDB;
}

export { titanDB };
export default titanDB;
