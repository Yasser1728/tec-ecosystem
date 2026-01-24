/**
 * Pi Network Authentication Module
 * Handles user authentication and wallet connection
 */

import { validatePiConfig, getMissingConfigMessage } from "./pi-config-validator";

export class PiAuth {
  constructor() {
    this.user = null;
    this.authenticated = false;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return true;

    if (typeof window === "undefined" || !window.Pi) {
      throw new Error("Pi SDK not available");
    }

    // Validate Pi configuration before initializing
    const configValidation = validatePiConfig();
    if (!configValidation.isValid) {
      const errorMsg = getMissingConfigMessage(configValidation.missing);
      console.error(errorMsg);
      throw new Error(
        `Pi Network not configured properly. Missing: ${configValidation.missing.join(", ")}`
      );
    }

    try {
      const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX !== "false";

      await window.Pi.init({
        version: "2.0",
        sandbox,
      });

      this.initialized = true;
      console.log(`✅ Pi SDK initialized (${configValidation.isSandbox ? "sandbox" : "production"} mode)`);
      
      if (configValidation.warnings.length > 0) {
        console.warn(
          `⚠️  Optional Pi config missing: ${configValidation.warnings.join(", ")}`
        );
      }
      
      return true;
    } catch (error) {
      console.error("❌ Pi SDK initialization failed:", error);
      throw error;
    }
  }

  async authenticate(scopes = ["username", "payments", "wallet_address"]) {
    if (typeof window === "undefined") {
      throw new Error("Window object not available");
    }

    // Wait for Pi SDK to load
    await this.waitForPiSDK();

    if (!window.Pi) {
      throw new Error("Pi SDK not loaded. Please refresh the page.");
    }

    // Initialize Pi SDK before authentication
    await this.init();

    try {
      const authResult = await window.Pi.authenticate(
        scopes,
        this.onIncompletePaymentFound.bind(this),
      );

      this.user = {
        piId: authResult.user.uid,
        username: authResult.user.username,
        walletAddress: authResult.user.wallet_address || null,
        accessToken: authResult.accessToken,
      };

      this.authenticated = true;

      // Sync user with backend
      await this.syncUserWithBackend();

      return {
        success: true,
        user: this.user,
      };
    } catch (error) {
      console.error("Pi authentication failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async syncUserWithBackend() {
    try {
      const response = await fetch("/api/auth/pi-authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          piId: this.user.piId,
          username: this.user.username,
          walletAddress: this.user.walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync user with backend");
      }

      const data = await response.json();

      // Update user with backend data
      this.user = {
        ...this.user,
        id: data.user.id,
        tier: data.user.tier,
        status: data.user.status,
      };

      return data;
    } catch (error) {
      console.error("User sync failed:", error);
      throw error;
    }
  }

  onIncompletePaymentFound(payment) {
    console.log("Incomplete payment found:", payment);

    // Store incomplete payment for recovery
    if (typeof window !== "undefined") {
      const incompletePayments = JSON.parse(
        localStorage.getItem("pi_incomplete_payments") || "[]",
      );
      incompletePayments.push({
        ...payment,
        foundAt: new Date().toISOString(),
      });
      localStorage.setItem(
        "pi_incomplete_payments",
        JSON.stringify(incompletePayments),
      );
    }
  }

  async getIncompletePayments() {
    if (typeof window === "undefined") return [];

    const payments = JSON.parse(
      localStorage.getItem("pi_incomplete_payments") || "[]",
    );
    return payments;
  }

  async clearIncompletePayment(paymentId) {
    if (typeof window === "undefined") return;

    const payments = JSON.parse(
      localStorage.getItem("pi_incomplete_payments") || "[]",
    );
    const filtered = payments.filter((p) => p.identifier !== paymentId);
    localStorage.setItem("pi_incomplete_payments", JSON.stringify(filtered));
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return this.authenticated && this.user !== null;
  }

  async signOut() {
    this.user = null;
    this.authenticated = false;

    if (typeof window !== "undefined") {
      localStorage.removeItem("pi_incomplete_payments");
    }
  }

  async waitForPiSDK(timeout = 10000) {
    const startTime = Date.now();

    while (!window.Pi && Date.now() - startTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!window.Pi) {
      console.warn("Pi SDK not loaded after timeout");
    }
  }
}

export const piAuth = new PiAuth();
