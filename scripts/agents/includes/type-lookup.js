/**
 * @fileoverview Utilities for loading and resolving canonical issue types and their aliases.
 * @module type-lookup
 */

const fs = require("fs");
const yaml = require("js-yaml");

/**
 * Loads and parses issue types from a YAML file.
 * @param {string} [issueTypesYmlPath='.github/issue-types.yml'] - Path to issue-types YAML.
 * @returns {Array<Object>} Array of issue type definitions.
 */
function loadIssueTypes(issueTypesYmlPath = ".github/issue-types.yml") {
  const yml = fs.readFileSync(issueTypesYmlPath, "utf8");
  return yaml.load(yml).issue_types || [];
}

/**
 * Build type alias map from types config.
 * @param {Array<object>} types
 * @returns {Object}
 */
function _buildTypeAliasMap(types) {
  const aliasMap = {};
  for (const type of types) {
    if (type.aliases) {
      for (const alias of type.aliases) {
        aliasMap[alias.toLowerCase()] = type.label || type.name;
      }
    }
  }
  return aliasMap;
}

module.exports = { loadIssueTypes };
