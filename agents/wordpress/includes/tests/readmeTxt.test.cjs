/**
 * Tests for Plugin readme.txt Versioning Utility
 */

const fs = require('fs');
const path = require('path');
const { describe, it, expect, afterEach } = require('@jest/globals');
const {
  findReadmeFile,
  readVersion,
  writeVersion,
  isValidVersion,
  bumpVersion,
  readMetadata,
} = require('../readmeTxt.cjs');

const tempDir = path.join(__dirname, '../../__tests__/temp-readme');
const createTempFile = (name, content) => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const filePath = path.join(tempDir, name);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
};

const cleanupTemp = () => {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
};

describe('readmeTxt', () => {
  afterEach(cleanupTemp);

  describe('findReadmeFile', () => {
    it('finds readme.txt with plugin name header', () => {
      const content = `=== My Test Plugin ===
Contributors: testauthor
Stable tag: 1.0.0`;
      createTempFile('readme.txt', content);
      const found = findReadmeFile(tempDir);
      expect(found).toBeTruthy();
      expect(found).toContain('readme.txt');
    });

    it('returns null if readme.txt not found', () => {
      createTempFile('test.txt', 'Not a plugin readme');
      const found = findReadmeFile(tempDir);
      expect(found).toBeNull();
    });

    it('returns null if not a WordPress readme', () => {
      const content = `Some text file
      without proper headers`;
      createTempFile('readme.txt', content);
      const found = findReadmeFile(tempDir);
      expect(found).toBeNull();
    });
  });

  describe('readVersion', () => {
    it('reads stable tag version', () => {
      const content = `=== My Plugin ===
Contributors: author
Stable tag: 1.2.3`;
      const filePath = createTempFile('readme.txt', content);
      expect(readVersion(filePath)).toBe('1.2.3');
    });

    it('reads version with pre-release suffix', () => {
      const content = `=== My Plugin ===
Stable tag: 1.2.3-beta`;
      const filePath = createTempFile('readme.txt', content);
      expect(readVersion(filePath)).toBe('1.2.3-beta');
    });

    it('is case-insensitive', () => {
      const content = `=== My Plugin ===
STABLE TAG: 2.0.0`;
      const filePath = createTempFile('readme.txt', content);
      expect(readVersion(filePath)).toBe('2.0.0');
    });

    it('handles whitespace variations', () => {
      const content = `=== My Plugin ===
Stable   tag   :   1.5.0`;
      const filePath = createTempFile('readme.txt', content);
      expect(readVersion(filePath)).toBe('1.5.0');
    });

    it('returns null if stable tag not found', () => {
      const content = `=== My Plugin ===
Contributors: author`;
      const filePath = createTempFile('readme.txt', content);
      expect(readVersion(filePath)).toBeNull();
    });
  });

  describe('writeVersion', () => {
    it('updates stable tag version', () => {
      const content = `=== My Plugin ===
Contributors: author
Stable tag: 1.0.0

Changelog section...`;
      const filePath = createTempFile('readme.txt', content);
      writeVersion(filePath, '1.1.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('Stable tag: 1.1.0');
      expect(updated).not.toContain('Stable tag: 1.0.0');
      expect(updated).toContain('Changelog section...');
    });

    it('handles pre-release versions', () => {
      const content = `=== My Plugin ===
Stable tag: 1.0.0-alpha`;
      const filePath = createTempFile('readme.txt', content);
      writeVersion(filePath, '1.0.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('Stable tag: 1.0.0');
    });

    it('throws error if stable tag not found', () => {
      const content = `=== My Plugin ===
Contributors: author`;
      const filePath = createTempFile('readme.txt', content);
      expect(() => writeVersion(filePath, '1.0.0')).toThrow(
        /No Stable tag header found/
      );
    });
  });

  describe('isValidVersion', () => {
    it('validates correct SemVer versions', () => {
      expect(isValidVersion('1.0.0')).toBe(true);
      expect(isValidVersion('2.3.4')).toBe(true);
    });

    it('validates with pre-release', () => {
      expect(isValidVersion('1.0.0-beta')).toBe(true);
      expect(isValidVersion('1.0.0-rc.1')).toBe(true);
    });

    it('rejects invalid versions', () => {
      expect(isValidVersion('1.0')).toBe(false);
      expect(isValidVersion('v1.0.0')).toBe(false);
    });
  });

  describe('bumpVersion', () => {
    it('bumps patch version', () => {
      expect(bumpVersion('1.0.0', 'patch')).toBe('1.0.1');
    });

    it('bumps minor version', () => {
      expect(bumpVersion('1.0.0', 'minor')).toBe('1.1.0');
    });

    it('bumps major version', () => {
      expect(bumpVersion('1.0.0', 'major')).toBe('2.0.0');
    });

    it('defaults to patch', () => {
      expect(bumpVersion('1.0.0')).toBe('1.0.1');
    });
  });

  describe('readMetadata', () => {
    it('reads plugin metadata from readme.txt', () => {
      const content = `=== My Test Plugin ===
Contributors: testauthor
Donate link: https://example.com/donate
Author: Test Author
Author URI: https://example.com
Plugin URI: https://example.com/plugin
License: GPL v2 or later
Requires at least: 5.0
Tested up to: 6.0
Stable tag: 1.2.3
Text Domain: my-test-plugin

Description of the plugin`;
      const filePath = createTempFile('readme.txt', content);
      const metadata = readMetadata(filePath);
      expect(metadata.name).toBe('My Test Plugin');
      expect(metadata.version).toBe('1.2.3');
      expect(metadata.author).toBe('Test Author');
      expect(metadata.requiresWp).toBe('5.0');
      expect(metadata.tested).toBe('6.0');
    });

    it('handles minimal metadata', () => {
      const content = `=== My Plugin ===
Stable tag: 1.0.0`;
      const filePath = createTempFile('readme.txt', content);
      const metadata = readMetadata(filePath);
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.author).toBeNull();
    });

    it('returns null for non-existent file', () => {
      expect(readMetadata('/non/existent/file.txt')).toBeNull();
    });
  });
});
