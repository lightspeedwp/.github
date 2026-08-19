#!/usr/bin/env node

/**
 * Validate frontmatter on changed files only (git diff-based).
 * Used by CI to validate frontmatter freshness on PR files.
 *
 * @module scripts/validation/validate-frontmatter-changed
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const CONFIG = {
  schemaPath: path.join(__dirname, "../../schemas/frontmatter.schema.json"),
  rootDir: path.join(__dirname, "../.."),
};

/**
 * Get changed files from git diff
 */
function getChangedFiles(baseSha, headSha) {
  const { execSync } = require("child_process");
  try {
    const output = execSync(`git diff --name-only ${baseSha} ${headSha}`, {
      encoding: "utf-8",
    });
    return output
      .trim()
      .split("\n")
      .filter((f) => f && /\.(md|yml|yaml)$/.test(f));
  } catch (error) {
    console.error("Failed to get changed files:", error.message);
    return [];
  }
}

/**
 * Extract frontmatter from file content
 */
function extractFrontmatter(content, filePath) {
  const yamlFrontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(yamlFrontmatterRegex);

  if (!match) {
    return { frontmatter: null, hasYamlBlock: false };
  }

  try {
    const frontmatter = yaml.load(match[1]);
    return { frontmatter, hasYamlBlock: true };
  } catch (error) {
    throw new Error(
      `Invalid YAML frontmatter in ${filePath}: ${error.message}`,
    );
  }
}

/**
 * Validate frontmatter against schema
 */
function validateFrontmatter(files) {
  const schemaContent = fs.readFileSync(CONFIG.schemaPath, "utf8");
  const schema = JSON.parse(schemaContent);

  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false,
  });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  let hasErrors = false;

  files.forEach((file) => {
    // Skip deleted files
    if (!fs.existsSync(file)) {
      return;
    }

    try {
      const content = fs.readFileSync(file, "utf8");
      const { frontmatter, hasYamlBlock } = extractFrontmatter(content, file);

      if (!hasYamlBlock) {
        console.warn(`[WARN] No frontmatter in ${file}`);
        return;
      }

      const isValid = validate(frontmatter);
      if (!isValid) {
        console.error(`[ERROR] Invalid frontmatter in ${file}`);
        console.error(JSON.stringify(validate.errors, null, 2));
        hasErrors = true;
      } else {
        console.log(`[OK] Valid frontmatter: ${file}`);
      }
    } catch (error) {
      console.error(`[ERROR] ${file}: ${error.message}`);
      hasErrors = true;
    }
  });

  return !hasErrors;
}

// Main execution
const baseSha = process.argv[2] || process.env.BASE_SHA || "HEAD~1";
const headSha = process.argv[3] || process.env.HEAD_SHA || "HEAD";

const changedFiles = getChangedFiles(baseSha, headSha);

if (changedFiles.length === 0) {
  console.log("No markdown or YAML files changed");
  process.exit(0);
}

console.log(`Validating frontmatter in ${changedFiles.length} file(s)...`);
const success = validateFrontmatter(changedFiles);

process.exit(success ? 0 : 1);
