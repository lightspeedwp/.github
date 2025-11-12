#!/usr/bin/env node

/**
 * Fix References Script
 *
 * Scans all markdown files with frontmatter and validates/fixes broken
 * reference links in the `references` array. Applies a fix map for known
 * moved files and reports broken references.
 *
 * @fileoverview Reference link validation and automatic repair
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

// Configuration
const CONFIG = {
  rootDir: process.cwd(),
  patterns: [
    '.github/**/*.md',
    'docs/**/*.md',
    '*.md'
  ],
  excludePatterns: [
    'node_modules/**',
    '.git/**',
    'coverage/**',
    'logs/**'
  ],
  // Fix map for known moved/renamed files
  fixMap: {
    // Old path -> New path
    'schemas/frontmatter/frontmatter.schema.json': 'schemas/frontmatter.schema.json',
    '.github/docs/VERSIONING.md': 'docs/VERSIONING.md',
    '.github/automation/labels.yml': '.github/labeler.yml',
    // Add more mappings as files are moved
  },
  // GitHub blob URL pattern for external references
  githubBlobPattern: /^https?:\/\/github\.com\/[^\/]+\/[^\/]+\/blob\/[^\/]+\//,
  logFile: path.join(process.cwd(), 'logs', 'fix-references.log')
};

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const yamlFrontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(yamlFrontmatterRegex);

  if (!match) {
    return { frontmatter: null, content, raw: '' };
  }

  try {
    const frontmatter = yaml.load(match[1]);
    return {
      frontmatter,
      content: match[2],
      raw: match[1]
    };
  } catch (error) {
    return { frontmatter: null, content, raw: '', error: error.message };
  }
}

/**
 * Check if a file exists at the given path
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Resolve a reference path relative to a file
 */
function resolveReferencePath(referencePath, fromFile) {
  // Handle GitHub URLs
  if (CONFIG.githubBlobPattern.test(referencePath)) {
    // Extract path after /blob/branch/
    const match = referencePath.match(/\/blob\/[^\/]+\/(.+)$/);
    if (match) {
      return path.join(CONFIG.rootDir, match[1]);
    }
    return null;
  }

  // Handle absolute paths (from repo root)
  if (referencePath.startsWith('/')) {
    return path.join(CONFIG.rootDir, referencePath.substring(1));
  }

  // Handle relative paths
  const fromDir = path.dirname(fromFile);
  return path.resolve(fromDir, referencePath);
}

/**
 * Apply fix map to a broken reference
 */
function applyFixMap(referencePath) {
  // Check direct mapping
  if (CONFIG.fixMap[referencePath]) {
    return CONFIG.fixMap[referencePath];
  }

  // Check if any mapping matches the end of the path
  for (const [oldPath, newPath] of Object.entries(CONFIG.fixMap)) {
    if (referencePath.endsWith(oldPath)) {
      return newPath;
    }
  }

  return null;
}

/**
 * Validate and fix references in a file
 */
function validateAndFixReferences(filePath) {
  const results = {
    filePath,
    valid: [],
    broken: [],
    fixed: [],
    errors: []
  };

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, content: bodyContent, error } = extractFrontmatter(content);

    if (error) {
      results.errors.push(`Failed to parse frontmatter: ${error}`);
      return results;
    }

    if (!frontmatter || !frontmatter.references) {
      // No references to validate
      return results;
    }

    const references = frontmatter.references;

    if (!Array.isArray(references)) {
      results.errors.push('References field is not an array');
      return results;
    }

    let needsUpdate = false;
    const updatedReferences = [];

    references.forEach((ref, index) => {
      let refPath;
      let refDescription;

      // Handle both string and object formats
      if (typeof ref === 'string') {
        refPath = ref;
        refDescription = '';
      } else if (ref && typeof ref === 'object') {
        refPath = ref.path;
        refDescription = ref.description || '';
      } else {
        results.errors.push(`Reference ${index} has invalid format`);
        updatedReferences.push(ref);
        return;
      }

      if (!refPath) {
        results.errors.push(`Reference ${index} missing path`);
        updatedReferences.push(ref);
        return;
      }

      // Resolve the reference path
      const resolvedPath = resolveReferencePath(refPath, filePath);

      if (!resolvedPath) {
        results.errors.push(`Could not resolve reference ${index}: ${refPath}`);
        updatedReferences.push(ref);
        return;
      }

      // Check if file exists
      if (fileExists(resolvedPath)) {
        results.valid.push({ path: refPath, description: refDescription });
        updatedReferences.push(ref);
      } else {
        // Try to fix using the fix map
        const fixedPath = applyFixMap(refPath);

        if (fixedPath) {
          const fixedResolvedPath = resolveReferencePath(fixedPath, filePath);

          if (fixedResolvedPath && fileExists(fixedResolvedPath)) {
            results.fixed.push({
              old: refPath,
              new: fixedPath,
              description: refDescription
            });

            // Update the reference
            if (typeof ref === 'string') {
              updatedReferences.push(fixedPath);
            } else {
              updatedReferences.push({
                path: fixedPath,
                description: refDescription
              });
            }
            needsUpdate = true;
          } else {
            results.broken.push({
              path: refPath,
              attempted_fix: fixedPath,
              description: refDescription
            });
            updatedReferences.push(ref);
          }
        } else {
          results.broken.push({
            path: refPath,
            description: refDescription
          });
          updatedReferences.push(ref);
        }
      }
    });

    // Update file if fixes were applied
    if (needsUpdate) {
      frontmatter.references = updatedReferences;
      frontmatter.last_updated = new Date().toISOString().split('T')[0];

      const newFrontmatter = yaml.dump(frontmatter, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false
      });

      const newContent = `---\n${newFrontmatter}---\n${bodyContent}`;
      fs.writeFileSync(filePath, newContent, 'utf8');
    }

  } catch (error) {
    results.errors.push(`Processing error: ${error.message}`);
  }

  return results;
}

