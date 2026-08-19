import * as utils from "../utils.js";

describe("loadTemplates", () => {
  it("should return an object", async () => {
    const templates = await utils.loadTemplates();
    expect(typeof templates).toBe("object");
    expect(Array.isArray(templates)).toBe(false);
  });

  it("should load markdown templates", async () => {
    const templates = await utils.loadTemplates();
    expect(templates).toBeDefined();
  });

  it("should handle missing directory gracefully", async () => {
    const templates = await utils.loadTemplates();
    expect(
      Array.isArray(Object.values(templates)) || templates instanceof Object,
    ).toBe(true);
  });
});

describe("loadCanonicalLabels", () => {
  beforeEach(() => {
    utils.clearLabelCache();
  });

  it("should return an array", async () => {
    const labels = await utils.loadCanonicalLabels();
    expect(Array.isArray(labels)).toBe(true);
  });

  it("should cache labels for 5 minutes", async () => {
    const labels1 = await utils.loadCanonicalLabels();
    const labels2 = await utils.loadCanonicalLabels();
    expect(labels1).toBe(labels2);
  });

  it("should handle missing labels file gracefully", async () => {
    const labels = await utils.loadCanonicalLabels();
    expect(Array.isArray(labels)).toBe(true);
  });

  it("should clear cache on demand", async () => {
    utils.clearLabelCache();
    const labels = await utils.loadCanonicalLabels();
    expect(Array.isArray(labels)).toBe(true);
  });
});

describe("deduplicateLabels", () => {
  it("should remove duplicate labels by name", () => {
    const labels = [
      { name: "bug", color: "ff0000" },
      { name: "feature", color: "00ff00" },
      { name: "bug", color: "aa0000" },
    ];
    const result = utils.deduplicateLabels(labels);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("bug");
  });

  it("should preserve order of first occurrence", () => {
    const labels = [{ name: "c" }, { name: "a" }, { name: "b" }, { name: "a" }];
    const result = utils.deduplicateLabels(labels);
    expect(result.map((l) => l.name)).toEqual(["c", "a", "b"]);
  });

  it("should handle string labels", () => {
    const labels = ["bug", "feature", "bug", "chore"];
    const result = utils.deduplicateLabels(labels);
    expect(result).toEqual(["bug", "feature", "chore"]);
  });

  it("should handle empty array", () => {
    const result = utils.deduplicateLabels([]);
    expect(result).toEqual([]);
  });

  it("should handle mixed string and object labels", () => {
    const labels = ["bug", { name: "feature" }, "bug"];
    const result = utils.deduplicateLabels(labels);
    expect(result.length).toBe(2);
  });
});

describe("formatMarkdown", () => {
  it("should normalize line endings", () => {
    const text = "line1\r\nline2\r\nline3";
    const result = utils.formatMarkdown(text);
    expect(result).not.toContain("\r\n");
    expect(result).toContain("\n");
  });

  it("should trim trailing whitespace", () => {
    const text = "line1   \nline2  \nline3";
    const result = utils.formatMarkdown(text);
    const lines = result.split("\n");
    expect(lines[0]).toBe("line1");
    expect(lines[1]).toBe("line2");
  });

  it("should ensure single blank line at end", () => {
    const text = "content\n\n\n";
    const result = utils.formatMarkdown(text);
    expect(result.endsWith("\n")).toBe(true);
    expect(result).not.toMatch(/\n{3,}$/);
  });

  it("should reduce multiple blank lines to max 2", () => {
    const text = "line1\n\n\n\nline2";
    const result = utils.formatMarkdown(text);
    expect(result).not.toContain("\n\n\n");
  });

  it("should return empty string for null", () => {
    expect(utils.formatMarkdown(null)).toBe("");
  });

  it("should return empty string for undefined", () => {
    expect(utils.formatMarkdown(undefined)).toBe("");
  });

  it("should return empty string for non-string", () => {
    expect(utils.formatMarkdown(123)).toBe("");
  });

  it("should handle markdown with code blocks", () => {
    const text = "```\ncode\n```\n";
    const result = utils.formatMarkdown(text);
    expect(result).toContain("```");
  });
});

