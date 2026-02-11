/**
 * NBF.pi - Sovereign Banking
 *
 * Next-generation banking with Pi Network settlements
 *
 * Sector: Banking
 * Category: finance
 */

import { DomainBootstrap } from "../../core/bootstrap";
import { getDomainDatabaseConfig, registerDomainClient } from "../../core/database";
import domainConfig from "./config";
import nbfDB from "./db/client.js";

// Register this domain's database client
registerDomainClient("nbf", nbfDB);

/**
 * NBF Domain Class
 *
 * Extends DomainBootstrap with nbf-specific functionality
 */
export class NBFDomain extends DomainBootstrap {
  constructor(options = {}) {
    // Get database configuration
    const dbConfig = getDomainDatabaseConfig("nbf");

    super({
      ...domainConfig,
      ...options,
      name: "nbf",
      database: dbConfig.database,
      forensicEnabled: true,
      approvalRequired: true,
    });

    console.log(`[NBF] Domain initialized with sovereign controls`);
  }

  /**
   * Get domain-specific information
   */
  getDomainInfo() {
    return {
      ...this.getMetadata(),
      sector: "Banking",
      category: "finance",
      function: "Financial planning, Pi settlements, and banking insights",
    };
  }

  /**
   * Example: Execute a domain-specific operation with full controls
   */
  async performDomainOperation(operationType, operationData, user, request) {
    return await this.executeWithControls(
      operationType,
      operationData,
      user,
      request,
      async () => {
        // Domain-specific operation logic goes here
        console.log(`[NBF] Executing ${operationType}`);

        // TODO: Implement domain-specific operations

        return {
          success: true,
          domain: "nbf",
          operation: operationType,
        };
      },
    );
  }
}

// Export singleton instance
export const nbfDomain = new NBFDomain();

export default nbfDomain;
export { nbfDB };
