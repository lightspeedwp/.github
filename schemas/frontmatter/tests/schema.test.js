#!/usr/bin/env node
/**
 * Frontmatter Schema Tests
 *
 * Unit tests for the frontmatter schema validator
 */

const {
  validateSchemaFile,
  extractFrontmatter,
  validateFile,
} = require("../validate");
const fs = require("fs");
const path = require("path");

// Test utilities
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
    testsPassed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    testsFailed++;
  }
}

function describe(description, tests) {
  console.log(`\n${colors.blue}${description}${colors.reset}`);
  tests();
}

// Tests
describe("Schema Validation", () => {
  const result = validateSchemaFile();
  assert(result.valid, "Schema file should be valid JSON Schema Draft 07");
  assert(result.schema !== undefined, "Schema should be loaded");
  assert(
    result.schema.$schema === "http://json-schema.org/draft-07/schema#",
    "Schema should declare Draft 07",
  );
});

describe("Frontmatter Extraction", () => {
  // Create temporary test file
  const testFile = path.join(__dirname, "test-temp.md");
  const validFrontmatter = `---
file_type: "agent"
name: "test-agent"
description: "Test agent description"
---

# Test Content
`;

  const noFrontmatter = `# Just a heading

No frontmatter here.
`;

  const invalidYaml = `---
file_type: "agent"
name: this is not quoted properly: and has colons
---

# Content
`;

  // Test valid frontmatter
  fs.writeFileSync(testFile, validFrontmatter);
  let fm = extractFrontmatter(testFile);
  assert(fm !== null, "Should extract valid frontmatter");
  assert(fm.file_type === "agent", "Should parse file_type correctly");
  assert(fm.name === "test-agent", "Should parse name correctly");

  // Test no frontmatter
  fs.writeFileSync(testFile, noFrontmatter);
  fm = extractFrontmatter(testFile);
  assert(fm === null, "Should return null when no frontmatter present");

  // Test invalid YAML
  fs.writeFileSync(testFile, invalidYaml);
  try {
    fm = extractFrontmatter(testFile);
    assert(false, "Should throw error for invalid YAML");
  } catch (error) {
    assert(true, "Should throw error for invalid YAML");
  }

  // Cleanup
  fs.unlinkSync(testFile);
});

describe("File Validation", () => {
  const { schema } = validateSchemaFile();
  const testFile = path.join(__dirname, "test-validation.md");

  // Valid agent frontmatter
  const validAgent = `---
file_type: "agent"
name: "test-agent"
description: "Test agent for validation"
version: "v1.0"
owners: ["lightspeedwp/team"]
status: "active"
---

# Test Agent
`;

  fs.writeFileSync(testFile, validAgent);
  let result = validateFile(testFile, schema);
  assert(
    result.status === "valid",
    "Valid agent frontmatter should pass validation",
  );

  // Missing required field
  const missingRequired = `---
file_type: "agent"
name: "test-agent"
---

# Missing description
`;

  fs.writeFileSync(testFile, missingRequired);
  result = validateFile(testFile, schema);
  assert(
    result.status === "invalid",
    "Missing required field should fail validation",
  );

  // Invalid file_type
  const invalidType = `---
file_type: "not-a-real-type"
name: "test"
description: "Test"
---

# Invalid type
`;

  fs.writeFileSync(testFile, invalidType);
  result = validateFile(testFile, schema);
  assert(
    result.status === "invalid",
    "Invalid file_type should fail validation",
  );

  // Valid instruction frontmatter with applyTo
  const validInstruction = `---
file_type: "instructions"
description: "Test instructions"
applyTo: "**/*.php"
domain: "security"
stability: "stable"
---

# Test Instructions
`;

  fs.writeFileSync(testFile, validInstruction);
  result = validateFile(testFile, schema);
  assert(
    result.status === "valid",
    "Valid instruction frontmatter should pass validation",
  );

  // Cleanup
  fs.unlinkSync(testFile);
});

describe("Schema Structure", () => {
  const { schema } = validateSchemaFile();

  assert(schema.definitions !== undefined, "Schema should have definitions");
  assert(
    schema.definitions.commonFields !== undefined,
    "Schema should define commonFields",
  );
  assert(schema.oneOf !== undefined, "Schema should use oneOf discriminator");
  assert(Array.isArray(schema.oneOf), "oneOf should be an array");
  assert(schema.oneOf.length > 0, "oneOf should have file type definitions");

  // Check that each oneOf item has required properties
  schema.oneOf.forEach((fileType, index) => {
    assert(
      fileType.properties !== undefined,
      `oneOf[${index}] should have properties`,
    );
    assert(
      fileType.properties.file_type !== undefined,
      `oneOf[${index}] should define file_type`,
    );
  });
});

describe("Common Fields Definition", () => {
  const { schema } = validateSchemaFile();
  const commonFields = schema.definitions.commonFields.properties;

  assert(commonFields.title !== undefined, "commonFields should include title");
  assert(
    commonFields.description !== undefined,
    "commonFields should include description",
  );
  assert(commonFields.tags !== undefined, "commonFields should include tags");
  assert(commonFields.tags.maxItems === 8, "tags should have maxItems of 8");
  assert(
    commonFields.status !== undefined,
    "commonFields should include status",
  );
  assert(
    commonFields.domain !== undefined,
    "commonFields should include domain",
  );
  assert(
    commonFields.references !== undefined,
    "commonFields should include references",
  );
});

describe("References Format", () => {
  const { schema } = validateSchemaFile();
  const references = schema.definitions.commonFields.properties.references;

  assert(references.type === "array", "references should be an array");
  assert(
    references.items.type === "object",
    "reference items should be objects",
  );
  assert(
    references.items.properties.path !== undefined,
    "reference items should have path",
  );
  assert(
    references.items.properties.description !== undefined,
    "reference items should have description",
  );
  assert(
    Array.isArray(references.items.required),
    "reference items should have required fields",
  );
  assert(
    references.items.required.includes("path"),
    "path should be required in references",
  );
  assert(
    references.items.required.includes("description"),
    "description should be required in references",
  );
});

// Summary
console.log(`\n${"═".repeat(40)}`);
console.log(`Tests passed: ${colors.green}${testsPassed}${colors.reset}`);
console.log(`Tests failed: ${colors.red}${testsFailed}${colors.reset}`);
console.log(`${"═".repeat(40)}\n`);

process.exit(testsFailed > 0 ? 1 : 0);
