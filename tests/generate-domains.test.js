const fs = require("fs");
const path = require("path");
const { sanitizeName, safeResolveFile } = require("../lib/safe-paths");

describe("safe-paths security module", () => {
  describe("sanitizeName", () => {
    test("should accept valid alphanumeric names", () => {
      expect(sanitizeName("fundx")).toBe("fundx");
      expect(sanitizeName("assets")).toBe("assets");
      expect(sanitizeName("commerce")).toBe("commerce");
      expect(sanitizeName("nbf")).toBe("nbf");
    });

    test("should accept names with hyphens", () => {
      expect(sanitizeName("my-domain")).toBe("my-domain");
      expect(sanitizeName("test-app-123")).toBe("test-app-123");
    });

    test("should accept uppercase letters", () => {
      expect(sanitizeName("FundX")).toBe("FundX");
      expect(sanitizeName("ASSETS")).toBe("ASSETS");
      expect(sanitizeName("MyDomain")).toBe("MyDomain");
    });

    test("should accept names up to 63 characters", () => {
      const longName = "a".repeat(63);
      expect(sanitizeName(longName)).toBe(longName);
    });

    test("should reject names with path traversal attempts using ../", () => {
      expect(() => sanitizeName("../etc")).toThrow("Invalid name");
      expect(() => sanitizeName("../../passwords")).toThrow("Invalid name");
      expect(() => sanitizeName("folder/../etc")).toThrow("Invalid name");
    });

    test("should reject names with Windows path traversal attempts", () => {
      expect(() => sanitizeName("..\\..\\windows")).toThrow("Invalid name");
      expect(() => sanitizeName("..\\system32")).toThrow("Invalid name");
    });

    test("should reject names with special characters", () => {
      expect(() => sanitizeName("folder/file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder\\file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder:file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder*file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder?file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder<file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder>file")).toThrow("Invalid name");
      expect(() => sanitizeName("folder|file")).toThrow("Invalid name");
    });

    test("should reject empty names", () => {
      expect(() => sanitizeName("")).toThrow("Invalid name");
    });

    test("should reject names longer than 63 characters", () => {
      const tooLong = "a".repeat(64);
      expect(() => sanitizeName(tooLong)).toThrow("Invalid name");
    });

    test("should reject names with spaces", () => {
      expect(() => sanitizeName("my domain")).toThrow("Invalid name");
      expect(() => sanitizeName("folder name")).toThrow("Invalid name");
    });

    test("should reject names with dots", () => {
      expect(() => sanitizeName("..")).toThrow("Invalid name");
      expect(() => sanitizeName(".")).toThrow("Invalid name");
      expect(() => sanitizeName("folder.name")).toThrow("Invalid name");
    });
  });

  describe("safeResolveFile", () => {
    const testBaseDir = path.resolve(__dirname, "..", "test-apps");

    beforeAll(() => {
      // Create test directory
      if (!fs.existsSync(testBaseDir)) {
        fs.mkdirSync(testBaseDir, { recursive: true });
      }
    });

    afterAll(() => {
      // Clean up test directory
      if (fs.existsSync(testBaseDir)) {
        fs.rmSync(testBaseDir, { recursive: true, force: true });
      }
    });

    test("should resolve valid relative paths within base directory", () => {
      const resolved = safeResolveFile(testBaseDir, "fundx");
      expect(resolved).toBe(path.resolve(testBaseDir, "fundx"));
    });

    test("should resolve nested paths within base directory", () => {
      const resolved = safeResolveFile(testBaseDir, "fundx/assets");
      expect(resolved).toBe(path.resolve(testBaseDir, "fundx", "assets"));
    });

    test("should reject path traversal with ../", () => {
      expect(() => safeResolveFile(testBaseDir, "../etc")).toThrow(
        "Sovereign Security: Path traversal detected!",
      );
    });

    test("should reject path traversal with ../../", () => {
      expect(() => safeResolveFile(testBaseDir, "../../passwords")).toThrow(
        "Sovereign Security: Path traversal detected!",
      );
    });

    test("should reject Windows-style path traversal", () => {
      expect(() => safeResolveFile(testBaseDir, "..\\..\\windows")).toThrow(
        "Sovereign Security: Path traversal detected!",
      );
    });

    test("should reject mixed path traversal attempts", () => {
      expect(() => safeResolveFile(testBaseDir, "valid/../../../etc")).toThrow(
        "Sovereign Security: Path traversal detected!",
      );
    });

    test("should reject absolute paths outside base directory", () => {
      expect(() => safeResolveFile(testBaseDir, "/etc/passwd")).toThrow(
        "Sovereign Security: Path traversal detected!",
      );
    });

    test("should allow base directory itself", () => {
      const resolved = safeResolveFile(testBaseDir, ".");
      expect(resolved).toBe(testBaseDir);
    });
  });
});

describe("generate-domains integration", () => {
  const { generateDomains } = require("../scripts/generate-domains");
  const appsDir = path.resolve(__dirname, "..", "apps");

  beforeAll(() => {
    // Clean up any existing apps directory from tests
    if (fs.existsSync(appsDir)) {
      fs.rmSync(appsDir, { recursive: true, force: true });
    }
  });

  test("should create apps directory and domain folders", () => {
    // Mock console to suppress output during test
    const originalLog = console.log;
    const originalError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();

    // Mock process.exit to prevent actual exit
    const originalExit = process.exit;
    process.exit = jest.fn();

    try {
      generateDomains();

      // Verify apps directory was created
      expect(fs.existsSync(appsDir)).toBe(true);

      // Verify at least some domain folders were created
      const domains = fs.readdirSync(appsDir);
      expect(domains.length).toBeGreaterThan(0);

      // Verify specific domains exist
      expect(fs.existsSync(path.join(appsDir, "fundx"))).toBe(true);
      expect(fs.existsSync(path.join(appsDir, "assets"))).toBe(true);
      expect(fs.existsSync(path.join(appsDir, "commerce"))).toBe(true);

      // Verify exit was called with success
      expect(process.exit).toHaveBeenCalledWith(0);
    } finally {
      // Restore console and process.exit
      console.log = originalLog;
      console.error = originalError;
      process.exit = originalExit;

      // Clean up
      if (fs.existsSync(appsDir)) {
        fs.rmSync(appsDir, { recursive: true, force: true });
      }
    }
  });
});
