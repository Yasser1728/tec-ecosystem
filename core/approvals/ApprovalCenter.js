/**
 * Sovereign Approval Center - Manual Approval & Notification System
 * Part of Micro OS Sovereignty Architecture
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Manages sovereign decisions requiring manual approval with notifications
 */

class ApprovalCenter {
  constructor(forensicLogger) {
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    this.forensicLogger = forensicLogger;
    this.approvals = new Map();
    this.notifications = [];
  }

  /**
   * Request sovereign approval for critical operation
   * @param {Object} request - Approval request
   * @returns {Object} Approval tracking object
   */
  async requestApproval(request) {
    const approvalId = this.generateApprovalId();
    
    const approval = {
      id: approvalId,
      type: request.type,
      data: request.data,
      requestedBy: request.requestedBy,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      priority: request.priority || 'NORMAL',
      sovereignContact: this.contactEmail
    };

    this.approvals.set(approvalId, approval);

    // Log forensic event
    this.forensicLogger.log({
      type: 'APPROVAL_REQUESTED',
      data: {
        approvalId,
        type: request.type,
        priority: approval.priority
      },
      actor: request.requestedBy,
      critical: approval.priority === 'HIGH' || approval.priority === 'CRITICAL'
    });

    // Send notification to sovereign contact
    await this.sendNotification({
      type: 'APPROVAL_REQUIRED',
      approvalId,
      priority: approval.priority,
      data: approval
    });

    return approval;
  }

  /**
   * Process approval decision (sovereign action)
   * @param {string} approvalId - Approval ID
   * @param {boolean} approved - Approval decision
   * @param {string} comments - Decision comments
   */
  async processApproval(approvalId, approved, comments) {
    const approval = this.approvals.get(approvalId);
    
    if (!approval) {
      throw new Error('Approval not found');
    }

    if (approval.status !== 'PENDING') {
      throw new Error('Approval already processed');
    }

    approval.status = approved ? 'APPROVED' : 'REJECTED';
    approval.processedAt = new Date().toISOString();
    approval.comments = comments;
    approval.decidedBy = this.contactEmail;

    // Log forensic event
    this.forensicLogger.log({
      type: approved ? 'APPROVAL_GRANTED' : 'APPROVAL_REJECTED',
      data: {
        approvalId,
        comments,
        originalRequest: approval.type
      },
      actor: this.contactEmail,
      critical: true
    });

    // Send notification about decision
    await this.sendNotification({
      type: 'APPROVAL_PROCESSED',
      approvalId,
      decision: approval.status,
      data: approval
    });

    return approval;
  }

  /**
   * Get approval status
   * @param {string} approvalId - Approval ID
   */
  getApproval(approvalId) {
    return this.approvals.get(approvalId);
  }

  /**
   * List all pending approvals
   */
  getPendingApprovals() {
    return Array.from(this.approvals.values())
      .filter(approval => approval.status === 'PENDING')
      .sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  /**
   * Send notification to sovereign contact
   * @param {Object} notification - Notification data
   */
  async sendNotification(notification) {
    const notif = {
      id: this.generateNotificationId(),
      ...notification,
      timestamp: new Date().toISOString(),
      recipient: this.contactEmail,
      sent: true
    };

    this.notifications.push(notif);

    // In production, this would send email/SMS to yasserrr.fox17@gmail.com
    console.log(`[SOVEREIGN NOTIFICATION] ${this.contactEmail}`);
    console.log(`Type: ${notification.type}`);
    console.log(`Priority: ${notification.priority || 'NORMAL'}`);
    console.log(`Data:`, JSON.stringify(notification.data, null, 2));

    return notif;
  }

  /**
   * Get notification history
   */
  getNotifications(limit = 50) {
    return this.notifications
      .slice(-limit)
      .reverse();
  }

  /**
   * Generate unique approval ID
   */
  generateApprovalId() {
    return `APR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Generate unique notification ID
   */
  generateNotificationId() {
    return `NOT-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Archive old approvals and notifications
   * @param {number} daysOld - Days threshold for archival
   */
  async archiveOldRecords(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const archived = {
      approvals: [],
      notifications: [],
      archivedAt: new Date().toISOString(),
      contact: this.contactEmail
    };

    // Archive old approvals
    for (const [id, approval] of this.approvals) {
      const requestDate = new Date(approval.requestedAt);
      if (requestDate < cutoffDate && approval.status !== 'PENDING') {
        archived.approvals.push(approval);
        this.approvals.delete(id);
      }
    }

    // Archive old notifications
    this.notifications = this.notifications.filter(notif => {
      const notifDate = new Date(notif.timestamp);
      if (notifDate < cutoffDate) {
        archived.notifications.push(notif);
        return false;
      }
      return true;
    });

    // Notify about archival
    await this.sendNotification({
      type: 'RECORDS_ARCHIVED',
      data: {
        approvalsArchived: archived.approvals.length,
        notificationsArchived: archived.notifications.length
      }
    });

    return archived;
  }
}

module.exports = ApprovalCenter;
