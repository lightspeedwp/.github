/**
 * Regression Test Suite: Changelog Safety Audit
 * Phase 2: Comprehensive validation testing
 * Tests all 7 validation layers with edge cases
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Changelog Safety Audit — Regression Tests', () => {
  let originalWorkingDir;
  let testDir;
  const VALIDATION_SCRIPT = path.join(process.cwd(), 'scripts/validation/validate-changelog-safety.js');

  beforeAll(() => {
    originalWorkingDir = process.cwd();
  });

  afterAll(() => {
    process.chdir(originalWorkingDir);
  });

  /**
   * Test Layer 1: File Integrity Audit
   */
  describe('Layer 1: File Integrity Audit', () => {
    it('should pass when CHANGELOG.md exists and has content', () => {
      const changelogContent = `---
title: Test Changelog
description: Testing
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- Test entry 1
- Test entry 2

## [1.0.0] - 2026-08-20

### Added
- Initial release
`;

      testChangelogValidation(changelogContent, true, 'should accept valid changelog');
    });

    it('should fail when CHANGELOG.md is empty', () => {
      const changelogContent = '';
      testChangelogValidation(changelogContent, false, 'should reject empty changelog');
    });

    it('should warn when CHANGELOG.md is suspiciously small (< 500 bytes)', () => {
      const changelogContent = `---
title: Small
description: Test
last_updated: 2026-08-27
---

# Changelog
`;

      testChangelogValidation(changelogContent, false, 'should warn about small file');
    });

    it('should fail on invalid UTF-8 characters', () => {
      const changelogContent = Buffer.from([
        0x2d, 0x2d, 0x2d, 0x0a, 0x74, 0x69, 0x74, 0x6c, 0x65, 0x3a, 0x20, 0x54, 0x65, 0x73, 0x74, 0x0a,
        0x2d, 0x2d, 0x2d, 0x0a, 0xff, 0xfe, // Invalid UTF-8
      ]);

      testChangelogValidation(changelogContent.toString('latin1'), false, 'should reject invalid UTF-8');
    });
  });

  /**
   * Test Layer 2: Format Compliance Audit
   */
  describe('Layer 2: Format Compliance Audit', () => {
    it('should pass with properly formatted entries', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — A new feature description ([PR #123](https://github.com/test/repo/pull/123))

## [1.0.0] - 2026-08-20

### Added
- **Initial Release** — First version ([PR #1](https://github.com/test/repo/pull/1))
`;

      testChangelogValidation(changelogContent, true, 'should accept formatted entries');
    });

    it('should warn on extremely long entries (> 250 chars)', () => {
      const longEntry = 'x'.repeat(300);
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — ${longEntry}

## [1.0.0] - 2026-08-20

### Added
- **Initial** — First version
`;

      testChangelogValidation(changelogContent, false, 'should warn about long entries');
    });

    it('should detect malformed markdown links', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — Description [PR #123 missing closing bracket

## [1.0.0] - 2026-08-20

### Added
- **Initial** — First version
`;

      testChangelogValidation(changelogContent, false, 'should detect malformed links');
    });
  });

  /**
   * Test Layer 3: Structure Compliance Audit
   */
  describe('Layer 3: Structure Compliance Audit', () => {
    it('should pass with proper Keep a Changelog structure', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- New feature

### Fixed
- Bug fix

### Changed
- Breaking change

## [1.0.0] - 2026-08-20

### Added
- Initial release
`;

      testChangelogValidation(changelogContent, true, 'should accept proper structure');
    });

    it('should fail without [Unreleased] section', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [1.0.0] - 2026-08-20

### Added
- Initial release
`;

      testChangelogValidation(changelogContent, false, 'should require [Unreleased] section');
    });

    it('should detect version headers with proper format', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- Future feature

## [1.2.3] - 2026-08-20
### Added
- Feature

## [1.2.2] - 2026-08-15
### Added
- Another feature

## [1.2.1] - 2026-08-10
### Added
- Previous feature
`;

      testChangelogValidation(changelogContent, true, 'should detect multiple versions');
    });
  });

  /**
   * Test Layer 4: Frontmatter Validation Audit
   */
  describe('Layer 4: Frontmatter Validation Audit', () => {
    it('should pass with valid frontmatter', () => {
      const changelogContent = `---
title: Changelog
description: Test changelog
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- Feature

## [1.0.0] - 2026-08-20

### Added
- Initial
`;

      testChangelogValidation(changelogContent, true, 'should accept valid frontmatter');
    });

    it('should warn when frontmatter is missing required fields', () => {
      const changelogContent = `---
title: Changelog
---

# Changelog

## [Unreleased]

### Added
- Feature

## [1.0.0] - 2026-08-20

### Added
- Initial
`;

      testChangelogValidation(changelogContent, false, 'should warn about missing fields');
    });

    it('should warn when changelog is stale (> 60 days)', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 70);
      const dateString = oldDate.toISOString().split('T')[0];

      const changelogContent = `---
title: Changelog
description: Test
last_updated: ${dateString}
---

# Changelog

## [Unreleased]

### Added
- Feature

## [1.0.0] - 2026-08-20

### Added
- Initial
`;

      testChangelogValidation(changelogContent, false, 'should warn about staleness');
    });
  });

  /**
   * Test Layer 5: Data Integrity Audit
   */
  describe('Layer 5: Data Integrity Audit', () => {
    it('should detect duplicate version tags', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- Feature

## [1.0.0] - 2026-08-20
### Added
- First

## [1.0.0] - 2026-08-15
### Added
- Duplicate
`;

      testChangelogValidation(changelogContent, false, 'should detect duplicates');
    });

    it('should detect invalid dates in version headers', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- Feature

## [1.0.0] - 2026-13-45
### Added
- Invalid date
`;

      testChangelogValidation(changelogContent, false, 'should detect invalid dates');
    });

    it('should warn on unmatched brackets/parentheses', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — [Description without close bracket

## [1.0.0] - 2026-08-20

### Added
- Normal entry
`;

      testChangelogValidation(changelogContent, false, 'should warn about unmatched brackets');
    });
  });

  /**
   * Test Layer 6: Cross-Reference Check
   */
  describe('Layer 6: Cross-Reference Verification', () => {
    it('should verify required files exist', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- Feature

## [1.0.0] - 2026-08-20

### Added
- Initial
`;

      testChangelogValidation(changelogContent, false, 'should check for related files');
    });
  });

  /**
   * Test Layer 7: Links Validity Audit
   */
  describe('Layer 7: Links Validity Audit', () => {
    it('should accept valid GitHub PR links', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — Description ([PR #123](https://github.com/org/repo/pull/123))

## [1.0.0] - 2026-08-20

### Added
- **Initial** — Release ([PR #1](https://github.com/org/repo/pull/1))
`;

      testChangelogValidation(changelogContent, true, 'should accept PR links');
    });

    it('should detect malformed PR references', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — Description ([PR #0](https://github.com/org/repo/pull/0))

## [1.0.0] - 2026-08-20

### Added
- **Initial** — Release ([PR #1](https://github.com/org/repo/pull/1))
`;

      testChangelogValidation(changelogContent, false, 'should detect PR #0');
    });

    it('should warn on suspiciously high PR numbers', () => {
      const changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
- **Feature** — Description ([PR #999999](https://github.com/org/repo/pull/999999))

## [1.0.0] - 2026-08-20

### Added
- **Initial** — Release
`;

      testChangelogValidation(changelogContent, false, 'should warn about high numbers');
    });
  });

  /**
   * Performance Tests
   */
  describe('Performance Tests', () => {
    it('should validate large changelog within 500ms', () => {
      // Generate a large changelog with many entries
      let changelogContent = `---
title: Changelog
description: Test
last_updated: 2026-08-27
---

# Changelog

## [Unreleased]

### Added
`;

      for (let i = 1; i <= 500; i++) {
        changelogContent += `\n- **Feature ${i}** — Feature description ${i}`;
      }

      changelogContent += `\n\n## [1.0.0] - 2026-08-20\n\n### Added\n- Initial release`;

      const start = Date.now();
      testChangelogValidation(changelogContent, false, 'should handle large files');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
    });
  });
});

/**
 * Helper function to test changelog validation
 * @param {string} content - Changelog content to test
 * @param {boolean} shouldPass - Whether validation should pass
 * @param {string} testName - Name of the test
 */
function testChangelogValidation(content, shouldPass, testName) {
  // Create a temporary directory for the test
  const testDir = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'changelog-test-'));
  const originalCwd = process.cwd();

  try {
    process.chdir(testDir);

    // Write changelog
    fs.writeFileSync('CHANGELOG.md', content, 'utf8');

    // Run validation
    let result;
    try {
      execSync(`node ${VALIDATION_SCRIPT}`, { stdio: 'pipe' });
      result = true;
    } catch (error) {
      result = false;
    }

    if (shouldPass) {
      expect(result).toBe(true);
    } else {
      expect(result).toBe(false);
    }
  } finally {
    process.chdir(originalCwd);
    // Clean up temp directory
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}
