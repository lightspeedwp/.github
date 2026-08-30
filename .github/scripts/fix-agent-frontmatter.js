#!/usr/bin/env node

/**
 * Fix Agent Frontmatter
 *
 * Adds missing required fields to agent specification files.
 */

import fs from "fs";
import path from "path";
import url from "url";
import * as YAML from "js-yaml";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, "../../agents");

/**
 * Parse frontmatter and content
 */
function parseMarkdown(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { yaml: null, remaining: content };

  try {
    const yaml = YAML.load(match[1]);
    const remaining = content.substring(match[0].length);
    return { yaml, remaining };
  } catch (e) {
    return { yaml: null, remaining: content };
  }
}

/**
 * Ensure required fields exist
 */
function ensureRequiredFields(frontmatter, specFileName) {
  const fileName = specFileName.replace(".agent.md", "");

  // Set defaults for missing fields
  if (!frontmatter.file_type) frontmatter.file_type = "agent";
  if (!frontmatter.version) frontmatter.version = "v1.0";
  if (!frontmatter.author) frontmatter.author = "LightSpeed Team";
  if (!frontmatter.maintainer) frontmatter.maintainer = "LightSpeed Team";
  if (!frontmatter.language) frontmatter.language = "en";

  // Set status if missing
  if (!frontmatter.status) frontmatter.status = "active";

  // Set category if missing
  if (!frontmatter.category) {
    if (fileName.includes("mode-")) {
      frontmatter.category = "mode";
    } else if (fileName.includes("project-") || fileName.includes("meta")) {
      frontmatter.category = "governance";
    } else {
      frontmatter.category = "tooling";
    }
  }

  // Handle dates
  const today = new Date().toISOString().split("T")[0];

  if (!frontmatter.created_date) {
    frontmatter.created_date = today;
  } else if (
    typeof frontmatter.created_date === "string" &&
    frontmatter.created_date.includes("T")
  ) {
    // Fix ISO format dates to YYYY-MM-DD
    frontmatter.created_date = frontmatter.created_date.split("T")[0];
  }

  if (!frontmatter.last_updated) {
    frontmatter.last_updated = today;
  } else if (
    typeof frontmatter.last_updated === "string" &&
    frontmatter.last_updated.includes("T")
  ) {
    frontmatter.last_updated = frontmatter.last_updated.split("T")[0];
  }

  // Handle name field
  if (!frontmatter.name) {
    frontmatter.name = fileName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return frontmatter;
}

/**
 * Reconstruct markdown
 */
function reconstructMarkdown(frontmatter, remaining) {
  const yamlStr = YAML.dump(frontmatter, { indent: 2, lineWidth: 1000 });
  return `---\n${yamlStr}---\n${remaining}`;
}

/**
 * Process a single file
 */
function processFile(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { yaml, remaining } = parseMarkdown(content);

    if (!yaml) {
      console.warn(`⚠️  Could not parse ${fileName}`);
      return false;
    }

    // Ensure all required fields
    const updated = ensureRequiredFields(yaml, fileName);

    // Reconstruct and save
    const newContent = reconstructMarkdown(updated, remaining);
    fs.writeFileSync(filePath, newContent, "utf8");

    console.log(`✅ Fixed ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${fileName}: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log("Fixing agent specification frontmatter...\n");

  const specFiles = fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith(".agent.md"));

  let successCount = 0;
  let failureCount = 0;

  for (const file of specFiles) {
    const filePath = path.join(AGENTS_DIR, file);
    if (processFile(filePath, file)) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`\nResults: ${successCount} fixed, ${failureCount} failed\n`);
}

main();
