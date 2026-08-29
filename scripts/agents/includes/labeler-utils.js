#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: labeler-utils.js
 * Location: scripts/agents/includes/labeler-utils.js
 * Description: Utility functions for parsing and applying labeler.yml rules.
 * Version: v2.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * Usage: Import for labeler rule integration.
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

import fs from "fs";
import { load } from "js-yaml";
import core from "@actions/core";
import { minimatch } from "minimatch";

/**
 * Loads labeler rules from YAML configuration file
 * @param {string} [labelerPath='.github/labeler.yml'] - Path to labeler YAML
 * @returns {Object} Labeler rules object
 * @throws {Error} If file cannot be read or parsed
 */
function fetchLabelerRules(labelerPath = ".github/labeler.yml") {
  try {
    if (!fs.existsSync(labelerPath)) {
      core.warning(
        `[labeler-utils] Labeler config not found at: ${labelerPath}`,
      );
      return {};
    }

    const yml = fs.readFileSync(labelerPath, "utf8");
    const rules = load(yml);

    if (!rules || typeof rules !== "object") {
      core.warning(
        `[labeler-utils] Invalid labeler config format at: ${labelerPath}`,
      );
      return {};
    }

    core.info(
      `[labeler-utils] Loaded ${Object.keys(rules).length} labeler rules from ${labelerPath}`,
    );
    return rules;
  } catch (error) {
    core.error(`[labeler-utils] Error loading labeler rules: ${error.message}`);
    throw error;
  }
}

/**
 * Checks if a branch name matches any of the provided patterns
 * @param {string} branchName - Branch name to check
 * @param {string[]} patterns - Array of patterns (can include wildcards or regex)
 * @returns {boolean} True if branch matches any pattern
 */
function matchesBranchPattern(branchName, patterns) {
  if (!branchName || !Array.isArray(patterns)) {
    return false;
  }

  return patterns.some((pattern) => {
    // Support regex patterns (starting with ^)
    if (pattern.startsWith("^")) {
      try {
        const regex = new RegExp(pattern);
        return regex.test(branchName);
      } catch (error) {
        core.warning(
          `[labeler-utils] Invalid regex pattern: ${pattern} - ${error.message}`,
        );
        return false;
      }
    }

    // Support glob patterns using minimatch
    return minimatch(branchName, pattern);
  });
}

/**
 * Checks if any changed files match the provided patterns
 * @param {string[]} changedFiles - Array of changed file paths
 * @param {Object} filePatterns - File pattern configuration from labeler.yml
 * @returns {boolean} True if any files match the patterns
 */
function matchesFilePatterns(changedFiles, filePatterns) {
  if (!changedFiles || !filePatterns) {
    return false;
  }

  // Handle 'any-glob-to-any-file' pattern (OR logic)
  if (filePatterns["any-glob-to-any-file"]) {
    const patterns = filePatterns["any-glob-to-any-file"];
    return patterns.some((pattern) =>
      changedFiles.some((file) => minimatch(file, pattern)),
    );
  }

  // Handle 'all-globs-to-all-files' pattern (AND logic)
  if (filePatterns["all-globs-to-all-files"]) {
    const patterns = filePatterns["all-globs-to-all-files"];
    return patterns.every((pattern) =>
      changedFiles.some((file) => minimatch(file, pattern)),
    );
  }

  // Handle 'any-glob-to-all-files' pattern
  if (filePatterns["any-glob-to-all-files"]) {
    const patterns = filePatterns["any-glob-to-all-files"];
    return patterns.some((pattern) =>
      changedFiles.every((file) => minimatch(file, pattern)),
    );
  }

  // Handle simple array of patterns (default to any-glob-to-any-file)
  if (Array.isArray(filePatterns)) {
    return filePatterns.some((pattern) =>
      changedFiles.some((file) => minimatch(file, pattern)),
    );
  }

  return false;
}

/**
 * Determines which labels should be applied based on labeler rules
 * @param {Object} context - GitHub context object
 * @param {Object} labelerRules - Labeler rules from YAML
 * @param {string[]} changedFiles - Array of changed file paths (for PRs)
 * @returns {string[]} Array of labels to apply
 */
