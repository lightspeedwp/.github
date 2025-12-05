/**
 * Tests for Frontmatter Validation Script
 *
 * @fileoverview Test suite for frontmatter validation functionality
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  FrontmatterValidator,
  FrontmatterExtractor,
  FileDiscovery,
  Logger,
  CONFIG,
} = require("../validate-frontmatter");

describe("Frontmatter Validation", () => {
  let tempDir;
  let testFiles;

  beforeEach(() => {
    // Create temporary directory for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "frontmatter-test-"));
    testFiles = {};
  });

  afterEach(() => {
    // Clean up temporary files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const createTestFile = (name, content) => {
    const filePath = path.join(tempDir, name);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    testFiles[name] = filePath;
    return filePath;
  };

  describe("FrontmatterExtractor", () => {
    test("should extract valid YAML frontmatter", () => {
      const content = `---
file_type: "documentation"
name: "Test File"
description: "A test file"
---

# Content here`;

      const result = FrontmatterExtractor.extract(content, "test.md");

      expect(result.hasYamlBlock).toBe(true);
      expect(result.frontmatter).toEqual({
        file_type: "documentation",
        name: "Test File",
        description: "A test file",
      });
    });

    test("should handle files without frontmatter", () => {
      const content = `# Just a regular markdown file

No frontmatter here.`;

      const result = FrontmatterExtractor.extract(content, "test.md");

      expect(result.hasYamlBlock).toBe(false);
      expect(result.frontmatter).toBeNull();
    });

    test("should throw error for invalid YAML", () => {
      const content = `---
file_type: "documentation
invalid: yaml: content
---

# Content`;

      expect(() => {
        FrontmatterExtractor.extract(content, "test.md");
      }).toThrow(/Invalid YAML frontmatter/);
    });
  });

  describe("Logger", () => {
    test("should create log directory if it does not exist", () => {
      const logPath = path.join(tempDir, "logs", "test.log");
      const logger = new Logger(logPath);

      expect(fs.existsSync(path.dirname(logPath))).toBe(true);
    });

    test("should log messages with different levels", () => {
      const logPath = path.join(tempDir, "test.log");
      const logger = new Logger(logPath);

      logger.info("Test info message");
      logger.warn("Test warning message");
      logger.error("Test error message");
      logger.success("Test success message");

      expect(logger.logs).toHaveLength(4);
      expect(logger.logs[0].level).toBe("INFO");
      expect(logger.logs[1].level).toBe("WARN");
      expect(logger.logs[2].level).toBe("ERROR");
      expect(logger.logs[3].level).toBe("SUCCESS");
    });

    test("should write logs to file", () => {
      const logPath = path.join(tempDir, "test.log");
      const logger = new Logger(logPath);

      logger.info("Test message");
      logger.writeToFile();

      expect(fs.existsSync(logPath)).toBe(true);
      const logContent = fs.readFileSync(logPath, "utf8");
      expect(logContent).toContain("INFO: Test message");
    });
  });

  describe("FileDiscovery", () => {
    beforeEach(() => {
      // Create test file structure
      createTestFile("README.md", "# Test");
      createTestFile(".github/agents/test.md", "# Agent");
      createTestFile("docs/guide.md", "# Guide");
      createTestFile("node_modules/package/README.md", "# Package");
      createTestFile("test.txt", "Plain text");
    });

    test("should find files matching patterns", () => {
      const files = FileDiscovery.findFiles(
        ["**/*.md"],
        ["node_modules/**"],
        tempDir,
      );

      expect(files).toHaveLength(3);
      expect(files.some((f) => f.includes("README.md"))).toBe(true);
      expect(files.some((f) => f.includes(".github/agents/test.md"))).toBe(
        true,
      );
      expect(files.some((f) => f.includes("docs/guide.md"))).toBe(true);
      expect(files.some((f) => f.includes("node_modules"))).toBe(false);
    });

    test("should exclude files matching exclude patterns", () => {
      const files = FileDiscovery.findFiles(["**/*.md"], ["docs/**"], tempDir);

      expect(files.some((f) => f.includes("docs/guide.md"))).toBe(false);
    });
  });

  describe("FrontmatterValidator", () => {
    let validator;
    let logger;
    let testSchema;

    beforeEach(() => {
      // Create a simple test schema
      testSchema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          file_type: {
            type: "string",
            enum: ["documentation", "agent", "readme"],
          },
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
        required: ["file_type", "description"],
      };

      const schemaPath = path.join(tempDir, "test-schema.json");
      fs.writeFileSync(schemaPath, JSON.stringify(testSchema, null, 2));

      const logPath = path.join(tempDir, "test.log");
      logger = new Logger(logPath);
      validator = new FrontmatterValidator(schemaPath, logger);
    });

    test("should validate correct frontmatter", () => {
      const content = `---
file_type: "documentation"
name: "Test File"
description: "A test file"
---

# Content`;

      const filePath = createTestFile("valid.md", content);
      validator.validateFile(filePath);

      const stats = validator.getStats();
      expect(stats.validated).toBe(1);
      expect(stats.errors).toBe(0);
    });

    test("should detect missing required fields", () => {
      const content = `---
file_type: "documentation"
name: "Test File"
---

# Content`;

      const filePath = createTestFile("missing-desc.md", content);
      validator.validateFile(filePath);

      const stats = validator.getStats();
      expect(stats.errors).toBe(1);
      expect(stats.validated).toBe(0);
    });

    test("should detect invalid field values", () => {
      const content = `---
file_type: "invalid_type"
description: "A test file"
---

# Content`;

      const filePath = createTestFile("invalid-type.md", content);
      validator.validateFile(filePath);

      const stats = validator.getStats();
      expect(stats.errors).toBe(1);
    });

    test("should identify file types correctly", () => {
      expect(validator.getFileType(".github/agents/test.md")).toBe("agent");
      expect(validator.getFileType(".github/chatmodes/test.md")).toBe(
        "chatmode",
      );
      expect(validator.getFileType(".github/instructions/test.md")).toBe(
        "instruction",
      );
      expect(validator.getFileType("README.md")).toBe("readme");
      expect(validator.getFileType(".github/custom-file.md")).toBe(
        "documentation",
      );
    });

    test("should check for required fields by file type", () => {
      const agentFields = validator.getRequiredFieldsByType("agent");
      expect(agentFields).toContain("file_type");
      expect(agentFields).toContain("name");
      expect(agentFields).toContain("description");

      const readmeFields = validator.getRequiredFieldsByType("readme");
      expect(readmeFields).toContain("file_type");
      expect(readmeFields).toContain("name");
      expect(readmeFields).toContain("description");
    });

    test("should validate references field", () => {
      // Create referenced files
      createTestFile("referenced.md", "# Referenced");

      const content = `---
file_type: "documentation"
description: "Test with references"
references:
  - "referenced.md"
  - "non-existent.md"
---

# Content`;

      const filePath = createTestFile("with-refs.md", content);
      validator.validateFile(filePath);

      // Should log warning about non-existent reference
      const warningLogs = logger.logs.filter((log) => log.level === "WARN");
      expect(
        warningLogs.some((log) =>
          log.message.includes("Referenced file does not exist"),
        ),
      ).toBe(true);
    });

    test("should handle files without frontmatter appropriately", () => {
      const content = `# Just a regular file

No frontmatter here.`;

      // File that should have frontmatter
      const readmePath = createTestFile("README.md", content);
      validator.validateFile(readmePath);

      // File that doesn't need frontmatter
      const regularPath = createTestFile("regular.md", content);
      validator.validateFile(regularPath);

      const stats = validator.getStats();
      expect(stats.warnings).toBeGreaterThan(0); // README should trigger warning
      expect(stats.skipped).toBeGreaterThan(0); // Regular file should be skipped
    });
  });

  describe("Integration tests", () => {
    test("should validate real schema file if it exists", () => {
      const schemaPath = path.resolve(
        __dirname,
        "../../../schemas/frontmatter.schema.json",
      );

      if (fs.existsSync(schemaPath)) {
        const logPath = path.join(tempDir, "integration.log");
        const logger = new Logger(logPath);

        expect(() => {
          new FrontmatterValidator(schemaPath, logger);
        }).not.toThrow();
      } else {
        console.warn("Skipping real schema test - schema file not found");
      }
    });

    test("should handle typical LightSpeed frontmatter patterns", () => {
      const testSchema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          file_type: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          version: { type: "string" },
          last_updated: { type: "string" },
          owners: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          references: { type: "array", items: { type: "string" } },
        },
        required: ["file_type", "description"],
      };

      const schemaPath = path.join(tempDir, "lightspeed-schema.json");
      fs.writeFileSync(schemaPath, JSON.stringify(testSchema, null, 2));

      const content = `---
file_type: "agent"
name: "Test Agent"
description: "A comprehensive test agent for validation"
version: "1.0.0"
last_updated: "2025-12-04"
owners:
  - "LightSpeedWP Team"
tags:
  - "testing"
  - "validation"
  - "agent"
references:
  - "schemas/frontmatter.schema.json"
  - ".github/instructions/tagging-and-frontmatter-conventions.instructions.md"
---

# Test Agent

This is a test agent file.`;

      const filePath = createTestFile(".github/agents/test-agent.md", content);

      const logger = new Logger(path.join(tempDir, "test.log"));
      const validator = new FrontmatterValidator(schemaPath, logger);

      validator.validateFile(filePath);

      const stats = validator.getStats();
      expect(stats.validated).toBe(1);
      expect(stats.errors).toBe(0);
    });
  });
});

describe("CLI Interface", () => {
  test("should parse command line arguments", () => {
    // This would require mocking process.argv and testing the CLI interface
    // For now, we'll just verify the CONFIG object structure
    expect(CONFIG).toHaveProperty("schemaPath");
    expect(CONFIG).toHaveProperty("rootDir");
    expect(CONFIG).toHaveProperty("logDir");
    expect(CONFIG).toHaveProperty("outputFile");
    expect(CONFIG).toHaveProperty("patterns");
    expect(CONFIG).toHaveProperty("excludePatterns");
  });
});
