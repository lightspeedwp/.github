#!/usr/bin/env node
/**
 * Validates agent specification frontmatter against the canonical schema.
 * @module scripts/validation/validate-agent-frontmatter
 * @see .schemas/frontmatter.schema.json
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
  "../../.schemas/frontmatter.schema.json",
);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// Compile the schema
const validate = ajv.compile(schema);

// Agent directories. Portable specs live in /agents; .github/agents remains for
// repo-local boundary notes or legacy specs during migration.
const agentDirs = [
  path.join(__dirname, "../../agents"),
  path.join(__dirname, "../../.github/agents"),
].filter((dir) => fs.existsSync(dir));

const agentFiles = agentDirs
  .flatMap((dir) =>
    fs
      .readdirSync(dir)
      .filter((filename) => filename.endsWith(".agent.md"))
      .map((filename) => ({
        filename,
        filePath: path.join(dir, filename),
        displayPath: path.relative(
          path.join(__dirname, "../.."),
          path.join(dir, filename),
        ),
      })),
  )
  .sort((a, b) => a.displayPath.localeCompare(b.displayPath));

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
agentFiles.forEach(({ filename, filePath, displayPath }) => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${displayPath}: File not found`);
    results.total++;
    results.failed++;
    results.errors.push({ file: displayPath, error: "File not found" });
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    console.log(`❌ ${displayPath}: No frontmatter found`);
    results.total++;
    results.failed++;
    results.errors.push({ file: displayPath, error: "No frontmatter found" });
    return;
  }

  try {
    const frontmatter = yaml.load(frontmatterMatch[1]);

    if (!frontmatter || frontmatter.file_type !== "agent") {
      const fileTypeLabel = frontmatter?.file_type || "unknown";
      console.log(`ℹ️  ${displayPath}: Skipped (file_type=${fileTypeLabel})`);
      results.skipped++;
      return;
    }

    // Validate against schema
    const valid = validate(frontmatter);

    results.total++;

    if (valid) {
      console.log(`✅ ${displayPath}: Valid`);
      results.passed++;
    } else {
      console.log(`❌ ${displayPath}: Invalid`);
      console.log("   Errors:");
      validate.errors.forEach((error) => {
        console.log(`   - ${error.instancePath} ${error.message}`);
      });
      results.failed++;
      results.errors.push({
        file: displayPath,
        errors: validate.errors,
      });
    }
  } catch (error) {
    console.log(`❌ ${displayPath}: Parse error - ${error.message}`);
    results.total++;
    results.failed++;
    results.errors.push({ file: displayPath, error: error.message });
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
