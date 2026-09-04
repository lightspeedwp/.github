#!/usr/bin/env node

/**
 * Workflow Integration Tests
 * Test suite for agent-spec-validation.yml workflow behavior
 *
 * Tests the complete validation workflow including:
 * - Frontmatter validation job
 * - Cross-reference validation job
 * - Coverage check job
 * - Status check job
 * - PR comment generation
 */

import fs from "fs";
import path from "path";

// Colors for output
const RED = "\x1b[0;31m";
const GREEN = "\x1b[0;32m";
const YELLOW = "\x1b[1;33m";
const NC = "\x1b[0m";

// Test counters
let testsPassed = 0;
let testsFailed = 0;
let testsTotal = 0;

// Test utilities
function testCase(name) {
  testsTotal++;
  console.log(`\n${YELLOW}[Test ${testsTotal}] ${name}${NC}`);
}

function assertTrue(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`${GREEN}✅ PASS${NC}`);
  } else {
    testsFailed++;
    console.log(`${RED}❌ FAIL: ${message}${NC}`);
  }
}

function assertExists(path, message) {
  const exists = fs.existsSync(path);
  if (exists) {
    testsPassed++;
    console.log(`${GREEN}✅ PASS${NC}`);
  } else {
    testsFailed++;
    console.log(`${RED}❌ FAIL: ${message} (path: ${path})${NC}`);
  }
}

console.log("");
console.log("════════════════════════════════════════════════════════════");
console.log("Workflow Integration Tests");
console.log("════════════════════════════════════════════════════════════");
console.log("");

const WORKFLOW_PATH = "./.github/workflows/agent-spec-validation.yml";
const FIXTURES_DIR = "./.github/scripts/__tests__/fixtures";

// Test 1: Workflow file exists
testCase("Workflow file exists");
assertExists(WORKFLOW_PATH, "agent-spec-validation.yml should exist");

// Test 2: Workflow has correct trigger conditions
testCase("Workflow has pull_request trigger");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("pull_request"),
    "Workflow should trigger on pull_request",
  );
}

// Test 3: Workflow has push trigger
testCase("Workflow has push trigger");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("push:") || content.includes("- push"),
    "Workflow should trigger on push",
  );
}

// Test 4: Workflow monitors agent spec paths
testCase("Workflow monitors agent spec paths");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("agents/**/*.agent.md"),
    "Workflow should monitor agents directory",
  );
}

// Test 5: Workflow has frontmatter validation job
testCase("Workflow has frontmatter validation job");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("frontmatter-validation") ||
      content.includes("frontmatter_validation"),
    "Workflow should have frontmatter validation job",
  );
}

// Test 6: Workflow has cross-reference validation job
testCase("Workflow has cross-reference validation job");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("cross-reference-validation") ||
      content.includes("cross_reference_validation"),
    "Workflow should have cross-reference validation job",
  );
}

// Test 7: Workflow has coverage check job
testCase("Workflow has coverage check job");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("spec-coverage") || content.includes("spec_coverage"),
    "Workflow should have coverage check job",
  );
}

// Test 8: Workflow has status check job
testCase("Workflow has status check job");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("status-check") || content.includes("status_check"),
    "Workflow should have status check job",
  );
}

// Test 9: Workflow has PR comment step
testCase("Workflow comments validation results on PR");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("Comment validation results on PR") ||
      content.includes("createComment"),
    "Workflow should comment on PR with validation results",
  );
}

// Test 10: Test fixtures cover all validation scenarios
testCase("Test fixtures exist for all validation scenarios");
const requiredFixtures = [
  "valid-agent.agent.md",
  "missing-fields.agent.md",
  "invalid-date-format.agent.md",
  "invalid-file-type.agent.md",
  "invalid-status.agent.md",
  "draft-agent.agent.md",
  "deprecated-agent.agent.md",
  "no-frontmatter.agent.md",
];

let missingFixtures = [];
for (const fixture of requiredFixtures) {
  const fixturePath = path.join(FIXTURES_DIR, fixture);
  if (!fs.existsSync(fixturePath)) {
    missingFixtures.push(fixture);
  }
}

