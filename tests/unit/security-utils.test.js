/**
 * Unit Tests for Security Utilities
 * Tests crypto, validation, and path security utilities
 */

describe("Crypto Utilities", () => {
  let cryptoUtils;

  beforeAll(async () => {
    cryptoUtils = await import("../../lib/utils/crypto.js");
  });

  describe("hash", () => {
    it("should generate consistent SHA-256 hashes", () => {
      const data = "test-data";
      const hash1 = cryptoUtils.hash(data);
      const hash2 = cryptoUtils.hash(data);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    it("should generate different hashes for different data", () => {
      const hash1 = cryptoUtils.hash("data1");
      const hash2 = cryptoUtils.hash("data2");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("generateSecureRandomBytes", () => {
    it("should generate buffer of specified length", () => {
      const bytes = cryptoUtils.generateSecureRandomBytes(16);

      expect(Buffer.isBuffer(bytes)).toBe(true);
      expect(bytes.length).toBe(16);
    });

    it("should generate different values each time", () => {
      const bytes1 = cryptoUtils.generateSecureRandomBytes(16);
      const bytes2 = cryptoUtils.generateSecureRandomBytes(16);

      expect(bytes1.equals(bytes2)).toBe(false);
    });

    it("should default to 32 bytes", () => {
      const bytes = cryptoUtils.generateSecureRandomBytes();

      expect(bytes.length).toBe(32);
    });
  });

  describe("generateSecureRandomString", () => {
    it("should generate hex string of specified length", () => {
      const str = cryptoUtils.generateSecureRandomString(32, "hex");

      expect(typeof str).toBe("string");
      expect(str.length).toBe(32);
      expect(/^[0-9a-f]+$/.test(str)).toBe(true);
    });

    it("should generate base64url string without padding", () => {
      const str = cryptoUtils.generateSecureRandomString(32, "base64url");

      expect(typeof str).toBe("string");
      expect(str.length).toBe(32);
      expect(/^[A-Za-z0-9_-]+$/.test(str)).toBe(true);
    });

    it("should generate different values each time", () => {
      const str1 = cryptoUtils.generateSecureRandomString(32);
      const str2 = cryptoUtils.generateSecureRandomString(32);

      expect(str1).not.toBe(str2);
    });
  });

  describe("generateSecureRandomInt", () => {
    it("should generate integer within specified range", () => {
      const min = 10;
      const max = 100;

      for (let i = 0; i < 100; i++) {
        const num = cryptoUtils.generateSecureRandomInt(min, max);

        expect(num).toBeGreaterThanOrEqual(min);
        expect(num).toBeLessThan(max);
        expect(Number.isInteger(num)).toBe(true);
      }
    });
  });

  describe("generateSecureToken", () => {
    it("should generate hex token of correct length", () => {
      const token = cryptoUtils.generateSecureToken(32);

      expect(typeof token).toBe("string");
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });

    it("should generate different tokens each time", () => {
      const token1 = cryptoUtils.generateSecureToken();
      const token2 = cryptoUtils.generateSecureToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe("generateSecureUUID", () => {
    it("should generate valid UUID v4 format", () => {
      const uuid = cryptoUtils.generateSecureUUID();

      expect(typeof uuid).toBe("string");
      expect(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          uuid,
        ),
      ).toBe(true);
    });

    it("should generate different UUIDs each time", () => {
      const uuid1 = cryptoUtils.generateSecureUUID();
      const uuid2 = cryptoUtils.generateSecureUUID();

      expect(uuid1).not.toBe(uuid2);
    });
  });
});

describe("Validation Utilities", () => {
  let validationUtils;

  beforeAll(async () => {
    validationUtils = await import("../../lib/utils/validation.js");
  });

  describe("isValidAmount", () => {
    it("should return true for positive numbers", () => {
      expect(validationUtils.isValidAmount(100)).toBe(true);
      expect(validationUtils.isValidAmount(0.01)).toBe(true);
    });

    it("should return false for non-positive numbers", () => {
      expect(validationUtils.isValidAmount(0)).toBe(false);
      expect(validationUtils.isValidAmount(-10)).toBe(false);
    });

    it("should return false for non-numbers", () => {
      expect(validationUtils.isValidAmount("100")).toBe(false);
      expect(validationUtils.isValidAmount(null)).toBe(false);
      expect(validationUtils.isValidAmount(undefined)).toBe(false);
    });
  });

  describe("escapeRegExp", () => {
    it("should escape special regex characters", () => {
      const result = validationUtils.escapeRegExp("test.*+?^${}()|[]\\");

      expect(result).toBe("test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
    });

    it("should return empty string for non-strings", () => {
      expect(validationUtils.escapeRegExp(null)).toBe("");
      expect(validationUtils.escapeRegExp(123)).toBe("");
    });
  });

  describe("createSafeRegExp", () => {
    it("should create regex that matches literal special characters", () => {
      const regex = validationUtils.createSafeRegExp("test.*");
      const testStr = "test.*";

      expect(regex.test(testStr)).toBe(true);
      expect(regex.test("test123")).toBe(false);
    });

    it("should support regex flags", () => {
      const regex = validationUtils.createSafeRegExp("TEST", "i");

      expect(regex.test("test")).toBe(true);
    });
  });

  describe("sanitizeString", () => {
    it("should remove null bytes", () => {
      const result = validationUtils.sanitizeString("test\x00data");

      expect(result).toBe("testdata");
    });

    it("should remove control characters except newline, tab, CR", () => {
      const result = validationUtils.sanitizeString("test\x01\x02\x03data");

      expect(result).toBe("testdata");
    });

    it("should truncate to max length", () => {
      const result = validationUtils.sanitizeString("abcdef", 3);

      expect(result).toBe("abc");
    });

    it("should return empty string for non-strings", () => {
      expect(validationUtils.sanitizeString(null)).toBe("");
      expect(validationUtils.sanitizeString(123)).toBe("");
    });
  });

  describe("isPrototypeSafeKey", () => {
    it("should return false for dangerous prototype keys", () => {
      expect(validationUtils.isPrototypeSafeKey("__proto__")).toBe(false);
      expect(validationUtils.isPrototypeSafeKey("constructor")).toBe(false);
      expect(validationUtils.isPrototypeSafeKey("prototype")).toBe(false);
    });

    it("should return true for safe keys", () => {
      expect(validationUtils.isPrototypeSafeKey("name")).toBe(true);
      expect(validationUtils.isPrototypeSafeKey("value")).toBe(true);
      expect(validationUtils.isPrototypeSafeKey("id")).toBe(true);
    });

    it("should return false for non-strings", () => {
      expect(validationUtils.isPrototypeSafeKey(null)).toBe(false);
      expect(validationUtils.isPrototypeSafeKey(123)).toBe(false);
    });
  });

  describe("safeAssign", () => {
    it("should assign safe keys", () => {
      const obj = {};
      const result = validationUtils.safeAssign(obj, "name", "value");

      expect(result).toBe(true);
      expect(obj.name).toBe("value");
    });

    it("should block dangerous keys", () => {
      const obj = {};
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = validationUtils.safeAssign(obj, "__proto__", "malicious");

      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe("createNullPrototypeObject", () => {
    it("should create object with no prototype", () => {
      const obj = validationUtils.createNullPrototypeObject();

      expect(Object.getPrototypeOf(obj)).toBe(null);
      expect(obj.hasOwnProperty).toBe(undefined);
    });

    it("should copy initial values excluding dangerous keys", () => {
      const obj = validationUtils.createNullPrototypeObject({
        name: "test",
        __proto__: "malicious",
      });

      expect(obj.name).toBe("test");
      expect(obj.__proto__).toBe(undefined);
    });
  });
});

describe("Path Security Utilities", () => {
  let pathSecurityUtils;

  beforeAll(async () => {
    pathSecurityUtils = await import("../../lib/utils/path-security.js");
  });

  describe("validatePath", () => {
    it("should allow paths within base directory", () => {
      const result = pathSecurityUtils.validatePath(
        "/app/uploads",
        "file.txt",
      );

      expect(result.valid).toBe(true);
      expect(result.safePath).toBe("/app/uploads/file.txt");
    });

    it("should block path traversal attempts", () => {
      const result = pathSecurityUtils.validatePath(
        "/app/uploads",
        "../../../etc/passwd",
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("traversal");
    });

    it("should require absolute base path", () => {
      const result = pathSecurityUtils.validatePath("uploads", "file.txt");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("absolute");
    });

    it("should reject empty inputs", () => {
      expect(pathSecurityUtils.validatePath("", "file.txt").valid).toBe(false);
      expect(pathSecurityUtils.validatePath("/app", "").valid).toBe(false);
    });
  });

  describe("sanitizeFilename", () => {
    it("should remove directory components", () => {
      const result = pathSecurityUtils.sanitizeFilename("../../../etc/passwd");

      expect(result).toBe("passwd");
    });

    it("should remove dangerous characters", () => {
      const result = pathSecurityUtils.sanitizeFilename("file<>:\"|?*.txt");

      // Each dangerous character is replaced with underscore
      expect(result).toBe("file_______.txt");
    });

    it("should handle hidden files", () => {
      const result = pathSecurityUtils.sanitizeFilename(".htaccess");

      expect(result).toBe("_htaccess");
    });

    it("should remove null bytes", () => {
      const result = pathSecurityUtils.sanitizeFilename("file\x00.txt");

      expect(result).toBe("file.txt");
    });

    it("should return empty string for invalid input", () => {
      expect(pathSecurityUtils.sanitizeFilename("")).toBe("");
      expect(pathSecurityUtils.sanitizeFilename(null)).toBe("");
      expect(pathSecurityUtils.sanitizeFilename(undefined)).toBe("");
    });
  });

  describe("createSafePath", () => {
    it("should combine sanitized filename with base path", () => {
      const result = pathSecurityUtils.createSafePath(
        "/app/uploads",
        "user-file.txt",
      );

      expect(result.valid).toBe(true);
      expect(result.safePath).toBe("/app/uploads/user-file.txt");
    });

    it("should sanitize and block traversal attempts", () => {
      const result = pathSecurityUtils.createSafePath(
        "/app/uploads",
        "../secret.txt",
      );

      expect(result.valid).toBe(true);
      // The sanitizeFilename removes the ../ part, leaving just the filename
      expect(result.safePath).toBe("/app/uploads/secret.txt");
    });
  });

  describe("containsPathTraversal", () => {
    it("should detect ../ patterns", () => {
      expect(pathSecurityUtils.containsPathTraversal("../etc/passwd")).toBe(
        true,
      );
      expect(pathSecurityUtils.containsPathTraversal("../../secret")).toBe(
        true,
      );
    });

    it("should detect URL-encoded traversal", () => {
      expect(pathSecurityUtils.containsPathTraversal("..%2fetc")).toBe(true);
      expect(pathSecurityUtils.containsPathTraversal("%2e%2e%2fetc")).toBe(
        true,
      );
    });

    it("should return false for safe paths", () => {
      expect(pathSecurityUtils.containsPathTraversal("file.txt")).toBe(false);
      expect(pathSecurityUtils.containsPathTraversal("subdir/file.txt")).toBe(
        false,
      );
    });
  });
});
