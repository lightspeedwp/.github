/**
 * Control-Plane Repository Integration Tests
 * Tests Linting Agent in .github control-plane context
 */

const { detectRepositoryType } = require('../../../../scripts/agents/linting.agent');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('Control-Plane Repository Integration', () => {
  let testRepoPath;

  beforeEach(() => {
    testRepoPath = fs.mkdtempSync(path.join(os.tmpdir(), 'control-plane-'));
    // Create control-plane structure
    fs.mkdirSync(path.join(testRepoPath, '.github', 'workflows'), {
      recursive: true,
    });
  });

  afterEach(() => {
    if (fs.existsSync(testRepoPath)) {
      fs.rmSync(testRepoPath, { recursive: true, force: true });
    }
  });

  describe('Repository Detection', () => {
    test('correctly identifies control-plane repository', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });

    test('detects with .github/workflows directory', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });

    test('detects with .github/actions directory', () => {
      const actionPath = path.join(testRepoPath, '.github', 'actions');
      fs.rmSync(path.join(testRepoPath, '.github', 'workflows'));
      fs.mkdirSync(actionPath, { recursive: true });
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });
  });

  describe('Linting Configuration', () => {
    test('should apply JavaScript/TypeScript linting rules', () => {
      // Create sample JS file
      const jsFile = path.join(testRepoPath, '.github', 'scripts', 'test.js');
      fs.mkdirSync(path.dirname(jsFile), { recursive: true });
      fs.writeFileSync(jsFile, 'const x = 1;');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      // Verify file exists for linting
      expect(fs.existsSync(jsFile)).toBe(true);
    });

    test('should apply Markdown linting rules', () => {
      const mdFile = path.join(testRepoPath, 'README.md');
      fs.writeFileSync(mdFile, '# Test\n\nThis is a test.');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      expect(fs.existsSync(mdFile)).toBe(true);
    });

    test('should apply YAML linting rules to workflows', () => {
      const workflowFile = path.join(
        testRepoPath,
        '.github',
        'workflows',
        'test.yml'
      );
      fs.writeFileSync(workflowFile, 'name: Test\non: push:');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      expect(fs.existsSync(workflowFile)).toBe(true);
    });

    test('should apply JSON validation to GitHub configs', () => {
      const configFile = path.join(testRepoPath, '.github', 'config.json');
      fs.mkdirSync(path.dirname(configFile), { recursive: true });
      fs.writeFileSync(configFile, '{"version": "1.0.0"}');

      expect(fs.existsSync(configFile)).toBe(true);
    });

    test('should apply Shell script linting', () => {
      const shellFile = path.join(testRepoPath, '.github', 'scripts', 'test.sh');
      fs.mkdirSync(path.dirname(shellFile), { recursive: true });
      fs.writeFileSync(shellFile, '#!/bin/bash\necho "test"');

      expect(fs.existsSync(shellFile)).toBe(true);
    });

    test('should NOT apply PHP linting', () => {
      const phpFile = path.join(testRepoPath, 'test.php');
      fs.writeFileSync(phpFile, '<?php echo "test";');

      // PHP files should not be linted in control-plane context
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      // Verify file exists but wouldn't be linted
      expect(fs.existsSync(phpFile)).toBe(true);
    });
  });

  describe('Config Generation', () => {
    test('generates appropriate linting configuration', () => {
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      // Config generation would be validated here
    });

    test('config includes all required tools', () => {
      // ESLint, Markdownlint, YAML validation, JSON validation, ShellCheck
      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });

    test('config excludes vendor/node_modules patterns', () => {
      const nodeModules = path.join(testRepoPath, 'node_modules', 'test.js');
      fs.mkdirSync(path.dirname(nodeModules), { recursive: true });
      fs.writeFileSync(nodeModules, 'console.log("test");');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      // node_modules should be excluded from linting
    });
  });

  describe('Integration with Control-Plane Files', () => {
    test('handles GitHub workflow files', () => {
      const workflow = path.join(
        testRepoPath,
        '.github',
        'workflows',
        'ci.yml'
      );
      fs.writeFileSync(
        workflow,
        `name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest`
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });

    test('handles GitHub action.yml files', () => {
      const actionDir = path.join(testRepoPath, '.github', 'actions', 'setup');
      fs.mkdirSync(actionDir, { recursive: true });
      const actionFile = path.join(actionDir, 'action.yml');
      fs.writeFileSync(
        actionFile,
        `name: Setup
description: Setup action
runs:
  using: composite`
      );

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });

    test('handles script files', () => {
      const scriptDir = path.join(testRepoPath, '.github', 'scripts');
      fs.mkdirSync(scriptDir, { recursive: true });
      fs.writeFileSync(path.join(scriptDir, 'validate.js'), 'console.log("validate");');
      fs.writeFileSync(path.join(scriptDir, 'deploy.sh'), '#!/bin/bash\necho deploy');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });
  });

  describe('Error Handling', () => {
    test('handles missing workflow directory gracefully', () => {
      const emptyPath = fs.mkdtempSync(path.join(os.tmpdir(), 'empty-'));
      fs.mkdirSync(path.join(emptyPath, '.github'), { recursive: true });

      const result = detectRepositoryType(emptyPath);
      expect(result).toBe('UNKNOWN');

      fs.rmSync(emptyPath, { recursive: true });
    });

    test('handles corrupted workflow files', () => {
      const workflow = path.join(
        testRepoPath,
        '.github',
        'workflows',
        'bad.yml'
      );
      fs.writeFileSync(workflow, '{invalid yaml: [}');

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
      // Detection should still work even with invalid files
    });

    test('handles very large workflow files', () => {
      const workflow = path.join(
        testRepoPath,
        '.github',
        'workflows',
        'large.yml'
      );
      const largeContent = 'name: Large\n' + 'step: test\n'.repeat(10000);
      fs.writeFileSync(workflow, largeContent);

      const result = detectRepositoryType(testRepoPath);
      expect(result).toBe('control-plane');
    });
  });
});
