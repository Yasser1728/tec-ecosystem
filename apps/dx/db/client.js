/**
 * DX Database Client
 * Isolated Prisma Client for dx domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-dx';

// Singleton pattern for database connection
let dxDB;

if (process.env.NODE_ENV === 'production') {
  dxDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DX_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.dxDB) {
    global.dxDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DX_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  dxDB = global.dxDB;
}

export { dxDB };
export default dxDB;
