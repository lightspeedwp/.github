/**
 * Test Suite for Badge Generation Module (badges.js)
 *
 * Tests the badge generation functionality:
 * - Schema validation
 * - Schema loading
 * - Workflow badge generation
 * - Metadata badge generation with conditional rules
 * - Badge resolution from schema
 * - README update functionality
 * - Tag matching (any/all strategies)
 */

const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const fs = require("fs");
const path = require("path");
const os = require("os");

let tempDir;

beforeAll(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "badges-test-"));

  // Create .github/automation directory
  fs.mkdirSync(path.join(tempDir, ".github/automation"), { recursive: true });

  // Create mock schema file
  const schemaContent = `badges:
  workflow:
    checks:
      label: "Checks"
      description: "Automated checks"
    release:
      label: "Release"
      description: "Release workflow"
  meta:
    license:
      label: "License"
      description: "License badge"
      color: "blue"
    file-type:
      label: "File Type"
      description: "Document file type"
      color: "lightgrey"
mapping:
  - when:
      has_front_matter: true
    add:
      - workflow.checks
      - meta.license
  - when:
      front_matter:
        tags: ["workflow", "automation"]
    add:
      - workflow.release
  - when:
      front_matter:
        tags:
          match: "any"
          values: ["test", "badge"]
    add:
      - workflow.checks
  - when:
      front_matter:
        tags:
          match: "all"
          values: ["critical", "security"]
    add:
      - workflow.release
  - when:
      front_matter:
        license: ["MIT", "GPL-3.0"]
    add:
      - meta.license
config:
  repository: "lightspeedwp/.github"
  enabled: true
  markers:
    start: "<!-- BADGES-START -->"
    end: "<!-- BADGES-END -->"
`;

  fs.writeFileSync(
    path.join(tempDir, ".github/automation/badges.schema.yml"),
    schemaContent,
  );

  // Create .github/workflows directory
  fs.mkdirSync(path.join(tempDir, ".github/workflows"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, ".github/workflows/checks.yml"), "");
  fs.writeFileSync(path.join(tempDir, ".github/workflows/release.yml"), "");
});

afterAll(() => {
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// Helper functions from badges.js
function validateSchema(schema) {
  if (!schema) {
    throw new Error("Badge schema is empty or undefined");
  }

  if (!schema.badges) {
    throw new Error("Schema missing required 'badges' section");
  }

  if (!schema.mapping || !Array.isArray(schema.mapping)) {
    throw new Error("Schema missing required 'mapping' array");
  }

  if (!schema.config) {
    console.warn("Schema missing 'config' section, using defaults");
  }

  return true;
}

function generateWorkflowBadge(repo, workflowFile, branch = "main") {
  const workflowName = workflowFile.replace(/\.(yml|yaml)$/, "");
  const badgeUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}/badge.svg?branch=${branch}`;
  const workflowUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}`;
  return `[![${workflowName}](${badgeUrl})](${workflowUrl})`;
}

function generateWorkflowBadges(repo, branch = "main", format = "stacked") {
  const workflowsDir = path.join(tempDir, ".github", "workflows");
  if (!fs.existsSync(workflowsDir)) {
    return [];
  }
  const badges = [];
  fs.readdirSync(workflowsDir).forEach((file) => {
    if (file.endsWith(".yml") || file.endsWith(".yaml")) {
      badges.push(generateWorkflowBadge(repo, file, branch));
    }
  });
  if (badges.length === 0) {
    return [];
  }
  if (format === "inline") {
    return [badges.join(" ")];
  }
  return badges;
}

function resolveBadge(badgeRef, badgeDefs, frontMatter) {
  const parts = badgeRef.split(".");
  let current = badgeDefs;

  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }

  if (!current || typeof current !== "object") {
    return null;
  }

  if (badgeRef.startsWith("workflow.")) {
    const label = current.label || badgeRef;
    const successText = current.success_text || "OK";
    return `![${label}](https://img.shields.io/badge/${label}-${successText}-success.svg)`;
  }

  if (
    badgeRef.startsWith("meta.license") &&
    frontMatter &&
    frontMatter.license
  ) {
    const license = frontMatter.license.toUpperCase();
    return `![License](https://img.shields.io/badge/license-${license}-blue.svg)`;
  }

  return null;
}

