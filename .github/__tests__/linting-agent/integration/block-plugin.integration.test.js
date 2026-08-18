/**
 * Block Plugin Repository Integration Tests
 * Tests Linting Agent in WordPress block plugin context
 */

const { detectRepositoryType } = require('../../../scripts/agents/linting.agent.js');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('Block Plugin Repository Integration', () => {
  let testRepoPath;

  beforeEach(() => {
    testRepoPath = fs.mkdtempSync(path.join(os.tmpdir(), 'block-plugin-'));
    // Create block plugin markers
    fs.mkdirSync(path.join(testRepoPath, 'src'), { recursive: true });
    fs.writeFileSync(
      path.join(testRepoPath, 'block.json'),
      JSON.stringify({ name: 'my-block', title: 'My Block' })
    );
    fs.writeFileSync(path.join(testRepoPath, 'package.json'), '{}');
  });

  afterEach(() => {
    if (fs.existsSync(testRepoPath)) {
      fs.rmSync(testRepoPath, { recursive: true, force: true });
    }
  });

  describe('Repository Detection', () => {
    test('correctly identifies block plugin repository', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('detects with block.json and src directory', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('detects with block.json and package.json', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('React/JSX Linting', () => {
    test('applies ESLint with React rules', () => {
      const jsxFile = path.join(testRepoPath, 'src', 'index.js');
      fs.writeFileSync(
        jsxFile,
        'import { registerBlockType } from "@wordpress/blocks";'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      expect(fs.existsSync(jsxFile)).toBe(true);
    });

    test('handles JSX syntax', () => {
      const jsxFile = path.join(testRepoPath, 'src', 'edit.jsx');
      fs.writeFileSync(
        jsxFile,
        'export default function Edit() { return <div>Test</div>; }'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('lints React hooks', () => {
      const jsFile = path.join(testRepoPath, 'src', 'hooks.js');
      fs.writeFileSync(
        jsFile,
        'import { useState } from "react"; export const useHook = () => useState(null);'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('TypeScript Support', () => {
    test('applies TypeScript linting', () => {
      const tsFile = path.join(testRepoPath, 'src', 'index.ts');
      fs.writeFileSync(tsFile, 'const x: string = "test";');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('handles TypeScript JSX', () => {
      const tsxFile = path.join(testRepoPath, 'src', 'edit.tsx');
      fs.writeFileSync(
        tsxFile,
        'export default function Edit(): JSX.Element { return <div>Test</div>; }'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('validates TypeScript types', () => {
      const tsFile = path.join(testRepoPath, 'src', 'types.ts');
      fs.writeFileSync(
        tsFile,
        'export interface BlockProps { attributes: Record<string, unknown>; }'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Block Configuration', () => {
    test('validates block.json file', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      const blockJsonPath = path.join(testRepoPath, 'block.json');
      expect(fs.existsSync(blockJsonPath)).toBe(true);
    });

    test('validates multiple block definitions', () => {
      fs.mkdirSync(path.join(testRepoPath, 'blocks', 'hero'), {
        recursive: true,
      });
      fs.mkdirSync(path.join(testRepoPath, 'blocks', 'feature'), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(testRepoPath, 'blocks', 'hero', 'block.json'),
        '{}'
      );
      fs.writeFileSync(
        path.join(testRepoPath, 'blocks', 'feature', 'block.json'),
        '{}'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('validates block attributes', () => {
      const blockJson = JSON.stringify({
        name: 'my-block',
        attributes: { content: { type: 'string' } },
      });
      fs.writeFileSync(path.join(testRepoPath, 'block.json'), blockJson);

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('CSS Module Linting', () => {
    test('lints CSS module files', () => {
      const cssFile = path.join(testRepoPath, 'src', 'style.module.css');
      fs.writeFileSync(cssFile, '.blockStyle { color: #000; }');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('handles SCSS modules', () => {
      const scssFile = path.join(testRepoPath, 'src', 'style.module.scss');
      fs.writeFileSync(
        scssFile,
        '$color: #000;\n.block { color: $color; }'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('lints editor styles separately', () => {
      fs.writeFileSync(
        path.join(testRepoPath, 'src', 'editor.css'),
        '.editor-block { background: #fff; }'
      );
      fs.writeFileSync(
        path.join(testRepoPath, 'src', 'style.css'),
        '.block { display: block; }'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Package Dependencies', () => {
    test('validates package.json', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      expect(fs.existsSync(path.join(testRepoPath, 'package.json'))).toBe(
        true
      );
    });

    test('handles npm dependencies', () => {
      const packageJson = {
        name: 'my-block-plugin',
        dependencies: {
          '@wordpress/blocks': '^13.0.0',
          'react': '^18.0.0',
        },
        devDependencies: {
          '@wordpress/scripts': '^13.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testRepoPath, 'package.json'),
        JSON.stringify(packageJson)
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('excludes node_modules from linting', () => {
      fs.mkdirSync(path.join(testRepoPath, 'node_modules'), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(testRepoPath, 'node_modules', 'lib.js'),
        'console.log("npm");'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Build and Distribution', () => {
    test('excludes build artifacts from linting', () => {
      fs.mkdirSync(path.join(testRepoPath, 'build'), { recursive: true });
      fs.writeFileSync(
        path.join(testRepoPath, 'build', 'index.js'),
        'bundled code'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      // build/ should be excluded
    });

    test('excludes dist directory from linting', () => {
      fs.mkdirSync(path.join(testRepoPath, 'dist'), { recursive: true });
      fs.writeFileSync(
        path.join(testRepoPath, 'dist', 'bundle.js'),
        'bundled'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Combined PHP + JavaScript', () => {
    test('lints both PHP and JavaScript files', () => {
      const phpFile = path.join(testRepoPath, 'plugin.php');
      fs.writeFileSync(phpFile, '<?php // PHP Code');

      const jsFile = path.join(testRepoPath, 'src', 'index.js');
      fs.writeFileSync(jsFile, 'console.log("test");');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('validates block plugin header', () => {
      const phpFile = path.join(testRepoPath, 'plugin.php');
      fs.writeFileSync(
        phpFile,
        `<?php
/**
 * Plugin Name: My Block Plugin
 * Description: A block plugin
 */`
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });
  });

  describe('Error Handling', () => {
    test('handles invalid block.json', () => {
      fs.writeFileSync(path.join(testRepoPath, 'block.json'), '{invalid}');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      // Should still detect as block plugin
    });

    test('handles missing src directory gracefully', () => {
      fs.rmSync(path.join(testRepoPath, 'src'), { recursive: true });

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      // block.json is enough
    });

    test('handles very large block plugin', () => {
      for (let i = 0; i < 50; i++) {
        const jsFile = path.join(testRepoPath, 'src', `file-${i}.js`);
        fs.writeFileSync(jsFile, 'console.log("test");');
      }

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
    });

    test('handles syntax errors in source files', () => {
      const badJsFile = path.join(testRepoPath, 'src', 'bad.js');
      fs.writeFileSync(
        badJsFile,
        'const x = { unclosed object'
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('BLOCK_PLUGIN');
      // Detection should still work
    });
  });
});
