// Core Module Index
// Following Codacy best practice: Assign object to a variable before exporting

const db = require('./database');

const core = {
  database: db,
  
  // Core utility functions
  init: async function() {
    await this.database.connect();
    return true;
  },
  
  shutdown: async function() {
    await this.database.disconnect();
    return true;
  },
  
  // Version information
  version: '1.0.0',
  name: 'TEC Ecosystem Core',
};

module.exports = core;
