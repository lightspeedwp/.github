/**
 * Theme CSS Versioning Utility
 * Manages version updates in WordPress theme style.css
 */

const fs = require('fs');
const path = require('path');

/**
 * Find the main theme file (style.css)
 * @param {string} repoRoot - Path to theme repository root
 * @returns {string|null} Path to style.css or null
 */
function findThemeFile(repoRoot) {
  const styleCssPath = path.join(repoRoot, 'style.css');
  if (fs.existsSync(styleCssPath)) {
    const content = fs.readFileSync(styleCssPath, 'utf8');
    // Verify it's a WordPress theme file
    if (content.match(/Theme\s+Name\s*:/i)) {
      return styleCssPath;
    }
  }
  return null;
}

/**
 * Read version from WordPress theme style.css
 * Parses the "Version: X.Y.Z" line in the CSS header
 * @param {string} filePath - Path to style.css
 * @returns {string|null} Current version or null if not found
 */
function readVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Read only first 2KB to get headers
    const header = content.slice(0, 2048);
    const match = header.match(/Version\s*:\s*([\d.]+(?:-[a-zA-Z0-9.-]*)?)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Write version to WordPress theme style.css
 * Updates the "Version: X.Y.Z" line in the CSS header comment
 * @param {string} filePath - Path to style.css
 * @param {string} newVersion - New version (SemVer format)
 * @throws {Error} If file cannot be read/written
 */
function writeVersion(filePath, newVersion) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find and replace the Version line
    if (content.match(/Version\s*:\s*[\d.]+/i)) {
      content = content.replace(
        /Version\s*:\s*[\d.]+(?:-[a-zA-Z0-9.-]*)*/i,
        `Version: ${newVersion}`
      );
    } else {
      throw new Error('No Version header found in theme style.css');
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to update theme version in ${filePath}: ${error.message}`
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
 * Read theme metadata from style.css header
 * Returns all standard WordPress theme header fields
 * @param {string} filePath - Path to style.css
 * @returns {Object} Theme metadata
 */
function readMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const header = content.slice(0, 2048);

    const metadata = {
      name: null,
      description: null,
      version: null,
      author: null,
      authorUri: null,
      themeUri: null,
      license: null,
      licenseUri: null,
      domainPath: null,
      textDomain: null,
    };

    const patterns = {
      name: /Theme\s+Name\s*:\s*(.+?)$/im,
      description: /Description\s*:\s*(.+?)$/im,
      version: /Version\s*:\s*([\d.]+(?:-[a-zA-Z0-9.-]*)?)/i,
      author: /Author\s*:\s*(.+?)$/im,
      authorUri: /Author\s+URI\s*:\s*(.+?)$/im,
      themeUri: /Theme\s+URI\s*:\s*(.+?)$/im,
      license: /License\s*:\s*(.+?)$/im,
      licenseUri: /License\s+URI\s*:\s*(.+?)$/im,
      domainPath: /Domain\s+Path\s*:\s*(.+?)$/im,
      textDomain: /Text\s+Domain\s*:\s*(.+?)$/im,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = header.match(pattern);
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
  findThemeFile,
  readVersion,
  writeVersion,
  isValidVersion,
  bumpVersion,
  readMetadata,
};
