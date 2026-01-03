/**
 * Core Module Entry Point
 * Follows Codacy best practice: Assign object to a variable before exporting
 */

const database = require('./database');

const core = {
  database,
  
  // Core system initialization
  init() {
    console.log('TEC Core System initializing...');
    this.database.init();
    return this;
  },
  
  // System health check
  healthCheck() {
    return {
      system: 'operational',
      database: this.database.healthCheck(),
      timestamp: new Date().toISOString(),
    };
  },
  
  // Version information
  version: '1.0.0',
};

// Export the core object as module default
module.exports = core;
