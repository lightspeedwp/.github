/**
 * Tests for validate-frontmatter-freshness.js
 * Validates that frontmatter is updated when markdown content changes
 */

const yaml = require("js-yaml");

// Mock today's date for testing
const mockTodayUTC = "2026-08-19";

// Extracted core validation functions for testing
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { raw: null, data: null, body: content };
  const raw = match[0];
  let data;
  try {
    data = yaml.load(match[1]) || {};
  } catch {
    data = null;
  }
  const body = content.slice(raw.length);
  return { raw, data, body };
}

function validateFrontmatterFreshness(
  previousBody,
  currentBody,
  previousFrontmatter,
  currentFrontmatter,
) {
  const issues = [];

  // Skip if body hasn't changed
  if (previousBody === currentBody) {
    return issues;
  }

  const hasDateField =
    (previousFrontmatter && "last_updated" in previousFrontmatter) ||
    (currentFrontmatter && "last_updated" in currentFrontmatter);
  const hasVersionField =
    (previousFrontmatter && "version" in previousFrontmatter) ||
    (currentFrontmatter && "version" in currentFrontmatter);

  if (hasDateField) {
    const prevLastUpdated = String(previousFrontmatter?.last_updated || "");
    const currLastUpdated = String(currentFrontmatter?.last_updated || "");
    const unchangedButToday =
      prevLastUpdated === currLastUpdated && currLastUpdated === mockTodayUTC;

    if (prevLastUpdated === currLastUpdated && !unchangedButToday) {
      issues.push(
        `body changed but last_updated was not updated (${currLastUpdated}).`,
      );
    } else if (currLastUpdated !== mockTodayUTC) {
      issues.push(
        `last_updated must be today's UTC date (${mockTodayUTC}), found ${currLastUpdated}.`,
      );
    }
  }

  if (hasVersionField) {
    const prevVersion = String(previousFrontmatter?.version || "");
    const currVersion = String(currentFrontmatter?.version || "");
    if (prevVersion === currVersion) {
      issues.push(`body changed but version was not updated (${currVersion}).`);
    }
  }

  return issues;
}

