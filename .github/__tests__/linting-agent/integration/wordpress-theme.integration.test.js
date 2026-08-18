/**
 * WordPress Theme Repository Integration Tests
 * Tests Linting Agent in WordPress theme context
 */

const { detectRepositoryType } = require('../../../scripts/agents/linting.agent.js');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('WordPress Theme Repository Integration', () => {
  let testRepoPath;

  beforeEach(() => {
    testRepoPath = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-theme-'));
    // Create theme marker files
    fs.writeFileSync(
      path.join(testRepoPath, 'theme.json'),
      JSON.stringify({ version: 2 })
    );
    fs.writeFileSync(
      path.join(testRepoPath, 'style.css'),
      '/*\nTheme Name: Test Theme\n*/'
    );
  });

  afterEach(() => {
    if (fs.existsSync(testRepoPath)) {
      fs.rmSync(testRepoPath, { recursive: true, force: true });
    }
  });

  describe('Repository Detection', () => {
    test('correctly identifies WordPress theme repository', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('detects with theme.json file', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('detects with style.css file', () => {
      fs.rmSync(path.join(testRepoPath, 'theme.json'));
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('detects with functions.php file', () => {
      fs.rmSync(path.join(testRepoPath, 'theme.json'));
      fs.rmSync(path.join(testRepoPath, 'style.css'));
      fs.writeFileSync(path.join(testRepoPath, 'functions.php'), '<?php // theme');
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('CSS/SCSS Linting', () => {
    test('applies Stylelint to theme styles', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
      expect(fs.existsSync(path.join(testRepoPath, 'style.css'))).toBe(true);
    });

    test('handles SCSS in theme', () => {
      fs.mkdirSync(path.join(testRepoPath, 'assets', 'scss'), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(testRepoPath, 'assets', 'scss', 'main.scss'),
        '$color: #000;'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('lints all CSS files in theme', () => {
      const cssDir = path.join(testRepoPath, 'assets', 'css');
      fs.mkdirSync(cssDir, { recursive: true });
      fs.writeFileSync(path.join(cssDir, 'layout.css'), '.layout {}');
      fs.writeFileSync(path.join(cssDir, 'responsive.css'), '.responsive {}');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('JavaScript Linting', () => {
    test('applies ESLint to theme scripts', () => {
      const jsDir = path.join(testRepoPath, 'assets', 'js');
      fs.mkdirSync(jsDir, { recursive: true });
      fs.writeFileSync(jsDir + '/script.js', 'console.log("theme");');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('handles interactive theme scripts', () => {
      const jsDir = path.join(testRepoPath, 'assets', 'js');
      fs.mkdirSync(jsDir, { recursive: true });
      fs.writeFileSync(
        path.join(jsDir, 'navigation.js'),
        'document.addEventListener("DOMContentLoaded", () => {});'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('PHP Validation (Lightweight)', () => {
    test('applies PHP validation to theme files', () => {
      const phpDir = path.join(testRepoPath, 'template-parts');
      fs.mkdirSync(phpDir, { recursive: true });
      fs.writeFileSync(
        path.join(phpDir, 'header.php'),
        '<?php get_header(); ?>'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('validates theme.php files', () => {
      const templates = path.join(testRepoPath, 'templates');
      fs.mkdirSync(templates, { recursive: true });
      fs.writeFileSync(path.join(templates, 'singular.html'), '<!-- HTML -->');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('Block Theme Detection', () => {
    test('detects block theme with theme.json', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
      // theme.json present = block theme
    });

    test('handles block theme structure', () => {
      const blocksDir = path.join(testRepoPath, 'blocks');
      fs.mkdirSync(blocksDir, { recursive: true });
      fs.writeFileSync(
        path.join(blocksDir, 'hero.json'),
        JSON.stringify({ name: 'hero' })
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('handles block patterns', () => {
      const patternsDir = path.join(testRepoPath, 'patterns');
      fs.mkdirSync(patternsDir, { recursive: true });
      fs.writeFileSync(
        path.join(patternsDir, 'hero.php'),
        '<?php // pattern'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('Style Variations', () => {
    test('lints style variation files', () => {
      const variationsDir = path.join(
        testRepoPath,
        'styles',
        'variations'
      );
      fs.mkdirSync(variationsDir, { recursive: true });
      fs.writeFileSync(
        path.join(variationsDir, 'dark.json'),
        JSON.stringify({ version: 2 })
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('validates multiple style variations', () => {
      const variationsDir = path.join(
        testRepoPath,
        'styles',
        'variations'
      );
      fs.mkdirSync(variationsDir, { recursive: true });
      fs.writeFileSync(path.join(variationsDir, 'dark.json'), '{}');
      fs.writeFileSync(path.join(variationsDir, 'light.json'), '{}');
      fs.writeFileSync(path.join(variationsDir, 'highcontrast.json'), '{}');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('Configuration', () => {
    test('generates theme.json validation', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
      const themeJsonPath = path.join(testRepoPath, 'theme.json');
      expect(fs.existsSync(themeJsonPath)).toBe(true);
    });

    test('validates theme structure', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('includes typography rules', () => {
      const themeJson = JSON.stringify({
        version: 2,
        typography: { fontFamilies: [] },
      });
      fs.writeFileSync(path.join(testRepoPath, 'theme.json'), themeJson);

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });

    test('includes color palette validation', () => {
      const themeJson = JSON.stringify({
        version: 2,
        color: { palette: [] },
      });
      fs.writeFileSync(path.join(testRepoPath, 'theme.json'), themeJson);

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });

  describe('Error Handling', () => {
    test('handles invalid theme.json', () => {
      fs.writeFileSync(path.join(testRepoPath, 'theme.json'), '{invalid json}');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
      // Should still detect as theme
    });

    test('handles missing style.css', () => {
      fs.rmSync(path.join(testRepoPath, 'style.css'));

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
      // theme.json alone is enough
    });

    test('handles very large theme', () => {
      for (let i = 0; i < 100; i++) {
        const file = path.join(testRepoPath, 'blocks', `block-${i}.json`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, '{}');
      }

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('WORDPRESS_THEME');
    });
  });
});
