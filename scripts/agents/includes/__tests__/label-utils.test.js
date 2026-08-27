/**
 * ============================================================================
 * Tests for label-utils utility functions
 * Location: ../__tests__/label-utils.test.js
 * Description:
 *   - Tests label formatting and comparison utilities
 *   - Covers Markdown table generation and label diffing
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const { labelsToMarkdownTable, diffLabels } = require("../label-utils");

describe("label-utils.js", () => {
  describe("labelsToMarkdownTable", () => {
    test("converts labels array to Markdown table", () => {
      const labels = ["bug", "enhancement", "documentation"];
      const result = labelsToMarkdownTable(labels);

      expect(result).toContain("| Label |");
      expect(result).toContain("|-------|");
      expect(result).toContain("| `bug` |");
      expect(result).toContain("| `enhancement` |");
      expect(result).toContain("| `documentation` |");
    });

    test("handles single label", () => {
      const labels = ["status:in-progress"];
      const result = labelsToMarkdownTable(labels);

      expect(result).toContain("| Label |");
      expect(result).toContain("| `status:in-progress` |");
    });

    test("handles empty array", () => {
      const labels = [];
      const result = labelsToMarkdownTable(labels);

      expect(result).toBe("_No labels applied._");
    });

    test("handles null input", () => {
      const result = labelsToMarkdownTable(null);

      expect(result).toBe("_No labels applied._");
    });

    test("handles undefined input", () => {
      const result = labelsToMarkdownTable(undefined);

      expect(result).toBe("_No labels applied._");
    });

    test("formats labels with special characters", () => {
      const labels = ["type:bug", "area:core", "priority:high"];
      const result = labelsToMarkdownTable(labels);

      expect(result).toContain("| `type:bug` |");
      expect(result).toContain("| `area:core` |");
      expect(result).toContain("| `priority:high` |");
    });

    test("handles labels with spaces", () => {
      const labels = ["good first issue", "help wanted"];
      const result = labelsToMarkdownTable(labels);

      expect(result).toContain("| `good first issue` |");
      expect(result).toContain("| `help wanted` |");
    });

    test("handles very long label names", () => {
      const labels = [
        "this-is-a-very-long-label-name-that-exceeds-normal-length",
      ];
      const result = labelsToMarkdownTable(labels);

      expect(result).toContain(
        "| `this-is-a-very-long-label-name-that-exceeds-normal-length` |",
      );
    });

    test("handles many labels", () => {
      const labels = Array.from({ length: 20 }, (_, i) => `label-${i}`);
      const result = labelsToMarkdownTable(labels);

      // Check header is present
      expect(result).toContain("| Label |");
      // Check first and last labels
      expect(result).toContain("| `label-0` |");
      expect(result).toContain("| `label-19` |");
      // Check all labels are present
      const matches = result.match(/\| `label-\d+` \|/g);
      expect(matches).toHaveLength(20);
    });

    test("preserves label order", () => {
      const labels = ["zebra", "apple", "banana"];
      const result = labelsToMarkdownTable(labels);

      const zebraIndex = result.indexOf("| `zebra` |");
      const appleIndex = result.indexOf("| `apple` |");
      const bananaIndex = result.indexOf("| `banana` |");

      expect(zebraIndex).toBeLessThan(appleIndex);
      expect(appleIndex).toBeLessThan(bananaIndex);
    });

    test("handles labels with Markdown special characters", () => {
      const labels = ["label-with-*asterisk*", "label-with-_underscore_"];
      const result = labelsToMarkdownTable(labels);

      expect(result).toContain("| `label-with-*asterisk*` |");
      expect(result).toContain("| `label-with-_underscore_` |");
    });

    test("generates valid Markdown structure", () => {
      const labels = ["test"];
      const result = labelsToMarkdownTable(labels);

      // Should have proper Markdown table structure
      const lines = result.split("\n").filter((l) => l.trim());
      expect(lines.length).toBeGreaterThanOrEqual(3); // Header, separator, at least one row
      expect(lines[0]).toBe("| Label |");
      expect(lines[1]).toBe("|-------|");
    });
  });

  describe("diffLabels", () => {
    test("identifies missing labels", () => {
      const current = ["bug", "enhancement"];
      const canonical = ["bug", "enhancement", "documentation"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["documentation"]);
      expect(result.extra).toEqual([]);
    });

    test("identifies extra labels", () => {
      const current = ["bug", "enhancement", "invalid-label"];
      const canonical = ["bug", "enhancement"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual(["invalid-label"]);
    });

    test("identifies both missing and extra labels", () => {
      const current = ["bug", "invalid-label"];
      const canonical = ["bug", "enhancement", "documentation"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["enhancement", "documentation"]);
      expect(result.extra).toEqual(["invalid-label"]);
    });

    test("returns empty arrays when labels match", () => {
      const current = ["bug", "enhancement", "documentation"];
      const canonical = ["bug", "enhancement", "documentation"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual([]);
    });

    test("handles empty current labels", () => {
      const current = [];
      const canonical = ["bug", "enhancement"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["bug", "enhancement"]);
      expect(result.extra).toEqual([]);
    });

    test("handles empty canonical labels", () => {
      const current = ["bug", "enhancement"];
      const canonical = [];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual(["bug", "enhancement"]);
    });

    test("handles both arrays empty", () => {
      const current = [];
      const canonical = [];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual([]);
    });

    test("identifies multiple missing labels", () => {
      const current = ["bug"];
      const canonical = ["bug", "enhancement", "documentation", "refactor"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual([
        "enhancement",
        "documentation",
        "refactor",
      ]);
      expect(result.extra).toEqual([]);
    });

    test("identifies multiple extra labels", () => {
      const current = ["bug", "invalid-1", "invalid-2", "invalid-3"];
      const canonical = ["bug"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual(["invalid-1", "invalid-2", "invalid-3"]);
    });

    test("handles duplicate labels in current", () => {
      const current = ["bug", "bug", "enhancement"];
      const canonical = ["bug", "enhancement"];
      const result = diffLabels(current, canonical);

      // Duplicates are not filtered, so they won't show as extra
      // (since includes() returns true for the first occurrence)
      expect(result.missing).toEqual([]);
      expect(result.extra).toEqual([]);
    });

    test("preserves order of missing labels", () => {
      const current = [];
      const canonical = ["zebra", "apple", "banana"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["zebra", "apple", "banana"]);
    });

    test("preserves order of extra labels", () => {
      const current = ["zebra", "apple", "banana"];
      const canonical = [];
      const result = diffLabels(current, canonical);

      expect(result.extra).toEqual(["zebra", "apple", "banana"]);
    });

    test("handles labels with special characters", () => {
      const current = ["type:bug", "area:core"];
      const canonical = ["type:bug", "status:in-progress"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["status:in-progress"]);
      expect(result.extra).toEqual(["area:core"]);
    });

    test("is case-sensitive", () => {
      const current = ["Bug", "Enhancement"];
      const canonical = ["bug", "enhancement"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["bug", "enhancement"]);
      expect(result.extra).toEqual(["Bug", "Enhancement"]);
    });

    test("handles labels with spaces", () => {
      const current = ["good first issue"];
      const canonical = ["good first issue", "help wanted"];
      const result = diffLabels(current, canonical);

      expect(result.missing).toEqual(["help wanted"]);
      expect(result.extra).toEqual([]);
    });
  });

  describe("integration scenarios", () => {
    test("complete workflow: diff and table generation", () => {
      const current = ["bug", "invalid-label"];
      const canonical = ["bug", "enhancement", "documentation"];

      // First, get the diff
      const diff = diffLabels(current, canonical);

      expect(diff.missing).toEqual(["enhancement", "documentation"]);
      expect(diff.extra).toEqual(["invalid-label"]);

      // Generate tables for missing and extra
      const missingTable = labelsToMarkdownTable(diff.missing);
      const extraTable = labelsToMarkdownTable(diff.extra);

      expect(missingTable).toContain("| `enhancement` |");
      expect(missingTable).toContain("| `documentation` |");
      expect(extraTable).toContain("| `invalid-label` |");
    });

    test("generates report for label standardization", () => {
      const current = [
        "bug",
        "wip",
        "in progress",
        "needs review",
        "enhancement",
      ];
      const canonical = [
        "type:bug",
        "status:in-progress",
        "status:needs-review",
        "type:enhancement",
      ];

      const diff = diffLabels(current, canonical);

      // All current labels should be extra (non-canonical)
      expect(diff.extra).toEqual([
        "bug",
        "wip",
        "in progress",
        "needs review",
        "enhancement",
      ]);

      // All canonical labels should be missing
      expect(diff.missing).toEqual([
        "type:bug",
        "status:in-progress",
        "status:needs-review",
        "type:enhancement",
      ]);

      // Generate report
      const extraTable = labelsToMarkdownTable(diff.extra);
      const missingTable = labelsToMarkdownTable(diff.missing);

      expect(extraTable).toContain("| `wip` |");
      expect(missingTable).toContain("| `status:in-progress` |");
    });

    test("handles perfect alignment (no diff)", () => {
      const current = ["type:bug", "status:in-progress", "priority:high"];
      const canonical = ["type:bug", "status:in-progress", "priority:high"];

      const diff = diffLabels(current, canonical);

      expect(diff.missing).toEqual([]);
      expect(diff.extra).toEqual([]);

      const missingTable = labelsToMarkdownTable(diff.missing);
      const extraTable = labelsToMarkdownTable(diff.extra);

      expect(missingTable).toBe("_No labels applied._");
      expect(extraTable).toBe("_No labels applied._");
    });
  });

  describe("edge cases and error handling", () => {
    test("handles very large arrays efficiently", () => {
      const current = Array.from({ length: 1000 }, (_, i) => `label-${i}`);
      const canonical = Array.from(
        { length: 1000 },
        (_, i) => `label-${i + 500}`,
      );

      const start = Date.now();
      const diff = diffLabels(current, canonical);
      const duration = Date.now() - start;

      // Should complete quickly (under 100ms for 1000 items)
      expect(duration).toBeLessThan(100);

      // Should correctly identify 500 missing and 500 extra
      expect(diff.missing.length).toBe(500);
      expect(diff.extra.length).toBe(500);
    });

    test("handles labels with only whitespace", () => {
      const current = ["bug", "   ", "enhancement"];
      const canonical = ["bug", "enhancement"];
      const diff = diffLabels(current, canonical);

      expect(diff.extra).toEqual(["   "]);
    });

    test("handles empty string labels", () => {
      const current = ["bug", "", "enhancement"];
      const canonical = ["bug", "enhancement"];
      const diff = diffLabels(current, canonical);

      expect(diff.extra).toEqual([""]);
    });

    test("labelsToMarkdownTable handles array with null values", () => {
      const labels = ["bug", null, "enhancement"];
      const result = labelsToMarkdownTable(labels);

      // Should still generate a table
      expect(result).toContain("| `bug` |");
      expect(result).toContain("| `enhancement` |");
    });

    test("labelsToMarkdownTable handles array with undefined values", () => {
      const labels = ["bug", undefined, "enhancement"];
      const result = labelsToMarkdownTable(labels);

      // Should still generate a table
      expect(result).toContain("| `bug` |");
      expect(result).toContain("| `enhancement` |");
    });
  });
});
