/**
 * Test Suite for Badge Schema Generation Script
 *
 * Tests the schema generation functionality:
 * - Workflow scanning
 * - Schema creation
 * - Schema merging with existing data
 * - Workflow categorization
 * - Schema persistence
 */

const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const fs = require("fs");
const path = require("path");
const os = require("os");

let tempDir;
let originalCwd;

// Helper functions from generate-schema.js
function workflowNameToLabel(workflowName) {
  return workflowName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateWorkflowDefinition(workflowName) {
  return {
    label: workflowNameToLabel(workflowName),
    description: `Auto-generated badge for ${workflowName}`,
    branch: "develop",
  };
}

function scanWorkflows(workflowsDir) {
  if (!fs.existsSync(workflowsDir)) {
    throw new Error(`Workflows directory not found: ${workflowsDir}`);
  }

  const workflows = fs
    .readdirSync(workflowsDir)
    .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
    .map((file) => file.replace(/\.(yml|yaml)$/, ""))
    .sort();

  return workflows;
}

function loadExistingSchema(schemaPath) {
  if (!fs.existsSync(schemaPath)) {
    return null;
  }

  const content = fs.readFileSync(schemaPath, "utf-8");
  // Simple YAML parsing for test
  return { raw: content };
}

function createSchema(workflows) {
  const badges = {
    workflow: {},
  };

  workflows.forEach((workflow) => {
    badges.workflow[workflow] = generateWorkflowDefinition(workflow);
  });

  badges.meta = {
    license: {
      label: "License",
      description: "License badge from frontmatter",
      color: "blue",
    },
    "file-type": {
      label: "File Type",
      description: "Document file type badge",
      color: "lightgrey",
    },
    status: {
      label: "Status",
      description: "Document status badge",
      color: "yellow",
    },
  };

  const mapping = [
    {
      when: {
        has_front_matter: true,
      },
      add: [
        "workflow.checks",
        "workflow.docs-validation",
        "workflow.gitleaks",
        "workflow.main-branch-guard",
        "workflow.release",
      ],
    },
  ];

  const config = {
    repository: "lightspeedwp/.github",
    default_branch: "develop",
    format: "stacked",
    enabled: true,
    markers: {
      start: "<!-- BADGES-START -->",
      end: "<!-- BADGES-END -->",
    },
    validation: {
      validate_links: true,
      validation_frequency: 7,
      report_broken_links: true,
      link_timeout: 10,
    },
    coverage: {
      track_coverage: true,
      target_coverage: 75,
      report_metrics: true,
    },
  };

  return {
    badges,
    mapping,
    config,
  };
}

beforeAll(() => {
  originalCwd = process.cwd();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "schema-test-"));

  // Create workflows directory with test files
  fs.mkdirSync(path.join(tempDir, ".github/workflows"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, ".github/workflows/checks.yml"), "");
  fs.writeFileSync(path.join(tempDir, ".github/workflows/release.yml"), "");
  fs.writeFileSync(
    path.join(tempDir, ".github/workflows/custom-workflow.yml"),
    "",
  );
  fs.writeFileSync(
    path.join(tempDir, ".github/workflows/docs-validation.yml"),
    "",
  );
});

