// meta.agent.js - Applies documentation metadata (front matter, badges, human references, quirky footers) to Markdown files.
// See .github/agents/meta.agent.md for spec.

import { ensureFooter } from "./includes/header-footer.js";
import { updateBadgesInReadme } from "./includes/badges.js";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { globSync } from "glob";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load schemas and configs
function loadEmojiSchema() {
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

const emojiSchema = loadEmojiSchema();

/**
 * Check if file should skip meta application
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
 * Extract front matter from markdown file
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
 * Get category from front matter
 */
function getCategory(frontMatter) {
  if (!frontMatter) return "default";
  return frontMatter.category || frontMatter.file_type || "default";
}

/**
 * Apply emojis to H1 and H2 headings
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
 * Apply emoji to a single heading line
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
 * Apply badges to markdown content
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
 * Apply footer to markdown content
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
 * Apply references section before the footer
 */
function applyReferences(content, frontMatter) {
  // If there are references in front matter, add them before the footer
  if (
    !frontMatter ||
    !frontMatter.references ||
    frontMatter.references.length === 0
  ) {
    return content;
  }

  const referencesSection =
    "\n## References\n\n" +
    frontMatter.references.map((ref) => `- [${ref}](${ref})`).join("\n") +
    "\n";

  // Insert before the footer (look for footer patterns)
  const footerPattern =
    /\n(_Maintained with|_Built by|_Have questions|_This page brought|_Docs signed|Made with ❤️)/;
  const footerMatch = content.match(footerPattern);

  if (footerMatch) {
    const insertIndex = content.indexOf(footerMatch[0]);
    return (
      content.slice(0, insertIndex) +
      "\n---\n" +
      referencesSection +
      content.slice(insertIndex)
    );
  }

  // If no footer found, append to end
  return content + "\n---\n" + referencesSection;
}

/**
 * Apply banner image before the footer
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
 * Apply header formatting (ensure proper structure)
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
 * Update README.md file structure and formatting
 */
function updateReadmeStructure(content, filePath) {
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
 * Update file/folder indexes in README
 */
function updateReadmeIndexes(content, filePath) {
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
 * Sync workflow status badges in README
 */
function syncWorkflowBadges(content) {
  // This is handled by the applyBadges function
  // This function exists for clarity in the API
  return content;
}

/**
 * Process a single markdown file
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

    // 5. References
    content = applyReferences(content, frontMatter);

    // 6. Banner (commented out for now - needs banner assets)
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
 * Process all markdown files in the repository
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
 * Main entry point
 */
async function main() {
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
  applyReferences,
  applyBanner,
  shouldSkipMeta,
  extractFrontMatter,
  getCategory,
};
