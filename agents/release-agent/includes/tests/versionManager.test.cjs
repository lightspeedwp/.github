const { describe, it, before, after } = require('node:test');
const { strict: assert } = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const versionManager = require('../versionManager.cjs');

const testDir = path.join(__dirname, '..', '..', 'test-repos-vm');

describe('versionManager', () => {
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

  describe('detectAllVersionFiles()', () => {
    it('should detect all version files in control-plane repo', () => {
      const dir = path.join(testDir, 'control-plane');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '1.0.0');
      fs.writeFileSync(path.join(dir, 'package.json'), '{"version":"1.0.0"}');

      const repoConfig = {
        type: 'control-plane',
        root: dir,
        mainFile: null,
        readmeFile: null,
      };

      const result = versionManager.detectAllVersionFiles(repoConfig);

      assert.strictEqual(result.VERSION.current, '1.0.0');
      assert.strictEqual(result.packageJson.current, '1.0.0');
    });

    it('should detect version files in plugin repo', () => {
      const dir = path.join(testDir, 'plugin-versions');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '2.0.0');
      fs.writeFileSync(
        path.join(dir, 'plugin.php'),
        '<?php\n/**\n * Plugin Name: Test\n * Version: 2.0.0\n */\n'
      );
      fs.writeFileSync(path.join(dir, 'readme.txt'), 'Stable tag: 2.0.0');

      const repoConfig = {
        type: 'plugin',
        root: dir,
        mainFile: path.join(dir, 'plugin.php'),
        readmeFile: path.join(dir, 'readme.txt'),
      };

      const result = versionManager.detectAllVersionFiles(repoConfig);

      assert.strictEqual(result.VERSION.current, '2.0.0');
      assert.strictEqual(result.plugin.current, '2.0.0');
      assert.strictEqual(result.readme.current, '2.0.0');
    });

    it('should detect version files in theme repo', () => {
      const dir = path.join(testDir, 'theme-versions');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'VERSION'), '3.0.0');
      fs.writeFileSync(
        path.join(dir, 'style.css'),
        '/*\n * Theme Name: Test Theme\n * Version: 3.0.0\n */\n'
      );

      const repoConfig = {
        type: 'theme',
        root: dir,
        mainFile: path.join(dir, 'style.css'),
        readmeFile: null,
      };

      const result = versionManager.detectAllVersionFiles(repoConfig);

      assert.strictEqual(result.VERSION.current, '3.0.0');
      assert.strictEqual(result.theme.current, '3.0.0');
    });
  });

  describe('validateVersionConsistency()', () => {
    it('should validate consistent versions', () => {
      const versionMap = {
        VERSION: { path: 'VERSION', current: '1.0.0' },
        packageJson: { path: 'package.json', current: '1.0.0' },
      };

      const result = versionManager.validateVersionConsistency(versionMap);

      assert.strictEqual(result.isConsistent, true);
      assert.strictEqual(result.mismatches.length, 0);
    });

    it('should detect inconsistent versions', () => {
      const versionMap = {
        VERSION: { path: 'VERSION', current: '1.0.0' },
        packageJson: { path: 'package.json', current: '1.0.1' },
      };

      const result = versionManager.validateVersionConsistency(versionMap);

      assert.strictEqual(result.isConsistent, false);
      assert.strictEqual(result.mismatches.length, 1);
    });

    it('should return false for empty map', () => {
      const result = versionManager.validateVersionConsistency({});

      assert.strictEqual(result.isConsistent, false);
    });
  });

  describe('isValidSemVer()', () => {
    it('should validate correct SemVer', () => {
      assert.strictEqual(versionManager.isValidSemVer('1.0.0'), true);
      assert.strictEqual(versionManager.isValidSemVer('10.20.30'), true);
      assert.strictEqual(versionManager.isValidSemVer('0.0.1'), true);
    });

    it('should reject invalid SemVer', () => {
      assert.strictEqual(versionManager.isValidSemVer('1.0'), false);
      assert.strictEqual(versionManager.isValidSemVer('v1.0.0'), false);
      assert.strictEqual(versionManager.isValidSemVer('1.0.0.0'), false);
    });
  });

  describe('bumpVersion()', () => {
    it('should bump patch version', () => {
      const result = versionManager.bumpVersion('1.2.3', 'patch');
      assert.strictEqual(result, '1.2.4');
    });

    it('should bump minor version', () => {
      const result = versionManager.bumpVersion('1.2.3', 'minor');
      assert.strictEqual(result, '1.3.0');
    });

    it('should bump major version', () => {
      const result = versionManager.bumpVersion('1.2.3', 'major');
      assert.strictEqual(result, '2.0.0');
    });

    it('should throw error for invalid scope', () => {
      assert.throws(
        () => versionManager.bumpVersion('1.2.3', 'invalid'),
        /Invalid scope/
      );
    });
  });

  describe('getNextVersion()', () => {
    it('should return next patch version by default', () => {
      const result = versionManager.getNextVersion('1.0.0');
      assert.strictEqual(result, '1.0.1');
    });

    it('should return next minor version', () => {
      const result = versionManager.getNextVersion('1.0.0', 'minor');
      assert.strictEqual(result, '1.1.0');
    });
  });

  describe('Version file read/write', () => {
    it('should read and write VERSION file', () => {
      const dir = path.join(testDir, 'version-rw');
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, 'VERSION');

      versionManager.writeVersionFile(filePath, '1.5.0');
      const version = versionManager.readVersionFile(filePath);

      assert.strictEqual(version, '1.5.0');
    });

    it('should read and write package.json version', () => {
      const dir = path.join(testDir, 'package-rw');
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, 'package.json');

      fs.writeFileSync(filePath, '{"name":"test","version":"1.0.0"}');
      versionManager.writeVersionToPackageJson(filePath, '2.0.0');
      const version = versionManager.readVersionFromPackageJson(filePath);

      assert.strictEqual(version, '2.0.0');
    });

    it('should read and write plugin file version', () => {
      const dir = path.join(testDir, 'plugin-rw');
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, 'plugin.php');

      const content = '<?php\n/**\n * Plugin Name: Test\n * Version: 1.0.0\n */\n';
      fs.writeFileSync(filePath, content);

      versionManager.writeVersionToPluginFile(filePath, '2.5.0');
      const version = versionManager.readVersionFromPluginFile(filePath);

      assert.strictEqual(version, '2.5.0');
    });

    it('should read and write theme file version', () => {
      const dir = path.join(testDir, 'theme-rw');
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, 'style.css');

      const content = '/*\n * Theme Name: Test\n * Version: 1.0.0\n */\n';
      fs.writeFileSync(filePath, content);

      versionManager.writeVersionToThemeFile(filePath, '3.0.0');
      const version = versionManager.readVersionFromThemeFile(filePath);

      assert.strictEqual(version, '3.0.0');
    });

    it('should read and write readme.txt version', () => {
      const dir = path.join(testDir, 'readme-rw');
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, 'readme.txt');

      fs.writeFileSync(filePath, 'Stable tag: 1.0.0\n');
      versionManager.writeVersionToReadme(filePath, '1.5.0');
      const version = versionManager.readVersionFromReadme(filePath);

      assert.strictEqual(version, '1.5.0');
    });
  });

  describe('applyVersionBump()', () => {
    it('should apply version bump to all files', () => {
      const dir = path.join(testDir, 'apply-bump');
      fs.mkdirSync(dir, { recursive: true });

      const versionFile = path.join(dir, 'VERSION');
      const packageFile = path.join(dir, 'package.json');

      fs.writeFileSync(versionFile, '1.0.0');
      fs.writeFileSync(packageFile, '{"version":"1.0.0"}');

      const versionMap = {
        VERSION: {
          path: 'VERSION',
          fullPath: versionFile,
          current: '1.0.0',
        },
        packageJson: {
          path: 'package.json',
          fullPath: packageFile,
          current: '1.0.0',
        },
      };

      const result = versionManager.applyVersionBump(versionMap, '1.0.1');

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.updated.length, 2);
      assert.strictEqual(
        versionManager.readVersionFile(versionFile),
        '1.0.1'
      );
      assert.strictEqual(
        versionManager.readVersionFromPackageJson(packageFile),
        '1.0.1'
      );
    });

    it('should reject invalid SemVer', () => {
      const versionMap = {
        VERSION: { path: 'VERSION', fullPath: '/test' },
      };

      const result = versionManager.applyVersionBump(versionMap, 'invalid');

      assert.strictEqual(result.success, false);
    });
  });

  describe('getCurrentVersion()', () => {
    it('should return VERSION file version if present', () => {
      const versionMap = {
        VERSION: { current: '1.0.0' },
        packageJson: { current: '2.0.0' },
      };

      const result = versionManager.getCurrentVersion(versionMap);
      assert.strictEqual(result, '1.0.0');
    });

    it('should return package.json version as fallback', () => {
      const versionMap = {
        packageJson: { current: '2.0.0' },
      };

      const result = versionManager.getCurrentVersion(versionMap);
      assert.strictEqual(result, '2.0.0');
    });

    it('should return null if no version found', () => {
      const result = versionManager.getCurrentVersion({});
      assert.strictEqual(result, null);
    });
  });
});
