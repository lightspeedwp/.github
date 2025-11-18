/**
 * @fileoverview Utilities for loading and resolving canonical issue types and their aliases.
 * @module type-lookup
 */

const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Loads and parses issue types from a YAML file.
 * @param {string} [issueTypesYmlPath='.github/issue-types.yml'] - Path to issue-types YAML.
 * @returns {Array<Object>} Array of issue type definitions.
 */
function loadIssueTypes(issueTypesYmlPath = '.github/issue-types.yml') {
    const yml = fs.readFileSync(issueTypesYmlPath, 'utf8');
    return yaml.load(yml).issue_types || [];
}

module.exports = { loadIssueTypes };