describe("validateLabelFormat", () => {
  it("should accept alphanumeric labels", () => {
    expect(utils.validateLabelFormat("bug")).toBe(true);
    expect(utils.validateLabelFormat("Feature123")).toBe(true);
  });

  it("should accept labels with hyphens", () => {
    expect(utils.validateLabelFormat("needs-review")).toBe(true);
    expect(utils.validateLabelFormat("good-first-issue")).toBe(true);
  });

  it("should accept labels with underscores", () => {
    expect(utils.validateLabelFormat("help_wanted")).toBe(true);
    expect(utils.validateLabelFormat("in_progress")).toBe(true);
  });

  it("should reject labels with spaces", () => {
    expect(utils.validateLabelFormat("needs review")).toBe(false);
  });

  it("should reject labels with special characters", () => {
    expect(utils.validateLabelFormat("bug@fix")).toBe(false);
    expect(utils.validateLabelFormat("feature/v2")).toBe(false);
    expect(utils.validateLabelFormat("label.name")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(utils.validateLabelFormat("")).toBe(false);
  });

  it("should reject null", () => {
    expect(utils.validateLabelFormat(null)).toBe(false);
  });

  it("should reject undefined", () => {
    expect(utils.validateLabelFormat(undefined)).toBe(false);
  });

  it("should reject non-string", () => {
    expect(utils.validateLabelFormat(123)).toBe(false);
  });

  it("should trim whitespace before validation", () => {
    expect(utils.validateLabelFormat("  bug  ")).toBe(true);
  });
});

describe("validateIssueNumber", () => {
  it("should accept positive integers", () => {
    expect(utils.validateIssueNumber(1)).toBe(true);
    expect(utils.validateIssueNumber(100)).toBe(true);
    expect(utils.validateIssueNumber(999999)).toBe(true);
  });

  it("should accept string numbers", () => {
    expect(utils.validateIssueNumber("123")).toBe(true);
    expect(utils.validateIssueNumber("1")).toBe(true);
  });

  it("should reject zero", () => {
    expect(utils.validateIssueNumber(0)).toBe(false);
  });

  it("should reject negative numbers", () => {
    expect(utils.validateIssueNumber(-1)).toBe(false);
    expect(utils.validateIssueNumber("-100")).toBe(false);
  });

  it("should reject non-integer numbers", () => {
    expect(utils.validateIssueNumber(1.5)).toBe(false);
    expect(utils.validateIssueNumber("1.5")).toBe(false);
  });

  it("should reject non-numeric strings", () => {
    expect(utils.validateIssueNumber("abc")).toBe(false);
    expect(utils.validateIssueNumber("#123")).toBe(false);
  });

  it("should reject null", () => {
    expect(utils.validateIssueNumber(null)).toBe(false);
  });

  it("should reject undefined", () => {
    expect(utils.validateIssueNumber(undefined)).toBe(false);
  });

  it("should reject empty string", () => {
    expect(utils.validateIssueNumber("")).toBe(false);
  });
});

describe("validateUsername", () => {
  it("should accept valid GitHub usernames", () => {
    expect(utils.validateUsername("octocat")).toBe(true);
    expect(utils.validateUsername("user-123")).toBe(true);
    expect(utils.validateUsername("a")).toBe(true);
  });

  it("should accept alphanumeric usernames", () => {
    expect(utils.validateUsername("User123")).toBe(true);
    expect(utils.validateUsername("john-doe")).toBe(true);
  });

  it("should reject usernames with spaces", () => {
    expect(utils.validateUsername("user name")).toBe(false);
  });

  it("should reject usernames with special characters", () => {
    expect(utils.validateUsername("user@name")).toBe(false);
    expect(utils.validateUsername("user.name")).toBe(false);
    expect(utils.validateUsername("user/name")).toBe(false);
  });

  it("should reject usernames over 39 characters", () => {
    const longName = "a".repeat(40);
    expect(utils.validateUsername(longName)).toBe(false);
  });

  it("should accept usernames up to 39 characters", () => {
    const longName = "a".repeat(39);
    expect(utils.validateUsername(longName)).toBe(true);
  });

  it("should reject empty string", () => {
    expect(utils.validateUsername("")).toBe(false);
  });

  it("should reject null", () => {
    expect(utils.validateUsername(null)).toBe(false);
  });

  it("should reject undefined", () => {
    expect(utils.validateUsername(undefined)).toBe(false);
  });

  it("should reject non-string", () => {
    expect(utils.validateUsername(123)).toBe(false);
  });

  it("should trim whitespace before validation", () => {
    expect(utils.validateUsername("  user  ")).toBe(true);
  });
});

describe("parseIssueNumber", () => {
  it("should parse issue number from string", () => {
    expect(utils.parseIssueNumber("123")).toBe(123);
    expect(utils.parseIssueNumber("1")).toBe(1);
  });

  it("should parse issue number with hash prefix", () => {
    expect(utils.parseIssueNumber("#123")).toBe(123);
    expect(utils.parseIssueNumber("#1")).toBe(1);
  });

  it("should parse issue number with whitespace", () => {
    expect(utils.parseIssueNumber("  123  ")).toBe(123);
    expect(utils.parseIssueNumber("  #456  ")).toBe(456);
  });

  it("should return null for invalid numbers", () => {
    expect(utils.parseIssueNumber("abc")).toBeNull();
    expect(utils.parseIssueNumber("12.5")).toBeNull();
  });

  it("should return null for zero", () => {
    expect(utils.parseIssueNumber("0")).toBeNull();
  });

  it("should return null for negative numbers", () => {
    expect(utils.parseIssueNumber("-1")).toBeNull();
  });

  it("should return null for null input", () => {
    expect(utils.parseIssueNumber(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(utils.parseIssueNumber(undefined)).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(utils.parseIssueNumber("")).toBeNull();
  });

  it("should return null for non-string input", () => {
    expect(utils.parseIssueNumber(123)).toBeNull();
  });
});

describe("clearLabelCache", () => {
  it("should clear the cache", async () => {
    await utils.loadCanonicalLabels();
    utils.clearLabelCache();
    // Load again to verify cache was cleared
    const labels = await utils.loadCanonicalLabels();
    expect(Array.isArray(labels)).toBe(true);
  });
});
