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
import fs from 'fs';
import { load } from 'js-yaml';
import * as core from '@actions/core';
import { minimatch } from 'minimatch';

/**
 * Loads labeler rules from YAML configuration file
 * @param {string} [labelerPath='.github/labeler.yml'] - Path to labeler YAML
 * @returns {Object} Labeler rules object
 * @throws {Error} If file cannot be read or parsed
 */
function fetchLabelerRules(labelerPath = '.github/labeler.yml') {
  try {
    if (!fs.existsSync(labelerPath)) {
      core.warning(`[labeler-utils] Labeler config not found at: ${labelerPath}`);
      return {};
    }

    const yml = fs.readFileSync(labelerPath, 'utf8');
    const rules = load(yml);

    if (!rules || typeof rules !== 'object') {
      core.warning(`[labeler-utils] Invalid labeler config format at: ${labelerPath}`);
      return {};
    }

    core.info(
      `[labeler-utils] Loaded ${Object.keys(rules).length} labeler rules from ${labelerPath}`
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
    if (pattern.startsWith('^')) {
      try {
        const regex = new RegExp(pattern);
        return regex.test(branchName);
      } catch (error) {
        core.warning(`[labeler-utils] Invalid regex pattern: ${pattern} - ${error.message}`);
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
 * @param {Object[]} filePatterns - Changed-files matcher objects from labeler.yml
 * @returns {boolean} True if any matcher matches the patterns
 */
function matchesFilePatterns(changedFiles, filePatterns) {
  if (!Array.isArray(changedFiles) || !Array.isArray(filePatterns) || filePatterns.length === 0) {
    return false;
  }

  return filePatterns.some((matcher) => {
    if (!matcher || typeof matcher !== 'object' || Array.isArray(matcher)) {
      return false;
    }

    return Object.entries(matcher).some(([key, patterns]) => {
      if (!Array.isArray(patterns) || patterns.length === 0) {
        return false;
      }

      if (key === 'any-glob-to-any-file') {
        return patterns.some((pattern) => changedFiles.some((file) => minimatch(file, pattern)));
      }
      if (key === 'all-globs-to-all-files') {
        return patterns.every((pattern) => changedFiles.every((file) => minimatch(file, pattern)));
      }
      if (key === 'any-glob-to-all-files') {
        return patterns.some((pattern) => changedFiles.every((file) => minimatch(file, pattern)));
      }
      if (key === 'all-globs-to-any-file') {
        return patterns.every((pattern) => changedFiles.some((file) => minimatch(file, pattern)));
      }
      return false;
    });
  });
}

/**
 * Determines which labels should be applied based on labeler rules.
 * Mirrors actions/labeler matching semantics for the supported v5+ form:
 * each label maps to an array of rule objects; every rule object must
 * match (AND across objects), where a single object matches when any of
 * its matchers (head-branch globs/regexes, changed-files patterns) match
 * (OR within an object).
 *
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
    : context.ref?.replace('refs/heads/', '');

  for (const [label, rules] of Object.entries(labelerRules)) {
    // v5+ form: array of rule objects. Legacy single-object form is
    // accepted for compatibility.
    const ruleList = Array.isArray(rules) ? rules : [rules];
    if (ruleList.length === 0 || ruleList.some((rule) => !rule || typeof rule !== 'object')) {
      continue;
    }

    const matchesAll = ruleList.every((rule) => matchesRuleObject(rule, branchName, changedFiles));

    if (matchesAll) {
      labelsToApply.add(label);
    }
  }

  return Array.from(labelsToApply);
}

/**
 * Evaluates one labeler rule object: matches when any present matcher
 * matches (head-branch regex/glob, or changed-files patterns).
 *
 * @param {Object} rule - Single rule object from a label's rule array
 * @param {string} branchName - Head branch name (may be empty)
 * @param {string[]} changedFiles - Changed file paths (may be empty)
 * @returns {boolean} True if the rule object matches
 */
function matchesRuleObject(rule, branchName, changedFiles = []) {
  const conditions = [];
  let hasDirectMatcher = false;
  let directMatched = false;

  if (rule['head-branch']) {
    hasDirectMatcher = true;
    const patterns = Array.isArray(rule['head-branch'])
      ? rule['head-branch']
      : [rule['head-branch']];

    if (matchesBranchPattern(branchName, patterns)) {
      core.info(`[labeler-utils] Rule matched branch pattern for: ${branchName}`);
      directMatched = true;
    }
  }

  if (rule['changed-files']) {
    hasDirectMatcher = true;
    if (matchesFilePatterns(changedFiles, rule['changed-files'])) {
      core.info(
        `[labeler-utils] Rule matched file patterns for ${changedFiles.length} changed files`
      );
      directMatched = true;
    }
  }

  if (hasDirectMatcher) {
    conditions.push(directMatched);
  }

  if (Object.prototype.hasOwnProperty.call(rule, 'all')) {
    if (
      !Array.isArray(rule.all) ||
      rule.all.length === 0 ||
      !rule.all.every((member) => matchesRuleObject(member, branchName, changedFiles))
    ) {
      return false;
    }
    conditions.push(true);
  }

  if (Object.prototype.hasOwnProperty.call(rule, 'any')) {
    if (
      !Array.isArray(rule.any) ||
      rule.any.length === 0 ||
      !rule.any.some((member) => matchesRuleObject(member, branchName, changedFiles))
    ) {
      return false;
    }
    conditions.push(true);
  }

  return conditions.length > 0 && conditions.every(Boolean);
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

    core.info(`[labeler-utils] Fetched ${allFiles.length} changed files for PR #${prNumber}`);
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
 * @param {string[]} [params.skipFamilies=[]] - Label family prefixes (with
 *   colon) the caller owns elsewhere and must not write, e.g. ["type:"]
 *   on PRs where the router owns types (#3545)
 * @returns {Promise<string[]>} Array of labels that were applied
 */
async function applyLabelerRules({
  github,
  context,
  labelerRules,
  currentLabels = [],
  dryRun = false,
  maxRetries = 3,
  skipFamilies = [],
}) {
  const appliedLabels = [];
  const isPR = !!context.payload.pull_request;
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const number = isPR ? context.payload.pull_request.number : context.payload.issue?.number;

  if (!number) {
    core.warning('[labeler-utils] No issue or PR number found in context');
    return appliedLabels;
  }

  // Fetch changed files for PRs
  let changedFiles = [];
  if (isPR) {
    changedFiles = await fetchPRChangedFiles(github, owner, repo, number);
    core.info(`[labeler-utils] Found ${changedFiles.length} changed files in PR #${number}`);
  }

  // Determine which labels to apply
  let labelsToApply = determineLabelsFromRules(context, labelerRules, changedFiles);

  // The caller may own some families elsewhere (e.g. PR types belong to
  // the router); never write those, so two writers cannot fight (#3545).
  if (skipFamilies.length > 0) {
    const skipped = labelsToApply.filter((label) =>
      skipFamilies.some((prefix) => label.startsWith(prefix))
    );
    if (skipped.length > 0) {
      core.info(`[labeler-utils] Skipping caller-owned families: ${skipped.join(', ')}`);
    }
    labelsToApply = labelsToApply.filter(
      (label) => !skipFamilies.some((prefix) => label.startsWith(prefix))
    );
  }

  // Filter out labels that are already applied
  const newLabels = labelsToApply.filter((label) => !currentLabels.includes(label));

  if (newLabels.length === 0) {
    core.info('[labeler-utils] No new labels to apply based on labeler rules');
    return appliedLabels;
  }

  core.info(`[labeler-utils] Applying ${newLabels.length} labels: ${newLabels.join(', ')}`);

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
              `[labeler-utils] Failed to apply label ${label} after ${maxRetries} attempts: ${error.message}`
            );
          } else {
            // Exponential backoff: 2^attempts * 1000ms
            const delay = Math.pow(2, attempts) * 1000;
            core.warning(
              `[labeler-utils] Retry ${attempts}/${maxRetries} for label ${label} after ${delay}ms`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
    }
  } else {
    core.info(`[labeler-utils] [DRY RUN] Would apply labels: ${newLabels.join(', ')}`);
    appliedLabels.push(...newLabels);
  }

  return appliedLabels;
}

export {
  fetchLabelerRules,
  matchesBranchPattern,
  matchesFilePatterns,
  matchesRuleObject,
  determineLabelsFromRules,
  fetchPRChangedFiles,
  applyLabelerRules,
};
