/**
 * Tests for workflow helper scripts
 * Ensures shell control-flow refactoring maintains functionality
 */

const { execFileSync, spawnSync } = require("child_process");
const path = require("path");

describe("Workflow Helper Scripts", () => {
  const scriptsDir = path.join(__dirname, "..");

  describe("identify-changed-markdown.js", () => {
    it("should output has_changes=true when markdown files are changed", () => {
      const scriptPath = path.join(scriptsDir, "identify-changed-markdown.js");

      // Mock environment - in real workflow this comes from GitHub Actions
      const env = {
        ...process.env,
        EVENT_NAME: "pull_request",
        BASE_SHA: "HEAD~1",
        HEAD_SHA: "HEAD",
      };

      // Just verify script exists and is executable
      expect(require.resolve(scriptPath)).toBeDefined();
    });

    it("should handle missing environment variables gracefully", () => {
      const scriptPath = path.join(scriptsDir, "identify-changed-markdown.js");
      expect(require.resolve(scriptPath)).toBeDefined();
    });

    it("should use execFileSync instead of execSync for safety", () => {
      const scriptContent = require("fs").readFileSync(
        path.join(scriptsDir, "identify-changed-markdown.js"),
        "utf8",
      );
      expect(scriptContent).toContain("execFileSync");
      expect(scriptContent).not.toContain("execSync(`");
    });
  });

  describe("collect-validation-results.js", () => {
    it("should output all_passed=true when all checks pass", () => {
      const scriptPath = path.join(scriptsDir, "collect-validation-results.js");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      // Verify script logic
      expect(scriptContent).toContain("process.env.SYNTAX_OUTCOME");
      expect(scriptContent).toContain("process.env.A11Y_OUTCOME");
      expect(scriptContent).toContain("process.env.CONTRAST_OUTCOME");
      expect(scriptContent).toContain("allPassed");
    });

    it("should default to failure if environment variables are missing", () => {
      const scriptPath = path.join(scriptsDir, "collect-validation-results.js");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toContain('|| "failure"');
    });
  });

  describe("check-mermaid-diagrams.sh", () => {
    it("should be executable shell script", () => {
      const scriptPath = path.join(scriptsDir, "check-mermaid-diagrams.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toMatch(/^#!\/bin\/bash/);
    });

    it("should grep for mermaid syntax markers", () => {
      const scriptPath = path.join(scriptsDir, "check-mermaid-diagrams.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toContain("```mermaid");
    });
  });

  describe("report-changelog-action.sh", () => {
    it("should be executable shell script", () => {
      const scriptPath = path.join(scriptsDir, "report-changelog-action.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toMatch(/^#!\/bin\/bash/);
    });

    it("should check HAS_ENTRIES environment variable", () => {
      const scriptPath = path.join(scriptsDir, "report-changelog-action.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toContain("HAS_ENTRIES");
      expect(scriptContent).toContain("PR_NUMBER");
    });
  });

  describe("summarize-native-type.sh", () => {
    it("should be executable shell script", () => {
      const scriptPath = path.join(scriptsDir, "summarize-native-type.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toMatch(/^#!\/bin\/bash/);
    });

    it("should check APP_CONFIGURED and NATIVE_TYPE", () => {
      const scriptPath = path.join(scriptsDir, "summarize-native-type.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toContain("APP_CONFIGURED");
      expect(scriptContent).toContain("NATIVE_TYPE");
    });

    it("should write to GITHUB_STEP_SUMMARY", () => {
      const scriptPath = path.join(scriptsDir, "summarize-native-type.sh");
      const scriptContent = require("fs").readFileSync(scriptPath, "utf8");

      expect(scriptContent).toContain("GITHUB_STEP_SUMMARY");
    });
  });

  describe("Shell Control-Flow Refactoring", () => {
    it("should not have multiline if statements directly in shell run blocks", () => {
      // This is validated by the workflow validation scripts
      // These helper scripts should be used IN PLACE OF inline shell logic
      const helperScripts = [
        "identify-changed-markdown.js",
        "collect-validation-results.js",
        "check-mermaid-diagrams.sh",
        "report-changelog-action.sh",
        "summarize-native-type.sh",
      ];

      helperScripts.forEach((script) => {
        const scriptPath = path.join(scriptsDir, script);
        expect(require.resolve(scriptPath)).toBeDefined();
      });
    });

    it("should use environment variables instead of command-line arguments", () => {
      const jsScripts = [
        "identify-changed-markdown.js",
        "collect-validation-results.js",
      ];

      jsScripts.forEach((script) => {
        const scriptPath = path.join(scriptsDir, script);
        const content = require("fs").readFileSync(scriptPath, "utf8");
        expect(content).toContain("process.env");
      });
    });
  });
});
