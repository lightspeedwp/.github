#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-lookup.js
 * Location: scripts/utility/label-lookup.js
 * Description: Canonical Label Lookup Utility for LightSpeedWP.
 *   Fetches canonical labels from the community health repo, builds alias→canonical mapping,
 *   and provides reliable lookup for standard label forms.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Usage: Import for canonical label fetching and lookup.
 * ============================================================================
 */
const jsYaml = require('js-yaml');

/**
 * Fetch canonical labels from org community health repo (.github/labels.yml)
 * Returns: Array of { name, color, description }
 */
async function fetchCanonicalLabels(octokit, owner = 'lightspeedwp', repo = '.github', path = '.github/labels.yml') {
  const res = await octokit.rest.repos.getContent({ owner, repo, path });
  const yamlStr = Buffer.from(res.data.content, 'base64').toString();
  return jsYaml.load(yamlStr); // [{name, color, description}]
}

/**
 * Build alias → canonical mapping from .github/labels.yml
 * Returns: { [alias]: canonical }
 */
function buildLabelAliasMap(labels) {
  const aliasMap = {};
  for (const label of labels) {
    const canonical = label.name;
    aliasMap[canonical.toLowerCase()] = canonical;
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

/**
 * Find canonical label for any input string (e.g. 'php' or 'lang:php')
 * Returns: canonical label name or null
 */
function findStandardLabel(input, aliasMap) {
  if (!input) return null;
  const norm = input.toLowerCase().trim();
  return aliasMap[norm] || null;
}

module.exports = {
  fetchCanonicalLabels,
  buildLabelAliasMap,
  findStandardLabel,
};