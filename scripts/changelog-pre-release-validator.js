#!/usr/bin/env node

/**
 * Pre-Release Changelog Validator
 *
 * Validates changelog entries before release:
 * - Entry length (max 250 chars)
 * - PR link presence
 * - Issue link detection
 * - Implementation keyword detection
 * - Generates compliance report for release manager
 *
 * Usage: node scripts/changelog-pre-release-validator.js [--changelog CHANGELOG.md] [--format json|text]
 */

import fs from 'fs';

// Configuration
const CONFIG = {
  MAX_ENTRY_LENGTH: 250,
  IMPLEMENTATION_KEYWORDS: [
    'refactored',
    'optimised',
    'optimized',
    'patched',
    'implemented',
    'deployed',
    'migrated',
    'restructured',
    'reorganised',
    'reorganized',
    'logic',
    'algorithm',
    'framework',
    'component',
    'module',
    'hook',
    'middleware',
    'REST API',
    'GraphQL',
    'database',
    'query',
    'cache',
    'transaction',
    'service',
    'endpoint',
    'function',
    'class',
    'method',
    'refactor',
    'update',
    'fix',
    'modify',
    'change',
  ],
};

// ANSI colors for terminal output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class ChangelogValidator {
  constructor(changelogPath = 'CHANGELOG.md') {
    this.changelogPath = changelogPath;
    this.entries = [];
    this.report = {
      totalEntries: 0,
      compliantEntries: 0,
      issues: [],
      warnings: [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Read and parse changelog file
   */
  parseChangelog() {
    try {
      const content = fs.readFileSync(this.changelogPath, 'utf8');
      this.entries = this._extractEntries(content);
      this.report.totalEntries = this.entries.length;
      return true;
    } catch (err) {
      this.report.issues.push(`Failed to read changelog: ${err.message}`);
      return false;
    }
  }

  /**
   * Extract entries from changelog content
   */
  _extractEntries(content) {
    const entries = [];
    const unreleasedMatch = content.match(/## \[Unreleased\]([\s\S]*?)(?=## \[|$)/);

    if (!unreleasedMatch) {
      this.report.issues.push('No [Unreleased] section found in changelog');
      return entries;
    }

    const unreleasedContent = unreleasedMatch[1];
    const lines = unreleasedContent.split('\n');

    let currentCategory = null;
    for (const line of lines) {
      const categoryMatch = line.match(/^### (Added|Changed|Fixed|Deprecated|Removed|Security)/);
      if (categoryMatch) {
        currentCategory = categoryMatch[1];
        continue;
      }

      if (line.match(/^- /)) {
        const text = line.replace(/^- /, '').trim();
        if (text) {
          entries.push({
            text,
            category: currentCategory || 'Uncategorized',
            lineNumber: lines.indexOf(line),
          });
        }
      }
    }

    return entries;
  }

  /**
   * Validate all entries
   */
  validateAll() {
    this.report.compliantEntries = 0;
    this.report.issues = [];
    this.report.warnings = [];

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      const violations = this._validateEntry(entry, i);

      if (violations.length === 0) {
        this.report.compliantEntries++;
      } else {
        this.report.issues.push({
          entryIndex: i,
          text: entry.text,
          category: entry.category,
          violations,
        });
      }
    }

    this.report.compliancePercent =
      this.report.totalEntries > 0
        ? Math.round((this.report.compliantEntries / this.report.totalEntries) * 100)
        : 100;

    return this.report;
  }

  /**
   * Validate single entry
   */
  _validateEntry(entry, index) {
    const violations = [];

    // Check length
    if (entry.text.length > CONFIG.MAX_ENTRY_LENGTH) {
      violations.push({
        code: 'ENTRY_TOO_LONG',
        severity: 'error',
        message: `Entry exceeds 250 chars (${entry.text.length} chars)`,
        suggestion: 'Rewrite entry as user-focused summary without implementation details',
      });
    }

    // Check for PR link
    const prMatch = entry.text.match(/#\d+/);
    if (!prMatch) {
      violations.push({
        code: 'MISSING_PR_LINK',
        severity: 'error',
        message: 'No PR link found (expected #NNNN format)',
        suggestion: 'Add PR reference: #NNNN',
      });
    }

    // Check for issue link
    const issueMatch = entry.text.match(/issue\s*#?\d+|#\d+\s*\(issue\)/i);
    if (!issueMatch && !entry.text.match(/\[#\d+\]\(.*\/issues\/\d+\)/)) {
      // Don't fail, but warn
      this.report.warnings.push({
        entryIndex: index,
        code: 'MISSING_ISSUE_LINK',
        severity: 'warning',
        message: 'No issue link detected',
        suggestion: 'Add issue reference or link to related GitHub issue',
      });
    }

    // Check for implementation keywords
    const foundKeywords = CONFIG.IMPLEMENTATION_KEYWORDS.filter((kw) =>
      entry.text.toLowerCase().includes(kw.toLowerCase())
    );
    if (foundKeywords.length > 0) {
      violations.push({
        code: 'IMPLEMENTATION_DETAILS',
        severity: 'error',
        message: `Entry contains implementation keywords: ${foundKeywords.join(', ')}`,
        suggestion: 'Rewrite from user perspective, avoid technical implementation details',
      });
    }

    // Check for minimum content
    if (entry.text.trim().length < 10) {
      violations.push({
        code: 'ENTRY_TOO_SHORT',
        severity: 'error',
        message: 'Entry text too short',
        suggestion: 'Provide clear, user-focused description of change',
      });
    }

    return violations;
  }

  /**
   * Format report as text
   */
  formatAsText() {
    let output = '\n';
    output += `${COLORS.cyan}════════════════════════════════════════${COLORS.reset}\n`;
    output += `${COLORS.cyan}  CHANGELOG PRE-RELEASE VALIDATION REPORT${COLORS.reset}\n`;
    output += `${COLORS.cyan}════════════════════════════════════════${COLORS.reset}\n\n`;

    // Summary
    const compliance = this.report.compliancePercent;
    const complianceColor =
      compliance >= 95 ? COLORS.green : compliance >= 80 ? COLORS.yellow : COLORS.red;

    output += `${COLORS.blue}Summary:${COLORS.reset}\n`;
    output += `  Total Entries:       ${this.report.totalEntries}\n`;
    output += `  Compliant Entries:   ${this.report.compliantEntries}\n`;
    output += `  Compliance:          ${complianceColor}${compliance}%${COLORS.reset}\n`;
    output += `  Warnings:            ${this.report.warnings.length}\n\n`;

    // Issues
    if (this.report.issues.length > 0) {
      output += `${COLORS.red}${this.report.issues.length} Non-Compliant Entries:${COLORS.reset}\n`;
      output += '─'.repeat(70) + '\n';

      for (const issue of this.report.issues) {
        output += `\n${COLORS.yellow}Entry ${issue.entryIndex + 1} [${issue.category}]:${COLORS.reset}\n`;
        output += `  "${issue.text}"\n`;
        output += `  ${COLORS.red}Issues:${COLORS.reset}\n`;

        for (const violation of issue.violations) {
          output += `    • [${violation.code}] ${violation.message}\n`;
          output += `      → ${violation.suggestion}\n`;
        }
      }
    } else {
      output += `${COLORS.green}✓ All entries are compliant!${COLORS.reset}\n`;
    }

    // Warnings
    if (this.report.warnings.length > 0) {
      output += `\n${COLORS.yellow}Warnings (${this.report.warnings.length}):${COLORS.reset}\n`;
      output += '─'.repeat(70) + '\n';

      for (const warning of this.report.warnings) {
        output += `  • [${warning.code}] Entry ${warning.entryIndex + 1}\n`;
        output += `    ${warning.message}\n`;
      }
    }

    // Release decision
    output += '\n' + '═'.repeat(70) + '\n';
    if (compliance >= 95) {
      output += `${COLORS.green}✓ RELEASE APPROVED${COLORS.reset} - Changelog meets quality standards\n`;
    } else if (compliance >= 80) {
      output += `${COLORS.yellow}⚠ RELEASE WITH CAUTION${COLORS.reset} - ${100 - compliance}% of entries need review\n`;
    } else {
      output += `${COLORS.red}✗ RELEASE BLOCKED${COLORS.reset} - Changelog does not meet quality standards\n`;
    }
    output += '═'.repeat(70) + '\n\n';

    return output;
  }

  /**
   * Format report as JSON
   */
  formatAsJson() {
    return JSON.stringify(this.report, null, 2);
  }

  /**
   * Run full validation
   */
  run() {
    if (!this.parseChangelog()) {
      return this.report;
    }
    return this.validateAll();
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  let changelogPath = 'CHANGELOG.md';
  let format = 'text';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--changelog' && args[i + 1]) {
      changelogPath = args[i + 1];
      i++;
    } else if (args[i] === '--format' && args[i + 1]) {
      format = args[i + 1];
      i++;
    }
  }

  const validator = new ChangelogValidator(changelogPath);
  const report = validator.run();

  if (format === 'json') {
    console.log(validator.formatAsJson());
  } else {
    console.log(validator.formatAsText());
  }

  // Exit with appropriate code
  const complianceOK = report.compliancePercent >= 95;
  process.exit(complianceOK ? 0 : 1);
}

main().catch((err) => {
  console.error(`${COLORS.red}Error:${COLORS.reset}`, err.message);
  process.exit(1);
});

export { ChangelogValidator };
