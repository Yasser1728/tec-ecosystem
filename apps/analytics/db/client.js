/**
 * Analytics Database Client
 * Isolated Prisma Client for analytics domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-analytics';

// Singleton pattern for database connection
let analyticsDB;

if (process.env.NODE_ENV === 'production') {
  analyticsDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ANALYTICS_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.analyticsDB) {
    global.analyticsDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ANALYTICS_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  analyticsDB = global.analyticsDB;
}

export { analyticsDB };
export default analyticsDB;
