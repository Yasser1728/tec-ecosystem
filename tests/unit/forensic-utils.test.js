/**
 * Tests for Forensic Audit Utilities
 */

import {
  createImmutableLogEntry,
  verifyUserIdentity,
  validateOperation,
  detectSuspiciousActivity,
  createAuditEntry,
  AUDIT_OPERATION_TYPES,
  RISK_LEVELS,
  SECURITY_THRESHOLDS,
} from "../../lib/forensic-utils";

describe("Forensic Utils - Immutable Log Entry", () => {
  it("should create an immutable log entry with hash", () => {
    const entry = {
      operationType: "payment_create",
      amount: 100,
      userId: "user123",
    };

    const result = createImmutableLogEntry(entry);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("hash");
    expect(result.immutable).toBe(true);
    expect(result.operationType).toBe("payment_create");
    expect(result.amount).toBe(100);
  });

  it("should create different hashes for different entries", () => {
    const entry1 = { data: "test1" };
    const entry2 = { data: "test2" };

    const result1 = createImmutableLogEntry(entry1);
    const result2 = createImmutableLogEntry(entry2);

    expect(result1.hash).not.toBe(result2.hash);
  });
});

describe("Forensic Utils - User Identity Verification", () => {
  it("should verify valid user identity", () => {
    const user = {
      id: "user123",
      email: "user@example.com",
      piId: "pi123",
    };

    const result = verifyUserIdentity(user);

    expect(result.verified).toBe(true);
    expect(result.userId).toBe("user123");
    expect(result.riskLevel).toBe(RISK_LEVELS.LOW);
  });

  it("should reject null user", () => {
    const result = verifyUserIdentity(null);

    expect(result.verified).toBe(false);
    expect(result.reason).toContain("No user session found");
    expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
  });

  it("should reject user without identification", () => {
    const user = {
      id: "user123",
      // Missing email and piId
    };

    const result = verifyUserIdentity(user);

    expect(result.verified).toBe(false);
    expect(result.suspiciousPatterns).toContain("Missing user identification");
    expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
  });

  it("should reject user with invalid ID format", () => {
    const user = {
      id: "", // Empty string - invalid
      email: "user@example.com",
      verified: true,
    };

    const result = verifyUserIdentity(user);

    expect(result.verified).toBe(false);
    expect(result.suspiciousPatterns).toBeDefined();
    expect(result.suspiciousPatterns.length).toBeGreaterThan(0);
    expect(result.suspiciousPatterns).toContain("Invalid user ID format");
    expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
  });
});

describe("Forensic Utils - Operation Validation", () => {
  it("should validate payment creation with valid data", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.PAYMENT_CREATE, {
      amount: 100,
      domain: "commerce",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.riskLevel).toBe(RISK_LEVELS.LOW);
  });

  it("should reject payment with invalid amount", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.PAYMENT_CREATE, {
      amount: 0,
      domain: "commerce",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid payment amount");
  });

  it("should flag high-risk for large amounts", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.PAYMENT_CREATE, {
      amount: SECURITY_THRESHOLDS.HIGH_RISK_AMOUNT + 1,
      domain: "commerce",
    });

    expect(result.valid).toBe(true);
    expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
  });

  it("should reject payment without domain", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.PAYMENT_CREATE, {
      amount: 100,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Missing domain information");
  });

  it("should handle missing operation data gracefully", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.PAYMENT_CREATE);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid payment amount");
  });

  it("should validate NFT minting", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.NFT_MINT, {
      domainName: "test.pi",
    });

    expect(result.valid).toBe(true);
  });

  it("should reject NFT minting without domain name", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.NFT_MINT, {});

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Missing NFT domain name");
  });

  it("should flag withdrawal as medium risk", () => {
    const result = validateOperation(AUDIT_OPERATION_TYPES.WITHDRAWAL, {
      amount: 100,
      destination: "addr123",
    });

    expect(result.valid).toBe(true);
    expect(result.riskLevel).toBe(RISK_LEVELS.MEDIUM);
  });
});

