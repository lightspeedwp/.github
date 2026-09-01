/* global describe, test, expect */
/**
 * Unit tests for branch name validation script.
 *
 * Tests the validateBranchName function against:
 * - All 30+ allowed branch types
 * - Valid kebab-case naming
 * - Invalid formats (uppercase, underscores, missing parts)
 * - Protected and bot branches
 * - Edge cases (empty string, special characters, very long names)
 *
 * @module scripts/validation/__tests__/validate-branch-name.test.cjs
 */

const {
  validateBranchName,
  ALLOWED_TYPES,
  BRANCH_PATTERN,
  BRANCH_PATTERN_STANDARD,
  BRANCH_PATTERN_RELEASE_SEMVER,
  BRANCH_PATTERN_RELEASE_STANDARD,
  PROTECTED_BRANCHES,
  BOT_PREFIXES,
} = require("../validate-branch-name.cjs");

describe("validate-branch-name", () => {
  describe("CLI output", () => {
    test("should describe BRANCH_PATTERN as non-release in --show-pattern output", () => {
      const { spawnSync } = require("child_process");
      const result = spawnSync(process.execPath, ["scripts/validation/validate-branch-name.cjs", "--show-pattern"], {
        encoding: "utf8",
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("BRANCH_PATTERN (standard, non-release):");
      expect(result.stdout).toContain("BRANCH_PATTERN_RELEASE_SEMVER:");
      expect(result.stdout).toContain("BRANCH_PATTERN_RELEASE_STANDARD:");
      expect(result.stdout).toContain("release/v1.2.3");
    });
  });

  describe("ALLOWED_TYPES", () => {
    test("should contain at least 30 types", () => {
      expect(ALLOWED_TYPES.length).toBeGreaterThanOrEqual(30);
    });

    test("should include all core branch types", () => {
      const coreTypes = [
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
        "revert",
        "research",
        "design",
        "a11y",
        "ux",
        "i18n",
        "ops",
      ];

      coreTypes.forEach((type) => {
        expect(ALLOWED_TYPES).toContain(type);
      });
    });

    test("should be lowercase", () => {
      ALLOWED_TYPES.forEach((type) => {
        expect(type).toBe(type.toLowerCase());
      });
    });
  });

  describe("BRANCH_PATTERN", () => {
    test("should be a valid RegExp", () => {
      expect(BRANCH_PATTERN).toBeInstanceOf(RegExp);
    });

    test("should require type prefix", () => {
      expect(BRANCH_PATTERN.test("feat/my-feature")).toBe(true);
      expect(BRANCH_PATTERN.test("my-feature")).toBe(false);
    });

    test("should require scope-title format with hyphen", () => {
      expect(BRANCH_PATTERN.test("feat/scope-title")).toBe(true);
      expect(BRANCH_PATTERN.test("feat/scope_title")).toBe(false);
      expect(BRANCH_PATTERN.test("feat/scopetitle")).toBe(false);
    });

    test("should enforce lowercase only", () => {
      expect(BRANCH_PATTERN.test("feat/my-Feature")).toBe(false);
      expect(BRANCH_PATTERN.test("feat/My-feature")).toBe(false);
      expect(BRANCH_PATTERN.test("Feat/my-feature")).toBe(false);
    });

    test("should reject underscores", () => {
      expect(BRANCH_PATTERN.test("feat/my_feature")).toBe(false);
      expect(BRANCH_PATTERN.test("feat/my-feature_name")).toBe(false);
    });

    test("should reject dots", () => {
      expect(BRANCH_PATTERN.test("feat/my.feature")).toBe(false);
    });

    test("should be the standard non-release pattern", () => {
      expect(BRANCH_PATTERN).toBe(BRANCH_PATTERN_STANDARD);
      expect(BRANCH_PATTERN.test("release/v1.2.3")).toBe(false);
      expect(BRANCH_PATTERN_RELEASE_SEMVER.test("release/v1.2.3")).toBe(true);
      expect(BRANCH_PATTERN_RELEASE_STANDARD.test("release/v1-2-3")).toBe(true);
    });
  });

  describe("validateBranchName", () => {
    describe("valid branches", () => {
      const validBranches = [
        "feat/branch-naming-enforcement",
        "fix/validation-script-bug",
        "chore/update-dependencies",
        "docs/branching-strategy-guide",
        "hotfix/critical-security-patch",
        "release/v1-0-0",
        "refactor/simplify-validation",
        "test/add-branch-validation-tests",
        "perf/optimize-validation-regex",
        "ci/update-github-actions",
        "build/fix-build-pipeline",
        "deps/bump-node-version",
        "security/sanitize-user-input",
        "revert/undo-bad-deployment",
        "research/explore-alternatives",
        "design/new-ui-components",
        "a11y/wcag-2-2-compliance",
        "ux/improve-error-messages",
        "i18n/add-spanish-translations",
        "ops/scale-infrastructure",
        "proto/experimental-feature",
        "ds/design-system-updates",
        "api/add-new-endpoints",
        "schema/add-json-schema",
        "telemetry/track-user-events",
        "content/update-blog-posts",
        "seo/improve-meta-tags",
        "config/update-eslint-rules",
        "migrate/move-legacy-code",
        "qa/add-regression-tests",
        "uat/test-new-feature",
        "audit/code-quality-audit",
        "codex/update-documentation",
      ];

      validBranches.forEach((branch) => {
        test(`should accept '${branch}'`, () => {
          const result = validateBranchName(branch);
          expect(result.valid).toBe(true);
          expect(result.message).toBeUndefined();
        });
      });
    });

    describe("invalid branches", () => {
      const invalidBranches = [
        {
          name: "claude/my-branch",
          reason: "forbidden prefix",
        },
        {
          name: "Feature/MyBranch",
          reason: "uppercase type",
        },
        {
          name: "fix-bug",
          reason: "missing type prefix",
        },
        {
          name: "feat/my_feature",
          reason: "underscore not allowed",
        },
        {
          name: "feat/MyFeature",
          reason: "uppercase in slug",
        },
        {
          name: "feat/my.feature",
          reason: "dot not allowed",
        },
        {
          name: "feat/my feature",
          reason: "space not allowed",
        },
        {
          name: "feat/mysingleword",
          reason: "missing hyphen separator",
        },
        {
          name: "feat/",
          reason: "missing scope and title",
        },
        {
          name: "feat/scope-",
          reason: "missing title after hyphen",
        },
        {
          name: "feat/-title",
          reason: "missing scope before hyphen",
        },
        {
          name: "feat/scope--title",
          reason: "double hyphen",
        },
        {
          name: "/scope-title",
          reason: "missing type",
        },
        {
          name: "FEAT/my-feature",
          reason: "uppercase type",
        },
        {
          name: "feat/MY-FEATURE",
          reason: "uppercase slug",
        },
        {
          name: "invalid/scope-title",
          reason: "type not in allowed list",
        },
      ];

      invalidBranches.forEach(({ name, reason }) => {
        test(`should reject '${name}' (${reason})`, () => {
          const result = validateBranchName(name);
          expect(result.valid).toBe(false);
          expect(result.message).toBeDefined();
          expect(result.message).toContain(
            "does not follow the naming pattern",
          );
        });
      });
    });

    describe("protected and bot branches", () => {
      test('should allow protected branch "main"', () => {
        const result = validateBranchName("main");
        expect(result.valid).toBe(true);
      });

      test('should allow protected branch "develop"', () => {
        const result = validateBranchName("develop");
        expect(result.valid).toBe(true);
      });

      test("should allow dependabot branches", () => {
        const result = validateBranchName(
          "dependabot/npm_and_yarn/lodash-4.17.21",
        );
        expect(result.valid).toBe(true);
      });

      test("should allow renovate branches", () => {
        const result = validateBranchName("renovate/update-dependencies");
        expect(result.valid).toBe(true);
      });
    });

    describe("edge cases", () => {
      test("should reject empty string", () => {
        const result = validateBranchName("");
        expect(result.valid).toBe(false);
      });

      test("should reject null", () => {
        const result = validateBranchName(null);
        expect(result.valid).toBe(false);
      });

      test("should reject undefined", () => {
        const result = validateBranchName(undefined);
        expect(result.valid).toBe(false);
      });

      test("should handle very long valid branch names", () => {
        const longScope = "a".repeat(50);
        const longTitle = "b".repeat(50);
        const branch = `feat/${longScope}-${longTitle}`;
        const result = validateBranchName(branch);
        expect(result.valid).toBe(true);
      });

      test("should reject branches with special characters", () => {
        const specialChars = [
          "@",
          "#",
          "$",
          "%",
          "^",
          "&",
          "*",
          "(",
          ")",
          "=",
          "+",
          "[",
          "]",
          "{",
          "}",
          "|",
          ";",
          ":",
          '"',
          "'",
          "<",
          ">",
          ",",
          "?",
          "/",
        ];

        specialChars.forEach((char) => {
          const result = validateBranchName(`feat/my${char}feature`);
          expect(result.valid).toBe(false);
        });
      });

      test("should allow hyphens in scope and title", () => {
        const result = validateBranchName("feat/my-multi-word-scope-title");
        expect(result.valid).toBe(true);
      });

      test("should allow numbers in scope and title", () => {
        const result = validateBranchName("feat/v1-2-3");
        expect(result.valid).toBe(true);
      });

      test("should allow mixed numbers and letters", () => {
        const result = validateBranchName("feat/add-feature-123-name");
        expect(result.valid).toBe(true);
      });
    });

    describe("verbose output", () => {
      test("should include message in valid result when verbose is false", () => {
        const result = validateBranchName("feat/my-feature", {
          verbose: false,
        });
        expect(result.valid).toBe(true);
        expect(result.message).toBeUndefined();
      });

      test("should return message field even for invalid branches", () => {
        const result = validateBranchName("invalid-branch");
        expect(result.valid).toBe(false);
        expect(result.message).toBeDefined();
        expect(typeof result.message).toBe("string");
      });

      test("error message should include examples", () => {
        const result = validateBranchName("bad-branch");
        expect(result.message).toContain("Valid examples:");
        expect(result.message).toContain("Invalid examples:");
      });

      test("error message should reference BRANCHING_STRATEGY.md", () => {
        const result = validateBranchName("bad-branch");
        expect(result.message).toContain("BRANCHING_STRATEGY.md");
      });
    });

    describe("format verification", () => {
      test("valid branch should match pattern exactly", () => {
        const validBranch = "feat/my-feature";
        expect(BRANCH_PATTERN.test(validBranch)).toBe(true);
        const result = validateBranchName(validBranch);
        expect(result.valid).toBe(true);
      });

      test("invalid branch should not match pattern", () => {
        const invalidBranch = "feat/MyFeature";
        expect(BRANCH_PATTERN.test(invalidBranch)).toBe(false);
        const result = validateBranchName(invalidBranch);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe("PROTECTED_BRANCHES", () => {
    test("should contain main and develop", () => {
      expect(PROTECTED_BRANCHES.has("main")).toBe(true);
      expect(PROTECTED_BRANCHES.has("develop")).toBe(true);
    });

    test("should be a Set", () => {
      expect(PROTECTED_BRANCHES).toBeInstanceOf(Set);
    });
  });

  describe("BOT_PREFIXES", () => {
    test("should be a RegExp", () => {
      expect(BOT_PREFIXES).toBeInstanceOf(RegExp);
    });

    test("should match dependabot prefix", () => {
      expect(BOT_PREFIXES.test("dependabot/some-update")).toBe(true);
    });

    test("should match renovate prefix", () => {
      expect(BOT_PREFIXES.test("renovate/some-update")).toBe(true);
    });

    test("should not match non-bot branches", () => {
      expect(BOT_PREFIXES.test("feat/my-feature")).toBe(false);
      expect(BOT_PREFIXES.test("fix/bug")).toBe(false);
    });
  });
});
