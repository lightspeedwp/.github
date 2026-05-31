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

  // Filter and deduplicate entries
  const deduplicatedEntries = deduplicateEntries(
    entries,
    mainLines.slice(insertIdx),
  );

  if (deduplicatedEntries.length === 0) {
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

  // Write merged changelog
  fs.writeFileSync(CHANGELOG_PATH, newLines.join('\n'), 'utf8');

  console.log(
    `✅ Merged ${deduplicatedEntries.length} entries into [Unreleased] section`,
  );
  process.exit(0);
} catch (err) {
  console.error(`❌ Error merging changelog entries: ${err.message}`);
  process.exit(1);
}

/**
 * Deduplicate entries against existing changelog content
 * Returns only new entries not already in the main changelog
 */
function deduplicateEntries(prEntries, existingContent) {
  const existingText = existingContent.join('\n');
  const newEntries = [];

  for (const entry of prEntries) {
    // Skip empty lines and section headers
    if (!entry.trim() || entry.match(/^###\s+/)) {
      continue;
    }

    // Check if entry already exists (compare content, not formatting)
    const entryKey = normalizeEntryForComparison(entry);
    if (entryKey && !existingText.includes(entryKey)) {
      newEntries.push(entry);
    }
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
    const description = match[2].split('\s+\(#\d+\)')[0]; // remove issue refs
    return `${title}|${description}`.toLowerCase();
  }

  // Fallback: use the entry as-is
  return entry.toLowerCase().replace(/\s+/g, ' ');
}
