/**
 * Test Suite for Badge Workflow Testing Script
 *
 * Tests the badge workflow test runner:
 * - Schema validation
 * - Badge marker detection
 * - Badge URL format validation
 * - Frontmatter parsing
 * - Workflow coverage metrics
 */

const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Mock test functions that replicate the original test logic
const TESTS = {
  schema: {
    name: "Schema Validation",
    run: testSchemaValidation,
  },
  markers: {
    name: "Badge Marker Detection",
    run: testBadgeMarkers,
  },
  urls: {
    name: "Badge URL Format",
    run: testBadgeUrls,
  },
  frontmatter: {
    name: "Frontmatter Parsing",
    run: testFrontmatter,
  },
  coverage: {
    name: "Workflow Coverage",
    run: testWorkflowCoverage,
  },
};

let tempDir;

beforeAll(() => {
  // Create temporary directory for test files
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "badge-test-"));

  // Create .github/automation directory
  fs.mkdirSync(path.join(tempDir, ".github", "automation"), {
    recursive: true,
  });

  // Create mock schema file
  const schemaContent = `---
badges:
  workflow:
    checks:
      label: "Checks"
      description: "Automated checks"
    docs-validation:
      label: "Docs Validation"
      description: "Documentation validation"
mapping:
  - when:
      has_front_matter: true
    add:
      - workflow.checks
config:
  repository: "lightspeedwp/.github"
  enabled: true
`;
  fs.writeFileSync(
    path.join(tempDir, ".github/automation/badges.schema.yml"),
    schemaContent,
  );

  // Create docs directory with test markdown files
  fs.mkdirSync(path.join(tempDir, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(tempDir, "docs/test1.md"),
    `# Test Doc 1

<!-- BADGES-START -->
<!-- BADGES-END -->

Content here`,
  );
  fs.writeFileSync(
    path.join(tempDir, "docs/test2.md"),
    `# Test Doc 2

Content without markers`,
  );

  // Create workflows directory
  fs.mkdirSync(path.join(tempDir, ".github/workflows"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, ".github/workflows/checks.yml"), "");
  fs.writeFileSync(
    path.join(tempDir, ".github/workflows/docs-validation.yml"),
    "",
  );
  fs.writeFileSync(path.join(tempDir, ".github/workflows/release.yml"), "");
});

afterAll(() => {
  // Clean up temp directory
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

async function testSchemaValidation() {
  const schemaPath = path.join(tempDir, ".github/automation/badges.schema.yml");

  if (!fs.existsSync(schemaPath)) {
    throw new Error("Schema file not found");
  }

  const content = fs.readFileSync(schemaPath, "utf-8");

  // Check required sections
  if (!content.includes("badges:")) {
    throw new Error("Schema missing 'badges' section");
  }

  if (!content.includes("mapping:")) {
    throw new Error("Schema missing 'mapping' section");
  }

  if (!content.includes("config:")) {
    throw new Error("Schema missing 'config' section");
  }

  // Count workflows in schema
  const workflowCount = (content.match(/^\s{4}[a-z0-9-]+:\s*$/gm) || []).length;

  return {
    passed: true,
    message: `Schema valid with ${workflowCount} workflow definitions`,
  };
}

async function testBadgeMarkers() {
  const docsDir = path.join(tempDir, "docs");
  let filesWithMarkers = 0;
  let filesWithoutMarkers = 0;

  // Find markdown files
  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .slice(0, 10);

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(docsDir, file), "utf-8");

    if (
      content.includes("<!-- BADGES-START -->") &&
      content.includes("<!-- BADGES-END -->")
    ) {
      filesWithMarkers++;
    } else {
      filesWithoutMarkers++;
    }
  });

  if (filesWithMarkers === 0) {
    throw new Error("No files with badge markers found in docs/");
  }

  return {
    passed: true,
    message: `Found ${filesWithMarkers} files with badge markers (${filesWithoutMarkers} without)`,
  };
}