function determineLabelsFromRules(context, labelerRules, changedFiles = []) {
  const labelsToApply = new Set();
  const isPR = !!context.payload.pull_request;
  const branchName = isPR
    ? context.payload.pull_request.head.ref
    : context.ref?.replace("refs/heads/", "");

  for (const [label, rules] of Object.entries(labelerRules)) {
    let shouldApply = false;

    // Check branch patterns
    if (rules["head-branch"] && branchName) {
      const patterns = Array.isArray(rules["head-branch"])
        ? rules["head-branch"]
        : [rules["head-branch"]];

      if (matchesBranchPattern(branchName, patterns)) {
        shouldApply = true;
        core.info(
          `[labeler-utils] Label '${label}' matched branch pattern for: ${branchName}`,
        );
      }
    }

    // Check file patterns (only for PRs with changed files)
    if (rules["changed-files"] && changedFiles.length > 0) {
      if (matchesFilePatterns(changedFiles, rules["changed-files"])) {
        shouldApply = true;
        core.info(
          `[labeler-utils] Label '${label}' matched file patterns for ${changedFiles.length} changed files`,
        );
      }
    }

    if (shouldApply) {
      labelsToApply.add(label);
    }
  }

  return Array.from(labelsToApply);
}

/**
 * Fetches changed files for a pull request with pagination support
 * @param {Object} github - Octokit instance
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - Pull request number
 * @returns {Promise<string[]>} Array of changed file paths
 */
async function fetchPRChangedFiles(github, owner, repo, prNumber) {
  try {
    const allFiles = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data: files } = await github.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
        page,
      });

      allFiles.push(...files.map((file) => file.filename));

      hasMore = files.length === 100;
      page++;
    }

    core.info(
      `[labeler-utils] Fetched ${allFiles.length} changed files for PR #${prNumber}`,
    );
    return allFiles;
  } catch (error) {
    core.error(`[labeler-utils] Error fetching PR files: ${error.message}`);
    return [];
  }
}

/**
 * Applies labels based on labeler rules with retry logic and error handling
 * @param {Object} params - Parameters object
 * @param {Object} params.github - Octokit instance
 * @param {Object} params.context - GitHub context
 * @param {Object} params.labelerRules - Labeler rules from YAML
 * @param {string[]} params.currentLabels - Current labels on the item
 * @param {boolean} params.dryRun - If true, only log actions without applying
 * @param {number} [params.maxRetries=3] - Maximum retry attempts for API calls
 * @returns {Promise<string[]>} Array of labels that were applied
 */
async function applyLabelerRules({
  github,
  context,
  labelerRules,
  currentLabels = [],
  dryRun = false,
  maxRetries = 3,
}) {
  const appliedLabels = [];
  const isPR = !!context.payload.pull_request;
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const number = isPR
    ? context.payload.pull_request.number
    : context.payload.issue?.number;

  if (!number) {
    core.warning("[labeler-utils] No issue or PR number found in context");
    return appliedLabels;
  }

  // Fetch changed files for PRs
  let changedFiles = [];
  if (isPR) {
    changedFiles = await fetchPRChangedFiles(github, owner, repo, number);
    core.info(
      `[labeler-utils] Found ${changedFiles.length} changed files in PR #${number}`,
    );
  }

  // Determine which labels to apply
  const labelsToApply = determineLabelsFromRules(
    context,
    labelerRules,
    changedFiles,
  );

  // Filter out labels that are already applied
  const newLabels = labelsToApply.filter(
    (label) => !currentLabels.includes(label),
  );

  if (newLabels.length === 0) {
    core.info("[labeler-utils] No new labels to apply based on labeler rules");
    return appliedLabels;
  }

  core.info(
    `[labeler-utils] Applying ${newLabels.length} labels: ${newLabels.join(", ")}`,
  );

  // Apply labels with retry logic and exponential backoff
  if (!dryRun) {
    for (const label of newLabels) {
      let attempts = 0;
      let success = false;

      while (attempts < maxRetries && !success) {
        try {
          await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: [label],
          });

          core.info(`[labeler-utils] Applied label: ${label} to #${number}`);
          appliedLabels.push(label);
          success = true;
        } catch (error) {
          attempts++;
          if (attempts >= maxRetries) {
            core.error(
              `[labeler-utils] Failed to apply label ${label} after ${maxRetries} attempts: ${error.message}`,
            );
          } else {
            // Exponential backoff: 2^attempts * 1000ms
            const delay = Math.pow(2, attempts) * 1000;
            core.warning(
              `[labeler-utils] Retry ${attempts}/${maxRetries} for label ${label} after ${delay}ms`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
    }
  } else {
    core.info(
      `[labeler-utils] [DRY RUN] Would apply labels: ${newLabels.join(", ")}`,
    );
    appliedLabels.push(...newLabels);
  }

  return appliedLabels;
}

export {
  fetchLabelerRules,
  matchesBranchPattern,
  matchesFilePatterns,
  determineLabelsFromRules,
  fetchPRChangedFiles,
  applyLabelerRules,
};