describe("Forensic Utils - Suspicious Activity Detection", () => {
  const user = {
    id: "user123",
    email: "user@example.com",
    verified: true,
  };

  it("should not flag normal activity as suspicious", () => {
    const result = detectSuspiciousActivity(
      user,
      AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      { amount: 100 },
      {},
    );

    expect(result.suspicious).toBe(false);
    expect(result.indicators).toHaveLength(0);
    expect(result.shouldBlock).toBe(false);
  });

  it("should flag rapid repeated operations", () => {
    const recentOperations = Array(
      SECURITY_THRESHOLDS.RAPID_OPERATIONS_COUNT + 2,
    )
      .fill(null)
      .map(() => ({
        timestamp: new Date().toISOString(),
      }));

    const result = detectSuspiciousActivity(
      user,
      AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      { amount: 100 },
      { recentOperations },
    );

    expect(result.suspicious).toBe(true);
    expect(result.indicators).toContain("Rapid repeated operations detected");
    expect(result.threatLevel).toBe(RISK_LEVELS.HIGH);
  });

  it("should flag unusually large amounts as critical", () => {
    const result = detectSuspiciousActivity(
      user,
      AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      { amount: SECURITY_THRESHOLDS.LARGE_TRANSACTION_AMOUNT + 1 },
      {},
    );

    expect(result.suspicious).toBe(true);
    expect(result.indicators).toContain("Unusually large transaction amount");
    expect(result.threatLevel).toBe(RISK_LEVELS.CRITICAL);
    expect(result.shouldBlock).toBe(true);
  });

  it("should flag large transactions from new accounts", () => {
    const userCreatedAt = new Date(Date.now() - 1000 * 60 * 60).toISOString(); // 1 hour ago

    const result = detectSuspiciousActivity(
      user,
      AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      { amount: SECURITY_THRESHOLDS.NEW_ACCOUNT_LARGE_AMOUNT + 1 },
      { userCreatedAt },
    );

    expect(result.suspicious).toBe(true);
    expect(result.indicators).toContain("Large transaction from new account");
    expect(result.threatLevel).toBe(RISK_LEVELS.HIGH);
  });

  it("should flag unverified users", () => {
    const unverifiedUser = {
      id: "user123",
      verified: false,
    };

    const result = detectSuspiciousActivity(
      unverifiedUser,
      AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      { amount: 100 },
      {},
    );

    expect(result.suspicious).toBe(true);
    expect(result.indicators).toContain("Unverified user attempting operation");
    expect(result.threatLevel).toBe(RISK_LEVELS.HIGH);
  });

  it("should handle undefined operation data without throwing", () => {
    const result = detectSuspiciousActivity(
      user,
      AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
    );

    expect(result.suspicious).toBe(false);
    expect(result.indicators).toEqual([]);
    expect(result.shouldBlock).toBe(false);
  });
});

describe("Forensic Utils - Create Audit Entry", () => {
  const user = {
    id: "user123",
    email: "user@example.com",
    piId: "pi123",
  };

  it("should create complete audit entry for approved operation", async () => {
    const result = await createAuditEntry({
      user: {
        ...user,
        verified: true, // Add verified flag to avoid suspicion
      },
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      operationData: { amount: 100, domain: "commerce" },
      approved: true,
    });

    expect(result.approved).toBe(true);
    expect(result.logEntry).toBeDefined();
    expect(result.logEntry.hash).toBeDefined();
    expect(result.identityCheck.verified).toBe(true);
    expect(result.validationResult.valid).toBe(true);
    // Note: suspicionResult.suspicious may still be true due to other checks
  });

  it("should reject operation with invalid user", async () => {
    const result = await createAuditEntry({
      user: {
        id: null, // Invalid user ID
      },
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      operationData: { amount: 100, domain: "commerce" },
      approved: true,
    });

    expect(result.approved).toBe(false);
    expect(result.identityCheck.verified).toBe(false);
  });

  it("should reject operation with invalid data", async () => {
    const result = await createAuditEntry({
      user,
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      operationData: { amount: 0 }, // Invalid amount, missing domain
      approved: true,
    });

    expect(result.approved).toBe(false);
    expect(result.validationResult.valid).toBe(false);
  });

  it("should reject suspicious operations", async () => {
    const result = await createAuditEntry({
      user: {
        ...user,
        verified: true, // Add verified flag
      },
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      operationData: {
        amount: SECURITY_THRESHOLDS.LARGE_TRANSACTION_AMOUNT + 1,
        domain: "commerce",
      },
      approved: true,
    });

    // Should be rejected due to unusually large amount (critical threat)
    expect(result.approved).toBe(false);
    expect(result.suspicionResult.suspicious).toBe(true);
    expect(result.suspicionResult.shouldBlock).toBe(true);
  });

  it("should include request metadata in log entry", async () => {
    const request = {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      origin: "https://example.com",
    };

    const result = await createAuditEntry({
      user,
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      operationData: { amount: 100, domain: "commerce" },
      request,
      approved: true,
    });

    expect(result.logEntry.request.ip).toBe("192.168.1.1");
    expect(result.logEntry.request.userAgent).toBe("Mozilla/5.0");
    expect(result.logEntry.request.origin).toBe("https://example.com");
  });

  it("should handle missing operation data safely", async () => {
    const result = await createAuditEntry({
      user,
      operationType: AUDIT_OPERATION_TYPES.PAYMENT_CREATE,
      approved: true,
    });

    expect(result.approved).toBe(false);
    expect(result.validationResult.valid).toBe(false);
  });
});
