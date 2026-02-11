/**
 * VIP Database Client
 * Isolated Prisma Client for vip domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-vip';

// Singleton pattern for database connection
let vipDB;

if (process.env.NODE_ENV === 'production') {
  vipDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.VIP_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.vipDB) {
    global.vipDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.VIP_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  vipDB = global.vipDB;
}

export { vipDB };
export default vipDB;
