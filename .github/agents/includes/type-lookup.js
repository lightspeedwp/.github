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

/**
 * Builds a mapping of issue type aliases to their canonical type.
 * @param {Array<Object>} types - Array of issue type definitions.
 * @returns {Object} aliasMap - Maps alias string to canonical type label.
 */
function buildTypeAliasMap(types) {
    const aliasMap = {};
    types.forEach((type) => {
        // The canonical label is the primary identifier
        const canonicalLabel = type.label;

        // Map the type name (lowercase) as an alias
        if (type.name) {
            aliasMap[type.name.toLowerCase()] = canonicalLabel;
        }

        // Map any additional aliases if they exist
        if (Array.isArray(type.aliases)) {
            type.aliases.forEach((alias) => {
                aliasMap[alias.toLowerCase()] = canonicalLabel;
            });
        }
    });
    return aliasMap;
}

/**
 * Finds the canonical issue type by name or alias.
 * @param {string} typeOrAlias - The type label or alias to look up.
 * @param {Object} aliasMap - Alias mapping object.
 * @returns {string|null} Canonical type label or null if not found.
 */
function findStandardType(typeOrAlias, aliasMap) {
    if (!typeOrAlias || !aliasMap) return null;

    // Check if it's already a canonical label
    if (Object.values(aliasMap).includes(typeOrAlias)) {
        return typeOrAlias;
    }

    // Look up as an alias
    const normalized = typeOrAlias.toLowerCase();
    return aliasMap[normalized] || null;
}

module.exports = {
    loadIssueTypes,
    buildTypeAliasMap,
    findStandardType,
};
