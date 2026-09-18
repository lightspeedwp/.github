/**
 * Integration Tests for Release Agent
 * Tests complete release workflows across different repository types
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const repoDetector = require("../includes/repoDetector.cjs");
const versionManager = require("../includes/versionManager.cjs");

describe("Release Agent Integration Tests", () => {
  let testDir;

  beforeEach(() => {
    testDir = path.join(__dirname, `test-repo-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      execFileSync("rm", ["-rf", testDir]);
    }
  });

  describe("Control Plane Release Workflow", () => {
    test("should detect control-plane repository", () => {
      fs.mkdirSync(path.join(testDir, ".github"), { recursive: true });
      fs.writeFileSync(path.join(testDir, "VERSION"), "1.0.0\n");
      fs.writeFileSync(path.join(testDir, "package.json"), JSON.stringify({ version: "1.0.0" }, null, 2));

      const repoConfig = repoDetector.detectRepoType(testDir);
      expect(repoConfig.type).toBe("control-plane");
    });

    test("should validate version consistency", () => {
      fs.mkdirSync(path.join(testDir, ".github"), { recursive: true });
      fs.writeFileSync(path.join(testDir, "VERSION"), "1.0.0\n");
      fs.writeFileSync(path.join(testDir, "package.json"), JSON.stringify({ version: "1.0.0" }, null, 2));

      const repoConfig = repoDetector.detectRepoType(testDir);
      const versionMap = versionManager.detectAllVersionFiles(repoConfig);
      const consistency = versionManager.validateVersionConsistency(versionMap);

      expect(consistency.isConsistent).toBe(true);
    });
  });

  describe("Version Bumping", () => {
    test("should bump patch version", () => {
      const newVersion = versionManager.bumpVersion("patch", "1.0.0");
      expect(newVersion).toBe("1.0.1");
    });

    test("should bump minor version", () => {
      const newVersion = versionManager.bumpVersion("minor", "1.0.0");
      expect(newVersion).toBe("1.1.0");
    });

    test("should bump major version", () => {
      const newVersion = versionManager.bumpVersion("major", "1.0.0");
      expect(newVersion).toBe("2.0.0");
    });
  });

  describe("WordPress Plugin Detection", () => {
    test("should detect WordPress plugin", () => {
      const pluginFile = path.join(testDir, "test-plugin.php");
      fs.writeFileSync(pluginFile, `<?php\n/**\n * Plugin Name: Test\n * Version: 1.0.0\n */\n`);
      fs.writeFileSync(path.join(testDir, "VERSION"), "1.0.0\n");

      const repoConfig = repoDetector.detectRepoType(testDir);
      expect(repoConfig.type).toBe("plugin");
    });
  });

  describe("WordPress Theme Detection", () => {
    test("should detect WordPress theme", () => {
      fs.writeFileSync(path.join(testDir, "style.css"), `/*\nTheme Name: Test\nVersion: 1.0.0\n*/`);
      fs.writeFileSync(path.join(testDir, "VERSION"), "1.0.0\n");

      const repoConfig = repoDetector.detectRepoType(testDir);
      expect(repoConfig.type).toBe("theme");
    });
  });
});
