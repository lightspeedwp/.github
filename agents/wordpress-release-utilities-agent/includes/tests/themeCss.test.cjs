/**
 * Tests for Theme CSS Versioning Utility
 */

const fs = require('fs');
const path = require('path');
const { describe, it, expect, afterEach } = require('@jest/globals');
const {
  findThemeFile,
  readVersion,
  writeVersion,
  isValidVersion,
  bumpVersion,
  readMetadata,
} = require('../themeCss.cjs');

const tempDir = path.join(__dirname, '../../__tests__/temp-theme');
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

describe('themeCss', () => {
  afterEach(cleanupTemp);

  describe('findThemeFile', () => {
    it('finds style.css with Theme Name header', () => {
      const content = `/*
Theme Name: My Theme
Description: A test theme
Version: 1.0.0
*/`;
      createTempFile('style.css', content);
      const found = findThemeFile(tempDir);
      expect(found).toBeTruthy();
      expect(found).toContain('style.css');
    });

    it('returns null if style.css not found', () => {
      createTempFile('test.css', 'No theme here');
      const found = findThemeFile(tempDir);
      expect(found).toBeNull();
    });

    it('returns null if Theme Name header missing', () => {
      const content = `/*
Some CSS file
Version: 1.0.0
*/`;
      createTempFile('style.css', content);
      const found = findThemeFile(tempDir);
      expect(found).toBeNull();
    });
  });

  describe('readVersion', () => {
    it('reads version from theme CSS header', () => {
      const content = `/*
Theme Name: Test Theme
Version: 1.2.3
*/
body { color: black; }`;
      const filePath = createTempFile('style.css', content);
      expect(readVersion(filePath)).toBe('1.2.3');
    });

    it('reads version with pre-release suffix', () => {
      const content = `/*
Theme Name: Test Theme
Version: 1.2.3-beta
*/`;
      const filePath = createTempFile('style.css', content);
      expect(readVersion(filePath)).toBe('1.2.3-beta');
    });

    it('is case-insensitive', () => {
      const content = `/*
Theme Name: Test Theme
version: 2.0.0
*/`;
      const filePath = createTempFile('style.css', content);
      expect(readVersion(filePath)).toBe('2.0.0');
    });

    it('returns null if version not found', () => {
      const content = `/*
Theme Name: Test Theme
*/`;
      const filePath = createTempFile('style.css', content);
      expect(readVersion(filePath)).toBeNull();
    });
  });

  describe('writeVersion', () => {
    it('updates version in CSS header', () => {
      const content = `/*
Theme Name: Test Theme
Version: 1.0.0
*/
body { color: black; }`;
      const filePath = createTempFile('style.css', content);
      writeVersion(filePath, '1.1.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('Version: 1.1.0');
      expect(updated).not.toContain('Version: 1.0.0');
      expect(updated).toContain('body { color: black; }');
    });

    it('preserves CSS content after header', () => {
      const content = `/*
Theme Name: Test Theme
Version: 1.0.0
*/
body { color: black; }
.header { padding: 10px; }`;
      const filePath = createTempFile('style.css', content);
      writeVersion(filePath, '2.0.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('.header { padding: 10px; }');
    });

    it('throws error if Version header not found', () => {
      const content = `/*
Theme Name: Test Theme
*/`;
      const filePath = createTempFile('style.css', content);
      expect(() => writeVersion(filePath, '1.0.0')).toThrow(
        /No Version header found/
      );
    });
  });

  describe('isValidVersion', () => {
    it('validates correct SemVer versions', () => {
      expect(isValidVersion('1.0.0')).toBe(true);
      expect(isValidVersion('0.0.1')).toBe(true);
    });

    it('validates SemVer with pre-release', () => {
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
    it('reads all theme metadata', () => {
      const content = `/*
Theme Name: My Test Theme
Description: A comprehensive test theme
Version: 1.2.3
Author: Test Author
Author URI: https://example.com
Theme URI: https://example.com/theme
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: my-test-theme
*/`;
      const filePath = createTempFile('style.css', content);
      const metadata = readMetadata(filePath);
      expect(metadata.name).toBe('My Test Theme');
      expect(metadata.description).toBe('A comprehensive test theme');
      expect(metadata.version).toBe('1.2.3');
      expect(metadata.author).toBe('Test Author');
    });

    it('handles partial metadata', () => {
      const content = `/*
Theme Name: Minimal Theme
Version: 1.0.0
*/`;
      const filePath = createTempFile('style.css', content);
      const metadata = readMetadata(filePath);
      expect(metadata.name).toBe('Minimal Theme');
      expect(metadata.author).toBeNull();
    });

    it('returns null for non-existent file', () => {
      expect(readMetadata('/non/existent/file.css')).toBeNull();
    });
  });
});
