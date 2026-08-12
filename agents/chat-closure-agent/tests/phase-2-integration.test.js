/**
 * Phase 2 Integration Tests
 * Verifies memory-updater and continuation-prompt-builder work together
 */

const memoryUpdater = require("../shared/memory-updater");
const promptBuilder = require("../shared/continuation-prompt-builder");
const fs = require("fs");
const path = require("path");

describe("Phase 2 Integration", () => {
  const testDir = path.join(__dirname, "fixtures", "phase-2-integration");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    const memoryDir = path.join(testDir, ".remember");
    if (fs.existsSync(memoryDir)) {
      fs.rmSync(memoryDir, { recursive: true });
    }
  });

  describe("Memory Update + Continuation Prompt Flow", () => {
    test("should create memory entry and generate continuation prompt", () => {
      const coreAnalysisData = {
        branch: "feat/integration-test",
        parsedBranch: {
          type: "feat",
          scope: "integration",
          title: "test",
        },
        repoType: "control-plane",
        issueNumbers: ["#1890", "#1891"],
        commits: [
          {
            hash: "abc123",
            message: "feat: Add core features",
            author: "Test",
            date: "2026-08-12T12:00:00Z",
          },
          {
            hash: "def456",
            message: "test: Add tests",
            author: "Test",
            date: "2026-08-12T11:00:00Z",
          },
        ],
        gitState: {
          isClean: true,
          staged: [],
          uncommitted: [],
          hasChanges: false,
        },
      };

      const memoryOptions = {
        sessionId: "integration-test-1",
        projectNames: ["Chat Closure Agent"],
        decisions: {
          "memory-structure": {
            choice: "10-family YAML",
            rationale: "Standard structure",
          },
          "prompt-format": {
            choice: "Markdown",
            rationale: "Readable and portable",
          },
        },
        blockers: [],
        nextSteps: [
          "Write integration tests",
          "Implement Phase 3",
          "Create comprehensive documentation",
        ],
      };

      // Step 1: Create and save memory entry
      const memoryResult = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        memoryOptions,
      );

      expect(memoryResult.written).toBe(true);
      expect(memoryResult.entry).toBeDefined();
      expect(memoryResult.markdown).toContain("integration-test-1");

      // Step 2: Build continuation prompt using core data and memory
      const promptOptions = {
        sessionId: "integration-test-1",
        projects: [
          {
            name: "Chat Closure Agent",
            link: "../../issues/1888",
            description: "Session handoff automation",
          },
        ],
        issues: [
          {
            number: "#1890",
            type: "task",
            status: "open",
          },
          {
            number: "#1891",
            type: "feature",
            status: "open",
          },
        ],
        prs: [],
        memory: memoryOptions,
      };

      const prompt = promptBuilder.buildContinuationPrompt(
        coreAnalysisData,
        promptOptions,
      );

      expect(prompt.markdown).toContain("integration-test-1");
      expect(prompt.markdown).toContain("feat/integration-test");
      expect(prompt.markdown).toContain("Chat Closure Agent");
      expect(prompt.markdown).toContain("#1890");
      expect(prompt.markdown).toContain("#1891");
      expect(prompt.markdown).toContain("Write integration tests");
      expect(prompt.markdown).toContain("2 key decisions documented");

      // Validate the prompt
      const validation = promptBuilder.validatePrompt(prompt);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);

      // Verify memory was written to disk
      const memoryEntry = memoryUpdater.readMemoryEntry(
        testDir,
        "chat-closure-integration-test-1",
      );
      expect(memoryEntry.found).toBe(true);
      expect(memoryEntry.frontmatter.name).toBe(
        "chat-closure-integration-test-1",
      );
    });

    test("should handle memory with blockers in continuation prompt", () => {
      const coreAnalysisData = {
        branch: "fix/blocker-test",
        parsedBranch: {
          type: "fix",
          scope: "blocker",
          title: "test",
        },
        repoType: "wordpress-plugin",
        issueNumbers: ["#2000"],
        commits: [
          {
            hash: "xyz789",
            message: "fix: Resolve blocking issue",
            author: "Dev",
            date: "2026-08-12T14:00:00Z",
          },
        ],
        gitState: {
          isClean: false,
          staged: ["lib/core.js"],
          uncommitted: [],
          hasChanges: true,
        },
      };

      const memoryOptions = {
        sessionId: "blocker-session",
        decisions: {
          "async-handling": {
            choice: "Promise-based",
            rationale: "Prevents blocking calls",
          },
        },
        blockers: ["API rate limiting", "Incomplete documentation"],
        nextSteps: ["Fix rate limit handling", "Update docs"],
      };

      // Create memory with blockers
      const memoryResult = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        memoryOptions,
      );

      expect(memoryResult.written).toBe(true);

      // Build prompt including blocker information
      const prompt = promptBuilder.buildContinuationPrompt(coreAnalysisData, {
        memory: memoryOptions,
      });

      // Verify blockers appear in continuation prompt
      expect(prompt.markdown).toContain("⚠️ 2 blocker(s)");
      expect(prompt.markdown).toContain("API rate limiting");
      expect(prompt.markdown).toContain("Incomplete documentation");
      expect(prompt.markdown).toContain("Fix rate limit handling");
      expect(prompt.markdown).toContain("Update docs");

      // Verify branch status is dirty in prompt
      expect(prompt.markdown).toContain("dirty");
      expect(prompt.markdown).toContain("Staged");
    });

    test("should preserve decision log through memory and prompt cycle", () => {
      const coreAnalysisData = {
        branch: "feat/decision-tracking",
        parsedBranch: {
          type: "feat",
          scope: "decision",
          title: "tracking",
        },
        repoType: "control-plane",
        issueNumbers: ["#2100"],
        commits: [
          {
            hash: "dec123",
            message: "feat: Track decisions",
            author: "Arch",
            date: "2026-08-12T15:00:00Z",
          },
        ],
        gitState: {
          isClean: true,
          staged: [],
          uncommitted: [],
          hasChanges: false,
        },
      };

      const decisions = {
        "architecture-pattern": {
          choice: "Event-driven",
          rationale: "Loosely coupled components",
        },
        "error-handling": {
          choice: "Custom exception types",
          rationale: "Better error context",
        },
        "testing-approach": {
          choice: "Jest with mocks",
          rationale: "Fast unit tests",
        },
      };

      const memoryOptions = {
        sessionId: "decision-123",
        decisions,
        blockers: [],
        nextSteps: ["Implement event bus", "Write E2E tests"],
      };

      // Create memory with multiple decisions
      const memoryResult = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        memoryOptions,
      );

      expect(memoryResult.entry.families.decision_log).toHaveLength(3);
      memoryResult.entry.families.decision_log.forEach((decision) => {
        expect(decision).toContain("✅ **");
        expect(decision).toContain("**: ");
      });

      // Build prompt and verify all decisions are represented
      const prompt = promptBuilder.buildContinuationPrompt(coreAnalysisData, {
        memory: memoryOptions,
      });

      expect(prompt.markdown).toContain("✅ 3 key decisions documented");
      expect(prompt.sections.memoryUpdates[0]).toContain("3 key decisions");

      // Read memory back from disk
      const savedMemory = memoryUpdater.readMemoryEntry(
        testDir,
        "chat-closure-decision-123",
      );
      expect(savedMemory.found).toBe(true);
      expect(savedMemory.body).toContain("architecture-pattern");
      expect(savedMemory.body).toContain("error-handling");
      expect(savedMemory.body).toContain("testing-approach");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle empty decisions in memory", () => {
      const coreAnalysisData = {
        branch: "fix/empty-decisions",
        parsedBranch: {
          type: "fix",
          scope: "empty",
          title: "test",
        },
        repoType: "control-plane",
        issueNumbers: [],
        commits: [],
        gitState: {
          isClean: true,
          staged: [],
          uncommitted: [],
          hasChanges: false,
        },
      };

      const memoryOptions = {
        sessionId: "empty-decisions",
        decisions: {},
        blockers: [],
        nextSteps: [],
      };

      // Create memory with empty decisions
      const memoryResult = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        memoryOptions,
      );

      expect(memoryResult.written).toBe(true);
      expect(memoryResult.entry.families.decision_log[0]).toContain(
        "No major decisions",
      );

      // Build prompt
      const prompt = promptBuilder.buildContinuationPrompt(coreAnalysisData, {
        memory: memoryOptions,
      });

      expect(prompt.markdown).toContain("No major updates recorded");
    });

    test("should handle memory without next steps in prompt", () => {
      const coreAnalysisData = {
        branch: "chore/cleanup",
        parsedBranch: {
          type: "chore",
          scope: "cleanup",
          title: "test",
        },
        repoType: "wordpress-plugin",
        issueNumbers: [],
        commits: [
          {
            hash: "cle123",
            message: "chore: Remove dead code",
            author: "Maint",
            date: "2026-08-12T16:00:00Z",
          },
        ],
        gitState: {
          isClean: true,
          staged: [],
          uncommitted: [],
          hasChanges: false,
        },
      };

      const memoryOptions = {
        sessionId: "cleanup-123",
        decisions: {},
        blockers: [],
        nextSteps: [],
      };

      const memoryResult = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        coreAnalysisData,
        memoryOptions,
      );

      const prompt = promptBuilder.buildContinuationPrompt(coreAnalysisData, {
        memory: memoryOptions,
      });

      // Should have default continuation tasks
      expect(prompt.markdown).toContain("Review related issues");
      expect(prompt.markdown).toContain("Continue implementation");
      expect(prompt.markdown).toContain("Update memory");
    });

    test("should format complete handoff with all sections", () => {
      const coreAnalysisData = {
        branch: "feat/complete-handoff",
        parsedBranch: {
          type: "feat",
          scope: "complete",
          title: "handoff",
        },
        repoType: "control-plane",
        issueNumbers: ["#3000", "#3001", "#3002"],
        commits: [
          {
            hash: "com1",
            message: "feat: Phase 1 foundation",
            author: "Lead",
            date: "2026-08-10T10:00:00Z",
          },
          {
            hash: "com2",
            message: "feat: Phase 2 implementation",
            author: "Lead",
            date: "2026-08-11T14:00:00Z",
          },
          {
            hash: "com3",
            message: "test: Complete test coverage",
            author: "Lead",
            date: "2026-08-12T16:00:00Z",
          },
        ],
        gitState: {
          isClean: true,
          staged: [],
          uncommitted: [],
          hasChanges: false,
        },
      };

      const memoryOptions = {
        sessionId: "complete-handoff",
        projectNames: [
          "Chat Closure Agent Phase 1",
          "Chat Closure Agent Phase 2",
        ],
        decisions: {
          architecture: {
            choice: "Modular design",
            rationale: "Maintainability",
          },
          testing: {
            choice: "Comprehensive Jest",
            rationale: "Code quality",
          },
        },
        blockers: [],
        nextSteps: [
          "Phase 3 implementation",
          "Integration tests",
          "Final documentation",
        ],
      };

      const prompt = promptBuilder.buildContinuationPrompt(coreAnalysisData, {
        sessionId: "complete-handoff",
        projects: [
          {
            name: "Chat Closure Agent Phase 1",
            link: "../../issues/1888",
            description: "Core infrastructure",
          },
          {
            name: "Chat Closure Agent Phase 2",
            link: "../../issues/1889",
            description: "Memory and prompts",
          },
        ],
        issues: [
          {
            number: "#3000",
            type: "epic",
            status: "🟢 Open",
          },
          {
            number: "#3001",
            type: "task",
            status: "🟢 Open",
          },
          {
            number: "#3002",
            type: "task",
            status: "🟢 Open",
          },
        ],
        prs: [
          {
            number: "#500",
            title: "feat: Phase 2 Unit Tests",
            status: "review",
          },
        ],
        memory: memoryOptions,
      });

      // Verify all sections present
      const markdown = prompt.markdown;
      expect(markdown).toContain("## Context Summary");
      expect(markdown).toContain("## Active Projects");
      expect(markdown).toContain("Chat Closure Agent Phase 1");
      expect(markdown).toContain("Chat Closure Agent Phase 2");
      expect(markdown).toContain("## Related Issues");
      expect(markdown).toContain("#3000");
      expect(markdown).toContain("#3001");
      expect(markdown).toContain("#3002");
      expect(markdown).toContain("## Related PRs");
      expect(markdown).toContain("#500");
      expect(markdown).toContain("feat: Phase 2 Unit Tests");
      expect(markdown).toContain("## Current Branch Status");
      expect(markdown).toContain("feat/complete-handoff");
      expect(markdown).toContain("3");
      expect(markdown).toContain("## Key Memory Updates");
      expect(markdown).toContain("✅ 2 key decisions");
      expect(markdown).toContain("⏳ 3 continuation tasks");
      expect(markdown).toContain("## Continuation Tasks");
      expect(markdown).toContain("Phase 3 implementation");
      expect(markdown).toContain("Integration tests");
      expect(markdown).toContain("Final documentation");
    });
  });
});
