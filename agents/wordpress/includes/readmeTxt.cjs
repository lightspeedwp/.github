/**
 * Plugin readme.txt Versioning Utility
 * Manages version updates in WordPress plugin readme.txt files
 */

const fs = require('fs');
const path = require('path');

/**
 * Find the readme.txt file in a plugin directory
 * @param {string} repoRoot - Path to plugin repository root
 * @returns {string|null} Path to readme.txt or null
 */
function findReadmeFile(repoRoot) {
  const readmePath = path.join(repoRoot, 'readme.txt');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    // Verify it's a WordPress plugin readme
    if (content.match(/===\s+.+\s+===/)) {
      return readmePath;
    }
  }
  return null;
}

/**
 * Read version from WordPress plugin readme.txt
 * Parses the "Stable tag: X.Y.Z" line
 * @param {string} filePath - Path to readme.txt
 * @returns {string|null} Current version or null if not found
 */
function readVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/Stable\s+tag\s*:\s*([\d.]+(?:-[a-zA-Z0-9.-]*)?)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Write version to WordPress plugin readme.txt
 * Updates the "Stable tag: X.Y.Z" line
 * @param {string} filePath - Path to readme.txt
 * @param {string} newVersion - New version (SemVer format)
 * @throws {Error} If file cannot be read/written
 */
function writeVersion(filePath, newVersion) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find and replace the Stable tag line
    if (content.match(/Stable\s+tag\s*:\s*[\d.]+/i)) {
      content = content.replace(
        /Stable\s+tag\s*:\s*[\d.]+(?:-[a-zA-Z0-9.-]*)*/i,
        `Stable tag: ${newVersion}`
      );
    } else {
      throw new Error('No Stable tag header found in readme.txt');
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to update readme version in ${filePath}: ${error.message}`
    );
  }
}

/**
 * Validate version format (SemVer)
 * @param {string} version
 * @returns {boolean} True if valid SemVer
 */
function isValidVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
}

/**
 * Bump version (major, minor, or patch)
 * @param {string} currentVersion
 * @param {string} scope - 'major', 'minor', or 'patch'
 * @returns {string} New version
 * @throws {Error} If scope is invalid
 */
function bumpVersion(currentVersion, scope = 'patch') {
  if (!['major', 'minor', 'patch'].includes(scope)) {
    throw new Error(`Invalid scope: ${scope}. Use 'major', 'minor', or 'patch'.`);
  }

  const parts = currentVersion.split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  let patch = parseInt(parts[2], 10);

  // Remove pre-release suffix if present
  if (parts[2].includes('-')) {
    patch = parseInt(parts[2].split('-')[0], 10);
  }

  if (scope === 'major') {
    return `${major + 1}.0.0`;
  }
  if (scope === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
}

/**
 * Read plugin metadata from readme.txt header
 * Returns header information and changelog
 * @param {string} filePath - Path to readme.txt
 * @returns {Object} Plugin metadata and changelog info
 */
function readMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const metadata = {
      name: null,
      description: null,
      version: null,
      author: null,
      authorUri: null,
      pluginUri: null,
      donate: null,
      license: null,
      requiresWp: null,
      tested: null,
      changelog: null,
    };

    const headerLines = [];

    for (const line of lines) {
      if (line.startsWith('===')) {
        break;
      }
      headerLines.push(line.trim());
    }

    const headerText = headerLines.join('\n');
    const patterns = {
      name: /^(.+?)$/m,
      description: /Description:\s*(.+?)$/im,
      author: /Author:\s*(.+?)$/im,
      authorUri: /Author URI:\s*(.+?)$/im,
      pluginUri: /Plugin URI:\s*(.+?)$/im,
      donate: /Donate link:\s*(.+?)$/im,
      license: /License:\s*(.+?)$/im,
      requiresWp: /Requires at least:\s*([\d.]+)/i,
      tested: /Tested up to:\s*([\d.]+)/i,
      version: /Stable tag:\s*([\d.]+(?:-[a-zA-Z0-9.-]*)?)/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = headerText.match(pattern);
      if (match) {
        metadata[key] = match[1].trim();
      }
    }

    return metadata;
  } catch {
    return null;
  }
}

module.exports = {
  findReadmeFile,
  readVersion,
  writeVersion,
  isValidVersion,
  bumpVersion,
  readMetadata,
};