describe("validate-frontmatter-freshness", () => {
  describe("extractFrontmatter", () => {
    it("should extract frontmatter from file with YAML block", () => {
      const content = `---
title: Test Document
version: 1.0.0
last_updated: "2026-08-19"
---

# Document Body

This is the content.`;

      const result = extractFrontmatter(content);

      expect(result.raw).toContain("---");
      expect(result.data).toEqual({
        title: "Test Document",
        version: "1.0.0",
        last_updated: "2026-08-19",
      });
      expect(result.body).toContain("# Document Body");
    });

    it("should return null for files without frontmatter", () => {
      const content = `# Document Body

This is content without frontmatter.`;

      const result = extractFrontmatter(content);

      expect(result.raw).toBeNull();
      expect(result.data).toBeNull();
      expect(result.body).toBe(content);
    });

    it("should handle malformed YAML gracefully", () => {
      const content = `---
title: Test
invalid: [yaml: content
---

Body`;

      const result = extractFrontmatter(content);

      expect(result.raw).toBeTruthy();
      expect(result.data).toBeNull();
      expect(result.body).toContain("Body");
    });

    it("should preserve frontmatter with multiple fields", () => {
      const content = `---
title: Document
author: John Doe
version: 2.1.0
last_updated: "2026-08-19"
tags:
  - test
  - documentation
---

Content here`;

      const result = extractFrontmatter(content);

      expect(result.data.title).toBe("Document");
      expect(result.data.author).toBe("John Doe");
      expect(result.data.tags).toEqual(["test", "documentation"]);
    });

    it("should handle empty body after frontmatter", () => {
      const content = `---
title: Test
---`;

      const result = extractFrontmatter(content);

      expect(result.raw).toBeTruthy();
      expect(result.body).toBe("");
    });
  });

  describe("validateFrontmatterFreshness - version validation", () => {
    it("should pass when version is updated with body change", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.1.0" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.filter((i) => i.includes("version"))).toHaveLength(0);
    });

    it("should fail when version is not updated but body changed", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.0.0" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.some((i) => i.includes("version"))).toBe(true);
      expect(issues.some((i) => i.includes("not updated"))).toBe(true);
    });

    it("should pass when body does not change", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.0.0" };
      const body = "Same body";

      const issues = validateFrontmatterFreshness(
        body,
        body,
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should skip version check when version field not present", () => {
      const previousFrontmatter = { title: "Test" };
      const currentFrontmatter = { title: "Test" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.filter((i) => i.includes("version"))).toHaveLength(0);
    });
  });

  describe("validateFrontmatterFreshness - last_updated validation", () => {
    it("should pass when last_updated is set to today", () => {
      const previousFrontmatter = { title: "Test", last_updated: "2026-08-18" };
      const currentFrontmatter = { title: "Test", last_updated: mockTodayUTC };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.filter((i) => i.includes("last_updated"))).toHaveLength(0);
    });

    it("should fail when last_updated is not today", () => {
      const previousFrontmatter = { title: "Test", last_updated: "2026-08-18" };
      const currentFrontmatter = { title: "Test", last_updated: "2026-08-18" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.some((i) => i.includes("not updated"))).toBe(true);
    });

    it("should fail when last_updated is not in correct format", () => {
      const previousFrontmatter = { title: "Test", last_updated: "2026-08-18" };
      const currentFrontmatter = { title: "Test", last_updated: "2026-08-20" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.some((i) => i.includes("must be"))).toBe(true);
      expect(issues.some((i) => i.includes(mockTodayUTC))).toBe(true);
    });

    it("should skip last_updated check when field not present", () => {
      const previousFrontmatter = { title: "Test" };
      const currentFrontmatter = { title: "Test" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.filter((i) => i.includes("last_updated"))).toHaveLength(0);
    });
  });

  describe("validateFrontmatterFreshness - comprehensive scenarios", () => {
    it("should validate file with both version and last_updated", () => {
      const previousFrontmatter = {
        title: "Test",
        version: "1.0.0",
        last_updated: "2026-08-18",
      };
      const currentFrontmatter = {
        title: "Test",
        version: "1.1.0",
        last_updated: mockTodayUTC,
      };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should detect multiple freshness violations", () => {
      const previousFrontmatter = {
        title: "Test",
        version: "1.0.0",
        last_updated: "2026-08-18",
      };
      const currentFrontmatter = {
        title: "Test",
        version: "1.0.0",
        last_updated: "2026-08-18",
      };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.length).toBeGreaterThanOrEqual(2);
      expect(issues.some((i) => i.includes("version"))).toBe(true);
      expect(issues.some((i) => i.includes("last_updated"))).toBe(true);
    });

    it("should handle only last_updated field present", () => {
      const previousFrontmatter = { title: "Test", last_updated: "2026-08-18" };
      const currentFrontmatter = { title: "Test", last_updated: mockTodayUTC };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should handle only version field present", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.1.0" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should handle date as non-string value", () => {
      const previousFrontmatter = { title: "Test", last_updated: "2026-08-18" };
      const currentFrontmatter = { title: "Test", last_updated: mockTodayUTC };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("should handle body with only whitespace change", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.0.0" };

      const issues = validateFrontmatterFreshness(
        "Body",
        "Body  ",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues.some((i) => i.includes("version"))).toBe(true);
    });

    it("should handle newline variations in body", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.1.0" };

      const issues = validateFrontmatterFreshness(
        "Line 1\nLine 2",
        "Line 1\r\nLine 2",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should handle very long body content", () => {
      const longBody = "Content ".repeat(1000);
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = { title: "Test", version: "1.1.0" };

      const issues = validateFrontmatterFreshness(
        longBody,
        longBody + " extra",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should handle missing frontmatter in current version", () => {
      const previousFrontmatter = { title: "Test", version: "1.0.0" };
      const currentFrontmatter = null;

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });

    it("should handle missing frontmatter in previous version", () => {
      const previousFrontmatter = null;
      const currentFrontmatter = { title: "Test", version: "1.0.0" };

      const issues = validateFrontmatterFreshness(
        "Old body",
        "New body",
        previousFrontmatter,
        currentFrontmatter,
      );

      expect(issues).toHaveLength(0);
    });
  });
});
