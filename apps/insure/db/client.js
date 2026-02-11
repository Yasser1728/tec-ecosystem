/**
 * Insure Database Client
 * Isolated Prisma Client for insure domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-insure';

// Singleton pattern for database connection
let insureDB;

if (process.env.NODE_ENV === 'production') {
  insureDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.INSURE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.insureDB) {
    global.insureDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.INSURE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  insureDB = global.insureDB;
}

export { insureDB };
export default insureDB;
