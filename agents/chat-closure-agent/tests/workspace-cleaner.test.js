/**
 * Workspace Cleaner Tests
 * Unit tests for safe worktree cleanup with confirmation.
 */

const workspaceCleaner = require("../shared/workspace-cleaner");
const fs = require("fs");
const path = require("path");
const { execSync, execFileSync } = require("child_process");

describe("Workspace Cleaner Module", () => {
  const testDir = path.join(__dirname, "fixtures", "workspace-cleaner-test");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup test git repos
    const gitDir = path.join(testDir, "test-repo");
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true });
    }
  });

  describe("getWorktreeStatus", () => {
    test("should detect clean worktree", () => {
      const repoPath = path.join(testDir, "clean-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "README.md"), "# Test");
      execFileSync("git", ["add", "README.md"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "Initial"], { cwd: repoPath });

      const status = workspaceCleaner.getWorktreeStatus(repoPath);

      expect(status.isClean).toBe(true);
      expect(status.stagedFiles).toEqual([]);
      expect(status.uncommittedFiles).toEqual([]);
      expect(status.totalChanges).toBe(0);

      fs.rmSync(repoPath, { recursive: true });
    });

    test("should detect dirty worktree with uncommitted changes", () => {
      const repoPath = path.join(testDir, "dirty-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      fs.writeFileSync(path.join(repoPath, "file.txt"), "content");

      const status = workspaceCleaner.getWorktreeStatus(repoPath);

      expect(status.isClean).toBe(false);
      expect(status.totalChanges).toBeGreaterThan(0);

      fs.rmSync(repoPath, { recursive: true });
    });
  });

  describe("getCurrentBranch", () => {
    test("should get current branch name", () => {
      const repoPath = path.join(testDir, "branch-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "test.txt"), "test");
      execFileSync("git", ["add", "test.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "test"], { cwd: repoPath });

      const branch = workspaceCleaner.getCurrentBranch(repoPath);

      expect(branch).toBe("master");

      fs.rmSync(repoPath, { recursive: true });
    });

    test("should return null on git error", () => {
      // Test with nonexistent path
      const branch = workspaceCleaner.getCurrentBranch("/nonexistent/path");

      expect(branch).toBeNull();
    });
  });

  describe("validateCleanupSafety", () => {
    test("should validate clean worktree is safe", () => {
      const repoPath = path.join(testDir, "safe-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "init.txt"), "init");
      execFileSync("git", ["add", "init.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "init"], { cwd: repoPath });

      const validation = workspaceCleaner.validateCleanupSafety(repoPath);

      expect(validation.safe).toBe(true);
      expect(validation.warnings).toEqual([]);

      fs.rmSync(repoPath, { recursive: true });
    });

    test("should warn about dirty worktree", () => {
      const repoPath = path.join(testDir, "unsafe-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      fs.writeFileSync(path.join(repoPath, "dirty.txt"), "dirty");

      const validation = workspaceCleaner.validateCleanupSafety(repoPath);

      expect(validation.safe).toBe(false);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings[0].level).toBe("error");

      fs.rmSync(repoPath, { recursive: true });
    });
  });

  describe("stashChanges", () => {
    test("should stash uncommitted changes", () => {
      const repoPath = path.join(testDir, "stash-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "file.txt"), "initial");
      execFileSync("git", ["add", "file.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "initial"], { cwd: repoPath });

      // Make changes
      fs.writeFileSync(path.join(repoPath, "file.txt"), "modified");

      const result = workspaceCleaner.stashChanges(repoPath, "Test stash");

      expect(result.success).toBe(true);

      // Verify changes are stashed
      const status = workspaceCleaner.getWorktreeStatus(repoPath);
      expect(status.isClean).toBe(true);

      fs.rmSync(repoPath, { recursive: true });
    });
  });

  describe("commitChanges", () => {
    test("should commit pending changes", () => {
      const repoPath = path.join(testDir, "commit-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "file.txt"), "initial");
      execFileSync("git", ["add", "file.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "initial"], { cwd: repoPath });

      // Make changes
      fs.writeFileSync(path.join(repoPath, "file.txt"), "modified");

      const result = workspaceCleaner.commitChanges(
        repoPath,
        "Test commit message",
      );

      expect(result.success).toBe(true);

      // Verify changes are committed
      const status = workspaceCleaner.getWorktreeStatus(repoPath);
      expect(status.isClean).toBe(true);

      fs.rmSync(repoPath, { recursive: true });
    });
  });

  describe("cleanupWorktree", () => {
    test("should validate and skip cleanup if not confirmed", () => {
      const repoPath = path.join(testDir, "validate-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });

      const result = workspaceCleaner.cleanupWorktree(repoPath, repoPath, {
        confirmationCallback: () => false,
      });

      expect(result.success).toBe(false);
      expect(result.steps.some((s) => s.status === "cancelled")).toBe(true);

      fs.rmSync(repoPath, { recursive: true });
    });

    test("should auto-stash dirty changes when enabled", () => {
      const repoPath = path.join(testDir, "autostash-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "file.txt"), "initial");
      execFileSync("git", ["add", "file.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "initial"], { cwd: repoPath });

      // Make dirty changes
      fs.writeFileSync(path.join(repoPath, "file.txt"), "modified");

      const result = workspaceCleaner.cleanupWorktree(repoPath, repoPath, {
        autoStash: true,
      });

      expect(result.success).toBe(true);
      const stashStep = result.steps.find((s) => s.name === "stash_changes");
      expect(stashStep).toBeDefined();
      expect(stashStep.status).toBe("success");

      fs.rmSync(repoPath, { recursive: true });
    });

    test("should auto-commit dirty changes when enabled", () => {
      const repoPath = path.join(testDir, "autocommit-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });
      fs.writeFileSync(path.join(repoPath, "file.txt"), "initial");
      execFileSync("git", ["add", "file.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "initial"], { cwd: repoPath });

      // Make dirty changes
      fs.writeFileSync(path.join(repoPath, "file.txt"), "modified");

      const result = workspaceCleaner.cleanupWorktree(repoPath, repoPath, {
        autoCommit: true,
      });

      expect(result.success).toBe(true);
      const commitStep = result.steps.find((s) => s.name === "commit_changes");
      expect(commitStep).toBeDefined();
      expect(commitStep.status).toBe("success");

      fs.rmSync(repoPath, { recursive: true });
    });
  });

  describe("generateCleanupReport", () => {
    test("should generate success report", () => {
      const cleanupResult = {
        success: true,
        steps: [
          { name: "validate_safety", status: "success", message: "Valid" },
          {
            name: "user_confirmation",
            status: "confirmed",
            message: "Confirmed",
          },
        ],
        errors: [],
        startTime: "2026-08-12T18:00:00Z",
        endTime: "2026-08-12T18:00:10Z",
      };

      const report = workspaceCleaner.generateCleanupReport(cleanupResult);

      expect(report).toContain("✅ Success");
      expect(report).toContain("validate_safety");
      expect(report).toContain("user_confirmation");
    });

    test("should generate failure report with errors", () => {
      const cleanupResult = {
        success: false,
        steps: [
          { name: "validate_safety", status: "error", message: "Unsafe" },
        ],
        errors: ["Worktree is dirty"],
        startTime: "2026-08-12T18:00:00Z",
        endTime: "2026-08-12T18:00:05Z",
      };

      const report = workspaceCleaner.generateCleanupReport(cleanupResult);

      expect(report).toContain("❌ Failed");
      expect(report).toContain("Worktree is dirty");
    });
  });

  describe("getCommitsAhead", () => {
    test("should count commits ahead of base branch", () => {
      const repoPath = path.join(testDir, "commits-repo");
      fs.mkdirSync(repoPath, { recursive: true });
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });

      // Create initial commit on master
      fs.writeFileSync(path.join(repoPath, "file.txt"), "initial");
      execFileSync("git", ["add", "file.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "Initial"], { cwd: repoPath });

      // Create develop branch
      execFileSync("git", ["checkout", "-b", "develop"], { cwd: repoPath });

      // Create feature branch with commits
      execFileSync("git", ["checkout", "-b", "feat/test"], { cwd: repoPath });
      fs.writeFileSync(path.join(repoPath, "feature.txt"), "feature 1");
      execFileSync("git", ["add", "feature.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "Feature 1"], { cwd: repoPath });

      fs.writeFileSync(path.join(repoPath, "feature2.txt"), "feature 2");
      execFileSync("git", ["add", "feature2.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "Feature 2"], { cwd: repoPath });

      const commitsAhead = workspaceCleaner.getCommitsAhead(
        repoPath,
        "develop",
      );

      expect(commitsAhead).toBeGreaterThan(0);

      fs.rmSync(repoPath, { recursive: true });
    });
  });
});
