/**
 * Pi Network Service Implementation - TEC Assistant Domain
 * Handles Pi Network authentication and payments
 */

import {
  IPiNetworkService,
  PiAuthResult,
  PiPaymentData,
  PiPaymentResult,
} from "../../domain/interfaces/services/IPiNetworkService";

/**
 * Get the Pi API base URL based on environment configuration
 * This mirrors the logic from lib/config/pi-api.js but is implemented
 * directly here to avoid CommonJS/ESM module issues with TypeScript
 */
function getPiApiBaseUrl(sandbox: boolean): string {
  // Check if sandbox/testnet mode is enabled via environment or constructor parameter
  const isSandboxMode = 
    sandbox || 
    process.env.PI_SANDBOX_MODE === 'true' || 
    process.env.NEXT_PUBLIC_PI_SANDBOX === 'true';

  if (isSandboxMode) {
    // Use custom sandbox URL if provided, otherwise default
    return process.env.PI_SANDBOX_API_URL || 'https://sandbox-api.minepi.com/v2';
  } else {
    // Use custom production URL if provided, otherwise default
    return process.env.PI_API_URL || 'https://api.minepi.com/v2';
  }
}

export class PiNetworkService implements IPiNetworkService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(apiKey: string, sandbox: boolean = true) {
    this.apiKey = apiKey;
    // Use the centralized logic to get the correct API URL
    this.apiUrl = getPiApiBaseUrl(sandbox);
    console.log(`PiNetworkService initialized with API URL: ${this.apiUrl} (sandbox: ${sandbox})`);
  }

  async verifyAuth(accessToken: string): Promise<PiAuthResult> {
    try {
      const response = await fetch(`${this.apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to verify Pi authentication");
      }

      const data = await response.json();

      return {
        uid: data.uid,
        username: data.username,
        walletAddress: data.walletAddress,
        accessToken,
      };
    } catch (error) {
      throw new Error(`Pi authentication failed: ${error}`);
    }
  }

  async createPayment(paymentData: PiPaymentData): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          payment: {
            amount: paymentData.amount,
            memo: paymentData.memo,
            metadata: paymentData.metadata,
            uid: paymentData.identifier,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Pi payment");
      }

      const data = await response.json();
      return data.identifier;
    } catch (error) {
      throw new Error(`Pi payment creation failed: ${error}`);
    }
  }

  async approvePayment(paymentId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiUrl}/payments/${paymentId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${this.apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to approve Pi payment");
      }
    } catch (error) {
      throw new Error(`Pi payment approval failed: ${error}`);
    }
  }

  async completePayment(paymentId: string, txHash: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiUrl}/payments/${paymentId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${this.apiKey}`,
          },
          body: JSON.stringify({ txid: txHash }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to complete Pi payment");
      }
    } catch (error) {
      throw new Error(`Pi payment completion failed: ${error}`);
    }
  }

  async cancelPayment(paymentId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiUrl}/payments/${paymentId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${this.apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel Pi payment");
      }
    } catch (error) {
      throw new Error(`Pi payment cancellation failed: ${error}`);
    }
  }

  async getPayment(paymentId: string): Promise<PiPaymentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
        headers: {
          Authorization: `Key ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get Pi payment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to retrieve Pi payment: ${error}`);
    }
  }
}
