/**
 * Ecommerce Database Client
 * Isolated Prisma Client for ecommerce domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-ecommerce';

// Singleton pattern for database connection
let ecommerceDB;

if (process.env.NODE_ENV === 'production') {
  ecommerceDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ECOMMERCE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.ecommerceDB) {
    global.ecommerceDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ECOMMERCE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  ecommerceDB = global.ecommerceDB;
}

export { ecommerceDB };
export default ecommerceDB;
