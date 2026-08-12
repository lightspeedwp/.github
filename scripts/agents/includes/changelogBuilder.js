#!/usr/bin/env node
/**
 * ============================================================================
 * Module: changelogBuilder.js
 * Location: scripts/agents/includes/changelogBuilder.js
 * Description:
 *   - Builds and inserts changelog entries
 *   - Manages entry formatting and deduplication
 *   - Handles insertion into Keep a Changelog format
 * Standards:
 *   - Follows LightSpeed Coding Standards
 * ============================================================================
 */

const fs = require("fs");
const categoryMapper = require("./categoryMapper");

/**
 * Format a changelog entry
 * @param {Object} entry - Entry object with description, commit, author, pr, scope
 * @returns {string} Formatted changelog entry line
 */
function formatEntry(entry) {
  let line = `- ${entry.description}`;

  // Add scope if present
  if (entry.scope) {
    line = `- **${entry.scope}:** ${entry.description}`;
  }

  // Add commit reference if present
  if (entry.commit) {
    line += ` ([${entry.commit.substring(0, 7)}](https://github.com/lightspeedwp/.github/commit/${entry.commit}))`;
  }

  // Add PR reference if present
  if (entry.pr) {
    line += ` (#${entry.pr})`;
  }

  // Add author if present
  if (entry.author) {
    line += ` @${entry.author}`;
  }

  return line;
}

/**
 * Normalize entry for deduplication
 * @param {string} description - Entry description
 * @returns {string} Normalized description
 */
function normalizeForComparison(description) {
  return description.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Check if entry is duplicate
 * @param {string} newDescription - New entry description
 * @param {string[]} existingEntries - Existing entry descriptions
 * @returns {boolean} True if duplicate found
 */
function isDuplicate(newDescription, existingEntries) {
  const normalized = normalizeForComparison(newDescription);

  return existingEntries.some((entry) => {
    const existingNormalized = normalizeForComparison(entry);
    return existingNormalized === normalized;
  });
}

/**
 * Build section content from entries
 * @param {Object[]} entries - Array of entry objects
 * @returns {string} Formatted section content
 */
function buildSectionContent(entries) {
  const seenDescriptions = new Set();
  const deduplicatedEntries = [];

  // Deduplicate entries
  entries.forEach((entry) => {
    const normalized = normalizeForComparison(entry.description);
    if (!seenDescriptions.has(normalized)) {
      seenDescriptions.add(normalized);
      deduplicatedEntries.push(entry);
    }
  });

  // Format entries
  return deduplicatedEntries.map(formatEntry).join("\n");
}

/**
 * Insert entries into changelog
 * @param {string} changelogPath - Path to CHANGELOG.md
 * @param {Object} entriesBySection - Object with section names as keys and entry arrays as values
 * @returns {string} Updated changelog content
 */
function insertEntries(changelogPath, entriesBySection) {
  const content = fs.readFileSync(changelogPath, "utf8");
  const lines = content.split("\n");

  // Find or create Unreleased section
  let unreleasedIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^## \[Unreleased\]/)) {
      unreleasedIndex = i;
      break;
    }
  }

  if (unreleasedIndex === -1) {
    // Add Unreleased section at the beginning
    const foundIndex = lines.findIndex((line) => line.match(/^## \[/));
    const insertionPoint = foundIndex !== -1 ? foundIndex : 2;
    lines.splice(insertionPoint, 0, "## [Unreleased]\n");
    unreleasedIndex = insertionPoint;
  }

  // Build updated sections
  const sectionMap = new Map();

  // First pass: collect existing entries for deduplication
  for (let i = unreleasedIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop at next version header
    if (line.match(/^## \[/)) {
      break;
    }

    // Check for section headers
    const sectionMatch = line.match(/^### (.+)$/);
    if (sectionMatch) {
      const sectionName = sectionMatch[1].toLowerCase();
      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, {
          headerIndex: i,
          entries: [],
        });
      }
    }
  }

  // Collect existing entries
  const existingEntriesBySection = new Map();
  let currentSection = null;

  for (let i = unreleasedIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^## \[/)) {
      break;
    }

    const sectionMatch = line.match(/^### (.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].toLowerCase();
      if (!existingEntriesBySection.has(currentSection)) {
        existingEntriesBySection.set(currentSection, []);
      }
    } else if (
      currentSection &&
      (line.startsWith("- ") || line.startsWith("* "))
    ) {
      const description = line.replace(/^[-*]\s*/, "").trim();
      existingEntriesBySection.get(currentSection).push(description);
    }
  }

  // Build new content
  let insertIndex = unreleasedIndex + 1;
  const sectionsToAdd = Object.keys(entriesBySection);

  sectionsToAdd.forEach((section) => {
    const entries = entriesBySection[section];
    const sectionKey = section.toLowerCase();

    // Filter out duplicates
    const newEntries = entries.filter((entry) => {
      const existingForSection = existingEntriesBySection.get(sectionKey) || [];
      return !isDuplicate(entry.description, existingForSection);
    });

    if (newEntries.length === 0) {
      return; // Skip section if no new entries
    }

    // Find or create section header
    let sectionIndex = -1;
    for (let i = insertIndex; i < lines.length; i++) {
      if (lines[i].match(/^## \[/)) {
        break;
      }
      if (
        lines[i] ===
          `### ${categoryMapper.getAllSections()[categoryMapper.getAllSections().indexOf(sectionKey)]}` ||
        lines[i].match(new RegExp(`^### ${sectionKey}`, "i"))
      ) {
        sectionIndex = i;
        break;
      }
    }

    const formattedContent = buildSectionContent(newEntries);

    if (sectionIndex === -1) {
      // Add new section
      const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
      lines.splice(
        insertIndex,
        0,
        `\n### ${sectionTitle}\n\n${formattedContent}\n`,
      );
      insertIndex += 4;
    } else {
      // Append to existing section
      // Find the next section or version header
      let nextIndex = sectionIndex + 1;
      while (nextIndex < lines.length && !lines[nextIndex].match(/^###|^## /)) {
        nextIndex++;
      }

      lines.splice(nextIndex, 0, `${formattedContent}\n`);
    }
  });

  return lines.join("\n");
}

/**
 * Update CHANGELOG.md file
 * @param {string} changelogPath - Path to CHANGELOG.md
 * @param {Object} entriesBySection - Entries organized by section
 */
function updateChangelog(changelogPath, entriesBySection) {
  const updatedContent = insertEntries(changelogPath, entriesBySection);
  fs.writeFileSync(changelogPath, updatedContent, "utf8");
}

module.exports = {
  formatEntry,
  normalizeForComparison,
  isDuplicate,
  buildSectionContent,
  insertEntries,
  updateChangelog,
};
