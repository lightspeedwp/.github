/**
 * Auto-Fixer (T024)
 * Automatically applies fixes to broken references in files
 */

import fs from 'fs';
import path from 'path';

export class AutoFixer {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.dryRun = options.dryRun || false;
    this.backup = options.backup || true;
    this.fixes = [];
  }

  /**
   * Fix JavaScript imports
   */
  fixJSImports(content, oldValue, newValue) {
    let fixed = content;

    // require() statements
    fixed = fixed.replace(
      new RegExp(`require\\(['"]${this.escapeRegex(oldValue)}['"]`, 'g'),
      `require('${newValue}'`
    );

    // import statements
    fixed = fixed.replace(
      new RegExp(`from\\s+['"]${this.escapeRegex(oldValue)}['"]`, 'g'),
      `from '${newValue}'`
    );

    // Dynamic imports
    fixed = fixed.replace(
      new RegExp(`import\\(['"]${this.escapeRegex(oldValue)}['"]`, 'g'),
      `import('${newValue}'`
    );

    return {
      content: fixed,
      changed: fixed !== content,
    };
  }

  /**
   * Fix shell script paths
   */
  fixShellPaths(content, oldValue, newValue) {
    let fixed = content;

    // Direct path references
    fixed = fixed.replace(new RegExp(this.escapeRegex(oldValue), 'g'), newValue);

    return {
      content: fixed,
      changed: fixed !== content,
    };
  }

  /**
   * Fix GitHub workflow references
   */
  fixWorkflowReferences(content, oldValue, newValue) {
    let fixed = content;

    // uses: references
    const usesPattern = new RegExp(
      `uses:\\s*lightspeedwp/\\.github/\\.?agents/${this.escapeRegex(oldValue)}`,
      'g'
    );
    fixed = fixed.replace(usesPattern, `uses: lightspeedwp/.github/agents/${newValue}`);

    // run: commands with agent invocation
    fixed = fixed.replace(
      new RegExp(`npm\\s+run\\s+agent:${this.escapeRegex(oldValue)}`, 'g'),
      `npm run agent:${newValue}`
    );

    fixed = fixed.replace(
      new RegExp(`agents/${this.escapeRegex(oldValue)}`, 'g'),
      `agents/${newValue}`
    );

    return {
      content: fixed,
      changed: fixed !== content,
    };
  }

  /**
   * Apply fix to a file
   */
  applyFixToFile(filePath, oldValue, newValue, referenceType) {
    const fullPath = path.join(this.rootDir, filePath);

    if (!fs.existsSync(fullPath)) {
      return {
        file: filePath,
        success: false,
        error: `File not found: ${fullPath}`,
      };
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let result;

      // Determine fix strategy based on file type and reference type
      const ext = path.extname(filePath);
      if (ext === '.js' || ext === '.cjs' || ext === '.mjs') {
        result = this.fixJSImports(content, oldValue, newValue);
      } else if (ext === '.sh' || ext === '.bash') {
        result = this.fixShellPaths(content, oldValue, newValue);
      } else if (ext === '.yml' || ext === '.yaml') {
        result = this.fixWorkflowReferences(content, oldValue, newValue);
      } else {
        result = this.fixShellPaths(content, oldValue, newValue);
      }

      if (!result.changed) {
        return {
          file: filePath,
          success: true,
          changed: false,
          message: 'No changes needed',
        };
      }

      // Backup original file if enabled
      if (this.backup && !this.dryRun) {
        const backupPath = `${fullPath}.backup`;
        fs.writeFileSync(backupPath, content);
      }

      // Write fixed content if not in dry-run mode
      if (!this.dryRun) {
        fs.writeFileSync(fullPath, result.content);
      }

      this.fixes.push({
        file: filePath,
        oldValue,
        newValue,
        type: referenceType,
        dryRun: this.dryRun,
      });

      return {
        file: filePath,
        success: true,
        changed: true,
        dryRun: this.dryRun,
        message: `${this.dryRun ? '[DRY-RUN] ' : ''}Fixed ${referenceType} reference`,
      };
    } catch (error) {
      return {
        file: filePath,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Apply fixes in batch
   */
  applyFixesBatch(fixItems) {
    const results = [];

    for (const fix of fixItems) {
      const result = this.applyFixToFile(fix.file, fix.oldValue, fix.newValue, fix.type);
      results.push(result);
    }

    return {
      totalFixes: fixItems.length,
      successCount: results.filter((r) => r.success).length,
      changedCount: results.filter((r) => r.changed).length,
      dryRun: this.dryRun,
      results,
    };
  }

  /**
   * Escape special regex characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get fix summary
   */
  getSummary() {
    return {
      totalApplied: this.fixes.length,
      fixes: this.fixes,
      dryRun: this.dryRun,
    };
  }
}

export default AutoFixer;