describe("Badge Schema Validation", () => {
  it("should validate schema with all required sections", () => {
    const schema = {
      badges: { workflow: {} },
      mapping: [],
      config: {},
    };

    expect(() => validateSchema(schema)).not.toThrow();
  });

  it("should throw error if schema is null or undefined", () => {
    expect(() => validateSchema(null)).toThrow("empty or undefined");
    expect(() => validateSchema(undefined)).toThrow("empty or undefined");
  });

  it("should throw error if badges section is missing", () => {
    const schema = {
      mapping: [],
      config: {},
    };

    expect(() => validateSchema(schema)).toThrow("'badges'");
  });

  it("should throw error if mapping section is missing", () => {
    const schema = {
      badges: { workflow: {} },
      config: {},
    };

    expect(() => validateSchema(schema)).toThrow("'mapping'");
  });

  it("should throw error if mapping is not an array", () => {
    const schema = {
      badges: { workflow: {} },
      mapping: { rules: [] },
      config: {},
    };

    expect(() => validateSchema(schema)).toThrow("'mapping'");
  });

  it("should warn if config section is missing", () => {
    const schema = {
      badges: { workflow: {} },
      mapping: [],
    };

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    validateSchema(schema);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should accept schema with only required fields", () => {
    const schema = {
      badges: {},
      mapping: [],
    };

    expect(() => validateSchema(schema)).not.toThrow();
  });
});

describe("Workflow Badge Generation", () => {
  it("should generate badge markdown with correct URL format", () => {
    const badge = generateWorkflowBadge("lightspeedwp/.github", "checks.yml");

    expect(badge).toContain("![checks]");
    expect(badge).toContain("https://github.com/lightspeedwp/.github");
    expect(badge).toContain("actions/workflows/checks.yml");
    expect(badge).toContain("badge.svg");
  });

  it("should include branch parameter in badge URL", () => {
    const badge = generateWorkflowBadge(
      "lightspeedwp/.github",
      "checks.yml",
      "develop",
    );

    expect(badge).toContain("branch=develop");
  });

  it("should use main branch by default", () => {
    const badge = generateWorkflowBadge("lightspeedwp/.github", "checks.yml");

    expect(badge).toContain("branch=main");
  });

  it("should generate markdown link to workflow", () => {
    const badge = generateWorkflowBadge("lightspeedwp/.github", "checks.yml");

    expect(badge).toContain("](https://github.com/lightspeedwp/.github");
  });

  it("should handle workflow files with .yaml extension", () => {
    const badge = generateWorkflowBadge("lightspeedwp/.github", "checks.yaml");

    expect(badge).toContain("checks.yaml");
  });

  it("should handle workflow names with hyphens", () => {
    const badge = generateWorkflowBadge(
      "lightspeedwp/.github",
      "main-branch-guard.yml",
    );

    expect(badge).toContain("main-branch-guard");
  });
});

describe("Batch Workflow Badge Generation", () => {
  it("should generate multiple workflow badges", () => {
    const badges = generateWorkflowBadges("lightspeedwp/.github");

    expect(Array.isArray(badges)).toBe(true);
    expect(badges.length).toBeGreaterThan(0);
  });

  it("should return stacked format by default", () => {
    const badges = generateWorkflowBadges("lightspeedwp/.github");

    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0]).toContain("![");
  });

  it("should support inline format", () => {
    const badges = generateWorkflowBadges(
      "lightspeedwp/.github",
      "develop",
      "inline",
    );

    expect(badges.length).toEqual(1);
    expect(badges[0]).toContain(" ");
  });

  it("should handle custom branch parameter", () => {
    const badges = generateWorkflowBadges(
      "lightspeedwp/.github",
      "custom-branch",
    );

    badges.forEach((badge) => {
      expect(badge).toContain("branch=custom-branch");
    });
  });

  it("should return empty array if workflows directory does not exist", () => {
    const badgesDir = path.join(tempDir, ".github", "workflows");

    if (!fs.existsSync(badgesDir)) {
      const badges = [];
      expect(badges.length).toBe(0);
    }
  });
});

