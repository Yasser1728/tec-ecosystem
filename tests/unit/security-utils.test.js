/**
 * Tests for Security Utilities
 */

import {
  sanitizeFilename,
  safePathJoin,
  sanitizePathComponent,
  isPathWithinBase,
} from "../../lib/utils/path-security";

import {
  escapeRegExp,
  createSafeRegExp,
  safePatternMatch,
} from "../../lib/utils/validation";

describe("Path Security - sanitizeFilename", () => {
  it("should return empty string for empty input", () => {
    expect(sanitizeFilename("")).toBe("");
  });

  it("should return empty string for null input", () => {
    expect(sanitizeFilename(null)).toBe("");
  });

  it("should return empty string for undefined input", () => {
    expect(sanitizeFilename(undefined)).toBe("");
  });

  it("should return empty string for non-string input", () => {
    expect(sanitizeFilename(123)).toBe("");
    expect(sanitizeFilename({})).toBe("");
    expect(sanitizeFilename([])).toBe("");
  });

  it("should sanitize path traversal sequences", () => {
    expect(sanitizeFilename("../../../etc/passwd")).toBe("etcpasswd");
    expect(sanitizeFilename("..\\..\\windows\\system32")).toBe("windowssystem32");
  });

  it("should remove null bytes", () => {
    expect(sanitizeFilename("file\0name.txt")).toBe("filename.txt");
  });

  it("should remove path separators", () => {
    expect(sanitizeFilename("path/to/file.txt")).toBe("pathtofile.txt");
    expect(sanitizeFilename("path\\to\\file.txt")).toBe("pathtofile.txt");
  });

  it("should remove dangerous characters", () => {
    expect(sanitizeFilename('file<>:"|?*.txt')).toBe("file.txt");
  });

  it("should preserve valid filenames", () => {
    expect(sanitizeFilename("valid-file_name.txt")).toBe("valid-file_name.txt");
    expect(sanitizeFilename("document.pdf")).toBe("document.pdf");
  });

  it("should trim leading and trailing dots", () => {
    expect(sanitizeFilename("...file.txt...")).toBe("file.txt");
    expect(sanitizeFilename("..hidden")).toBe("hidden");
  });
});

describe("Path Security - sanitizePathComponent", () => {
  it("should return null for path traversal attempts", () => {
    expect(sanitizePathComponent("../secret")).toBeNull();
    expect(sanitizePathComponent("..\\secret")).toBeNull();
    expect(sanitizePathComponent("foo/../bar")).toBeNull();
  });

  it("should return null for absolute paths", () => {
    expect(sanitizePathComponent("/etc/passwd")).toBeNull();
    expect(sanitizePathComponent("\\windows\\system32")).toBeNull();
  });

  it("should return null for Windows drive paths", () => {
    expect(sanitizePathComponent("C:\\Windows")).toBeNull();
  });

  it("should return null for null bytes", () => {
    expect(sanitizePathComponent("file\0name")).toBeNull();
  });

  it("should return null for non-string input", () => {
    expect(sanitizePathComponent(null)).toBeNull();
    expect(sanitizePathComponent(undefined)).toBeNull();
    expect(sanitizePathComponent(123)).toBeNull();
  });

  it("should allow valid path components", () => {
    expect(sanitizePathComponent("valid-folder")).toBe("valid-folder");
    expect(sanitizePathComponent("file.txt")).toBe("file.txt");
    expect(sanitizePathComponent("subfolder")).toBe("subfolder");
  });

  it("should remove control characters", () => {
    expect(sanitizePathComponent("file\x01name")).toBe("filename");
  });
});

describe("Path Security - safePathJoin", () => {
  it("should return null for invalid inputs", () => {
    expect(safePathJoin(null, "file.txt")).toBeNull();
    expect(safePathJoin("/base", null)).toBeNull();
    expect(safePathJoin(123, "file.txt")).toBeNull();
  });

  it("should reject path traversal attempts", () => {
    expect(safePathJoin("/base", "../outside")).toBeNull();
    expect(safePathJoin("/base", "../../etc/passwd")).toBeNull();
  });

  it("should allow safe path joins", () => {
    const result = safePathJoin("/base", "subdir");
    expect(result).toContain("/base");
    expect(result).toContain("subdir");
  });
});

