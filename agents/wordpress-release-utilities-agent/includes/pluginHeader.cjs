/**
 * Plugin Header Versioning Utility
 * Manages version updates in WordPress plugin headers
 */

const fs = require('fs');
const path = require('path');

/**
 * Find the main plugin file in a directory
 * Looks for {plugin-name}.php in the repo root
 * @param {string} repoRoot - Path to plugin repository root
 * @returns {string|null} Path to main plugin file or null
 */
function findPluginFile(repoRoot) {
  try {
    const files = fs.readdirSync(repoRoot);
    const phpFiles = files.filter((file) => file.endsWith('.php'));

    // Look for README.txt or plugin-named PHP file
    for (const file of phpFiles) {
      const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
      if (content.match(/Plugin\s+Name\s*:/i)) {
        return path.join(repoRoot, file);
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Read version from WordPress plugin header
 * Parses the "Version: X.Y.Z" line
 * @param {string} filePath - Path to plugin file
 * @returns {string|null} Current version or null if not found
 */
function readVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Read only first 8KB to get headers
    const header = content.slice(0, 8192);
    const match = header.match(/Version\s*:\s*([\d.]+(?:-[a-zA-Z0-9.-]*)?)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Write version to WordPress plugin header
 * Updates the "Version: X.Y.Z" line
 * @param {string} filePath - Path to plugin file
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
      throw new Error('No Version header found in plugin file');
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to update plugin version in ${filePath}: ${error.message}`
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
 * Read plugin metadata from header
 * Returns all standard WordPress plugin header fields
 * @param {string} filePath - Path to plugin file
 * @returns {Object} Plugin metadata
 */
function readMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const header = content.slice(0, 8192);

    const metadata = {
      name: null,
      description: null,
      version: null,
      author: null,
      authorUri: null,
      pluginUri: null,
      license: null,
      domainPath: null,
      textDomain: null,
    };

    const patterns = {
      name: /Plugin\s+Name\s*:\s*(.+?)$/im,
      description: /Description\s*:\s*(.+?)$/im,
      version: /Version\s*:\s*([\d.]+(?:-[a-zA-Z0-9.-]*)?)/i,
      author: /Author\s*:\s*(.+?)$/im,
      authorUri: /Author\s+URI\s*:\s*(.+?)$/im,
      pluginUri: /Plugin\s+URI\s*:\s*(.+?)$/im,
      license: /License\s*:\s*(.+?)$/im,
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
  findPluginFile,
  readVersion,
  writeVersion,
  isValidVersion,
  bumpVersion,
  readMetadata,
};
