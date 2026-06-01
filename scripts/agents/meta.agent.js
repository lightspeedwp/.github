/**
 * Meta agent that applies metadata, badges, and category-specific footers to Markdown files.
 * Meta agent that applies metadata, badges, and category-specific footers to Markdown files.
 * @module scripts/agents/meta.agent.js
 */

import { ensureFooter } from "./includes/header-footer.js";
import { updateBadgesInReadme } from "./includes/badges.js";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { globSync } from "glob";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * The filename of the current module.
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);
/**
 * The directory name of the current module.
 * @type {string}
 */
const __dirname = dirname(__filename);

// Load schemas and configs
// TODO: Move schema and config loading to a dedicated config-loader module.
/**
 * Loads the emoji schema from the YAML file.
 * @returns {object} The loaded emoji schema or a default schema if loading fails.
 */
function loadEmojiSchema() {
  // TODO: Implement cached schema loading as noted in config-schema.js TODOs.
  const schemaPath = path.join(__dirname, "../automation/emoji.schema.yml");
  if (!fs.existsSync(schemaPath)) {
    return { apply_to: ["h1", "h2"], map: {}, skip: [] };
  }
  try {
    return yaml.load(fs.readFileSync(schemaPath, "utf-8"));
  } catch (error) {
    console.warn(
      `Failed to load emoji schema at ${schemaPath}: ${error.message}`,
    );
    return { apply_to: ["h1", "h2"], map: {}, skip: [] };
  }
}

/**
 * The loaded emoji schema configuration.
 * @type {object}
 */
const emojiSchema = loadEmojiSchema();

/**
 * Checks if a file should be skipped based on its name or content.
 * It skips formal documents, files with opt-out comments, or front matter flags.
 * @param {string} filePath - The path to the file.
 * @param {string} content - The content of the file.
 * @returns {boolean} True if the file should be skipped, false otherwise.
 */
function shouldSkipMeta(filePath, content) {
  const fileName = path.basename(filePath);

  // Skip formal documents
  const formalDocs = ["CHANGELOG.md", "CODE_OF_CONDUCT.md"];
  if (formalDocs.includes(fileName)) {
    return true;
  }

  // Check for body marker opt-out
  if (
    content.includes("<!-- meta: off -->") ||
    content.includes("<!-- branding: off -->")
  ) {
    return true;
  }

  // Check for front matter opt-out
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    try {
      const frontMatter = yaml.load(frontMatterMatch[1]);
      if (
        // TODO: Add support for 'meta: false' and 'branding: false' as aliases for consistency.
        frontMatter &&
        (frontMatter.no_meta === true || frontMatter.no_branding === true)
      ) {
        return true;
      }
    } catch (e) {
      // Continue if front matter parsing fails
    }
  }

  return false;
}

/**
 * Extracts and parses YAML front matter from a Markdown file's content.
 * @param {string} content - The content of the Markdown file.
 * @returns {object|null} The parsed front matter object, or null if not found or parsing fails.
 */
function extractFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }
  try {
    return yaml.load(match[1]);
  } catch (e) {
    console.warn("Failed to parse front matter:", e.message);
    return null;
  }
}

/**
 * Gets the category from the front matter.
 * It looks for `category` or `file_type` properties, defaulting to "default".
 * @param {object|null} frontMatter - The parsed front matter object.
 * @returns {string} The determined category.
 */
function getCategory(frontMatter) {
  if (!frontMatter) return "default";
  return frontMatter.category || frontMatter.file_type || "default";
}

/**
 * Applies emojis to H1 and H2 headings in the content based on the emoji schema.
 * @param {string} content - The Markdown content.
 * @param {string} filePath - The path to the file, used for checking skip rules.
 * @returns {string} The content with emojis applied to headings.
 */
