/**
 * Forensic Deed Model - Real Estate Ownership with Forensic Trail
 * Part of Estate Micro-App
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Manages property ownership deeds with complete forensic tracking
 */

class ForensicDeed {
  constructor(core) {
    this.core = core;
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    this.deeds = new Map();
  }

  /**
   * Create a new forensic deed
   * @param {Object} deedData - Deed information
   * @returns {Object} Created deed
   */
  async createDeed(deedData) {
    const deedId = this.generateDeedId();

    const deed = {
      id: deedId,
      propertyId: deedData.propertyId,
      ownerId: deedData.ownerId,
      propertyType: deedData.propertyType,
      location: deedData.location,
      size: deedData.size,
      value: deedData.value,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      transferHistory: [],
      forensicTrail: [],
      sovereignContact: this.contactEmail
    };

    this.deeds.set(deedId, deed);

    // Log to forensic system
    this.core.forensicLogger.log({
      type: 'DEED_CREATED',
      data: {
        deedId,
        propertyId: deed.propertyId,
        ownerId: deed.ownerId,
        value: deed.value
      },
      actor: deedData.createdBy || 'SYSTEM',
      critical: true
    });

    // Publish event
    await this.core.eventBus.publish({
      type: 'DEED_CREATED',
      source: 'ESTATE_APP',
      data: { deedId, propertyId: deed.propertyId },
      critical: true
    });

    // Add to deed's forensic trail
    this.addForensicEntry(deedId, 'DEED_CREATED', deedData);

    return deed;
  }

  /**
   * Transfer ownership of a deed (requires approval)
   * @param {string} deedId - Deed ID
   * @param {string} newOwnerId - New owner identity ID
   * @param {string} requestedBy - Transfer initiator
   * @returns {Object} Transfer request
   */
  async transferOwnership(deedId, newOwnerId, requestedBy) {
    const deed = this.deeds.get(deedId);

    if (!deed) {
      throw new Error('Deed not found');
    }

    if (deed.status !== 'ACTIVE') {
      throw new Error('Deed is not active');
    }

    // Request sovereign approval for ownership transfer
    const approval = await this.core.approvalCenter.requestApproval({
      type: 'OWNERSHIP_TRANSFER',
      data: {
        deedId,
        propertyId: deed.propertyId,
        currentOwnerId: deed.ownerId,
        newOwnerId,
        propertyValue: deed.value
      },
      requestedBy,
      priority: 'HIGH'
    });

    // Log transfer request
    this.core.forensicLogger.log({
      type: 'TRANSFER_REQUESTED',
      data: {
        deedId,
        approvalId: approval.id,
        currentOwnerId: deed.ownerId,
        newOwnerId
      },
      actor: requestedBy,
      critical: true
    });

    // Add to deed's forensic trail
    this.addForensicEntry(deedId, 'TRANSFER_REQUESTED', {
      approvalId: approval.id,
      newOwnerId,
      requestedBy
    });

    return {
      deedId,
      approvalId: approval.id,
      status: 'PENDING_APPROVAL',
      message: `Transfer request sent to sovereign authority: ${this.contactEmail}`
    };
  }

  /**
   * Execute approved ownership transfer
   * @param {string} deedId - Deed ID
   * @param {string} approvalId - Approval ID
   */
  async executeTransfer(deedId, approvalId) {
    const deed = this.deeds.get(deedId);
    const approval = this.core.approvalCenter.getApproval(approvalId);

    if (!deed || !approval) {
      throw new Error('Deed or approval not found');
    }

    if (approval.status !== 'APPROVED') {
      throw new Error('Transfer not approved');
    }

    const oldOwnerId = deed.ownerId;
    const newOwnerId = approval.data.newOwnerId;

    // Update deed
    deed.ownerId = newOwnerId;
    deed.lastTransferDate = new Date().toISOString();
    
    // Add to transfer history
    deed.transferHistory.push({
      from: oldOwnerId,
      to: newOwnerId,
      date: deed.lastTransferDate,
      approvalId,
      approvedBy: this.contactEmail
    });

    // Log execution
    this.core.forensicLogger.log({
      type: 'TRANSFER_EXECUTED',
      data: {
        deedId,
        approvalId,
        oldOwnerId,
        newOwnerId
      },
      actor: this.contactEmail,
      critical: true
    });

    // Publish event
    await this.core.eventBus.publish({
      type: 'OWNERSHIP_TRANSFERRED',
      source: 'ESTATE_APP',
      data: { deedId, oldOwnerId, newOwnerId, approvalId },
      critical: true
    });

    // Add to deed's forensic trail
    this.addForensicEntry(deedId, 'TRANSFER_EXECUTED', {
      oldOwnerId,
      newOwnerId,
      approvalId
    });

    return deed;
  }

  /**
   * Get deed with full history
   * @param {string} deedId - Deed ID
   */
  getDeed(deedId) {
    return this.deeds.get(deedId);
  }

  /**
   * Get all deeds for an owner
   * @param {string} ownerId - Owner identity ID
   */
  getDeedsByOwner(ownerId) {
    return Array.from(this.deeds.values())
      .filter(deed => deed.ownerId === ownerId && deed.status === 'ACTIVE');
  }

  /**
   * Revoke a deed (sovereign decision)
   * @param {string} deedId - Deed ID
   * @param {string} reason - Revocation reason
   */
  async revokeDeed(deedId, reason) {
    const deed = this.deeds.get(deedId);

    if (!deed) {
      throw new Error('Deed not found');
    }

    deed.status = 'REVOKED';
    deed.revokedAt = new Date().toISOString();
    deed.revocationReason = reason;

    // Log revocation
    this.core.forensicLogger.log({
      type: 'DEED_REVOKED',
      data: {
        deedId,
        reason,
        ownerId: deed.ownerId
      },
      actor: this.contactEmail,
      critical: true
    });

    // Publish event
    await this.core.eventBus.publish({
      type: 'DEED_REVOKED',
      source: 'ESTATE_APP',
      data: { deedId, reason },
      critical: true
    });

    // Add to deed's forensic trail
    this.addForensicEntry(deedId, 'DEED_REVOKED', { reason });

    return deed;
  }

  /**
   * Add forensic entry to deed trail
   */
  addForensicEntry(deedId, action, data) {
    const deed = this.deeds.get(deedId);
    if (deed) {
      deed.forensicTrail.push({
        action,
        data,
        timestamp: new Date().toISOString(),
        contact: this.contactEmail
      });
    }
  }

  /**
   * Generate unique deed ID
   */
  generateDeedId() {
    return `DEED-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Get deed forensic trail
   * @param {string} deedId - Deed ID
   */
  getForensicTrail(deedId) {
    const deed = this.deeds.get(deedId);
    return deed ? deed.forensicTrail : [];
  }

  /**
   * Verify deed authenticity
   * @param {string} deedId - Deed ID
   */
  async verifyDeed(deedId) {
    const deed = this.deeds.get(deedId);

    if (!deed) {
      return { valid: false, reason: 'Deed not found' };
    }

    // Check forensic trail integrity
    const forensicLogs = this.core.forensicLogger.getForensicTrail(deedId);

    return {
      valid: true,
      deedId,
      status: deed.status,
      ownerId: deed.ownerId,
      forensicTrailCount: deed.forensicTrail.length,
      systemLogsCount: forensicLogs.length,
      verifiedAt: new Date().toISOString(),
      verifiedBy: this.contactEmail
    };
  }
}

module.exports = ForensicDeed;