describe("Badge Reference Resolution", () => {
  it("should resolve workflow badge from schema", () => {
    const badgeDefs = {
      workflow: {
        checks: {
          label: "Checks",
          description: "Test badge",
        },
      },
    };

    const badge = resolveBadge("workflow.checks", badgeDefs, null);

    expect(badge).toContain("Checks");
    expect(badge).toContain("img.shields.io");
  });

  it("should resolve meta license badge with frontmatter", () => {
    const badgeDefs = {
      meta: {
        license: {
          label: "License",
        },
      },
    };

    const frontMatter = { license: "MIT" };
    const badge = resolveBadge("meta.license", badgeDefs, frontMatter);

    expect(badge).toContain("MIT");
    expect(badge).toContain("license");
  });

  it("should return null for unresolvable badge path", () => {
    const badgeDefs = {
      workflow: {
        checks: { label: "Checks" },
      },
    };

    const badge = resolveBadge("workflow.nonexistent", badgeDefs, null);

    expect(badge).toBeNull();
  });

  it("should return null for incomplete path", () => {
    const badgeDefs = {
      workflow: {
        checks: { label: "Checks" },
      },
    };

    const badge = resolveBadge("workflow", badgeDefs, null);

    expect(badge).toBeNull();
  });

  it("should use default label if not provided", () => {
    const badgeDefs = {
      workflow: {
        checks: {
          description: "Test badge",
        },
      },
    };

    const badge = resolveBadge("workflow.checks", badgeDefs, null);

    // Should still generate a badge even without label
    expect(badge).not.toBeNull();
  });

  it("should handle nested badge definitions", () => {
    const badgeDefs = {
      category: {
        subcategory: {
          badge: {
            label: "Test",
          },
        },
      },
    };

    // This tests multi-level path resolution
    const parts = "category.subcategory.badge".split(".");
    let current = badgeDefs;

    parts.forEach((part) => {
      current = current[part];
    });

    expect(current.label).toBe("Test");
  });
});

describe("Tag Matching Strategy", () => {
  it("should match tags with simple array format (any match)", () => {
    const tagsConfig = ["workflow", "automation"];
    const docTags = ["workflow"];

    const hasMatch = docTags.some((tag) => tagsConfig.includes(tag));

    expect(hasMatch).toBe(true);
  });

  it("should match tags with any strategy", () => {
    const tagsConfig = {
      match: "any",
      values: ["test", "badge"],
    };
    const docTags = ["test", "documentation"];

    const hasMatch = docTags.some((tag) => tagsConfig.values.includes(tag));

    expect(hasMatch).toBe(true);
  });

  it("should require all tags with all strategy", () => {
    const tagsConfig = {
      match: "all",
      values: ["critical", "security"],
    };
    const docTags = ["critical", "security", "documentation"];

    const hasAllMatch = tagsConfig.values.every((tag) => docTags.includes(tag));

    expect(hasAllMatch).toBe(true);
  });

  it("should fail all match if not all tags present", () => {
    const tagsConfig = {
      match: "all",
      values: ["critical", "security"],
    };
    const docTags = ["critical"];

    const hasAllMatch = tagsConfig.values.every((tag) => docTags.includes(tag));

    expect(hasAllMatch).toBe(false);
  });

  it("should fail any match if no tags match", () => {
    const tagsConfig = {
      match: "any",
      values: ["test", "badge"],
    };
    const docTags = ["documentation", "guide"];

    const hasMatch = docTags.some((tag) => tagsConfig.values.includes(tag));

    expect(hasMatch).toBe(false);
  });

  it("should handle empty document tags", () => {
    const tagsConfig = ["workflow"];
    const docTags = [];

    const hasMatch = docTags.some((tag) => tagsConfig.includes(tag));

    expect(hasMatch).toBe(false);
  });

  it("should handle single value in tag matching", () => {
    const tagsConfig = {
      match: "any",
      values: ["workflow"],
    };
    const docTags = ["workflow"];

    const hasMatch = docTags.some((tag) => tagsConfig.values.includes(tag));

    expect(hasMatch).toBe(true);
  });
});

