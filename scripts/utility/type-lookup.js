#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: type-lookup.js
 * Location: scripts/utility/type-lookup.js
 * Description: Canonical Issue Type Lookup Utility. Fetches canonical issue types from the community health repo,
 *              builds alias-to-canonical mapping, and provides standard type lookup.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Requirements: Node.js, @octokit/rest, js-yaml
 * Usage: Import for type lookup and dynamic mapping
 * ============================================================================
 */
const { fetchCanonicalIssueTypes } = require('./fetch-canonical-issue-types');
const { buildTypeAliasMap } = require('./build-type-alias-map');

/**
 * Find canonical type for any input string (e.g. 'bug', 'type:bug').
 * Returns: canonical type label or null.
 * @param {string} input
 * @param {Object} aliasMap - output of buildTypeAliasMap
 */
function findStandardType(input, aliasMap) {
  if (!input) return null;
  const norm = input.toLowerCase().trim();
  return aliasMap[norm] || null;
}

module.exports = {
  fetchCanonicalIssueTypes,
  buildTypeAliasMap,
  findStandardType,
};