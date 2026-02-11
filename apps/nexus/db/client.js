/**
 * Nexus Database Client
 * Isolated Prisma Client for nexus domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-nexus';

// Singleton pattern for database connection
let nexusDB;

if (process.env.NODE_ENV === 'production') {
  nexusDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.NEXUS_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.nexusDB) {
    global.nexusDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.NEXUS_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  nexusDB = global.nexusDB;
}

export { nexusDB };
export default nexusDB;
