/**
 * Pi Network Payment Module
 * Handles all payment flows for TEC Ecosystem
 */

import { piAuth } from "./pi-auth.js";

export const PAYMENT_TYPES = {
  DOMAIN_PURCHASE: "domain_purchase",
  PREMIUM_NOTIFICATION: "premium_notification",
  ECOMMERCE_SERVICE: "ecommerce_service",
  NFT_MINTING: "nft_minting",
  SUBSCRIPTION: "subscription",
};

export const DOMAIN_PRICES = {
  fundx: 100,
  assets: 150,
  dx: 200,
  nx: 180,
  estate: 250,
  land: 300,
  market: 120,
  store: 100,
  default: 100,
};

export class PiPayments {
  constructor() {
    this.activePayments = new Map();
  }

  async createDomainPurchase({ domain, tier = "STANDARD" }) {
    const user = piAuth.getUser();
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const amount = DOMAIN_PRICES[domain] || DOMAIN_PRICES.default;
    const tierMultiplier = tier === "PREMIUM" ? 1.5 : tier === "VIP" ? 2 : 1;
    const finalAmount = amount * tierMultiplier;

    return await this.createPayment({
      amount: finalAmount,
      memo: `Domain Purchase: ${domain.toUpperCase()} (${tier})`,
      metadata: {
        type: PAYMENT_TYPES.DOMAIN_PURCHASE,
        domain,
        tier,
        userId: user.id,
      },
    });
  }

  async createNotificationPayment({ notificationType, duration = "monthly" }) {
    const user = piAuth.getUser();
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const prices = {
      monthly: 10,
      quarterly: 25,
      yearly: 80,
    };

    const amount = prices[duration] || prices.monthly;

    return await this.createPayment({
      amount,
      memo: `Premium Notifications: ${notificationType} (${duration})`,
      metadata: {
        type: PAYMENT_TYPES.PREMIUM_NOTIFICATION,
        notificationType,
        duration,
        userId: user.id,
      },
    });
  }

  async createEcommercePayment({
    serviceId,
    serviceName,
    price,
    quantity = 1,
  }) {
    const user = piAuth.getUser();
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const totalAmount = price * quantity;

    return await this.createPayment({
      amount: totalAmount,
      memo: `Ecommerce: ${serviceName} (x${quantity})`,
      metadata: {
        type: PAYMENT_TYPES.ECOMMERCE_SERVICE,
        serviceId,
        serviceName,
        price,
        quantity,
        userId: user.id,
      },
    });
  }

  async createNFTMintingPayment({ domainName, certificateType = "ownership" }) {
    const user = piAuth.getUser();
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const mintingFee = certificateType === "ownership" ? 50 : 30;

    return await this.createPayment({
      amount: mintingFee,
      memo: `NFT Minting: ${domainName} ${certificateType} certificate`,
      metadata: {
        type: PAYMENT_TYPES.NFT_MINTING,
        domainName,
        certificateType,
        userId: user.id,
      },
    });
  }

  async createPayment({ amount, memo, metadata }) {
    if (typeof window === "undefined" || !window.Pi) {
      throw new Error("Pi Browser required");
    }

    const user = piAuth.getUser();
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // Ensure Pi SDK is initialized
    if (!piAuth.initialized) {
      await piAuth.init();
    }

    try {
      // Create payment record in backend first
      const backendResponse = await fetch("/api/payments/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          memo,
          domain: metadata.domain || "tec",
          userId: user.id,
          category: metadata.type,
          metadata,
        }),
      });

      if (!backendResponse.ok) {
        throw new Error("Failed to create payment record");
      }

      const { payment: paymentRecord } = await backendResponse.json();

      // Create Pi payment
      const payment = await window.Pi.createPayment(
        {
          amount,
          memo,
          metadata: {
            ...metadata,
            internalId: paymentRecord.id,
          },
        },
        {
          onReadyForServerApproval: (paymentId) => {
            this.handleApproval(paymentId, paymentRecord.id);
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            this.handleCompletion(paymentId, txid, paymentRecord.id);
          },
          onCancel: (paymentId) => {
            this.handleCancel(paymentId, paymentRecord.id);
          },
          onError: (error, payment) => {
            this.handleError(error, payment, paymentRecord.id);
          },
        },
      );

      this.activePayments.set(payment.identifier, {
        piPaymentId: payment.identifier,
        internalId: paymentRecord.id,
        amount,
        memo,
        metadata,
        status: "pending",
      });

      return {
        success: true,
        paymentId: payment.identifier,
        internalId: paymentRecord.id,
      };
    } catch (error) {
      console.error("Payment creation failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async handleApproval(paymentId, internalId) {
    try {
      const payment = this.activePayments.get(paymentId);

      const response = await fetch("/api/payments/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          internalId,
          amount: payment?.amount || 0,
          domain: payment?.metadata?.domain || "unknown",
        }),
      });

      if (!response.ok) {
        throw new Error("Approval failed");
      }

      if (payment) {
        payment.status = "approved";
      }
    } catch (error) {
      console.error("Approval handling failed:", error);
    }
  }

  async handleCompletion(paymentId, txid, internalId) {
    try {
      const response = await fetch("/api/payments/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId, txid, internalId }),
      });

      if (!response.ok) {
        throw new Error("Completion failed");
      }

      const payment = this.activePayments.get(paymentId);
      if (payment) {
        payment.status = "completed";
        payment.txid = txid;
      }

      // Trigger completion event
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("pi-payment-completed", {
            detail: { paymentId, txid, internalId },
          }),
        );
      }
    } catch (error) {
      console.error("Completion handling failed:", error);
    }
  }

  async handleCancel(paymentId, internalId) {
    try {
      await fetch("/api/payments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId, internalId }),
      });

      const payment = this.activePayments.get(paymentId);
      if (payment) {
        payment.status = "cancelled";
      }

      this.activePayments.delete(paymentId);
    } catch (error) {
      console.error("Cancel handling failed:", error);
    }
  }

  async handleError(error, payment, internalId) {
    console.error("Payment error:", error);

    try {
      await fetch("/api/payments/error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: payment?.identifier,
          internalId,
          error: error.message,
        }),
      });
    } catch (err) {
      console.error("Error handling failed:", err);
    }
  }

  getActivePayments() {
    return Array.from(this.activePayments.values());
  }

  getPayment(paymentId) {
    return this.activePayments.get(paymentId);
  }
}

export const piPayments = new PiPayments();
