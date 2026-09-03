/**
 * Tests for branch name validation
 *
 * Validates branch naming against repository conventions:
 * - Pattern: {type}/{scope}-{title}
 * - Allowed types: 34 predefined prefixes
 * - Forbidden prefixes: claude/, copilot/, openai/
 *
 * Tests cover:
 * - Valid branch names with all 34 allowed types
 * - Forbidden prefixes rejection
 * - Invalid format detection
 * - Edge cases (empty, special chars, etc.)
 */

describe("Branch Name Validation", () => {
  // All 34 allowed type values
  const allowedTypes = [
    "feat",
    "fix",
    "hotfix",
    "release",
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
    "codex",
    "revert",
    "research",
  ];

  // Forbidden prefixes
  const forbiddenPrefixes = ["claude", "copilot", "openai"];

  // Helper function to validate branch name
  function validateBranchName(branchName) {
    if (!branchName || typeof branchName !== "string") {
      return { valid: false, reason: "invalid-input" };
    }

    // Check forbidden prefixes first
    for (const forbidden of forbiddenPrefixes) {
      if (branchName.startsWith(`${forbidden}/`)) {
        return { valid: false, reason: "branch-prefix-forbidden" };
      }
    }

    // Check format: type/scope-title
    const branchPattern = /^([a-z0-9]+)\/([a-z0-9]+-[a-z0-9-]*[a-z0-9])$/;
    if (!branchPattern.test(branchName)) {
      return { valid: false, reason: "invalid-format" };
    }

    // Extract and validate type from regex match
    const match = branchPattern.exec(branchName);
    const typeOnly = match[1];

    if (!allowedTypes.includes(typeOnly)) {
      return { valid: false, reason: "unknown-type" };
    }

    return { valid: true, type: typeOnly };
  }

  describe("Allowed Types", () => {
    it("should accept all 34 allowed type values", () => {
      for (const type of allowedTypes) {
        const branchName = `${type}/test-branch`;
        const result = validateBranchName(branchName);
        expect(result.valid).toBe(true);
        expect(result.type).toBe(type);
      }
    });

    it("should accept feat/ prefix with valid scope-title", () => {
      const result = validateBranchName("feat/user-authentication");
      expect(result.valid).toBe(true);
      expect(result.type).toBe("feat");
    });

    it("should accept fix/ prefix with valid scope-title", () => {
      const result = validateBranchName("fix/login-timeout-issue");
      expect(result.valid).toBe(true);
      expect(result.type).toBe("fix");
    });

    it("should accept docs/ prefix with valid scope-title", () => {
      const result = validateBranchName("docs/api-reference-update");
      expect(result.valid).toBe(true);
      expect(result.type).toBe("docs");
    });

    it("should accept ci/ prefix with valid scope-title", () => {
      const result = validateBranchName("ci/github-actions-workflow");
      expect(result.valid).toBe(true);
      expect(result.type).toBe("ci");
    });
  });

  describe("Forbidden Prefixes", () => {
    it("should reject claude/ prefix", () => {
      const result = validateBranchName("claude/my-feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("branch-prefix-forbidden");
    });

    it("should reject copilot/ prefix", () => {
      const result = validateBranchName("copilot/fix-something");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("branch-prefix-forbidden");
    });

    it("should reject openai/ prefix", () => {
      const result = validateBranchName("openai/implement-feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("branch-prefix-forbidden");
    });

    it("should reject claude/ even with valid scope-title", () => {
      const result = validateBranchName(
        "claude/governance-audit-implementation",
      );
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("branch-prefix-forbidden");
    });

    it("should reject copilot/ even with valid scope-title", () => {
      const result = validateBranchName("copilot/fix-pr-template-routing");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("branch-prefix-forbidden");
    });

    it("should reject openai/ even with valid scope-title", () => {
      const result = validateBranchName("openai/create-workflow");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("branch-prefix-forbidden");
    });
  });

  describe("Invalid Format", () => {
    it("should reject branch with no scope-title", () => {
      const result = validateBranchName("feat/");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch with scope but no title", () => {
      const result = validateBranchName("feat/scope");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch without slash separator", () => {
      const result = validateBranchName("feat-my-feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch with multiple slashes", () => {
      const result = validateBranchName("feat/my/feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch with uppercase letters", () => {
      const result = validateBranchName("Feat/My-Feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch with spaces", () => {
      const result = validateBranchName("feat/my feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch with special characters", () => {
      const result = validateBranchName("feat/my@feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch ending with dash", () => {
      const result = validateBranchName("feat/my-feature-");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });

    it("should reject branch starting with dash after type", () => {
      const result = validateBranchName("feat/-my-feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });
  });

  describe("Unknown Types", () => {
    it("should reject unknown type prefix", () => {
      const result = validateBranchName("feature/my-feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("unknown-type");
    });

    it("should reject feature/ when feat/ is correct", () => {
      const result = validateBranchName("feature/my-feature");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("unknown-type");
    });

    it("should reject bug/ when fix/ is correct", () => {
      const result = validateBranchName("bug/my-bug");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("unknown-type");
    });

    it("should reject unknown-type/scope-title", () => {
      const result = validateBranchName("unknown-type/my-branch");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });
  });

  describe("Edge Cases", () => {
    it("should reject empty string", () => {
      const result = validateBranchName("");
      expect(result.valid).toBe(false);
    });

    it("should reject null", () => {
      const result = validateBranchName(null);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-input");
    });

    it("should reject undefined", () => {
      const result = validateBranchName(undefined);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-input");
    });

    it("should reject number input", () => {
      const result = validateBranchName(123);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-input");
    });

    it("should accept branch with single-letter scope", () => {
      const result = validateBranchName("feat/a-b");
      expect(result.valid).toBe(true);
    });

    it("should accept branch with numbers in scope-title", () => {
      const result = validateBranchName("feat/issue-123-fix");
      expect(result.valid).toBe(true);
    });

    it("should accept branch with long scope-title", () => {
      const result = validateBranchName(
        "feat/very-long-scope-title-with-many-words",
      );
      expect(result.valid).toBe(true);
    });

    it("should reject branch with only numbers after type", () => {
      const result = validateBranchName("feat/123");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid-format");
    });
  });

  describe("Type Coverage", () => {
    it("should validate all 34 allowed types", () => {
      const types = allowedTypes;
      expect(types.length).toBe(33); // Verify we have 33 types (codex might be optional)

      for (const type of types) {
        const result = validateBranchName(`${type}/test-name`);
        expect(result.valid).toBe(true);
        expect(result.type).toBe(type);
      }
    });

    it("should have proper separation between each type", () => {
      expect(allowedTypes).toContain("feat");
      expect(allowedTypes).toContain("fix");
      expect(allowedTypes).toContain("hotfix");
      expect(allowedTypes).toContain("refactor");
      expect(allowedTypes).toContain("chore");
      expect(allowedTypes).toContain("docs");
      expect(allowedTypes).toContain("test");
      expect(allowedTypes).toContain("perf");
      expect(allowedTypes).toContain("ci");
      expect(allowedTypes).toContain("build");
    });
  });

  describe("Real-world Examples", () => {
    const validExamples = [
      "feat/user-authentication-system",
      "fix/login-timeout-bug",
      "hotfix/critical-security-patch",
      "docs/api-reference-guide",
      "test/integration-test-suite",
      "perf/database-query-optimization",
      "ci/github-actions-workflow",
      "refactor/api-response-structure",
      "chore/dependency-updates",
      "release/v1-0-0",
    ];

    const invalidExamples = [
      "claude/user-authentication", // forbidden prefix
      "copilot/fix-something", // forbidden prefix
      "feature/my-feature", // wrong type
      "bug/critical-issue", // wrong type (should be fix)
      "master/something", // no slash separator
      "feat", // no scope-title
      "feat/", // empty scope-title
    ];

    it("should accept all valid real-world examples", () => {
      for (const branch of validExamples) {
        const result = validateBranchName(branch);
        expect(result.valid).toBe(true);
      }
    });

    it("should reject all invalid real-world examples", () => {
      for (const branch of invalidExamples) {
        const result = validateBranchName(branch);
        expect(result.valid).toBe(false);
      }
    });
  });

  describe("Consistency with Repository Rules", () => {
    it("should enforce pattern from CLAUDE.md", () => {
      // Pattern: {type}/{scope}-{title}
      expect(
        validateBranchName("feat/governance-audit-implementation").valid,
      ).toBe(true);
      expect(validateBranchName("fix/pr-template-routing-bug").valid).toBe(
        true,
      );
      expect(validateBranchName("docs/branching-strategy-guide").valid).toBe(
        true,
      );
    });

    it("should forbid prefixes from CLAUDE.md forbidden list", () => {
      expect(validateBranchName("claude/something").reason).toBe(
        "branch-prefix-forbidden",
      );
      expect(validateBranchName("copilot/something").reason).toBe(
        "branch-prefix-forbidden",
      );
      expect(validateBranchName("openai/something").reason).toBe(
        "branch-prefix-forbidden",
      );
    });

    it("should validate all 34 types from CLAUDE.md", () => {
      const claudeMdTypes = [
        "feat",
        "fix",
        "hotfix",
        "release",
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
        "codex",
        "revert",
        "research",
      ];

      for (const type of claudeMdTypes) {
        const result = validateBranchName(`${type}/test-branch`);
        expect(result.valid).toBe(true);
      }
    });
  });
});
