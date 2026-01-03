/**
 * Core ApprovalCenter
 * 
 * Centralized approval system for all domains
 * Manages sovereign email notifications and approval workflows
 */

import { AUDIT_OPERATION_TYPES, RISK_LEVELS } from '../lib/forensic-utils.js';

// Sovereign email for major transaction approvals
const SOVEREIGN_EMAIL = process.env.SOVEREIGN_EMAIL || 'yasserrr.fox17@gmail.com';

// Thresholds for automatic vs manual approval
const APPROVAL_THRESHOLDS = {
  AUTO_APPROVE_AMOUNT: 1000, // PI - amounts below this are auto-approved
  MANUAL_REVIEW_AMOUNT: 10000, // PI - amounts above this require manual review
  CRITICAL_AMOUNT: 50000, // PI - amounts above this require immediate notification
};

export class ApprovalCenter {
  constructor(config = {}) {
    this.domain = config.domain;
    this.sovereignEmail = config.sovereignEmail || SOVEREIGN_EMAIL;
    this.enabled = config.enabled !== false;
  }
  
  /**
   * Request approval for an operation
   */
  async requestApproval({ operationType, operationData, user, request, domain }) {
    if (!this.enabled) {
      return { 
        approved: true, 
        reason: 'Approval center disabled',
        autoApproved: true 
      };
    }
    
    try {
      // Call central approval API
      const apiEndpoint = process.env.APPROVAL_API_ENDPOINT || '/api/approval';
      
      let response;
      try {
        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationType,
            operationData: {
              ...operationData,
              domain: domain || this.domain
            },
            domain: domain || this.domain,
            context: {
              requestedAt: new Date().toISOString(),
              requestedBy: user?.id || 'unknown'
            }
          })
        });
      } catch (networkError) {
        // Network error - fail securely for critical operations
        const isCritical = this.isCriticalOperation(operationType, operationData);
        console.error('[ApprovalCenter] Network error during approval request:', networkError);
        
        return {
          approved: !isCritical,
          reason: isCritical 
            ? 'Network error during approval - denied for security'
            : 'Network error during approval - allowed with audit trail',
          error: networkError.message,
          networkError: true
        };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }
        
        return {
          approved: false,
          reason: error.message || `Approval request failed with status ${response.status}`,
          error: error,
          httpStatus: response.status
        };
      }
      
      const result = await response.json();
      
      // Send email notification for high-value operations
      if (this.requiresEmailNotification(operationType, operationData)) {
        await this.sendSovereignNotification({
          operationType,
          operationData,
          user,
          domain: domain || this.domain,
          approvalResult: result
        });
      }
      
      return {
        approved: result.approved,
        reason: result.message || 'Processed by approval center',
        auditLogId: result.auditLogId,
        riskLevel: result.riskLevel,
        requiresManualReview: this.requiresManualReview(operationType, operationData)
      };
    } catch (error) {
      console.error('[ApprovalCenter Error]', error);
      
      // Fail-safe: For security-critical operations, deny on error
      const isCritical = this.isCriticalOperation(operationType, operationData);
      
      return {
        approved: !isCritical,
        reason: isCritical 
          ? 'Approval failed for critical operation - denied for security'
          : 'Approval system error - allowed with audit trail',
        error: error.message,
        failSafe: true
      };
    }
  }
  
  /**
   * Check if operation requires email notification
   */
  requiresEmailNotification(operationType, operationData) {
    // High-value transactions
    if (operationData.amount >= APPROVAL_THRESHOLDS.MANUAL_REVIEW_AMOUNT) {
      return true;
    }
    
    // Critical operations
    const criticalOps = [
      AUDIT_OPERATION_TYPES.WITHDRAWAL,
      AUDIT_OPERATION_TYPES.TRANSFER,
      AUDIT_OPERATION_TYPES.DOMAIN_PURCHASE
    ];
    
    if (criticalOps.includes(operationType)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if operation requires manual review
   */
  requiresManualReview(operationType, operationData) {
    return operationData.amount >= APPROVAL_THRESHOLDS.MANUAL_REVIEW_AMOUNT;
  }
  
  /**
   * Check if operation is critical
   */
  isCriticalOperation(operationType, operationData) {
    return operationData.amount >= APPROVAL_THRESHOLDS.CRITICAL_AMOUNT;
  }
  
  /**
   * Send sovereign email notification
   */
  async sendSovereignNotification({ operationType, operationData, user, domain, approvalResult }) {
    // Format notification
    const notification = {
      to: this.sovereignEmail,
      subject: `🚨 TEC Sovereign Alert: ${operationType} in ${domain}`,
      body: this.formatNotificationEmail({
        operationType,
        operationData,
        user,
        domain,
        approvalResult
      }),
      timestamp: new Date().toISOString(),
      priority: this.isCriticalOperation(operationType, operationData) ? 'CRITICAL' : 'HIGH'
    };
    
    console.log('[SOVEREIGN NOTIFICATION]', JSON.stringify(notification, null, 2));
    
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // Production implementation should use actual email service:
    // const emailService = require('./email-service');
    // await emailService.send({
    //   to: notification.to,
    //   subject: notification.subject,
    //   html: notification.body,
    //   priority: notification.priority
    // });
    
    // For now, log warning that email is not actually sent
    console.warn('[SOVEREIGN NOTIFICATION] Email service not configured. Notification logged only. Configure email service for production.');
    
    return {
      sent: false, // Will be true when email service is integrated
      logged: true,
      notification
    };
  }
  
  /**
   * Format notification email
   */
  formatNotificationEmail({ operationType, operationData, user, domain, approvalResult }) {
    return `
TEC Ecosystem - Sovereign Control Notification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 DOMAIN: ${domain.toUpperCase()}
📋 OPERATION: ${operationType}
👤 USER: ${user?.email || user?.id || 'Unknown'}
⏰ TIMESTAMP: ${new Date().toISOString()}

💰 TRANSACTION DETAILS:
${JSON.stringify(operationData, null, 2)}

✅ APPROVAL STATUS: ${approvalResult.approved ? 'APPROVED' : 'REJECTED'}
📊 RISK LEVEL: ${approvalResult.riskLevel || 'N/A'}
🔐 AUDIT LOG ID: ${approvalResult.auditLogId || 'N/A'}

${approvalResult.message || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated sovereign control notification from the TEC Ecosystem.
All operations are logged immutably for forensic audit purposes.
    `.trim();
  }
  
  /**
   * Get approval statistics for domain
   */
  async getApprovalStats() {
    try {
      const { fetchAuditLogs } = await import('../lib/forensic-utils');
      
      const allLogs = await fetchAuditLogs({ domain: this.domain });
      const approvedCount = allLogs.filter(log => log.approved).length;
      const rejectedCount = allLogs.filter(log => !log.approved).length;
      
      return {
        domain: this.domain,
        total: allLogs.length,
        approved: approvedCount,
        rejected: rejectedCount,
        approvalRate: allLogs.length > 0 ? (approvedCount / allLogs.length) * 100 : 0
      };
    } catch (error) {
      console.error('[ApprovalCenter Stats Error]', error);
      return {
        domain: this.domain,
        total: 0,
        approved: 0,
        rejected: 0,
        approvalRate: 0,
        error: error.message
      };
    }
  }
}

export { SOVEREIGN_EMAIL, APPROVAL_THRESHOLDS };
export default ApprovalCenter;
