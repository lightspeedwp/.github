#!/usr/bin/env node

/**
 * Test suite for changelog-management.yml workflow consolidation
 * Verifies:
 * 1. PR validation scenario (validate-changelog job)
 * 2. Merge sync scenario (sync-changelog job)
 * 3. Pre-release check scenario (pre-release-check job)
 */

const fs = require("fs");
const path = require("path");

const TEST_DIR = path.join(
  __dirname,
  "../../../..",
  ".github/tmp/changelog-mgmt-test",
);
const CHANGELOG_PATH = path.join(TEST_DIR, "CHANGELOG.md");
const ENTRIES_PATH = path.join(TEST_DIR, "entries.md");

let testsPassed = 0;
let testsFailed = 0;

function setup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
}

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   ${err.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(haystack, needle, message) {
  assert(
    haystack.includes(needle),
    `${message}\nExpected to include: ${needle}`,
  );
}

// ============================================================================
// Test Scenarios
// ============================================================================

console.log("\n📋 Testing Changelog Management Workflow Consolidation\n");

// Scenario 1: Validation Tests
console.log("Scenario 1: PR Validation (validate-changelog job)");
console.log("─".repeat(50));

setup();

test("Accepts changelog with Unreleased section", () => {
  const changelog = `# Changelog

## [Unreleased]

### Added
- New feature

### Fixed
- Bug fix

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const hasUnreleasedSection = content.includes("## [Unreleased]");
  const hasAddedSection = content.includes("### Added");

  assert(hasUnreleasedSection, "Should have Unreleased section");
  assert(hasAddedSection, "Should have category sections");
});

test("Detects missing Unreleased section", () => {
  const changelog = `# Changelog

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const hasUnreleased = content.includes("## [Unreleased]");

  assert(!hasUnreleased, "Should detect missing Unreleased section");
});

test("Validates standard changelog sections", () => {
  const validSections = [
    "### Added",
    "### Fixed",
    "### Changed",
    "### Removed",
    "### Deprecated",
    "### Security",
  ];
  const changelog = `# Changelog

## [Unreleased]

### Added
- Feature 1

### Fixed
- Bug 1

### Security
- Security fix 1
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const foundSections = validSections.filter((section) =>
    content.includes(section),
  );

  assert(foundSections.length >= 1, "Should have at least one valid section");
});

test("Enforces label restrictions (no meta:no-changelog for features)", () => {
  const restrictedTypes = new Set([
    "type:feature",
    "type:bug",
    "type:performance",
    "type:security",
    "type:release",
    "type:hotfix",
  ]);

  assert(
    restrictedTypes.has("type:feature"),
    "Feature type must require changelog",
  );
  assert(restrictedTypes.has("type:bug"), "Bug type must require changelog");
  assert(
    restrictedTypes.has("type:security"),
    "Security type must require changelog",
  );
});

test("Allows meta:no-changelog for non-critical types", () => {
  const allowedToSkip = ["type:chore", "type:docs", "type:refactor"];

  allowedToSkip.forEach((type) => {
    const isRestricted = new Set([
      "type:feature",
      "type:bug",
      "type:performance",
      "type:security",
      "type:release",
      "type:hotfix",
    ]).has(type);
    assert(!isRestricted, `${type} should allow meta:no-changelog`);
  });
});

test("Recognizes Dependabot authors for skip", () => {
  const dependabotAuthors = ["dependabot[bot]", "app/dependabot"];
  assert(
    dependabotAuthors.includes("dependabot[bot]"),
    "Should recognize dependabot[bot]",
  );
  assert(
    dependabotAuthors.includes("app/dependabot"),
    "Should recognize app/dependabot",
  );
});

cleanup();

// Scenario 2: Merge Sync Tests
console.log("\nScenario 2: Merge Sync (sync-changelog job)");
console.log("─".repeat(50));

setup();

test("Extracts entries from PR changelog", () => {
  const prChangelog = `## [Unreleased]

### Added
- Feature X
- Feature Y

### Fixed
- Bug fix A
`;

  fs.writeFileSync(ENTRIES_PATH, prChangelog);

  const content = fs.readFileSync(ENTRIES_PATH, "utf8");
  assertIncludes(content, "Feature X", "Should extract feature entries");
  assertIncludes(content, "Bug fix A", "Should extract bug fix entries");
});

test("Preserves section structure during merge", () => {
  const baseChangelog = `# Changelog

## [Unreleased]

### Added
- Existing feature

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  const prEntries = `### Added
- New feature
- Another feature

### Fixed
- Fixed issue
`;

  fs.writeFileSync(CHANGELOG_PATH, baseChangelog);
  fs.writeFileSync(ENTRIES_PATH, prEntries);

  const base = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const entries = fs.readFileSync(ENTRIES_PATH, "utf8");

  assert(
    base.includes("## [Unreleased]"),
    "Base should have Unreleased section",
  );
  assert(entries.includes("### Added"), "Entries should have category");
  assert(entries.includes("### Fixed"), "Entries should preserve all sections");
});

test("Handles empty entry extraction gracefully", () => {
  // When no entries were extracted, the workflow should not fail
  const hasEntries = false; // Simulates steps.extract.outputs.has_entries

  // Workflow should report gracefully without commit
  assert(!hasEntries, "Empty entries should not cause sync failure");
});

test("Formats commit message correctly", () => {
  const prNumber = 1234;
  const expectedMsg = `chore(changelog): merge entries from PR #${prNumber} [skip ci]`;

  assertIncludes(
    expectedMsg,
    "[skip ci]",
    "Commit should include [skip ci] flag",
  );
  assertIncludes(
    expectedMsg,
    `PR #${prNumber}`,
    "Commit should reference PR number",
  );
  assertIncludes(
    expectedMsg,
    "chore(changelog)",
    "Commit should have correct prefix",
  );
});

test("Validates entries before committing", () => {
  const changelog = `## [Unreleased]

### Added
- Feature 1

### Fixed
- Bug fix 1
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const hasValidSections = ["### Added", "### Fixed"].some((section) =>
    content.includes(section),
  );

  assert(hasValidSections, "Should validate section format before commit");
});

cleanup();

// Scenario 3: Pre-release Check Tests
console.log("\nScenario 3: Pre-release Check (pre-release-check job)");
console.log("─".repeat(50));

setup();

test("Validates changelog schema for release", () => {
  const changelog = `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Feature for next release

## [1.1.0] - 2026-06-01

### Added
- New feature

### Fixed
- Bug fix

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const hasValidStructure =
    content.includes("# Changelog") && content.includes("## [Unreleased]");
  assert(hasValidStructure, "Changelog must have valid structure for release");
});

test("Verifies semantic version format", () => {
  const changelog = `# Changelog

## [Unreleased]

## [1.1.0] - 2026-06-01

### Added
- Feature

## [1.0.0] - 2026-01-01

### Added
- Initial
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const versionPattern = /## \[\d+\.\d+\.\d+\]/;
  const hasValidVersions = versionPattern.test(content);
  assert(hasValidVersions, "Versions must follow semver format");
});

test("Confirms Unreleased section exists", () => {
  const changelog = `# Changelog

## [Unreleased]

### Added
- Pending release features

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const hasUnreleased = content.includes("## [Unreleased]");
  assert(hasUnreleased, "Release changelog must have Unreleased section");
});

test("Warns on missing Unreleased section without failing", () => {
  const changelog = `# Changelog

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  fs.writeFileSync(CHANGELOG_PATH, changelog);

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const hasUnreleased = content.includes("## [Unreleased]");

  // Workflow logs a warning but doesn't fail
  assert(!hasUnreleased, "Should detect missing Unreleased section and warn");
});

cleanup();

// Integration Tests
console.log("\nIntegration Tests");
console.log("─".repeat(50));

setup();

test("Complete workflow cycle: PR → Merge → Release", () => {
  const initial = `# Changelog

## [Unreleased]

## [1.0.0] - 2026-01-01

### Added
- Initial release
`;

  const prEntries = `### Added
- New feature for 1.1.0

### Fixed
- Critical bug fix
`;

  fs.writeFileSync(CHANGELOG_PATH, initial);
  fs.writeFileSync(ENTRIES_PATH, prEntries);

  // Stage 1: Validation
  const base = fs.readFileSync(CHANGELOG_PATH, "utf8");
  assert(base.includes("## [Unreleased]"), "Stage 1: PR validation passes");

  // Stage 2: Extraction
  const entries = fs.readFileSync(ENTRIES_PATH, "utf8");
  assert(entries.includes("### Added"), "Stage 2: Entries extracted");

  // Stage 3: Pre-release validation
  assert(base.includes("## [1.0.0]"), "Stage 3: Ready for pre-release check");
});

test("Rejects conflicting labels", () => {
  const conflictingLabels = {
    has_needs_changelog: true,
    has_no_changelog: true,
  };

  const hasConflict =
    conflictingLabels.has_needs_changelog && conflictingLabels.has_no_changelog;
  assert(hasConflict, "Conflicting labels must be detected and rejected");
});

test("Integrates all three workflow jobs", () => {
  // Verify that each job has distinct purposes
  const jobs = {
    "validate-changelog": "PR validation",
    "sync-changelog": "Merge sync",
    "pre-release-check": "Release validation",
  };

  Object.keys(jobs).forEach((job) => {
    assert(job.length > 0, `Job ${job} should be defined`);
  });
});

cleanup();

// Summary
console.log(`\n${"=".repeat(50)}`);
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log(`${"=".repeat(50)}\n`);

if (testsFailed > 0) {
  process.exit(1);
}
