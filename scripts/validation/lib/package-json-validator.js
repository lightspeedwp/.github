#!/usr/bin/env node

/**
 * Package.json Validator (T042)
 * Phase 4: Standardize Agent Folder Structure
 * Validates package.json compliance with agent requirements
 */

import fs from 'fs';
import path from 'path';

class PackageJsonValidator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.strictMode = options.strict !== false;
  }

  /**
   * Validate a single package.json file
   */
  validate(packageJsonPath) {
    const errors = [];
    const warnings = [];

    try {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      const agentName = path.basename(path.dirname(packageJsonPath));

      // Validate required fields
      this.validateRequiredFields(pkg, agentName, errors);

      // Validate field values
      this.validateFieldValues(pkg, errors, warnings, packageJsonPath);

      // Validate scripts
      this.validateScripts(pkg, errors, warnings);

      // Validate dependencies
      this.validateDependencies(pkg, errors, warnings);

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        path: packageJsonPath,
      };
    } catch (error) {
      errors.push({
        field: 'package.json',
        message: `Invalid JSON: ${error.message}`,
        severity: 'error',
      });
      return {
        valid: false,
        errors,
        warnings,
        path: packageJsonPath,
      };
    }
  }

  /**
   * Validate required fields exist
   */
  validateRequiredFields(pkg, agentName, errors) {
    const requiredFields = ['name', 'version', 'description', 'main', 'type'];

    for (const field of requiredFields) {
      if (!pkg[field]) {
        errors.push({
          field,
          message: `Missing required field: "${field}"`,
          severity: 'error',
        });
      }
    }

    // Additional validation for specific fields
    if (pkg.name) {
      const expectedName = `agents-${agentName}`;
      if (pkg.name !== expectedName) {
        errors.push({
          field: 'name',
          message: `Package name should be "${expectedName}", got "${pkg.name}"`,
          severity: 'error',
        });
      }
    }

    if (pkg.license && pkg.license !== 'MIT') {
      errors.push({
        field: 'license',
        message: `License should be "MIT", got "${pkg.license}"`,
        severity: 'error',
      });
    }
  }

  /**
   * Validate field values
   */
  validateFieldValues(pkg, errors, warnings, packageJsonPath) {
    // Validate type field
    if (pkg.type && pkg.type !== 'module') {
      errors.push({
        field: 'type',
        message: 'Must use ES modules ("type": "module")',
        severity: 'error',
      });
    }

    // Validate version format (semver)
    if (pkg.version && !this.isSemver(pkg.version)) {
      errors.push({
        field: 'version',
        message: `Version "${pkg.version}" is not valid semver (MAJOR.MINOR.PATCH)`,
        severity: 'error',
      });
    }

    // Validate main file exists
    if (pkg.main) {
      const mainPath = path.join(path.dirname(packageJsonPath), pkg.main);
      if (!fs.existsSync(mainPath)) {
        warnings.push({
          field: 'main',
          message: `Main file "${pkg.main}" does not exist`,
          severity: 'warning',
        });
      }
    }

    // Validate engines
    if (!pkg.engines) {
      warnings.push({
        field: 'engines',
        message: 'Missing "engines" field (recommended to specify Node.js version)',
        severity: 'warning',
      });
    } else if (!pkg.engines.node) {
      warnings.push({
        field: 'engines.node',
        message: 'Missing "engines.node" specification',
        severity: 'warning',
      });
    } else if (!pkg.engines.node.includes('18') && !pkg.engines.node.includes('20')) {
      warnings.push({
        field: 'engines.node',
        message: 'Should support Node.js 18+ (e.g., ">=18.0.0")',
        severity: 'warning',
      });
    }
  }

  /**
   * Validate scripts section
   */
  validateScripts(pkg, errors, warnings) {
    if (!pkg.scripts) {
      errors.push({
        field: 'scripts',
        message: 'Missing "scripts" section',
        severity: 'error',
      });
      return;
    }

    // Validate required scripts
    const requiredScripts = ['test', 'lint'];
    for (const script of requiredScripts) {
      if (!pkg.scripts[script]) {
        errors.push({
          field: `scripts.${script}`,
          message: `Missing required script: "${script}"`,
          severity: 'error',
        });
      }
    }

    // Recommend optional scripts
    const recommendedScripts = ['format', 'build'];
    for (const script of recommendedScripts) {
      if (!pkg.scripts[script]) {
        warnings.push({
          field: `scripts.${script}`,
          message: `Recommend adding "${script}" script`,
          severity: 'warning',
        });
      }
    }
  }

  /**
   * Validate dependencies section
   */
  validateDependencies(pkg, errors, warnings) {
    // Check for agent-to-agent dependencies (should be skills instead)
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    };

    for (const [depName] of Object.entries(allDeps || {})) {
      if (depName.startsWith('agents-')) {
        errors.push({
          field: 'dependencies',
          message: `Should not depend on other agents (${depName}). Use skills instead.`,
          severity: 'error',
        });
      }
    }

    // Warn if no devDependencies
    if (!pkg.devDependencies || Object.keys(pkg.devDependencies).length === 0) {
      warnings.push({
        field: 'devDependencies',
        message: 'No devDependencies found (should at least include jest, eslint, prettier)',
        severity: 'warning',
      });
    }

    // Check for common dev deps
    const devDeps = pkg.devDependencies || {};
    const recommendedDevDeps = ['jest', 'eslint', 'prettier'];
    for (const dep of recommendedDevDeps) {
      if (!devDeps[dep]) {
        warnings.push({
          field: 'devDependencies',
          message: `Recommend adding "${dep}" to devDependencies`,
          severity: 'warning',
        });
      }
    }
  }

  /**
   * Check if string is valid semver
   */
  isSemver(version) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
  }

  /**
   * Validate all agents' package.json files
   */
  validateAllAgents() {
    const agentsDir = path.join(this.rootDir, 'agents');
    const results = {
      total: 0,
      valid: 0,
      invalid: 0,
      agents: [],
    };

    if (!fs.existsSync(agentsDir)) {
      console.error(`Agents directory not found: ${agentsDir}`);
      return results;
    }

    const entries = fs.readdirSync(agentsDir, { withFileTypes: true });
    const agentDirs = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => path.join(agentsDir, entry.name));

    for (const agentPath of agentDirs) {
      const packageJsonPath = path.join(agentPath, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        const result = this.validate(packageJsonPath);
        results.agents.push({
          agent: path.basename(agentPath),
          ...result,
        });

        results.total++;
        if (result.valid) {
          results.valid++;
        } else {
          results.invalid++;
        }
      }
    }

    return results;
  }
}

export default PackageJsonValidator;
