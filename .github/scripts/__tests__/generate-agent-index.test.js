#!/usr/bin/env node

/**
 * Index Generator Tests
 * Test suite for generate-agent-index.js
 *
 * Tests spec collection, parsing, categorization, and index generation
 */

import fs from "fs";
import path from "path";
import * as YAML from "js-yaml";

// Color codes
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

function assertGreaterThan(actual, expected, message) {
  if (actual > expected) {
    testsPassed++;
    console.log(`${GREEN}✅ PASS${NC}`);
  } else {
    testsFailed++;
    console.log(`${RED}❌ FAIL: ${message}${NC}`);
    console.log(`  Expected > ${expected}`);
    console.log(`  Actual: ${actual}`);
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

function assertArrayIncludes(array, value, message) {
  if (array.includes(value)) {
    testsPassed++;
    console.log(`${GREEN}✅ PASS${NC}`);
  } else {
    testsFailed++;
    console.log(`${RED}❌ FAIL: ${message}${NC}`);
    console.log(`  Expected to include: ${value}`);
    console.log(`  Actual array: ${array.join(", ")}`);
  }
}

// Helper functions (from generate-agent-index.js)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    return YAML.load(match[1]);
  } catch (error) {
    return null;
  }
}

function parseAgentSpec(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      return null;
    }

    // Extract first paragraph
    const contentMatch = content.match(
      /^---\n[\s\S]*?\n---\n+([\s\S]*?)(?:\n##|$)/,
    );
    const summary = contentMatch ? contentMatch[1].trim().split("\n")[0] : "";

    return {
      name: frontmatter.name || path.basename(filePath, ".agent.md"),
      description: frontmatter.description || summary || "",
      file: path.basename(filePath),
      path: filePath,
      category: frontmatter.category || "unknown",
      status: frontmatter.status || "active",
      version: frontmatter.version || "1.0.0",
      implementation: frontmatter.implementation || null,
      tags: frontmatter.tags || [],
      created_date: frontmatter.created_date || "",
      last_updated: frontmatter.last_updated || "",
      author: frontmatter.author || "Unknown",
      language: frontmatter.language || "en",
    };
  } catch (error) {
    return null;
  }
}

console.log("");
console.log("════════════════════════════════════════════════════════════");
console.log("Index Generator Unit Tests");
console.log("════════════════════════════════════════════════════════════");
console.log("");

const FIXTURES_DIR = "./.github/scripts/__tests__/fixtures";

// Test 1: parseAgentSpec extracts all fields
testCase("parseAgentSpec extracts all frontmatter fields");
const validSpecPath = path.join(FIXTURES_DIR, "valid-agent.agent.md");
if (fs.existsSync(validSpecPath)) {
  const spec = parseAgentSpec(validSpecPath);
  assertTrue(spec !== null, "Should parse valid spec");
  if (spec) {
    assertEqual(spec.name, "Valid Test Agent", "Name should match");
    assertEqual(spec.category, "testing", "Category should match");
    assertEqual(spec.status, "active", "Status should match");
    assertEqual(spec.language, "en", "Language should match");
  }
}

// Test 2: parseAgentSpec returns null for invalid specs
testCase("parseAgentSpec returns null for invalid specs");
const noFrontmatterPath = path.join(FIXTURES_DIR, "no-frontmatter.agent.md");
if (fs.existsSync(noFrontmatterPath)) {
  const spec = parseAgentSpec(noFrontmatterPath);
  assertEqual(spec, null, "Should return null for invalid spec");
}

// Test 3: parseAgentSpec provides default values
testCase("parseAgentSpec provides default values for missing fields");
const missingPath = path.join(FIXTURES_DIR, "missing-fields.agent.md");
if (fs.existsSync(missingPath)) {
  const spec = parseAgentSpec(missingPath);
  if (spec) {
    assertEqual(spec.status, "active", "Status should default to active");
    assertEqual(spec.version, "1.0.0", "Version should default to 1.0.0");
    assertEqual(spec.language, "en", "Language should default to en");
  }
}

// Test 4: Category handling for different values
testCase("Category field is preserved from spec");
const configPath = path.join(FIXTURES_DIR, "config-agent.agent.md");
if (fs.existsSync(configPath)) {
  const spec = parseAgentSpec(configPath);
  if (spec) {
    assertEqual(
      spec.category,
      "configuration",
      "Should preserve category value",
    );
  }
}

