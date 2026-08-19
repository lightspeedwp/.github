/**
 * WordPress Release Agent
 * Orchestrates plugin and theme versioning for multi-repo releases
 */

import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import CommonJS utilities
const pluginHeader = require("./includes/pluginHeader.cjs");
const themeCss = require("./includes/themeCss.cjs");
const readmeTxt = require("./includes/readmeTxt.cjs");

/**
 * Detect WordPress component type and location
 * @param {string} repoRoot - Root path of repository
 * @returns {Object} Component info: { type, file, version }
 */
export function detectWordPressComponent(repoRoot) {
  const components = {
    plugins: [],
    themes: [],
  };

  // Check for plugin
  const pluginFile = pluginHeader.findPluginFile(repoRoot);
  if (pluginFile) {
    const version = pluginHeader.readVersion(pluginFile);
    components.plugins.push({
      file: pluginFile,
      version,
    });
  }

  // Check for theme
  const themeFile = themeCss.findThemeFile(repoRoot);
  if (themeFile) {
    const version = themeCss.readVersion(themeFile);
    components.themes.push({
      file: themeFile,
      version,
    });
  }

  // Check for readme.txt
  const readmeFile = readmeTxt.findReadmeFile(repoRoot);
  if (readmeFile) {
    const version = readmeTxt.readVersion(readmeFile);
    components.readmes = [
      {
        file: readmeFile,
        version,
      },
    ];
  }

  return {
    hasPlugin: components.plugins.length > 0,
    hasTheme: components.themes.length > 0,
    hasReadme: readmeFile !== null,
    components,
    primaryComponent: components.plugins[0] || components.themes[0] || null,
  };
}

/**
 * Validate version consistency across all WordPress components
 * @param {string} repoRoot - Root path of repository
 * @returns {Object} Validation results
 */
export function validateVersionConsistency(repoRoot) {
  const component = detectWordPressComponent(repoRoot);
  const versions = [];
  const mismatches = [];

  if (component.components.plugins.length > 0) {
    component.components.plugins.forEach((plugin) => {
      versions.push({
        file: plugin.file,
        type: "plugin",
        version: plugin.version,
      });
    });
  }

  if (component.components.themes.length > 0) {
    component.components.themes.forEach((theme) => {
      versions.push({
        file: theme.file,
        type: "theme",
        version: theme.version,
      });
    });
  }

  if (component.components.readmes) {
    component.components.readmes.forEach((readme) => {
      versions.push({
        file: readme.file,
        type: "readme",
        version: readme.version,
      });
    });
  }

  if (versions.length === 0) {
    return {
      isConsistent: false,
      message: "No WordPress components detected",
      versions: [],
      mismatches: ["No version files found"],
    };
  }

  const baseVersion = versions[0].version;
  versions.forEach((v) => {
    if (v.version !== baseVersion) {
      mismatches.push(`${v.file}: ${v.version} (expected ${baseVersion})`);
    }
  });

  return {
    isConsistent: mismatches.length === 0,
    baseVersion,
    versions,
    mismatches,
    message:
      mismatches.length === 0
        ? "All versions consistent"
        : `Version mismatches found: ${mismatches.join("; ")}`,
  };
}

/**
 * Update all WordPress component versions
 * @param {string} repoRoot - Root path of repository
 * @param {string} newVersion - New version (SemVer format)
 * @returns {Object} Update results
 */
export function updateAllVersions(repoRoot, newVersion) {
  const component = detectWordPressComponent(repoRoot);
  const results = {
    updated: [],
    failed: [],
    summary: "",
  };

  // Validate version format
  if (!pluginHeader.isValidVersion(newVersion)) {
    results.failed.push(`Invalid SemVer format: ${newVersion}`);
    results.summary = "Update failed: Invalid version format";
    return results;
  }

  // Update plugin version
  if (component.components.plugins.length > 0) {
    component.components.plugins.forEach((plugin) => {
      try {
        pluginHeader.writeVersion(plugin.file, newVersion);
        results.updated.push(`Plugin header: ${plugin.file}`);
      } catch (error) {
        results.failed.push(`Plugin header: ${error.message}`);
      }
    });
  }

  // Update theme version
  if (component.components.themes.length > 0) {
    component.components.themes.forEach((theme) => {
      try {
        themeCss.writeVersion(theme.file, newVersion);
        results.updated.push(`Theme CSS: ${theme.file}`);
      } catch (error) {
        results.failed.push(`Theme CSS: ${error.message}`);
      }
    });
  }

  // Update readme.txt version
  if (component.components.readmes && component.components.readmes.length > 0) {
    component.components.readmes.forEach((readme) => {
      try {
        readmeTxt.writeVersion(readme.file, newVersion);
        results.updated.push(`Readme.txt: ${readme.file}`);
      } catch (error) {
        results.failed.push(`Readme.txt: ${error.message}`);
      }
    });
  }

  // Generate summary
  const success = results.failed.length === 0;
  results.summary = success
    ? `Successfully updated ${results.updated.length} version files to ${newVersion}`
    : `Updated ${results.updated.length} files, ${results.failed.length} failed`;

  return {
    ...results,
    success,
  };
}

/**
 * Bump version across all components
 * @param {string} repoRoot - Root path of repository
 * @param {string} scope - 'major', 'minor', or 'patch'
 * @returns {Object} Bump results
 */
export function bumpAllVersions(repoRoot, scope = "patch") {
  const component = detectWordPressComponent(repoRoot);

  if (!component.primaryComponent) {
    return {
      success: false,
      message: "No WordPress components detected",
      bumpedVersion: null,
    };
  }

  const currentVersion = component.primaryComponent.version;
  if (!currentVersion) {
    return {
      success: false,
      message: "Could not determine current version",
      bumpedVersion: null,
    };
  }

  try {
    const newVersion = pluginHeader.bumpVersion(currentVersion, scope);
    const updateResults = updateAllVersions(repoRoot, newVersion);

    return {
      ...updateResults,
      currentVersion,
      newVersion,
      scope,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      currentVersion,
      bumpedVersion: null,
    };
  }
}

/**
 * Get metadata for all WordPress components
 * @param {string} repoRoot - Root path of repository
 * @returns {Object} Metadata for all components
 */
export function getComponentMetadata(repoRoot) {
  const component = detectWordPressComponent(repoRoot);
  const metadata = {
    hasPlugin: component.hasPlugin,
    hasTheme: component.hasTheme,
    hasReadme: component.hasReadme,
  };

  if (component.components.plugins.length > 0) {
    metadata.plugin = pluginHeader.readMetadata(
      component.components.plugins[0].file,
    );
  }

  if (component.components.themes.length > 0) {
    metadata.theme = themeCss.readMetadata(component.components.themes[0].file);
  }

  if (component.components.readmes && component.components.readmes.length > 0) {
    metadata.readme = readmeTxt.readMetadata(
      component.components.readmes[0].file,
    );
  }

  return metadata;
}

export default {
  detectWordPressComponent,
  validateVersionConsistency,
  updateAllVersions,
  bumpAllVersions,
  getComponentMetadata,
  pluginHeader,
  themeCss,
  readmeTxt,
};
