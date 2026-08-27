/**
 * Repository Type Detector
 * Identifies repository type (control-plane, plugin, theme) and structure
 */

const fs = require('fs');
const path = require('path');

/**
 * Detect repository type and return configuration
 * @param {string} repoRoot - Root directory of the repository (default: cwd)
 * @returns {Object} Detected repo type with configuration
 * @throws {Error} If repo type cannot be determined
 */
function detectRepoType(repoRoot = process.cwd()) {
  const controlPlaneConfig = detectControlPlane(repoRoot);
  if (controlPlaneConfig) return controlPlaneConfig;

  const pluginConfig = detectWordPressPlugin(repoRoot);
  if (pluginConfig) return pluginConfig;

  const themeConfig = detectWordPressTheme(repoRoot);
  if (themeConfig) return themeConfig;

  throw new Error(
    `Unable to detect repository type at ${repoRoot}. ` +
    'Expected control-plane (.github), WordPress plugin, or WordPress theme.'
  );
}

/**
 * Detect if repo is a control plane (.github repository)
 * @param {string} repoRoot
 * @returns {Object|null}
 */
function detectControlPlane(repoRoot) {
  const gitHubDir = path.join(repoRoot, '.github');
  const versionFile = path.join(repoRoot, 'VERSION');
  const packageJsonFile = path.join(repoRoot, 'package.json');

  if (!fs.existsSync(gitHubDir)) return null;

  // Validate required files exist
  if (!fs.existsSync(versionFile) || !fs.existsSync(packageJsonFile)) {
    return null;
  }

  return {
    type: 'control-plane',
    root: repoRoot,
    versionFiles: ['VERSION', 'package.json'],
    mainFile: null,
    readmeFile: null,
    workspace: '.github',
  };
}

/**
 * Detect if repo is a WordPress plugin
 * @param {string} repoRoot
 * @returns {Object|null}
 */
function detectWordPressPlugin(repoRoot) {
  const versionFile = path.join(repoRoot, 'VERSION');
  const readmeFile = path.join(repoRoot, 'readme.txt');
  const packageJsonFile = path.join(repoRoot, 'package.json');

  // Must have VERSION file
  if (!fs.existsSync(versionFile)) return null;

  // Look for plugin file (*.php with plugin header)
  const pluginFile = findPluginFile(repoRoot);
  if (!pluginFile) return null;

  const versionFiles = ['VERSION'];

  // Only add plugin file
  versionFiles.push(path.basename(pluginFile));

  // Only add optional files if they exist
  if (fs.existsSync(packageJsonFile)) {
    versionFiles.push('package.json');
  }

  if (fs.existsSync(readmeFile)) {
    versionFiles.push('readme.txt');
  }

  return {
    type: 'plugin',
    root: repoRoot,
    versionFiles,
    mainFile: pluginFile,
    readmeFile: fs.existsSync(readmeFile) ? readmeFile : null,
    workspace: null,
  };
}

/**
 * Detect if repo is a WordPress theme
 * @param {string} repoRoot
 * @returns {Object|null}
 */
function detectWordPressTheme(repoRoot) {
  const versionFile = path.join(repoRoot, 'VERSION');
  const styleFile = path.join(repoRoot, 'style.css');

  // Must have VERSION and style.css
  if (!fs.existsSync(versionFile) || !fs.existsSync(styleFile)) {
    return null;
  }

  const versionFiles = ['VERSION', 'style.css'];

  const packageJsonFile = path.join(repoRoot, 'package.json');
  if (fs.existsSync(packageJsonFile)) {
    versionFiles.push('package.json');
  }

  return {
    type: 'theme',
    root: repoRoot,
    versionFiles,
    mainFile: styleFile,
    readmeFile: null,
    workspace: null,
  };
}

/**
 * Find the main plugin PHP file
 * Searches for files with plugin header in first 8KB
 * @param {string} repoRoot
 * @returns {string|null}
 */
function findPluginFile(repoRoot) {
  const phpFiles = fs
    .readdirSync(repoRoot)
    .filter((file) => file.endsWith('.php'));

  for (const file of phpFiles) {
    const filePath = path.join(repoRoot, file);
    const content = fs.readFileSync(filePath, 'utf8').slice(0, 8192);

    // Look for plugin header (case-insensitive)
    if (/Plugin\s*Name\s*:/i.test(content)) {
      return filePath;
    }
  }

  return null;
}

/**
 * Get version files for a detected repo type
 * @param {Object} repoConfig - Config from detectRepoType()
 * @returns {string[]} Array of version file paths
 */
function getVersionFiles(repoConfig) {
  return repoConfig.versionFiles.map((file) =>
    path.join(repoConfig.root, file)
  );
}

/**
 * Validate that repo structure is correct
 * @param {Object} repoConfig
 * @returns {boolean}
 */
function isValidRepoStructure(repoConfig) {
  try {
    // All version files must be readable
    for (const versionFile of repoConfig.versionFiles) {
      const filePath = path.join(repoConfig.root, versionFile);
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        return false;
      }
    }

    // Main file (if present) must be readable
    if (repoConfig.mainFile && !fs.existsSync(repoConfig.mainFile)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get main file for repo (plugin file or style.css)
 * @param {Object} repoConfig
 * @returns {string|null}
 */
function getMainFile(repoConfig) {
  return repoConfig.mainFile || null;
}

module.exports = {
  detectRepoType,
  detectControlPlane,
  detectWordPressPlugin,
  detectWordPressTheme,
  findPluginFile,
  getVersionFiles,
  isValidRepoStructure,
  getMainFile,
};
