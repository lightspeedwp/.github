/**
 * branding-unified.test.js
 * Unit tests for unified branding agent
 *
 * Test coverage:
 * - Category inference (path-based and frontmatter)
 * - Frontmatter validation
 * - Header generation
 * - Footer selection and rendering
 * - Fallback behavior
 * - Error handling
 */

import { describe, it, expect } from "@jest/globals";
import {
  parseFrontmatter,
  validateFrontmatter,
  inferCategory,
  generateHeader,
  getFooter,
  removeExistingFooter,
} from "../branding-unified.agent.js";

// Mock configuration
const mockConfig = {
  version: "1.0.0",
  categories: {
    docs: {
      name: "Documentation",
      description: "Repository documentation",
      file_patterns: ["docs/**/*.md"],
      header_behavior: "required",
      footer_behavior: "required",
      frontmatter_required: ["title", "description", "file_type", "category"],
      default_footer: "lightspeed-standard",
      allowed_footers: ["lightspeed-standard", "lightspeed-brief"],
    },
    agents: {
      name: "Agent Specifications",
      description: "Agent specs and behavior definitions",
      file_patterns: ["agents/**/*.md"],
      header_behavior: "required",
      footer_behavior: "required",
      frontmatter_required: ["title", "description", "file_type"],
      default_footer: "ai-ops-standard",
      allowed_footers: ["ai-ops-standard"],
    },
    "issue-template": {
      name: "Issue Templates",
      description: "GitHub issue templates",
      file_patterns: [".github/ISSUE_TEMPLATE/*.md"],
      header_behavior: "omitted",
      footer_behavior: "optional",
      frontmatter_required: ["title"],
      default_footer: "issue-footer",
      allowed_footers: ["issue-footer"],
    },
    readme: {
      name: "README",
      description: "README files",
      file_patterns: ["README.md", "*/README.md"],
      header_behavior: "omitted",
      footer_behavior: "required",
      frontmatter_required: [],
      default_footer: "lightspeed-standard",
      allowed_footers: ["lightspeed-standard"],
    },
  },
  footers: {
    "lightspeed-standard": {
      id: "lightspeed-standard",
      name: "Standard Footer",
      template: "---\n\n*Built by 🧱 LightSpeedWP*",
    },
    "lightspeed-brief": {
      id: "lightspeed-brief",
      name: "Brief Footer",
      template:
        "---\n\nMade with 💚 by [LightSpeedWP](https://lightspeedwp.agency)",
    },
    "ai-ops-standard": {
      id: "ai-ops-standard",
      name: "AI Ops Footer",
      template: "---\n\n*Maintained by 🤖 LightSpeedWP Automation Team*",
    },
    "issue-footer": {
      id: "issue-footer",
      name: "Issue Footer",
      template: "---\n\nRelated issues: {related_issues}",
    },
  },
};

// ============================================================================
// FRONTMATTER PARSING
// ============================================================================

describe("parseFrontmatter", () => {
  it("should parse valid YAML frontmatter", () => {
    const content = `---
title: Test Document
description: A test document
category: docs
---

# Content here`;

    const result = parseFrontmatter(content);

    expect(result.frontmatter).toEqual({
      title: "Test Document",
      description: "A test document",
      category: "docs",
    });
    expect(result.body).toContain("# Content here");
  });

  it("should handle documents without frontmatter", () => {
    const content = `# Document without frontmatter

Content here`;

    const result = parseFrontmatter(content);

    expect(result.frontmatter).toEqual({});
    expect(result.body).toContain("# Document without frontmatter");
  });

  it("should preserve body content accurately", () => {
    const bodyContent = `## Section 1

Some text here

## Section 2

More text`;

    const content = `---
title: Test
---

${bodyContent}`;

    const result = parseFrontmatter(content);
    expect(result.body.trim()).toBe(bodyContent.trim());
  });
});

// ============================================================================
// FRONTMATTER VALIDATION
// ============================================================================

