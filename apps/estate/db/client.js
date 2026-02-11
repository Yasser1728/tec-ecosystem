/**
 * Estate Database Client
 * Isolated Prisma Client for estate domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-estate';

// Singleton pattern for database connection
let estateDB;

if (process.env.NODE_ENV === 'production') {
  estateDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ESTATE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.estateDB) {
    global.estateDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ESTATE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  estateDB = global.estateDB;
}

export { estateDB };
export default estateDB;
