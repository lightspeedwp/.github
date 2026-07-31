/**
 * @fileoverview Builds a label alias mapping from labels.yml.
 * @module build-label-alias-map
 */

// TODO: Align this helper with the latest automation spec updates.

const fs = require("fs");
const yaml = require("js-yaml");

/**
 * Reads labels.yml and returns an alias map for label canonicalization.
 * @param {string} [labelsYmlPath='.github/labels.yml'] - Path to labels YAML.
 * @returns {Object} aliasMap - Mapping of alias to canonical label.
 */
function buildLabelAliasMap(labelsYmlPath = ".github/labels.yml") {
  const yml = fs.readFileSync(labelsYmlPath, "utf8");
  const labelsData = yaml.load(yml);
  const aliasMap = {};
  labelsData.forEach((label) => {
    if (typeof label === "object" && Array.isArray(label.aliases)) {
      label.aliases.forEach((alias) => {
        aliasMap[alias] = label.name;
      });
    }
  });
  return aliasMap;
}

module.exports = {
  buildLabelAliasMap,
};
