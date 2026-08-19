/**
 * Tests for Plugin Header Versioning Utility
 */

const fs = require('fs');
const path = require('path');
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const {
  findPluginFile,
  readVersion,
  writeVersion,
  isValidVersion,
  bumpVersion,
  readMetadata,
} = require('../pluginHeader.cjs');

// Utility to create temp files
const tempDir = path.join(__dirname, '../../__tests__/temp-plugin');
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

describe('pluginHeader', () => {
  afterEach(cleanupTemp);

  describe('findPluginFile', () => {
    it('finds a plugin file with Plugin Name header', () => {
      const content = `<?php
/*
Plugin Name: My Plugin
Description: A test plugin
Version: 1.0.0
*/`;
      createTempFile('my-plugin.php', content);
      const found = findPluginFile(tempDir);
      expect(found).toBeTruthy();
      expect(found).toContain('my-plugin.php');
    });

    it('returns null if no plugin file found', () => {
      createTempFile('test.txt', 'Not a plugin');
      const found = findPluginFile(tempDir);
      expect(found).toBeNull();
    });

    it('returns null for non-existent directory', () => {
      const found = findPluginFile('/non/existent/path');
      expect(found).toBeNull();
    });
  });

  describe('readVersion', () => {
    it('reads version from plugin header', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
Version: 1.2.3
*/`;
      const filePath = createTempFile('test.php', content);
      expect(readVersion(filePath)).toBe('1.2.3');
    });

    it('reads version with pre-release suffix', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
Version: 1.2.3-beta
*/`;
      const filePath = createTempFile('test.php', content);
      expect(readVersion(filePath)).toBe('1.2.3-beta');
    });

    it('is case-insensitive', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
version: 2.0.0
*/`;
      const filePath = createTempFile('test.php', content);
      expect(readVersion(filePath)).toBe('2.0.0');
    });

    it('returns null if version not found', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
*/`;
      const filePath = createTempFile('test.php', content);
      expect(readVersion(filePath)).toBeNull();
    });

    it('returns null for non-existent file', () => {
      expect(readVersion('/non/existent/file.php')).toBeNull();
    });
  });

  describe('writeVersion', () => {
    it('updates version in plugin header', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
Version: 1.0.0
*/`;
      const filePath = createTempFile('test.php', content);
      writeVersion(filePath, '1.1.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('Version: 1.1.0');
      expect(updated).not.toContain('Version: 1.0.0');
    });

    it('updates version with pre-release suffix', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
Version: 1.0.0-alpha
*/`;
      const filePath = createTempFile('test.php', content);
      writeVersion(filePath, '1.0.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('Version: 1.0.0');
    });

    it('is case-insensitive for Version tag', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
version: 1.0.0
*/`;
      const filePath = createTempFile('test.php', content);
      writeVersion(filePath, '2.0.0');
      const updated = fs.readFileSync(filePath, 'utf8');
      expect(updated).toContain('Version: 2.0.0');
    });

    it('throws error if Version header not found', () => {
      const content = `<?php
/*
Plugin Name: Test Plugin
*/`;
      const filePath = createTempFile('test.php', content);
      expect(() => writeVersion(filePath, '1.0.0')).toThrow(
        /No Version header found/
      );
    });

    it('throws error for non-existent file', () => {
      expect(() => writeVersion('/non/existent/file.php', '1.0.0')).toThrow();
    });
  });

  describe('isValidVersion', () => {
    it('validates correct SemVer versions', () => {
      expect(isValidVersion('1.0.0')).toBe(true);
      expect(isValidVersion('0.0.1')).toBe(true);
      expect(isValidVersion('2.3.4')).toBe(true);
    });

    it('validates SemVer with pre-release suffix', () => {
      expect(isValidVersion('1.0.0-alpha')).toBe(true);
      expect(isValidVersion('1.0.0-beta.1')).toBe(true);
      expect(isValidVersion('1.0.0-rc1')).toBe(true);
    });

    it('rejects invalid versions', () => {
      expect(isValidVersion('1.0')).toBe(false);
      expect(isValidVersion('1')).toBe(false);
      expect(isValidVersion('v1.0.0')).toBe(false);
      expect(isValidVersion('1.0.0.0')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidVersion('')).toBe(false);
    });
  });

  describe('bumpVersion', () => {
    it('bumps patch version', () => {
      expect(bumpVersion('1.0.0', 'patch')).toBe('1.0.1');
      expect(bumpVersion('2.3.4', 'patch')).toBe('2.3.5');
    });

    it('bumps minor version and resets patch', () => {
      expect(bumpVersion('1.0.0', 'minor')).toBe('1.1.0');
      expect(bumpVersion('2.3.4', 'minor')).toBe('2.4.0');
    });

    it('bumps major version and resets minor/patch', () => {
      expect(bumpVersion('1.0.0', 'major')).toBe('2.0.0');
      expect(bumpVersion('2.3.4', 'major')).toBe('3.0.0');
    });

    it('handles pre-release versions', () => {
      expect(bumpVersion('1.0.0-beta', 'patch')).toBe('1.0.1');
      expect(bumpVersion('1.0.0-alpha', 'minor')).toBe('1.1.0');
    });

    it('defaults to patch version', () => {
      expect(bumpVersion('1.0.0')).toBe('1.0.1');
    });

    it('throws error for invalid scope', () => {
      expect(() => bumpVersion('1.0.0', 'invalid')).toThrow(
        /Invalid scope/
      );
    });
  });

  describe('readMetadata', () => {
    it('reads all plugin metadata', () => {
      const content = `<?php
/*
Plugin Name: My Test Plugin
Description: A comprehensive test plugin
Version: 1.2.3
Author: Test Author
Author URI: https://example.com
Plugin URI: https://example.com/plugin
License: GPL v2 or later
Domain Path: /languages
Text Domain: my-test-plugin
*/`;
      const filePath = createTempFile('test.php', content);
      const metadata = readMetadata(filePath);
      expect(metadata.name).toBe('My Test Plugin');
      expect(metadata.description).toBe('A comprehensive test plugin');
      expect(metadata.version).toBe('1.2.3');
      expect(metadata.author).toBe('Test Author');
      expect(metadata.authorUri).toBe('https://example.com');
      expect(metadata.pluginUri).toBe('https://example.com/plugin');
    });

    it('returns null for non-existent file', () => {
      expect(readMetadata('/non/existent/file.php')).toBeNull();
    });

    it('handles partial metadata', () => {
      const content = `<?php
/*
Plugin Name: Minimal Plugin
Version: 1.0.0
*/`;
      const filePath = createTempFile('test.php', content);
      const metadata = readMetadata(filePath);
      expect(metadata.name).toBe('Minimal Plugin');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.author).toBeNull();
    });
  });
});
