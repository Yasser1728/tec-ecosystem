/**
 * Pi Network Sandbox Mode
 * Works without Pi Browser - for testing and development
 */

const crypto = require('crypto');

class PiSandbox {
  constructor() {
    this.authenticated = false;
    this.user = null;
    this.scopes = [];
  }

  async authenticate(
    scopes = ["username", "payments"],
    onIncompletePaymentFound,
  ) {
    console.log("🧪 [Sandbox] Authenticating with scopes:", scopes);

    // Simulate network delay
    await this.delay(1000);

    this.authenticated = true;
    this.scopes = scopes;
    this.user = {
      uid: `sandbox_user_${crypto.randomBytes(16).toString('hex')}`,
      username: "sandbox_user",
      wallet_address: null,
    };

    console.log("✅ [Sandbox] Authentication successful:", this.user);

    return {
      accessToken: `sandbox_token_${crypto.randomBytes(16).toString('hex')}`,
      user: this.user,
    };
  }

  async createPayment(paymentData, callbacks) {
    console.log("🧪 [Sandbox] Creating payment:", paymentData);

    // Check authentication
    if (!this.authenticated) {
      const error = new Error("User must authenticate first");
      console.error("❌ [Sandbox]", error.message);
      if (callbacks.onError) {
        callbacks.onError(error, null);
      }
      throw error;
    }

    // Check payments scope
    if (!this.scopes.includes("payments")) {
      const error = new Error(
        'Cannot create a payment without "payments" scope',
      );
      console.error("❌ [Sandbox]", error.message);
      if (callbacks.onError) {
        callbacks.onError(error, null);
      }
      throw error;
    }

    const paymentId = `sandbox_payment_${crypto.randomBytes(16).toString('hex')}`;
    const txid = `sandbox_txid_${crypto.randomBytes(16).toString('hex')}`;

    // Simulate payment approval (after 1 second)
    setTimeout(() => {
      console.log("✅ [Sandbox] Payment ready for approval:", paymentId);
      if (callbacks.onReadyForServerApproval) {
        callbacks.onReadyForServerApproval(paymentId);
      }
    }, 1000);

    // Simulate payment completion (after 2 seconds)
    setTimeout(() => {
      console.log("✅ [Sandbox] Payment completed:", { paymentId, txid });
      if (callbacks.onReadyForServerCompletion) {
        callbacks.onReadyForServerCompletion(paymentId, txid);
      }
    }, 2000);

    return Promise.resolve({
      identifier: paymentId,
      amount: paymentData.amount,
      memo: paymentData.memo,
      metadata: paymentData.metadata,
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize sandbox
export const piSandbox = new PiSandbox();

// Auto-inject into window if Pi SDK not available
if (typeof window !== "undefined") {
  // Wait a bit for real Pi SDK to load
  setTimeout(() => {
    if (!window.Pi) {
      console.log("🧪 [Sandbox] Pi SDK not detected, using sandbox mode");
      window.Pi = piSandbox;
      window.piSandboxMode = true;
    }
  }, 3000);
}
