const memoryUpdater = require("../shared/memory-updater");
const fs = require("fs");
const path = require("path");

describe("Memory Updater Module", () => {
  const testDir = path.join(__dirname, "fixtures", "memory-test-updater");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    const memoryDir = path.join(testDir, ".remember");
    if (fs.existsSync(memoryDir)) {
      fs.rmSync(memoryDir, { recursive: true });
    }
  });

  // Memory entry creation tests
  describe("createMemoryEntry", () => {
    test("should create entry with required fields", () => {
      const metadata = {
        sessionId: "test-123",
        branch: "feat/test-feature",
        repoType: "control-plane",
        issueNumbers: ["#1234", "#1235"],
        commits: [
          {
            hash: "abc123",
            message: "feat: Add feature",
            author: "Test User",
            date: "2026-08-12T10:00:00Z",
          },
        ],
      };

      const entry = memoryUpdater.createMemoryEntry(metadata);

      expect(entry.frontmatter.name).toBe("chat-closure-test-123");
      expect(entry.frontmatter.metadata.branch).toBe("feat/test-feature");
      expect(entry.frontmatter.metadata.repo_type).toBe("control-plane");
      expect(entry.families.project_context).toBeDefined();
    });

    test("should handle missing optional fields", () => {
      const metadata = {
        sessionId: "min-123",
        branch: "feat/minimal",
        repoType: "wordpress-plugin",
      };

      const entry = memoryUpdater.createMemoryEntry(metadata);

      expect(entry.frontmatter.metadata.related_issues).toEqual([]);
      expect(entry.families.decision_log).toContain(
        "(No major decisions documented)",
      );
    });

    test("should format family content properly", () => {
      const metadata = {
        sessionId: "test-456",
        branch: "fix/bug-fix",
        repoType: "wordpress-theme",
        issueNumbers: ["#999"],
        commits: [
          {
            hash: "xyz789",
            message: "fix: Resolve issue",
            author: "Dev",
            date: "2026-08-12T11:00:00Z",
          },
        ],
        decisions: {
          "memory-depth": {
            choice: "Moderate",
            rationale: "Balance brevity with context",
          },
        },
        blockers: ["API rate limit"],
        nextSteps: ["Write tests", "Submit PR"],
      };

      const entry = memoryUpdater.createMemoryEntry(metadata);

      expect(entry.families.user_defaults).toHaveLength(4);
      expect(entry.families.decision_log[0]).toContain("✅ **memory-depth**");
      expect(entry.families.execution_state.some((s) => s.includes("⚠️"))).toBe(
        true,
      );
      expect(entry.families.execution_state.some((s) => s.includes("⏳"))).toBe(
        true,
      );
    });
  });

  // Markdown formatting tests
  describe("formatMemoryAsMarkdown", () => {
    test("should format entry with frontmatter and families", () => {
      const entry = {
        frontmatter: {
          name: "test-entry",
          description: "Test entry",
          metadata: {
            type: "handoff",
            session_id: "test",
            branch: "feat/test",
          },
        },
        families: {
          user_defaults: ["Default 1", "Default 2"],
          project_context: ["Context 1"],
          decision_log: ["Decision 1"],
          execution_state: ["State 1"],
          handoff: ["Handoff 1"],
        },
      };

      const markdown = memoryUpdater.formatMemoryAsMarkdown(entry);

      expect(markdown).toContain("---");
      expect(markdown).toContain("name: test-entry");
      expect(markdown).toContain("## User Defaults");
      expect(markdown).toContain("- Default 1");
      expect(markdown).toContain("## Project Context");
      expect(markdown).toContain("## Decision Log");
    });

    test("should escape special characters in frontmatter", () => {
      const entry = {
        frontmatter: {
          name: "test-special",
          description: 'Test with "quotes" and special chars',
          metadata: {
            type: "handoff",
            session_id: "test",
          },
        },
        families: {
          user_defaults: [],
        },
      };

      const markdown = memoryUpdater.formatMemoryAsMarkdown(entry);

      expect(markdown).toContain('description: "Test with');
      expect(markdown).toContain("---\n\n");
    });

    test("should handle array metadata in frontmatter", () => {
      const entry = {
        frontmatter: {
          name: "test-array",
          description: "Test with arrays",
          metadata: {
            type: "handoff",
            related_issues: ["#1", "#2", "#3"],
          },
        },
        families: {
          user_defaults: [],
        },
      };

      const markdown = memoryUpdater.formatMemoryAsMarkdown(entry);

      expect(markdown).toContain('related_issues: ["#1", "#2", "#3"]');
    });
  });

  // Memory index update tests
  describe("updateMemoryIndex", () => {
    test("should create new index if missing", () => {
      const memoryDir = path.join(testDir, ".remember");
      if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
      }

      const result = memoryUpdater.updateMemoryIndex(
        testDir,
        "new-entry",
        "New test entry",
      );

      expect(result.created).toBe(true);
      expect(result.modified).toBe(false);

      const indexPath = path.join(testDir, ".remember", "MEMORY.md");
      const content = fs.readFileSync(indexPath, "utf8");
      expect(content).toContain("[new-entry](./new-entry.md)");
      expect(content).toContain("New test entry");
    });

    test("should append to existing index", () => {
      const indexDir = path.join(testDir, ".remember");
      fs.mkdirSync(indexDir, { recursive: true });
      fs.writeFileSync(
        path.join(indexDir, "MEMORY.md"),
        "# Memory Index\n\n- [first](./first.md) — First entry\n",
      );

      const result = memoryUpdater.updateMemoryIndex(
        testDir,
        "second-entry",
        "Second entry",
      );

      expect(result.created).toBe(false);
      expect(result.modified).toBe(true);

      const content = fs.readFileSync(path.join(indexDir, "MEMORY.md"), "utf8");
      expect(content).toContain("[first]");
      expect(content).toContain("[second-entry]");
    });

    test("should not duplicate existing entries", () => {
      const indexDir = path.join(testDir, ".remember");
      fs.mkdirSync(indexDir, { recursive: true });
      fs.writeFileSync(
        path.join(indexDir, "MEMORY.md"),
        "# Memory Index\n\n- [existing](./existing.md) — Existing entry\n",
      );

      const result = memoryUpdater.updateMemoryIndex(
        testDir,
        "existing",
        "Updated description",
      );

      expect(result.created).toBe(false);
      expect(result.modified).toBe(false);
      expect(result.reason).toBe("Entry already exists");
    });
  });

  // Write entry tests
  describe("writeMemoryEntry", () => {
    test("should write entry to disk with index", () => {
      const entry = {
        frontmatter: {
          name: "disk-test",
          description: "Test disk write",
          metadata: {
            type: "handoff",
          },
        },
        families: {
          user_defaults: ["Test"],
        },
      };

      const result = memoryUpdater.writeMemoryEntry(testDir, entry);

      expect(result.written).toBe(true);
      expect(result.indexUpdated).toBe(true);

      const filepath = path.join(testDir, ".remember", "disk-test.md");
      expect(fs.existsSync(filepath)).toBe(true);

      const content = fs.readFileSync(filepath, "utf8");
      expect(content).toContain("disk-test");
      expect(content).toContain("## User Defaults");
    });

    test("should not overwrite existing entry by default", () => {
      const entry = {
        frontmatter: {
          name: "no-overwrite",
          description: "Original",
          metadata: { type: "handoff" },
        },
        families: { user_defaults: ["Original"] },
      };

      memoryUpdater.writeMemoryEntry(testDir, entry);
      const result = memoryUpdater.writeMemoryEntry(testDir, entry);

      expect(result.written).toBe(false);
      expect(result.error).toContain("already exists");
    });

    test("should overwrite entry when requested", () => {
      const entry1 = {
        frontmatter: {
          name: "overwrite-test",
          description: "Original",
          metadata: { type: "handoff" },
        },
        families: { user_defaults: ["Original"] },
      };

      const entry2 = {
        frontmatter: {
          name: "overwrite-test",
          description: "Updated",
          metadata: { type: "handoff" },
        },
        families: { user_defaults: ["Updated"] },
      };

      memoryUpdater.writeMemoryEntry(testDir, entry1);
      const result = memoryUpdater.writeMemoryEntry(testDir, entry2, true);

      expect(result.written).toBe(true);

      const filepath = path.join(testDir, ".remember", "overwrite-test.md");
      const content = fs.readFileSync(filepath, "utf8");
      expect(content).toContain("Updated");
    });
  });

  // Read entry tests
  describe("readMemoryEntry", () => {
    test("should read and parse existing entry", () => {
      const entry = {
        frontmatter: {
          name: "read-test",
          description: "Read test",
          metadata: {
            type: "handoff",
            session_id: "read-123",
          },
        },
        families: { user_defaults: ["Test item"] },
      };

      memoryUpdater.writeMemoryEntry(testDir, entry);
      const result = memoryUpdater.readMemoryEntry(testDir, "read-test");

      expect(result.found).toBe(true);
      expect(result.frontmatter.name).toBe("read-test");
      expect(result.body).toContain("User Defaults");
    });

    test("should return not found for missing entry", () => {
      const result = memoryUpdater.readMemoryEntry(testDir, "nonexistent");

      expect(result.found).toBe(false);
      expect(result.error).toContain("not found");
    });
  });

  // Frontmatter parsing tests
  describe("parseFrontmatter", () => {
    test("should parse simple key-value pairs", () => {
      const frontmatter = `name: test-entry
description: "Test description"
type: handoff`;

      const parsed = memoryUpdater.parseFrontmatter(frontmatter);

      expect(parsed.name).toBe("test-entry");
      expect(parsed.description).toBe("Test description");
      expect(parsed.type).toBe("handoff");
    });

    test("should parse array values", () => {
      const frontmatter = `name: test
issues: ["#1", "#2", "#3"]`;

      const parsed = memoryUpdater.parseFrontmatter(frontmatter);

      expect(Array.isArray(parsed.issues)).toBe(true);
      expect(parsed.issues).toEqual(["#1", "#2", "#3"]);
    });

    test("should skip comments and empty lines", () => {
      const frontmatter = `# This is a comment
name: test

description: "Test"`;

      const parsed = memoryUpdater.parseFrontmatter(frontmatter);

      expect(parsed.name).toBe("test");
      expect(parsed.description).toBe("Test");
      expect(Object.keys(parsed)).not.toContain("comment");
    });
  });

  // Integration test
  describe("updateMemoryForSessionClosure", () => {
    test("should create and save complete memory entry", () => {
      const coreAnalysisData = {
        branch: "feat/integration-test",
        repoType: "control-plane",
        issueNumbers: ["#1890"],
        commits: [
          {
            hash: "abc123",
            message: "feat: Add memory integration (#1890)",
            author: "Test",
            date: "2026-08-12T12:00:00Z",
          },
        ],
      };

      const options = {
        sessionId: "integration-123",
        projectNames: ["Chat Closure Agent"],
        decisions: {
          "memory-structure": {
            choice: "10-family YAML",
            rationale: "Standard structure",
          },
        },
        blockers: [],
        nextSteps: ["Write tests", "Phase 3"],
      };

      const result = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        options,
      );

      expect(result.written).toBe(true);
      expect(result.markdown).toContain("integration-123");
      expect(result.entry).toBeDefined();
      expect(result.entry.families.decision_log[0]).toContain(
        "memory-structure",
      );
    });

    test("should handle minimal closure data", () => {
      const coreAnalysisData = {
        branch: "fix/minimal",
        repoType: "wordpress-plugin",
        issueNumbers: [],
        commits: [],
      };

      const result = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        {},
      );

      expect(result.written).toBe(true);
      expect(result.markdown).toBeDefined();
      expect(result.entry.families.decision_log[0]).toContain(
        "No major decisions",
      );
    });
  });
});
