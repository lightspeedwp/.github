#!/usr/bin/env node
/**
 * Changelog Audit Logger — Track all changelog modifications
 * Phase 2: Audit Logging System
 * Records who, when, and what changed in CHANGELOG.md
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CHANGELOG_FILE = path.join(process.cwd(), "CHANGELOG.md");
const AUDIT_LOG_FILE = path.join(
  process.cwd(),
  ".github/reports/audits/changelog-audit-log.md",
);
const AUDIT_DIR = path.dirname(AUDIT_LOG_FILE);

class ChangelogAuditLogger {
  constructor() {
    this.entries = [];
    this.stats = {
      totalModifications: 0,
      totalVersionsAdded: 0,
      totalEntriesAdded: 0,
      contributors: new Set(),
    };
  }

  /**
   * Initialize audit log if it doesn't exist
   */
  initializeAuditLog() {
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    }

    if (!fs.existsSync(AUDIT_LOG_FILE)) {
      const initialLog = `---
title: Changelog Audit Log
description: Track of all CHANGELOG.md modifications with timestamps and authorship
created: ${new Date().toISOString()}
last_updated: ${new Date().toISOString()}
---

# Changelog Audit Log

**Purpose**: Track all modifications to CHANGELOG.md including who made changes, when, and what was changed.

**Log Started**: ${new Date().toISOString()}

---

## Audit Entries

`;
      fs.writeFileSync(AUDIT_LOG_FILE, initialLog, "utf8");
      return true;
    }
    return false;
  }

  /**
   * Get git log entries for CHANGELOG.md
   */
  getGitHistory() {
    try {
      const log = execSync(
        'git log --follow --format="%H|%an|%ae|%ai|%s" -- CHANGELOG.md',
        { encoding: "utf8" },
      );

      return log
        .trim()
        .split("\n")
        .filter((line) => line.length > 0)
        .map((line) => {
          const [hash, author, email, date, subject] = line.split("|");
          return {
            hash: hash.substring(0, 7),
            author,
            email,
            date: new Date(date).toISOString(),
            subject,
          };
        });
    } catch (error) {
      console.warn("⚠️  Could not retrieve git history:", error.message);
      return [];
    }
  }

  /**
   * Get current changelog stats
   */
  analyzeChangelog() {
    if (!fs.existsSync(CHANGELOG_FILE)) {
      return null;
    }

    const content = fs.readFileSync(CHANGELOG_FILE, "utf8");
    const lines = content.split("\n");

    // Count versions
    const versions = (content.match(/## \[\d+\.\d+\.\d+\]/g) || []).length;

    // Count unreleased entries
    const unreleasedMatch = content.match(
      /## \[Unreleased\]([\s\S]*?)(?=## \[|$)/,
    );
    const unreleasedEntries = unreleasedMatch
      ? (unreleasedMatch[1].match(/^- /gm) || []).length
      : 0;

    // Count total entries
    const totalEntries = (content.match(/^- /gm) || []).length;

    // Check frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const hasFrontmatter = !!frontmatterMatch;

    // Get last modified date from frontmatter
    let lastUpdated = null;
    if (frontmatterMatch) {
      const fm = frontmatterMatch[1];
      const lastUpdatedMatch = fm.match(/last_updated:\s*["']?([^"'\n]+)["']?/);
      if (lastUpdatedMatch) {
        lastUpdated = lastUpdatedMatch[1];
      }
    }

    return {
      versions,
      unreleasedEntries,
      totalEntries,
      hasFrontmatter,
      lastUpdated,
      size: Buffer.byteLength(content, "utf8"),
      lines: lines.length,
    };
  }

  /**
   * Record a modification entry
   */
  recordModification(modification) {
    this.entries.push({
      timestamp: new Date().toISOString(),
      ...modification,
    });

    this.stats.totalModifications++;
    if (modification.contributor) {
      this.stats.contributors.add(modification.contributor);
    }
  }

  /**
   * Generate audit report from git history
   */
  generateAuditReport() {
    const history = this.getGitHistory();
    const stats = this.analyzeChangelog();

    if (!stats) {
      console.warn("⚠️  CHANGELOG.md not found, cannot generate audit report");
      return;
    }

    let report = `---
title: Changelog Audit Log
description: Track of all CHANGELOG.md modifications with timestamps and authorship
created: ${new Date().toISOString()}
last_updated: ${new Date().toISOString()}
total_modifications: ${history.length}
total_contributors: ${new Set(history.map((h) => h.author)).size}
---

# Changelog Audit Log

**Purpose**: Track all modifications to CHANGELOG.md including who made changes, when, and what was changed.

**Report Generated**: ${new Date().toISOString()}

---

## Summary

- **Total Modifications**: ${history.length}
- **Unique Contributors**: ${new Set(history.map((h) => h.author)).size}
- **Current Versions**: ${stats.versions}
- **Unreleased Entries**: ${stats.unreleasedEntries}
- **Total Entries**: ${stats.totalEntries}
- **File Size**: ${stats.size} bytes
- **Last Updated**: ${stats.lastUpdated || "Unknown"}

---

## Modification History

| Date | Commit | Author | Email | Subject |
|------|--------|--------|-------|---------|
`;

    // Add modification entries in reverse chronological order
    for (const entry of history) {
      const date = new Date(entry.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      report += `| ${date} | \`${entry.hash}\` | ${this.escapeMarkdown(entry.author)} | \`${entry.email}\` | ${this.escapeMarkdown(entry.subject)} |\n`;
    }

    report += `\n---\n\n## Top Contributors\n\n`;

    // Count contributions per author
    const contributionsByAuthor = {};
    for (const entry of history) {
      if (!contributionsByAuthor[entry.author]) {
        contributionsByAuthor[entry.author] = 0;
      }
      contributionsByAuthor[entry.author]++;
    }

    // Sort by contribution count
    const sortedContributors = Object.entries(contributionsByAuthor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    report += "| Author | Contributions |\n";
    report += "|--------|---------------|\n";

    for (const [author, count] of sortedContributors) {
      report += `| ${this.escapeMarkdown(author)} | ${count} |\n`;
    }

    report += `\n---\n\n## Audit Trail\n\nThis log is automatically maintained by the Changelog Safety Audit system (Phase 2).\n\n`;
    report += `- **Validation Script**: \`scripts/validation/validate-changelog-safety.js\`\n`;
    report += `- **Audit Logger**: \`scripts/validation/changelog-audit-log.js\`\n`;
    report += `- **Pre-commit Hook**: \`.github/hooks/pre-commit\`\n`;
    report += `- **CI/CD Workflow**: \`.github/workflows/changelog-safety-audit.yml\`\n\n`;
    report += `**Last Audit Run**: ${new Date().toISOString()}\n`;

    return report;
  }

  /**
   * Escape markdown special characters
   */
  escapeMarkdown(text) {
    return text
      .replace(/\|/g, "\\|")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  /**
   * Save audit report to file
   */
  saveAuditReport(report) {
    fs.writeFileSync(AUDIT_LOG_FILE, report, "utf8");
    return AUDIT_LOG_FILE;
  }

  /**
   * Run complete audit logging
   */
  run() {
    console.log("📋 Changelog Audit Logger v1.0.0");
    console.log("═".repeat(60));
    console.log("");

    // Initialize audit log if needed
    const initialized = this.initializeAuditLog();
    if (initialized) {
      console.log("✅ Initialized new audit log");
    }

    // Generate report from git history
    const report = this.generateAuditReport();

    if (!report) {
      console.error("❌ Failed to generate audit report");
      process.exit(1);
    }

    // Save report
    const savedPath = this.saveAuditReport(report);
    console.log(
      `✅ Audit report saved to: ${path.relative(process.cwd(), savedPath)}`,
    );
    console.log("");

    // Print summary
    const stats = this.analyzeChangelog();
    if (stats) {
      console.log("📊 Changelog Statistics:");
      console.log(`  • Versions: ${stats.versions}`);
      console.log(`  • Unreleased entries: ${stats.unreleasedEntries}`);
      console.log(`  • Total entries: ${stats.totalEntries}`);
      console.log(`  • File size: ${stats.size} bytes`);
      console.log("");
    }

    console.log("═".repeat(60));
  }
}

// Run audit logger
if (require.main === module) {
  const logger = new ChangelogAuditLogger();
  logger.run();
}

module.exports = ChangelogAuditLogger;
