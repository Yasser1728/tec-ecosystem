/**
 * Forensic Logger - Immutable Audit Trail System
 * Part of Micro OS Sovereignty Architecture
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Provides cryptographic audit logging for all sovereign operations
 */

const crypto = require('crypto');

class ForensicLogger {
  constructor() {
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    this.logs = [];
    this.hashChain = null;
  }

  /**
   * Log a forensic event with immutable hash chain
   * @param {Object} event - Event to log
   * @returns {Object} Log entry with hash
   */
  log(event) {
    const logEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      event: event.type,
      data: event.data,
      actor: event.actor || 'SYSTEM',
      sovereignContact: this.contactEmail,
      previousHash: this.hashChain
    };

    // Generate cryptographic hash for this entry
    logEntry.hash = this.generateHash(logEntry);
    
    // Update chain
    this.hashChain = logEntry.hash;
    
    // Store log
    this.logs.push(logEntry);

    // Notify sovereign contact for critical events
    if (event.critical) {
      this.notifySovereignContact(logEntry);
    }

    return logEntry;
  }

  /**
   * Generate cryptographic hash for log entry
   * @param {Object} entry - Log entry
   * @returns {string} SHA-256 hash
   */
  generateHash(entry) {
    const data = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      event: entry.event,
      data: entry.data,
      actor: entry.actor,
      previousHash: entry.previousHash
    });

    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify integrity of log chain
   * @returns {Object} Verification result
   */
  verifyIntegrity() {
    if (this.logs.length === 0) {
      return { valid: true, message: 'No logs to verify' };
    }

    let previousHash = null;

    for (let i = 0; i < this.logs.length; i++) {
      const log = this.logs[i];
      
      // Verify previous hash matches
      if (log.previousHash !== previousHash) {
        return {
          valid: false,
          message: `Hash chain broken at log ${i}`,
          logId: log.id
        };
      }

      // Verify current hash
      const expectedHash = this.generateHash(log);
      if (log.hash !== expectedHash) {
        return {
          valid: false,
          message: `Log tampered at index ${i}`,
          logId: log.id
        };
      }

      previousHash = log.hash;
    }

    return {
      valid: true,
      message: 'All logs verified',
      totalLogs: this.logs.length,
      lastHash: this.hashChain
    };
  }

  /**
   * Get forensic trail for a specific entity
   * @param {string} entityId - Entity identifier
   * @returns {Array} Filtered logs
   */
  getForensicTrail(entityId) {
    return this.logs.filter(log => 
      log.data && (
        log.data.entityId === entityId ||
        log.data.identityId === entityId ||
        log.data.deedId === entityId
      )
    );
  }

  /**
   * Export forensic logs for archival
   * @returns {Object} Complete log data
   */
  exportLogs() {
    return {
      exportedAt: new Date().toISOString(),
      sovereignContact: this.contactEmail,
      totalLogs: this.logs.length,
      integrity: this.verifyIntegrity(),
      logs: this.logs
    };
  }

  /**
   * Generate unique log ID using cryptographically secure random
   */
  generateLogId() {
    const secureRandom = crypto.randomBytes(8).toString('hex');
    return `LOG-${Date.now()}-${secureRandom}`;
  }

  /**
   * Notify sovereign contact for critical forensic events
   * @param {Object} logEntry - Critical log entry
   */
  async notifySovereignContact(logEntry) {
    // In production, this would send email/notification to yasserrr.fox17@gmail.com
    console.log(`[FORENSIC ALERT] ${this.contactEmail}`);
    console.log(`Critical Event: ${logEntry.event}`);
    console.log(`Log ID: ${logEntry.id}`);
    console.log(`Timestamp: ${logEntry.timestamp}`);
    
    return {
      notified: true,
      recipient: this.contactEmail,
      logId: logEntry.id,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ForensicLogger;