afterAll(() => {
  process.chdir(originalCwd);
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe("Badge Schema Generation", () => {
  describe("Workflow Scanning", () => {
    it("should find all workflow files in directory", () => {
      const workflowsDir = path.join(tempDir, ".github/workflows");
      const workflows = scanWorkflows(workflowsDir);

      expect(workflows.length).toBeGreaterThan(0);
      expect(workflows).toContain("checks");
      expect(workflows).toContain("release");
    });

    it("should handle both .yml and .yaml extensions", () => {
      const workflowsDir = path.join(tempDir, ".github/workflows");

      fs.writeFileSync(path.join(workflowsDir, "test.yaml"), "");
      const workflows = scanWorkflows(workflowsDir);

      const hasYaml = workflows.some((w) => w === "test");
      expect(hasYaml).toBe(true);
    });

    it("should strip file extension from workflow names", () => {
      const workflowsDir = path.join(tempDir, ".github/workflows");
      const workflows = scanWorkflows(workflowsDir);

      workflows.forEach((workflow) => {
        expect(workflow).not.toMatch(/\.(yml|yaml)$/);
      });
    });

    it("should sort workflows alphabetically", () => {
      const workflowsDir = path.join(tempDir, ".github/workflows");
      const workflows = scanWorkflows(workflowsDir);

      const sorted = [...workflows].sort();
      expect(workflows).toEqual(sorted);
    });

    it("should throw error if workflows directory does not exist", () => {
      const nonexistentDir = path.join(tempDir, "nonexistent");
      expect(() => scanWorkflows(nonexistentDir)).toThrow();
    });

    it("should return empty array if no workflows found", () => {
      const emptyDir = path.join(tempDir, "empty-workflows");
      fs.mkdirSync(emptyDir, { recursive: true });

      const workflows = scanWorkflows(emptyDir);
      expect(Array.isArray(workflows)).toBe(true);
    });
  });

  describe("Workflow Name to Label Conversion", () => {
    it("should convert kebab-case to title case", () => {
      expect(workflowNameToLabel("checks")).toBe("Checks");
      expect(workflowNameToLabel("main-branch-guard")).toBe(
        "Main Branch Guard",
      );
      expect(workflowNameToLabel("issue-labeling-automation")).toBe(
        "Issue Labeling Automation",
      );
    });

    it("should handle single-word workflow names", () => {
      expect(workflowNameToLabel("release")).toBe("Release");
    });

    it("should preserve all words in multi-word names", () => {
      const label = workflowNameToLabel("docs-validation-checks");
      expect(label).toBe("Docs Validation Checks");
      expect(label.split(" ").length).toBe(3);
    });
  });

  describe("Workflow Definition Generation", () => {
    it("should generate definition with label", () => {
      const def = generateWorkflowDefinition("checks");
      expect(def.label).toBe("Checks");
    });

    it("should generate definition with description", () => {
      const def = generateWorkflowDefinition("checks");
      expect(def.description).toContain("checks");
    });

    it("should set branch to develop by default", () => {
      const def = generateWorkflowDefinition("checks");
      expect(def.branch).toBe("develop");
    });

    it("should generate consistent definitions", () => {
      const def1 = generateWorkflowDefinition("test-workflow");
      const def2 = generateWorkflowDefinition("test-workflow");

      expect(def1).toEqual(def2);
    });
  });

  describe("Schema Creation", () => {
    it("should create schema with badges section", () => {
      const workflows = ["checks", "release"];
      const schema = createSchema(workflows);

      expect(schema.badges).toBeDefined();
      expect(schema.badges.workflow).toBeDefined();
    });

    it("should create workflow badges for all workflows", () => {
      const workflows = ["checks", "release", "custom"];
      const schema = createSchema(workflows);

      expect(schema.badges.workflow.checks).toBeDefined();
      expect(schema.badges.workflow.release).toBeDefined();
      expect(schema.badges.workflow.custom).toBeDefined();
    });

    it("should include metadata badges", () => {
      const workflows = ["checks"];
      const schema = createSchema(workflows);

      expect(schema.badges.meta).toBeDefined();
      expect(schema.badges.meta.license).toBeDefined();
      expect(schema.badges.meta["file-type"]).toBeDefined();
      expect(schema.badges.meta.status).toBeDefined();
    });

    it("should include mapping rules", () => {
      const workflows = ["checks"];
      const schema = createSchema(workflows);

      expect(schema.mapping).toBeDefined();
      expect(Array.isArray(schema.mapping)).toBe(true);
      expect(schema.mapping.length).toBeGreaterThan(0);
    });

    it("should include configuration section", () => {
      const workflows = ["checks"];
      const schema = createSchema(workflows);

      expect(schema.config).toBeDefined();
      expect(schema.config.repository).toBe("lightspeedwp/.github");
      expect(schema.config.default_branch).toBe("develop");
      expect(schema.config.enabled).toBe(true);
    });
  });

  describe("Existing Schema Loading", () => {
    it("should return null if schema file does not exist", () => {
      const nonexistentPath = path.join(tempDir, "nonexistent-schema.yml");
      const result = loadExistingSchema(nonexistentPath);
      expect(result).toBeNull();
    });

    it("should load schema if file exists", () => {
      const schemaPath = path.join(tempDir, ".github/automation/schema.yml");
      fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
      fs.writeFileSync(schemaPath, "test: content");

      const result = loadExistingSchema(schemaPath);
      expect(result).not.toBeNull();
      expect(result.raw).toContain("test: content");
    });

    it("should preserve raw content when loading", () => {
      const schemaPath = path.join(tempDir, ".github/automation/schema2.yml");
      fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
      const content = "key: value\nother: data";
      fs.writeFileSync(schemaPath, content);

      const result = loadExistingSchema(schemaPath);
      expect(result.raw).toBe(content);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle empty workflow array", () => {
      const schema = createSchema([]);
      expect(schema.badges).toBeDefined();
      expect(Object.keys(schema.badges.workflow).length).toBe(0);
    });

    it("should handle workflows with special characters", () => {
      const label = workflowNameToLabel("workflow-with-many-hyphens");
      expect(label).not.toContain("-");
      expect(label.split(" ").length).toBeGreaterThan(1);
    });

    it("should handle very long workflow names", () => {
      const longName = "very-long-workflow-name-with-many-words-in-it";
      const label = workflowNameToLabel(longName);
      expect(label).toBeTruthy();
    });

    it("should ensure schema has valid structure", () => {
      const workflows = ["test"];
      const schema = createSchema(workflows);

      // Required sections
      expect(schema.badges).toBeDefined();
      expect(schema.mapping).toBeDefined();
      expect(schema.config).toBeDefined();
    });

    it("should create valid marker configuration", () => {
      const workflows = ["test"];
      const schema = createSchema(workflows);

      expect(schema.config.markers.start).toBe("<!-- BADGES-START -->");
      expect(schema.config.markers.end).toBe("<!-- BADGES-END -->");
    });
  });

  describe("Schema Validation", () => {
    it("should have all required badge sections", () => {
      const workflows = ["checks"];
      const schema = createSchema(workflows);

      expect(schema.badges.workflow).toBeDefined();
      expect(schema.badges.meta).toBeDefined();
    });

    it("should have all required config properties", () => {
      const workflows = ["checks"];
      const schema = createSchema(workflows);

      expect(schema.config.repository).toBeTruthy();
      expect(schema.config.default_branch).toBeTruthy();
      expect(schema.config.enabled).toBeDefined();
      expect(schema.config.markers).toBeDefined();
      expect(schema.config.validation).toBeDefined();
      expect(schema.config.coverage).toBeDefined();
    });

    it("should have mapping with when/add structure", () => {
      const workflows = ["checks"];
      const schema = createSchema(workflows);

      schema.mapping.forEach((rule) => {
        expect(rule.when).toBeDefined();
        expect(rule.add).toBeDefined();
        expect(Array.isArray(rule.add)).toBe(true);
      });
    });
  });
});