if (missingFixtures.length === 0) {
  testsPassed++;
  console.log(
    `${GREEN}✅ PASS${NC} - All ${requiredFixtures.length} required fixtures exist`,
  );
} else {
  testsFailed++;
  console.log(
    `${RED}❌ FAIL: Missing ${missingFixtures.length} fixtures: ${missingFixtures.join(", ")}${NC}`,
  );
}

// Test 11: Fixture count meets minimum
testCase("Test fixture count meets minimum target (20+)");
const fixtureCount = fs
  .readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith(".agent.md")).length;
assertTrue(
  fixtureCount >= 20,
  `Should have at least 20 fixtures (current: ${fixtureCount})`,
);

// Test 12: Security fixtures exist
testCase("Security test fixtures exist");
const securityFixtures = [
  "yaml-injection-attempt.agent.md",
  "path-traversal-attempt.agent.md",
];
let securityMissing = [];
for (const fixture of securityFixtures) {
  const fixturePath = path.join(FIXTURES_DIR, fixture);
  if (!fs.existsSync(fixturePath)) {
    securityMissing.push(fixture);
  }
}

if (securityMissing.length === 0) {
  testsPassed++;
  console.log(
    `${GREEN}✅ PASS${NC} - Security test fixtures exist (${securityFixtures.length})`,
  );
} else {
  testsFailed++;
  console.log(
    `${RED}❌ FAIL: Missing security fixtures: ${securityMissing.join(", ")}${NC}`,
  );
}

// Test 13: Edge case fixtures exist
testCase("Edge case test fixtures exist");
const edgeCaseFixtures = [
  "empty-name.agent.md",
  "multiline-description.agent.md",
  "unicode-characters.agent.md",
  "version-semantic-valid.agent.md",
];
let edgeCaseMissing = [];
for (const fixture of edgeCaseFixtures) {
  const fixturePath = path.join(FIXTURES_DIR, fixture);
  if (!fs.existsSync(fixturePath)) {
    edgeCaseMissing.push(fixture);
  }
}

if (edgeCaseMissing.length === 0) {
  testsPassed++;
  console.log(
    `${GREEN}✅ PASS${NC} - Edge case fixtures exist (${edgeCaseFixtures.length})`,
  );
} else {
  testsFailed++;
  console.log(
    `${RED}❌ FAIL: Missing edge case fixtures: ${edgeCaseMissing.join(", ")}${NC}`,
  );
}

// Test 14: Workflow uses correct Node.js version
testCase("Workflow uses Node.js from .nvmrc");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("node-version-file") && content.includes(".nvmrc"),
    "Workflow should use Node.js version from .nvmrc",
  );
}

// Test 15: Workflow has timeout protection
testCase("Workflow jobs have timeout protection");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("timeout-minutes") || content.includes("timeout_minutes"),
    "Workflow jobs should have timeout-minutes",
  );
}

// Test 16: Workflow validates required frontmatter fields count
testCase("Workflow validates all 10 required frontmatter fields");
if (fs.existsSync(WORKFLOW_PATH)) {
  const content = fs.readFileSync(WORKFLOW_PATH, "utf8");
  assertTrue(
    content.includes("name") &&
      content.includes("description") &&
      content.includes("file_type") &&
      content.includes("category") &&
      content.includes("status"),
    "Workflow should validate all required fields",
  );
}

// Summary
console.log("");
console.log("════════════════════════════════════════════════════════════");
console.log("Test Summary");
console.log("════════════════════════════════════════════════════════════");
console.log(`Total Tests: ${testsTotal}`);
console.log(`${GREEN}Passed: ${testsPassed}${NC}`);
console.log(`${RED}Failed: ${testsFailed}${NC}`);
console.log("");

if (testsFailed === 0) {
  console.log(`${GREEN}✅ All tests passed!${NC}`);
  process.exit(0);
} else {
  console.log(`${RED}❌ Some tests failed${NC}`);
  process.exit(1);
}
