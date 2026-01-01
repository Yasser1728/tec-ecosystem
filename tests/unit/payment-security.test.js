/**
 * Unit tests for Payment Security - SSRF Prevention
 * Tests the /api/payments/approve, /api/payments/complete, and /api/payments/incomplete endpoints
 */

import approveHandler from "../../pages/api/payments/approve";
import completeHandler from "../../pages/api/payments/complete";
import incompleteHandler from "../../pages/api/payments/incomplete";

describe("Payment Security - SSRF Prevention", () => {
  let mockReq;
  let mockRes;
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    mockReq = {
      method: "POST",
      body: {},
    };

    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(() => mockRes),
    };

    // Default to sandbox mode
    process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    delete process.env.PI_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore original environment
    process.env = originalEnv;
  });

  describe("Approve Endpoint - Input Validation", () => {
    it("should reject non-POST requests", async () => {
      mockReq.method = "GET";
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(405);
    });

    it("should reject missing paymentId", async () => {
      mockReq.body = {};
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Missing payment identifier",
      });
    });

    it("should reject invalid paymentId - path traversal", async () => {
      mockReq.body = { paymentId: "../../../etc/passwd" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid payment identifier format",
      });
    });

    it("should reject invalid paymentId - URL injection", async () => {
      mockReq.body = { paymentId: "http://evil.com/malicious" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid paymentId - special characters", async () => {
      mockReq.body = { paymentId: "payment@domain.com" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid paymentId - too long", async () => {
      mockReq.body = { paymentId: "a".repeat(101) };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should accept valid paymentId", async () => {
      mockReq.body = { paymentId: "valid_payment_123-abc" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Approve Endpoint - Sandbox Mode", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    });

    it("should return success in sandbox mode without external API calls", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Payment approved (sandbox mode)",
        }),
      );
    });

    it("should include payment details in sandbox response", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123", internalId: "internal_1" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          payment: expect.objectContaining({
            id: "internal_1",
            piPaymentId: "sandbox_payment_123",
            status: "APPROVED",
          }),
        }),
      );
    });
  });

  describe("Complete Endpoint - Input Validation", () => {
    it("should reject non-POST requests", async () => {
      mockReq.method = "GET";
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(405);
    });

    it("should reject missing paymentId", async () => {
      mockReq.body = { txid: "valid_txid" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should reject missing txid", async () => {
      mockReq.body = { paymentId: "valid_payment" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid paymentId - SSRF attempt", async () => {
      mockReq.body = { paymentId: "../../admin", txid: "valid_txid" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid txid format", async () => {
      mockReq.body = { paymentId: "valid_payment", txid: "invalid@txid" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should accept valid paymentId and txid", async () => {
      mockReq.body = { paymentId: "valid_payment_123", txid: "valid_txid_456" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Complete Endpoint - Sandbox Mode", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    });

    it("should return success in sandbox mode without external API calls", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123", txid: "sandbox_txid_456" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Payment completed (sandbox mode)",
        }),
      );
    });

    it("should include txid in sandbox response", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123", txid: "sandbox_txid_456" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          payment: expect.objectContaining({
            txid: "sandbox_txid_456",
            status: "COMPLETED",
            verified: true,
          }),
        }),
      );
    });
  });

  describe("Incomplete Endpoint - Input Validation", () => {
    it("should reject non-POST requests", async () => {
      mockReq.method = "GET";
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(405);
    });

    it("should reject missing paymentId", async () => {
      mockReq.body = {};
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Missing payment identifier",
      });
    });

    it("should reject invalid paymentId - path traversal", async () => {
      mockReq.body = { paymentId: "../../../etc/passwd" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid txid when provided", async () => {
      mockReq.body = { paymentId: "valid_payment", txid: "invalid@txid" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid transaction ID format",
      });
    });

    it("should accept valid paymentId without txid", async () => {
      mockReq.body = { paymentId: "valid_payment_123" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should accept valid paymentId with valid txid", async () => {
      mockReq.body = { paymentId: "valid_payment_123", txid: "valid_txid_456" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Incomplete Endpoint - Sandbox Mode", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    });

    it("should return PENDING status when no txid provided", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            status: "PENDING",
          }),
        }),
      );
    });

    it("should return COMPLETED status when txid provided", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123", txid: "sandbox_txid_456" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          payment: expect.objectContaining({
            status: "COMPLETED",
          }),
        }),
      );
    });

    it("should include syncedAt timestamp", async () => {
      mockReq.body = { paymentId: "sandbox_payment_123" };
      await incompleteHandler(mockReq, mockRes);
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

    it("approve should return success when no API key configured", async () => {
      mockReq.body = { paymentId: "payment_123" };
      await approveHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Payment approved (no API key configured)",
        }),
      );
    });

    it("complete should return success when no API key configured", async () => {
      mockReq.body = { paymentId: "payment_123", txid: "txid_456" };
      await completeHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Payment completed (no API key configured)",
        }),
      );
    });

    it("incomplete should return success when no API key configured", async () => {
      mockReq.body = { paymentId: "payment_123" };
      await incompleteHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Incomplete payment acknowledged (no API key configured)",
        }),
      );
    });
  });
});
