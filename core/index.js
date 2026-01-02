/**
 * Core Module Entry Point
 * Exports core functionality and utilities
 */

const db = require("./database");

const core = {
  database: db,

  /**
   * Initialize core modules
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log("Initializing core modules...");
    await db.connect();
    console.log("Core modules initialized successfully");
  },

  /**
   * Shutdown core modules
   * @returns {Promise<void>}
   */
  async shutdown() {
    console.log("Shutting down core modules...");
    await db.disconnect();
    console.log("Core modules shut down successfully");
  },

  /**
   * Get system health status
   * @returns {Promise<Object>}
   */
  async getHealthStatus() {
    return {
      database: await db.healthCheck(),
      timestamp: new Date().toISOString(),
    };
  },
};

// Export as a variable to satisfy Codacy requirements
module.exports = core;