function applyEmojis(content, filePath) {
  const fileName = path.basename(filePath);

  // Check if file is in skip list
  if (emojiSchema.skip && emojiSchema.skip.includes(fileName)) {
    return content;
  }

  // Only apply to H1 and H2
  const applyTo = emojiSchema.apply_to || ["h1", "h2"];

  let lines = content.split("\n");
  lines = lines.map((line) => {
    // Check for H1
    if (applyTo.includes("h1") && /^# [^#]/.test(line)) {
      return applyEmojiToHeading(line);
    }
    // Check for H2
    if (applyTo.includes("h2") && /^## [^#]/.test(line)) {
      return applyEmojiToHeading(line);
    }
    return line;
  });

  return lines.join("\n");
}

/**
 * Applies an emoji to a single heading line if it matches a keyword and doesn't already have one.
 * @param {string} line - The heading line (e.g., "# My Title").
 * @returns {string} The heading line with an emoji, or the original line.
 */
function applyEmojiToHeading(line) {
  // Skip if already has emoji
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
  if (emojiRegex.test(line)) {
    return line;
  }

  const lineLower = line.toLowerCase();

  // Check for keyword matches
  if (emojiSchema.map) {
    for (const [keyword, emoji] of Object.entries(emojiSchema.map)) {
      if (lineLower.includes(keyword.toLowerCase())) {
        // Insert emoji after the # symbols
        return line.replace(/^(#{1,2})\s+/, `$1 ${emoji} `);
      }
    }
  }

  // No keyword match, no emoji (conservative approach)
  return line;
}

/**
 * Applies workflow status badges to the Markdown content.
 * @param {string} filePath - The path to the file being processed.
 * @param {string} content - The original content of the file.
 * @param {object|null} frontMatter - The parsed front matter.
 * @returns {Promise<string>} The updated content with badges.
 */
async function applyBadges(filePath, content, frontMatter) {
  const repo = process.env.GITHUB_REPOSITORY || "lightspeedwp/.github";
  const branch = process.env.GITHUB_REF_NAME || "develop";

  try {
    await updateBadgesInReadme(filePath, ".github/workflows", {
      backup: false, // Backup handled at file level
      repo,
      branch,
      format: "stacked",
      frontMatter,
    });
    return fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    console.warn(`Failed to apply badges to ${filePath}:`, e.message);
    return content;
  }
}

/**
 * Applies a category-specific footer to the Markdown content.
 * @param {string} filePath - The path to the file being processed.
 * @param {string} content - The original content of the file.
 * @param {object|null} frontMatter - The parsed front matter.
 * @returns {string} The updated content with the footer.
 */
function applyFooter(filePath, content, frontMatter) {
  const category = getCategory(frontMatter);
  const seed = filePath; // Use file path as seed for deterministic selection

  try {
    ensureFooter(filePath, { category, seed, backup: false });
    return fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    console.warn(`Failed to apply footer to ${filePath}:`, e.message);
    return content;
  }
}

/**
 * Inserts a banner image before the footer section.
 * @param {string} content - The Markdown content.
 * @returns {string} The content with the banner added.
 */
function applyBanner(content) {
  const bannerPath = "assets/banners/work-with-us.png";
  const bannerMarkdown = `\n![Work with LightSpeed](../${bannerPath})\n`;

  // Check if banner already exists
  if (
    content.includes(bannerPath) ||
    content.includes("Work with LightSpeed")
  ) {
    return content;
  }

  // Insert before the footer
  const footerPattern =
    /\n(_Maintained with|_Built by|_Have questions|_This page brought|_Docs signed|Made with ❤️)/;
  const footerMatch = content.match(footerPattern);

  if (footerMatch) {
    const insertIndex = content.indexOf(footerMatch[0]);
    return (
      content.slice(0, insertIndex) +
      "\n---\n" +
      bannerMarkdown +
      "---\n" +
      content.slice(insertIndex)
    );
  }

  // If no footer found, append to end
  return content + "\n---\n" + bannerMarkdown + "---\n";
}

/**
 * Ensures proper header formatting, like a blank line between the H1 and badge block.
 * @param {string} content - The Markdown content.
 * @returns {string} The formatted content.
 */
function applyHeader(content) {
  // Ensure there's a blank line after the title and before badges
  const lines = content.split("\n");
  const titleIndex = lines.findIndex((line) => /^# [^#]/.test(line));

  if (titleIndex === -1) return content;

  // Check if there's a badge block after title
  const badgeStartIndex = lines.findIndex((line) =>
    line.includes("<!-- BADGES-START -->"),
  );

  if (badgeStartIndex > titleIndex && badgeStartIndex - titleIndex === 1) {
    // Insert blank line between title and badges
    lines.splice(titleIndex + 1, 0, "");
    return lines.join("\n");
  }

  return content;
}

/**
 * Updates the structure and formatting of a README.md file.
 * @param {string} content - The content of the README file.
 * @param {string} filePath - The path to the README file.
 * @returns {string} The updated README content.
 */
function updateReadmeStructure(content, filePath) {
  // TODO: Implement logic to ensure required sections (Overview, Features, etc.) exist in the root README.md.
  // Ensure proper heading hierarchy
  let lines = content.split("\n");

  // Check for required sections in repository root README
  const fileName = path.basename(filePath);
  if (fileName === "README.md" && path.dirname(filePath) === process.cwd()) {
    // Root README should have standard sections
    const requiredSections = [
      "## Overview",
      "## Features",
      "## Installation",
      "## Usage",
      "## Contributing",
      "## License",
    ];

    // This is a placeholder - full implementation would ensure these sections exist
    // For now, we just return the content
  }

  return content;
}

/**
 * Updates the file index within a README.md file.
 * It looks for `<!-- FILE-INDEX-START -->` and `<!-- FILE-INDEX-END -->` markers.
 * @param {string} content - The content of the README file.
 * @param {string} filePath - The path to the README file.
 * @returns {string} The content with an updated file index.
 */
function updateReadmeIndexes(content, filePath) {
  // TODO: Add support for indexing directories in addition to files.
  // Check if README contains a file index marker
  if (!content.includes("<!-- FILE-INDEX-START -->")) {
    return content;
  }

  // Get directory of this README
  const dir = path.dirname(filePath);

  // List files in directory
  const files = fs.readdirSync(dir).filter((f) => {
    const fullPath = path.join(dir, f);
    return fs.statSync(fullPath).isFile() && f !== "README.md";
  });

  // Generate file index
  const fileIndex = files
    .map((f) => {
      const ext = path.extname(f);
      const name = path.basename(f, ext);
      return `- [${name}](${f})`;
    })
    .join("\n");

  // Replace between markers
  const pattern = /<!-- FILE-INDEX-START -->[\s\S]*?<!-- FILE-INDEX-END -->/;
  const replacement = `<!-- FILE-INDEX-START -->\n${fileIndex}\n<!-- FILE-INDEX-END -->`;

  return content.replace(pattern, replacement);
}

/**
 * A placeholder function for clarifying the badge update process.
 * The actual logic is handled by `applyBadges`.
 * @param {string} content - The Markdown content.
 * @returns {string} The original content.
 */
function syncWorkflowBadges(content) {
  // This is handled by the applyBadges function
  // This function exists for clarity in the API
  return content;
}

/**
 * Processes a single Markdown file to apply all meta updates.
 * @param {string} filePath - The path to the Markdown file.
 * @param {object} [options={}] - Processing options.
 * @param {boolean} [options.dryRun=false] - If true, no files are written.
 * @param {boolean} [options.verbose=false] - If true, logs detailed processing steps.
 * @returns {Promise<object>} A result object for the processed file.
 */
async function processMarkdownFile(filePath, options = {}) {
  const { dryRun = false, verbose = false } = options;

  if (verbose) {
    console.log(`Processing: ${filePath}`);
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let originalContent = content;

  // Check if should skip meta application
  if (shouldSkipMeta(filePath, content)) {
    if (verbose) {
      console.log(`  Skipped (opt-out or formal doc)`);
    }
    return { file: filePath, skipped: true, changed: false };
  }

  // Extract front matter
  const frontMatter = extractFrontMatter(content);

  // Create backup
  if (!dryRun) {
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, content);
  }

  try {
    // Apply metadata elements in order
    // 1. Header formatting
    content = applyHeader(content);

    // 2. README-specific updates
    const fileName = path.basename(filePath);
    if (fileName === "README.md") {
      content = updateReadmeStructure(content, filePath);
      content = updateReadmeIndexes(content, filePath);
      content = syncWorkflowBadges(content);
    }

    // 3. Badges (writes to file)
    content = await applyBadges(filePath, content, frontMatter);

    // 4. Emojis
    content = applyEmojis(content, filePath);

    // TODO: Enable banner application once banner assets are available.
    // content = applyBanner(content);

    // 7. Footer (writes to file)
    content = applyFooter(filePath, content, frontMatter);

    // Write final content
    if (!dryRun && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      if (verbose) {
        console.log(`  ✓ Updated`);
      }
      return { file: filePath, skipped: false, changed: true };
    } else {
      if (verbose) {
        console.log(`  No changes needed`);
      }
      return { file: filePath, skipped: false, changed: false };
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    // Restore from backup on error
    if (!dryRun && fs.existsSync(`${filePath}.backup`)) {
      fs.copyFileSync(`${filePath}.backup`, filePath);
    }
    return {
      file: filePath,
      skipped: false,
      changed: false,
      error: error.message,
    };
  } finally {
    // Clean up backup
    if (!dryRun && fs.existsSync(`${filePath}.backup`)) {
      fs.unlinkSync(`${filePath}.backup`);
    }
  }
}

/**
 * Finds and processes all Markdown files in the repository.
 * @param {object} [options={}] - Processing options, passed to `processMarkdownFile`.
 * @param {string} [options.pattern] - Glob pattern used to find Markdown files.
 * @returns {Promise<object>} A summary object of the results.
 */
async function processAllMarkdownFiles(options = {}) {
  const { pattern = "**/*.md" } = options;

  const files = globSync(pattern, {
    cwd: process.cwd(),
    ignore: ["node_modules/**", ".git/**", "**/node_modules/**"],
  });

  const results = {
    total: files.length,
    processed: 0,
    skipped: 0,
    changed: 0,
    errors: 0,
    files: [],
  };

  for (const file of files) {
    const result = await processMarkdownFile(file, options);
    results.files.push(result);

    if (result.skipped) {
      results.skipped++;
    } else {
      results.processed++;
      if (result.changed) {
        results.changed++;
      }
      if (result.error) {
        results.errors++;
      }
    }
  }

  return results;
}

/**
 * Main entry point for the meta agent script. Parses CLI args and runs the processor.
 */
async function main() {
  // TODO: Implement a more robust CLI argument parser (e.g., yargs, commander) to automatically handle help text generation and flag synchronization.
  const verbose =
    process.argv.includes("--verbose") || process.argv.includes("-v");
  const dryRun = process.argv.includes("--dry-run");

  console.log("Meta Agent - Starting...");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("");

  const results = await processAllMarkdownFiles({ verbose, dryRun });

  console.log("\nMeta Agent - Summary:");
  console.log(`  Total files: ${results.total}`);
  console.log(`  Processed: ${results.processed}`);
  console.log(`  Skipped: ${results.skipped}`);
  console.log(`  Changed: ${results.changed}`);
  console.log(`  Errors: ${results.errors}`);

  // Write metrics
  // TODO: Add log rotation/environment overrides for the logger as per logger TODOs.
  const metricsPath = path.join(
    process.cwd(),
    ".github/metrics/meta-metrics.json",
  );
  const metrics = {
    ts: new Date().toISOString(),
    coverage:
      results.total > 0
        ? Math.round((results.processed / results.total) * 100)
        : 0,
    changes: results.changed,
    errors: results.errors,
    optouts: results.skipped,
  };

  fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));

  if (results.errors > 0) {
    process.exit(1);
  }
}

// Run if called directly
if (
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])
) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

export {
  processMarkdownFile,
  processAllMarkdownFiles,
  applyHeader,
  applyBadges,
  applyFooter,
  applyEmojis,
  applyBanner,
  shouldSkipMeta,
  extractFrontMatter,
  getCategory,
};
