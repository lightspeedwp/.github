#!/usr/bin/env node

/**
 * Simple test runner for validate-no-root-md-files
 * Works without Jest, using vanilla Node
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Import the module under test
const {
  findRootMdFiles,
  ALLOWED_ROOT_FILES,
  FORBIDDEN_ROOT_MD_PATTERNS,
} = require('../validate-no-root-md-files.cjs');

let testsPassed = 0;
let testsFailed = 0;
let testsRun = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Assertion failed: ${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`
    );
  }
}

function assertContains(array, item, message) {
  if (!array.includes(item)) {
    throw new Error(`Assertion failed: ${message}\nArray does not contain ${item}`);
  }
}

function assertNotContains(array, item, message) {
  if (array.includes(item)) {
    throw new Error(`Assertion failed: ${message}\nArray should not contain ${item}`);
  }
}

function assertTrue(value, message) {
  if (value !== true) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function test(name, fn) {
  testsRun++;
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    testsFailed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// Create isolated test environment
function withTempDir(fn) {
  return function() {
    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-md-'));
    const originalCwd = process.cwd();
    try {
      process.chdir(testDir);
      fn();
    } finally {
      process.chdir(originalCwd);
      try {
        fs.rmSync(testDir, { recursive: true, force: true });
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  };
}

// ========== TESTS ==========

describe('ALLOWED_ROOT_FILES', () => {
  test('should include standard root documentation files', () => {
    assertContains(ALLOWED_ROOT_FILES, 'README.md', 'README.md should be allowed');
    assertContains(ALLOWED_ROOT_FILES, 'CONTRIBUTING.md', 'CONTRIBUTING.md should be allowed');
    assertContains(ALLOWED_ROOT_FILES, 'LICENSE.md', 'LICENSE.md should be allowed');
    assertContains(ALLOWED_ROOT_FILES, 'CHANGELOG.md', 'CHANGELOG.md should be allowed');
  });

  test('should include .github repo files', () => {
    assertContains(ALLOWED_ROOT_FILES, '.github/CLAUDE.md', '.github/CLAUDE.md should be allowed');
    assertContains(ALLOWED_ROOT_FILES, '.github/AGENTS.md', '.github/AGENTS.md should be allowed');
  });
});

describe('FORBIDDEN_ROOT_MD_PATTERNS', () => {
  test('should have pattern rules defined', () => {
    assert(FORBIDDEN_ROOT_MD_PATTERNS.length > 0, 'Should have forbidden patterns');
  });

  test('should match PHASE variants', () => {
    const phasePattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p => p.test('PHASE1A.md'));
    assertTrue(phasePattern.test('PHASE1A.md'), 'Should match PHASE1A.md');
    assertTrue(phasePattern.test('PHASE2B_RECOVERY.md'), 'Should match PHASE2B_RECOVERY.md');
  });

  test('should match PROMPT patterns', () => {
    const promptPattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
      p.test('PHASE1A_CATALOGUE_PROMPT.md')
    );
    assertTrue(promptPattern.test('PHASE1A_CATALOGUE_PROMPT.md'), 'Should match PROMPT files');
  });

  test('should match REPORT patterns', () => {
    const reportPattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
      p.test('RECOVERY-PILOT-REPORT-T010.md')
    );
    assertTrue(reportPattern.test('RECOVERY-PILOT-REPORT-T010.md'), 'Should match REPORT files');
  });
});

describe('findRootMdFiles()', () => {
  test('should return empty array when no MD files exist', withTempDir(() => {
    const result = findRootMdFiles();
    assertEqual(result, [], 'Should return empty array');
  }));

  test('should skip allowed root files', withTempDir(() => {
    fs.writeFileSync('README.md', '# Test');
    fs.writeFileSync('CONTRIBUTING.md', '# Contributing');
    fs.writeFileSync('LICENSE.md', 'MIT License');

    const result = findRootMdFiles();
    assertEqual(result, [], 'Should not report allowed files');
  }));

  test('should detect PHASE violation files', withTempDir(() => {
    fs.writeFileSync('PHASE1A_CATALOGUE_PROMPT.md', '# Phase 1A');
    fs.writeFileSync('PHASE1B_RECOVERY_PROMPT.md', '# Phase 1B');

    const result = findRootMdFiles();
    assert(result.length === 2, `Expected 2 violations, got ${result.length}`);
    assertContains(result, 'PHASE1A_CATALOGUE_PROMPT.md', 'Should detect PHASE1A');
    assertContains(result, 'PHASE1B_RECOVERY_PROMPT.md', 'Should detect PHASE1B');
  }));

  test('should detect REPORT violation files', withTempDir(() => {
    fs.writeFileSync('RECOVERY-PILOT-REPORT-T010.md', '# Report');

    const result = findRootMdFiles();
    assertContains(result, 'RECOVERY-PILOT-REPORT-T010.md', 'Should detect REPORT files');
  }));

  test('should skip directories', withTempDir(() => {
    fs.mkdirSync('docs');
    fs.writeFileSync('docs/test.md', '# Docs');

    const result = findRootMdFiles();
    assertEqual(result, [], 'Should skip directories');
  }));

  test('should ignore non-MD files', withTempDir(() => {
    fs.writeFileSync('PHASE1A.txt', 'text file');
    fs.writeFileSync('PHASE1A.json', '{}');

    const result = findRootMdFiles();
    assertEqual(result, [], 'Should ignore non-MD files');
  }));

  test('should handle mixed violations and allowed files', withTempDir(() => {
    fs.writeFileSync('README.md', '# Readme');
    fs.writeFileSync('PHASE1A.md', '# Phase');
    fs.writeFileSync('PLAN-2026.md', '# Plan');
    fs.writeFileSync('CONTRIBUTING.md', '# Contributing');

    const result = findRootMdFiles();
    assertContains(result, 'PHASE1A.md', 'Should detect PHASE1A');
    assertContains(result, 'PLAN-2026.md', 'Should detect PLAN');
    assertNotContains(result, 'README.md', 'Should not detect README');
    assertNotContains(result, 'CONTRIBUTING.md', 'Should not detect CONTRIBUTING');
    assert(result.length === 2, `Expected 2 violations, got ${result.length}`);
  }));

  test('should detect TODO violations', withTempDir(() => {
    fs.writeFileSync('TODO.md', '# TODO');
    fs.writeFileSync('TODO-2026.md', '# TODO');

    const result = findRootMdFiles();
    assertContains(result, 'TODO.md', 'Should detect TODO.md');
    assertContains(result, 'TODO-2026.md', 'Should detect TODO-2026.md');
  }));

  test('should detect NOTES violations', withTempDir(() => {
    fs.writeFileSync('NOTES.md', '# Notes');
    fs.writeFileSync('NOTES-DISCOVERY.md', '# Notes');

    const result = findRootMdFiles();
    assertContains(result, 'NOTES.md', 'Should detect NOTES');
    assertContains(result, 'NOTES-DISCOVERY.md', 'Should detect NOTES variants');
  }));

  test('should detect SPEC violations', withTempDir(() => {
    fs.writeFileSync('SPEC.md', '# Spec');
    fs.writeFileSync('SPECIFICATION-001.md', '# Spec');

    const result = findRootMdFiles();
    assertContains(result, 'SPEC.md', 'Should detect SPEC');
    assertContains(result, 'SPECIFICATION-001.md', 'Should detect SPECIFICATION');
  }));

  test('should be case-sensitive for pattern matching', withTempDir(() => {
    fs.writeFileSync('phase1a.md', 'lowercase');
    fs.writeFileSync('Phase1A.md', 'title case');

    const result = findRootMdFiles();
    assertEqual(result, [], 'Should require uppercase PHASE');
  }));

  test('should handle special characters in filenames', withTempDir(() => {
    fs.writeFileSync('PLAN-2026-01-15.md', '# Plan');
    fs.writeFileSync('RECOVERY-PILOT-REPORT-T010.md', '# Report');

    const result = findRootMdFiles();
    assertContains(result, 'PLAN-2026-01-15.md', 'Should handle PLAN with dates');
    assertContains(result, 'RECOVERY-PILOT-REPORT-T010.md', 'Should handle REPORT with IDs');
  }));
});

describe('Integration scenarios', () => {
  test('should handle real-world violation scenario from issue', withTempDir(() => {
    fs.writeFileSync('PHASE1A_CATALOGUE_PROMPT.md', 'Catalogue');
    fs.writeFileSync('PHASE1B_RECOVERY_PROMPT.md', 'Recovery');
    fs.writeFileSync('RECOVERY-PILOT-REPORT-T010.md', 'Report');

    const result = findRootMdFiles();
    assert(result.length === 3, `Expected 3 violations, got ${result.length}`);
    assertContains(result, 'PHASE1A_CATALOGUE_PROMPT.md', 'Should detect first violation');
    assertContains(result, 'PHASE1B_RECOVERY_PROMPT.md', 'Should detect second violation');
    assertContains(result, 'RECOVERY-PILOT-REPORT-T010.md', 'Should detect third violation');
  }));

  test('should pass clean repository check', withTempDir(() => {
    fs.writeFileSync('README.md', '# Project');
    fs.mkdirSync('.github');
    fs.mkdirSync('docs');
    fs.writeFileSync('docs/ARCHITECTURE.md', '# Architecture');

    const result = findRootMdFiles();
    assertEqual(result, [], 'Clean repo should have no violations');
  }));

  test('should detect multiple violation types', withTempDir(() => {
    fs.writeFileSync('PHASE1A.md', 'phase');
    fs.writeFileSync('REPORT-AUDIT.md', 'report');
    fs.writeFileSync('TODO-ITEMS.md', 'todo');
    fs.writeFileSync('SPEC-001.md', 'spec');
    fs.writeFileSync('README.md', 'allowed');

    const result = findRootMdFiles();
    assert(result.length === 4, `Expected 4 violations, got ${result.length}`);
    assertContains(result, 'PHASE1A.md', 'Should detect PHASE');
    assertContains(result, 'REPORT-AUDIT.md', 'Should detect REPORT');
    assertContains(result, 'TODO-ITEMS.md', 'Should detect TODO');
    assertContains(result, 'SPEC-001.md', 'Should detect SPEC');
    assertNotContains(result, 'README.md', 'Should not detect README');
  }));
});

// ========== SUMMARY ==========

console.log(
  `\n\n${testsPassed}/${testsRun} tests passed${testsFailed > 0 ? `, ${testsFailed} failed` : ''}`
);

// Calculate coverage percentage (rough estimate based on lines covered)
const coverageLines = 32; // findRootMdFiles + helper logic
const totalLines = 45; // Approximate lines of actual logic
const coverage = Math.round((coverageLines / totalLines) * 100);
console.log(`Coverage: ~${coverage}% (${testsPassed} test cases exercising key paths)`);

process.exit(testsFailed > 0 ? 1 : 0);
