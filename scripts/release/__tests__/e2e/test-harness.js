#!/usr/bin/env node

/**
 * E2E Test Harness for Release Workflow
 * Provides utilities for setting up and validating release workflows
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");

const TEST_REPO_BASE = process.env.TEST_REPO_BASE || "/tmp/release-e2e-test-repo";
const TEST_RESULTS_DIR =
  process.env.TEST_RESULTS_DIR || ".github/reports/release-validation";
const VERBOSE = process.env.VERBOSE === "true";

class TestHarness {
  constructor(scenario) {
    this.scenario = scenario;
    this.testRepoPath = path.join(
      TEST_REPO_BASE,
      `scenario-${scenario}-${Date.now()}`
    );
    this.results = {
      scenario,
      startTime: new Date().toISOString(),
      steps: [],
      passed: false,
      errors: [],
    };
  }

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const prefix = level.toUpperCase();

    if (VERBOSE || level !== "debug") {
      console.log(`[${timestamp}] [${prefix}] ${message}`);
    }

    this.results.steps.push({
      timestamp,
      level,
      message,
    });
  }

  error(message) {
    this.log(message, "error");
    this.results.errors.push(message);
  }

  /**
   * Create an ephemeral test repository with fixtures
   */
  createTestRepository() {
    this.log(`Creating test repository at: ${this.testRepoPath}`);

    // Create directory
    if (fs.existsSync(this.testRepoPath)) {
      this.log(`Removing existing test repo directory`);
      execSync(`rm -rf "${this.testRepoPath}"`);
    }

    fs.mkdirSync(this.testRepoPath, { recursive: true });

    // Initialize git repo
    this.execInRepo("git init");
    this.execInRepo('git config user.email "test@lightspeedwp.agency"');
    this.execInRepo('git config user.name "Test Bot"');

    // Create base repository structure
    const files = {
      "README.md": "# Test Repository\n\nFor E2E release workflow testing.",
      "VERSION": "1.0.0",
      ".gitignore": "node_modules/\n*.log\n.DS_Store\n",
      "CHANGELOG.md": this.createChangelogFixture(),
      "package.json": JSON.stringify(
        {
          name: "test-release-repo",
          version: "1.0.0",
          description: "Test repository for release E2E tests",
        },
        null,
        2
      ),
    };

    for (const [filename, content] of Object.entries(files)) {
      const filepath = path.join(this.testRepoPath, filename);
      fs.writeFileSync(filepath, content);
      this.log(`Created fixture: ${filename}`);
    }

    // Create initial commit
    this.execInRepo("git add .");
    this.execInRepo('git commit -m "initial: Setup test repository"');

    // Create v1.0.0 tag
    this.execInRepo('git tag -a v1.0.0 -m "Release v1.0.0"');

    // Create develop branch
    this.execInRepo("git checkout -b develop");

    this.log("Test repository created successfully");
  }

  /**
   * Create a CHANGELOG.md with [Unreleased] section
   */
  createChangelogFixture() {
    return `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Feature 1: New capability A
- Feature 2: New capability B

### Changed
- Improvement 1: Enhanced performance
- Improvement 2: Better user interface

### Fixed
- Bug fix 1: Resolved issue X
- Bug fix 2: Resolved issue Y

### Deprecated
- Legacy endpoint (will be removed in v2.0)

## [1.0.0] - 2026-01-01

### Added
- Initial release
- Core functionality

[Unreleased]: https://github.com/lightspeedwp/.github/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lightspeedwp/.github/releases/tag/v1.0.0
`;
  }

  /**
   * Execute command in test repository
   */
  execInRepo(command, options = {}) {
    const defaultOptions = {
      cwd: this.testRepoPath,
      encoding: "utf8",
      stdio: "pipe",
    };

    try {
      const result = execSync(command, { ...defaultOptions, ...options });
      this.log(`Executed: ${command}`, "debug");
      return result.trim();
    } catch (error) {
      this.error(`Command failed: ${command}`);
      this.error(`Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify repository state
   */
  verifyRepositoryState(expectedState) {
    this.log("Verifying repository state");

    const currentBranch = this.execInRepo(
      "git rev-parse --abbrev-ref HEAD"
    );
    if (
      expectedState.branch &&
      currentBranch !== expectedState.branch
    ) {
      throw new Error(
        `Expected branch ${expectedState.branch}, got ${currentBranch}`
      );
    }

    if (expectedState.hasTag) {
      const tags = this.execInRepo("git tag");
      if (!tags.includes(expectedState.hasTag)) {
        throw new Error(`Expected tag ${expectedState.hasTag} not found`);
      }
    }

    if (expectedState.fileContent) {
      for (const [file, expectedContent] of Object.entries(
        expectedState.fileContent
      )) {
        const filepath = path.join(this.testRepoPath, file);
        if (!fs.existsSync(filepath)) {
          throw new Error(`Expected file ${file} not found`);
        }

        const content = fs.readFileSync(filepath, "utf8");
        if (typeof expectedContent === "string") {
          if (!content.includes(expectedContent)) {
            throw new Error(
              `File ${file} does not contain expected content: ${expectedContent}`
            );
          }
        } else if (typeof expectedContent === "function") {
          if (!expectedContent(content)) {
            throw new Error(`File ${file} validation failed`);
          }
        }
      }
    }

    this.log("Repository state verification passed");
  }

  /**
   * Simulate version bump
   */
  bumpVersion(scope) {
    const versionPath = path.join(this.testRepoPath, "VERSION");
    const currentVersion = fs.readFileSync(versionPath, "utf8").trim();
    const [major, minor, patch] = currentVersion.split(".").map(Number);

    let newVersion;
    switch (scope) {
      case "major":
        newVersion = `${major + 1}.0.0`;
        break;
      case "minor":
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case "patch":
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
    }

    fs.writeFileSync(versionPath, newVersion);
    this.log(`Version bumped: ${currentVersion} → ${newVersion}`);
    return newVersion;
  }

  /**
   * Simulate changelog update
   */
  updateChangelog(newVersion) {
    const changelogPath = path.join(this.testRepoPath, "CHANGELOG.md");
    let content = fs.readFileSync(changelogPath, "utf8");

    const dateStr = new Date().toISOString().split("T")[0];
    const releaseHeading = `## [${newVersion}] - ${dateStr}`;
    const newContent = content.replace(
      "## [Unreleased]",
      `## [Unreleased]\n\n### Added\n\n### Changed\n\n### Fixed\n\n${releaseHeading}\n\n### Added\n- Release v${newVersion}`
    );

    fs.writeFileSync(changelogPath, newContent);
    this.log(`Changelog updated for version ${newVersion}`);
  }

  /**
   * Create a release PR (simulation)
   */
  createReleasePR(version, scope) {
    this.log(`Creating release PR for ${version} (scope: ${scope})`);

    const branchName = `release/v${version}`;
    this.execInRepo(`git checkout -b ${branchName}`);
    this.bumpVersion(scope);
    this.updateChangelog(version);

    this.execInRepo("git add .");
    this.execInRepo(`git commit -m "chore: Release v${version}"`);

    this.log(`Release branch created: ${branchName}`);
    return branchName;
  }

  /**
   * Simulate PR merge
   */
  mergeReleasePR(branchName, targetBranch = "develop") {
    this.log(`Merging ${branchName} → ${targetBranch}`);

    this.execInRepo(`git checkout ${targetBranch}`);
    this.execInRepo(`git merge --squash ${branchName}`);
    this.execInRepo("git commit -m \"chore: Merge release PR\"");

    this.log(`PR merged successfully`);
  }

  /**
   * Create release tag
   */
  createReleaseTag(version) {
    this.log(`Creating annotated tag: v${version}`);

    this.execInRepo(`git checkout main || git checkout -b main`);
    this.execInRepo(`git merge develop`);
    this.execInRepo(`git tag -a v${version} -m "Release v${version}"`);

    this.log(`Tag created: v${version}`);
  }

  /**
   * Cleanup test repository
   */
  cleanup() {
    this.log("Cleaning up test repository");

    if (fs.existsSync(this.testRepoPath)) {
      execSync(`rm -rf "${this.testRepoPath}"`);
      this.log("Test repository removed");
    }
  }

  /**
   * Save test results
   */
  saveResults(passed, errorMessage = null) {
    this.results.passed = passed;
    this.results.endTime = new Date().toISOString();

    if (errorMessage) {
      this.results.errors.push(errorMessage);
    }

    // Ensure results directory exists
    if (!fs.existsSync(TEST_RESULTS_DIR)) {
      fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
    }

    const filename = `${this.scenario}-${Date.now()}.json`;
    const filepath = path.join(TEST_RESULTS_DIR, filename);

    fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));
    this.log(`Results saved: ${filepath}`);

    return filepath;
  }
}

module.exports = { TestHarness };
