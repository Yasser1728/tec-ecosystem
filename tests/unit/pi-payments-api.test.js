/**
 * Unit tests for Pi Payment API endpoints (approve and complete)
 * Tests both sandbox and production modes
 * @jest-environment node
 */

// Mock authOptions before any imports
jest.mock('../../pages/api/auth/[...nextauth]', () => ({
  authOptions: {
    providers: [],
    callbacks: {},
  },
}));

// Mock next-auth before imports
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock forensic utils before imports
jest.mock('../../lib/forensic-utils', () => ({
  createAuditEntry: jest.fn().mockResolvedValue({ id: 'audit-123' }),
  AUDIT_OPERATION_TYPES: {},
  RISK_LEVELS: {},
}));

// Mock db/prisma before imports
jest.mock('../../lib/db/prisma', () => ({
  prisma: {
    auditLog: {},
    user: {},
    payment: {},
  },
  default: {
    auditLog: {},
    user: {},
    payment: {},
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

// Import after mocks
const { getServerSession } = require('next-auth/next');

describe("Pi Payment API Endpoints", () => {
  let originalEnv;

  beforeEach(() => {
    // Store original env
    originalEnv = { ...process.env };

    // Mock authenticated session with payment permissions
    getServerSession.mockResolvedValue({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        role: 'admin', // Admin has all permissions including PAYMENT_APPROVE
      },
    });

    // Clear all mocks
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe("Payment Approval API - Sandbox Mode", () => {
    beforeEach(() => {
      // Set sandbox mode
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
      process.env.PI_SANDBOX_MODE = "true";
      process.env.NEXTAUTH_URL = "http://localhost:3000";
    });

    it("should approve payment in sandbox mode without calling Pi API", async () => {
      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // Should NOT call Pi API in sandbox mode
      expect(global.fetch).not.toHaveBeenCalled();

      // Should return success
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          approved: true,
          paymentId: "pi-payment-123",
          message: "Payment approved successfully",
        }),
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
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // Should call Pi Platform API once
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
        }),
      );

      // Should return success
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          approved: true,
          paymentId: "pi-payment-123",
          message: "Payment approved successfully",
        }),
      );
    });

    it("should return error when PI_API_KEY is not configured", async () => {
      // Remove API key
      delete process.env.PI_API_KEY;

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Server configuration error",
        }),
      );
    });

    it("should handle Pi API approval failure", async () => {
      // Mock Pi Platform API failure
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => "Invalid payment",
      });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to approve payment",
        }),
      );
    });

    it("should retry on 404 and succeed on second attempt", async () => {
      // Mock Pi Platform API - first 404, then success
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({
            error: "payment_not_found",
            error_message: "No payment found with this identifier",
          }),
        })
        .mockResolvedValueOnce({
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
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // Should have retried - 2 total calls
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Should return success after retry
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          approved: true,
          paymentId: "pi-payment-123",
          message: "Payment approved successfully",
        }),
      );
    });

    it("should retry on 404 three times and fail if all attempts fail", async () => {
      // Mock Pi Platform API - all 404s
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({
            error: "payment_not_found",
            error_message: "No payment found with this identifier",
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({
            error: "payment_not_found",
            error_message: "No payment found with this identifier",
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({
            error: "payment_not_found",
            error_message: "No payment found with this identifier",
          }),
        });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // Should have tried 3 times
      expect(global.fetch).toHaveBeenCalledTimes(3);

      // Should return 404 error after all retries
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to approve payment",
          message: "Payment not found. Please try again later.",
        }),
      );
    });

    it("should not retry on non-404 errors", async () => {
      // Mock Pi Platform API - 500 error
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Internal server error",
      });

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
        },
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // Should NOT retry on 500 - only 1 call
      expect(global.fetch).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to approve payment",
        }),
      );
    });

    it("should validate required payment ID", async () => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "false";
      process.env.PI_SANDBOX_MODE = "false";
      process.env.PI_API_KEY = "test-key";
      process.env.NODE_ENV = "development"; // For more error details

      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {},
        headers: {
          origin: 'http://localhost:3000',
        },
        url: '/api/payments/approve',
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(function(code) {
          console.log('res.status called with:', code, 'returning:', this === res);
          return this;
        }),
        json: jest.fn(function(data) {
          console.log('res.json called with:', data);
          return this;
        }),
        end: jest.fn(),
      };

      await handler(req, res);

      // Debug: Log what was actually called
      console.log('res.json call count:', res.json.mock.calls.length);
      console.log('res.status call count:', res.status.mock.calls.length);
      for (let i = 0; i < res.json.mock.calls.length; i++) {
        console.log(`res.json call #${i+1}:`, JSON.stringify(res.json.mock.calls[i][0], null, 2));
      }
      for (let i = 0; i < res.status.mock.calls.length; i++) {
        console.log(`res.status call #${i+1}:`, res.status.mock.calls[i][0]);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Validation failed",
        }),
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
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
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
        }),
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
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
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
        }),
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
        }),
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
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Server configuration error",
        }),
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
        headers: {},
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Failed to complete payment with Pi Network",
        }),
      );
    });

    it("should validate required parameters", async () => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "false";
      process.env.PI_SANDBOX_MODE = "false";
      process.env.PI_API_KEY = "test-key";

      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          // Missing txid
        },
        headers: {
          origin: 'http://localhost:3000',
        },
        url: '/api/payments/complete',
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Validation failed",
        }),
      );
    });
  });
});
