/**
 * NBF Database Client
 * Isolated Prisma Client for nbf domain
 * Ensures complete data sovereignty
 */

import { PrismaClient } from '@prisma/client-nbf';

// Singleton pattern for database connection
let nbfDB;

if (process.env.NODE_ENV === 'production') {
  nbfDB = new PrismaClient({
    datasources: {
      db: {
        url: process.env.NBF_DATABASE_URL || process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  });
} else {
  if (!global.nbfDB) {
    global.nbfDB = new PrismaClient({
      datasources: {
        db: {
          url: process.env.NBF_DATABASE_URL || process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    });
  }
  nbfDB = global.nbfDB;
}

export { nbfDB };
export default nbfDB;
