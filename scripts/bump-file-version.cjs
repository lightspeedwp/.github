#!/usr/bin/env node

/**
 * Bump File Version Script
 *
 * Bumps a file's `version` field in YAML frontmatter with guardrails
 * to prevent exceeding the repository's minor version.
 *
 * @fileoverview Per-file version management with repository version constraints
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Parse a semantic version string into components
 * @param {string} version - Version string (e.g., "1.2.3" or "v1.2.3")
 * @returns {{major: number, minor: number, patch: number, raw: string}}
 */
function parseVersion(version) {
  const cleaned = version.replace(/^v/, '');
  const parts = cleaned.split('.');

  if (parts.length !== 3) {
    throw new Error(`Invalid version format: ${version}. Expected format: x.y.z`);
  }

  const [major, minor, patch] = parts.map(p => {
    const num = parseInt(p, 10);
    if (isNaN(num)) {
      throw new Error(`Invalid version component in ${version}: ${p}`);
    }
    return num;
  });

  return { major, minor, patch, raw: cleaned };
}

/**
 * Format version components into a string
 * @param {{major: number, minor: number, patch: number}} version
 * @returns {string}
 */
function formatVersion({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

/**
 * Extract frontmatter from markdown content
 * @param {string} content - File content
 * @returns {{frontmatter: object|null, content: string, raw: string}}
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
    throw new Error(`Failed to parse YAML frontmatter: ${error.message}`);
  }
}

/**
 * Update frontmatter version and write back to file
 * @param {string} filePath - Path to the file
 * @param {string} newVersion - New version string
 */
function updateFileVersion(filePath, newVersion) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, content: bodyContent } = extractFrontmatter(content);

  if (!frontmatter) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }

  // Update version
  frontmatter.version = newVersion;

  // Update last_updated to today's date
  frontmatter.last_updated = new Date().toISOString().split('T')[0];

  // Reconstruct file
  const newFrontmatter = yaml.dump(frontmatter, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false
  });

  const newContent = `---\n${newFrontmatter}---\n${bodyContent}`;
  fs.writeFileSync(filePath, newContent, 'utf8');
}

/**
 * Bump a file's version
 * @param {string} filePath - Path to file
 * @param {'patch'|'minor'} bumpType - Type of version bump
 * @param {string} repoVersion - Repository version for validation
 */
function bumpFileVersion(filePath, bumpType, repoVersion) {
  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Parse repository version
  const repoVer = parseVersion(repoVersion);
  const repoMinor = `${repoVer.major}.${repoVer.minor}`;

  // Read current file version
  const content = fs.readFileSync(filePath, 'utf8');
  const { frontmatter } = extractFrontmatter(content);

  if (!frontmatter) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }

  // Get current version or default to repo minor + .0
  const currentVersion = frontmatter.version || `${repoMinor}.0`;
  const currentVer = parseVersion(currentVersion);

  // Calculate new version
  let newVer;
  if (bumpType === 'patch') {
    newVer = {
      major: currentVer.major,
      minor: currentVer.minor,
      patch: currentVer.patch + 1
    };
  } else if (bumpType === 'minor') {
    newVer = {
      major: currentVer.major,
      minor: currentVer.minor + 1,
      patch: 0
    };
  } else {
    throw new Error(`Invalid bump type: ${bumpType}. Expected 'patch' or 'minor'`);
  }

  // Guardrail: file minor must not exceed repo minor
  const newMinor = { major: newVer.major, minor: newVer.minor };
  const [repoMajorStr, repoMinorStr] = repoMinor.split('.');
  const repoMajor = parseInt(repoMajorStr, 10);
  const repoMinorNum = parseInt(repoMinorStr, 10);
  if (
    newMinor.major > repoMajor ||
    (newMinor.major === repoMajor && newMinor.minor > repoMinorNum)
  ) {
    throw new Error(
      `Refusing to bump ${filePath} to ${formatVersion(newVer)}; ` +
      `file minor (${newMinor.major}.${newMinor.minor}) would exceed repository minor (${repoMinor}). ` +
      `Please update the repository version first.`
    );
  }

  // Update the file
  const newVersionString = formatVersion(newVer);
  updateFileVersion(filePath, newVersionString);

  console.log(`✓ ${path.relative(process.cwd(), filePath)}: ${currentVersion} → ${newVersionString}`);

  return {
    filePath,
    oldVersion: currentVersion,
    newVersion: newVersionString
  };
}

/**
 * Load repository version from VERSION file
 * @returns {string}
 */
function loadRepoVersion() {
  const versionFile = path.join(process.cwd(), 'VERSION');

  if (!fs.existsSync(versionFile)) {
    throw new Error('VERSION file not found in repository root');
  }

  return fs.readFileSync(versionFile, 'utf8').trim();
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Bump File Version Script

Usage:
  node bump-file-version.js <file> [patch|minor]
  node bump-file-version.js --bulk <pattern> [patch|minor]

Arguments:
  file         Path to the markdown file to bump
  patch|minor  Type of version bump (default: patch)

Options:
  --help, -h   Show this help message
  --bulk       Bump multiple files matching a glob pattern
  --repo-ver   Specify repository version (default: read from VERSION file)

Examples:
  # Bump patch version of a single file
  node bump-file-version.js ../instructions/coding-standards.instructions.md patch

  # Bump minor version
  node bump-file-version.js .github/prompts/review.prompt.md minor

  # Bulk bump patch versions
  node bump-file-version.js --bulk ".github/instructions/**/*.md" patch

Guardrails:
  - File version cannot exceed repository minor version
  - Automatically updates 'last_updated' field to current date
  - Validates version format and frontmatter structure
    `);
    process.exit(0);
  }

  try {
    const repoVersion = loadRepoVersion();
    console.log(`Repository version: ${repoVersion}\n`);

    // Check for bulk mode
    if (args[0] === '--bulk') {
      const glob = require('glob');
      const pattern = args[1];
      const bumpType = args[2] || 'patch';

      if (!pattern) {
        throw new Error('--bulk requires a glob pattern');
      }

      const files = glob.sync(pattern, { nodir: true });

      if (files.length === 0) {
        console.log(`No files found matching pattern: ${pattern}`);
        process.exit(0);
      }

      console.log(`Found ${files.length} files to bump\n`);

      let succeeded = 0;
      let failed = 0;

      files.forEach(file => {
        try {
          bumpFileVersion(file, bumpType, repoVersion);
          succeeded++;
        } catch (error) {
          console.error(`✗ ${file}: ${error.message}`);
          failed++;
        }
      });

      console.log(`\nCompleted: ${succeeded} succeeded, ${failed} failed`);
      process.exit(failed > 0 ? 1 : 0);

    } else {
      // Single file mode
      const filePath = args[0];
      const bumpType = args[1] || 'patch';

      bumpFileVersion(filePath, bumpType, repoVersion);
      process.exit(0);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  bumpFileVersion,
  parseVersion,
  formatVersion,
  extractFrontmatter,
  updateFileVersion,
  loadRepoVersion
};
