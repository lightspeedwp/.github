#!/usr/bin/env node

/**
 * Validate frontmatter on changed files only
 * Validates only markdown and YAML files that were changed between base and head refs
 *
 * @module scripts/validation/validate-frontmatter-changed
 */

const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

// Parse command line arguments
const args = process.argv.slice(2);
let baseRef = "HEAD~1";
let headRef = "HEAD";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--base" && i + 1 < args.length) {
    baseRef = args[i + 1];
    i++;
  } else if (args[i] === "--head" && i + 1 < args.length) {
    headRef = args[i + 1];
    i++;
  }
}

// Get schema
const schemaPath = path.join(__dirname, "../../schemas/frontmatter.schema.json");
let schema;
try {
  schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
} catch (error) {
  console.error(`❌ Failed to load schema: ${error.message}`);
  process.exit(1);
}

// Set up AJV validator
const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

// Get changed files
let changedFiles = [];
try {
  const output = execFileSync("git", [
    "diff",
    "--name-only",
    baseRef,
    headRef,
  ]);

  changedFiles = output
    .toString()
    .split("\n")
    .filter((f) => f.trim())
    .filter(
      (f) =>
        f.endsWith(".md") ||
        f.endsWith(".yml") ||
        f.endsWith(".yaml")
    );
} catch (error) {
  console.error(`❌ Failed to get changed files: ${error.message}`);
  process.exit(1);
}

if (changedFiles.length === 0) {
  console.log("✓ No markdown or YAML files changed");
  process.exit(0);
}

console.log(`Validating frontmatter in ${changedFiles.length} changed file(s)...`);

// Validate each changed file
let errors = 0;
const validationResults = [];

for (const file of changedFiles) {
  // Skip deleted files (they won't exist in the working tree)
  if (!fs.existsSync(file)) {
    console.log(`⊘ ${file} (deleted)`);
    continue;
  }

  try {
    const content = fs.readFileSync(file, "utf8");

    // Extract frontmatter
    let frontmatter = null;
    if (content.startsWith("---")) {
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        try {
          frontmatter = yaml.load(match[1]);
        } catch (parseError) {
          console.error(`❌ ${file}: Invalid YAML frontmatter`);
          console.error(`   ${parseError.message}`);
          errors++;
          continue;
        }
      }
    }

    // Validate frontmatter against schema
    if (frontmatter) {
      if (!validate(frontmatter)) {
        console.error(`❌ ${file}: Invalid frontmatter`);
        validate.errors.forEach((error) => {
          console.error(`   ${error.dataPath || "."} ${error.message}`);
        });
        errors++;
      } else {
        console.log(`✓ ${file}`);
      }
    } else {
      console.log(`✓ ${file} (no frontmatter)`);
    }
  } catch (error) {
    console.error(`❌ ${file}: ${error.message}`);
    errors++;
  }
}

// Summary
console.log("");
if (errors === 0) {
  console.log(`✓ All frontmatter valid (${changedFiles.length} file(s))`);
  process.exit(0);
} else {
  console.error(`❌ ${errors} validation error(s) found`);
  process.exit(1);
}
