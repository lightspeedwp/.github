#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: labeler-utils.js
 * Location: scripts/utility/labeler-utils.js
 * Description: Utility functions for parsing and applying labeler.yml rules.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Usage: Import for labeler rule integration.
 * ============================================================================
 */
const jsYaml = require("js-yaml");

/**
 * Fetch labeler.yml from org repo and parse it.
 * Returns: Object mapping label → rule patterns (file globs, branch, etc.)
 */
async function fetchLabelerRules(
  octokit,
  owner = "lightspeedwp",
  repo = ".github",
  path = ".github/labeler.yml",
) {
  const res = await octokit.rest.repos.getContent({ owner, repo, path });
  const yamlStr = Buffer.from(res.data.content, "base64").toString();
  return jsYaml.load(yamlStr);
}

/**
 * Apply labeler rules based on file changes and branch.
 * Returns: Array of label names to apply.
 */
function applyLabelerRules(labelerRules, changedFiles, branch) {
  const labels = new Set();
  for (const [label, ruleObj] of Object.entries(labelerRules)) {
    if (
      ruleObj["changed-files"] &&
      ruleObj["changed-files"]["any-glob-to-any-file"]
    ) {
      for (const glob of ruleObj["changed-files"]["any-glob-to-any-file"]) {
        const regex = new RegExp(
          glob.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"),
        );
        if (changedFiles.some((path) => regex.test(path))) {
          labels.add(label);
        }
      }
    }
    if (ruleObj["head-branch"]) {
      for (const branchPattern of ruleObj["head-branch"]) {
        const regex = new RegExp(
          branchPattern.replace(/\^/g, "").replace(/\*/g, ".*"),
        );
        if (branch && regex.test(branch)) {
          labels.add(label);
        }
      }
    }
  }
  return Array.from(labels);
}

module.exports = {
  fetchLabelerRules,
  applyLabelerRules,
};
