#!/usr/bin/env node

/**
 * Merge extracted changelog entries into main CHANGELOG.md
 *
 * Reads the extracted entries from PR and merges them into the main
 * CHANGELOG.md [Unreleased] section, ensuring proper structure and
 * avoiding duplicates.
 */

const fs = require('fs');
const path = require('path');

const PR_ENTRIES_FILE = process.env.PR_ENTRIES;
const CHANGELOG_PATH = process.env.CHANGELOG_PATH || 'CHANGELOG.md';

if (!PR_ENTRIES_FILE) {
  console.error('❌ PR_ENTRIES environment variable not set');
  process.exit(1);
}

if (!fs.existsSync(PR_ENTRIES_FILE)) {
  console.error(`❌ Entries file not found: ${PR_ENTRIES_FILE}`);
  process.exit(1);
}

try {
  // Read the main changelog
  const mainContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const mainLines = mainContent.split('\n');

  // Read extracted entries
  const entries = fs.readFileSync(PR_ENTRIES_FILE, 'utf8').split('\n');

  // Find [Unreleased] section and insert entries after heading
  let unreleaseLineIdx = -1;
  for (let i = 0; i < mainLines.length; i++) {
    if (mainLines[i].match(/^##\s+\[Unreleased\]/)) {
      unreleaseLineIdx = i;
      break;
    }
  }

  if (unreleaseLineIdx === -1) {
    console.error('❌ [Unreleased] section not found in main CHANGELOG.md');
    process.exit(1);
  }

  // Find insertion point (after [Unreleased] heading, skip blank lines)
  let insertIdx = unreleaseLineIdx + 1;
  while (insertIdx < mainLines.length && mainLines[insertIdx].trim() === '') {
    insertIdx++;
  }

  // Find the end of the [Unreleased] section (next ## heading)
  // Default to end of file if [Unreleased] is the final section
  let unreleasedEndIdx = mainLines.length;
  for (let i = insertIdx; i < mainLines.length; i++) {
    if (mainLines[i].match(/^##\s+\[/)) {
      unreleasedEndIdx = i;
      break;
    }
  }

  // Filter and deduplicate entries against only the [Unreleased] section
  const deduplicatedEntries = deduplicateEntries(
    entries,
    mainLines.slice(insertIdx, unreleasedEndIdx),
  );

  // Count actual new list items (not headers or whitespace)
  const newItems = deduplicatedEntries.filter(
    line => line.trim() && !line.match(/^###\s+/),
  );

  if (newItems.length === 0) {
    console.log('ℹ️  All entries already exist in main changelog, nothing to merge');
    process.exit(0);
  }

  // Insert deduplicated entries
  const newLines = [
    ...mainLines.slice(0, insertIdx),
    ...deduplicatedEntries,
    '',
    ...mainLines.slice(insertIdx),
  ];

  // Verify the file actually changed before writing
  const newContent = newLines.join('\n');
  const originalContent = mainContent;

  if (newContent === originalContent) {
    console.log('ℹ️  No changes to write, changelog is already up-to-date');
    process.exit(0);
  }

  // Write merged changelog
  fs.writeFileSync(CHANGELOG_PATH, newContent, 'utf8');

  console.log(
    `✅ Merged ${newItems.length} new items into [Unreleased] section`,
  );
  process.exit(0);
} catch (err) {
  console.error(`❌ Error merging changelog entries: ${err.message}`);
  process.exit(1);
}

/**
 * Deduplicate entries against existing changelog content
 * Preserves section structure (headers) while filtering duplicate list items
 * Returns only new entries not already in the main changelog
 */
function deduplicateEntries(prEntries, existingContent) {
  const normalizedExisting = new Set(
    existingContent
      .map(line => normalizeEntryForComparison(line))
      .filter(Boolean)
  );
  const newEntries = [];

  for (const entry of prEntries) {
    const trimmed = entry.trim();

    // Preserve section headers (### Added, ### Fixed, etc.)
    // Only add if it's not already in the existing content
    if (trimmed.match(/^###\s+/)) {
      const headerKey = normalizeEntryForComparison(entry);
      if (headerKey && !normalizedExisting.has(headerKey)) {
        newEntries.push(entry);
      }
      continue;
    }

    // Skip empty lines
    if (!trimmed) {
      newEntries.push(entry);
      continue;
    }

    // Check if this list item already exists
    const entryKey = normalizeEntryForComparison(entry);
    if (entryKey && !normalizedExisting.has(entryKey)) {
      newEntries.push(entry);
    }
    // Skip entries that already exist (no need to re-add them)
  }

  // Clean up trailing empty lines but preserve structure
  while (newEntries.length > 0 && !newEntries[newEntries.length - 1].trim()) {
    newEntries.pop();
  }

  return newEntries;
}

/**
 * Normalize entry text for comparison (remove formatting variations)
 */
function normalizeEntryForComparison(entry) {
  if (!entry.trim()) return '';

  // For list items, extract the core content (remove markdown formatting)
  const match = entry.match(/^-\s+\*\*(.*?)\*\*\s+—\s+(.*)/);
  if (match) {
    const title = match[1];
    const description = match[2].split(/\s+\((?:PR|Issue|#)\s*#?\d+\)/i)[0]; // remove issue/PR refs
    return `${title}|${description}`.toLowerCase();
  }

  // For section headers, return as-is (they're structural)
  if (entry.match(/^###\s+/)) {
    return entry.toLowerCase();
  }

  // Fallback: use the entry as-is for other content
  return entry.toLowerCase().replace(/\s+/g, ' ');
}