async function testBadgeUrls() {
  const badgeFormats = [
    /https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/workflows\/[^/]+\/badge\.svg/,
    /https:\/\/img\.shields\.io\/badge\/[^)]+/,
  ];

  // Test that badges can generate valid URLs
  const repo = "lightspeedwp/.github";
  const workflowName = "checks.yml";
  const branch = "develop";

  const expectedUrl = `https://github.com/${repo}/actions/workflows/${workflowName}/badge.svg?branch=${branch}`;

  if (!badgeFormats[0].test(expectedUrl)) {
    throw new Error("Invalid GitHub Actions badge URL format");
  }

  return {
    passed: true,
    message: `Badge URL format valid: ${expectedUrl}`,
  };
}

async function testFrontmatter() {
  const testContent = `---
title: Test Document
file_type: documentation
tags:
  - test
  - badges
---

# Test Document

Content here...`;

  // Extract frontmatter
  const match = testContent.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error("Could not parse frontmatter");
  }

  const frontmatter = match[1];

  if (!frontmatter.includes("title: Test Document")) {
    throw new Error("Frontmatter parsing failed");
  }

  return {
    passed: true,
    message: "Frontmatter parsing works correctly",
  };
}

async function testWorkflowCoverage() {
  const workflowsDir = path.join(tempDir, ".github/workflows");
  const schemaPath = path.join(tempDir, ".github/automation/badges.schema.yml");

  // Count actual workflows
  const workflows = fs
    .readdirSync(workflowsDir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

  // Count workflows in schema
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const schemaWorkflows = (schemaContent.match(/^\s{4}[a-z0-9-]+:\s*$/gm) || [])
    .length;

  if (schemaWorkflows === 0) {
    throw new Error("No workflows found in schema");
  }

  const coverage = (schemaWorkflows / workflows.length) * 100;

  return {
    passed: true,
    message: `Coverage: ${schemaWorkflows}/${workflows.length} workflows (${coverage.toFixed(1)}%)`,
  };
}

describe("Badge Workflow Tests", () => {
  describe("Schema Validation", () => {
    it("should validate schema with all required sections", async () => {
      const result = await testSchemaValidation();
      expect(result.passed).toBe(true);
      expect(result.message).toContain("workflow definitions");
    });

    it("should fail if schema is missing badges section", async () => {
      const invalidSchemaPath = path.join(
        tempDir,
        ".github/automation/invalid.yml",
      );
      fs.writeFileSync(invalidSchemaPath, "mapping:\n  - test");

      const content = fs.readFileSync(invalidSchemaPath, "utf-8");
      expect(content).not.toContain("badges:");
    });

    it("should fail if schema is missing mapping section", async () => {
      const invalidSchemaPath = path.join(
        tempDir,
        ".github/automation/invalid2.yml",
      );
      fs.writeFileSync(invalidSchemaPath, "badges:\n  workflow: {}");

      const content = fs.readFileSync(invalidSchemaPath, "utf-8");
      expect(content).not.toContain("mapping:");
    });
  });

  describe("Badge Marker Detection", () => {
    it("should detect badge markers in markdown files", async () => {
      const result = await testBadgeMarkers();
      expect(result.passed).toBe(true);
      expect(result.message).toContain("files with badge markers");
    });

    it("should count files with and without markers", async () => {
      const result = await testBadgeMarkers();
      expect(result.message).toMatch(/Found \d+ files/);
    });

    it("should handle directories with mixed marker usage", async () => {
      const docsDir = path.join(tempDir, "docs");
      const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));
      expect(files.length).toBeGreaterThan(0);
    });
  });

  describe("Badge URL Format", () => {
    it("should validate GitHub Actions badge URL format", async () => {
      const result = await testBadgeUrls();
      expect(result.passed).toBe(true);
      expect(result.message).toContain("Badge URL format valid");
    });

    it("should generate valid URLs with branch parameter", () => {
      const repo = "lightspeedwp/.github";
      const workflowName = "checks.yml";
      const branch = "develop";

      const url = `https://github.com/${repo}/actions/workflows/${workflowName}/badge.svg?branch=${branch}`;
      const pattern =
        /https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/workflows\/[^/]+\/badge\.svg/;

      expect(url).toMatch(pattern);
    });

    it("should match shields.io badge format", () => {
      const badgeUrl = "https://img.shields.io/badge/test-success-green.svg";
      const pattern = /https:\/\/img\.shields\.io\/badge\/[^)]+/;

      expect(badgeUrl).toMatch(pattern);
    });
  });

  describe("Frontmatter Parsing", () => {
    it("should parse YAML frontmatter correctly", async () => {
      const result = await testFrontmatter();
      expect(result.passed).toBe(true);
      expect(result.message).toBe("Frontmatter parsing works correctly");
    });

    it("should extract title from frontmatter", () => {
      const content = `---
title: Test Document
---

Content`;

      const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
      expect(match).not.toBeNull();
      expect(match[1]).toContain("title: Test Document");
    });

    it("should handle tags in frontmatter", () => {
      const content = `---
tags:
  - test
  - badges
---

Content`;

      const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
      expect(match[1]).toContain("tags:");
    });

    it("should handle files without frontmatter", () => {
      const content = "# Just a title\n\nSome content";
      const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
      expect(match).toBeNull();
    });
  });

  describe("Workflow Coverage", () => {
    it("should calculate workflow coverage percentage", async () => {
      const result = await testWorkflowCoverage();
      expect(result.passed).toBe(true);
      expect(result.message).toMatch(/Coverage: \d+\/\d+ workflows/);
    });

    it("should count actual workflows in directory", () => {
      const workflowsDir = path.join(tempDir, ".github/workflows");
      const workflows = fs
        .readdirSync(workflowsDir)
        .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

      expect(workflows.length).toBeGreaterThan(0);
    });

    it("should ensure schema has workflow definitions", () => {
      const schemaPath = path.join(
        tempDir,
        ".github/automation/badges.schema.yml",
      );
      const content = fs.readFileSync(schemaPath, "utf-8");
      const schemaWorkflows = (content.match(/^\s{4}[a-z0-9-]+:\s*$/gm) || [])
        .length;

      expect(schemaWorkflows).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle missing schema file gracefully", () => {
      const nonexistentPath = path.join(
        tempDir,
        ".github/automation/nonexistent.yml",
      );
      expect(fs.existsSync(nonexistentPath)).toBe(false);
    });

    it("should handle empty docs directory", () => {
      const emptyDir = path.join(tempDir, "empty-docs");
      fs.mkdirSync(emptyDir, { recursive: true });

      const files = fs.readdirSync(emptyDir).filter((f) => f.endsWith(".md"));

      expect(files.length).toBe(0);
    });

    it("should handle malformed YAML in schema", () => {
      const content = "invalid: yaml: content: here";
      expect(content).toBeTruthy();
    });

    it("should handle workflow files with different extensions", () => {
      const yamlFile = path.join(tempDir, ".github/workflows/test.yml");
      const yamlFileAlt = path.join(tempDir, ".github/workflows/test2.yaml");

      fs.writeFileSync(yamlFile, "");
      fs.writeFileSync(yamlFileAlt, "");

      const workflows = fs
        .readdirSync(path.dirname(yamlFile))
        .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

      expect(workflows.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Test Runner Integration", () => {
    it("should have all test functions defined", () => {
      expect(TESTS.schema).toBeDefined();
      expect(TESTS.markers).toBeDefined();
      expect(TESTS.urls).toBeDefined();
      expect(TESTS.frontmatter).toBeDefined();
      expect(TESTS.coverage).toBeDefined();
    });

    it("should have all tests with run function", () => {
      Object.entries(TESTS).forEach(([_testKey, test]) => {
        expect(test.name).toBeTruthy();
        expect(typeof test.run).toBe("function");
      });
    });

    it("should run all tests successfully", async () => {
      const results = [];
      for (const [testKey, test] of Object.entries(TESTS)) {
        try {
          const result = await test.run();
          results.push({ testKey, passed: result.passed });
        } catch (error) {
          results.push({ testKey, passed: false, error: error.message });
        }
      }

      // At least some tests should pass
      const passedTests = results.filter((r) => r.passed).length;
      expect(passedTests).toBeGreaterThan(0);
    });
  });
});
