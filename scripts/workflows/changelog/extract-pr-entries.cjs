#!/usr/bin/env node

/**
 * Extract changelog entries from a PR's CHANGELOG.md changes
 *
 * Reads the PR's head CHANGELOG.md, extracts [Unreleased] section entries
 * and saves them to a temporary file for later merging.
 *
 * Outputs: has_entries (true|false), entries_file (path to temp file)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PR_HEAD_SHA = process.env.PR_HEAD_SHA;
const PR_NUMBER = process.env.PR_NUMBER;
const CHANGELOG_PATH = process.env.CHANGELOG_PATH || 'CHANGELOG.md';

try {
  // Get the PR's CHANGELOG.md content at HEAD
  let headContent = '';
  try {
    headContent = execSync(`git show ${PR_HEAD_SHA}:${CHANGELOG_PATH}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    // CHANGELOG.md may not exist at HEAD
    console.log(`ℹ️  CHANGELOG.md not found at PR HEAD (${PR_HEAD_SHA})`);
    outputResults(false, null);
    process.exit(0);
  }

  // Extract [Unreleased] section from the PR's changelog
  const unreleased = extractUnreleasedSection(headContent);

  if (!unreleased || unreleased.trim() === '') {
    console.log('ℹ️  No [Unreleased] section found in PR changelog');
    outputResults(false, null);
    process.exit(0);
  }

  // Save extracted entries to temporary file
  const tmpDir = path.join(process.cwd(), '.github', 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const tmpFile = path.join(tmpDir, `changelog-entries-${PR_NUMBER}.md`);
  fs.writeFileSync(tmpFile, unreleased, 'utf8');

  console.log(`✅ Extracted ${unreleased.split('\n').length} lines from [Unreleased] section`);
  outputResults(true, tmpFile);
} catch (err) {
  console.error(`❌ Error extracting changelog entries: ${err.message}`);
  process.exit(1);
}

/**
 * Extract [Unreleased] section content from changelog
 */
function extractUnreleasedSection(content) {
  const lines = content.split('\n');
  let inUnreleased = false;
  let entries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of [Unreleased] section
    if (line.match(/^##\s+\[Unreleased\]/)) {
      inUnreleased = true;
      continue;
    }

    // End of [Unreleased] section (next ## heading)
    if (inUnreleased && line.match(/^##\s+\[/)) {
      break;
    }

    // Collect lines within [Unreleased]
    if (inUnreleased) {
      entries.push(line);
    }
  }

  return entries.join('\n').trim();
}

/**
 * Output GitHub Actions workflow outputs
 */
function outputResults(hasEntries, entriesFile) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) {
    console.log(`has_entries=${hasEntries}`);
    if (entriesFile) {
      console.log(`entries_file=${entriesFile}`);
    }
    return;
  }

  let output = `has_entries=${hasEntries}\n`;
  if (entriesFile) {
    output += `entries_file=${entriesFile}\n`;
  }

  fs.appendFileSync(outputFile, output, 'utf8');
}
