/**
 * Test Suite for Safe Footer Injection Script
 *
 * Tests the critical safety invariants:
 * - Frontmatter preservation (lines 1-3 only)
 * - Body content preservation (NO truncation)
 * - Size invariant: newContent.length >= originalContent.length
 * - Footer detection and skipping
 */

const { describe, it, expect } = require("@jest/globals");
const {
  extractFrontmatterSafely,
  hasFooter,
  injectFooterSafely,
} = require("../inject-footers-safe.js");

describe("Safe Footer Injection", () => {
  describe("extractFrontmatterSafely", () => {
    it("should extract frontmatter from standard YAML format", () => {
      const content = `---
name: "Bug"
about: "Report a defect"
---

## Definition of Done
- [ ] Test this
`;

      const { frontmatter, body } = extractFrontmatterSafely(content);

      expect(frontmatter).toContain("---");
      expect(frontmatter).toContain('name: "Bug"');
      expect(body).toContain("## Definition of Done");
    });

    it("should preserve content with visual separators in body", () => {
      const content = `---
title: "Task"
---

## Section 1

---

## Section 2

This is important content`;

      const { body } = extractFrontmatterSafely(content);

      // Should NOT truncate at the visual separator
      expect(body).toContain("## Section 1");
      expect(body).toContain("## Section 2");
      expect(body).toContain("This is important content");
    });

    it("should handle files without frontmatter", () => {
      const content = `# Just a title

Some content here`;

      const { frontmatter, body } = extractFrontmatterSafely(content);

      expect(frontmatter).toBe("");
      expect(body).toBe(content);
    });
  });

  describe("hasFooter", () => {
    it("should detect existing footer", () => {
      const content = `# Document

Content here

---

_🤖 Maintained by the LightSpeedWP Automation Team_`;

      expect(hasFooter(content)).toBe(true);
    });

    it("should not detect footer when absent", () => {
      const content = `# Document

Content here`;

      expect(hasFooter(content)).toBe(false);
    });
  });

  describe("injectFooterSafely", () => {
    it("should preserve Definition of Ready sections", () => {
      const content = `---
name: "Bug"
---

## Definition of Ready (DoR)
- [ ] Issue described
- [ ] Steps to reproduce

## Definition of Done (DoD)
- [ ] Fix implemented
- [ ] Tests passing`;

      const footer = "---\n\n_Footer here_";
      const result = injectFooterSafely("test.md", content, footer, true);

      expect(result.success).toBe(true);
      expect(result.newContent).toContain("## Definition of Ready");
      expect(result.newContent).toContain("## Definition of Done");
      expect(result.newContent).toContain("_Footer here_");
    });

    it("should maintain size invariant (never shrink)", () => {
      const content = `---
name: "Test"
---

Important content that must be preserved`;

      const footer = "---\n\n_Footer_";
      const result = injectFooterSafely("test.md", content, footer, true);

      expect(result.success).toBe(true);
      expect(result.newContent.length).toBeGreaterThanOrEqual(content.length);
    });

    it("should skip if footer already exists", () => {
      const content = `# Document

Content

---

_🤖 Maintained by the LightSpeedWP Automation Team_`;

      const footer = "---\n\n_Another footer_";
      const result = injectFooterSafely("test.md", content, footer, true);

      expect(result.success).toBe(false);
      expect(result.message).toBe("footer_exists");
    });

    it("should handle complex issue template", () => {
      const content = `---
name: "Bug Report"
about: "Report a defect"
title: "[BUG]"
labels: ["type:bug"]
---

## Definition of Ready (DoR)
- [ ] Steps to reproduce provided
- [ ] Environment specified

## Problem Description
Describe the issue

## Acceptance Criteria
- [ ] Issue resolved

## Definition of Done (DoD)
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Docs updated`;

      const footer =
        "\n---\n\n_🤖 Maintained by the LightSpeedWP Automation Team_";
      const result = injectFooterSafely("bug.md", content, footer, true);

      expect(result.success).toBe(true);
      // All sections should be preserved
      expect(result.newContent).toContain("## Definition of Ready");
      expect(result.newContent).toContain("## Problem Description");
      expect(result.newContent).toContain("## Acceptance Criteria");
      expect(result.newContent).toContain("## Definition of Done");
    });
  });
});
