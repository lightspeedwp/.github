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
const jsYaml = require('js-yaml');

/**
 * Fetch canonical labels from org community health repo (.github/labels.yml)
 * @param {Octokit} octokit
 * @param {string} owner
 * @param {string} repo
 * @param {string} path
 * @returns {Promise<Array>} Array of { name, color, description }
 */
async function fetchCanonicalLabels(octokit, owner = 'lightspeedwp', repo = '.github', path = '.github/labels.yml') {
  const res = await octokit.rest.repos.getContent({ owner, repo, path });
  const yamlStr = Buffer.from(res.data.content, 'base64').toString();
  return jsYaml.load(yamlStr);
}

module.exports = {
  fetchCanonicalLabels,
};