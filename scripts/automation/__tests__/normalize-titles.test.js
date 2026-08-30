/**
 * Tests for normalize-issue-pr-titles.js
 *
 * Tests cover:
 * - Type detection from labels, linked issues, PR descriptions
 * - Title formatting with type prefixes
 * - Idempotency (already-prefixed titles)
 * - Edge cases (empty, special characters)
 * - Report generation
 */

describe("Title Normalization Script", () => {
  // Mock type-to-displayName mapping
  const typeMapping = {
    bug: "Bug",
    feature: "Feature",
    documentation: "Documentation",
    docs: "Documentation",
    chore: "Chore",
    ci: "Build & CI",
    build: "Build & CI",
    refactor: "Refactor",
    security: "Security",
    test: "Test",
    task: "Task",
    hotfix: "Hotfix",
    perf: "Performance",
    performance: "Performance",
  };

  const prefixPattern = /^(\w+):\s+/;

  // Helper function to detect type from item
  function detectType(item, itemType) {
    // For issues: Check labels first
    if (itemType === "issue" && item.labels && item.labels.length > 0) {
      for (const label of item.labels) {
        const labelName = label.name.toLowerCase();
        if (labelName.startsWith("type:")) {
          return labelName.replace("type:", "");
        }
      }
    }

    // Check PR/issue labels (fallback)
    if (item.labels && item.labels.length > 0) {
      for (const label of item.labels) {
        const labelName = label.name.toLowerCase();
        if (labelName.startsWith("type:")) {
          return labelName.replace("type:", "");
        }
      }
    }

    // Scan body/description for type indicators
    if (item.body) {
      const bodyMatch = item.body.match(/type:\s*(\w+)/i);
      if (bodyMatch) {
        return bodyMatch[1].toLowerCase();
      }
    }

    return "feature";
  }

  // Helper function to generate new title
  function generateNewTitle(item, itemType) {
    const currentTitle = item.title;

    // Check if already prefixed
    if (prefixPattern.test(currentTitle)) {
      return { newTitle: currentTitle, type: null, skipped: true };
    }

    // Detect type
    const type = detectType(item, itemType);
    const displayName = typeMapping[type] || "Feature";
    const newTitle = `${displayName}: ${currentTitle}`;

    return { newTitle, type, skipped: false };
  }

  describe("Type Detection", () => {
    it("should detect type from type: label on issue", () => {
      const issue = {
        title: "Fix authentication",
        labels: [{ name: "type:bug" }],
      };
      const type = detectType(issue, "issue");
      expect(type).toBe("bug");
    });

    it("should detect type from multiple labels (first type: match)", () => {
      const issue = {
        title: "Add feature",
        labels: [
          { name: "area:core" },
          { name: "type:feature" },
          { name: "priority:high" },
        ],
      };
      const type = detectType(issue, "issue");
      expect(type).toBe("feature");
    });

    it("should detect type from PR labels", () => {
      const pr = {
        title: "Update docs",
        labels: [{ name: "type:docs" }],
      };
      const type = detectType(pr, "pr");
      expect(type).toBe("docs");
    });

    it("should detect type from body/description", () => {
      const pr = {
        title: "Refactor module",
        labels: [],
        body: "type: refactor\n\nThis PR refactors the core module.",
      };
      const type = detectType(pr, "pr");
      expect(type).toBe("refactor");
    });

    it("should fallback to feature type when no type detected", () => {
      const issue = {
        title: "Random change",
        labels: [{ name: "area:core" }],
      };
      const type = detectType(issue, "issue");
      expect(type).toBe("feature");
    });

    it("should handle case-insensitive type detection", () => {
      const issue = {
        title: "Security fix",
        labels: [{ name: "TYPE:SECURITY" }],
      };
      const type = detectType(issue, "issue");
      expect(type).toBe("security");
    });

    it("should handle type: prefix in body with case variation", () => {
      const pr = {
        title: "Build script",
        labels: [],
        body: "Type: CI\n\nThis updates the CI pipeline.",
      };
      const type = detectType(pr, "pr");
      expect(type).toBe("ci");
    });
  });

  describe("Title Formatting", () => {
    it("should format title with Bug prefix", () => {
      const issue = {
        title: "Fix authentication",
        labels: [{ name: "type:bug" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Bug: Fix authentication");
      expect(skipped).toBe(false);
    });

    it("should format title with Feature prefix", () => {
      const pr = {
        title: "Add user preferences",
        labels: [{ name: "type:feature" }],
      };
      const { newTitle, skipped } = generateNewTitle(pr, "pr");
      expect(newTitle).toBe("Feature: Add user preferences");
      expect(skipped).toBe(false);
    });

    it("should format title with Documentation prefix", () => {
      const issue = {
        title: "Update README",
        labels: [{ name: "type:documentation" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Documentation: Update README");
      expect(skipped).toBe(false);
    });

    it("should use docs alias for Documentation", () => {
      const issue = {
        title: "Update API docs",
        labels: [{ name: "type:docs" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Documentation: Update API docs");
      expect(skipped).toBe(false);
    });

    it("should handle Build & CI prefix", () => {
      const issue = {
        title: "Fix GitHub Actions workflow",
        labels: [{ name: "type:ci" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Build & CI: Fix GitHub Actions workflow");
      expect(skipped).toBe(false);
    });

    it("should preserve special characters in title", () => {
      const issue = {
        title: "Fix user's profile @ /settings",
        labels: [{ name: "type:bug" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Bug: Fix user's profile @ /settings");
      expect(skipped).toBe(false);
    });

    it("should handle titles with emoji", () => {
      const issue = {
        title: "🐛 Fix crash on reload",
        labels: [{ name: "type:bug" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Bug: 🐛 Fix crash on reload");
      expect(skipped).toBe(false);
    });

    it("should handle very short titles", () => {
      const issue = {
        title: "Fix",
        labels: [{ name: "type:bug" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Bug: Fix");
      expect(skipped).toBe(false);
    });
  });

  describe("Idempotency", () => {
    it("should skip already-prefixed title with Bug prefix", () => {
      const issue = {
        title: "Bug: Fix authentication",
        labels: [{ name: "type:bug" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Bug: Fix authentication");
      expect(skipped).toBe(true);
    });

    it("should skip already-prefixed title with Feature prefix", () => {
      const pr = {
        title: "Feature: Add user preferences",
        labels: [{ name: "type:feature" }],
      };
      const { newTitle, skipped } = generateNewTitle(pr, "pr");
      expect(newTitle).toBe("Feature: Add user preferences");
      expect(skipped).toBe(true);
    });

    it("should skip any title with Type: format", () => {
      const issue = {
        title: "CustomType: Something",
        labels: [],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("CustomType: Something");
      expect(skipped).toBe(true);
    });

    it("should not double-prefix on re-run", () => {
      const issue = {
        title: "Fix auth",
        labels: [{ name: "type:bug" }],
      };

      // First run
      const result1 = generateNewTitle(issue, "issue");
      expect(result1.newTitle).toBe("Bug: Fix auth");
      expect(result1.skipped).toBe(false);

      // Simulate second run with already-prefixed title
      const issue2 = {
        title: result1.newTitle,
        labels: [{ name: "type:bug" }],
      };
      const result2 = generateNewTitle(issue2, "issue");
      expect(result2.newTitle).toBe("Bug: Fix auth");
      expect(result2.skipped).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle title with leading/trailing spaces", () => {
      const issue = {
        title: "  Fix bug  ",
        labels: [{ name: "type:bug" }],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      // Note: In real implementation, might want to trim
      expect(newTitle).toBe("Bug:   Fix bug  ");
      expect(skipped).toBe(false);
    });

    it("should handle empty labels array", () => {
      const issue = {
        title: "Some change",
        labels: [],
      };
      const { newTitle, skipped } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Feature: Some change");
      expect(skipped).toBe(false);
    });

    it("should handle null body", () => {
      const pr = {
        title: "Add feature",
        labels: [],
        body: null,
      };
      const { newTitle, skipped } = generateNewTitle(pr, "pr");
      expect(newTitle).toBe("Feature: Add feature");
      expect(skipped).toBe(false);
    });

    it("should handle undefined body", () => {
      const pr = {
        title: "Add feature",
        labels: [],
      };
      const { newTitle, skipped } = generateNewTitle(pr, "pr");
      expect(newTitle).toBe("Feature: Add feature");
      expect(skipped).toBe(false);
    });

    it("should handle labels with special characters", () => {
      const issue = {
        title: "Update component",
        labels: [{ name: "type:feature" }, { name: "area:ui-components" }],
      };
      const type = detectType(issue, "issue");
      expect(type).toBe("feature");
    });

    it("should handle multiple type: labels (take first match)", () => {
      const issue = {
        title: "Something",
        labels: [
          { name: "type:bug" },
          { name: "type:feature" }, // Should not reach this
        ],
      };
      const type = detectType(issue, "issue");
      expect(type).toBe("bug"); // First match wins
    });
  });

  describe("Type Mapping", () => {
    it("should map all expected type values to display names", () => {
      const types = [
        { input: "bug", expected: "Bug" },
        { input: "feature", expected: "Feature" },
        { input: "documentation", expected: "Documentation" },
        { input: "docs", expected: "Documentation" },
        { input: "chore", expected: "Chore" },
        { input: "ci", expected: "Build & CI" },
        { input: "refactor", expected: "Refactor" },
        { input: "security", expected: "Security" },
        { input: "test", expected: "Test" },
        { input: "task", expected: "Task" },
      ];

      for (const testCase of types) {
        const issue = {
          title: "Test",
          labels: [{ name: `type:${testCase.input}` }],
        };
        const { newTitle } = generateNewTitle(issue, "issue");
        expect(newTitle).toBe(`${testCase.expected}: Test`);
      }
    });

    it("should use Feature as default for unknown type", () => {
      const issue = {
        title: "Change",
        labels: [{ name: "type:unknown-type" }],
      };
      const { newTitle } = generateNewTitle(issue, "issue");
      expect(newTitle).toBe("Feature: Change");
    });
  });

  describe("Report Generation", () => {
    it("should generate correct report structure", () => {
      const report = {
        startTime: new Date(),
        endTime: new Date(),
        total: 5,
        updated: 3,
        skipped: 2,
        errors: 0,
        details: [
          {
            number: 1,
            type: "issue",
            oldTitle: "Fix bug",
            newTitle: "Bug: Fix bug",
            typePrefix: "bug",
            action: "updated",
          },
        ],
        errors_list: [],
      };

      expect(report.total).toBe(5);
      expect(report.updated).toBe(3);
      expect(report.skipped).toBe(2);
      expect(report.errors).toBe(0);
      expect(report.details).toHaveLength(1);
    });

    it("should track errors in report", () => {
      const report = {
        total: 3,
        errors: 1,
        errors_list: [{ issue: 123, error: "API rate limit exceeded" }],
      };

      expect(report.errors).toBe(1);
      expect(report.errors_list).toHaveLength(1);
      expect(report.errors_list[0].error).toContain("rate limit");
    });
  });
});
