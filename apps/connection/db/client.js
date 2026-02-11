/**
 * Connection Database Client
 * Isolated Prisma Client for connection domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-connection';

// Singleton pattern for database connection
let connectionDB;

if (process.env.NODE_ENV === 'production') {
  connectionDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.CONNECTION_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.connectionDB) {
    global.connectionDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.CONNECTION_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  connectionDB = global.connectionDB;
}

export { connectionDB };
export default connectionDB;
