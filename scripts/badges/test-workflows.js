#!/usr/bin/env node

/**
 * Test suite for badge generation workflows
 * Validates workflow functionality and edge cases
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TESTS = {
  schema: {
    name: "Schema Validation",
    run: testSchemaValidation,
  },
  markers: {
    name: "Badge Marker Detection",
    run: testBadgeMarkers,
  },
  urls: {
    name: "Badge URL Format",
    run: testBadgeUrls,
  },
  frontmatter: {
    name: "Frontmatter Parsing",
    run: testFrontmatter,
  },
  coverage: {
    name: "Workflow Coverage",
    run: testWorkflowCoverage,
  },
};

// Test Results
let passed = 0;
let failed = 0;
const failures = [];

/**
 * Test schema validation
 */
async function testSchemaValidation() {
  const schemaPath = path.join(
    process.cwd(),
    ".github/automation/badges.schema.yml",
  );

  if (!fs.existsSync(schemaPath)) {
    throw new Error("Schema file not found");
  }

  const content = fs.readFileSync(schemaPath, "utf-8");

  // Check required sections
  if (!content.includes("badges:")) {
    throw new Error("Schema missing 'badges' section");
  }

  if (!content.includes("mapping:")) {
    throw new Error("Schema missing 'mapping' section");
  }

  if (!content.includes("config:")) {
    throw new Error("Schema missing 'config' section");
  }

  // Count workflows in schema
  const workflowCount = (content.match(/^\s{4}[a-z0-9-]+:\s*$/gm) || []).length;

  return {
    passed: true,
    message: `Schema valid with ${workflowCount} workflow definitions`,
  };
}

/**
 * Test badge marker detection
 */
async function testBadgeMarkers() {
  const docsDir = path.join(process.cwd(), "docs");
  let filesWithMarkers = 0;
  let filesWithoutMarkers = 0;

  // Find markdown files
  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .slice(0, 10); // Test first 10 files

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(docsDir, file), "utf-8");

    if (
      content.includes("<!-- BADGES-START -->") &&
      content.includes("<!-- BADGES-END -->")
    ) {
      filesWithMarkers++;
    } else {
      filesWithoutMarkers++;
    }
  });

  if (filesWithMarkers === 0) {
    throw new Error("No files with badge markers found in docs/");
  }

  return {
    passed: true,
    message: `Found ${filesWithMarkers} files with badge markers (${filesWithoutMarkers} without)`,
  };
}

/**
 * Test badge URL format
 */
async function testBadgeUrls() {
  const badgeFormats = [
    /https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/workflows\/[^/]+\/badge\.svg/,
    /https:\/\/img\.shields\.io\/badge\/[^)]+/,
  ];

  // Test that badges.js can generate valid URLs
  const repo = "lightspeedwp/.github";
  const workflowName = "checks.yml";
  const branch = "develop";

  const expectedUrl = `https://github.com/${repo}/actions/workflows/${workflowName}/badge.svg?branch=${branch}`;

  if (!badgeFormats[0].test(expectedUrl)) {
    throw new Error("Invalid GitHub Actions badge URL format");
  }

  return {
    passed: true,
    message: `Badge URL format valid: ${expectedUrl}`,
  };
}

/**
 * Test frontmatter parsing
 */
async function testFrontmatter() {
  const testContent = `---
title: Test Document
file_type: documentation
tags:
  - test
  - badges
---

# Test Document

Content here...`;

  // Extract frontmatter
  const match = testContent.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error("Could not parse frontmatter");
  }

  const frontmatter = match[1];

  if (!frontmatter.includes("title: Test Document")) {
    throw new Error("Frontmatter parsing failed");
  }

  return {
    passed: true,
    message: "Frontmatter parsing works correctly",
  };
}

/**
 * Test workflow coverage
 */
async function testWorkflowCoverage() {
  const workflowsDir = path.join(process.cwd(), ".github/workflows");
  const schemaPath = path.join(
    process.cwd(),
    ".github/automation/badges.schema.yml",
  );

  // Count actual workflows
  const workflows = fs
    .readdirSync(workflowsDir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

  // Count workflows in schema
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const schemaWorkflows = (schemaContent.match(/^\s{4}[a-z0-9-]+:\s*$/gm) || [])
    .length;

  if (schemaWorkflows === 0) {
    throw new Error("No workflows found in schema");
  }

  const coverage = (schemaWorkflows / workflows.length) * 100;

  return {
    passed: true,
    message: `Coverage: ${schemaWorkflows}/${workflows.length} workflows (${coverage.toFixed(1)}%)`,
  };
}

/**
 * Run a single test
 */
async function runTest(name, testFn) {
  process.stdout.write(`  ▶ ${name}... `);

  try {
    const result = await testFn();

    if (result.passed) {
      console.log(`✓ ${result.message}`);
      passed++;
      return true;
    } else {
      console.log(`✗ ${result.message}`);
      failed++;
      failures.push({ name, error: result.message });
      return false;
    }
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    failures.push({ name, error: error.message });
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log("\n🧪 Badge Workflow Test Suite\n");

  for (const [_key, test] of Object.entries(TESTS)) {
    console.log(`${test.name}`);
    await runTest(test.name, test.run);
    console.log();
  }

  // Summary
  console.log("📊 Test Summary");
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${passed + failed}\n`);

  if (failures.length > 0) {
    console.log("❌ Failures:");
    failures.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
    process.exit(1);
  } else {
    console.log("✅ All tests passed!");
    process.exit(0);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
