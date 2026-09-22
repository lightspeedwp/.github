#!/usr/bin/env node

/**
 * Agent Structure Checker (T035)
 * Phase 4: Standardize Agent Folder Structure
 * Validates that all agents conform to the 7-component folder structure
 */

import fs from 'fs';
import path from 'path';

/**
 * Required components for agent structure (7-item template)
 */
const REQUIRED_COMPONENTS = {
  'AGENT.md': { type: 'file', description: 'Agent definition' },
  'CHANGELOG.md': { type: 'file', description: 'Version history' },
  'package.json': { type: 'file', description: 'Dependencies and scripts' },
  'README.md': { type: 'file', description: 'Documentation' },
  skills: { type: 'directory', description: 'Agent-specific skills' },
  tests: { type: 'directory', description: 'Test suite' },
  config: { type: 'directory', description: 'Configuration files' },
};

class StructureChecker {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.agentsDir = path.join(this.rootDir, 'agents');
    this.results = {
      total: 0,
      conformant: 0,
      nonConformant: 0,
      byAgent: [],
    };
  }

  /**
   * Check a single agent's folder structure
   */
  checkAgent(agentPath) {
    const agentName = path.basename(agentPath);
    const missing = [];
    const present = [];
    const issues = [];

    // Check each required component
    for (const [component, info] of Object.entries(REQUIRED_COMPONENTS)) {
      const componentPath = path.join(agentPath, component);
      const pathExists = fs.existsSync(componentPath);
      const exists =
        pathExists &&
        (info.type === 'directory'
          ? fs.statSync(componentPath).isDirectory()
          : fs.statSync(componentPath).isFile());

      if (!exists) {
        missing.push({
          component,
          type: info.type,
          description: info.description,
        });
      } else {
        present.push(component);

        // Validate file-specific requirements
        // Push whatever issues each validator found, regardless of its own
        // `valid` flag (which only reflects error-severity issues) - warning-only
        // results were previously dropped here and never surfaced to the caller.
        if (component === 'package.json') {
          const validation = this.validatePackageJson(componentPath, agentName);
          issues.push(...validation.issues);
        } else if (component === 'CHANGELOG.md') {
          const validation = this.validateChangelog(componentPath);
          issues.push(...validation.issues);
        } else if (component === 'AGENT.md') {
          const validation = this.validateAgentMd(componentPath);
          issues.push(...validation.issues);
        } else if (component === 'config') {
          const validation = this.validateConfigDir(componentPath);
          issues.push(...validation.issues);
        }
      }
    }

    // Warnings are surfaced in `issues` for reporting but do not gate conformance -
    // phase-4-structure-audit.js already treats error/warning severities differently
    // downstream ("Fix validation errors before component is considered conformant").
    const isConformant =
      missing.length === 0 && issues.filter((issue) => issue.severity === 'error').length === 0;

    return {
      agent: agentName,
      path: agentPath,
      conformant: isConformant,
      present,
      missing,
      issues,
      componentCount: present.length,
      maxComponents: Object.keys(REQUIRED_COMPONENTS).length,
    };
  }

  /**
   * Validate package.json requirements
   */
  validatePackageJson(packageJsonPath, agentName) {
    const issues = [];

    try {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);

      // Check required fields
      if (!pkg.name) {
        issues.push({
          component: 'package.json',
          severity: 'error',
          message: 'Missing "name" field',
        });
      } else if (pkg.name !== `agents-${agentName}`) {
        issues.push({
          component: 'package.json',
          severity: 'error',
          message: `Package name should be "agents-${agentName}", got "${pkg.name}"`,
        });
      }

      if (!pkg.version) {
        issues.push({
          component: 'package.json',
          severity: 'error',
          message: 'Missing "version" field',
        });
      }

      if (!pkg.type || pkg.type !== 'module') {
        issues.push({
          component: 'package.json',
          severity: 'error',
          message: 'Must have "type": "module"',
        });
      }

      if (!pkg.scripts || !pkg.scripts.test) {
        issues.push({
          component: 'package.json',
          severity: 'error',
          message: 'Missing test script in scripts section',
        });
      }

      if (!pkg.scripts || !pkg.scripts.lint) {
        issues.push({
          component: 'package.json',
          severity: 'warning',
          message: 'Missing lint script (recommended)',
        });
      }

      if (!pkg.engines || !pkg.engines.node) {
        issues.push({
          component: 'package.json',
          severity: 'warning',
          message: 'Missing engines.node specification',
        });
      }
    } catch (error) {
      issues.push({
        component: 'package.json',
        severity: 'error',
        message: `Invalid JSON: ${error.message}`,
      });
    }

    return {
      valid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
    };
  }

  /**
   * Validate CHANGELOG.md format
   */
  validateChangelog(changelogPath) {
    const issues = [];

    try {
      const content = fs.readFileSync(changelogPath, 'utf-8');

      if (content.length < 100) {
        issues.push({
          component: 'CHANGELOG.md',
          severity: 'warning',
          message: 'CHANGELOG appears too short (<100 chars)',
        });
      }

      if (!content.includes('##') || !content.includes('Added')) {
        issues.push({
          component: 'CHANGELOG.md',
          severity: 'warning',
          message: 'CHANGELOG should use "## [version]" and "### Added" sections',
        });
      }
    } catch (error) {
      issues.push({
        component: 'CHANGELOG.md',
        severity: 'error',
        message: `Cannot read: ${error.message}`,
      });
    }

    return {
      valid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
    };
  }

  /**
   * Validate AGENT.md format
   */
  validateAgentMd(agentMdPath) {
    const issues = [];

    try {
      const content = fs.readFileSync(agentMdPath, 'utf-8');

      if (content.length < 200) {
        issues.push({
          component: 'AGENT.md',
          severity: 'warning',
          message: 'AGENT.md appears incomplete (<200 chars)',
        });
      }

      const requiredSections = ['Description', 'Capabilities', 'Skills'];
      for (const section of requiredSections) {
        if (!content.includes(section)) {
          issues.push({
            component: 'AGENT.md',
            severity: 'warning',
            message: `Missing recommended section: ${section}`,
          });
        }
      }
    } catch (error) {
      issues.push({
        component: 'AGENT.md',
        severity: 'error',
        message: `Cannot read: ${error.message}`,
      });
    }

    return {
      valid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
    };
  }

  /**
   * Validate config/ directory structure
   */
  validateConfigDir(configDirPath) {
    const issues = [];

    try {
      const files = fs.readdirSync(configDirPath);

      const hasDefaultJson = files.includes('default.json');
      const hasEnvExample = files.includes('.env.example');

      if (!hasDefaultJson) {
        issues.push({
          component: 'config',
          severity: 'warning',
          message: 'Missing config/default.json',
        });
      }

      if (!hasEnvExample) {
        issues.push({
          component: 'config',
          severity: 'warning',
          message: 'Missing config/.env.example',
        });
      }
    } catch (error) {
      issues.push({
        component: 'config',
        severity: 'error',
        message: `Cannot read: ${error.message}`,
      });
    }

    return {
      valid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
    };
  }

  /**
   * Check all agents in the agents/ directory
   */
  checkAllAgents() {
    if (!fs.existsSync(this.agentsDir)) {
      console.error(`Agents directory not found: ${this.agentsDir}`);
      return this.results;
    }

    const entries = fs.readdirSync(this.agentsDir, { withFileTypes: true });
    const agentDirs = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => path.join(this.agentsDir, entry.name));

    for (const agentPath of agentDirs) {
      const result = this.checkAgent(agentPath);
      this.results.byAgent.push(result);

      this.results.total++;
      if (result.conformant) {
        this.results.conformant++;
      } else {
        this.results.nonConformant++;
      }
    }

    return this.results;
  }

  /**
   * Generate summary report
   */
  generateSummary() {
    const total = this.results.total;
    const conformant = this.results.conformant;
    const nonConformant = this.results.nonConformant;
    const conformancePercentage = total > 0 ? Math.round((conformant / total) * 100) : 0;

    return {
      timestamp: new Date().toISOString(),
      summary: {
        total,
        conformant,
        nonConformant,
        conformancePercentage,
      },
      details: this.results.byAgent,
    };
  }
}

export default StructureChecker;
