/**
 * @fileoverview Utilities for canonical label lookup and alias mapping.
 * @module label-lookup
 */

const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Loads and parses canonical labels from a YAML file.
 * @param {string} [labelsYmlPath='.github/labels.yml'] - Path to labels YAML.
 * @returns {Set<string>} Set of canonical label names.
 */
function fetchCanonicalLabels(labelsYmlPath = '.github/labels.yml') {
  const yml = fs.readFileSync(labelsYmlPath, 'utf8');
  const labelsData = yaml.load(yml);
  return new Set(labelsData.map(l => typeof l === "string" ? l : l.name));
}

/**
 * Builds a mapping of label aliases to their canonical label name.
 * @param {Array<Object>} labelsData - Parsed label definitions from labels.yml.
 * @returns {Object} aliasMap - Maps alias string to canonical label.
 */
function buildLabelAliasMap(labelsData) {
  const aliasMap = {};
  labelsData.forEach(label => {
    if (typeof label === "object" && Array.isArray(label.aliases)) {
      label.aliases.forEach(alias => {
        aliasMap[alias] = label.name;
      });
    }
  });
  return aliasMap;
}

/**
 * Finds the canonical label for a given label or alias.
 * @param {string} label - The label or alias to look up.
 * @param {Object} aliasMap - Alias mapping object.
 * @param {Set<string>} canonicalSet - Set of canonical label names.
 * @returns {string|null} Canonical label name or null if not found.
 */
function findStandardLabel(label, aliasMap, canonicalSet) {
  if (canonicalSet.has(label)) return label;
  if (aliasMap && aliasMap[label]) return aliasMap[label];
  return null;
}

module.exports = {
  fetchCanonicalLabels,
  buildLabelAliasMap,
  findStandardLabel,
};