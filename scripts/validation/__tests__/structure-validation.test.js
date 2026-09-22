/**
 * Unit Tests: Structure Validation (T044)
 * Phase 4: Standardize Agent Folder Structure
 * Jest test suite for StructureChecker and PackageJsonValidator
 */

import StructureChecker from '../lib/structure-checker.js';
import PackageJsonValidator from '../lib/package-json-validator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFixturesDir = path.join(__dirname, '../__fixtures__');

describe('StructureChecker', () => {
  describe('checkAgent', () => {
    it('should identify conformant agent with all 7 components', () => {
      const checker = new StructureChecker({ rootDir: __dirname });
      const testAgentPath = path.join(testFixturesDir, 'conformant-agent');

      // Create test agent structure
      fs.mkdirSync(testAgentPath, { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'skills'), { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'tests'), { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'config'), { recursive: true });
      fs.writeFileSync(
        path.join(testAgentPath, 'AGENT.md'),
        '# Conformant Agent\n\n' +
          'Description: a fixture agent used to verify StructureChecker reports zero issues for a fully complete agent folder.\n\n' +
          'Capabilities: exercises every required file and directory.\n\n' +
          'Skills: none, this is a structure-only fixture.'
      );
      fs.writeFileSync(
        path.join(testAgentPath, 'CHANGELOG.md'),
        '# Changelog\n\n## [1.0.0]\n\n### Added\n\n- Initial release of the conformant-agent test fixture used by structure-validation.test.js'
      );
      fs.writeFileSync(
        path.join(testAgentPath, 'package.json'),
        JSON.stringify({
          name: 'agents-conformant-agent',
          version: '1.0.0',
          type: 'module',
          main: 'index.js',
          scripts: { test: 'jest', lint: 'eslint' },
          engines: { node: '>=18.0.0' },
        })
      );
      fs.writeFileSync(path.join(testAgentPath, 'README.md'), '# README');
      fs.writeFileSync(path.join(testAgentPath, 'config', 'default.json'), '{}');
      fs.writeFileSync(path.join(testAgentPath, 'config', '.env.example'), '# env');

      const result = checker.checkAgent(testAgentPath);

      expect(result.conformant).toBe(true);
      expect(result.present.length).toBe(7);
      expect(result.missing.length).toBe(0);
      expect(result.issues.length).toBe(0);

      // Cleanup
      fs.rmSync(testAgentPath, { recursive: true });
    });

    it('should identify non-conformant agent with missing components', () => {
      const checker = new StructureChecker({ rootDir: __dirname });
      const testAgentPath = path.join(testFixturesDir, 'non-conformant-agent');

      // Create incomplete agent structure
      fs.mkdirSync(testAgentPath, { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'tests'), { recursive: true });
      fs.writeFileSync(path.join(testAgentPath, 'AGENT.md'), '# Agent');
      fs.writeFileSync(path.join(testAgentPath, 'README.md'), '# README');

      const result = checker.checkAgent(testAgentPath);

      expect(result.conformant).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
      expect(result.missing.map((m) => m.component)).toContain('CHANGELOG.md');
      expect(result.missing.map((m) => m.component)).toContain('package.json');
      expect(result.missing.map((m) => m.component)).toContain('skills');

      // Cleanup
      fs.rmSync(testAgentPath, { recursive: true });
    });

    it('should validate package.json name matches agent name', () => {
      const checker = new StructureChecker({ rootDir: __dirname });
      const testAgentPath = path.join(testFixturesDir, 'name-mismatch-agent');

      // Create agent with mismatched package name
      fs.mkdirSync(testAgentPath, { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'skills'), { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'tests'), { recursive: true });
      fs.mkdirSync(path.join(testAgentPath, 'config'), { recursive: true });
      fs.writeFileSync(path.join(testAgentPath, 'AGENT.md'), '# Agent');
      fs.writeFileSync(
        path.join(testAgentPath, 'CHANGELOG.md'),
        '# Changelog\n## [1.0.0]\n### Added\n- Initial'
      );
      fs.writeFileSync(
        path.join(testAgentPath, 'package.json'),
        JSON.stringify({
          name: 'wrong-name',
          version: '1.0.0',
          type: 'module',
          main: 'index.js',
          scripts: { test: 'jest' },
        })
      );
      fs.writeFileSync(path.join(testAgentPath, 'README.md'), '# README');
      fs.writeFileSync(path.join(testAgentPath, 'config', 'default.json'), '{}');
      fs.writeFileSync(path.join(testAgentPath, 'config', '.env.example'), '# env');

      const result = checker.checkAgent(testAgentPath);

      expect(result.conformant).toBe(false);
      expect(result.issues.some((i) => i.message.includes('should be'))).toBe(true);

      // Cleanup
      fs.rmSync(testAgentPath, { recursive: true });
    });
  });

  describe('validatePackageJson', () => {
    it('should identify missing required fields', () => {
      const checker = new StructureChecker();
      const tempPath = path.join(testFixturesDir, 'package.json');
      fs.writeFileSync(tempPath, JSON.stringify({}));

      const result = checker.validatePackageJson(tempPath, 'test-agent');

      expect(result.valid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);

      fs.unlinkSync(tempPath);
    });

    it('should validate type field is module', () => {
      const checker = new StructureChecker();
      const tempPath = path.join(testFixturesDir, 'package.json');
      fs.writeFileSync(
        tempPath,
        JSON.stringify({
          name: 'agents-test',
          version: '1.0.0',
          type: 'commonjs',
        })
      );

      const result = checker.validatePackageJson(tempPath, 'test-agent');

      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.message.includes('module'))).toBe(true);

      fs.unlinkSync(tempPath);
    });
  });

  describe('generateSummary', () => {
    it('should calculate conformance percentage', () => {
      const checker = new StructureChecker();

      // Simulate results
      checker.results = {
        total: 10,
        conformant: 7,
        nonConformant: 3,
        byAgent: [],
      };

      const summary = checker.generateSummary();

      expect(summary.summary.total).toBe(10);
      expect(summary.summary.conformant).toBe(7);
      expect(summary.summary.nonConformant).toBe(3);
      expect(summary.summary.conformancePercentage).toBe(70);
    });
  });
});

