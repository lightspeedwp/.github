const { describe, it, before, after } = require('node:test');
const { strict: assert } = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const repoDetector = require('../repoDetector.cjs');

const testDir = path.join(__dirname, '..', '..', 'test-repos');

describe('repoDetector', () => {
  before(() => {
    // Create temporary test repositories
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  after(() => {
    // Clean up test repositories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('detectRepoType()', () => {
    it('should detect control-plane repositories', () => {
      const controlPlaneDir = path.join(testDir, 'control-plane');
      fs.mkdirSync(controlPlaneDir, { recursive: true });
      fs.mkdirSync(path.join(controlPlaneDir, '.github'));
      fs.writeFileSync(path.join(controlPlaneDir, 'VERSION'), '1.0.0');
      fs.writeFileSync(path.join(controlPlaneDir, 'package.json'), '{}');

      const result = repoDetector.detectRepoType(controlPlaneDir);

      assert.strictEqual(result.type, 'control-plane');
      assert.strictEqual(result.workspace, '.github');
      assert.deepStrictEqual(result.versionFiles, ['VERSION', 'package.json']);
    });

    it('should detect WordPress plugin repositories', () => {
      const pluginDir = path.join(testDir, 'plugin');
      fs.mkdirSync(pluginDir, { recursive: true });
      fs.writeFileSync(path.join(pluginDir, 'VERSION'), '2.0.0');
      fs.writeFileSync(
        path.join(pluginDir, 'my-plugin.php'),
        '<?php\n/**\n * Plugin Name: My Plugin\n */\n'
      );
      fs.writeFileSync(path.join(pluginDir, 'readme.txt'), 'Stable tag: 2.0.0');

      const result = repoDetector.detectRepoType(pluginDir);

      assert.strictEqual(result.type, 'plugin');
      assert(result.versionFiles.includes('VERSION'));
      assert(result.versionFiles.includes('my-plugin.php'));
      assert(result.versionFiles.includes('readme.txt'));
      assert(result.mainFile.endsWith('my-plugin.php'));
    });

    it('should detect WordPress theme repositories', () => {
      const themeDir = path.join(testDir, 'theme');
      fs.mkdirSync(themeDir, { recursive: true });
      fs.writeFileSync(path.join(themeDir, 'VERSION'), '3.0.0');
      fs.writeFileSync(
        path.join(themeDir, 'style.css'),
        '/*\n * Theme Name: My Theme\n * Version: 3.0.0\n */\n'
      );

      const result = repoDetector.detectRepoType(themeDir);

      assert.strictEqual(result.type, 'theme');
      assert.strictEqual(result.mainFile, path.join(themeDir, 'style.css'));
      assert(result.versionFiles.includes('VERSION'));
      assert(result.versionFiles.includes('style.css'));
    });

    it('should throw error for invalid repositories', () => {
      const invalidDir = path.join(testDir, 'invalid');
      fs.mkdirSync(invalidDir, { recursive: true });

      assert.throws(
        () => repoDetector.detectRepoType(invalidDir),
        /Unable to detect repository type/
      );
    });
  });

  describe('detectControlPlane()', () => {
    it('should return null if .github directory missing', () => {
      const dir = path.join(testDir, 'no-github');
      fs.mkdirSync(dir, { recursive: true });

      const result = repoDetector.detectControlPlane(dir);
      assert.strictEqual(result, null);
    });

    it('should return null if VERSION file missing', () => {
      const dir = path.join(testDir, 'no-version');
      fs.mkdirSync(dir, { recursive: true });
      fs.mkdirSync(path.join(dir, '.github'));
      fs.writeFileSync(path.join(dir, 'package.json'), '{}');

      const result = repoDetector.detectControlPlane(dir);
      assert.strictEqual(result, null);
    });
  });

  describe('detectWordPressPlugin()', () => {
    it('should return null if VERSION file missing', () => {
      const dir = path.join(testDir, 'plugin-no-version');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'plugin.php'),
        '<?php\n/**\n * Plugin Name: Test\n */\n'
      );

      const result = repoDetector.detectWordPressPlugin(dir);
      assert.strictEqual(result, null);
    });

    it('should return null if plugin file missing', () => {
      const dir = path.join(testDir, 'plugin-no-file');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '1.0.0');

      const result = repoDetector.detectWordPressPlugin(dir);
      assert.strictEqual(result, null);
    });

    it('should include readme.txt if present', () => {
      const dir = path.join(testDir, 'plugin-with-readme');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '1.0.0');
      fs.writeFileSync(
        path.join(dir, 'plugin.php'),
        '<?php\n/**\n * Plugin Name: Test\n */\n'
      );
      fs.writeFileSync(path.join(dir, 'readme.txt'), 'Test');

      const result = repoDetector.detectWordPressPlugin(dir);
      assert(result.versionFiles.includes('readme.txt'));
      assert.strictEqual(result.readmeFile, path.join(dir, 'readme.txt'));
    });
  });

  describe('findPluginFile()', () => {
    it('should find plugin file with Plugin Name header', () => {
      const dir = path.join(testDir, 'find-plugin');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'main-plugin.php'),
        '<?php\n/**\n * Plugin Name: My Plugin\n * Version: 1.0.0\n */\n'
      );
      fs.writeFileSync(
        path.join(dir, 'helper.php'),
        '<?php\n// Helper file\n'
      );

      const result = repoDetector.findPluginFile(dir);
      assert(result.endsWith('main-plugin.php'));
    });

    it('should return null if no plugin file found', () => {
      const dir = path.join(testDir, 'no-plugin-file');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'helper.php'),
        '<?php\n// Helper file\n'
      );

      const result = repoDetector.findPluginFile(dir);
      assert.strictEqual(result, null);
    });

    it('should handle case-insensitive Plugin Name header', () => {
      const dir = path.join(testDir, 'case-insensitive');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'plugin.php'),
        '<?php\n/**\n * plugin name: My Plugin\n */\n'
      );

      const result = repoDetector.findPluginFile(dir);
      assert(result.endsWith('plugin.php'));
    });
  });

  describe('getVersionFiles()', () => {
    it('should return full paths to version files', () => {
      const repoConfig = {
        root: '/test/repo',
        versionFiles: ['VERSION', 'package.json'],
      };

      const result = repoDetector.getVersionFiles(repoConfig);

      assert.deepStrictEqual(result, [
        '/test/repo/VERSION',
        '/test/repo/package.json',
      ]);
    });
  });

  describe('isValidRepoStructure()', () => {
    it('should return true for valid repo structure', () => {
      const dir = path.join(testDir, 'valid-structure');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '1.0.0');
      fs.writeFileSync(path.join(dir, 'package.json'), '{}');

      const config = {
        root: dir,
        versionFiles: ['VERSION', 'package.json'],
        mainFile: null,
      };

      const result = repoDetector.isValidRepoStructure(config);
      assert.strictEqual(result, true);
    });

    it('should return false for missing version files', () => {
      const dir = path.join(testDir, 'invalid-structure');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '1.0.0');

      const config = {
        root: dir,
        versionFiles: ['VERSION', 'package.json'],
        mainFile: null,
      };

      const result = repoDetector.isValidRepoStructure(config);
      assert.strictEqual(result, false);
    });

    it('should return false for missing main file', () => {
      const dir = path.join(testDir, 'no-main-file');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '1.0.0');

      const config = {
        root: dir,
        versionFiles: ['VERSION'],
        mainFile: path.join(dir, 'missing.php'),
      };

      const result = repoDetector.isValidRepoStructure(config);
      assert.strictEqual(result, false);
    });
  });

  describe('getMainFile()', () => {
    it('should return the main file path', () => {
      const config = {
        root: '/test/repo',
        mainFile: '/test/repo/plugin.php',
      };

      const result = repoDetector.getMainFile(config);
      assert.strictEqual(result, '/test/repo/plugin.php');
    });

    it('should return null if no main file', () => {
      const config = {
        root: '/test/repo',
        mainFile: null,
      };

      const result = repoDetector.getMainFile(config);
      assert.strictEqual(result, null);
    });
  });
});
