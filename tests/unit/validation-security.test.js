/**
 * Tests for Validation Security Utilities (RegExp safety)
 */

import {
  isValidAmount,
  escapeRegExp,
  createSafeRegExp,
  isValidRegExpPattern,
  safeRegExpTest,
} from "../../lib/utils/validation";

describe("Validation - isValidAmount", () => {
  it("should accept valid amounts", () => {
    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(0.01)).toBe(true);
    expect(isValidAmount(1000000)).toBe(true);
  });

  it("should reject invalid amounts", () => {
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(-100)).toBe(false);
    expect(isValidAmount("100")).toBe(false);
    expect(isValidAmount(null)).toBe(false);
  });
});

describe("Validation - escapeRegExp", () => {
  it("should escape special RegExp characters", () => {
    expect(escapeRegExp("hello.world")).toBe("hello\\.world");
    expect(escapeRegExp("test*pattern")).toBe("test\\*pattern");
    expect(escapeRegExp("user+name")).toBe("user\\+name");
    expect(escapeRegExp("price$100")).toBe("price\\$100");
    expect(escapeRegExp("(group)")).toBe("\\(group\\)");
    expect(escapeRegExp("[array]")).toBe("\\[array\\]");
    expect(escapeRegExp("a|b")).toBe("a\\|b");
    expect(escapeRegExp("^start")).toBe("\\^start");
    expect(escapeRegExp("end?")).toBe("end\\?");
    expect(escapeRegExp("{count}")).toBe("\\{count\\}");
    expect(escapeRegExp("back\\slash")).toBe("back\\\\slash");
  });

  it("should return empty string for non-string inputs", () => {
    expect(escapeRegExp(null)).toBe("");
    expect(escapeRegExp(undefined)).toBe("");
    expect(escapeRegExp(123)).toBe("");
  });

  it("should preserve normal characters", () => {
    expect(escapeRegExp("hello world")).toBe("hello world");
    expect(escapeRegExp("user123")).toBe("user123");
  });
});

describe("Validation - createSafeRegExp", () => {
  it("should create a working RegExp from user input", () => {
    const regex = createSafeRegExp("hello");
    expect(regex).toBeInstanceOf(RegExp);
    expect(regex.test("Hello World")).toBe(true);
    expect(regex.test("goodbye")).toBe(false);
  });

  it("should escape special characters in user input", () => {
    const regex = createSafeRegExp("file.txt");
    expect(regex.test("file.txt")).toBe(true);
    expect(regex.test("filextxt")).toBe(false); // Dot should not match any char
  });

  it("should return null for invalid inputs", () => {
    expect(createSafeRegExp(null)).toBe(null);
    expect(createSafeRegExp(undefined)).toBe(null);
    expect(createSafeRegExp(123)).toBe(null);
  });

  it("should return null for overly long patterns", () => {
    const longPattern = "a".repeat(101);
    expect(createSafeRegExp(longPattern)).toBe(null);
  });

  it("should return null for patterns with null bytes", () => {
    expect(createSafeRegExp("test\0pattern")).toBe(null);
  });

  it("should respect custom flags", () => {
    const caseSensitive = createSafeRegExp("Hello", "");
    expect(caseSensitive.test("Hello")).toBe(true);
    expect(caseSensitive.test("hello")).toBe(false);

    const caseInsensitive = createSafeRegExp("Hello", "i");
    expect(caseInsensitive.test("hello")).toBe(true);
  });
});

describe("Validation - isValidRegExpPattern", () => {
  it("should accept valid simple patterns", () => {
    expect(isValidRegExpPattern("hello")).toBe(true);
    expect(isValidRegExpPattern("\\d+")).toBe(true);
    expect(isValidRegExpPattern("[a-z]")).toBe(true);
    expect(isValidRegExpPattern("^start")).toBe(true);
    expect(isValidRegExpPattern("end$")).toBe(true);
  });

  it("should reject dangerous nested quantifier patterns", () => {
    expect(isValidRegExpPattern("(a+)+")).toBe(false);
    expect(isValidRegExpPattern("(a*)*")).toBe(false);
    expect(isValidRegExpPattern("(a+)*")).toBe(false);
    expect(isValidRegExpPattern("(a*)+")).toBe(false);
    expect(isValidRegExpPattern("(.*)+")).toBe(false);
    expect(isValidRegExpPattern("(.+)*")).toBe(false);
  });

  it("should reject overly long patterns", () => {
    expect(isValidRegExpPattern("a".repeat(101))).toBe(false);
    expect(isValidRegExpPattern("a".repeat(100))).toBe(true);
  });

  it("should reject invalid regex syntax", () => {
    expect(isValidRegExpPattern("[")).toBe(false);
    expect(isValidRegExpPattern("(unclosed")).toBe(false);
  });

  it("should reject non-string inputs", () => {
    expect(isValidRegExpPattern(null)).toBe(false);
    expect(isValidRegExpPattern(undefined)).toBe(false);
    expect(isValidRegExpPattern(123)).toBe(false);
  });
});

describe("Validation - safeRegExpTest", () => {
  it("should match patterns correctly", () => {
    expect(safeRegExpTest("hello", "Hello World")).toBe(true);
    expect(safeRegExpTest("goodbye", "Hello World")).toBe(false);
  });

  it("should escape special characters", () => {
    expect(safeRegExpTest("file.txt", "Found file.txt here")).toBe(true);
    expect(safeRegExpTest("file.txt", "Found filextxt here")).toBe(false);
  });

  it("should return false for invalid patterns", () => {
    expect(safeRegExpTest(null, "test")).toBe(false);
    expect(safeRegExpTest("", "test")).toBe(true); // Empty pattern matches
    expect(safeRegExpTest("a".repeat(101), "test")).toBe(false);
  });

  it("should handle patterns with special regex characters safely", () => {
    expect(safeRegExpTest("$100", "Price is $100")).toBe(true);
    expect(safeRegExpTest("a+b", "Expression: a+b")).toBe(true);
    expect(safeRegExpTest("(test)", "Call (test) function")).toBe(true);
  });
});
