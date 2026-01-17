/**
 * Unit tests for Pi Payment API endpoints (approve and complete)
 * Tests both sandbox and production modes
 * @jest-environment node
 */

// Mock next-auth first (must be before any requires that use it)
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { id: "user-123", email: "test@example.com" } }),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock forensic-utils
const mockCreateAuditEntry = jest.fn();
jest.mock("../../lib/forensic-utils", () => ({
  AUDIT_OPERATION_TYPES: {
    PAYMENT_APPROVE: 'payment_approve',
    PAYMENT_COMPLETE: 'payment_complete',
  },
  RISK_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
  createAuditEntry: mockCreateAuditEntry,
}));

// Mock auth options - The [...nextauth] file path is problematic for Jest resolution
// because Jest can't resolve relative imports like './auth/[...nextauth]' from approve.js.
// We use jest.config.cjs moduleNameMapper to redirect these paths to a mock file at
// tests/__mocks__/nextauth.js. This is the standard approach for mocking dynamic route files.

describe("Pi Payment API Endpoints", () => {
  let originalEnv;

  beforeEach(() => {
    // Store original env
    originalEnv = { ...process.env };
    
    // Clear all mocks
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe("Payment Approval API - Sandbox Mode", () => {
    beforeEach(() => {
      // Set sandbox mode
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
      process.env.PI_SANDBOX_MODE = "true";
      process.env.NEXTAUTH_URL = "http://localhost:3000";
    });

    it("should approve payment in sandbox mode without calling forensic audit or Pi API", async () => {
      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          internalId: "payment-123",
          amount: 100,
          domain: "fundx",
        },
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      // Should NOT call forensic audit in sandbox mode
      expect(global.fetch).not.toHaveBeenCalled();

      // Should return success
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            piPaymentId: "pi-payment-123",
            status: "APPROVED",
          }),
          message: "Payment approved (sandbox mode)",
        })
      );
    });
  });

  describe("Payment Approval API - Production Mode", () => {
    beforeEach(() => {
      // Set production mode
      process.env.NEXT_PUBLIC_PI_SANDBOX = "false";
      process.env.PI_SANDBOX_MODE = "false";
      process.env.PI_API_KEY = "test-api-key-123";
      process.env.NEXTAUTH_URL = "http://localhost:3000";
    });

    it("should call Pi Platform API in production mode", async () => {
      // Mock forensic audit approval (direct function call)
      mockCreateAuditEntry.mockResolvedValueOnce({
        approved: true,
        logEntry: {
          id: "audit-123",
          hash: "hash-abc",
        },
        validationResult: {
          riskLevel: "low",
        },
      });

      // Mock Pi Platform API approval
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          identifier: "pi-payment-123",
          status: "approved",
          amount: 100,
        }),
      });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          internalId: "payment-123",
          amount: 100,
          domain: "fundx",
        },
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      // Should call only Pi Platform API (forensic audit is now direct function call)
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify Pi Platform API was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.minepi.com/v2/payments/pi-payment-123/approve",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Key test-api-key-123",
            "Content-Type": "application/json",
          }),
        })
      );

      // Should return success
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            piPaymentId: "pi-payment-123",
          }),
        })
      );
    });

    it("should return error when PI_API_KEY is not configured", async () => {
      // Remove API key
      delete process.env.PI_API_KEY;

      // Mock forensic audit approval (direct function call)
      mockCreateAuditEntry.mockResolvedValueOnce({
        approved: true,
        logEntry: {
          id: "audit-123",
        },
        validationResult: {
          riskLevel: "low",
        },
      });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          internalId: "payment-123",
        },
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Server configuration error",
        })
      );
    });

    it("should handle Pi API approval failure", async () => {
      // Mock forensic audit approval (direct function call)
      mockCreateAuditEntry.mockResolvedValueOnce({
        approved: true,
        logEntry: {
          id: "audit-123",
        },
        validationResult: {
          riskLevel: "low",
        },
      });

      // Mock Pi Platform API failure
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Invalid payment",
        }),
      });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          internalId: "payment-123",
        },
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Failed to approve payment with Pi Network",
        })
      );
    });

    it("should reject payment when forensic audit rejects it", async () => {
      // Mock forensic audit rejection (direct function call)
      mockCreateAuditEntry.mockResolvedValueOnce({
        approved: false,
        logEntry: {
          id: "audit-456",
        },
        identityCheck: {
          verified: false,
          reason: "Identity verification failed",
        },
        validationResult: {
          valid: false,
          errors: ["Invalid amount"],
          riskLevel: "high",
        },
        suspicionResult: {
          suspicious: true,
          indicators: ["Suspicious activity detected"],
        },
      });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-456",
          internalId: "payment-456",
        },
        headers: {},
        socket: { remoteAddress: "127.0.0.1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      // Should NOT call Pi Platform API if forensic audit rejects
      expect(global.fetch).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Payment approval rejected",
        })
      );
    });
  });

  describe("Payment Completion API - Sandbox Mode", () => {
    beforeEach(() => {
      // Set sandbox mode
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
      process.env.PI_SANDBOX_MODE = "true";
    });

    it("should complete payment in sandbox mode without calling Pi API", async () => {
      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          txid: "txid-abc-123",
          internalId: "payment-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      // Should NOT call Pi Platform API in sandbox mode
      expect(global.fetch).not.toHaveBeenCalled();

      // Should return success
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            piPaymentId: "pi-payment-123",
            status: "COMPLETED",
            txid: "txid-abc-123",
          }),
          message: expect.stringContaining("sandbox mode"),
        })
      );
    });
  });

  describe("Payment Completion API - Production Mode", () => {
    beforeEach(() => {
      // Set production mode
      process.env.NEXT_PUBLIC_PI_SANDBOX = "false";
      process.env.PI_SANDBOX_MODE = "false";
      process.env.PI_API_KEY = "test-api-key-123";
    });

    it("should call Pi Platform API in production mode", async () => {
      // Mock Pi Platform API completion
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          identifier: "pi-payment-123",
          status: "completed",
          txid: "txid-abc-123",
        }),
      });

      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          txid: "txid-abc-123",
          internalId: "payment-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      // Verify Pi Platform API was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.minepi.com/v2/payments/pi-payment-123/complete",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Key test-api-key-123",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ txid: "txid-abc-123" }),
        })
      );

      // Should return success
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            piPaymentId: "pi-payment-123",
            txid: "txid-abc-123",
          }),
        })
      );
    });

    it("should return error when PI_API_KEY is not configured", async () => {
      // Remove API key
      delete process.env.PI_API_KEY;

      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          txid: "txid-abc-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Server configuration error",
        })
      );
    });

    it("should handle Pi API completion failure", async () => {
      // Mock Pi Platform API failure
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: "Payment not found",
        }),
      });

      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          txid: "txid-abc-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Failed to complete payment with Pi Network",
        })
      );
    });

    it("should validate required parameters", async () => {
      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          // Missing txid
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Missing paymentId or txid",
        })
      );
    });
  });
});
