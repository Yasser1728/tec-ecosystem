/**
 * Assets Database Client
 * Isolated Prisma Client for assets domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-assets';

// Singleton pattern for database connection
let assetsDB;

if (process.env.NODE_ENV === 'production') {
  assetsDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.ASSETS_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.assetsDB) {
    global.assetsDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.ASSETS_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  assetsDB = global.assetsDB;
}

export { assetsDB };
export default assetsDB;