describe("Path Security - isPathWithinBase", () => {
  it("should return false for invalid inputs", () => {
    expect(isPathWithinBase(null, "/some/path")).toBe(false);
    expect(isPathWithinBase("/base", null)).toBe(false);
    expect(isPathWithinBase(123, "/path")).toBe(false);
  });

  it("should return true for paths within base", () => {
    expect(isPathWithinBase("/base", "/base/subdir/file.txt")).toBe(true);
    expect(isPathWithinBase("/base", "/base")).toBe(true);
  });

  it("should return false for paths outside base", () => {
    expect(isPathWithinBase("/base", "/other/path")).toBe(false);
    expect(isPathWithinBase("/base", "/base/../other")).toBe(false);
  });
});

describe("Validation - escapeRegExp", () => {
  it("should return empty string for non-string input", () => {
    expect(escapeRegExp(null)).toBe("");
    expect(escapeRegExp(undefined)).toBe("");
    expect(escapeRegExp(123)).toBe("");
  });

  it("should escape special regex characters", () => {
    expect(escapeRegExp("test.com")).toBe("test\\.com");
    expect(escapeRegExp("$100")).toBe("\\$100");
    expect(escapeRegExp("a*b+c?")).toBe("a\\*b\\+c\\?");
    expect(escapeRegExp("(group)")).toBe("\\(group\\)");
    expect(escapeRegExp("[char]")).toBe("\\[char\\]");
    expect(escapeRegExp("{3}")).toBe("\\{3\\}");
    expect(escapeRegExp("a|b")).toBe("a\\|b");
    expect(escapeRegExp("^start$")).toBe("\\^start\\$");
    expect(escapeRegExp("back\\slash")).toBe("back\\\\slash");
  });

  it("should not modify strings without special characters", () => {
    expect(escapeRegExp("hello world")).toBe("hello world");
    expect(escapeRegExp("abc123")).toBe("abc123");
  });
});

describe("Validation - createSafeRegExp", () => {
  it("should return null for empty pattern", () => {
    expect(createSafeRegExp("")).toBeNull();
    expect(createSafeRegExp(null)).toBeNull();
    expect(createSafeRegExp(undefined)).toBeNull();
  });

  it("should return null for pattern exceeding max length", () => {
    const longPattern = "a".repeat(101);
    expect(createSafeRegExp(longPattern)).toBeNull();
  });

  it("should allow custom max length", () => {
    const pattern = "a".repeat(50);
    expect(createSafeRegExp(pattern, "", { maxLength: 30 })).toBeNull();
    expect(createSafeRegExp(pattern, "", { maxLength: 100 })).not.toBeNull();
  });

  it("should return null for invalid flags", () => {
    expect(createSafeRegExp("test", "xyz")).toBeNull();
    expect(createSafeRegExp("test", "ia")).toBeNull();
  });

  it("should create regex with valid flags", () => {
    const regex = createSafeRegExp("test", "gi");
    expect(regex).toBeInstanceOf(RegExp);
    expect(regex.flags).toContain("g");
    expect(regex.flags).toContain("i");
  });

  it("should escape special characters in pattern", () => {
    const regex = createSafeRegExp("test.com");
    expect(regex).not.toBeNull();
    expect(regex.test("test.com")).toBe(true);
    expect(regex.test("testXcom")).toBe(false);
  });

  it("should prevent regex injection", () => {
    // This pattern would cause issues if not escaped
    const regex = createSafeRegExp(".*");
    expect(regex).not.toBeNull();
    expect(regex.test(".*")).toBe(true);
    expect(regex.test("anything")).toBe(false);
  });
});

describe("Validation - safePatternMatch", () => {
  it("should return false for invalid inputs", () => {
    expect(safePatternMatch(null, "pattern")).toBe(false);
    expect(safePatternMatch("input", null)).toBe(false);
    expect(safePatternMatch(123, "pattern")).toBe(false);
    expect(safePatternMatch("input", 123)).toBe(false);
  });

  it("should match patterns case-insensitively by default", () => {
    expect(safePatternMatch("Hello World", "hello")).toBe(true);
    expect(safePatternMatch("Hello World", "WORLD")).toBe(true);
  });

  it("should respect case-sensitive flag", () => {
    expect(safePatternMatch("Hello World", "hello", "")).toBe(false);
    expect(safePatternMatch("Hello World", "Hello", "")).toBe(true);
  });

  it("should handle special characters safely", () => {
    expect(safePatternMatch("file.txt", ".txt")).toBe(true);
    expect(safePatternMatch("file-txt", ".txt")).toBe(false);
    expect(safePatternMatch("$100.00", "$100")).toBe(true);
  });

  it("should return false for excessively long patterns", () => {
    const longPattern = "a".repeat(101);
    expect(safePatternMatch("test", longPattern)).toBe(false);
  });
});