describe("validateFrontmatter", () => {
  it("should pass validation with all required fields", () => {
    const frontmatter = {
      title: "Test Document",
      description: "A test document",
      file_type: "documentation",
      category: "docs",
    };

    const errors = validateFrontmatter(frontmatter, "docs", mockConfig);
    expect(errors).toHaveLength(0);
  });

  it("should fail when required fields are missing", () => {
    const frontmatter = {
      title: "Test Document",
      // missing description, file_type, category
    };

    const errors = validateFrontmatter(frontmatter, "docs", mockConfig);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.includes("description"))).toBe(true);
  });

  it("should validate date format", () => {
    const frontmatter = {
      title: "Test",
      description: "Test",
      file_type: "documentation",
      category: "docs",
      created_date: "invalid-date",
    };

    const errors = validateFrontmatter(frontmatter, "docs", mockConfig);
    expect(errors.some((e) => e.includes("created_date"))).toBe(true);
  });

  it("should accept valid dates (YYYY-MM-DD)", () => {
    const frontmatter = {
      title: "Test",
      description: "Test",
      file_type: "documentation",
      category: "docs",
      created_date: "2026-05-29",
      last_updated: "2026-05-29",
    };

    const errors = validateFrontmatter(frontmatter, "docs", mockConfig);
    const dateErrors = errors.filter((e) => e.includes("date"));
    expect(dateErrors).toHaveLength(0);
  });

  it("should validate version format", () => {
    const frontmatterValid = {
      title: "Test",
      description: "Test",
      file_type: "documentation",
      category: "docs",
      version: "1.0.0",
    };

    const errorsValid = validateFrontmatter(
      frontmatterValid,
      "docs",
      mockConfig,
    );
    const versionErrors = errorsValid.filter((e) => e.includes("version"));
    expect(versionErrors).toHaveLength(0);

    const frontmatterInvalid = {
      ...frontmatterValid,
      version: "invalid",
    };

    const errorsInvalid = validateFrontmatter(
      frontmatterInvalid,
      "docs",
      mockConfig,
    );
    expect(errorsInvalid.some((e) => e.includes("version"))).toBe(true);
  });
});

// ============================================================================
// CATEGORY INFERENCE
// ============================================================================

describe("inferCategory", () => {
  describe("frontmatter-first strategy", () => {
    it("should use explicit category from frontmatter", () => {
      const frontmatter = { category: "agents" };
      const category = inferCategory("docs/guide.md", frontmatter, mockConfig);
      expect(category).toBe("agents");
    });

    it("should prioritize frontmatter over path inference", () => {
      const frontmatter = { category: "readme" };
      const category = inferCategory(
        "agents/my-agent.md",
        frontmatter,
        mockConfig,
      );
      expect(category).toBe("readme");
    });
  });

  describe("path-based inference", () => {
    it("should infer docs category from docs/ path", () => {
      const frontmatter = {};
      const category = inferCategory("docs/guide.md", frontmatter, mockConfig);
      expect(category).toBe("docs");
    });

    it("should infer agents category from agents/ path", () => {
      const frontmatter = {};
      const category = inferCategory(
        "agents/my-agent.md",
        frontmatter,
        mockConfig,
      );
      expect(category).toBe("agents");
    });

    it("should infer issue-template category", () => {
      const frontmatter = {};
      const category = inferCategory(
        ".github/ISSUE_TEMPLATE/bug.md",
        frontmatter,
        mockConfig,
      );
      expect(category).toBe("issue-template");
    });

    it("should infer README category", () => {
      const frontmatter = {};
      const category = inferCategory("README.md", frontmatter, mockConfig);
      expect(category).toBe("readme");
    });

    it("should handle case-insensitive path matching", () => {
      const frontmatter = {};
      const category = inferCategory("AGENTS/test.md", frontmatter, mockConfig);
      expect(category).toBe("agents");
    });

    it("should handle Windows-style paths", () => {
      const frontmatter = {};
      const category = inferCategory(
        "agents\\my-agent.md",
        frontmatter,
        mockConfig,
      );
      expect(category).toBe("agents");
    });
  });

  describe("fallback behavior", () => {
    it("should fall back to docs category when no pattern matches", () => {
      const frontmatter = {};
      const category = inferCategory(
        "some/unknown/path/file.md",
        frontmatter,
        mockConfig,
      );
      expect(category).toBe("docs");
    });

    it("should reject invalid frontmatter categories and use path inference", () => {
      const frontmatter = { category: "non-existent-category" };
      const category = inferCategory("docs/guide.md", frontmatter, mockConfig);
      expect(category).toBe("docs");
    });
  });
});

// ============================================================================
// HEADER GENERATION
// ============================================================================

