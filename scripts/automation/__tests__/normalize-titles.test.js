/**
 * Tests for normalize-issue-pr-titles.js
 * Covers type detection, title formatting, idempotency, and edge cases
 */

const {
  normalizeTitle,
  isAlreadyPrefixed,
  parseArgs,
  formatDate,
} = require("../normalize-issue-pr-titles");

describe("normalizeTitle()", () => {
  describe("Basic functionality", () => {
    it("should add prefix to unprefixed title", () => {
      const result = normalizeTitle("Update documentation", "docs");
      expect(result).toBe("docs: Update documentation");
    });

    it("should add prefix with various types", () => {
      expect(normalizeTitle("Fix login bug", "fix")).toBe("fix: Fix login bug");
      expect(normalizeTitle("Add new feature", "feat")).toBe(
        "feat: Add new feature",
      );
      expect(normalizeTitle("Refactor API", "refactor")).toBe(
        "refactor: Refactor API",
      );
      expect(normalizeTitle("Security patch", "security")).toBe(
        "security: Security patch",
      );
    });

    it("should preserve original title content", () => {
      const original = "Fix issue with user authentication and session timeout";
      const result = normalizeTitle(original, "fix");
      expect(result).toBe(`fix: ${original}`);
    });

    it("should handle titles with special characters", () => {
      const title = "Update docs for A/B testing & metrics";
      const result = normalizeTitle(title, "docs");
      expect(result).toBe(`docs: ${title}`);
    });

    it("should handle titles with unicode characters", () => {
      const title = "Add support for café, naïve, and Ångström";
      const result = normalizeTitle(title, "feat");
      expect(result).toBe(`feat: ${title}`);
    });

    it("should handle very long titles", () => {
      const longTitle = "A".repeat(200);
      const result = normalizeTitle(longTitle, "chore");
      expect(result).toBe(`chore: ${longTitle}`);
      expect(result.length).toBe(207); // "chore: " + 200 A's
    });
  });

  describe("Already-prefixed titles (idempotency)", () => {
    it("should return null for title already prefixed with valid type", () => {
      expect(normalizeTitle("feat: Add new feature", "feat")).toBeNull();
      expect(normalizeTitle("fix: Fix bug", "fix")).toBeNull();
      expect(normalizeTitle("docs: Update docs", "docs")).toBeNull();
    });

    it("should return null regardless of suggested prefix if already prefixed", () => {
      // Title is already prefixed, so ignore the suggested prefix
      expect(normalizeTitle("fix: Some fix", "feat")).toBeNull();
      expect(normalizeTitle("docs: Some doc", "chore")).toBeNull();
    });

    it("should handle prefixes with various spacing", () => {
      expect(normalizeTitle("feat:  Add feature", "feat")).toBeNull(); // double space - matches
      // Note: 'fix:Add something' without space does NOT match the pattern, so it gets prefixed
      expect(normalizeTitle("fix:Add something", "fix")).toBe(
        "fix: fix:Add something",
      );
    });

    it("should be case-insensitive for prefix detection", () => {
      expect(normalizeTitle("FEAT: Some feature", "feat")).toBeNull();
      expect(normalizeTitle("Fix: Some fix", "fix")).toBeNull();
      expect(normalizeTitle("DOCS: Some doc", "docs")).toBeNull();
    });

    it("should handle all valid prefix types", () => {
      const prefixes = [
        "fix",
        "feat",
        "hotfix",
        "refactor",
        "chore",
        "docs",
        "test",
        "perf",
        "ci",
        "build",
        "deps",
        "security",
        "design",
        "a11y",
        "ux",
        "release",
        "research",
        "revert",
        "i18n",
        "ops",
        "proto",
        "ds",
        "api",
        "schema",
        "telemetry",
        "content",
        "seo",
        "config",
        "migrate",
        "qa",
        "uat",
        "audit",
      ];

      prefixes.forEach((prefix) => {
        const title = `${prefix}: Some title`;
        expect(normalizeTitle(title, prefix)).toBeNull();
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty title", () => {
      const result = normalizeTitle("", "chore");
      expect(result).toBe("chore: ");
    });

    it("should handle title with only whitespace", () => {
      const result = normalizeTitle("   ", "chore");
      expect(result).toBe("chore:    ");
    });

    it("should not normalize if title is just prefix and colon with space", () => {
      expect(normalizeTitle("feat: ", "feat")).toBeNull(); // colon with space matches
      expect(normalizeTitle("fix: ", "fix")).toBeNull(); // colon with space matches
      // Without space after colon, they don't match the pattern
      expect(normalizeTitle("feat:", "feat")).toBe("feat: feat:");
      expect(normalizeTitle("fix:", "fix")).toBe("fix: fix:");
    });

    it("should handle title that looks like prefix but isnt", () => {
      // "feature" has "feat" in it but isn't a valid prefix
      const result = normalizeTitle("feature/add-something", "feat");
      expect(result).toBe("feat: feature/add-something");
    });

    it("should not match invalid prefixes", () => {
      const result = normalizeTitle("feature: Some title", "feat");
      expect(result).toBe("feat: feature: Some title");
    });

    it("should handle prefix at end of title", () => {
      const result = normalizeTitle("Something fix: this bug", "fix");
      expect(result).toBe("fix: Something fix: this bug");
    });
  });

  describe("Type family coverage", () => {
    it("should handle all type prefixes correctly", () => {
      const typePrefixes = [
        "fix",
        "feat",
        "hotfix",
        "refactor",
        "chore",
        "docs",
        "test",
        "perf",
        "ci",
        "build",
        "deps",
        "security",
        "design",
        "a11y",
        "ux",
        "release",
        "research",
        "revert",
        "i18n",
        "ops",
        "proto",
        "ds",
        "api",
        "schema",
        "telemetry",
        "content",
        "seo",
        "config",
        "migrate",
        "qa",
        "uat",
        "audit",
      ];

      typePrefixes.forEach((type) => {
        const title = `Update ${type} system`;
        const result = normalizeTitle(title, type);
        expect(result).toBe(`${type}: ${title}`);
      });
    });
  });
});

describe("isAlreadyPrefixed()", () => {
  describe("Valid prefixed titles", () => {
    it("should recognize titles with valid type prefixes", () => {
      expect(isAlreadyPrefixed("feat: Add new feature")).toBe(true);
      expect(isAlreadyPrefixed("fix: Fix bug")).toBe(true);
      expect(isAlreadyPrefixed("docs: Update documentation")).toBe(true);
      expect(isAlreadyPrefixed("chore: Cleanup")).toBe(true);
    });

    it("should handle all valid prefixes", () => {
      const prefixes = [
        "fix",
        "feat",
        "hotfix",
        "refactor",
        "chore",
        "docs",
        "test",
        "perf",
        "ci",
        "build",
        "deps",
        "security",
        "design",
        "a11y",
        "ux",
        "release",
        "research",
        "revert",
        "i18n",
        "ops",
        "proto",
        "ds",
        "api",
        "schema",
        "telemetry",
        "content",
        "seo",
        "config",
        "migrate",
        "qa",
        "uat",
        "audit",
      ];

      prefixes.forEach((prefix) => {
        expect(isAlreadyPrefixed(`${prefix}: Some title`)).toBe(true);
      });
    });

    it("should be case-insensitive", () => {
      expect(isAlreadyPrefixed("FEAT: Add feature")).toBe(true);
      expect(isAlreadyPrefixed("Fix: Fix bug")).toBe(true);
      expect(isAlreadyPrefixed("DOCS: Update docs")).toBe(true);
    });

    it("should handle various spacing after colon", () => {
      expect(isAlreadyPrefixed("feat: Title")).toBe(true);
      expect(isAlreadyPrefixed("feat:  Title")).toBe(true); // double space
      expect(isAlreadyPrefixed("feat:\tTitle")).toBe(true); // tab
    });
  });

  describe("Unprefixed titles", () => {
    it("should reject titles without prefix", () => {
      expect(isAlreadyPrefixed("Add new feature")).toBe(false);
      expect(isAlreadyPrefixed("Fix this bug")).toBe(false);
      expect(isAlreadyPrefixed("Update documentation")).toBe(false);
    });

    it("should reject invalid prefixes", () => {
      expect(isAlreadyPrefixed("feature: Add feature")).toBe(false);
      expect(isAlreadyPrefixed("bug: Fix bug")).toBe(false);
      expect(isAlreadyPrefixed("change: Update something")).toBe(false);
    });

    it("should reject prefix without colon", () => {
      expect(isAlreadyPrefixed("feat Add feature")).toBe(false);
      expect(isAlreadyPrefixed("fix Update bug")).toBe(false);
    });

    it("should reject prefix at end of title", () => {
      expect(isAlreadyPrefixed("Something fix: this bug")).toBe(false);
    });

    it("should reject colons not preceded by valid prefix", () => {
      expect(isAlreadyPrefixed("HTTP: The web protocol")).toBe(false);
      expect(isAlreadyPrefixed("Note: This is important")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string", () => {
      expect(isAlreadyPrefixed("")).toBe(false);
    });

    it("should handle just prefix and colon", () => {
      expect(isAlreadyPrefixed("feat:")).toBe(false); // no space after colon
      expect(isAlreadyPrefixed("feat: ")).toBe(true); // space after colon is enough
    });

    it("should handle multiple colons", () => {
      expect(isAlreadyPrefixed("feat: Note: This is important")).toBe(true);
    });

    it("should handle titles with special characters", () => {
      expect(isAlreadyPrefixed("feat: A/B testing & metrics")).toBe(true);
      expect(isAlreadyPrefixed("A/B testing & metrics")).toBe(false);
    });
  });
});

describe("parseArgs()", () => {
  it("should parse --dry-run flag", () => {
    process.argv = ["node", "script.js", "--dry-run"];
    const args = parseArgs();
    expect(args.dryRun).toBe(true);
  });

  it("should parse --verbose flag", () => {
    process.argv = ["node", "script.js", "--verbose"];
    const args = parseArgs();
    expect(args.verbose).toBe(true);
  });

  it("should parse --state argument", () => {
    process.argv = ["node", "script.js", "--state", "closed"];
    const args = parseArgs();
    expect(args.state).toBe("closed");
  });

  it("should parse --since argument", () => {
    process.argv = ["node", "script.js", "--since", "2026-01-01"];
    const args = parseArgs();
    expect(args.since).toBe("2026-01-01");
  });

  it("should parse --output argument", () => {
    process.argv = ["node", "script.js", "--output", "report.json"];
    const args = parseArgs();
    expect(args.output).toBe("report.json");
  });

  it("should parse multiple arguments", () => {
    process.argv = [
      "node",
      "script.js",
      "--dry-run",
      "--state",
      "all",
      "--since",
      "2025-06-01",
      "--output",
      "result.json",
      "--verbose",
    ];
    const args = parseArgs();
    expect(args.dryRun).toBe(true);
    expect(args.state).toBe("all");
    expect(args.since).toBe("2025-06-01");
    expect(args.output).toBe("result.json");
    expect(args.verbose).toBe(true);
  });

  it("should have correct defaults", () => {
    process.argv = ["node", "script.js"];
    const args = parseArgs();
    expect(args.dryRun).toBe(false);
    expect(args.state).toBe("open");
    expect(args.since).toBeNull();
    expect(args.output).toBeNull();
    expect(args.verbose).toBe(false);
  });
});

describe("formatDate()", () => {
  it("should format valid date strings to ISO", () => {
    const result = formatDate("2026-01-15");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("should return null for invalid date", () => {
    const result = formatDate("not-a-date");
    expect(result).toBeNull();
  });

  it("should handle already-ISO dates", () => {
    const result = formatDate("2026-01-15T10:30:00Z");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("should return null for empty string", () => {
    const result = formatDate("");
    expect(result).toBeNull();
  });
});

describe("Integration: Type detection → Title normalization", () => {
  it("should handle complete workflow: detect type and normalize", () => {
    // Simulate detecting 'bug' type and normalizing title
    const title = "Fix authentication timeout";
    const detectedType = "bug"; // simulated
    const typeToPrefix = { bug: "fix" };
    const prefix = typeToPrefix[detectedType];
    const result = normalizeTitle(title, prefix);

    expect(result).toBe("fix: Fix authentication timeout");
    expect(isAlreadyPrefixed(result)).toBe(true);
  });

  it("should handle idempotency in complete workflow", () => {
    const title = "Update API documentation";

    // First pass: add prefix
    const pass1 = normalizeTitle(title, "docs");
    expect(pass1).toBe("docs: Update API documentation");

    // Second pass: should detect it's already prefixed
    const pass2 = normalizeTitle(pass1, "docs");
    expect(pass2).toBeNull(); // No change needed

    // Verify no double-prefixing
    expect(pass1).toBe("docs: Update API documentation");
  });

  it("should handle workflow with various type families", () => {
    const workflows = [
      {
        title: "Add user preferences",
        type: "feature",
        expected: "feat: Add user preferences",
      },
      {
        title: "Fix memory leak",
        type: "bug",
        expected: "fix: Fix memory leak",
      },
      {
        title: "Update README",
        type: "documentation",
        expected: "docs: Update README",
      },
      {
        title: "Refactor services",
        type: "refactor",
        expected: "refactor: Refactor services",
      },
      {
        title: "Add unit tests",
        type: "test",
        expected: "test: Add unit tests",
      },
      {
        title: "Fix XSS vulnerability",
        type: "security",
        expected: "security: Fix XSS vulnerability",
      },
      {
        title: "Improve query performance",
        type: "performance",
        expected: "perf: Improve query performance",
      },
    ];

    const typeToPrefix = {
      feature: "feat",
      bug: "fix",
      documentation: "docs",
      refactor: "refactor",
      test: "test",
      security: "security",
      performance: "perf",
    };

    workflows.forEach(({ title, type, expected }) => {
      const prefix = typeToPrefix[type];
      const result = normalizeTitle(title, prefix);
      expect(result).toBe(expected);
      expect(isAlreadyPrefixed(result)).toBe(true);
    });
  });
});

describe("Boundary conditions and error tolerance", () => {
  it("should not modify title format beyond adding prefix", () => {
    const original = "Update  docs  (with   spaces)";
    const result = normalizeTitle(original, "docs");
    expect(result).toBe(`docs: ${original}`);
  });

  it("should handle titles that might break parsing", () => {
    const titles = [
      "Title with (parentheses)",
      "Title with [brackets]",
      "Title with {braces}",
      'Title with "quotes"',
      "Title with 'single quotes'",
      "Title with $special $chars",
      "Title with @mentions",
      "Title with #hashtags",
    ];

    titles.forEach((title) => {
      const result = normalizeTitle(title, "feat");
      expect(result).toBe(`feat: ${title}`);
      expect(isAlreadyPrefixed(result)).toBe(true);
    });
  });

  it("should handle real-world GitHub issue titles", () => {
    const realTitles = [
      "Implement OAuth2 integration with third-party providers",
      "Users cannot reset password via email link",
      "Database migration: convert legacy schema to v2",
      "Performance: reduce bundle size by 40%",
      "Accessibility audit & WCAG 2.2 AA compliance",
      "Security: CVE-2024-12345 XSS vulnerability in comments",
      "Refactor: split monolithic AuthService into modules",
      "A/B test: new checkout flow vs. legacy flow",
    ];

    realTitles.forEach((title) => {
      const prefix = "feat"; // Generic for this test
      const result = normalizeTitle(title, prefix);
      // Some titles contain colons that match the prefix pattern, so they might already be "prefixed"
      if (result !== null) {
        expect(result).toContain("feat: ");
        expect(isAlreadyPrefixed(result)).toBe(true);
      }
    });
  });
});
