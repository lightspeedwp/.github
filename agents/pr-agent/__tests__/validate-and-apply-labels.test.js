import { jest } from "@jest/globals";
import { validateAndApplyLabels } from "../skills/validate-and-apply-labels.js";

describe("validateAndApplyLabels", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Input Validation", () => {
    test("should return error for missing branchType", async () => {
      const result = await validateAndApplyLabels({
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch type is required");
      expect(result.appliedLabels).toEqual([]);
    });

    test("should return error for non-string branchType", async () => {
      const result = await validateAndApplyLabels({
        branchType: 123,
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Branch type is required");
    });

    test("should return error for missing templateFile", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Template file is required");
      expect(result.branchType).toBe("feat");
    });

    test("should return error for non-string templateFile", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: 123,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Template file is required");
    });
  });

  describe("Branch Type Label Mapping", () => {
    test("should map feat to type:feature", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:feature");
    });

    test("should map fix to type:bug", async () => {
      const result = await validateAndApplyLabels({
        branchType: "fix",
        templateFile: "pr_bug.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:bug");
    });

    test("should map docs to type:documentation", async () => {
      const result = await validateAndApplyLabels({
        branchType: "docs",
        templateFile: "pr_docs.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:documentation");
    });

    test("should map hotfix to type:bug and priority:critical", async () => {
      const result = await validateAndApplyLabels({
        branchType: "hotfix",
        templateFile: "pr_hotfix.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:bug");
      expect(result.appliedLabels).toContain("priority:critical");
    });

    test("should map security appropriately", async () => {
      const result = await validateAndApplyLabels({
        branchType: "security",
        templateFile: "pr_bug.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels.length).toBeGreaterThan(0);
    });

    test("should map ci to type:build-ci", async () => {
      const result = await validateAndApplyLabels({
        branchType: "ci",
        templateFile: "pr_ci.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:build-ci");
    });

    test("should map test to type:testing-coverage", async () => {
      const result = await validateAndApplyLabels({
        branchType: "test",
        templateFile: "pr_chore.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:testing-coverage");
    });

    test("should map a11y to type:feature and area:a11y", async () => {
      const result = await validateAndApplyLabels({
        branchType: "a11y",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:feature");
      expect(result.appliedLabels).toContain("area:a11y");
    });

    test("should support all 30+ documented branch types", async () => {
      const branchTypes = [
        "feat",
        "fix",
        "docs",
        "hotfix",
        "refactor",
        "chore",
        "ci",
        "test",
        "security",
        "design",
        "a11y",
        "ux",
        "release",
        "research",
        "revert",
        "i18n",
        "ops",
        "perf",
        "build",
        "deps",
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
      ];

      for (const branchType of branchTypes) {
        const result = await validateAndApplyLabels({
          branchType,
          templateFile: "pr_feature.md",
        });

        expect(result.valid).toBe(true);
        expect(result.appliedLabels.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Template Metadata Context Labels", () => {
    test("should add meta:needs-more-info when template has missing sections", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          missingSections: ["Changelog", "Checklist"],
          complete: false,
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("meta:needs-more-info");
    });

    test("should add meta:ready-for-review when template is complete", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          missingSections: [],
          complete: true,
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("meta:ready-for-review");
    });

    test("should not add meta labels when metadata is null", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: null,
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).not.toContain("meta:needs-more-info");
      expect(result.appliedLabels).not.toContain("meta:ready-for-review");
    });

    test("should not add meta:ready-for-review when missing sections exist", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          missingSections: ["Changelog"],
          complete: false,
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("meta:needs-more-info");
      expect(result.appliedLabels).not.toContain("meta:ready-for-review");
    });
  });

  describe("Label Validation", () => {
    test("should validate labels against canonical set", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
      });

      expect(result.valid).toBe(true);
      expect(result.validationErrors.length).toBe(0);
      // All applied labels should be in canonical set
      result.appliedLabels.forEach((label) => {
        expect(label).toMatch(/^(type|status|priority|area|meta|wp):/);
      });
    });

    test("should reject invalid labels with descriptive error", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: { feat: ["type:feature", "invalid:label"] },
          canonicalLabels: ["type:feature"],
        },
      });

      expect(result.valid).toBe(false);
      expect(result.validationErrors.length).toBeGreaterThan(0);
      expect(result.validationErrors[0]).toContain("not found in canonical");
    });

    test("should warn about bare type labels", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: { feat: ["type:feature", "bug"] },
        },
      });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain("looks like a bare type label");
    });

    test("should remove duplicate labels", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: { feat: ["type:feature", "type:feature"] },
        },
      });

      expect(result.valid).toBe(true);
      const featureCount = result.appliedLabels.filter(
        (l) => l === "type:feature",
      ).length;
      expect(featureCount).toBe(1);
    });
  });

  describe("Custom Configuration", () => {
    test("should use custom branch type labels when provided", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: {
            feat: ["type:feature", "area:docs"],
          },
          canonicalLabels: [
            "type:feature",
            "type:bug",
            "area:docs",
            "meta:ready-for-review",
          ],
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("type:feature");
      expect(result.appliedLabels).toContain("area:docs");
    });

    test("should use custom canonical labels when provided", async () => {
      const customLabels = ["custom:label1", "custom:label2"];
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: {
            feat: ["custom:label1"],
          },
          canonicalLabels: customLabels,
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("custom:label1");
    });
  });

  describe("WordPress-Specific Labels", () => {
    test("should include WordPress-specific labels in canonical set", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: { feat: ["type:feature", "wp:plugin"] },
          canonicalLabels: ["type:feature", "wp:plugin", "wp:theme"],
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("wp:plugin");
    });
  });

  describe("Error Handling", () => {
    test("should handle unexpected errors gracefully", async () => {
      // Create a config that will cause an error during processing
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          // This will cause an error if not handled properly
          missingSections: null,
          complete: "invalid",
        },
      });

      // Should still return a valid result structure
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("appliedLabels");
      expect(result).toHaveProperty("validationErrors");
    });

    test("should maintain consistent result structure on error", async () => {
      const result = await validateAndApplyLabels({
        branchType: null,
      });

      expect(result).toHaveProperty("valid", false);
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("appliedLabels");
      expect(result).toHaveProperty("validationErrors");
      expect(result).toHaveProperty("warnings");
    });
  });

  describe("Integration", () => {
    test("should combine branch type labels and context labels", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          missingSections: [],
          complete: true,
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels.length).toBeGreaterThanOrEqual(2);
      expect(result.appliedLabels).toContain("type:feature");
      expect(result.appliedLabels).toContain("meta:ready-for-review");
    });

    test("should return complete metadata structure on success", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {
          missingSections: [],
          complete: true,
        },
      });

      expect(result.valid).toBe(true);
      expect(result.branchType).toBe("feat");
      expect(result.templateFile).toBe("pr_feature.md");
      expect(result.appliedLabels).toBeDefined();
      expect(Array.isArray(result.appliedLabels)).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.typeLabels).toBeDefined();
      expect(result.metadata.contextLabels).toBeDefined();
      expect(result.metadata.totalLabels).toBeGreaterThan(0);
    });

    test("should handle complete workflow with all optional parameters", async () => {
      const result = await validateAndApplyLabels({
        branchType: "security",
        templateFile: "pr_bug.md",
        templateMetadata: {
          missingSections: ["Changelog"],
          complete: false,
          sections: ["Linked issues", "Changelog"],
        },
        prContext: {
          owner: "lightspeedwp",
          repo: ".github",
          prNumber: 1979,
        },
        config: {
          branchTypeLabels: {
            security: ["type:bug", "type:security"],
          },
          canonicalLabels: [
            "type:bug",
            "type:security",
            "meta:needs-more-info",
          ],
        },
      });

      expect(result.valid).toBe(true);
      expect(result.branchType).toBe("security");
      expect(result.appliedLabels).toContain("type:bug");
      expect(result.appliedLabels).toContain("meta:needs-more-info");
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty template metadata", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        templateMetadata: {},
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels.length).toBeGreaterThan(0);
    });

    test("should handle branch type with no mapped labels", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: {},
        },
      });

      // Should still be valid, just with no branch type labels
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("appliedLabels");
    });

    test("should handle very long label names", async () => {
      const longLabel = "type:" + "a".repeat(100);
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: { feat: [longLabel] },
        },
      });

      // Should handle gracefully
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("validationErrors");
    });

    test("should handle special characters in labels", async () => {
      const result = await validateAndApplyLabels({
        branchType: "feat",
        templateFile: "pr_feature.md",
        config: {
          branchTypeLabels: {
            feat: ["type:feature", "area:docs/api"],
          },
          canonicalLabels: ["type:feature", "area:docs/api"],
        },
      });

      expect(result.valid).toBe(true);
      expect(result.appliedLabels).toContain("area:docs/api");
    });
  });
});
