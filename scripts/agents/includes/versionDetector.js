#!/usr/bin/env node
/**
 * ============================================================================
 * Module: versionDetector.js
 * Location: scripts/agents/includes/versionDetector.js
 * Description:
 *   - Detects semantic version bumps from changelog entries
 *   - Analyzes conventional commits and changelog sections
 *   - Determines version bump type (major, minor, patch)
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - Follows Semantic Versioning v2.0.0
 * ============================================================================
 */

/**
 * Parse semantic version string
 * @param {string} versionString - Version string (e.g., "1.2.3", "v1.2.3")
 * @returns {Object} Parsed version {major, minor, patch} or null if invalid
 */
function parseVersion(versionString) {
  if (!versionString || typeof versionString !== "string") {
    return null;
  }

  const match = versionString.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Format version object to string
 * @param {Object} version - Version object {major, minor, patch}
 * @returns {string} Formatted version string (e.g., "1.2.3")
 */
function formatVersion(version) {
  if (!version || typeof version !== "object") {
    return null;
  }

  if (
    typeof version.major !== "number" ||
    typeof version.minor !== "number" ||
    typeof version.patch !== "number"
  ) {
    return null;
  }

  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Compare two version objects
 * @param {Object} version1 - First version {major, minor, patch}
 * @param {Object} version2 - Second version {major, minor, patch}
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(version1, version2) {
  if (!version1 || !version2) {
    return null;
  }

  if (version1.major !== version2.major) {
    return version1.major < version2.major ? -1 : 1;
  }

  if (version1.minor !== version2.minor) {
    return version1.minor < version2.minor ? -1 : 1;
  }

  if (version1.patch !== version2.patch) {
    return version1.patch < version2.patch ? -1 : 1;
  }

  return 0;
}

/**
 * Determine version bump type from changelog sections
 * @param {Object} entries - Entries organized by section {added, fixed, deprecated, removed, etc}
 * @param {Array} breakingChanges - Array of breaking change descriptions
 * @returns {string} Bump type: 'major', 'minor', 'patch', or null if no changes
 */
function determineBumpType(entries, breakingChanges = []) {
  if (!entries || typeof entries !== "object") {
    return null;
  }

  const safeBreakingChanges = Array.isArray(breakingChanges)
    ? breakingChanges
    : [];

  // Major bump: breaking changes or removed section has items
  if (safeBreakingChanges.length > 0) {
    return "major";
  }

  if (
    entries.removed &&
    Array.isArray(entries.removed) &&
    entries.removed.length > 0
  ) {
    return "major";
  }

  // Minor bump: added features or deprecated items
  if (
    entries.added &&
    Array.isArray(entries.added) &&
    entries.added.length > 0
  ) {
    return "minor";
  }

  if (
    entries.deprecated &&
    Array.isArray(entries.deprecated) &&
    entries.deprecated.length > 0
  ) {
    return "minor";
  }

  // Patch bump: fixed, security, or other changes
  if (
    (entries.fixed &&
      Array.isArray(entries.fixed) &&
      entries.fixed.length > 0) ||
    (entries.security &&
      Array.isArray(entries.security) &&
      entries.security.length > 0) ||
    (entries.changed &&
      Array.isArray(entries.changed) &&
      entries.changed.length > 0) ||
    (entries.documentation &&
      Array.isArray(entries.documentation) &&
      entries.documentation.length > 0) ||
    (entries.performance &&
      Array.isArray(entries.performance) &&
      entries.performance.length > 0)
  ) {
    return "patch";
  }

  return null;
}

/**
 * Calculate next version based on current version and bump type
 * @param {string} currentVersion - Current version string (e.g., "1.2.3")
 * @param {string} bumpType - Bump type: 'major', 'minor', or 'patch'
 * @returns {string} Next version string or null if invalid input
 */
function calculateNextVersion(currentVersion, bumpType) {
  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    return null;
  }

  const nextVersion = { ...parsed };

  switch (bumpType) {
    case "major":
      nextVersion.major += 1;
      nextVersion.minor = 0;
      nextVersion.patch = 0;
      break;

    case "minor":
      nextVersion.minor += 1;
      nextVersion.patch = 0;
      break;

    case "patch":
      nextVersion.patch += 1;
      break;

    default:
      return null;
  }

  return formatVersion(nextVersion);
}

/**
 * Detect version bump from changelog entries
 * @param {Object} entries - Entries organized by section
 * @param {Array} breakingChanges - Array of breaking change descriptions
 * @returns {Object} Bump detection result {bumpType, hasBreakingChanges, hasFeaturesOrDeprecations, hasModifications}
 */
function detectBump(entries, breakingChanges = []) {
  const bumpType = determineBumpType(entries, breakingChanges);
  const safeBreakingChanges = Array.isArray(breakingChanges)
    ? breakingChanges
    : [];

  return {
    bumpType,
    hasBreakingChanges: safeBreakingChanges.length > 0,
    hasFeaturesOrDeprecations:
      entries?.added?.length > 0 || entries?.deprecated?.length > 0,
    hasModifications:
      entries?.fixed?.length > 0 ||
      entries?.security?.length > 0 ||
      entries?.changed?.length > 0 ||
      entries?.documentation?.length > 0 ||
      entries?.performance?.length > 0,
  };
}

/**
 * Get suggestion for next release based on version history
 * @param {string} currentVersion - Current version
 * @param {Array} versionHistory - Array of previous versions
 * @returns {string} Suggested next version
 */
function suggestNextVersion(currentVersion, versionHistory = []) {
  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    return null;
  }

  const safeHistory = Array.isArray(versionHistory) ? versionHistory : [];

  // Check if we're skipping patch versions (common when jumping minor/major)
  const allVersions = [currentVersion, ...safeHistory]
    .map(parseVersion)
    .filter(Boolean);

  if (allVersions.length === 0) {
    return null;
  }

  // Sort versions in descending order
  allVersions.sort((a, b) => compareVersions(b, a));

  // If the highest version is greater than current, increment accordingly
  const highest = allVersions[0];

  if (compareVersions(highest, parsed) > 0) {
    const nextVersion = { ...highest };
    nextVersion.patch += 1;
    return formatVersion(nextVersion);
  }

  // Default: increment patch
  const nextVersion = { ...parsed };
  nextVersion.patch += 1;
  return formatVersion(nextVersion);
}

module.exports = {
  parseVersion,
  formatVersion,
  compareVersions,
  determineBumpType,
  calculateNextVersion,
  detectBump,
  suggestNextVersion,
};
