/**
 * Version Manager
 * Detects, validates, and bumps version files across all repo types
 */

const fs = require('fs');
const path = require('path');

/**
 * Detect all version files in the repository
 * @param {Object} repoConfig - Config from repoDetector
 * @returns {Object} Map of detected version files with current versions
 */
function detectAllVersionFiles(repoConfig) {
  const detected = {};
  const root = repoConfig.root;

  // Check VERSION file (all repo types)
  const versionFile = path.join(root, 'VERSION');
  if (fs.existsSync(versionFile)) {
    detected.VERSION = {
      path: 'VERSION',
      fullPath: versionFile,
      current: readVersionFile(versionFile),
    };
  }

  // Check package.json
  const packageJsonFile = path.join(root, 'package.json');
  if (fs.existsSync(packageJsonFile)) {
    detected.packageJson = {
      path: 'package.json',
      fullPath: packageJsonFile,
      current: readVersionFromPackageJson(packageJsonFile),
    };
  }

  // Check plugin file (for plugins)
  if (repoConfig.type === 'plugin' && repoConfig.mainFile) {
    const pluginName = path.basename(repoConfig.mainFile);
    detected.plugin = {
      path: pluginName,
      fullPath: repoConfig.mainFile,
      current: readVersionFromPluginFile(repoConfig.mainFile),
    };
  }

  // Check theme style.css (for themes)
  if (repoConfig.type === 'theme' && repoConfig.mainFile) {
    detected.theme = {
      path: 'style.css',
      fullPath: repoConfig.mainFile,
      current: readVersionFromThemeFile(repoConfig.mainFile),
    };
  }

  // Check readme.txt (for plugins)
  if (repoConfig.readmeFile && fs.existsSync(repoConfig.readmeFile)) {
    detected.readme = {
      path: 'readme.txt',
      fullPath: repoConfig.readmeFile,
      current: readVersionFromReadme(repoConfig.readmeFile),
    };
  }

  return detected;
}

/**
 * Validate that all detected versions are consistent
 * @param {Object} versionMap - Map from detectAllVersionFiles()
 * @returns {Object} { isConsistent: boolean, mismatches: [...] }
 */
function validateVersionConsistency(versionMap) {
  const versions = Object.entries(versionMap).map(([key, info]) => ({
    file: info.path,
    version: info.current,
  }));

  if (versions.length === 0) {
    return {
      isConsistent: false,
      mismatches: ['No version files detected'],
    };
  }

  const baseVersion = versions[0].version;
  const mismatches = versions
    .filter((v) => v.version !== baseVersion)
    .map((v) => `${v.file}: ${v.version} (expected ${baseVersion})`);

  return {
    isConsistent: mismatches.length === 0,
    mismatches,
    baseVersion,
  };
}

/**
 * Validate new version format (SemVer)
 * @param {string} version
 * @returns {boolean}
 */
function isValidSemVer(version) {
  const semverRegex = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
}

/**
 * Bump version based on scope
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
  const patch = parseInt(parts[2], 10);

  if (scope === 'major') {
    return `${major + 1}.0.0`;
  }
  if (scope === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
}

/**
 * Calculate next version from current
 * @param {string} currentVersion
 * @param {string} scope - 'major', 'minor', or 'patch'
 * @returns {string} New version
 */
function getNextVersion(currentVersion, scope = 'patch') {
  return bumpVersion(currentVersion, scope);
}

/**
 * Apply version bump to all version files
 * @param {Object} versionMap - Map from detectAllVersionFiles()
 * @param {string} newVersion
 * @returns {Object} { updated: [...], failed: [...], success: boolean }
 */