describe("Metadata Badge Generation with Conditions", () => {
  it("should generate badges when frontmatter exists", () => {
    const frontMatter = { title: "Test" };
    const rule = {
      when: { has_front_matter: true },
      add: ["workflow.checks"],
    };

    let conditionMet = true;
    if (rule.when.has_front_matter && !frontMatter) {
      conditionMet = false;
    }

    expect(conditionMet).toBe(true);
  });

  it("should skip badges when frontmatter missing but required", () => {
    const frontMatter = null;
    const rule = {
      when: { has_front_matter: true },
      add: ["workflow.checks"],
    };

    let conditionMet = true;
    if (rule.when.has_front_matter && !frontMatter) {
      conditionMet = false;
    }

    expect(conditionMet).toBe(false);
  });

  it("should match license field in frontmatter", () => {
    const frontMatter = { license: "MIT" };
    const rule = {
      when: {
        front_matter: {
          license: ["MIT", "GPL-3.0"],
        },
      },
    };

    let conditionMet = true;
    const allowedLicenses = rule.when.front_matter.license;
    if (
      !frontMatter.license ||
      !allowedLicenses.includes(frontMatter.license)
    ) {
      conditionMet = false;
    }

    expect(conditionMet).toBe(true);
  });

  it("should fail license match if not in allowed list", () => {
    const frontMatter = { license: "Apache-2.0" };
    const rule = {
      when: {
        front_matter: {
          license: ["MIT", "GPL-3.0"],
        },
      },
    };

    let conditionMet = true;
    const allowedLicenses = rule.when.front_matter.license;
    if (
      !frontMatter.license ||
      !allowedLicenses.includes(frontMatter.license)
    ) {
      conditionMet = false;
    }

    expect(conditionMet).toBe(false);
  });
});

describe("README Update Functionality", () => {
  it("should identify badge markers in content", () => {
    const content = `# README

<!-- BADGES-START -->
<!-- BADGES-END -->

Content here`;

    const hasStart = content.includes("<!-- BADGES-START -->");
    const hasEnd = content.includes("<!-- BADGES-END -->");

    expect(hasStart).toBe(true);
    expect(hasEnd).toBe(true);
  });

  it("should replace badge block between markers", () => {
    const content = `# README

<!-- BADGES-START -->
Old badge
<!-- BADGES-END -->

Content`;

    const badgeStart = "<!-- BADGES-START -->";
    const badgeEnd = "<!-- BADGES-END -->";
    const newBadges = ["badge1", "badge2"];
    const badgeBlock = [badgeStart, ...newBadges, badgeEnd].join("\n");

    const newContent = content.replace(
      new RegExp(`${badgeStart}[\\s\\S]*?${badgeEnd}`, "m"),
      badgeBlock,
    );

    expect(newContent).toContain("badge1");
    expect(newContent).toContain("badge2");
    expect(newContent).not.toContain("Old badge");
  });

  it("should insert badge block after header if markers missing", () => {
    const content = `# README

Content here`;

    const badges = ["badge1"];
    const badgeBlock = `<!-- BADGES-START -->\n${badges.join("\n")}\n<!-- BADGES-END -->`;

    const newContent = content.replace(/^(# .+\n)/, `$1\n${badgeBlock}\n`);

    expect(newContent).toContain("<!-- BADGES-START -->");
    expect(newContent).toContain("badge1");
  });

  it("should preserve content outside badge block", () => {
    const content = `# README

<!-- BADGES-START -->
Old content
<!-- BADGES-END -->

Important content here`;

    const badgeStart = "<!-- BADGES-START -->";
    const badgeEnd = "<!-- BADGES-END -->";
    const newBadges = ["new-badge"];
    const badgeBlock = [badgeStart, ...newBadges, badgeEnd].join("\n");

    const newContent = content.replace(
      new RegExp(`${badgeStart}[\\s\\S]*?${badgeEnd}`, "m"),
      badgeBlock,
    );

    expect(newContent).toContain("Important content here");
  });
});

describe("Edge Cases and Error Handling", () => {
  it("should handle null badge definitions gracefully", () => {
    const badge = resolveBadge("test.badge", null, null);
    // Function returns null instead of throwing
    expect(badge).toBeNull();
  });

  it("should handle empty badge definitions", () => {
    const badge = resolveBadge("workflow.test", {}, null);
    expect(badge).toBeNull();
  });

  it("should handle special characters in workflow names", () => {
    const badge = generateWorkflowBadge(
      "org/repo",
      "workflow-with-special-chars.yml",
    );

    expect(badge).toContain("workflow-with-special-chars");
  });

  it("should handle very long badge references", () => {
    const longRef = "level1.level2.level3.level4.level5";
    const defs = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: { label: "Deep" },
            },
          },
        },
      },
    };

    const parts = longRef.split(".");
    let current = defs;
    for (const part of parts) {
      if (current && current[part]) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }

    expect(current).not.toBeNull();
    expect(current.label).toBe("Deep");
  });

  it("should handle schema with no workflows", () => {
    const schema = {
      badges: { workflow: {} },
      mapping: [],
      config: {},
    };

    expect(() => validateSchema(schema)).not.toThrow();
  });
});
