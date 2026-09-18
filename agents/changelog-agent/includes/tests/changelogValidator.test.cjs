const { describe, it, before, after } = require('node:test');
const { strict: assert } = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const validator = require('../changelogValidator.cjs');

const testDir = path.join(__dirname, '..', '..', 'test-repos-changelog');

describe('changelogValidator', () => {
  before(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  after(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('validateEntryFormat()', () => {
    it('should validate correct entry', () => {
      const entry = {
        title: 'Add new admin features',
        description: 'Enhanced admin dashboard with better UX',
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should reject entry without title', () => {
      const entry = {
        description: 'Some description',
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('Title is required')));
    });

    it('should reject title longer than 60 chars', () => {
      const entry = {
        title: 'This is a very long title that exceeds the sixty character limit',
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('< 60 chars')));
    });

    it('should reject description longer than 150 chars', () => {
      const longDesc =
        'A'.repeat(151);
      const entry = {
        title: 'Fix bug',
        description: longDesc,
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('< 150 chars')));
    });

    it('should reject entry without PR link', () => {
      const entry = {
        title: 'Add feature',
        description: 'Some description',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('PR link')));
    });

    it('should accept valid PR link format', () => {
      const entry = {
        title: 'Add feature',
        prLink: '#42',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, true);
    });

    it('should allow hyphenated compound words (backwards-compatible)', () => {
      const entry = {
        title: 'Add backwards-compatible API',
        description: 'Supports state-of-the-art features',
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should reject spaced hyphens used as em-dashes', () => {
      const entry = {
        title: 'Add feature - improved',
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('em-dashes')));
    });

    it('should reject spaced hyphens in description', () => {
      const entry = {
        title: 'Add feature',
        description: 'Fixes bug - improves performance',
        prLink: '#123',
      };

      const result = validator.validateEntryFormat(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('em-dashes')));
    });
  });

  describe('validateNoFormattingIssues()', () => {
    it('should detect leading whitespace', () => {
      const entry = {
        title: '  Add feature',
      };

      const result = validator.validateNoFormattingIssues(entry);

      assert.strictEqual(result.valid, false);
      assert(
        result.errors.some((e) => e.includes('leading/trailing'))
      );
    });

    it('should detect trailing whitespace', () => {
      const entry = {
        title: 'Add feature  ',
      };

      const result = validator.validateNoFormattingIssues(entry);

      assert.strictEqual(result.valid, false);
    });

    it('should detect lowercase start', () => {
      const entry = {
        title: 'add feature',
      };

      const result = validator.validateNoFormattingIssues(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('uppercase')));
    });

    it('should detect multiple spaces', () => {
      const entry = {
        title: 'Add  feature',
      };

      const result = validator.validateNoFormattingIssues(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('multiple')));
    });
  });

  describe('validateChangelogStructure()', () => {
    it('should reject missing CHANGELOG.md', () => {
      const changelogPath = path.join(testDir, 'missing-changelog.md');

      const result = validator.validateChangelogStructure(changelogPath);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('not found')));
    });

    it('should validate proper Keep a Changelog structure', () => {
      const changelogPath = path.join(testDir, 'valid-changelog.md');
      const content = `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature 1 (#123)
- New feature 2 (#124)

### Fixed
- Bug fix 1 (#125)

## [1.0.0] - 2026-08-09

### Added
- Initial release

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);

      const result = validator.validateChangelogStructure(changelogPath);

      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should reject missing [Unreleased] section', () => {
      const changelogPath = path.join(testDir, 'no-unreleased.md');
      const content = `# Changelog

## [1.0.0] - 2026-08-09
- Initial release
`;

      fs.writeFileSync(changelogPath, content);

      const result = validator.validateChangelogStructure(changelogPath);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('[Unreleased]')));
    });

    it('should reject empty [Unreleased] section', () => {
      const changelogPath = path.join(testDir, 'empty-unreleased.md');
      const content = `# Changelog

## [Unreleased]

## [1.0.0] - 2026-08-09
- Initial release
`;

      fs.writeFileSync(changelogPath, content);

      const result = validator.validateChangelogStructure(changelogPath);

      assert.strictEqual(result.valid, false);
      assert(result.errors.some((e) => e.includes('empty')));
    });

    it('should validate version format', () => {
      const changelogPath = path.join(testDir, 'version-format.md');
      const content = `# Changelog

## [Unreleased]
- New change (#100)

## [1.0.0] - 2026-08-09
- Initial release

[Unreleased]: https://github.com/example/repo
[1.0.0]: https://github.com/example/repo/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);

      const result = validator.validateChangelogStructure(changelogPath);

      assert.strictEqual(result.valid, true);
    });
  });

  describe('getValidationErrors()', () => {
    it('should collect all validation errors', () => {
      const entry = {
        title: '  bad title',
        description: 'A'.repeat(200),
        // missing prLink
      };

      const errors = validator.getValidationErrors(entry);

      assert(errors.length > 0);
      assert(errors.some((e) => e.includes('PR link')));
      assert(errors.some((e) => e.includes('whitespace')));
    });

    it('should return empty array for valid entry', () => {
      const entry = {
        title: 'Fix bug',
        description: 'Short description',
        prLink: '#100',
      };

      const errors = validator.getValidationErrors(entry);

      assert.strictEqual(errors.length, 0);
    });
  });

  describe('validateEntry()', () => {
    it('should validate entry comprehensively', () => {
      const entry = {
        title: 'Add feature',
        description: 'Feature description',
        prLink: '#50',
      };

      const result = validator.validateEntry(entry, 'gate1');

      assert.strictEqual(result.valid, true);
    });

    it('should return all errors for invalid entry', () => {
      const entry = {
        title: '  too long title that definitely exceeds the character limit imposed',
        prLink: 'invalid',
      };

      const result = validator.validateEntry(entry);

      assert.strictEqual(result.valid, false);
      assert(result.errors.length > 0);
    });
  });
});