describe("generateHeader", () => {
  it("should generate header for docs category", () => {
    const frontmatter = {
      title: "My Documentation",
      status: "active",
      version: "1.0.0",
      owners: ["@user1", "@user2"],
      last_updated: "2026-05-29",
    };

    const header = generateHeader(frontmatter, "docs", mockConfig);

    expect(header).toContain("# My Documentation");
    expect(header).toContain("[docs]");
    expect(header).toContain("Active");
    expect(header).toContain("1.0.0");
    expect(header).toContain("@user1");
  });

  it("should skip header for categories with omitted behavior", () => {
    const frontmatter = { title: "Issue Template" };
    const header = generateHeader(frontmatter, "issue-template", mockConfig);
    expect(header).toBeNull();
  });

  it("should handle missing optional fields gracefully", () => {
    const frontmatter = {
      title: "Simple Document",
      // no version, no owners, etc.
    };

    const header = generateHeader(frontmatter, "docs", mockConfig);
    expect(header).toContain("# Simple Document");
    expect(header).toContain("[docs]");
  });

  it("should format multiple owners correctly", () => {
    const frontmatter = {
      title: "Team Document",
      owners: ["user1", "@user2", "user3@example.com"],
    };

    const header = generateHeader(frontmatter, "docs", mockConfig);
    expect(header).toContain("@user1");
    expect(header).toContain("@user2");
  });
});

// ============================================================================
// FOOTER MANAGEMENT
// ============================================================================

describe("getFooter", () => {
  it("should return default footer for category", () => {
    const frontmatter = {};
    const footer = getFooter("docs", frontmatter, mockConfig);
    expect(footer).toContain("LightSpeedWP");
  });

  it("should use explicit footer_id from frontmatter", () => {
    const frontmatter = { footer_id: "lightspeed-brief" };
    const footer = getFooter("docs", frontmatter, mockConfig);
    expect(footer).toContain("💚");
    expect(footer).toContain("lightspeedwp.agency");
  });

  it("should substitute template variables", () => {
    const frontmatter = { related_issues: "#123, #456" };
    const footer = getFooter("issue-template", frontmatter, mockConfig);
    expect(footer).toContain("#123, #456");
  });

  it("should fall back to default footer for missing footer_id", () => {
    const frontmatter = { footer_id: "non-existent-footer" };
    const footer = getFooter("docs", frontmatter, mockConfig);
    // Should fall back to lightspeed-standard
    expect(footer).toBeTruthy();
  });
});

describe("removeExistingFooter", () => {
  it("should remove footer with standard markers", () => {
    const content = `# Document

Content here

---

*Built by 🧱 LightSpeedWP*`;

    const cleaned = removeExistingFooter(content);
    expect(cleaned).not.toContain("Built by 🧱");
    expect(cleaned).toContain("# Document");
    expect(cleaned).toContain("Content here");
  });

  it("should remove footer with automation team marker", () => {
    const content = `# Document

Content

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*`;

    const cleaned = removeExistingFooter(content);
    expect(cleaned).not.toContain("Maintained with ❤️");
  });

  it("should handle multiple footer patterns", () => {
    const content = `# Document

Content

---

🤖 Some footer`;

    const cleaned = removeExistingFooter(content);
    expect(cleaned).not.toContain("---");
    expect(cleaned).toContain("# Document");
  });

  it("should leave content without footer unchanged", () => {
    const content = `# Document

Content here`;

    const cleaned = removeExistingFooter(content);
    expect(cleaned).toBe(content);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe("Integration: Full Document Processing", () => {
  it("should correctly process a docs category document", () => {
    const content = `---
title: API Guide
description: Guide to the API
file_type: documentation
category: docs
status: active
version: 2.0.0
---

# Content

API documentation here`;

    const { frontmatter, body } = parseFrontmatter(content);
    const category = inferCategory(
      "docs/api-guide.md",
      frontmatter,
      mockConfig,
    );
    const errors = validateFrontmatter(frontmatter, category, mockConfig);

    expect(category).toBe("docs");
    expect(errors).toHaveLength(0);

    const header = generateHeader(frontmatter, category, mockConfig);
    expect(header).toContain("API Guide");
    expect(header).toContain("[docs]");
  });

  it("should handle inference fallback gracefully", () => {
    // Document with no frontmatter, path doesn't match any pattern
    const content = `# Unknown Document

Content here`;

    const { frontmatter } = parseFrontmatter(content);
    const category = inferCategory("unknown/file.md", frontmatter, mockConfig);

    expect(category).toBe("docs"); // Falls back to docs
  });
});
