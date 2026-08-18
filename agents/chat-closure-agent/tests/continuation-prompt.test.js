const promptBuilder = require("../shared/continuation-prompt-builder");

describe("Continuation Prompt Builder Module", () => {
  const mockCoreAnalysisData = {
    branch: "feat/test-feature",
    parsedBranch: {
      type: "feat",
      scope: "test-feature",
      title: "implementation",
    },
    repoType: "control-plane",
    issueNumbers: ["#1234", "#1235"],
    commits: [
      {
        hash: "abc123",
        message: "feat: Implement core features",
        author: "Test User",
        date: "2026-08-12T10:00:00Z",
      },
      {
        hash: "def456",
        message: "test: Add unit tests",
        author: "Test User",
        date: "2026-08-12T09:00:00Z",
      },
    ],
    gitState: {
      isClean: true,
      staged: [],
      uncommitted: [],
      hasChanges: false,
    },
  };

  // Context summary tests
  describe("extractContextSummary", () => {
    test("should create summary from branch and commits", () => {
      const summary = promptBuilder.extractContextSummary(mockCoreAnalysisData);

      expect(summary).toContain("test-feature");
      expect(summary).toContain("control-plane");
      expect(summary).toContain("Implement core");
    });

    test("should handle empty commit history", () => {
      const data = {
        ...mockCoreAnalysisData,
        commits: [],
      };

      const summary = promptBuilder.extractContextSummary(data);

      expect(summary).toContain("Working on test-feature");
      expect(summary).toContain("control-plane");
    });

    test("should handle missing branch scope", () => {
      const data = {
        ...mockCoreAnalysisData,
        parsedBranch: {
          type: "feat",
          scope: "agent",
          title: "test",
        },
      };

      const summary = promptBuilder.extractContextSummary(data);

      expect(summary).toContain("agent");
    });

    test("should truncate long commit messages", () => {
      const data = {
        ...mockCoreAnalysisData,
        commits: [
          {
            hash: "abc123",
            message:
              "feat: This is a very long commit message that exceeds the truncation limit",
            author: "User",
            date: "2026-08-12T10:00:00Z",
          },
        ],
      };

      const summary = promptBuilder.extractContextSummary(data);

      expect(summary.length).toBeLessThan(200);
    });
  });

  // Projects list tests
  describe("formatProjectsList", () => {
    test("should format projects as markdown bullets", () => {
      const projects = [
        {
          name: "Test Project",
          link: "../../issues/1234",
          description: "Test project description",
        },
      ];

      const markdown = promptBuilder.formatProjectsList(projects);

      expect(markdown).toContain("[Test Project]");
      expect(markdown).toContain("../../issues/1234");
      expect(markdown).toContain("Test project description");
    });

    test("should handle empty projects list", () => {
      const markdown = promptBuilder.formatProjectsList([]);

      expect(markdown).toContain("No active projects");
    });

    test("should handle null projects", () => {
      const markdown = promptBuilder.formatProjectsList(null);

      expect(markdown).toContain("No active projects");
    });

    test("should format multiple projects", () => {
      const projects = [
        {
          name: "Project 1",
          link: "../../issues/1",
          description: "First project",
        },
        {
          name: "Project 2",
          link: "../../issues/2",
          description: "Second project",
        },
      ];

      const markdown = promptBuilder.formatProjectsList(projects);

      expect(markdown).toContain("Project 1");
      expect(markdown).toContain("Project 2");
      expect((markdown.match(/\n/g) || []).length).toBeGreaterThanOrEqual(1);
    });
  });

  // Issues table tests
  describe("formatIssuesTable", () => {
    test("should format issues as markdown table", () => {
      const issues = [
        {
          number: "#1234",
          type: "task",
          status: "open",
        },
        {
          number: "#1235",
          type: "bug",
          status: "in-progress",
        },
      ];

      const markdown = promptBuilder.formatIssuesTable(issues);

      expect(markdown).toContain("| Issue | Type | Status |");
      expect(markdown).toContain("#1234");
      expect(markdown).toContain("#1235");
      expect(markdown).toContain("task");
      expect(markdown).toContain("bug");
    });

    test("should handle empty issues list", () => {
      const markdown = promptBuilder.formatIssuesTable([]);

      expect(markdown).toContain("Issue | Type | Status");
      expect(markdown).toContain("None found");
    });

    test("should use default values for missing fields", () => {
      const issues = [
        {
          number: "#1234",
        },
      ];

      const markdown = promptBuilder.formatIssuesTable(issues);

      expect(markdown).toContain("task");
      expect(markdown).toContain("open");
    });
  });

  // PRs table tests
  describe("formatPRsTable", () => {
    test("should format PRs as markdown table", () => {
      const prs = [
        {
          number: "#500",
          title: "feat: New feature",
          status: "review",
        },
      ];

      const markdown = promptBuilder.formatPRsTable(prs);

      expect(markdown).toContain("| PR | Title | Status |");
      expect(markdown).toContain("#500");
      expect(markdown).toContain("feat: New feature");
      expect(markdown).toContain("review");
    });

    test("should handle no submitted PRs", () => {
      const markdown = promptBuilder.formatPRsTable([]);

      expect(markdown).toContain("None submitted yet");
    });

    test("should handle null PRs", () => {
      const markdown = promptBuilder.formatPRsTable(null);

      expect(markdown).toContain("None submitted yet");
    });
  });

  // Branch status tests
  describe("formatBranchStatus", () => {
    test("should format clean branch status", () => {
      const markdown = promptBuilder.formatBranchStatus(mockCoreAnalysisData);

      expect(markdown).toContain("feat/test-feature");
      expect(markdown).toContain("clean ✓");
      expect(markdown).toContain("2");
    });

    test("should report dirty working directory", () => {
      const data = {
        ...mockCoreAnalysisData,
        gitState: {
          isClean: false,
          staged: ["file1.js"],
          uncommitted: ["file2.js"],
          hasChanges: true,
        },
      };

      const markdown = promptBuilder.formatBranchStatus(data);

      expect(markdown).toContain("dirty");
      expect(markdown).toContain("Staged");
      expect(markdown).toContain("Uncommitted");
    });

    test("should show only staged changes if uncommitted is empty", () => {
      const data = {
        ...mockCoreAnalysisData,
        gitState: {
          isClean: false,
          staged: ["file1.js"],
          uncommitted: [],
          hasChanges: true,
        },
      };

      const markdown = promptBuilder.formatBranchStatus(data);

      expect(markdown).toContain("Staged");
      expect(markdown).not.toContain("Uncommitted");
    });
  });

  // Memory updates tests
  describe("summarizeMemoryUpdates", () => {
    test("should summarize decisions, blockers, and next steps", () => {
      const memory = {
        decisions: {
          "memory-structure": {},
          "repo-detection": {},
        },
        blockers: ["API limit"],
        nextSteps: ["Write tests", "Submit PR"],
      };

      const updates = promptBuilder.summarizeMemoryUpdates(memory);

      expect(updates).toContain("✅ 2 key decisions documented");
      expect(updates).toContain("⏳ 2 continuation tasks identified");
      expect(updates[2]).toContain("⚠️ 1 blocker(s)");
    });

    test("should handle missing memory", () => {
      const updates = promptBuilder.summarizeMemoryUpdates(null);

      expect(updates[0]).toContain("No memory updates recorded");
    });

    test("should handle empty memory", () => {
      const updates = promptBuilder.summarizeMemoryUpdates({});

      expect(updates[0]).toContain("No major updates recorded");
    });

    test("should handle partial memory", () => {
      const memory = {
        decisions: {
          choice1: {},
        },
      };

      const updates = promptBuilder.summarizeMemoryUpdates(memory);

      expect(updates[0]).toContain("1 key decision");
      expect(updates.join(" ")).not.toContain("blocker");
    });
  });

  // Full prompt building tests
  describe("buildContinuationPrompt", () => {
    test("should build complete prompt with all sections", () => {
      const options = {
        sessionId: "test-123",
        projects: [
          {
            name: "Test Project",
            link: "../../issues/1",
            description: "Test",
          },
        ],
        issues: [
          {
            number: "#1234",
            type: "task",
            status: "open",
          },
        ],
        prs: [
          {
            number: "#500",
            title: "feat: Test",
            status: "review",
          },
        ],
        memory: {
          nextSteps: ["Continue work"],
        },
      };

      const prompt = promptBuilder.buildContinuationPrompt(
        mockCoreAnalysisData,
        options,
      );

      expect(prompt.title).toContain("Continuation Prompt");
      expect(prompt.markdown).toContain("Context Summary");
      expect(prompt.markdown).toContain("Active Projects");
      expect(prompt.markdown).toContain("Related Issues");
      expect(prompt.markdown).toContain("Related PRs");
      expect(prompt.markdown).toContain("Branch Status");
      expect(prompt.markdown).toContain("Key Memory Updates");
      expect(prompt.markdown).toContain("Continuation Tasks");
      expect(prompt.markdown).toContain("Continue work");
    });

    test("should generate prompt with minimal options", () => {
      const prompt = promptBuilder.buildContinuationPrompt(
        mockCoreAnalysisData,
        {},
      );

      expect(prompt.markdown).toContain("Continuation Prompt");
      expect(prompt.markdown).toContain("test-feature");
      expect(prompt.markdown).toContain("No active projects");
      expect(prompt.markdown).not.toContain("NaN");
    });

    test("should include session ID in prompt", () => {
      const prompt = promptBuilder.buildContinuationPrompt(
        mockCoreAnalysisData,
        {
          sessionId: "session-xyz",
        },
      );

      expect(prompt.markdown).toContain("session-xyz");
    });

    test("should include timestamp in prompt", () => {
      const prompt = promptBuilder.buildContinuationPrompt(
        mockCoreAnalysisData,
        {},
      );

      expect(prompt.markdown).toMatch(/\d{4}-\d{2}-\d{2}T/);
    });

    test("should structure prompt sections object", () => {
      const options = {
        projects: [{ name: "Test", link: "#", description: "Test" }],
        issues: [{ number: "#1", type: "task", status: "open" }],
      };

      const prompt = promptBuilder.buildContinuationPrompt(
        mockCoreAnalysisData,
        options,
      );

      expect(prompt.sections.contextSummary).toBeDefined();
      expect(prompt.sections.projects).toEqual(options.projects);
      expect(prompt.sections.issues).toEqual(options.issues);
      expect(prompt.sections.branchStatus).toBe("feat/test-feature");
    });
  });

  // Validation tests
  describe("validatePrompt", () => {
    test("should validate complete prompt", () => {
      const prompt = {
        markdown: `# Continuation Prompt

## Context Summary
Working on implementing new features for the chat closure agent system. This includes memory updates, continuation prompts, and session handoff functionality.

## Branch Status
- Branch: feat/test
- Status: In progress
- Changes: Multiple files committed with test coverage

This prompt contains sufficient content for validation.`,
      };

      const result = promptBuilder.validatePrompt(prompt);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("should reject prompt without markdown", () => {
      const result = promptBuilder.validatePrompt({});

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Missing or invalid markdown content");
    });

    test("should reject too-short prompt", () => {
      const result = promptBuilder.validatePrompt({
        markdown: "Short",
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("too short");
    });

    test("should reject prompt missing required sections", () => {
      const result = promptBuilder.validatePrompt({
        markdown: `
        # Continuation Prompt
        Some content here that is long enough for the length check
        but missing the required sections for a valid prompt template
        `,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Missing required sections");
    });
  });

  // Display formatting tests
  describe("formatPromptForDisplay", () => {
    test("should return markdown as-is for markdown format", () => {
      const prompt = {
        markdown: "# Test\n\n**Bold text** here",
      };

      const result = promptBuilder.formatPromptForDisplay(prompt, "markdown");

      expect(result).toBe("# Test\n\n**Bold text** here");
    });

    test("should strip markdown syntax for text format", () => {
      const prompt = {
        markdown: "# Test\n\n[Link](http://example.com) and **bold**",
      };

      const result = promptBuilder.formatPromptForDisplay(prompt, "text");

      expect(result).not.toContain("#");
      expect(result).not.toContain("**");
      expect(result).not.toContain("[");
      expect(result).not.toContain("(http");
    });

    test("should default to markdown format", () => {
      const prompt = {
        markdown: "# Test",
      };

      const result = promptBuilder.formatPromptForDisplay(prompt);

      expect(result).toBe("# Test");
    });
  });
});