function applyVersionBump(versionMap, newVersion) {
  if (!isValidSemVer(newVersion)) {
    return {
      updated: [],
      failed: [`Invalid SemVer format: ${newVersion}`],
      success: false,
    };
  }

  const updated = [];
  const failed = [];

  for (const [key, info] of Object.entries(versionMap)) {
    try {
      if (key === 'VERSION') {
        writeVersionFile(info.fullPath, newVersion);
      } else if (key === 'packageJson') {
        writeVersionToPackageJson(info.fullPath, newVersion);
      } else if (key === 'plugin') {
        writeVersionToPluginFile(info.fullPath, newVersion);
      } else if (key === 'theme') {
        writeVersionToThemeFile(info.fullPath, newVersion);
      } else if (key === 'readme') {
        writeVersionToReadme(info.fullPath, newVersion);
      }
      updated.push(info.path);
    } catch (error) {
      failed.push(`${info.path}: ${error.message}`);
    }
  }

  return {
    updated,
    failed,
    success: failed.length === 0,
  };
}

/**
 * Read version from plain VERSION file
 * @param {string} filePath
 * @returns {string|null}
 */
function readVersionFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch {
    return null;
  }
}

/**
 * Write version to plain VERSION file
 * @param {string} filePath
 * @param {string} version
 */
function writeVersionFile(filePath, version) {
  fs.writeFileSync(filePath, version + '\n', 'utf8');
}

/**
 * Read version from package.json
 * @param {string} filePath
 * @returns {string|null}
 */
function readVersionFromPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    return json.version || null;
  } catch {
    return null;
  }
}

/**
 * Write version to package.json
 * @param {string} filePath
 * @param {string} version
 */
function writeVersionToPackageJson(filePath, version) {
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  json.version = version;
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
}

/**
 * Read version from WordPress plugin file
 * Looks for "Version: X.Y.Z" in plugin header
 * @param {string} filePath
 * @returns {string|null}
 */
function readVersionFromPluginFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').slice(0, 8192);
    const match = content.match(/Version\s*:\s*([\d.]+)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Write version to WordPress plugin file
 * Updates "Version: X.Y.Z" line in plugin header
 * @param {string} filePath
 * @param {string} version
 */
function writeVersionToPluginFile(filePath, version) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /Version\s*:\s*[\d.]+/i,
    `Version: ${version}`
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Read version from WordPress theme CSS file
 * Looks for "Version: X.Y.Z" in CSS header comment
 * @param {string} filePath
 * @returns {string|null}
 */
function readVersionFromThemeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').slice(0, 2048);
    const match = content.match(/Version\s*:\s*([\d.]+)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Write version to WordPress theme CSS file
 * @param {string} filePath
 * @param {string} version
 */
function writeVersionToThemeFile(filePath, version) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /Version\s*:\s*[\d.]+/i,
    `Version: ${version}`
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Read version from WordPress plugin readme.txt
 * Looks for "Stable tag: X.Y.Z"
 * @param {string} filePath
 * @returns {string|null}
 */
function readVersionFromReadme(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/Stable\s+tag\s*:\s*([\d.]+)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Write version to WordPress plugin readme.txt
 * @param {string} filePath
 * @param {string} version
 */
function writeVersionToReadme(filePath, version) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /Stable\s+tag\s*:\s*[\d.]+/i,
    `Stable tag: ${version}`
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Get current version (from VERSION file or package.json)
 * @param {Object} versionMap
 * @returns {string|null}
 */
function getCurrentVersion(versionMap) {
  if (versionMap.VERSION) {
    return versionMap.VERSION.current;
  }
  if (versionMap.packageJson) {
    return versionMap.packageJson.current;
  }
  return null;
}

module.exports = {
  detectAllVersionFiles,
  validateVersionConsistency,
  isValidSemVer,
  bumpVersion,
  getNextVersion,
  applyVersionBump,
  readVersionFile,
  writeVersionFile,
  readVersionFromPackageJson,
  writeVersionToPackageJson,
  readVersionFromPluginFile,
  writeVersionToPluginFile,
  readVersionFromThemeFile,
  writeVersionToThemeFile,
  readVersionFromReadme,
  writeVersionToReadme,
  getCurrentVersion,
};
