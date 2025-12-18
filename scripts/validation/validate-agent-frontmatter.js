#!/usr/bin/env node
/**
 * Validates agent specification frontmatter against the canonical schema.
 * @module scripts/validation/validate-agent-frontmatter
 * @see .github/schemas/frontmatter.schema.json
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Load the unified frontmatter schema
const schemaPath = path.join(
  __dirname,
  "../../.github/schemas/frontmatter.schema.json",
);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// Compile the schema
const validate = ajv.compile(schema);

// Agent directory
const agentDir = path.join(__dirname, "../../.github/agents");
const agentFiles = fs
  .readdirSync(agentDir)
  .filter((filename) => filename.endsWith(".agent.md"))
  .sort();

// Validation results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
};

console.log("🔍 Validating Agent Frontmatter\n");
console.log("=".repeat(80));

// Validate each agent file
agentFiles.forEach((filename) => {
  const filePath = path.join(agentDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename}: File not found`);
    results.total++;
    results.failed++;
    results.errors.push({ file: filename, error: "File not found" });
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    console.log(`❌ ${filename}: No frontmatter found`);
    results.total++;
    results.failed++;
    results.errors.push({ file: filename, error: "No frontmatter found" });
    return;
  }

  try {
    const frontmatter = yaml.load(frontmatterMatch[1]);

    if (!frontmatter || frontmatter.file_type !== "agent") {
      const fileTypeLabel = frontmatter?.file_type || "unknown";
      console.log(`ℹ️  ${filename}: Skipped (file_type=${fileTypeLabel})`);
      results.skipped++;
      return;
    }

    // Validate against schema
    const valid = validate(frontmatter);

    results.total++;

    if (valid) {
      console.log(`✅ ${filename}: Valid`);
      results.passed++;
    } else {
      console.log(`❌ ${filename}: Invalid`);
      console.log("   Errors:");
      validate.errors.forEach((error) => {
        console.log(`   - ${error.instancePath} ${error.message}`);
      });
      results.failed++;
      results.errors.push({
        file: filename,
        errors: validate.errors,
      });
    }
  } catch (error) {
    console.log(`❌ ${filename}: Parse error - ${error.message}`);
    results.total++;
    results.failed++;
    results.errors.push({ file: filename, error: error.message });
  }
});

console.log("\n" + "=".repeat(80));
console.log("\n📊 Validation Summary:");
console.log(`   Total files: ${results.total}`);
console.log(`   ✅ Passed: ${results.passed}`);
console.log(`   ❌ Failed: ${results.failed}`);
console.log(`   ⏭ Skipped: ${results.skipped}`);

if (results.failed > 0) {
  console.log("\n❌ Validation failed. Please fix the errors above.");
  process.exit(1);
} else {
  console.log("\n✅ All agent files validated successfully!");
  process.exit(0);
}
