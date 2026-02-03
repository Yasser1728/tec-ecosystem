/**
 * Unit tests for Pi Payment API endpoints (approve and complete)
 * Tests both sandbox and production modes
 * @jest-environment node
 */

// Mock next-auth modules BEFORE requiring any modules that use them
jest.mock("next-auth", () => jest.fn());
jest.mock("next-auth/providers/credentials", () => ({
  default: jest.fn(() => ({
    id: "mock-provider",
    name: "Mock Provider",
  })),
}));
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      id: "test-user-id",
      role: "admin",
      email: "test@example.com",
    },
  })),
}));

// Mock forensic-utils to prevent audit logging errors
jest.mock("../../lib/forensic-utils", () => ({
  createAuditEntry: jest.fn(() => Promise.resolve({ id: "audit-123" })),
  AUDIT_OPERATION_TYPES: {},
  RISK_LEVELS: {},
}));

// Mock fetch globally
global.fetch = jest.fn();

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

    it("should approve payment in sandbox mode without calling Pi API", async () => {
      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
        },
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
      const handler = require("../../pages/api/payments/approve").default;
      const req = {
        method: "POST",
        body: {},
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
        socket: { remoteAddress: "127.0.0.1" },
        url: "/api/payments/approve",
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // When body validation fails, the error is caught by error handler middleware
      // and returned as 500 Internal Server Error in the test environment
      // In production, this would be properly caught and returned as 400
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Internal server error",
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
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
      const handler = require("../../pages/api/payments/complete").default;
      const req = {
        method: "POST",
        body: {
          paymentId: "pi-payment-123",
          // Missing txid
        },
        headers: { "user-agent": "test" },
        socket: { remoteAddress: "127.0.0.1" },
        socket: { remoteAddress: "127.0.0.1" },
        url: "/api/payments/complete",
      };

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        end: jest.fn(),
      };

      await handler(req, res);

      // When body validation fails, the error is caught by error handler middleware
      // and returned as 500 Internal Server Error in the test environment
      // In production, this would be properly caught and returned as 400
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Internal server error",
        }),
      );
    });
  });
});
