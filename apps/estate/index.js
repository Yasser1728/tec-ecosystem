/**
 * Estate App Entry Point
 * Part of Estate Micro-App
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Main entry point for the real estate micro-app
 */

const EstateService = require('./services/EstateService');

class EstateApp {
  constructor(core) {
    this.name = 'Estate Micro-App';
    this.version = '1.0.0';
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    this.core = core;
    
    // Initialize estate service
    this.estateService = new EstateService(core);
    
    // Log app initialization
    this.core.forensicLogger.log({
      type: 'APP_INITIALIZED',
      data: {
        appName: this.name,
        version: this.version,
        timestamp: new Date().toISOString()
      },
      actor: 'SYSTEM',
      critical: false
    });
  }

  /**
   * Get app information
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      description: 'Real Estate Management with Forensic Deeds and Manual Approval Workflows',
      features: [
        'Forensic Deed Management',
        'Ownership Transfer with Approval',
        'Complete Audit Trail',
        'Property Registry Integration',
        'Sovereign Authority Oversight'
      ],
      sovereignContact: this.contactEmail,
      statistics: this.estateService.getStatistics()
    };
  }

  /**
   * Get estate service
   */
  getService() {
    return this.estateService;
  }

  /**
   * Health check
   */
  healthCheck() {
    return {
      status: 'HEALTHY',
      app: this.name,
      version: this.version,
      timestamp: new Date().toISOString(),
      service: {
        totalDeeds: this.estateService.forensicDeed.deeds.size,
        pendingApprovals: this.estateService.getPendingApprovals().length
      }
    };
  }
}

module.exports = EstateApp;
