#!/usr/bin/env node

/**
 * Test suite for merge-entries.cjs
 * Verifies that changelog section structure is preserved during merge
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const TEST_DIR = path.join(__dirname, '../../..', '.github/tmp/merge-test');
const TEST_CHANGELOG = path.join(TEST_DIR, 'CHANGELOG.md');
const TEST_ENTRIES = path.join(TEST_DIR, 'entries.md');

let testsPassed = 0;
let testsFailed = 0;

function setupTest() {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
}

function cleanupTest() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
}

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   ${err.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Helper function to run merge-entries as a subprocess
function runMergeScript(env) {
  const result = spawnSync('node', [path.join(__dirname, 'merge-entries.cjs')], {
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

// Test 1: Preserve section headers when merging new entries
test('Preserves section headers when merging entries', () => {
  setupTest();

  const initialChangelog = `---
title: "Changelog"
---

# Changelog

## [Unreleased]

### Added

- **Feature A** — description 1

### Fixed

- **Bug B** — description 2

## [1.0.0]

- Initial release
`;

  const prEntries = `
### Added

- **Feature A** — description 1
- **Feature C** — description 3

### Fixed

- **Bug B** — description 2
- **Bug D** — description 4
`;

  fs.writeFileSync(TEST_CHANGELOG, initialChangelog, 'utf8');
  fs.writeFileSync(TEST_ENTRIES, prEntries, 'utf8');

  // Run the merge script as a subprocess
  runMergeScript({
    PR_ENTRIES: TEST_ENTRIES,
    CHANGELOG_PATH: TEST_CHANGELOG,
  });

  const result = fs.readFileSync(TEST_CHANGELOG, 'utf8');

  // Verify structure is preserved
  assert(result.includes('### Added'), 'Added section header should exist');
  assert(result.includes('### Fixed'), 'Fixed section header should exist');
  assert(result.includes('- **Feature C**'), 'New feature should be added');
  assert(result.includes('- **Bug D**'), 'New bug fix should be added');
  assert(result.includes('- **Feature A**'), 'Existing feature should still exist');
  assert(result.includes('- **Bug B**'), 'Existing bug fix should still exist');

  cleanupTest();
});

// Test 2: Deduplicate entries correctly
test('Deduplicates entries without losing existing ones', () => {
  setupTest();

  const initialChangelog = `---
title: "Changelog"
---

# Changelog

## [Unreleased]

### Added

- **Feature A** — description A
- **Feature B** — description B

## [1.0.0]

- Release
`;

  const prEntries = `
### Added

- **Feature A** — description A
- **Feature C** — description C
`;

  fs.writeFileSync(TEST_CHANGELOG, initialChangelog, 'utf8');
  fs.writeFileSync(TEST_ENTRIES, prEntries, 'utf8');

  runMergeScript({
    PR_ENTRIES: TEST_ENTRIES,
    CHANGELOG_PATH: TEST_CHANGELOG,
  });

  const result = fs.readFileSync(TEST_CHANGELOG, 'utf8');

  assert(result.includes('- **Feature A**'), 'Feature A should exist');
  assert(result.includes('- **Feature B**'), 'Feature B should be preserved');
  assert(result.includes('- **Feature C**'), 'Feature C should be added');

  cleanupTest();
});

// Test 3: Don't rewrite if entries already exist
test('Exits early if all entries already exist', () => {
  setupTest();

  const changelog = `---
title: "Changelog"
---

# Changelog

## [Unreleased]

### Added

- **Feature A** — description

## [1.0.0]

- Release
`;

  const entries = `
### Added

- **Feature A** — description
`;

  fs.writeFileSync(TEST_CHANGELOG, changelog, 'utf8');
  fs.writeFileSync(TEST_ENTRIES, entries, 'utf8');

  // Capture original mtime
  const originalMtime = fs.statSync(TEST_CHANGELOG).mtime.getTime();

  // Small delay to ensure mtime would differ if file was rewritten
  const startTime = Date.now();
  while (Date.now() - startTime < 100) {
    // Wait 100ms
  }

  runMergeScript({
    PR_ENTRIES: TEST_ENTRIES,
    CHANGELOG_PATH: TEST_CHANGELOG,
  });

  const newMtime = fs.statSync(TEST_CHANGELOG).mtime.getTime();

  assert(
    newMtime === originalMtime,
    'File should not be rewritten if no new entries',
  );

  cleanupTest();
});

console.log(`\n${testsPassed} passed, ${testsFailed} failed`);
process.exit(testsFailed > 0 ? 1 : 0);
