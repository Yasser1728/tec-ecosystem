/**
 * Core Bootstrap Module
 *
 * Universal boilerplate for all TEC domains
 * Provides automatic connection to core services, forensic logging,
 * and approval center integration
 */

import { ForensicLogger } from "./forensic";
import { ApprovalCenter } from "./approval";

export class DomainBootstrap {
  constructor(config = {}) {
    this.name = config.name;
    this.database = config.database || `${config.name}_db`;
    this.forensicEnabled = config.forensicEnabled !== false; // Default: true
    this.approvalRequired = config.approvalRequired !== false; // Default: true

    // Initialize forensic logger
    if (this.forensicEnabled) {
      this.forensicLogger = new ForensicLogger({
        domain: this.name,
        database: this.database,
      });
    }

    // Initialize approval center
    if (this.approvalRequired) {
      // Require SOVEREIGN_EMAIL to be set for production security
      if (!process.env.SOVEREIGN_EMAIL) {
        console.warn(
          "[DomainBootstrap] SOVEREIGN_EMAIL environment variable not set, using default value",
        );
      }
      this.approvalCenter = new ApprovalCenter({
        domain: this.name,
        sovereignEmail:
          process.env.SOVEREIGN_EMAIL || "yasserrr.fox17@gmail.com",
      });
    }

    // Domain metadata
    this.metadata = {
      name: config.name,
      displayName: config.displayName,
      icon: config.icon,
      tagline: config.tagline,
      description: config.description,
      sector: config.sector,
      color: config.color,
      database: this.database,
      forensicEnabled: this.forensicEnabled,
      approvalRequired: this.approvalRequired,
      initializedAt: new Date().toISOString(),
    };
  }

  /**
   * Get domain metadata
   */
  getMetadata() {
    return this.metadata;
  }

  /**
   * Log operation with forensic trail
   */
  async logOperation(operationType, operationData, user, request) {
    if (!this.forensicEnabled) {
      return { logged: false };
    }

    return await this.forensicLogger.log({
      operationType,
      operationData,
      user,
      request,
      domain: this.name,
    });
  }

  /**
   * Request approval for major transaction
   */
  async requestApproval(operationType, operationData, user, request) {
    if (!this.approvalRequired) {
      return { approved: true, reason: "Approval not required" };
    }

    return await this.approvalCenter.requestApproval({
      operationType,
      operationData,
      user,
      request,
      domain: this.name,
    });
  }

  /**
   * Execute operation with full sovereign controls
   * (forensic logging + approval + execution)
   */
  async executeWithControls(
    operationType,
    operationData,
    user,
    request,
    executor,
  ) {
    // Step 1: Log operation
    const logResult = await this.logOperation(
      operationType,
      operationData,
      user,
      request,
    );

    // Step 2: Request approval
    const approvalResult = await this.requestApproval(
      operationType,
      operationData,
      user,
      request,
    );

    if (!approvalResult.approved) {
      return {
        success: false,
        approved: false,
        reason: approvalResult.reason || "Operation not approved",
        logResult,
      };
    }

    // Step 3: Execute operation
    try {
      const executionResult = await executor();

      // Log successful execution
      await this.logOperation(
        `${operationType}_success`,
        {
          ...operationData,
          result: executionResult,
        },
        user,
        request,
      );

      return {
        success: true,
        approved: true,
        result: executionResult,
        logResult,
        approvalResult,
      };
    } catch (error) {
      // Log failed execution
      await this.logOperation(
        `${operationType}_failed`,
        {
          ...operationData,
          error: error.message,
        },
        user,
        request,
      );

      return {
        success: false,
        approved: true,
        error: error.message,
        logResult,
        approvalResult,
      };
    }
  }

  /**
   * Get domain status
   */
  getStatus() {
    return {
      domain: this.name,
      database: this.database,
      forensicEnabled: this.forensicEnabled,
      approvalRequired: this.approvalRequired,
      forensicLogger: this.forensicLogger ? "active" : "inactive",
      approvalCenter: this.approvalCenter ? "active" : "inactive",
      uptime: Date.now() - new Date(this.metadata.initializedAt).getTime(),
    };
  }
}

export default DomainBootstrap;
