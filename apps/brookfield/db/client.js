/**
 * Brookfield Database Client
 * Isolated Prisma Client for brookfield domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-brookfield';

// Singleton pattern for database connection
let brookfieldDB;

if (process.env.NODE_ENV === 'production') {
  brookfieldDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.BROOKFIELD_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.brookfieldDB) {
    global.brookfieldDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.BROOKFIELD_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  brookfieldDB = global.brookfieldDB;
}

export { brookfieldDB };
export default brookfieldDB;
