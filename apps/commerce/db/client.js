/**
 * Commerce Database Client
 * Isolated Prisma Client for commerce domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-commerce';

// Singleton pattern for database connection
let commerceDB;

if (process.env.NODE_ENV === 'production') {
  commerceDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.COMMERCE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.commerceDB) {
    global.commerceDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.COMMERCE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  commerceDB = global.commerceDB;
}

export { commerceDB };
export default commerceDB;
