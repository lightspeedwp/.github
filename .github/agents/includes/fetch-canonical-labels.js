#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: fetch-canonical-labels.js
 * Location: scripts/utility/fetch-canonical-labels.js
 * Description: Fetches canonical labels from the LightSpeedWP community health repo (.github/labels.yml)
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Requirements: Node.js, @octokit/rest, js-yaml
 * Usage: Import for canonical label fetching.
 * ============================================================================
 */

/**
 * @fileoverview Utility for loading canonical label names from labels.yml.
 * @module fetch-canonical-labels
 */

const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Loads and returns the list of canonical label names from labels.yml.
 * @param {string} [labelsYmlPath='.github/labels.yml'] - Path to labels YAML.
 * @returns {string[]} Array of canonical label names (strings).
 */
function fetchCanonicalLabels(labelsYmlPath = '.github/labels.yml') {
    const yml = fs.readFileSync(labelsYmlPath, 'utf8');
    const labelsData = yaml.load(yml);
    return labelsData.map((l) => (typeof l === 'string' ? l : l.name));
}

module.exports = { fetchCanonicalLabels };
