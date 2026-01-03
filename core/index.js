// Core module index
// This file fixes Codacy warning: "Assign object to a variable before exporting as module default"

const core = {
  version: '1.0.0',
  
  initialize() {
    console.log('Core module initialized');
    return this;
  },
  
  getConfig() {
    return {
      environment: process.env.NODE_ENV || 'development',
      version: this.version
    };
  }
};

module.exports = core;
