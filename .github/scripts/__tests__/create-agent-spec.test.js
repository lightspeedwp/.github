#!/usr/bin/env node

/**
 * Tests for Agent Specification Generator CLI
 *
 * Tests the create-agent-spec.js CLI tool:
 * - Template file validation
 * - Input validation functions
 * - Spec generation
 * - File writing
 */

import fs from "fs";
import path from "path";
import url from "url";
import { execFileSync } from "child_process";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "../../../");
const TEMPLATE_PATH = path.join(
  PROJECT_ROOT,
  "scripts/templates/agent.template.md",
);
const CREATE_AGENT_SCRIPT = path.join(
  PROJECT_ROOT,
  "scripts/create-agent-spec.js",
);

// Test tracking
let passed = 0;
let failed = 0;
const failures = [];

/**
 * Test helper
 */
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (error) {
    failed++;
    failures.push({ name, error: error.message });
    console.error(`❌ ${name}: ${error.message}`);
  }
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

/**
 * Test 1: Template file exists
 */
test("Template file exists", () => {
  assert(
    fs.existsSync(TEMPLATE_PATH),
    `Template file not found: ${TEMPLATE_PATH}`,
  );
});

/**
 * Test 2: Template file has required placeholders
 */
test("Template has required placeholders", () => {
  const content = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const requiredPlaceholders = [
    "{{NAME}}",
    "{{DISPLAY_NAME}}",
    "{{DESCRIPTION}}",
    "{{CATEGORY}}",
    "{{STATUS}}",
    "{{VERSION}}",
    "{{CREATED_DATE}}",
    "{{LAST_UPDATED}}",
    "{{AUTHOR}}",
    "{{IMPLEMENTATION}}",
    "{{PURPOSE}}",
  ];

  for (const placeholder of requiredPlaceholders) {
    assert(
      content.includes(placeholder),
      `Missing placeholder: ${placeholder}`,
    );
  }
});

/**
 * Test 3: Create agent script exists
 */
test("Create agent script exists", () => {
  assert(
    fs.existsSync(CREATE_AGENT_SCRIPT),
    `Script not found: ${CREATE_AGENT_SCRIPT}`,
  );
});

/**
 * Test 4: Script is executable
 */
test("Script is executable", () => {
  const stats = fs.statSync(CREATE_AGENT_SCRIPT);
  assert((stats.mode & 0o111) !== 0, "Script is not executable");
});

/**
 * Test 5: Script has proper Node.js header
 */
test("Script has proper Node.js header", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(content.startsWith("#!/usr/bin/env node"), "Missing shebang");
});

/**
 * Test 6: Validate agent name function exists
 */
test("Validate agent name function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("validateAgentName"),
    "validateAgentName function not found",
  );
});

/**
 * Test 7: Validate description function exists
 */
test("Validate description function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("validateDescription"),
    "validateDescription function not found",
  );
});

/**
 * Test 8: Validate category function exists
 */
test("Validate category function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("validateCategory"),
    "validateCategory function not found",
  );
});

/**
 * Test 9: Valid categories defined
 */
test("Valid categories are defined", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  const categories = [
    "governance",
    "automation",
    "planning",
    "tooling",
    "integration",
    "mode",
    "analysis",
    "infrastructure",
  ];

  for (const category of categories) {
    assert(
      content.includes(`"${category}"`),
      `Category "${category}" not found in valid categories`,
    );
  }
});

/**
 * Test 10: Valid statuses defined
 */
test("Valid statuses are defined", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(content.includes('"active"'), "active status not found");
  assert(content.includes('"draft"'), "draft status not found");
  assert(content.includes('"deprecated"'), "deprecated status not found");
});

/**
 * Test 11: Template generation function exists
 */
test("Template generation function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("generateSpecContent"),
    "generateSpecContent function not found",
  );
});

/**
 * Test 12: Spec file writing function exists
 */
test("Spec file writing function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(content.includes("writeSpecFile"), "writeSpecFile function not found");
});

