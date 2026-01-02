/**
 * Estate Service - Business Logic for Real Estate Operations
 * Part of Estate Micro-App
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Orchestrates estate operations with core systems integration
 */

const ForensicDeed = require('../models/ForensicDeed');

class EstateService {
  constructor(core) {
    this.core = core;
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    this.forensicDeed = new ForensicDeed(core);
    
    // Setup event handlers
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for estate operations
   */
  setupEventHandlers() {
    // Monitor deed creation
    this.core.eventBus.subscribe('DEED_CREATED', async (event) => {
      console.log('[ESTATE SERVICE] Deed created:', event.data.deedId);
    });

    // Monitor ownership transfers
    this.core.eventBus.subscribe('OWNERSHIP_TRANSFERRED', async (event) => {
      console.log('[ESTATE SERVICE] Ownership transferred:', event.data);
      
      // Update any related systems
      await this.updatePropertyRegistry(event.data);
    });
  }

  /**
   * Register a new property with forensic deed
   * @param {Object} propertyData - Property information
   * @param {string} ownerId - Owner identity ID
   * @returns {Object} Created deed
   */
  async registerProperty(propertyData, ownerId) {
    // Verify owner identity
    const ownerVerification = await this.core.identityManager.verifyIdentity(ownerId);
    
    if (!ownerVerification.verified) {
      throw new Error('Owner identity not verified');
    }

    // Create forensic deed
    const deed = await this.forensicDeed.createDeed({
      ...propertyData,
      ownerId,
      createdBy: ownerId
    });

    // Request approval for registration
    const approval = await this.core.approvalCenter.requestApproval({
      type: 'PROPERTY_REGISTRATION',
      data: {
        deedId: deed.id,
        propertyId: deed.propertyId,
        ownerId,
        value: deed.value
      },
      requestedBy: ownerId,
      priority: 'NORMAL'
    });

    return {
      deed,
      approval,
      message: `Property registration pending approval from ${this.contactEmail}`
    };
  }

  /**
   * Initiate property ownership transfer
   * @param {string} deedId - Deed ID
   * @param {string} currentOwnerId - Current owner ID
   * @param {string} newOwnerId - New owner ID
   * @returns {Object} Transfer request
   */
  async initiateTransfer(deedId, currentOwnerId, newOwnerId) {
    // Verify both identities
    const currentOwnerVerified = await this.core.identityManager.verifyIdentity(currentOwnerId);
    const newOwnerVerified = await this.core.identityManager.verifyIdentity(newOwnerId);

    if (!currentOwnerVerified.verified || !newOwnerVerified.verified) {
      throw new Error('Owner identities not verified');
    }

    // Verify current ownership
    const deed = this.forensicDeed.getDeed(deedId);
    if (deed.ownerId !== currentOwnerId) {
      throw new Error('Current owner mismatch');
    }

    // Request transfer
    const transfer = await this.forensicDeed.transferOwnership(
      deedId,
      newOwnerId,
      currentOwnerId
    );

    return transfer;
  }

  /**
   * Process approved transfer (called by sovereign authority)
   * @param {string} deedId - Deed ID
   * @param {string} approvalId - Approval ID
   * @param {boolean} approved - Approval decision
   * @param {string} comments - Decision comments
   */
  async processTransferApproval(deedId, approvalId, approved, comments) {
    // Process approval
    await this.core.approvalCenter.processApproval(approvalId, approved, comments);

    if (approved) {
      // Execute transfer
      const deed = await this.forensicDeed.executeTransfer(deedId, approvalId);
      return {
        success: true,
        deed,
        message: 'Transfer executed successfully'
      };
    } else {
      return {
        success: false,
        message: 'Transfer rejected',
        reason: comments
      };
    }
  }

  /**
   * Get property details with full history
   * @param {string} deedId - Deed ID
   */
  async getPropertyDetails(deedId) {
    const deed = this.forensicDeed.getDeed(deedId);

    if (!deed) {
      throw new Error('Property not found');
    }

    const verification = await this.forensicDeed.verifyDeed(deedId);

    return {
      deed,
      verification,
      forensicTrail: this.forensicDeed.getForensicTrail(deedId),
      systemLogs: this.core.forensicLogger.getForensicTrail(deedId)
    };
  }

  /**
   * Get all properties owned by a user
   * @param {string} ownerId - Owner identity ID
   */
  async getOwnerProperties(ownerId) {
    const deeds = this.forensicDeed.getDeedsByOwner(ownerId);
    
    return {
      ownerId,
      totalProperties: deeds.length,
      properties: deeds,
      totalValue: deeds.reduce((sum, deed) => sum + (deed.value || 0), 0)
    };
  }

  /**
   * Update property registry (internal)
   */
  async updatePropertyRegistry(transferData) {
    // This would update any external property registries
    console.log('[ESTATE SERVICE] Updating property registry:', transferData);
    
    // Log to forensic system
    this.core.forensicLogger.log({
      type: 'REGISTRY_UPDATED',
      data: transferData,
      actor: 'ESTATE_SERVICE',
      critical: false
    });
  }

  /**
   * Get pending approvals for estate operations
   */
  getPendingApprovals() {
    const allPending = this.core.approvalCenter.getPendingApprovals();
    
    // Filter estate-related approvals
    return allPending.filter(approval => 
      approval.type === 'PROPERTY_REGISTRATION' ||
      approval.type === 'OWNERSHIP_TRANSFER'
    );
  }

  /**
   * Get estate statistics
   */
  getStatistics() {
    return {
      totalDeeds: this.forensicDeed.deeds.size,
      activeDeeds: Array.from(this.forensicDeed.deeds.values())
        .filter(d => d.status === 'ACTIVE').length,
      revokedDeeds: Array.from(this.forensicDeed.deeds.values())
        .filter(d => d.status === 'REVOKED').length,
      pendingApprovals: this.getPendingApprovals().length,
      sovereignContact: this.contactEmail
    };
  }
}

module.exports = EstateService;
