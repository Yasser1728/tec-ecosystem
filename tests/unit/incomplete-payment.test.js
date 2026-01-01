/**
 * Unit tests for Incomplete Payment Handler
 * Tests the /api/payments/incomplete endpoint for security and functionality
 */

import handler from "../../pages/api/payments/incomplete";

describe("Incomplete Payment Handler", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      method: "POST",
      body: {},
    };

    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(() => mockRes),
    };

    // Reset environment variables
    process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    delete process.env.PI_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("HTTP Method Validation", () => {
    it("should reject non-POST requests", async () => {
      mockReq.method = "GET";

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Method not allowed",
      });
    });

    it("should accept POST requests", async () => {
      mockReq.body = { paymentId: "valid_payment_123" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Input Validation", () => {
    it("should reject missing paymentId", async () => {
      mockReq.body = {};

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Missing payment identifier",
      });
    });

    it("should reject invalid paymentId format - URL injection attempt", async () => {
      mockReq.body = { paymentId: "../../../etc/passwd" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid payment identifier format",
      });
    });

    it("should reject invalid paymentId format - special characters", async () => {
      mockReq.body = { paymentId: "payment@domain.com" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid payment identifier format",
      });
    });

    it("should reject invalid paymentId format - too long", async () => {
      mockReq.body = { paymentId: "a".repeat(101) };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid payment identifier format",
      });
    });

    it("should accept valid paymentId format with alphanumeric", async () => {
      mockReq.body = { paymentId: "payment123ABC" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should accept valid paymentId format with underscores", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should accept valid paymentId format with hyphens", async () => {
      mockReq.body = { paymentId: "payment-123-abc" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should reject invalid txid format", async () => {
      mockReq.body = { paymentId: "valid_payment", txid: "invalid@txid" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid transaction ID format",
      });
    });
  });

  describe("Sandbox Mode Behavior", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    });

    it("should return success in sandbox mode without external API calls", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Incomplete payment acknowledged (sandbox mode)",
          payment: expect.objectContaining({
            piPaymentId: "sandbox_payment_123",
            status: "PENDING",
          }),
        }),
      );
    });

    it("should set status to COMPLETED when txid is provided", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123", txid: "sandbox_txid_456" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            piPaymentId: "sandbox_payment_123",
            txid: "sandbox_txid_456",
            status: "COMPLETED",
          }),
        }),
      );
    });

    it("should include syncedAt timestamp", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123" };

      await handler(mockReq, mockRes);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.payment.syncedAt).toBeDefined();
      expect(new Date(responseData.payment.syncedAt)).toBeInstanceOf(Date);
    });
  });

  describe("No API Key Mode", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "false";
      delete process.env.PI_API_KEY;
    });

    it("should return success when no API key is configured", async () => {
      mockReq.body = { paymentId: "payment_123" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Incomplete payment acknowledged (no API key configured)",
        }),
      );
    });
  });

  describe("SSRF Prevention", () => {
    it("should not allow path traversal in paymentId", async () => {
      mockReq.body = { paymentId: "../../admin" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should not allow URL-like strings in paymentId", async () => {
      mockReq.body = { paymentId: "http://evil.com" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should not allow spaces in paymentId", async () => {
      mockReq.body = { paymentId: "payment 123" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should not allow newlines in paymentId", async () => {
      mockReq.body = { paymentId: "payment\n123" };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
