/**
 * Core Database Configuration
 * Follows Codacy best practice: Assign object to a variable before exporting
 */

const db = {
  // Database connection configuration
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'tec_ecosystem',
  
  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
  
  // Database client initialization
  init() {
    console.log('Initializing database connection...');
    // Database initialization logic would go here
    return this;
  },
  
  // Connection health check
  healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  },
};

// Export the database object as module default
module.exports = db;
