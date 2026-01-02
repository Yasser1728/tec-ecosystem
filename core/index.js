/**
 * Micro OS Core - Sovereignty Architecture Entry Point
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Central orchestration of all sovereign systems
 */

const ForensicLogger = require('./forensics/ForensicLogger');
const IdentityManager = require('./identity/IdentityManager');
const ApprovalCenter = require('./approvals/ApprovalCenter');
const EventBus = require('./events/EventBus');

/**
 * MicroOSCore - Main orchestration class for sovereignty architecture
 */
class MicroOSCore {
  constructor() {
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    
    // Initialize core systems
    this.forensicLogger = new ForensicLogger();
    this.identityManager = new IdentityManager();
    this.approvalCenter = new ApprovalCenter(this.forensicLogger);
    this.eventBus = new EventBus(this.forensicLogger);

    // Log core initialization
    this.forensicLogger.log({
      type: 'CORE_INITIALIZED',
      data: {
        timestamp: new Date().toISOString(),
        systems: ['ForensicLogger', 'IdentityManager', 'ApprovalCenter', 'EventBus']
      },
      actor: 'SYSTEM',
      critical: true
    });

    // Subscribe to critical events
    this.setupCriticalEventHandlers();
  }

  /**
   * Setup handlers for critical system events
   */
  setupCriticalEventHandlers() {
    // Monitor identity changes
    this.eventBus.subscribe('IDENTITY_CHANGE', async (event) => {
      this.forensicLogger.log({
        type: 'IDENTITY_CHANGE_DETECTED',
        data: event.data,
        actor: event.source,
        critical: true
      });
    });

    // Monitor approval decisions
    this.eventBus.subscribe('APPROVAL_DECISION', async (event) => {
      this.forensicLogger.log({
        type: 'APPROVAL_DECISION_LOGGED',
        data: event.data,
        actor: event.source,
        critical: true
      });
    });
  }

  /**
   * Get all core systems
   */
  getSystems() {
    return {
      forensicLogger: this.forensicLogger,
      identityManager: this.identityManager,
      approvalCenter: this.approvalCenter,
      eventBus: this.eventBus
    };
  }

  /**
   * Get system health status
   */
  getHealthStatus() {
    return {
      timestamp: new Date().toISOString(),
      sovereignContact: this.contactEmail,
      systems: {
        forensicLogger: {
          status: 'OPERATIONAL',
          totalLogs: this.forensicLogger.logs.length,
          integrity: this.forensicLogger.verifyIntegrity()
        },
        identityManager: {
          status: 'OPERATIONAL',
          totalIdentities: this.identityManager.identities.size
        },
        approvalCenter: {
          status: 'OPERATIONAL',
          pendingApprovals: this.approvalCenter.getPendingApprovals().length,
          totalApprovals: this.approvalCenter.approvals.size
        },
        eventBus: {
          status: 'OPERATIONAL',
          statistics: this.eventBus.getStatistics()
        }
      }
    };
  }

  /**
   * Shutdown core systems gracefully
   */
  async shutdown() {
    // Archive all data
    const exportData = {
      timestamp: new Date().toISOString(),
      sovereignContact: this.contactEmail,
      forensicLogs: this.forensicLogger.exportLogs(),
      approvals: await this.approvalCenter.archiveOldRecords(0),
      eventHistory: this.eventBus.getHistory({ limit: 1000 })
    };

    // Log shutdown
    this.forensicLogger.log({
      type: 'CORE_SHUTDOWN',
      data: {
        timestamp: new Date().toISOString()
      },
      actor: 'SYSTEM',
      critical: true
    });

    return exportData;
  }
}

// Export core systems
module.exports = {
  MicroOSCore,
  ForensicLogger,
  IdentityManager,
  ApprovalCenter,
  EventBus
};
