#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: build-label-alias-map.js
 * Location: scripts/utility/build-label-alias-map.js
 * Description: Build alias → canonical mapping from .github/labels.yml.
 *              Supports direct, alias, and fuzzy matches.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Requirements: Node.js
 * Usage: Import to build alias-to-canonical label mappings.
 * ============================================================================
 */

/**
 * Build alias → canonical mapping from .github/labels.yml
 * @param {Array} labels - Array of { name }
 * @returns {Object} Mapping of alias → canonical label name
 */
function buildLabelAliasMap(labels) {
  const aliasMap = {};
  for (const label of labels) {
    const canonical = label.name;
    aliasMap[canonical.toLowerCase()] = canonical; // direct match
    const colonIdx = canonical.indexOf(':');
    if (colonIdx !== -1) {
      const family = canonical.slice(0, colonIdx);
      const value = canonical.slice(colonIdx + 1);
      if (value && value !== canonical) {
        aliasMap[value.toLowerCase()] = canonical; // e.g. 'php' → 'lang:php'
      }
      aliasMap[`${family} ${value}`.toLowerCase()] = canonical; // e.g. 'lang php' → 'lang:php'
    }
  }
  return aliasMap;
}

module.exports = {
  buildLabelAliasMap,
};