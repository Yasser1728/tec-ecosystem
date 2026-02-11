/**
 * Zone Database Client
 * Isolated Prisma Client for zone domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-zone';

// Singleton pattern for database connection
let zoneDB;

if (process.env.NODE_ENV === 'production') {
  zoneDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ZONE_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.zoneDB) {
    global.zoneDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ZONE_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  zoneDB = global.zoneDB;
}

export { zoneDB };
export default zoneDB;
