/**
 * Agent Structure Checker (T016)
 * Verifies all 7 required components for standardized agent folder structure:
 * 1. AGENT.md (agent definition)
 * 2. CHANGELOG.md (changelog)
 * 3. package.json (dependencies and metadata)
 * 4. README.md (documentation)
 * 5. skills/ (agent-specific skills)
 * 6. tests/ (test suite)
 * 7. config/ (configuration files)
 */

import fs from 'fs';
import path from 'path';

export class StructureChecker {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.requiredFiles = options.requiredFiles || [
      'AGENT.md',
      'CHANGELOG.md',
      'package.json',
      'README.md',
    ];
    this.requiredDirs = options.requiredDirs || ['skills', 'tests', 'config'];
  }

  /**
   * Check if agent folder exists and contains required structure
   */
  checkAgent(agentPath) {
    const fullPath = path.join(this.rootDir, agentPath);
    const result = {
      agent: agentPath,
      exists: fs.existsSync(fullPath),
      conformant: true,
      missing: [],
      warnings: [],
      details: {
        files: {},
        directories: {},
      },
    };

    if (!result.exists) {
      result.conformant = false;
      result.missing.push('Agent folder does not exist');
      return result;
    }

    // Check required files
    for (const file of this.requiredFiles) {
      const filePath = path.join(fullPath, file);
      const exists = fs.existsSync(filePath);
      result.details.files[file] = exists;

      if (!exists) {
        result.conformant = false;
        result.missing.push(`Missing required file: ${file}`);
      }
    }

    // Check required directories
    for (const dir of this.requiredDirs) {
      const dirPath = path.join(fullPath, dir);
      const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
      result.details.directories[dir] = exists;

      if (!exists) {
        result.conformant = false;
        result.missing.push(`Missing required directory: ${dir}`);
      }
    }

    // Additional validation: package.json structure
    if (result.details.files['package.json']) {
      try {
        const pkgPath = path.join(fullPath, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        if (!pkg.name) {
          result.warnings.push('package.json missing required field: name');
        }
        if (!pkg.version) {
          result.warnings.push('package.json missing recommended field: version');
        }
      } catch (error) {
        result.warnings.push(`Cannot parse package.json: ${error.message}`);
      }
    }

    // Additional validation: AGENT.md exists and has content
    if (result.details.files['AGENT.md']) {
      try {
        const agentMdPath = path.join(fullPath, 'AGENT.md');
        const content = fs.readFileSync(agentMdPath, 'utf-8');
        if (!content || content.trim().length === 0) {
          result.warnings.push('AGENT.md is empty');
        }
      } catch (error) {
        result.warnings.push(`Cannot read AGENT.md: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Check all agents in agents/ folder
   */
  checkAllAgents(agentsDir = 'agents') {
    const fullPath = path.join(this.rootDir, agentsDir);
    const results = [];

    if (!fs.existsSync(fullPath)) {
      return results;
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const agentPath = path.join(agentsDir, entry.name);
        results.push(this.checkAgent(agentPath));
      }
    }

    return results;
  }

  /**
   * Generate summary report
   */
  generateSummary(results) {
    const summary = {
      totalAgents: results.length,
      conformant: results.filter((r) => r.conformant).length,
      nonConformant: results.filter((r) => !r.conformant).length,
      conformancePercentage:
        results.length > 0
          ? Math.round((results.filter((r) => r.conformant).length / results.length) * 100)
          : 0,
      missingByFile: {},
      missingByDirectory: {},
    };

    // Count missing files
    for (const file of this.requiredFiles) {
      const missingCount = results.filter((r) => !r.details.files[file]).length;
      if (missingCount > 0) {
        summary.missingByFile[file] = missingCount;
      }
    }

    // Count missing directories
    for (const dir of this.requiredDirs) {
      const missingCount = results.filter((r) => !r.details.directories[dir]).length;
      if (missingCount > 0) {
        summary.missingByDirectory[dir] = missingCount;
      }
    }

    return summary;
  }
}

export default StructureChecker;
