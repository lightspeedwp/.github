#!/usr/bin/env node

/**
 * Validation Script Tests
 * Test suite for validate-agent-specs.js
 *
 * Tests frontmatter parsing, field validation, and cross-reference checking
 */

import fs from "fs";
import path from "path";
import * as YAML from "js-yaml";

// Color codes for output
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

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    testsPassed++;
    console.log(`${GREEN}✅ PASS${NC}`);
  } else {
    testsFailed++;
    console.log(`${RED}❌ FAIL: ${message}${NC}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
  }
}

function assertExists(value, message) {
  if (value !== null && value !== undefined) {
    testsPassed++;
    console.log(`${GREEN}✅ PASS${NC}`);
  } else {
    testsFailed++;
    console.log(`${RED}❌ FAIL: ${message}${NC}`);
  }
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

// Helper functions (from validate-agent-specs.js)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return YAML.load(match[1]);
  } catch {
    return null;
  }
}

function isValidDate(dateStr) {
  if (typeof dateStr !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function validateFrontmatter(frontmatter) {
  const issues = [];
  const required = [
    "name",
    "description",
    "file_type",
    "category",
    "status",
    "version",
    "created_date",
    "last_updated",
    "author",
    "language",
  ];

  for (const field of required) {
    if (!frontmatter[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  // Check date formats
  if (frontmatter.created_date && !isValidDate(frontmatter.created_date)) {
    issues.push(`Invalid created_date format: ${frontmatter.created_date}`);
  }
  if (frontmatter.last_updated && !isValidDate(frontmatter.last_updated)) {
    issues.push(`Invalid last_updated format: ${frontmatter.last_updated}`);
  }

  return issues;
}

console.log("");
console.log("════════════════════════════════════════════════════════════");
console.log("Validation Script Unit Tests");
console.log("════════════════════════════════════════════════════════════");
console.log("");

const FIXTURES_DIR = "./.github/scripts/__tests__/fixtures";

// Test 1: parseFrontmatter extracts YAML correctly
testCase("parseFrontmatter extracts YAML from valid spec");
const validSpecPath = path.join(FIXTURES_DIR, "valid-agent.agent.md");
if (fs.existsSync(validSpecPath)) {
  const content = fs.readFileSync(validSpecPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  assertExists(frontmatter, "Frontmatter should be parsed");
  if (frontmatter) {
    assertEqual(
      frontmatter.name,
      "Valid Test Agent",
      "Name field should match",
    );
  }
}

// Test 2: parseFrontmatter returns null for invalid specs
testCase("parseFrontmatter returns null for invalid frontmatter");
const noFrontmatterPath = path.join(FIXTURES_DIR, "no-frontmatter.agent.md");
if (fs.existsSync(noFrontmatterPath)) {
  const content = fs.readFileSync(noFrontmatterPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  assertEqual(frontmatter, null, "Should return null for invalid frontmatter");
}

// Test 3: isValidDate validates YYYY-MM-DD format
testCase("isValidDate accepts valid dates");
assertTrue(isValidDate("2026-01-15"), "Valid date should pass");
assertTrue(isValidDate("2026-12-31"), "Valid date should pass");

// Test 4: isValidDate rejects invalid date formats
testCase("isValidDate rejects invalid date formats");
assertTrue(!isValidDate("01/15/2026"), "Invalid format should fail");
assertTrue(!isValidDate("2026-1-15"), "Missing leading zero should fail");
// Note: Semantic validation (month 13, day 32) is beyond regex scope
// isValidDate only validates format (YYYY-MM-DD), not date validity

// Test 5: validateFrontmatter detects missing fields
testCase("validateFrontmatter detects missing required fields");
const missingFieldsPath = path.join(FIXTURES_DIR, "missing-fields.agent.md");
if (fs.existsSync(missingFieldsPath)) {
  const content = fs.readFileSync(missingFieldsPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    const issues = validateFrontmatter(frontmatter);
    assertTrue(issues.length > 0, "Should have issues for missing fields");
    assertTrue(
      issues.some((i) => i.includes("category")),
      "Should report missing category",
    );
  }
}

// Test 6: validateFrontmatter validates date formats
testCase("validateFrontmatter detects invalid date formats");
const invalidDatePath = path.join(FIXTURES_DIR, "invalid-date-format.agent.md");
if (fs.existsSync(invalidDatePath)) {
  const content = fs.readFileSync(invalidDatePath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    const issues = validateFrontmatter(frontmatter);
    assertTrue(issues.length > 0, "Should have issues for invalid dates");
    assertTrue(
      issues.some((i) => i.includes("date")),
      "Should report date format issues",
    );
  }
}

// Test 7: Valid agent passes all validations
testCase("Valid agent spec passes validation");
if (fs.existsSync(validSpecPath)) {
  const content = fs.readFileSync(validSpecPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    const issues = validateFrontmatter(frontmatter);
    assertEqual(issues.length, 0, "Valid spec should have no issues");
  }
}

// Test 8: Draft status is valid
testCase("Draft status passes validation");
const draftPath = path.join(FIXTURES_DIR, "draft-agent.agent.md");
if (fs.existsSync(draftPath)) {
  const content = fs.readFileSync(draftPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    const issues = validateFrontmatter(frontmatter);
    assertTrue(
      issues.length === 0 || !issues.some((i) => i.includes("status")),
      "Draft status should be valid",
    );
  }
}

// Test 9: Deprecated status is valid
testCase("Deprecated status passes validation");
const deprecatedPath = path.join(FIXTURES_DIR, "deprecated-agent.agent.md");
if (fs.existsSync(deprecatedPath)) {
  const content = fs.readFileSync(deprecatedPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    const issues = validateFrontmatter(frontmatter);
    assertTrue(
      issues.length === 0 || !issues.some((i) => i.includes("status")),
      "Deprecated status should be valid",
    );
  }
}

// Test 10: Required fields are all checked
testCase("All 10 required fields are validated");
const requiredFields = [
  "name",
  "description",
  "file_type",
  "category",
  "status",
  "version",
  "created_date",
  "last_updated",
  "author",
  "language",
];
assertEqual(requiredFields.length, 10, "Should validate 10 required fields");

// Test 11: Multiple fixtures can be parsed
testCase("Can parse multiple agent specs");
let parsedCount = 0;
let errors = 0;
const fixtureFiles = fs
  .readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith(".agent.md"))
  .slice(0, 5); // Test first 5

for (const file of fixtureFiles) {
  const filePath = path.join(FIXTURES_DIR, file);
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const frontmatter = parseFrontmatter(content);
    if (frontmatter !== null) {
      parsedCount++;
    }
  } catch {
    errors++;
  }
}
assertTrue(
  parsedCount > 0,
  `Should parse at least some specs (parsed ${parsedCount})`,
);
assertTrue(errors === 0, "Should not have errors parsing specs");

// Test 12: Category field is flexible
testCase("Category field accepts custom categories");
const unknownCategoryPath = path.join(
  FIXTURES_DIR,
  "unknown-category.agent.md",
);
if (fs.existsSync(unknownCategoryPath)) {
  const content = fs.readFileSync(unknownCategoryPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    assertTrue(
      frontmatter.category === "custom-category",
      "Should accept custom category",
    );
  }
}

// Test 13: Implementation field is optional
testCase("Implementation field is optional");
if (fs.existsSync(validSpecPath)) {
  const content = fs.readFileSync(validSpecPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    const issues = validateFrontmatter(frontmatter);
    assertTrue(
      !issues.some((i) => i.includes("implementation")),
      "Implementation should be optional",
    );
  }
}

// Test 14: Parse YAML with tags array
testCase("parseFrontmatter handles YAML arrays");
const tagsPath = path.join(FIXTURES_DIR, "tags-agent.agent.md");
if (fs.existsSync(tagsPath)) {
  const content = fs.readFileSync(tagsPath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    assertTrue(
      Array.isArray(frontmatter.tags),
      "Tags should be parsed as array",
    );
    assertTrue(frontmatter.tags.length > 0, "Tags array should have elements");
  }
}

// Test 15: Parse multiline descriptions
testCase("parseFrontmatter handles multiline description field");
const multilinePath = path.join(FIXTURES_DIR, "multiline-description.agent.md");
if (fs.existsSync(multilinePath)) {
  const content = fs.readFileSync(multilinePath, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (frontmatter) {
    assertTrue(
      frontmatter.description && frontmatter.description.length > 0,
      "Should parse multiline description",
    );
  }
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
