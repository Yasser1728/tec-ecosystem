/**
 * NX Database Client
 * Isolated Prisma Client for nx domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-nx';

// Singleton pattern for database connection
let nxDB;

if (process.env.NODE_ENV === 'production') {
  nxDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.NX_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.nxDB) {
    global.nxDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.NX_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  nxDB = global.nxDB;
}

export { nxDB };
export default nxDB;