/**
 * Test 13: Batch file processing function exists
 */
test("Batch file processing function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("processBatchFile"),
    "processBatchFile function not found",
  );
});

/**
 * Test 14: Help message function exists
 */
test("Help message function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(content.includes("printHelp"), "printHelp function not found");
});

/**
 * Test 15: Date formatting function exists
 */
test("Date formatting function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("getCurrentDate"),
    "getCurrentDate function not found",
  );
});

/**
 * Test 16: Interactive prompt function exists
 */
test("Interactive prompt function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("async function prompt"),
    "prompt function not found",
  );
});

/**
 * Test 17: Argument parsing function exists
 */
test("Argument parsing function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("function parseArgs"),
    "parseArgs function not found",
  );
  assert(content.includes("--category"), "--category argument not supported");
  assert(content.includes("--batch"), "--batch argument not supported");
});

/**
 * Test 18: Main entry point exists
 */
test("Main entry point function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(content.includes("async function main"), "main function not found");
});

/**
 * Test 19: npm script is registered
 */
test("npm script is registered", () => {
  const packageJsonPath = path.join(PROJECT_ROOT, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  assert(
    packageJson.scripts["create:agent"],
    'npm script "create:agent" not found',
  );
  assert(
    packageJson.scripts["create:agent"].includes("create-agent-spec.js"),
    "npm script does not reference create-agent-spec.js",
  );
});

/**
 * Test 20: CLI --help displays usage information
 */
test("CLI --help displays usage information", () => {
  try {
    const output = execFileSync("node", [CREATE_AGENT_SCRIPT, "--help"], {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
    });
    assert(
      output.includes("Agent Specification Generator"),
      "Help text missing title",
    );
    assert(
      output.includes("--category"),
      "Help text missing --category option",
    );
    assert(output.includes("--batch"), "Help text missing --batch option");
  } catch (error) {
    assert(false, `CLI --help failed: ${error.message}`);
  }
});

/**
 * Test 21: DEFAULT_VERSION is valid (v1.0.0 format)
 */
test("DEFAULT_VERSION is valid semantic version", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  const versionMatch = content.match(/DEFAULT_VERSION\s*=\s*"([^"]+)"/);
  assert(
    versionMatch && versionMatch[1] === "v1.0.0",
    "DEFAULT_VERSION should be v1.0.0",
  );
});

/**
 * Test 22: YAML escaping function exists
 */
test("YAML escaping function exists", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("escapeYamlString"),
    "escapeYamlString function not found",
  );
  assert(
    content.includes(
      "replace(/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    ) || content.includes('"\\\\\\\\"'),
    "YAML escaping not implemented",
  );
});

/**
 * Test 23: Path validation for batch processing
 */
test("Batch processing validates paths", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("path.normalize") && content.includes("path.resolve"),
    "Path normalization missing for security",
  );
  assert(
    content.includes("startsWith") &&
      content.includes(content.includes("AGENTS_DIR")),
    "Path traversal protection missing",
  );
});

/**
 * Test 24: Batch entry validation implemented
 */
test("Batch entry validation checks data types", () => {
  const content = fs.readFileSync(CREATE_AGENT_SCRIPT, "utf-8");
  assert(
    content.includes("typeof agent") && content.includes("typeof agent.name"),
    "Type checking for batch entries missing",
  );
  assert(
    content.includes("String(") && content.includes(".trim()"),
    "String validation for batch fields missing",
  );
});

/**
 * Print test summary
 */
console.log("\n" + "=".repeat(60) + "\n");
console.log("TEST SUMMARY");
console.log("=".repeat(60) + "\n");
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}\n`);

if (failures.length > 0) {
  console.log("FAILURES:\n");
  for (const failure of failures) {
    console.error(`  • ${failure.name}`);
    console.error(`    ${failure.error}\n`);
  }
}

console.log("=".repeat(60) + "\n");

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);
