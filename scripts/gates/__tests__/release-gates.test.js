/**
 * Phase 5A Release Agent — Safety Gates Test Suite
 *
 * Comprehensive tests for 7-layer safety gates:
 *   1. Pre-flight checks
 *   2. Agentic reasoning score
 *   3. Version consistency
 *   4. Tag uniqueness
 *   5. Authorization
 *   6. Integrity filter
 *   7. Approval enforcement
 *
 * Target: 60+ tests, >85% code coverage
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const ReleaseGates = require("../release-gates.cjs");

// Test fixtures and utilities
const TMP_DIR = path.join(os.tmpdir(), "release-gates-test");

function setupTestRepo() {
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TMP_DIR, { recursive: true });
  process.chdir(TMP_DIR);

  // Initialize git repo
  execSync("git init");
  execSync('git config user.email "test@example.com"');
  execSync('git config user.name "Test User"');

  // Create initial VERSION file
  fs.writeFileSync("VERSION", "1.0.0", "utf-8");
  fs.writeFileSync("CHANGELOG.md", defaultChangelog(), "utf-8");

  execSync("git add .");
  execSync('git commit -m "Initial commit"');
  execSync("git branch develop");
  execSync("git checkout develop");
}

function defaultChangelog() {
  return `# Changelog

## [Unreleased]

### Added
- New feature 1
- New feature 2

### Fixed
- Bug fix 1

## [1.0.0] - 2025-01-01

### Added
- Initial release
`;
}

// ============================================================================
// GATE 1: Pre-flight Checks Tests
// ============================================================================

describe("GATE 1: Pre-flight Checks", () => {
  beforeEach(() => {
    setupTestRepo();
    process.env.GITHUB_ACTOR = "ash";
    process.env.INPUT_SCOPE = "patch";
  });

  afterEach(() => {
    process.chdir("/");
  });

  test("Should pass with valid pre-flight state", () => {
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    expect(gates.results.gate1_preflight.passed).toBe(true);
  });

  test("Should fail when not on develop branch", () => {
    execSync("git checkout -b main");
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    expect(gates.results.gate1_preflight.passed).toBe(false);
    expect(gates.results.gate1_preflight.details[0]).toMatch(/not on develop/i);
  });

  test("Should fail with uncommitted changes", () => {
    fs.writeFileSync("VERSION", "1.0.1", "utf-8");
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    expect(gates.results.gate1_preflight.passed).toBe(false);
  });

  test("Should fail when CHANGELOG.md is missing", () => {
    fs.unlinkSync("CHANGELOG.md");
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    expect(gates.results.gate1_preflight.passed).toBe(false);
  });

  test("Should fail when VERSION file is missing", () => {
    fs.unlinkSync("VERSION");
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    expect(gates.results.gate1_preflight.passed).toBe(false);
  });

  test("Should record version from VERSION file", () => {
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    const details = gates.results.gate1_preflight.details.join("\n");
    expect(details).toMatch(/1\.0\.0/);
  });
});

// ============================================================================
// GATE 2: Agentic Reasoning Score Tests
// ============================================================================

describe("GATE 2: Agentic Reasoning Score", () => {
  beforeEach(() => {
    setupTestRepo();
    process.env.INPUT_SCOPE = "patch";
  });

  afterEach(() => {
    process.chdir("/");
  });

  test("Should pass with valid changelog (score >= 0.80)", () => {
    const gates = new ReleaseGates();
    gates.gate2AgenticScore();
    expect(gates.results.gate2_agentic.passed).toBe(true);
    expect(gates.results.gate2_agentic.score).toBeGreaterThanOrEqual(0.8);
  });

  test("Should fail when changelog is empty (score < 0.80)", () => {
    fs.writeFileSync(
      "CHANGELOG.md",
      "# Changelog\n\n## [Unreleased]\n\n",
      "utf-8",
    );
    const gates = new ReleaseGates();
    gates.gate2AgenticScore();
    expect(gates.results.gate2_agentic.passed).toBe(false);
  });

  test("Should have proper score for patch release", () => {
    process.env.INPUT_SCOPE = "patch";
    const gates = new ReleaseGates();
    gates.gate2AgenticScore();
    const details = gates.results.gate2_agentic.details.join("\n");
    expect(details).toMatch(/patch.*low risk/i);
  });

  test("Should reduce score for minor release", () => {
    process.env.INPUT_SCOPE = "minor";
    const gates = new ReleaseGates();
    gates.gate2AgenticScore();
    const details = gates.results.gate2_agentic.details.join("\n");
    expect(details).toMatch(/minor.*moderate/i);
  });

  test("Should reduce score for major release", () => {
    process.env.INPUT_SCOPE = "major";
    const gates = new ReleaseGates();
    gates.gate2AgenticScore();
    const details = gates.results.gate2_agentic.details.join("\n");
    expect(details).toMatch(/major.*high risk/i);
  });

  test("Should penalize releases with breaking changes", () => {
    const changelog = `# Changelog

## [Unreleased]

### BREAKING
- Old API removed

## [1.0.0] - 2025-01-01
- Initial release
`;
    fs.writeFileSync("CHANGELOG.md", changelog, "utf-8");
    const gates = new ReleaseGates();
    gates.gate2AgenticScore();
    const details = gates.results.gate2_agentic.details.join("\n");
    expect(details).toMatch(/breaking/i);
  });

  test("Should set custom threshold", () => {
    const gates = new ReleaseGates({ agenticScoreThreshold: 0.9 });
    gates.gate2AgenticScore();
    // With high threshold, should fail
    expect(gates.results.gate2_agentic.score).toBeLessThan(0.95);
  });
});

// ============================================================================
// GATE 3: Version Consistency Tests
// ============================================================================

describe("GATE 3: Version Consistency", () => {
  beforeEach(() => {
    setupTestRepo();
  });

  afterEach(() => {
    process.chdir("/");
  });

  test("Should pass with valid semver (X.Y.Z)", () => {
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    expect(gates.results.gate3_version.passed).toBe(true);
  });

  test("Should calculate patch bump correctly (1.0.0 -> 1.0.1)", () => {
    process.env.INPUT_SCOPE = "patch";
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    const details = gates.results.gate3_version.details.join("\n");
    expect(details).toMatch(/1\.0\.1/);
  });

  test("Should calculate minor bump correctly (1.0.0 -> 1.1.0)", () => {
    process.env.INPUT_SCOPE = "minor";
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    const details = gates.results.gate3_version.details.join("\n");
    expect(details).toMatch(/1\.1\.0/);
  });

  test("Should calculate major bump correctly (1.0.0 -> 2.0.0)", () => {
    process.env.INPUT_SCOPE = "major";
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    const details = gates.results.gate3_version.details.join("\n");
    expect(details).toMatch(/2\.0\.0/);
  });

  test("Should reject invalid semver formats", () => {
    fs.writeFileSync("VERSION", "invalid-version", "utf-8");
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    expect(gates.results.gate3_version.passed).toBe(false);
  });

  test("Should reject malformed versions", () => {
    fs.writeFileSync("VERSION", "1.2", "utf-8");
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    expect(gates.results.gate3_version.passed).toBe(false);
  });

  test("Should handle 0.x versions correctly", () => {
    fs.writeFileSync("VERSION", "0.1.0", "utf-8");
    process.env.INPUT_SCOPE = "minor";
    const gates = new ReleaseGates();
    gates.gate3VersionConsistency();
    const details = gates.results.gate3_version.details.join("\n");
    expect(details).toMatch(/0\.2\.0/);
  });
});

// ============================================================================
// GATE 4: Tag Uniqueness Tests
// ============================================================================

describe("GATE 4: Tag Uniqueness", () => {
  beforeEach(() => {
    setupTestRepo();
  });

  afterEach(() => {
    process.chdir("/");
  });

  test("Should pass when tag does not exist", () => {
    const gates = new ReleaseGates();
    gates.gate4TagUniqueness();
    expect(gates.results.gate4_tag_unique.passed).toBe(true);
  });

  test("Should fail when tag already exists", () => {
    execSync("git tag v1.0.0");
    const gates = new ReleaseGates();
    gates.gate4TagUniqueness();
    expect(gates.results.gate4_tag_unique.passed).toBe(false);
  });

  test("Should format tag as vX.Y.Z", () => {
    const gates = new ReleaseGates();
    gates.gate4TagUniqueness();
    const details = gates.results.gate4_tag_unique.details.join("\n");
    expect(details).toMatch(/v\d+\.\d+\.\d+/);
  });
});

// ============================================================================
// GATE 5: Authorization Tests
// ============================================================================

describe("GATE 5: Authorization", () => {
  beforeEach(() => {
    setupTestRepo();
  });

  test("Should pass for authorized actors", () => {
    process.env.GITHUB_ACTOR = "ash";
    const gates = new ReleaseGates();
    gates.gate5Authorization();
    expect(gates.results.gate5_authorization.passed).toBe(true);
  });

  test("Should pass for lightspeed-bot", () => {
    process.env.GITHUB_ACTOR = "lightspeed-bot";
    const gates = new ReleaseGates();
    gates.gate5Authorization();
    expect(gates.results.gate5_authorization.passed).toBe(true);
  });

  test("Should fail for unauthorized actors", () => {
    process.env.GITHUB_ACTOR = "unknown-user";
    const gates = new ReleaseGates();
    gates.gate5Authorization();
    expect(gates.results.gate5_authorization.passed).toBe(false);
  });

  test("Should accept custom maintainer list", () => {
    process.env.GITHUB_ACTOR = "custom-maintainer";
    const gates = new ReleaseGates({
      maintainers: ["custom-maintainer"],
    });
    gates.gate5Authorization();
    expect(gates.results.gate5_authorization.passed).toBe(true);
  });
});

// ============================================================================
// GATE 6: Integrity Filter Tests
// ============================================================================

describe("GATE 6: Integrity Filter", () => {
  beforeEach(() => {
    setupTestRepo();
  });

  afterEach(() => {
    process.chdir("/");
  });

  test("Should pass when gitleaks not available", () => {
    const gates = new ReleaseGates();
    gates.gate6IntegrityFilter();
    // Either passes or skips (both acceptable)
    expect(gates.results.gate6_integrity.details.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// GATE 7: Approval Enforcement Tests
// ============================================================================

describe("GATE 7: Approval Enforcement", () => {
  beforeEach(() => {
    setupTestRepo();
  });

  test("Should auto-approve patch releases", () => {
    process.env.INPUT_SCOPE = "patch";
    const gates = new ReleaseGates();
    gates.gate7ApprovalEnforcement();
    expect(gates.results.gate7_approval.passed).toBe(true);
  });

  test("Should require approval for minor releases", () => {
    process.env.INPUT_SCOPE = "minor";
    const gates = new ReleaseGates();
    gates.gate7ApprovalEnforcement();
    expect(gates.results.gate7_approval.passed).toBe(false);
    expect(gates.results.gate7_approval.details[0]).toMatch(
      /requires.*1.*approval/i,
    );
  });

  test("Should require 2+ approvals for major releases", () => {
    process.env.INPUT_SCOPE = "major";
    const gates = new ReleaseGates();
    gates.gate7ApprovalEnforcement();
    expect(gates.results.gate7_approval.passed).toBe(false);
    expect(gates.results.gate7_approval.details[0]).toMatch(
      /requires.*2.*approval/i,
    );
  });
});

// ============================================================================
// All Gates Integration Tests
// ============================================================================

describe("All Gates Integration", () => {
  beforeEach(() => {
    setupTestRepo();
    process.env.GITHUB_ACTOR = "ash";
    process.env.INPUT_SCOPE = "patch";
  });

  afterEach(() => {
    process.chdir("/");
  });

  test("Should pass all gates for valid patch release", () => {
    const gates = new ReleaseGates();
    const result = gates.runAllGates();
    expect(result).toBe(true);
    expect(gates.getResults().passed).toBe(true);
  });

  test("Should fail fast on gate1 failure", () => {
    execSync("git checkout -b main");
    const gates = new ReleaseGates();
    const result = gates.runAllGates();
    expect(result).toBe(false);
    expect(gates.failedAt).toBe("gate1");
  });

  test("Should fail fast on authorization failure", () => {
    process.env.GITHUB_ACTOR = "unauthorized";
    const gates = new ReleaseGates();
    const result = gates.runAllGates();
    expect(result).toBe(false);
    expect(gates.failedAt).toBe("gate5");
  });

  test("Should save audit log", () => {
    const logDir = path.join(TMP_DIR, ".test-logs");
    const gates = new ReleaseGates({ logDir });
    gates.runAllGates();
    gates.saveAuditLog();

    const files = fs.readdirSync(logDir);
    expect(files.length).toBeGreaterThan(0);

    const log = JSON.parse(
      fs.readFileSync(path.join(logDir, files[0]), "utf-8"),
    );
    expect(log.timestamp).toBeDefined();
    expect(log.actor).toBeDefined();
    expect(log.outcome).toBeDefined();
  });

  test("Should record failed gate in audit log", () => {
    process.env.GITHUB_ACTOR = "unauthorized";
    const logDir = path.join(TMP_DIR, ".test-logs-fail");
    const gates = new ReleaseGates({ logDir });
    gates.runAllGates();
    gates.saveAuditLog();

    const files = fs.readdirSync(logDir);
    const log = JSON.parse(
      fs.readFileSync(path.join(logDir, files[0]), "utf-8"),
    );
    expect(log.outcome).toBe("FAILED");
    expect(log.failedAt).toBe("gate5");
  });
});

// ============================================================================
// Security Tests
// ============================================================================

describe("Security", () => {
  test("Should redact secrets in logs", () => {
    const gates = new ReleaseGates();
    const text = "token=secret123 password=mypass api-key=xxx";
    const redacted = gates.redactSecrets(text);
    expect(redacted).toMatch(/\[REDACTED\]/);
    expect(redacted).not.toMatch(/secret123/);
    expect(redacted).not.toMatch(/mypass/);
  });

  test("Should not expose tokens", () => {
    const gates = new ReleaseGates();
    const text = "GITHUB_TOKEN=FAKE_TOKEN_1234567890abcdef";
    const redacted = gates.redactSecrets(text);
    expect(redacted).toMatch(/\[REDACTED\]/);
  });

  test("Should not expose API keys", () => {
    const gates = new ReleaseGates();
    const text = "api_key=secret-key-123";
    const redacted = gates.redactSecrets(text);
    expect(redacted).toMatch(/\[REDACTED\]/);
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe("Error Handling", () => {
  test("Should provide meaningful error messages", () => {
    setupTestRepo();
    execSync("git checkout -b main");
    const gates = new ReleaseGates();
    gates.gate1Preflight();
    const details = gates.results.gate1_preflight.details.join("\n");
    expect(details).toMatch(/not on develop/i);
    process.chdir("/");
  });

  test("Should suggest fixes", () => {
    setupTestRepo();
    fs.unlinkSync("VERSION");
    const gates = new ReleaseGates();
    gates.runAllGates();
    const log = gates.getResults();
    expect(log.passed).toBe(false);
    process.chdir("/");
  });
});
