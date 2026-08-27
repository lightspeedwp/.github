#!/usr/bin/env node
/**
 * Changelog Safety Audit — Prevent future changelog incidents
 * Validates changelog integrity, format, and cross-references
 * Issue #2354
 */

const fs = require('fs');
const path = require('path');

const CHANGELOG_FILE = path.join(process.cwd(), 'CHANGELOG.md');
const SCHEMA_FILE = path.join(process.cwd(), 'schemas/changelog.schema.json');
const SPEC_AGENT = path.join(process.cwd(), '.github/agents/changelog.agent.md');
const CHANGELOG_AGENT = path.join(process.cwd(), 'agents/changelog/changelog.agent.js');
const DOCUMENTATION = path.join(process.cwd(), 'docs/CHANGELOG_AUTOMATION.md');

const RULES = {
  minVersionSections: 1,
  minUnreleasedEntries: 1,
  maxLineLengthPerEntry: 250, // Increased for comprehensive changelog entries
  requiredSections: ['Added', 'Fixed', 'Changed'],
  requiredFrontmatter: ['title', 'description', 'last_updated'],
  minChangelogSizeBytes: 500, // Minimum changelog file size to prevent corruption
  maxStalenessDays: 60, // Warn if changelog not updated in 60+ days
};

class ChangelogSafetyAudit {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalVersions: 0,
      totalEntries: 0,
      unreleasedEntries: 0,
      brokenLinks: 0,
      formatIssues: 0,
    };
  }

  /**
   * Run full safety audit
   */
  async run() {
    console.log('🔐 Changelog Safety Audit v1.0.0');
    console.log('═'.repeat(60));
    console.log('');

    await this.checkFileExists();
    if (this.errors.length > 0) return this.report();

    await this.checkFrontmatter();
    await this.checkStructure();
    await this.checkFormatCompliance();
    await this.checkCrossReferences();
    await this.checkDataIntegrity();
    await this.checkLinksValidity();

    return this.report();
  }

  /**
   * AUDIT 1: Check changelog file exists and is readable
   */
  async checkFileExists() {
    try {
      if (!fs.existsSync(CHANGELOG_FILE)) {
        this.errors.push('❌ CRITICAL: CHANGELOG.md file not found');
        return;
      }

      const stat = fs.statSync(CHANGELOG_FILE);
      if (stat.size === 0) {
        this.errors.push('❌ CRITICAL: CHANGELOG.md is empty (data loss?!)');
        return;
      }

      if (stat.size < RULES.minChangelogSizeBytes) {
        this.warnings.push(`⚠️  WARNING: CHANGELOG.md is suspiciously small (< ${RULES.minChangelogSizeBytes} bytes)`);
      }

      this.content = fs.readFileSync(CHANGELOG_FILE, 'utf8');
      this.lines = this.content.split('\n');
    } catch (error) {
      this.errors.push(`❌ CRITICAL: Cannot read CHANGELOG.md: ${error.message}`);
    }
  }

  /**
   * AUDIT 2: Check frontmatter exists and is valid YAML
   */
  async checkFrontmatter() {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = this.content.match(frontmatterRegex);

    if (!match) {
      this.errors.push('❌ MISSING: No YAML frontmatter found in CHANGELOG.md');
      return;
    }

    const frontmatter = match[1];
    const frontmatterData = {};

    // Basic YAML parsing
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontmatterData[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });

    // Check required frontmatter fields
    for (const field of RULES.requiredFrontmatter) {
      if (!frontmatterData[field]) {
        this.warnings.push(`⚠️  MISSING FRONTMATTER: ${field} not found in CHANGELOG.md`);
      }
    }

    // Check if last_updated is recent
    if (frontmatterData.last_updated) {
      const lastUpdated = new Date(frontmatterData.last_updated);
      const now = new Date();
      const daysAgo = (now - lastUpdated) / (1000 * 60 * 60 * 24);

      if (daysAgo > RULES.maxStalenessDays) {
        this.warnings.push(`⚠️  STALE: CHANGELOG.md last updated ${Math.floor(daysAgo)} days ago (threshold: ${RULES.maxStalenessDays} days)`);
      }
    }
  }

  /**
   * AUDIT 3: Check Keep a Changelog structure compliance
   */
  async checkStructure() {
    // Remove frontmatter for structure analysis
    const contentWithoutFrontmatter = this.content.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Check for [Unreleased] section
    if (!contentWithoutFrontmatter.includes('[Unreleased]')) {
      this.errors.push('❌ MISSING: [Unreleased] section required for future entries');
    } else {
      // Count unreleased entries
      const unreleasedMatch = contentWithoutFrontmatter.match(/## \[Unreleased\]([\s\S]*?)(?=## \[|$)/);
      if (unreleasedMatch) {
        const unreleasedContent = unreleasedMatch[1];
        const unreleasedEntries = (unreleasedContent.match(/^- /gm) || []).length;
        this.stats.unreleasedEntries = unreleasedEntries;

        if (unreleasedEntries < RULES.minUnreleasedEntries) {
          this.warnings.push(
            `⚠️  POTENTIAL ISSUE: [Unreleased] section has ${unreleasedEntries} entries (expected at least ${RULES.minUnreleasedEntries})`
          );
        }
      }
    }

    // Check for version sections (e.g., [1.0.0])
    const versionMatches = contentWithoutFrontmatter.match(/## \[\d+\.\d+\.\d+\]/g) || [];
    this.stats.totalVersions = versionMatches.length;

    if (versionMatches.length < RULES.minVersionSections) {
      this.warnings.push(
        `⚠️  STRUCTURE: Expected at least ${RULES.minVersionSections} version section(s), found ${versionMatches.length}`
      );
    }

    // Check for required Keep a Changelog sections in [Unreleased]
    const unreleasedMatch = contentWithoutFrontmatter.match(/## \[Unreleased\]([\s\S]*?)(?=## \[|$)/);
    if (unreleasedMatch) {
      const unreleasedSection = unreleasedMatch[1];
      const foundSections = ['Added', 'Fixed', 'Changed', 'Removed', 'Deprecated', 'Security'].filter(
        section => unreleasedSection.includes(`### ${section}`)
      );

      if (foundSections.length === 0) {
        this.warnings.push('⚠️  STRUCTURE: [Unreleased] has no recognized Keep a Changelog sections');
      }
    }
  }

  /**
   * AUDIT 4: Check Keep a Changelog format compliance
   */
  async checkFormatCompliance() {
    // Entry format should be: - **Title** — Description ([PR #123](url))
    const allDashLines = (this.content.match(/^- .+/gm) || []).length;

    // Find entries that don't follow the format
    const entryLines = this.content.split('\n').filter(line => line.startsWith('- '));
    let malformedCount = 0;

    for (const line of entryLines) {
      // Check for PR link
      if (!line.includes('[PR') && !line.includes('(http')) {
        // Not all entries need links, but entries should have em-dash separator
        if (!line.includes(' — ')) {
          malformedCount++;
        }
      }

      // Check line length (only warn about extremely long lines)
      if (line.length > RULES.maxLineLengthPerEntry) {
        this.stats.formatIssues++;
        this.warnings.push(
          `⚠️  FORMAT: Entry is very long (${line.length} characters, max ${RULES.maxLineLengthPerEntry}): "${line.substring(0, 60)}..."`
        );
      }
    }

    this.stats.totalEntries = allDashLines;

    if (malformedCount > 0) {
      this.warnings.push(`⚠️  FORMAT: ${malformedCount} entries don't follow expected format`);
    }
  }

  /**
   * AUDIT 5: Check cross-references between related files
   */
  async checkCrossReferences() {
    const files = [
      { path: SPEC_AGENT, name: 'Spec Agent (.github/agents/changelog.agent.md)' },
      { path: CHANGELOG_AGENT, name: 'Portable Agent (agents/changelog/changelog.agent.js)' },
      { path: SCHEMA_FILE, name: 'Schema (schemas/changelog.schema.json)' },
      { path: DOCUMENTATION, name: 'Documentation (docs/CHANGELOG_AUTOMATION.md)' },
    ];

    for (const file of files) {
      if (!fs.existsSync(file.path)) {
        this.warnings.push(`⚠️  MISSING FILE: ${file.name}`);
      } else {
        try {
          const content = fs.readFileSync(file.path, 'utf8');
          // Check if it references other changelog files
          const hasReferences =
            content.includes('changelog') || content.includes('CHANGELOG') || content.includes('Keep a Changelog');

          if (!hasReferences) {
            this.warnings.push(
              `⚠️  WEAK CROSS-REFERENCE: ${file.name} doesn't reference other changelog files`
            );
          }
        } catch (error) {
          this.warnings.push(`⚠️  ERROR reading ${file.name}: ${error.message}`);
        }
      }
    }
  }

  /**
   * AUDIT 6: Check for data integrity issues (corruption patterns)
   */
  async checkDataIntegrity() {
    // Check for duplicate version tags
    const versionRegex = /## \[([^\]]+)\]/g;
    const versions = new Set();
    let match;

    while ((match = versionRegex.exec(this.content)) !== null) {
      if (versions.has(match[1])) {
        this.errors.push(`❌ DATA CORRUPTION: Duplicate version tag [${match[1]}]`);
      }
      versions.add(match[1]);
    }

    // Check for valid dates in version headers
    const versionWithDateRegex = /## \[[\d.]+\] - (\d{4}-\d{2}-\d{2})/g;
    while ((match = versionWithDateRegex.exec(this.content)) !== null) {
      const date = new Date(match[1]);
      if (isNaN(date.getTime())) {
        this.errors.push(`❌ DATA CORRUPTION: Invalid date in version header: ${match[1]}`);
      }
    }

    // Check for corrupted markdown links (mismatched brackets in link syntax only)
    const linkMatches = this.content.match(/\[([^\]]*)\]\(([^)]*)\)/g) || [];
    const malformedLinks = this.content.match(/\[[^\]]*\](?!\()/g) || [];

    if (malformedLinks.length > linkMatches.length * 2) {
      this.warnings.push(`⚠️  INTEGRITY: Found ${malformedLinks.length} unmatched brackets (may indicate incomplete links)`);
    }

    // Check for suspicious patterns that might indicate corruption
    if (this.content.includes('\x00') || this.content.includes('�')) {
      this.errors.push('❌ CORRUPTION: Invalid UTF-8 characters detected');
    }

    // Check for truncated content (file ends abruptly)
    if (this.lines[this.lines.length - 1].startsWith('- ') && this.lines[this.lines.length - 1].length < 10) {
      this.warnings.push('⚠️  INTEGRITY: Last line appears truncated');
    }
  }

  /**
   * AUDIT 7: Check PR/issue links validity in entries
   */
  async checkLinksValidity() {
    // Match properly formatted links: [PR #123](url) or [#123](url)
    const validLinkRegex = /\[(?:PR\s*|Issue\s*)?#(\d+)\]\(([^)]+)\)/g;
    let match;
    const links = [];

    while ((match = validLinkRegex.exec(this.content)) !== null) {
      links.push({
        number: match[1],
        url: match[2],
      });
    }

    // Check for broken link patterns
    for (const link of links) {
      // Validate GitHub URL format (can be any GitHub org)
      if (!link.url.includes('github.com/')) {
        this.warnings.push(`⚠️  LINK: URL doesn't appear to be a GitHub link: ${link.url}`);
      }

      // Check PR number is reasonable
      if (parseInt(link.number) === 0) {
        this.errors.push(`❌ INVALID LINK: PR/Issue #0 found`);
      }

      if (parseInt(link.number) > 100000) {
        this.warnings.push(`⚠️  SUSPICIOUS LINK: PR/Issue #${link.number} seems unreasonably high`);
      }
    }

    // Look for actual malformed patterns: [PR text without matching (url)
    // Must be: [ followed by text including #number and then NOT followed by (url)
    const lines = this.content.split('\n');
    let actuallyMalformedCount = 0;

    for (const line of lines) {
      // Skip if line doesn't contain PR/Issue reference
      if (!line.match(/\[.*#\d+/)) continue;

      // Check if it has both [ and ( pairs
      const openBrackets = (line.match(/\[/g) || []).length;
      const closeBrackets = (line.match(/\]/g) || []).length;
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;

      if (openBrackets !== closeBrackets || openParens !== closeParens) {
        actuallyMalformedCount++;
      }
    }

    if (actuallyMalformedCount > 0) {
      this.errors.push(`❌ MALFORMED LINKS: ${actuallyMalformedCount} entries have unmatched brackets/parentheses`);
    }
  }

  /**
   * Generate audit report
   */
  report() {
    console.log('');
    console.log('📊 AUDIT RESULTS');
    console.log('═'.repeat(60));
    console.log('');

    // Statistics
    console.log('📈 Statistics:');
    console.log(`  • Total versions: ${this.stats.totalVersions}`);
    console.log(`  • Total entries: ${this.stats.totalEntries}`);
    console.log(`  • Unreleased entries: ${this.stats.unreleasedEntries}`);
    console.log(`  • Format issues detected: ${this.stats.formatIssues}`);
    console.log('');

    // Errors (critical issues)
    if (this.errors.length > 0) {
      console.log('🔴 CRITICAL ERRORS (must fix):');
      this.errors.forEach(error => console.log(`  ${error}`));
      console.log('');
    }

    // Warnings (should fix)
    if (this.warnings.length > 0) {
      console.log('🟡 WARNINGS (should fix):');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
      console.log('');
    }

    // Summary
    const status = this.errors.length === 0 ? '✅ PASS' : '❌ FAIL';
    const summary =
      `${status} — ${this.errors.length} critical errors, ${this.warnings.length} warnings`;
    console.log(summary);
    console.log('═'.repeat(60));
    console.log('');

    // Exit code
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

// Run audit
const audit = new ChangelogSafetyAudit();
audit.run().catch(error => {
  console.error('❌ Audit failed:', error.message);
  process.exit(2);
});
