/**
 * Unit tests for Pi Payments Module
 */

import {
  PiPayments,
  DOMAIN_PRICES,
  PAYMENT_TYPES,
} from "../../lib/pi-payments";
import { piAuth } from "../../lib/pi-auth";

jest.mock("../../lib/pi-auth");

describe("PiPayments", () => {
  let piPayments;
  let mockWindow;

  beforeEach(() => {
    // Mock fetch first before anything else
    global.fetch = jest.fn();
    
    // Mock window and Pi SDK with proper callback handling
    const mockPiCreatePayment = jest.fn((paymentData, callbacks) => {
      // Simulate async callback execution
      const paymentId = "payment-123";
      
      // Call callbacks asynchronously for testing (use setTimeout for jsdom compatibility)
      if (callbacks) {
        setTimeout(() => {
          if (callbacks.onReadyForServerApproval) {
            callbacks.onReadyForServerApproval(paymentId);
          }
        }, 0);
        
        setTimeout(() => {
          if (callbacks.onReadyForServerCompletion) {
            callbacks.onReadyForServerCompletion(paymentId, "txid-123");
          }
        }, 10);
      }
      
      return Promise.resolve({
        identifier: paymentId,
        user_uid: "user-123",
      });
    });
    
    mockWindow = {
      Pi: {
        init: jest.fn().mockResolvedValue(undefined),
        createPayment: mockPiCreatePayment,
      },
      dispatchEvent: jest.fn(),
    };
    
    // Override window object completely
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
      configurable: true,
    });

    // Create instance after mocking window
    piPayments = new PiPayments();

    // Mock piAuth
    piAuth.getUser.mockReturnValue({
      id: "user-123",
      piId: "pi-123",
      username: "testuser",
    });
    piAuth.initialized = true;
    piAuth.init = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDomainPurchase", () => {
    it("should create domain purchase payment", async () => {
      const mockPaymentRecord = {
        id: "payment-123",
        amount: 100,
        domain: "fundx",
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: mockPaymentRecord,
        }),
      });

      const result = await piPayments.createDomainPurchase({
        domain: "fundx",
        tier: "STANDARD",
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe("payment-123");
      
      // Verify fetch was called with correct data
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/create-payment",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("should apply tier multiplier for premium tier", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: "payment-123" },
        }),
      });

      await piPayments.createDomainPurchase({
        domain: "fundx",
        tier: "PREMIUM",
      });

      const expectedAmount = DOMAIN_PRICES.fundx * 1.5;

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/create-payment",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining(expectedAmount.toString()),
        }),
      );
    });

    it("should throw error when user not authenticated", async () => {
      piAuth.getUser.mockReturnValue(null);

      await expect(
        piPayments.createDomainPurchase({ domain: "fundx" }),
      ).rejects.toThrow("User must be authenticated");
    });
  });

  describe("createNotificationPayment", () => {
    it("should create notification payment with monthly duration", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: "payment-123" },
        }),
      });

      const result = await piPayments.createNotificationPayment({
        notificationType: "premium",
        duration: "monthly",
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/create-payment",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"amount":10'),
        }),
      );
    });

    it("should apply correct pricing for yearly duration", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: "payment-123" },
        }),
      });

      await piPayments.createNotificationPayment({
        notificationType: "premium",
        duration: "yearly",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/create-payment",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"amount":80'),
        }),
      );
    });
  });

  describe("createEcommercePayment", () => {
    it("should create ecommerce payment with quantity", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: "payment-123" },
        }),
      });

      const result = await piPayments.createEcommercePayment({
        serviceId: "service-1",
        serviceName: "Luxury Service",
        price: 50,
        quantity: 3,
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/create-payment",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"amount":150'),
        }),
      );
    });
  });

  describe("createNFTMintingPayment", () => {
    it("should create NFT minting payment", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          payment: { id: "payment-123" },
        }),
      });

      const result = await piPayments.createNFTMintingPayment({
        domainName: "fundx",
        certificateType: "ownership",
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/create-payment",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"amount":50'),
        }),
      );
    });
  });

  describe("handleApproval", () => {
    it("should call approval API endpoint with payment data", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Add payment to activePayments map
      piPayments.activePayments.set("pi-payment-123", {
        amount: 100,
        metadata: { domain: "fundx" },
        status: "pending",
      });

      await piPayments.handleApproval("pi-payment-123", "internal-123");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/approve",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("pi-payment-123"),
        }),
      );

      // Verify amount and domain are included
      const callArgs = global.fetch.mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      expect(body.amount).toBe(100);
      expect(body.domain).toBe("fundx");
    });

    it("should use default values when payment not in activePayments", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await piPayments.handleApproval("unknown-payment", "internal-456");

      const callArgs = global.fetch.mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      expect(body.amount).toBe(0);
      expect(body.domain).toBe("unknown");
    });
  });

  describe("handleCompletion", () => {
    it("should call completion API and dispatch event", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

      await piPayments.handleCompletion(
        "pi-payment-123",
        "txid-123",
        "internal-123",
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/complete",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("txid-123"),
        }),
      );

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "pi-payment-completed",
        }),
      );
    });
  });

  describe("handleCancel", () => {
    it("should call cancel API endpoint", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await piPayments.handleCancel("pi-payment-123", "internal-123");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/cancel",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  describe("getActivePayments", () => {
    it("should return array of active payments", () => {
      piPayments.activePayments.set("payment-1", { amount: 100 });
      piPayments.activePayments.set("payment-2", { amount: 200 });

      const payments = piPayments.getActivePayments();

      expect(payments).toHaveLength(2);
    });
  });
});
