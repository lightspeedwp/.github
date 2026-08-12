const coreAnalysis = require("../shared/core-analysis");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

// Mock child_process
jest.mock("child_process");

describe("Core Analysis Module", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Branch parsing tests
  describe("parseBranchName", () => {
    test("should parse valid feat branch", () => {
      const result = coreAnalysis.parseBranchName(
        "feat/chat-closure-agent-impl",
      );
      expect(result).toEqual({
        type: "feat",
        scope: "chat-closure-agent",
        title: "impl",
      });
    });

    test("should parse valid fix branch", () => {
      const result = coreAnalysis.parseBranchName(
        "fix/memory-updater-yaml-structure",
      );
      expect(result).toEqual({
        type: "fix",
        scope: "memory-updater-yaml",
        title: "structure",
      });
    });

    test("should parse valid docs branch", () => {
      const result = coreAnalysis.parseBranchName("docs/testing-guide-updates");
      expect(result).toEqual({
        type: "docs",
        scope: "testing-guide",
        title: "updates",
      });
    });

    test("should parse branch with single-word scope", () => {
      const result = coreAnalysis.parseBranchName("feat/agent-impl");
      expect(result).toEqual({
        type: "feat",
        scope: "agent",
        title: "impl",
      });
    });

    test("should throw on invalid format (no dash separator)", () => {
      expect(() => {
        coreAnalysis.parseBranchName("feat/nodash");
      }).toThrow(/Invalid branch name format/);
    });

    test("should throw on invalid format (underscore separator)", () => {
      expect(() => {
        coreAnalysis.parseBranchName("feat_chat_closure_agent");
      }).toThrow(/Invalid branch name format/);
    });

    test("should throw on main/develop branches", () => {
      expect(() => {
        coreAnalysis.parseBranchName("main");
      }).toThrow(/Invalid branch name format/);

      expect(() => {
        coreAnalysis.parseBranchName("develop");
      }).toThrow(/Invalid branch name format/);
    });
  });

  // Repository type detection tests
  describe("detectRepoType", () => {
    const tmpDir = path.join(__dirname, "fixtures", "mock-repos");

    beforeAll(() => {
      // Clean up if exists
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true });
      }

      // Create control-plane mock
      const controlPlane = path.join(tmpDir, "control-plane");
      fs.mkdirSync(path.join(controlPlane, ".github", "projects", "active"), {
        recursive: true,
      });
      fs.writeFileSync(path.join(controlPlane, ".github", "labels.yml"), "");

      // Create WordPress plugin mock
      const plugin = path.join(tmpDir, "wordpress-plugin");
      fs.mkdirSync(plugin, { recursive: true });
      fs.writeFileSync(path.join(plugin, "plugin.php"), "");
      fs.writeFileSync(path.join(plugin, "composer.json"), "{}");

      // Create WordPress theme mock
      const theme = path.join(tmpDir, "wordpress-theme");
      fs.mkdirSync(theme, { recursive: true });
      fs.writeFileSync(path.join(theme, "style.css"), "");
      fs.writeFileSync(path.join(theme, "theme.json"), "{}");
    });

    test("should detect control-plane repository", () => {
      const type = coreAnalysis.detectRepoType(
        path.join(tmpDir, "control-plane"),
      );
      expect(type).toBe("control-plane");
    });

    test("should detect wordpress-plugin repository", () => {
      const type = coreAnalysis.detectRepoType(
        path.join(tmpDir, "wordpress-plugin"),
      );
      expect(type).toBe("wordpress-plugin");
    });

    test("should detect wordpress-theme repository", () => {
      const type = coreAnalysis.detectRepoType(
        path.join(tmpDir, "wordpress-theme"),
      );
      expect(type).toBe("wordpress-theme");
    });

    test("should throw on unknown repository type", () => {
      const tmpUnknown = path.join(__dirname, "fixtures", "unknown-repo");
      if (!fs.existsSync(tmpUnknown)) {
        fs.mkdirSync(tmpUnknown, { recursive: true });
      }

      expect(() => {
        coreAnalysis.detectRepoType(tmpUnknown);
      }).toThrow(/Unknown repository type/);
    });
  });

  // Issue extraction tests
  describe("extractIssueNumbers", () => {
    test("should extract single issue from commit message", () => {
      const commits = [
        {
          hash: "abc123",
          message: "feat: Add feature (#1234)",
          author: "John Doe",
          date: "2026-08-12T10:00:00Z",
        },
      ];
      const issues = coreAnalysis.extractIssueNumbers(commits);
      expect(issues).toEqual(["#1234"]);
    });

    test("should extract multiple issues from commit messages", () => {
      const commits = [
        {
          hash: "abc123",
          message: "feat: Add feature (#1234, #1235)",
          author: "John Doe",
          date: "2026-08-12T10:00:00Z",
        },
        {
          hash: "def456",
          message: "fix: Fix bug (#1233)",
          author: "Jane Doe",
          date: "2026-08-12T09:00:00Z",
        },
      ];
      const issues = coreAnalysis.extractIssueNumbers(commits);
      expect(issues).toContain("#1234");
      expect(issues).toContain("#1235");
      expect(issues).toContain("#1233");
    });

    test("should return empty array when no issues found", () => {
      const commits = [
        {
          hash: "abc123",
          message: "chore: Update dependencies",
          author: "John Doe",
          date: "2026-08-12T10:00:00Z",
        },
      ];
      const issues = coreAnalysis.extractIssueNumbers(commits);
      expect(issues).toEqual([]);
    });

    test("should sort issues by number descending", () => {
      const commits = [
        {
          hash: "abc123",
          message: "feat: Add feature (#100, #200, #150)",
          author: "John Doe",
          date: "2026-08-12T10:00:00Z",
        },
      ];
      const issues = coreAnalysis.extractIssueNumbers(commits);
      expect(issues).toEqual(["#200", "#150", "#100"]);
    });

    test("should remove duplicates", () => {
      const commits = [
        {
          hash: "abc123",
          message: "feat: Add feature (#1234)",
          author: "John Doe",
          date: "2026-08-12T10:00:00Z",
        },
        {
          hash: "def456",
          message: "fix: Fix bug for #1234",
          author: "Jane Doe",
          date: "2026-08-12T09:00:00Z",
        },
      ];
      const issues = coreAnalysis.extractIssueNumbers(commits);
      expect(issues).toEqual(["#1234"]);
    });
  });

  // Memory state reading tests
  describe("readMemoryState", () => {
    const tmpDir = path.join(__dirname, "fixtures", "memory-test");

    beforeAll(() => {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    });

    test("should detect non-existent memory directory", () => {
      const tmpNonExistent = path.join(__dirname, "fixtures", "no-memory");
      const state = coreAnalysis.readMemoryState(tmpNonExistent);
      expect(state.exists).toBe(false);
      expect(state.indexExists).toBe(false);
      expect(state.files).toEqual([]);
    });

    test("should detect existing memory directory", () => {
      const memoryDir = path.join(tmpDir, ".remember");
      if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
        fs.writeFileSync(path.join(memoryDir, "MEMORY.md"), "");
      }

      const state = coreAnalysis.readMemoryState(tmpDir);
      expect(state.exists).toBe(true);
    });

    test("should list memory files", () => {
      const memoryDir = path.join(tmpDir, ".remember");
      fs.writeFileSync(path.join(memoryDir, "test-memory-1.md"), "");
      fs.writeFileSync(path.join(memoryDir, "test-memory-2.md"), "");

      const state = coreAnalysis.readMemoryState(tmpDir);
      expect(state.files.length).toBeGreaterThanOrEqual(2);
      expect(state.files).toContain("test-memory-1.md");
      expect(state.files).toContain("test-memory-2.md");
    });
  });

  // Git state analysis tests
  describe("analyzeGitState", () => {
    test("should detect clean repository", () => {
      execFileSync.mockReturnValue("");

      const state = coreAnalysis.analyzeGitState(".");
      expect(state.isClean).toBe(true);
      expect(state.staged).toEqual([]);
      expect(state.uncommitted).toEqual([]);
      expect(state.hasChanges).toBe(false);
    });

    test("should detect staged changes", () => {
      execFileSync.mockReturnValue("M  file1.js\nA  file2.js\n");

      const state = coreAnalysis.analyzeGitState(".");
      expect(state.isClean).toBe(false);
      expect(state.staged).toContain("file1.js");
      expect(state.staged).toContain("file2.js");
      expect(state.hasChanges).toBe(true);
    });

    test("should detect uncommitted changes", () => {
      execFileSync.mockReturnValue(" M file1.js\n M file2.js\n");

      const state = coreAnalysis.analyzeGitState(".");
      expect(state.isClean).toBe(false);
      expect(state.uncommitted).toContain("file1.js");
      expect(state.uncommitted).toContain("file2.js");
    });

    test("should throw on git error", () => {
      execFileSync.mockImplementation(() => {
        throw new Error("fatal: not a git repository");
      });

      expect(() => {
        coreAnalysis.analyzeGitState(".");
      }).toThrow(/Failed to analyze git state/);
    });
  });

  // Current branch test
  describe("getCurrentBranch", () => {
    test("should get current branch name", () => {
      execFileSync.mockReturnValue("feat/chat-closure-agent-impl\n");

      const branch = coreAnalysis.getCurrentBranch(".");
      expect(branch).toBe("feat/chat-closure-agent-impl");
    });

    test("should trim whitespace", () => {
      execFileSync.mockReturnValue("  develop  \n");

      const branch = coreAnalysis.getCurrentBranch(".");
      expect(branch).toBe("develop");
    });

    test("should throw on git error", () => {
      execFileSync.mockImplementation(() => {
        throw new Error("fatal: not a git repository");
      });

      expect(() => {
        coreAnalysis.getCurrentBranch(".");
      }).toThrow(/Failed to get current branch/);
    });
  });

  // Commits test
  describe("getRecentCommits", () => {
    test("should return recent commits with correct count", () => {
      const mockOutput =
        "abc123\nfeat: Add feature\nJohn Doe\n2026-08-12T10:00:00Z\n---\ndef456\nfix: Fix bug\nJane Doe\n2026-08-12T09:00:00Z\n---\n";
      execFileSync.mockReturnValue(mockOutput);

      const commits = coreAnalysis.getRecentCommits(".", 2);
      expect(commits.length).toBe(2);
      expect(commits[0].hash).toBe("abc123");
      expect(commits[0].message).toBe("feat: Add feature");
      expect(commits[1].hash).toBe("def456");
    });

    test("should use default count of 20", () => {
      execFileSync.mockReturnValue("");
      coreAnalysis.getRecentCommits(".");
      expect(execFileSync).toHaveBeenCalledWith(
        "git",
        expect.arrayContaining(["-n", "20"]),
        expect.any(Object),
      );
    });

    test("should throw on git error", () => {
      execFileSync.mockImplementation(() => {
        throw new Error("fatal: not a git repository");
      });

      expect(() => {
        coreAnalysis.getRecentCommits(".");
      }).toThrow(/Failed to get commits/);
    });
  });

  // Integration test
  describe("analyzeRepository", () => {
    test("should orchestrate all analysis functions", () => {
      execFileSync.mockImplementation((cmd, args) => {
        if (args.includes("branch")) {
          return "feat/chat-closure-agent-impl\n";
        }
        if (args.includes("log")) {
          return "abc123\nfeat: Add feature (#1234)\nJohn Doe\n2026-08-12T10:00:00Z\n---\n";
        }
        if (args.includes("status")) {
          return "";
        }
        return "";
      });

      // Mock fs functions
      const originalExistsSync = fs.existsSync;
      fs.existsSync = jest.fn((path) => {
        if (path.includes("projects/active")) return true;
        if (path.includes("labels.yml")) return true;
        if (path.includes(".remember")) return false;
        return originalExistsSync(path);
      });

      const result = coreAnalysis.analyzeRepository(".");

      expect(result.branch).toBe("feat/chat-closure-agent-impl");
      expect(result.parsedBranch.type).toBe("feat");
      expect(result.repoType).toBe("control-plane");
      expect(result.issueNumbers).toContain("#1234");
      expect(result.gitState.isClean).toBe(true);
      expect(result.timestamp).toBeDefined();

      fs.existsSync = originalExistsSync;
    });
  });
});
