/**
 * Alert Database Client
 * Isolated Prisma Client for alert domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-alert';

// Singleton pattern for database connection
let alertDB;

if (process.env.NODE_ENV === 'production') {
  alertDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ALERT_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.alertDB) {
    global.alertDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ALERT_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  alertDB = global.alertDB;
}

export { alertDB };
export default alertDB;
