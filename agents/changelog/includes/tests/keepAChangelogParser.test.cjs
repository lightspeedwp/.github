/**
 * keepAChangelogParser Test Suite
 * Tests for Keep a Changelog 1.1.0 format parser with validation,
 * category detection, and entry management.
 * @author Ash Shaw
 * @date 2026-08-11
 * @related-files keepAChangelogParser.cjs, changelogValidator.cjs
 */

const { describe, it, before, after } = require('node:test');
const { strict: assert } = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const parser = require('../keepAChangelogParser.cjs');

const __dirname = path.dirname(require.main === module ? require.main.filename : __filename);

const testDir = path.join(__dirname, '..', '..', 'test-repos-parser');

describe('keepAChangelogParser', () => {
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

  describe('parseChangelog()', () => {
    it('should parse valid changelog with [Unreleased] section', () => {
      const changelogPath = path.join(testDir, 'valid-changelog.md');
      const content = `# Changelog

## [Unreleased]

### Added
- New feature 1

### Fixed
- Bug fix 1

## [1.0.0] - 2026-08-09

### Added
- Initial release

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);
      const result = parser.parseChangelog(changelogPath);

      assert.strictEqual(result.unreleased.length, 2);
      assert.strictEqual(result.unreleased[0].category, 'Added');
      assert.strictEqual(result.unreleased[1].category, 'Fixed');
      assert(result.releases['1.0.0']);
    });

    it('should handle categories with special characters', () => {
      const changelogPath = path.join(testDir, 'changelog-special-chars.md');
      const content = `# Changelog

## [Unreleased]

### [Breaking]
- Breaking change 1

### [Deprecated]
- Deprecated feature

## [1.0.0] - 2026-08-09

### Added
- Initial release

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);
      const result = parser.parseChangelog(changelogPath);

      assert.strictEqual(result.unreleased.length, 2);
      assert(result.unreleased.some((e) => e.category === '[Breaking]'));
      assert(result.unreleased.some((e) => e.category === '[Deprecated]'));
    });
  });

  describe('appendEntry()', () => {
    it('should append entry to existing category', () => {
      const changelogPath = path.join(testDir, 'append-existing.md');
      const content = `# Changelog

## [Unreleased]

### Added
- Feature 1

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
`;

      fs.writeFileSync(changelogPath, content);

      let changelog = fs.readFileSync(changelogPath, 'utf8');
      changelog = parser.appendEntry(changelog, {
        category: 'Added',
        text: 'Feature 2 (#999)',
      });

      assert(changelog.includes('Feature 1'));
      assert(changelog.includes('Feature 2'));
      assert(changelog.includes('- Feature 2'));
    });

    it('should handle categories with special characters in appendEntry', () => {
      const changelogPath = path.join(testDir, 'append-special-chars.md');
      const content = `# Changelog

## [Unreleased]

### [Breaking]
- Breaking change 1

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
`;

      fs.writeFileSync(changelogPath, content);

      let changelog = fs.readFileSync(changelogPath, 'utf8');
      // Should properly escape the [Breaking] category name
      changelog = parser.appendEntry(changelog, {
        category: '[Breaking]',
        text: 'Breaking change 2 (#999)',
      });

      assert(changelog.includes('Breaking change 1'));
      assert(changelog.includes('Breaking change 2'));
    });

    it('should create [Unreleased] section if missing', () => {
      const changelogPath = path.join(testDir, 'no-unreleased.md');
      const content = `# Changelog

## [1.0.0] - 2026-08-09

### Added
- Initial release

[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);

      let changelog = fs.readFileSync(changelogPath, 'utf8');
      changelog = parser.appendEntry(changelog, {
        category: 'Added',
        text: 'New feature (#123)',
      });

      assert(changelog.includes('## [Unreleased]'));
      assert(changelog.includes('### Added'));
      assert(changelog.includes('New feature'));
    });
  });

  describe('convertUnreleasedToRelease()', () => {
    it('should convert [Unreleased] heading to release version', () => {
      const content = `# Changelog

## [Unreleased]

### Added
- Feature 1

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      const result = parser.convertUnreleasedToRelease(content, '1.1.0', '2026-08-10');

      // Main conversion: [Unreleased] heading should become [1.1.0] - date
      assert(!result.includes('## [Unreleased]'));
      assert(result.includes('## [1.1.0] - 2026-08-10'));
    });

    it('should maintain changelog structure during conversion', () => {
      const content = `# Changelog

## [Unreleased]

### Added
- Feature 1

### Fixed
- Bug 1

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
`;

      const result = parser.convertUnreleasedToRelease(content, '1.1.0', '2026-08-10');

      // Content should be preserved
      assert(result.includes('Feature 1'));
      assert(result.includes('Bug 1'));
      assert(result.includes('### Added'));
      assert(result.includes('### Fixed'));
    });
  });

  describe('getChangelogExcerpt()', () => {
    it('should extract excerpt for specific version', () => {
      const changelogPath = path.join(testDir, 'excerpt-test.md');
      const content = `# Changelog

## [Unreleased]

### Added
- Feature 1

## [1.0.0] - 2026-08-09

### Added
- Initial release

### Fixed
- Bug fix

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);
      const parsed = parser.parseChangelog(changelogPath);
      const excerpt = parser.getChangelogExcerpt(parsed, '1.0.0');

      assert(excerpt.includes('Initial release'));
      assert(excerpt.includes('Bug fix'));
      assert(excerpt.includes('### Added'));
      assert(excerpt.includes('### Fixed'));
    });
  });

  describe('getVersions()', () => {
    it('should return all versions in parsed changelog', () => {
      const changelogPath = path.join(testDir, 'versions-test.md');
      const content = `# Changelog

## [Unreleased]

### Added
- Feature

## [1.1.0] - 2026-08-10

### Added
- Feature 1.1

## [1.0.0] - 2026-08-09

### Added
- Initial

[Unreleased]: https://github.com/example/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/example/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);
      const parsed = parser.parseChangelog(changelogPath);
      const versions = parser.getVersions(parsed);

      assert(versions.includes('1.1.0'));
      assert(versions.includes('1.0.0'));
      assert(!versions.includes('Unreleased'));
    });
  });

  describe('versionExists()', () => {
    it('should check if version exists', () => {
      const changelogPath = path.join(testDir, 'exists-test.md');
      const content = `# Changelog

## [Unreleased]

## [1.0.0] - 2026-08-09

### Added
- Initial

[Unreleased]: https://github.com/example/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/example/repo/releases/tag/v1.0.0
`;

      fs.writeFileSync(changelogPath, content);
      const parsed = parser.parseChangelog(changelogPath);

      assert(parser.versionExists(parsed, '1.0.0'));
      assert(!parser.versionExists(parsed, '2.0.0'));
    });
  });
});