/**
 * Generate a human-readable report
 */
function generateReport(allResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: allResults.length,
      filesWithReferences: 0,
      validReferences: 0,
      brokenReferences: 0,
      fixedReferences: 0,
      errors: 0
    },
    details: []
  };

  allResults.forEach(result => {
    if (result.valid.length > 0 || result.broken.length > 0 || result.fixed.length > 0) {
      report.summary.filesWithReferences++;
    }

    report.summary.validReferences += result.valid.length;
    report.summary.brokenReferences += result.broken.length;
    report.summary.fixedReferences += result.fixed.length;
    report.summary.errors += result.errors.length;

    if (result.broken.length > 0 || result.fixed.length > 0 || result.errors.length > 0) {
      report.details.push({
        file: path.relative(CONFIG.rootDir, result.filePath),
        valid: result.valid.length,
        broken: result.broken,
        fixed: result.fixed,
        errors: result.errors
      });
    }
  });

  return report;
}

/**
 * Print report to console
 */
function printReport(report) {
  console.log('\n' + '='.repeat(70));
  console.log('Reference Validation and Repair Report');
  console.log('='.repeat(70) + '\n');

  console.log('Summary:');
  console.log(`  Total files scanned:       ${report.summary.totalFiles}`);
  console.log(`  Files with references:     ${report.summary.filesWithReferences}`);
  console.log(`  Valid references:          ${report.summary.validReferences}`);
  console.log(`  Broken references:         ${report.summary.brokenReferences}`);
  console.log(`  Fixed references:          ${report.summary.fixedReferences}`);
  console.log(`  Errors encountered:        ${report.summary.errors}\n`);

  if (report.details.length > 0) {
    console.log('Details:\n');

    report.details.forEach(detail => {
      console.log(`File: ${detail.file}`);

      if (detail.fixed.length > 0) {
        console.log('  ✓ Fixed:');
        detail.fixed.forEach(fix => {
          console.log(`    • ${fix.old} → ${fix.new}`);
        });
      }

      if (detail.broken.length > 0) {
        console.log('  ✗ Broken:');
        detail.broken.forEach(broken => {
          console.log(`    • ${broken.path}`);
          if (broken.attempted_fix) {
            console.log(`      (attempted fix: ${broken.attempted_fix} - still not found)`);
          }
        });
      }

      if (detail.errors.length > 0) {
        console.log('  ⚠ Errors:');
        detail.errors.forEach(error => {
          console.log(`    • ${error}`);
        });
      }

      console.log('');
    });
  }

  if (report.summary.brokenReferences > 0) {
    console.log('⚠ Action required: Please manually fix broken references or add mappings to the fix map.\n');
  } else if (report.summary.fixedReferences > 0) {
    console.log('✓ All broken references have been automatically fixed!\n');
  } else {
    console.log('✓ All references are valid!\n');
  }

  console.log('='.repeat(70) + '\n');
}

/**
 * Write report to log file
 */
function writeLogFile(report) {
  const logDir = path.dirname(CONFIG.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logContent = JSON.stringify(report, null, 2);
  fs.writeFileSync(CONFIG.logFile, logContent, 'utf8');
  console.log(`Detailed log written to: ${path.relative(CONFIG.rootDir, CONFIG.logFile)}`);
}

/**
 * Main function
 */
function main() {
  console.log('Starting reference validation and repair...\n');

  // Discover files
  const allFiles = [];
  CONFIG.patterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      cwd: CONFIG.rootDir,
      ignore: CONFIG.excludePatterns,
      absolute: true,
      nodir: true
    });
    allFiles.push(...files);
  });

  const uniqueFiles = [...new Set(allFiles)];
  console.log(`Found ${uniqueFiles.length} files to scan\n`);

  // Process each file
  const allResults = uniqueFiles.map(file => validateAndFixReferences(file));

  // Generate and display report
  const report = generateReport(allResults);
  printReport(report);
  writeLogFile(report);

  // Exit with appropriate code
  const hasIssues = report.summary.brokenReferences > 0 || report.summary.errors > 0;
  process.exit(hasIssues ? 1 : 0);
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Fix References Script

Scans markdown files with frontmatter and validates/fixes broken reference links.

Usage:
  node fix-references.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Run validation without making changes
  --fix-map      Show current fix map
  --add-mapping  Add a new mapping to the fix map (interactive)

Examples:
  # Scan and fix all references
  node fix-references.js

  # Dry run (no changes)
  node fix-references.js --dry-run

  # Show fix map
  node fix-references.js --fix-map

Strategy:
  1. Scans all markdown files for 'references' in frontmatter
  2. Validates each reference path exists
  3. Applies fix map for known moved files
  4. Updates files with fixed references
  5. Reports broken references that need manual intervention
    `);
    process.exit(0);
  }

  if (args.includes('--fix-map')) {
    console.log('\nCurrent Fix Map:\n');
    console.log(JSON.stringify(CONFIG.fixMap, null, 2));
    console.log('\nTo add a mapping, edit the CONFIG.fixMap in this script.\n');
    process.exit(0);
  }

  main().catch(error => {
    console.error(`Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = {
  validateAndFixReferences,
  extractFrontmatter,
  resolveReferencePath,
  applyFixMap,
  CONFIG
};
