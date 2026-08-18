/**
 * Repository Detection Tests
 * Tests for detectRepositoryType() function identifying repository context
 */

const { detectRepositoryType } = require('../../../scripts/agents/linting.agent.js');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('Repository Detection', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'linting-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Control Plane Detection', () => {
    test('detects control-plane repository with .github/workflows directory', () => {
      fs.mkdirSync(path.join(tempDir, '.github', 'workflows'), { recursive: true });
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('CONTROL_PLANE');
    });

    test('detects control-plane repository with .github/actions directory', () => {
      fs.mkdirSync(path.join(tempDir, '.github', 'actions'), { recursive: true });
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('CONTROL_PLANE');
    });

    test('detects control-plane repository with .github/scripts directory', () => {
      fs.mkdirSync(path.join(tempDir, '.github', 'scripts'), { recursive: true });
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('CONTROL_PLANE');
    });
  });

  describe('WordPress Plugin Detection', () => {
    test('detects WordPress plugin repository with plugin.php file', () => {
      fs.writeFileSync(path.join(tempDir, 'plugin.php'), '<?php // Plugin file');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('WORDPRESS_PLUGIN');
    });

    test('detects WordPress plugin repository with main plugin file in subdirectory', () => {
      fs.mkdirSync(path.join(tempDir, 'includes'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'my-plugin.php'), '<?php // Plugin file');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('WORDPRESS_PLUGIN');
    });
  });

  describe('WordPress Theme Detection', () => {
    test('detects WordPress theme repository with theme.json file', () => {
      fs.writeFileSync(path.join(tempDir, 'theme.json'), '{}');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('detects WordPress theme repository with style.css file', () => {
      fs.writeFileSync(path.join(tempDir, 'style.css'), '/* Theme stylesheet */');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('detects WordPress theme repository with functions.php file', () => {
      fs.writeFileSync(path.join(tempDir, 'functions.php'), '<?php // Theme functions');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('Block Plugin Detection', () => {
    test('detects block plugin with block.json and src directory', () => {
      fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'block.json'), '{}');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('detects block plugin with block.json and package.json', () => {
      fs.writeFileSync(path.join(tempDir, 'block.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Ambiguous Repository Detection', () => {
    test('prefers CONTROL_PLANE when both control-plane and plugin markers exist', () => {
      fs.mkdirSync(path.join(tempDir, '.github', 'workflows'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'plugin.php'), '<?php // Plugin file');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('CONTROL_PLANE');
    });

    test('prefers WORDPRESS_PLUGIN when both plugin and theme markers exist', () => {
      fs.writeFileSync(path.join(tempDir, 'plugin.php'), '<?php // Plugin file');
      fs.writeFileSync(path.join(tempDir, 'theme.json'), '{}');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('WORDPRESS_PLUGIN');
    });

    test('prefers BLOCK_PLUGIN when multiple markers exist', () => {
      fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'block.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'plugin.php'), '<?php // Plugin file');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Unknown Repository Detection', () => {
    test('returns UNKNOWN for empty repository', () => {
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('UNKNOWN');
    });

    test('returns UNKNOWN for generic Node.js repository', () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('UNKNOWN');
    });

    test('returns UNKNOWN for generic Python repository', () => {
      fs.writeFileSync(path.join(tempDir, 'requirements.txt'), '');
      const result = detectRepositoryType(tempDir);
      expect(result).toBe('UNKNOWN');
    });
  });

  describe('Custom Repository Paths', () => {
    test('handles custom path resolution', () => {
      const customPath = path.join(tempDir, 'custom-repo');
      fs.mkdirSync(customPath, { recursive: true });
      fs.writeFileSync(path.join(customPath, 'plugin.php'), '<?php // Plugin');
      const result = detectRepositoryType(customPath);
      expect(result).toBe('WORDPRESS_PLUGIN');
    });

    test('handles relative paths', () => {
      fs.writeFileSync(path.join(tempDir, 'plugin.php'), '<?php // Plugin');
      const originalCwd = process.cwd();
      try {
        process.chdir(tempDir);
        const result = detectRepositoryType('.');
        expect(result).toBe('WORDPRESS_PLUGIN');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('Error Handling', () => {
    test('throws error for non-existent directory', () => {
      const nonExistentPath = path.join(tempDir, 'does-not-exist');
      expect(() => detectRepositoryType(nonExistentPath)).toThrow();
    });

    test('throws error for null path', () => {
      expect(() => detectRepositoryType(null)).toThrow();
    });

    test('throws error for undefined path', () => {
      expect(() => detectRepositoryType(undefined)).toThrow();
    });
  });
});