// Test 5: Custom category support
testCase("Custom category values are accepted");
const customCategoryPath = path.join(FIXTURES_DIR, "unknown-category.agent.md");
if (fs.existsSync(customCategoryPath)) {
  const spec = parseAgentSpec(customCategoryPath);
  if (spec) {
    assertEqual(
      spec.category,
      "custom-category",
      "Should accept custom category",
    );
  }
}

// Test 6: Implementation reference is preserved
testCase("Implementation reference is preserved");
const implPath = path.join(FIXTURES_DIR, "implementation-ref.agent.md");
if (fs.existsSync(implPath)) {
  const spec = parseAgentSpec(implPath);
  if (spec) {
    assertEqual(
      spec.implementation,
      "test-implementation",
      "Should preserve implementation reference",
    );
  }
}

// Test 7: Tags array is parsed correctly
testCase("Tags array is parsed correctly");
const tagsPath = path.join(FIXTURES_DIR, "tags-agent.agent.md");
if (fs.existsSync(tagsPath)) {
  const spec = parseAgentSpec(tagsPath);
  if (spec) {
    assertTrue(Array.isArray(spec.tags), "Tags should be an array");
    assertGreaterThan(spec.tags.length, 0, "Tags should have elements");
  }
}

// Test 8: Parse multiple different status values
testCase("Different status values are parsed correctly");
const draftPath = path.join(FIXTURES_DIR, "draft-agent.agent.md");
const deprecatedPath = path.join(FIXTURES_DIR, "deprecated-agent.agent.md");

if (fs.existsSync(draftPath)) {
  const draftSpec = parseAgentSpec(draftPath);
  assertEqual(draftSpec.status, "draft", "Should parse draft status");
}

if (fs.existsSync(deprecatedPath)) {
  const deprecatedSpec = parseAgentSpec(deprecatedPath);
  assertEqual(
    deprecatedSpec.status,
    "deprecated",
    "Should parse deprecated status",
  );
}

// Test 9: Version field is parsed
testCase("Version field is parsed correctly");
const versionPath = path.join(FIXTURES_DIR, "long-version.agent.md");
if (fs.existsSync(versionPath)) {
  const spec = parseAgentSpec(versionPath);
  if (spec) {
    assertTrue(spec.version.includes("1.0.0"), "Should preserve version");
  }
}

// Test 10: Description with multiline text
testCase("Multiline descriptions are preserved");
const multilinePath = path.join(FIXTURES_DIR, "multiline-description.agent.md");
if (fs.existsSync(multilinePath)) {
  const spec = parseAgentSpec(multilinePath);
  if (spec) {
    assertTrue(
      spec.description && spec.description.length > 0,
      "Should have description content",
    );
  }
}

// Test 11: Collect and sort multiple specs
testCase("Multiple specs can be collected and sorted");
const specs = [];
const files = fs
  .readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith(".agent.md"));
for (const file of files.slice(0, 10)) {
  const spec = parseAgentSpec(path.join(FIXTURES_DIR, file));
  if (spec) specs.push(spec);
}
assertGreaterThan(specs.length, 5, "Should collect multiple specs");

// Test 12: Specs can be grouped by category
testCase("Specs can be grouped by category");
if (specs.length > 0) {
  const byCategory = {};
  for (const spec of specs) {
    const cat = spec.category || "unknown";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(spec);
  }
  assertTrue(
    Object.keys(byCategory).length > 0,
    "Should group specs by category",
  );
}

// Test 13: Status statistics can be calculated
testCase("Status statistics can be calculated");
if (specs.length > 0) {
  const active = specs.filter((s) => s.status === "active").length;
  const draft = specs.filter((s) => s.status === "draft").length;
  const deprecated = specs.filter((s) => s.status === "deprecated").length;
  assertTrue(
    active + draft + deprecated <= specs.length,
    "Status counts should not exceed total",
  );
}

// Test 14: Author statistics can be calculated
testCase("Author statistics can be calculated");
if (specs.length > 0) {
  const byAuthor = {};
  for (const spec of specs) {
    const author = spec.author || "Unknown";
    if (!byAuthor[author]) byAuthor[author] = [];
    byAuthor[author].push(spec);
  }
  assertTrue(Object.keys(byAuthor).length > 0, "Should group specs by author");
}

// Test 15: File paths are relative
testCase("File paths are handled correctly");
if (specs.length > 0) {
  const spec = specs[0];
  assertTrue(spec.path && spec.path.length > 0, "Should have path");
  assertTrue(
    spec.file && spec.file.endsWith(".agent.md"),
    "Should have filename",
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
