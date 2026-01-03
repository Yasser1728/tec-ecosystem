/**
 * Tests for Path Security Utilities
 */

import {
  isValidPathComponent,
  sanitizePathComponent,
  securePathJoin,
  securePathResolve,
  isValidFilename,
} from "../../lib/utils/path-security";

describe("Path Security - isValidPathComponent", () => {
  it("should accept valid path components", () => {
    expect(isValidPathComponent("file.txt")).toBe(true);
    expect(isValidPathComponent("documents")).toBe(true);
    expect(isValidPathComponent("my-folder")).toBe(true);
    expect(isValidPathComponent("file_name")).toBe(true);
  });

  it("should reject path traversal sequences", () => {
    expect(isValidPathComponent("..")).toBe(false);
    expect(isValidPathComponent("../parent")).toBe(false);
    expect(isValidPathComponent("./current")).toBe(false);
    expect(isValidPathComponent("folder/../secret")).toBe(false);
    expect(isValidPathComponent("folder/..")).toBe(false);
    expect(isValidPathComponent("folder\\..")).toBe(false);
    expect(isValidPathComponent(".\\current")).toBe(false);
  });

  it("should reject absolute paths", () => {
    expect(isValidPathComponent("/absolute/path")).toBe(false);
    expect(isValidPathComponent("/etc/passwd")).toBe(false);
  });

  it("should reject null bytes", () => {
    expect(isValidPathComponent("file\0.txt")).toBe(false);
    expect(isValidPathComponent("path\0traversal")).toBe(false);
  });

  it("should reject non-string inputs", () => {
    expect(isValidPathComponent(null)).toBe(false);
    expect(isValidPathComponent(undefined)).toBe(false);
    expect(isValidPathComponent(123)).toBe(false);
    expect(isValidPathComponent({})).toBe(false);
  });

  it("should reject empty strings", () => {
    expect(isValidPathComponent("")).toBe(false);
  });
});

describe("Path Security - sanitizePathComponent", () => {
  it("should remove path traversal sequences", () => {
    expect(sanitizePathComponent("../test")).toBe("test");
    expect(sanitizePathComponent("..\\test")).toBe("test");
    expect(sanitizePathComponent("folder/../file")).toBe("folder/file");
    expect(sanitizePathComponent("..")).toBe("");
  });

  it("should handle nested/repeated traversal sequences", () => {
    expect(sanitizePathComponent("....")).toBe("");
    expect(sanitizePathComponent("....//test")).toBe("test");
    expect(sanitizePathComponent("..\\..\\test")).toBe("test");
    expect(sanitizePathComponent("folder/....//file")).toBe("folder/file");
  });

  it("should remove null bytes", () => {
    expect(sanitizePathComponent("file\0.txt")).toBe("file.txt");
    expect(sanitizePathComponent("test\0\0file")).toBe("testfile");
  });

  it("should remove leading/trailing slashes", () => {
    expect(sanitizePathComponent("/folder/")).toBe("folder");
    expect(sanitizePathComponent("\\folder\\")).toBe("folder");
  });

  it("should return empty string for non-string inputs", () => {
    expect(sanitizePathComponent(null)).toBe("");
    expect(sanitizePathComponent(undefined)).toBe("");
    expect(sanitizePathComponent(123)).toBe("");
  });
});

describe("Path Security - securePathJoin", () => {
  const baseDir = "/home/user/uploads";

  it("should join valid paths correctly", () => {
    const result = securePathJoin(baseDir, "documents", "file.txt");
    expect(result).toBe("/home/user/uploads/documents/file.txt");
  });

  it("should return null for path traversal attempts", () => {
    expect(securePathJoin(baseDir, "..", "secret")).toBe(null);
    expect(securePathJoin(baseDir, "folder", "..", "..", "etc")).toBe(null);
    expect(securePathJoin(baseDir, "../../../etc/passwd")).toBe(null);
  });

  it("should throw error for non-absolute base directory", () => {
    expect(() => securePathJoin("relative/path", "file.txt")).toThrow(
      "Base directory must be an absolute path",
    );
  });

  it("should handle single component", () => {
    const result = securePathJoin(baseDir, "file.txt");
    expect(result).toBe("/home/user/uploads/file.txt");
  });

  it("should return base directory for no components", () => {
    const result = securePathJoin(baseDir);
    expect(result).toBe("/home/user/uploads");
  });
});

describe("Path Security - securePathResolve", () => {
  const baseDir = "/var/www/public";

  it("should resolve valid paths correctly", () => {
    const result = securePathResolve(baseDir, "images");
    expect(result).toBe("/var/www/public/images");
  });

  it("should return null for path traversal attempts", () => {
    expect(securePathResolve(baseDir, "..")).toBe(null);
    expect(securePathResolve(baseDir, "../private")).toBe(null);
    expect(securePathResolve(baseDir, "folder/../..")).toBe(null);
  });

  it("should throw error for non-absolute base directory", () => {
    expect(() => securePathResolve("relative", "file")).toThrow(
      "Base directory must be an absolute path",
    );
  });
});

describe("Path Security - isValidFilename", () => {
  it("should accept valid filenames", () => {
    expect(isValidFilename("document.pdf")).toBe(true);
    expect(isValidFilename("image123.png")).toBe(true);
    expect(isValidFilename("my-file_name.txt")).toBe(true);
  });

  it("should reject filenames with path separators", () => {
    expect(isValidFilename("folder/file.txt")).toBe(false);
    expect(isValidFilename("folder\\file.txt")).toBe(false);
    expect(isValidFilename("../secret.txt")).toBe(false);
  });

  it("should reject path traversal patterns (. and .. only)", () => {
    expect(isValidFilename(".")).toBe(false);
    expect(isValidFilename("..")).toBe(false);
  });

  it("should accept hidden/dot files", () => {
    expect(isValidFilename(".hidden")).toBe(true);
    expect(isValidFilename(".gitignore")).toBe(true);
    expect(isValidFilename(".env")).toBe(true);
  });

  it("should reject empty or too long filenames", () => {
    expect(isValidFilename("")).toBe(false);
    expect(isValidFilename("a".repeat(256))).toBe(false);
    expect(isValidFilename("a".repeat(255))).toBe(true);
  });

  it("should reject filenames with null bytes", () => {
    expect(isValidFilename("file\0.txt")).toBe(false);
  });

  it("should reject reserved Windows filenames", () => {
    expect(isValidFilename("CON")).toBe(false);
    expect(isValidFilename("PRN")).toBe(false);
    expect(isValidFilename("AUX")).toBe(false);
    expect(isValidFilename("NUL")).toBe(false);
    expect(isValidFilename("COM1")).toBe(false);
    expect(isValidFilename("LPT1")).toBe(false);
    expect(isValidFilename("con.txt")).toBe(false);
  });

  it("should reject non-string inputs", () => {
    expect(isValidFilename(null)).toBe(false);
    expect(isValidFilename(undefined)).toBe(false);
    expect(isValidFilename(123)).toBe(false);
  });
});
