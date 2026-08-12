/**
 * Phase 3 E2E Integration Tests
 * Full session closure workflow testing across all modules.
 */

const coreAnalysis = require("../shared/core-analysis");
const memoryUpdater = require("../shared/memory-updater");
const promptBuilder = require("../shared/continuation-prompt-builder");
const workspaceCleaner = require("../shared/workspace-cleaner");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

describe("Chat Closure Agent — E2E Integration", () => {
  const testDir = path.join(__dirname, "fixtures", "integration-e2e");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    const gitDirs = [
      path.join(testDir, "control-plane-repo"),
      path.join(testDir, "plugin-repo"),
      path.join(testDir, "theme-repo"),
    ];

    gitDirs.forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
      }
    });

    // Cleanup memory test directory
    const memoryDir = path.join(testDir, ".remember");
    if (fs.existsSync(memoryDir)) {
      fs.rmSync(memoryDir, { recursive: true });
    }
  });

  describe("Full Workflow: Control-Plane Repository", () => {
    test("should execute complete session closure for control-plane repo", () => {
      const repoPath = path.join(testDir, "control-plane-repo");
      fs.mkdirSync(repoPath, { recursive: true });

      // Initialize git repo
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });

      // Create .github/projects/active directory (control-plane marker)
      fs.mkdirSync(path.join(repoPath, ".github", "projects", "active"), {
        recursive: true,
      });

      // Create .github/labels.yml (required for control-plane detection)
      fs.writeFileSync(
        path.join(repoPath, ".github", "labels.yml"),
        "# GitHub labels\n",
      );

      // Initial commit
      fs.writeFileSync(
        path.join(repoPath, ".github", "CODEOWNERS"),
        "* @user1 @user2",
      );
      execFileSync("git", ["add", ".github"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "init: Initial commit"], {
        cwd: repoPath,
      });

      // Create feature branch
      execFileSync("git", ["checkout", "-b", "feat/integration-e2e"], {
        cwd: repoPath,
      });

      // Make changes
      fs.writeFileSync(path.join(repoPath, "feature.txt"), "feature work");
      execFileSync("git", ["add", "feature.txt"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "feat: Add integration test"], {
        cwd: repoPath,
      });

      // Step 1: Analyze repository
      const analysis = coreAnalysis.analyzeRepository(repoPath);

      expect(analysis.branch).toBe("feat/integration-e2e");
      expect(analysis.repoType).toBe("control-plane");
      expect(analysis.commits.length).toBeGreaterThan(0);
      expect(analysis.gitState.isClean).toBe(true);

      // Step 2: Create memory entry
      const memory = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        analysis,
        {
          sessionId: "e2e-control-plane",
          decisions: {
            "repo-type": {
              choice: "Control-Plane",
              rationale: ".github directory found",
            },
          },
          blockers: [],
          nextSteps: ["Phase 4 documentation", "Final testing"],
        },
      );

      expect(memory.written).toBe(true);
      expect(memory.entry.families.decision_log[0]).toContain("repo-type");

      // Step 3: Build continuation prompt
      const prompt = promptBuilder.buildContinuationPrompt(analysis, {
        sessionId: "e2e-control-plane",
        memory: memory.entry.families,
      });

      expect(prompt.markdown).toContain("e2e-control-plane");
      expect(prompt.markdown).toContain("feat/integration-e2e");
      expect(promptBuilder.validatePrompt(prompt).valid).toBe(true);

      // Step 4: Validate workspace state
      const cleanup = workspaceCleaner.cleanupWorktree(repoPath, repoPath, {
        autoStash: false,
        deleteAfterCleanup: false,
      });

      expect(cleanup.success).toBe(true);
    });
  });

  describe("Full Workflow: WordPress Plugin Repository", () => {
    test("should execute complete session closure for WordPress plugin repo", () => {
      const repoPath = path.join(testDir, "plugin-repo");
      fs.mkdirSync(repoPath, { recursive: true });

      // Initialize git repo
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });

      // Create plugin.php (WordPress plugin marker)
      const pluginPhp = `<?php
/**
 * Plugin Name: Test Plugin
 * Description: A test plugin for integration testing
 * Version: 1.0.0
 * Author: Test Author
 */
`;
      fs.writeFileSync(path.join(repoPath, "plugin.php"), pluginPhp);

      // Create composer.json (required for plugin detection)
      fs.writeFileSync(
        path.join(repoPath, "composer.json"),
        JSON.stringify({
          name: "test/plugin",
          description: "Test plugin",
          type: "wordpress-plugin",
        }),
      );

      execFileSync("git", ["add", "."], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "init: Create test plugin"], {
        cwd: repoPath,
      });

      // Create feature branch
      execFileSync("git", ["checkout", "-b", "feat/plugin-integration"], {
        cwd: repoPath,
      });

      // Add implementation
      fs.mkdirSync(path.join(repoPath, "includes"), { recursive: true });
      fs.writeFileSync(
        path.join(repoPath, "includes/plugin-core.php"),
        "<?php",
      );
      execFileSync("git", ["add", "includes/plugin-core.php"], {
        cwd: repoPath,
      });
      execFileSync("git", ["commit", "-m", "feat: Add core plugin logic"], {
        cwd: repoPath,
      });

      // Step 1: Analyze repository
      const analysis = coreAnalysis.analyzeRepository(repoPath);

      expect(analysis.branch).toBe("feat/plugin-integration");
      expect(analysis.repoType).toBe("wordpress-plugin");
      expect(analysis.commits.length).toBeGreaterThan(0);

      // Step 2: Create memory entry
      const memory = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        analysis,
        {
          sessionId: "e2e-plugin",
          decisions: {
            architecture: {
              choice: "Modular",
              rationale: "Separate concerns by feature",
            },
          },
          blockers: ["Documentation pending"],
          nextSteps: ["Complete unit tests", "Write documentation"],
        },
      );

      expect(memory.written).toBe(true);
      expect(
        memory.entry.families.execution_state.some((s) =>
          s.includes("Documentation pending"),
        ),
      ).toBe(true);

      // Step 3: Build continuation prompt
      const prompt = promptBuilder.buildContinuationPrompt(analysis, {
        sessionId: "e2e-plugin",
        memory: memory.entry.families,
      });

      expect(prompt.markdown).toContain("feat/plugin-integration");
      expect(promptBuilder.validatePrompt(prompt).valid).toBe(true);
    });
  });

  describe("Full Workflow: WordPress Theme Repository", () => {
    test("should execute complete session closure for WordPress theme repo", () => {
      const repoPath = path.join(testDir, "theme-repo");
      fs.mkdirSync(repoPath, { recursive: true });

      // Initialize git repo
      execFileSync("git", ["init"], { cwd: repoPath });
      execFileSync("git", ["config", "user.email", "test@test.com"], {
        cwd: repoPath,
      });
      execFileSync("git", ["config", "user.name", "Test User"], {
        cwd: repoPath,
      });

      // Create style.css (WordPress theme marker)
      const styleCss = `/*
Theme Name: Test Theme
Theme URI: https://example.com/test-theme
Description: A test theme for integration testing
Version: 1.0.0
Author: Test Author
*/
`;
      fs.writeFileSync(path.join(repoPath, "style.css"), styleCss);

      // Create theme.json (WordPress theme modern format)
      fs.writeFileSync(
        path.join(repoPath, "theme.json"),
        JSON.stringify(
          {
            $schema: "https://schemas.wp.org/wp/latest/theme.json",
            version: 2,
            settings: {},
            styles: {},
          },
          null,
          2,
        ),
      );

      execFileSync("git", ["add", "."], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "init: Create test theme"], {
        cwd: repoPath,
      });

      // Create feature branch
      execFileSync("git", ["checkout", "-b", "feat/theme-layout"], {
        cwd: repoPath,
      });

      // Add templates
      fs.mkdirSync(path.join(repoPath, "templates"), { recursive: true });
      fs.writeFileSync(path.join(repoPath, "templates/index.html"), "<html>");
      execFileSync("git", ["add", "templates/"], { cwd: repoPath });
      execFileSync("git", ["commit", "-m", "feat: Add template structure"], {
        cwd: repoPath,
      });

      // Step 1: Analyze repository
      const analysis = coreAnalysis.analyzeRepository(repoPath);

      expect(analysis.branch).toBe("feat/theme-layout");
      expect(analysis.repoType).toBe("wordpress-theme");
      expect(analysis.commits.length).toBeGreaterThan(0);

      // Step 2: Create memory entry
      const memory = memoryUpdater.updateMemoryForSessionClosure(
        testDir,
        analysis,
        {
          sessionId: "e2e-theme",
          decisions: {
            "design-system": {
              choice: "Tailwind CSS",
              rationale: "Utility-first approach",
            },
          },
          blockers: [],
          nextSteps: ["Add responsive styles", "Test on mobile"],
        },
      );

      expect(memory.written).toBe(true);

      // Step 3: Build continuation prompt
      const prompt = promptBuilder.buildContinuationPrompt(analysis, {
        sessionId: "e2e-theme",
        memory: memory.entry.families,
      });

      expect(prompt.markdown).toContain("feat/theme-layout");
      expect(promptBuilder.validatePrompt(prompt).valid).toBe(true);
    });
  });
});
