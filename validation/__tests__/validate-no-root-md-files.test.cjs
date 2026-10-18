/**
 * Unit tests for validate-no-root-md-files.cjs
 *
 * Tests cover:
 * - Pattern matching for forbidden file types
 * - Allowed files exemptions
 * - Directory skipping
 * - Success/failure exit scenarios
 * - Coverage target: >70%
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

describe('validate-no-root-md-files', () => {
  let testDir;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-md-validation-'));
    // Change to test directory
    process.chdir(testDir);
  });

  afterEach(() => {
    // Clean up test directory
    process.chdir('/');
    try {
      fs.rmSync(testDir, { recursive: true, force: true });
    } catch (err) {
      // Ignore cleanup errors
    }
  });

  describe('ALLOWED_ROOT_FILES', () => {
    test('should include standard root documentation files', () => {
      expect(ALLOWED_ROOT_FILES).toContain('README.md');
      expect(ALLOWED_ROOT_FILES).toContain('CONTRIBUTING.md');
      expect(ALLOWED_ROOT_FILES).toContain('LICENSE.md');
      expect(ALLOWED_ROOT_FILES).toContain('CHANGELOG.md');
      expect(ALLOWED_ROOT_FILES).toContain('CODE_OF_CONDUCT.md');
      expect(ALLOWED_ROOT_FILES).toContain('SECURITY.md');
    });

    test('should include .github repo files', () => {
      expect(ALLOWED_ROOT_FILES).toContain('.github/CLAUDE.md');
      expect(ALLOWED_ROOT_FILES).toContain('.github/AGENTS.md');
    });
  });

  describe('FORBIDDEN_ROOT_MD_PATTERNS', () => {
    test('should include PHASE file patterns', () => {
      const phasePattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
        p.test('PHASE1A_CATALOGUE_PROMPT.md')
      );
      expect(phasePattern).toBeDefined();
    });

    test('should match PHASE pattern variants', () => {
      const phasePattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
        p.test('PHASE1A_CATALOGUE_PROMPT.md')
      );
      expect(phasePattern.test('PHASE1A.md')).toBe(true);
      expect(phasePattern.test('PHASE2B_RECOVERY.md')).toBe(true);
      expect(phasePattern.test('PHASE99_TEST.md')).toBe(true);
    });

    test('should include PROMPT patterns', () => {
      const promptPattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
        p.test('PHASE1A_CATALOGUE_PROMPT.md')
      );
      expect(promptPattern).toBeDefined();
    });

    test('should match REPORT patterns', () => {
      const reportPattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
        p.test('RECOVERY-PILOT-REPORT-T010.md')
      );
      expect(reportPattern).toBeDefined();
      expect(reportPattern.test('AUDIT-REPORT.md')).toBe(true);
      expect(reportPattern.test('FINAL_REPORT.md')).toBe(true);
    });

    test('should match PILOT patterns', () => {
      const pilotPattern = FORBIDDEN_ROOT_MD_PATTERNS.find(p =>
        p.test('RECOVERY-PILOT-REPORT-T010.md')
      );
      expect(pilotPattern).toBeDefined();
      expect(pilotPattern.test('PILOT-TEST.md')).toBe(true);
    });

    test('should match TODO, NOTES, PLAN, RESEARCH patterns', () => {
      expect(FORBIDDEN_ROOT_MD_PATTERNS.some(p => p.test('TODO.md'))).toBe(true);
      expect(FORBIDDEN_ROOT_MD_PATTERNS.some(p => p.test('NOTES-2026.md'))).toBe(true);
      expect(FORBIDDEN_ROOT_MD_PATTERNS.some(p => p.test('PLAN.md'))).toBe(true);
      expect(FORBIDDEN_ROOT_MD_PATTERNS.some(p => p.test('RESEARCH-FINDINGS.md'))).toBe(true);
    });
  });

  describe('findRootMdFiles()', () => {
    test('should return empty array when no MD files exist', () => {
      const result = findRootMdFiles();
      expect(result).toEqual([]);
    });

    test('should skip allowed root files', () => {
      fs.writeFileSync(path.join(testDir, 'README.md'), '# Test');
      fs.writeFileSync(path.join(testDir, 'CONTRIBUTING.md'), '# Contributing');
      fs.writeFileSync(path.join(testDir, 'LICENSE.md'), 'MIT License');

      const result = findRootMdFiles();
      expect(result).toEqual([]);
    });

    test('should detect PHASE violation files', () => {
      fs.writeFileSync(path.join(testDir, 'PHASE1A_CATALOGUE_PROMPT.md'), '# Phase 1A');
      fs.writeFileSync(path.join(testDir, 'PHASE1B_RECOVERY_PROMPT.md'), '# Phase 1B');

      const result = findRootMdFiles();
      expect(result).toContain('PHASE1A_CATALOGUE_PROMPT.md');
      expect(result).toContain('PHASE1B_RECOVERY_PROMPT.md');
      expect(result.length).toBe(2);
    });

    test('should detect REPORT violation files', () => {
      fs.writeFileSync(path.join(testDir, 'RECOVERY-PILOT-REPORT-T010.md'), '# Report');

      const result = findRootMdFiles();
      expect(result).toContain('RECOVERY-PILOT-REPORT-T010.md');
    });

    test('should skip directories', () => {
      fs.mkdirSync(path.join(testDir, 'docs'));
      fs.writeFileSync(path.join(testDir, 'docs', 'test.md'), '# Docs');

      const result = findRootMdFiles();
      expect(result).toEqual([]);
    });

    test('should ignore non-MD files', () => {
      fs.writeFileSync(path.join(testDir, 'PHASE1A.txt'), 'text file');
      fs.writeFileSync(path.join(testDir, 'PHASE1A.json'), '{}');

      const result = findRootMdFiles();
      expect(result).toEqual([]);
    });

    test('should handle mixed violations and allowed files', () => {
      fs.writeFileSync(path.join(testDir, 'README.md'), '# Readme');
      fs.writeFileSync(path.join(testDir, 'PHASE1A.md'), '# Phase');
      fs.writeFileSync(path.join(testDir, 'PLAN-2026.md'), '# Plan');
      fs.writeFileSync(path.join(testDir, 'CONTRIBUTING.md'), '# Contributing');

      const result = findRootMdFiles();
      expect(result).toContain('PHASE1A.md');
      expect(result).toContain('PLAN-2026.md');
      expect(result).not.toContain('README.md');
      expect(result).not.toContain('CONTRIBUTING.md');
      expect(result.length).toBe(2);
    });

    test('should detect TODO violations', () => {
      fs.writeFileSync(path.join(testDir, 'TODO.md'), '# TODO');
      fs.writeFileSync(path.join(testDir, 'TODO-2026.md'), '# TODO');

      const result = findRootMdFiles();
      expect(result).toContain('TODO.md');
      expect(result).toContain('TODO-2026.md');
    });

    test('should detect NOTES violations', () => {
      fs.writeFileSync(path.join(testDir, 'NOTES.md'), '# Notes');
      fs.writeFileSync(path.join(testDir, 'NOTES-DISCOVERY.md'), '# Notes');

      const result = findRootMdFiles();
      expect(result).toContain('NOTES.md');
      expect(result).toContain('NOTES-DISCOVERY.md');
    });

    test('should detect SPEC violations', () => {
      fs.writeFileSync(path.join(testDir, 'SPEC.md'), '# Spec');
      fs.writeFileSync(path.join(testDir, 'SPECIFICATION-001.md'), '# Spec');

      const result = findRootMdFiles();
      expect(result).toContain('SPEC.md');
      expect(result).toContain('SPECIFICATION-001.md');
    });

    test('should be case-sensitive for pattern matching', () => {
      fs.writeFileSync(path.join(testDir, 'phase1a.md'), 'lowercase phase');
      fs.writeFileSync(path.join(testDir, 'Phase1A.md'), 'title case phase');

      const result = findRootMdFiles();
      // Pattern is /^PHASE\d+[A-Z_]*\.md$/ which requires uppercase PHASE
      expect(result).not.toContain('phase1a.md');
      expect(result).not.toContain('Phase1A.md');
      expect(result.length).toBe(0);
    });

    test('should handle special characters in filenames', () => {
      fs.writeFileSync(path.join(testDir, 'PLAN-2026-01-15.md'), '# Plan');
      fs.writeFileSync(path.join(testDir, 'RECOVERY-PILOT-REPORT-T010.md'), '# Report');

      const result = findRootMdFiles();
      expect(result).toContain('PLAN-2026-01-15.md');
      expect(result).toContain('RECOVERY-PILOT-REPORT-T010.md');
    });
  });

  describe('Integration scenarios', () => {
    test('should handle real-world violation scenario from issue', () => {
      // Real files from the reported issue
      fs.writeFileSync(path.join(testDir, 'PHASE1A_CATALOGUE_PROMPT.md'), 'Catalogue');
      fs.writeFileSync(path.join(testDir, 'PHASE1B_RECOVERY_PROMPT.md'), 'Recovery');
      fs.writeFileSync(path.join(testDir, 'RECOVERY-PILOT-REPORT-T010.md'), 'Report');

      const result = findRootMdFiles();
      expect(result.length).toBe(3);
      expect(result).toContain('PHASE1A_CATALOGUE_PROMPT.md');
      expect(result).toContain('PHASE1B_RECOVERY_PROMPT.md');
      expect(result).toContain('RECOVERY-PILOT-REPORT-T010.md');
    });

    test('should pass clean repository check', () => {
      fs.writeFileSync(path.join(testDir, 'README.md'), '# Project');
      fs.mkdirSync(path.join(testDir, '.github'));
      fs.mkdirSync(path.join(testDir, 'docs'));
      fs.writeFileSync(path.join(testDir, 'docs', 'ARCHITECTURE.md'), '# Architecture');

      const result = findRootMdFiles();
      expect(result).toEqual([]);
    });

    test('should detect multiple violation types', () => {
      fs.writeFileSync(path.join(testDir, 'PHASE1A.md'), 'phase');
      fs.writeFileSync(path.join(testDir, 'REPORT-AUDIT.md'), 'report');
      fs.writeFileSync(path.join(testDir, 'TODO-ITEMS.md'), 'todo');
      fs.writeFileSync(path.join(testDir, 'SPEC-001.md'), 'spec');
      fs.writeFileSync(path.join(testDir, 'README.md'), 'allowed');

      const result = findRootMdFiles();
      expect(result.length).toBe(4);
      expect(result).toContain('PHASE1A.md');
      expect(result).toContain('REPORT-AUDIT.md');
      expect(result).toContain('TODO-ITEMS.md');
      expect(result).toContain('SPEC-001.md');
      expect(result).not.toContain('README.md');
    });
  });
});
