#!/usr/bin/env node

/**
 * Automatically fix CHANGELOG formatting issues
 * - Adds bold titles where missing
 * - Converts hyphens to em-dashes
 * - Validates entry format
 */

const fs = require("fs");
const path = require("path");

class ChangelogFormatter {
  /**
   * Fix a single changelog entry
   */
  fixEntry(entry) {
    // Skip if already properly formatted (has **bold**)
    if (/^- \*\*.+\*\* —/.test(entry)) {
      return entry;
    }

    // Extract the entry text after the bullet
    let text = entry.replace(/^- /, "");

    // Check for description separator pattern
    const hyphenMatch = text.match(/^(.+?)\s+-\s+(.+)$/);
    const dashMatch = text.match(/^(.+?)\s+—\s+(.+)$/);
    const bracketMatch = text.match(/^(.+?)\s+\(/);

    let title, rest;

    if (hyphenMatch) {
      // Found hyphen separator
      title = hyphenMatch[1].trim();
      rest = hyphenMatch[2].trim();
    } else if (dashMatch) {
      // Found em-dash separator
      title = dashMatch[1].trim();
      rest = dashMatch[2].trim();
    } else if (bracketMatch) {
      // Found bracket (just has PR link, no description)
      title = bracketMatch[1].trim();
      rest = text.substring(title.length).trim();
    } else {
      // Can't parse, return as-is
      console.warn(`Could not parse: ${entry.substring(0, 60)}...`);
      return entry;
    }

    // Remove leading "fix: " or "feat: " or similar prefixes
    title = title.replace(
      /^(feat|fix|docs|chore|refactor|test|ci|perf|build|revert|style|security):\s*/i,
      "",
    );

    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Build properly formatted entry
    return `- **${title}** — ${rest}`;
  }

  /**
   * Fix entire CHANGELOG file
   */
  fixFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const fixed = [];

    let inUnreleased = false;

    lines.forEach((line, idx) => {
      // Track if we're in [Unreleased] section
      if (line.includes("## [Unreleased]")) {
        inUnreleased = true;
      } else if (line.match(/^## \[/)) {
        inUnreleased = false;
      }

      // Fix entries in [Unreleased] only
      if (inUnreleased && line.startsWith("- ") && !line.startsWith("- ###")) {
        const fixed_line = this.fixEntry(line);
        fixed.push(fixed_line);
        if (fixed_line !== line) {
          console.log(`✓ Fixed line ${idx + 1}`);
        }
      } else {
        fixed.push(line);
      }
    });

    return fixed.join("\n");
  }
}

// Main
if (require.main === module) {
  const changelogPath = path.join(__dirname, "../../CHANGELOG.md");
  const formatter = new ChangelogFormatter();

  console.log("Fixing CHANGELOG.md formatting...\n");
  const fixed = formatter.fixFile(changelogPath);

  fs.writeFileSync(changelogPath, fixed, "utf8");
  console.log("\n✅ CHANGELOG.md formatted successfully");
}

module.exports = ChangelogFormatter;
