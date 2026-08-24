import { validateBranchName } from "../skills/validate-branch-name.js";

describe("Skill: validate-branch-name", () => {
  // ===== VALID BRANCH NAMES =====

  describe("Valid branch names", () => {
    test("should validate valid feature branch", async () => {
      const result = await validateBranchName({
        branchName: "feat/user-authentication",
        config: { allowed_types: ["feat", "fix"] },
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.type).toBe("feat");
      expect(result.scope).toBe("user");
      expect(result.shortTitle).toBe("authentication");
    });

    test("should validate valid fix branch", async () => {
      const result = await validateBranchName({
        branchName: "fix/button-styling",
        config: { allowed_types: ["feat", "fix"] },
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("fix");
      expect(result.scope).toBe("button");
      expect(result.shortTitle).toBe("styling");
    });

    test("should validate branch with numbers", async () => {
      const result = await validateBranchName({
        branchName: "feat/api-v2-integration",
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("feat");
    });

    test("should validate single-word scope and title", async () => {
      const result = await validateBranchName({
        branchName: "docs/doc-updates",
        config: { allowed_types: ["docs"] },
      });

      expect(result.valid).toBe(true);
      expect(result.scope).toBe("doc");
      expect(result.shortTitle).toBe("updates");
    });

    test("should validate docs branch", async () => {
      const result = await validateBranchName({
        branchName: "docs/api-reference",
        config: { allowed_types: ["docs"] },
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("docs");
    });

    test("should validate chore branch", async () => {
      const result = await validateBranchName({
        branchName: "chore/deps-update",
        config: { allowed_types: ["chore"] },
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("chore");
    });

    test("should validate ci branch", async () => {
      const result = await validateBranchName({
        branchName: "ci/github-workflows",
        config: { allowed_types: ["ci"] },
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("ci");
    });

    test("should use default allowed types when not provided", async () => {
      const result = await validateBranchName({
        branchName: "feat/test-feature",
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("feat");
    });
  });

  // ===== INVALID FORMAT =====

  describe("Invalid format", () => {
    test("should reject branch without forward slash", async () => {
      const result = await validateBranchName({
        branchName: "feat-test-branch",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("does not match required format");
      expect(result.errors.some((e) => e.includes("forward slash"))).toBe(true);
    });

    test("should reject branch without hyphens", async () => {
      const result = await validateBranchName({
        branchName: "feat/testbranch",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Missing hyphen"))).toBe(
        true,
      );
    });

    test("should reject empty branch name", async () => {
      const result = await validateBranchName({
        branchName: "",
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("required");
    });

    test("should reject null branch name", async () => {
      const result = await validateBranchName({
        branchName: null,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("required");
    });

    test("should reject non-string branch name", async () => {
      const result = await validateBranchName({
        branchName: 12345,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("must be a string");
    });

    test("should reject uppercase characters", async () => {
      const result = await validateBranchName({
        branchName: "feat/TestBranch",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("lowercase"))).toBe(true);
    });

    test("should reject underscores", async () => {
      const result = await validateBranchName({
        branchName: "feat/test_branch",
      });

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes("hyphens") || e.includes("underscores"),
        ),
      ).toBe(true);
    });

    test("should reject special characters", async () => {
      const result = await validateBranchName({
        branchName: "feat/test@branch",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  // ===== INVALID TYPE =====

  describe("Invalid branch type", () => {
    test("should reject unknown branch type", async () => {
      const result = await validateBranchName({
        branchName: "unknown/test-branch",
        config: { allowed_types: ["feat", "fix"] },
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("not allowed"))).toBe(true);
      expect(result.errors.some((e) => e.includes("Allowed types"))).toBe(true);
    });

    test("should reject type not in allowed list", async () => {
      const result = await validateBranchName({
        branchName: "experimental/new-feature",
        config: { allowed_types: ["feat", "fix", "chore"] },
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("experimental");
    });

    test("should show all allowed types in error message", async () => {
      const allowedTypes = ["feat", "fix", "docs"];
      const result = await validateBranchName({
        branchName: "invalid/test-branch",
        config: { allowed_types: allowedTypes },
      });

      expect(result.valid).toBe(false);
      const errorMsg = result.errors[0];
      for (const type of allowedTypes) {
        expect(errorMsg).toContain(type);
      }
    });
  });

  // ===== SCOPE VALIDATION =====

  describe("Scope validation", () => {
    test("should reject empty scope", async () => {
      const result = await validateBranchName({
        branchName: "feat//-test",
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(false);
    });

    test("should accept max-length scope (50 chars)", async () => {
      const scope = "a".repeat(50);
      const result = await validateBranchName({
        branchName: `feat/${scope}-title`,
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(true);
      expect(result.scope).toBe(scope);
    });

    test("should reject scope over 50 chars", async () => {
      const scope = "a".repeat(51);
      const result = await validateBranchName({
        branchName: `feat/${scope}-title`,
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Scope"))).toBe(true);
    });

    test("should warn on long scope (31+ chars)", async () => {
      const scope = "a".repeat(31);
      const result = await validateBranchName({
        branchName: `feat/${scope}-title`,
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes("long"))).toBe(true);
    });
  });

  // ===== SHORT TITLE VALIDATION =====

  describe("Short title validation", () => {
    test("should reject empty short title", async () => {
      const result = await validateBranchName({
        branchName: "feat/scope-",
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(false);
    });

    test("should accept max-length title (50 chars)", async () => {
      const title = "a".repeat(50);
      const result = await validateBranchName({
        branchName: `feat/scope-${title}`,
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(true);
      expect(result.shortTitle).toBe(title);
    });

    test("should reject title over 50 chars", async () => {
      const title = "a".repeat(51);
      const result = await validateBranchName({
        branchName: `feat/scope-${title}`,
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Short title"))).toBe(true);
    });

    test("should warn on long title (31+ chars)", async () => {
      const title = "a".repeat(31);
      const result = await validateBranchName({
        branchName: `feat/scope-${title}`,
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(true);
      expect(result.warnings.some((e) => e.includes("long"))).toBe(true);
    });
  });

  // ===== WARNINGS =====

  describe("Warnings", () => {
    test("should warn on long overall branch name", async () => {
      const longBranch = "feat/" + "a".repeat(50) + "-" + "b".repeat(50);
      const result = await validateBranchName({
        branchName: longBranch,
        config: { allowed_types: ["feat"] },
      });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes("long"))).toBe(true);
    });

    test("should provide helpful error for missing slash", async () => {
      const result = await validateBranchName({
        branchName: "feat-test-branch",
      });

      expect(result.errors.some((e) => e.includes("forward slash"))).toBe(true);
    });

    test("should provide helpful error for missing hyphen", async () => {
      const result = await validateBranchName({
        branchName: "feat/testbranch",
      });

      expect(result.errors.some((e) => e.includes("hyphen"))).toBe(true);
    });
  });

  // ===== METADATA =====

  describe("Metadata", () => {
    test("should return correct metadata for valid branch", async () => {
      const result = await validateBranchName({
        branchName: "feat/user-auth",
        config: { allowed_types: ["feat"] },
      });

      expect(result.metadata).toEqual({
        format: "valid",
        length: 14,
        partsCount: 3,
      });
    });

    test("should parse branch components correctly", async () => {
      const result = await validateBranchName({
        branchName: "refactor/api-client",
        config: { allowed_types: ["refactor"] },
      });

      expect(result).toEqual({
        valid: true,
        errors: [],
        warnings: [],
        branchName: "refactor/api-client",
        type: "refactor",
        scope: "api",
        shortTitle: "client",
        metadata: {
          format: "valid",
          length: 19,
          partsCount: 3,
        },
      });
    });
  });

  // ===== REAL-WORLD EXAMPLES =====

  describe("Real-world examples", () => {
    test("should validate GitHub branching strategy examples", async () => {
      const branches = [
        "feat/new-api-endpoint",
        "fix/null-pointer-exception",
        "docs/api-documentation",
        "chore/upgrade-dependencies",
        "security/sql-injection-fix",
      ];

      for (const branch of branches) {
        const result = await validateBranchName({
          branchName: branch,
        });
        expect(result.valid).toBe(true);
      }
    });

    test("should handle WordPress-specific branch names", async () => {
      const branches = [
        "feat/post-type-custom",
        "fix/block-editor-compat",
        "docs/plugin-api-reference",
      ];

      for (const branch of branches) {
        const result = await validateBranchName({
          branchName: branch,
        });
        expect(result.valid).toBe(true);
      }
    });

    test("should reject common mistake patterns", async () => {
      const invalidBranches = [
        "feature/test", // Wrong type
        "feat_test_branch", // Underscores instead of hyphens
        "feat/Test-Branch", // Uppercase
        "feat test branch", // Spaces
        "feat/test", // Missing scope or title
      ];

      for (const branch of invalidBranches) {
        const result = await validateBranchName({
          branchName: branch,
          config: { allowed_types: ["feat", "fix", "feature"] },
        });
        expect(result.valid).toBe(false);
      }
    });
  });

  // ===== EDGE CASES =====

  describe("Edge cases", () => {
    test("should handle whitespace in branch name", async () => {
      const result = await validateBranchName({
        branchName: "feat/test branch",
      });

      expect(result.valid).toBe(false);
    });

    test("should handle multiple hyphens in title", async () => {
      const result = await validateBranchName({
        branchName: "feat/api-long-branch-name",
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("feat");
      expect(result.errors).toEqual([]);
    });

    test("should handle numbers throughout", async () => {
      const result = await validateBranchName({
        branchName: "feat/v2-integration",
        config: { allowed_types: ["feat"] },
      });

      expect(result.valid).toBe(true);
      expect(result.type).toBe("feat");
      expect(result.errors).toEqual([]);
    });

    test("should return consistent structure on invalid", async () => {
      const result = await validateBranchName({
        branchName: "invalid",
      });

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("type");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