describe('PackageJsonValidator', () => {
  describe('validate', () => {
    it('should validate conformant package.json', () => {
      const validator = new PackageJsonValidator();
      const tempDir = path.join(testFixturesDir, 'valid-agent');
      fs.mkdirSync(tempDir, { recursive: true });
      const packageJsonPath = path.join(tempDir, 'package.json');

      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify({
          name: 'agents-valid-agent',
          version: '1.0.0',
          description: 'Test agent',
          main: 'index.js',
          type: 'module',
          license: 'MIT',
          engines: { node: '>=18.0.0' },
          scripts: { test: 'jest', lint: 'eslint' },
          devDependencies: { jest: '^29.0.0', eslint: '^8.0.0' },
        })
      );

      const result = validator.validate(packageJsonPath);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);

      fs.rmSync(tempDir, { recursive: true });
    });

    it('should reject agent-to-agent dependencies', () => {
      const validator = new PackageJsonValidator();
      const tempDir = path.join(testFixturesDir, 'invalid-agent');
      fs.mkdirSync(tempDir, { recursive: true });
      const packageJsonPath = path.join(tempDir, 'package.json');

      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify({
          name: 'agents-invalid-agent',
          version: '1.0.0',
          description: 'Test agent',
          main: 'index.js',
          type: 'module',
          scripts: { test: 'jest' },
          dependencies: { 'agents-other-agent': '^1.0.0' },
        })
      );

      const result = validator.validate(packageJsonPath);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.message.includes('Should not depend on other agents'))
      ).toBe(true);

      fs.rmSync(tempDir, { recursive: true });
    });

    it('should validate semver version format', () => {
      const validator = new PackageJsonValidator();

      expect(validator.isSemver('1.0.0')).toBe(true);
      expect(validator.isSemver('2.1.3')).toBe(true);
      expect(validator.isSemver('0.0.1')).toBe(true);
      expect(validator.isSemver('1.0')).toBe(false);
      expect(validator.isSemver('latest')).toBe(false);
    });
  });
});

// Ensure fixtures directory exists
if (!fs.existsSync(testFixturesDir)) {
  fs.mkdirSync(testFixturesDir, { recursive: true });
}
