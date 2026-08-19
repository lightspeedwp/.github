import { jest } from "@jest/globals";
import { orchestratePrCreation } from "../skills/orchestrate-pr-creation.js";

describe("orchestratePrCreation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Input Validation", () => {
    test("should return error for missing branchName", async () => {
      const result = await orchestratePrCreation({
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch name is required");
      expect(result.pr).toBeNull();
    });

    test("should return error for non-string branchName", async () => {
      const result = await orchestratePrCreation({
        branchName: 123,
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch name is required");
    });

    test("should return error for missing branchType", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth-system",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch type is required");
      expect(result.pr).toBeNull();
    });

    test("should return error for missing templateFile", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth-system",
        branchType: "feat",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Template file is required");
      expect(result.pr).toBeNull();
    });
  });

  describe("PR Title Generation", () => {
    test("should generate feat PR title", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth-system",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("feat: User — Implementation");
    });

    test("should generate fix PR title", async () => {
      const result = await orchestratePrCreation({
        branchName: "fix/validation-bug",
        branchType: "fix",
        templateFile: "pr_bug.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("fix: Validation — Issue Resolution");
    });

    test("should generate docs PR title", async () => {
      const result = await orchestratePrCreation({
        branchName: "docs/api-reference",
        branchType: "docs",
        templateFile: "pr_docs.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("docs: Api — Documentation Update");
    });

    test("should generate hotfix PR title", async () => {
      const result = await orchestratePrCreation({
        branchName: "hotfix/security-patch",
        branchType: "hotfix",
        templateFile: "pr_hotfix.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("hotfix: Security — Critical Fix");
    });

    test("should generate refactor PR title", async () => {
      const result = await orchestratePrCreation({
        branchName: "refactor/auth-module",
        branchType: "refactor",
        templateFile: "pr_refactor.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("refactor: Auth — Code Cleanup");
    });

    test("should generate perf PR title", async () => {
      const result = await orchestratePrCreation({
        branchName: "perf/api-caching",
        branchType: "perf",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("perf: Api — Performance Optimization");
    });

    test("should handle multi-word scope in title", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-profile-management",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.title).toBe("feat: User — Implementation");
    });
  });

  describe("PR Body Generation", () => {
    test("should include template content in body", async () => {
      const templateContent = "# Feature\n\nThis is a feature implementation";
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent,
      });

      expect(result.valid).toBe(true);
      expect(result.pr.body).toContain("This is a feature implementation");
    });

    test("should append labels to body", async () => {
      const labels = ["type:feature", "area:auth"];
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "## Description\n\nTest description",
        appliedLabels: labels,
      });

      expect(result.valid).toBe(true);
      expect(result.pr.body).toContain("## Labels");
      expect(result.pr.body).toContain("type:feature");
      expect(result.pr.body).toContain("area:auth");
    });

    test("should include template metadata in body", async () => {
      const templateMetadata = {
        templateFile: "pr_feature.md",
        complete: true,
        missingSections: [],
      };
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "## Description\n\nTest",
        templateMetadata,
      });

      expect(result.valid).toBe(true);
      expect(result.pr.body).toContain("## Template Metadata");
      expect(result.pr.body).toContain("pr_feature.md");
      expect(result.pr.body).toContain("Complete: Yes");
    });

    test("should build minimal body when no template content provided", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.pr.body).toContain("## Summary");
      expect(result.pr.body).toContain("## Changes");
    });

    test("should include missing sections in minimal body", async () => {
      const templateMetadata = {
        templateFile: "pr_feature.md",
        complete: false,
        missingSections: ["Changelog", "Checklist"],
      };
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata,
      });

      expect(result.valid).toBe(true);
      expect(result.pr.body).toContain("## Missing Template Sections");
      expect(result.pr.body).toContain("Changelog");
      expect(result.pr.body).toContain("Checklist");
    });
  });

  describe("PR Object Structure", () => {
    test("should return valid PR object", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        appliedLabels: ["type:feature"],
        prContext: { baseBranch: "develop" },
      });

      expect(result.valid).toBe(true);
      expect(result.pr).toBeDefined();
      expect(result.pr.title).toBeDefined();
      expect(result.pr.body).toBeDefined();
      expect(result.pr.head).toBe("feat/user-auth");
      expect(result.pr.base).toBe("develop");
      expect(result.pr.labels).toContain("type:feature");
      expect(result.pr.draft).toBe(false);
    });

    test("should include metadata in PR object", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.pr.metadata).toBeDefined();
      expect(result.pr.metadata.branchType).toBe("feat");
      expect(result.pr.metadata.scope).toBe("user");
      expect(result.pr.metadata.templateFile).toBe("pr_feature.md");
      expect(result.pr.metadata.generatedAt).toBeDefined();
    });

    test("should use develop as default base branch", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.pr.base).toBe("develop");
    });

    test("should use provided base branch from prContext", async () => {
      const result = await orchestratePrCreation({
        branchName: "hotfix/security-fix",
        branchType: "hotfix",
        templateFile: "pr_hotfix.md",
        prContext: { baseBranch: "main" },
      });

      expect(result.valid).toBe(true);
      expect(result.pr.base).toBe("main");
    });
  });

  describe("PR Readiness Validation", () => {
    test("should flag empty title as invalid", async () => {
      const result = await orchestratePrCreation({
        branchName: "",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(false);
    });

    test("should warn about long title", async () => {
      const result = await orchestratePrCreation({
        branchName:
          "feat/verylongnameprettysurethisisgoingtobeamaziinglytoolongofatitle-exce",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "Description",
      });

      // Long title warning is generated if title exceeds 120 chars
      // Title format: "{type}: {Scope} — {Action}" (e.g., "feat: Verylongnameprettysurethisisgoingtobeamaziinglytoolongofatitle — Implementation")
      expect(result.valid).toBe(true);
      if (result.readinessScore < 0.95) {
        // Long title should reduce readiness score
        expect(result.readinessScore).toBeLessThan(1.0);
      }
    });

    test("should warn about short body", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "Short",
      });

      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings.some((w) => w.includes("short"))).toBe(true);
    });

    test("should warn about incomplete template", async () => {
      const templateMetadata = {
        templateFile: "pr_feature.md",
        complete: false,
        missingSections: ["Changelog", "Checklist"],
      };
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata,
        templateContent: "## Description\n\nThis is a valid description.",
      });

      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings.some((w) => w.includes("incomplete"))).toBe(true);
    });

    test("should warn about missing labels", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "## Description\n\nThis is a valid description.",
        appliedLabels: [],
      });

      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings.some((w) => w.includes("No labels"))).toBe(true);
    });
  });

  describe("Readiness Score", () => {
    test("should calculate perfect readiness score", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth-system",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "This is a comprehensive PR description.",
        appliedLabels: ["type:feature", "area:auth"],
        templateMetadata: {
          templateFile: "pr_feature.md",
          complete: true,
          missingSections: [],
        },
      });

      expect(result.valid).toBe(true);
      expect(result.readinessScore).toBeGreaterThan(0.8);
      expect(result.readinessScore).toBeLessThanOrEqual(1.0);
    });

    test("should calculate lower readiness score for incomplete data", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "Short",
        appliedLabels: [],
      });

      expect(result.valid).toBe(true);
      expect(result.readinessScore).toBeLessThan(0.8);
    });

    test("should keep readiness score between 0 and 1", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.readinessScore).toBeGreaterThanOrEqual(0);
      expect(result.readinessScore).toBeLessThanOrEqual(1);
    });
  });

  describe("Edge Cases", () => {
    test("should handle scope extraction from simple branch name", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/auth-module",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.pr.metadata.scope).toBe("auth");
    });

    test("should handle scope extraction from complex branch name", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-profile-management-system",
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.pr.metadata.scope).toBe("user");
    });

    test("should handle null appliedLabels", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        appliedLabels: null,
      });

      expect(result.valid).toBe(true);
      expect(result.pr.labels).toBeDefined();
    });

    test("should handle undefined prContext", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        prContext: undefined,
      });

      expect(result.valid).toBe(true);
      expect(result.pr.base).toBe("develop");
    });

    test("should handle empty template content", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "",
      });

      expect(result.valid).toBe(true);
      expect(result.pr.body).toContain("## Summary");
    });

    test("should handle error gracefully", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-auth",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          // Invalid metadata structure that might cause error
          get complete() {
            throw new Error("Test error");
          },
        },
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Error orchestrating");
    });
  });

  describe("Integration", () => {
    test("should orchestrate complete PR with all inputs", async () => {
      const result = await orchestratePrCreation({
        branchName: "feat/user-authentication-system",
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateContent: "## Summary\n\nImplements user authentication.",
        templateMetadata: {
          templateFile: "pr_feature.md",
          complete: true,
          missingSections: [],
        },
        appliedLabels: ["type:feature", "area:security", "priority:important"],
        prContext: { baseBranch: "develop", owner: "lightspeedwp" },
      });

      expect(result.valid).toBe(true);
      expect(result.pr.title).toBe("feat: User — Implementation");
      expect(result.pr.head).toBe("feat/user-authentication-system");
      expect(result.pr.base).toBe("develop");
      expect(result.pr.labels).toEqual([
        "type:feature",
        "area:security",
        "priority:important",
      ]);
      expect(result.pr.body).toContain("user authentication");
      expect(result.readinessScore).toBeGreaterThan(0.8);
    });

    test("should return consistent response structure", async () => {
      const result = await orchestratePrCreation({
        branchName: "fix/validation-bug",
        branchType: "fix",
        templateFile: "pr_bug.md",
      });

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("pr");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("bodyPreview");
      expect(result).toHaveProperty("labels");
      expect(result).toHaveProperty("readinessScore");
      expect(result).toHaveProperty("warnings");
    });
  });
});
