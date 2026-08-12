/**
 * Unified Labeling Agent for LightSpeedWP
 * Applies, enforces, and standardizes labels on issues and PRs.
 * Includes content-based issue type detection, branch pattern matching, and file path analysis.
 * Uses canonical config from .github/labels.yml, .github/labeler.yml, .github/issue-types.yml.
 * Replaces all prior split agents.
 *
 * Wave 2A kickoff (#466):
 * - canonical spec path confirmed: agents/labeling.agent.md
 * - runtime path confirmed: scripts/agents/labeling.agent.js
 * - implementation status: active and production-wired
 * - next concrete action: extend targeted tests for one-hot enforcement and
 *   alias migration edge cases
 *
 * @module scripts/agents/labeling.agent.js
 * @see ../../../.github/agents/labeling.agent.md
 * @version 2.0.0
 * @author LightSpeedWP
 */

import fs from "fs";
import * as yaml from "js-yaml";
import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  buildLabelAliasMap,
  findStandardLabel,
} from "./includes/label-lookup.js";
import {
  enforceOneHotLabels,
  applyDefaultStatus,
  applyDefaultPriority,
  applyDefaultType,
} from "./includes/status-enforcer.js";
import {
  fetchLabelerRules,
  applyLabelerRules,
} from "./includes/labeler-utils.js";
import { buildLabelingReport } from "./includes/label-reporting.js";

// Environment configurable paths (fallback to repo defaults)
const LABELS_CONFIG = process.env.LABELS_CONFIG || ".github/labels.yml";
const LABELER_RULES = process.env.LABELER_RULES || ".github/labeler.yml";

// Enhanced content-based type detection heuristics
const KEYWORD_TYPE_MAP = {
  bug: "type:bug",
  fix: "type:bug",
  "fixes #": "type:bug",
  "closes #": "type:bug",
  defect: "type:bug",
  error: "type:bug",
  issue: "type:bug",
  feature: "type:feature",
  feat: "type:feature",
  enhancement: "type:feature",
  "new feature": "type:feature",
  improvement: "type:feature",
  docs: "type:documentation",
  doc: "type:documentation",
  documentation: "type:documentation",
  readme: "type:documentation",
  guide: "type:documentation",
  test: "type:test",
  testing: "type:test",
  "unit test": "type:test",
  "integration test": "type:test",
  perf: "type:performance",
  performance: "type:performance",
  optimization: "type:performance",
  optimize: "type:performance",
  security: "type:security",
  vulnerability: "type:security",
  cve: "type:security",
  refactor: "type:refactor",
  refactoring: "type:refactor",
  restructure: "type:refactor",
  chore: "type:chore",
  maintenance: "type:chore",
  cleanup: "type:chore",
  dependencies: "type:dependency",
  dependency: "type:dependency",
  "bump version": "type:dependency",
  ci: "type:ci",
  "continuous integration": "type:ci",
  workflow: "type:ci",
  a11y: "type:a11y",
  accessibility: "type:a11y",
  wcag: "type:a11y",
};

// Branch prefix to type mapping for PRs
const BRANCH_PREFIX_TYPE_MAP = {
  "feat/": "type:feature",
  "feature/": "type:feature",
  "fix/": "type:bug",
  "bugfix/": "type:bug",
  "hotfix/": "type:bug",
  "docs/": "type:documentation",
  "doc/": "type:documentation",
  "test/": "type:test",
  "tests/": "type:test",
  "perf/": "type:performance",
  "refactor/": "type:refactor",
  "chore/": "type:chore",
  "ci/": "type:ci",
  "deps/": "type:dependency",
  "build/": "type:build",
  "security/": "type:security",
  "a11y/": "type:a11y",
};

function readYamlArrayFile(path, purpose) {
  if (!fs.existsSync(path)) {
    throw new Error(`[labeling.agent] Missing ${purpose} file at: ${path}`);
  }
  const raw = fs.readFileSync(path, "utf8");
  const data = yaml.load(raw);
  if (!Array.isArray(data)) {
    throw new Error(
      `[labeling.agent] Expected array in ${purpose} file: ${path}`,
    );
  }
  return data;
}

/**
 * Loads canonical label definitions from LABELS_CONFIG.
 * @returns {Set<string>} Set of canonical label names.
 */
function loadCanonicalLabels() {
  const labelsData = readYamlArrayFile(LABELS_CONFIG, "labels config");
  return new Set(labelsData.map((l) => (typeof l === "string" ? l : l.name)));
}

/**
 * Loads alias mapping from LABELS_CONFIG.
 * @returns {Object} aliasMap - Maps alias to canonical label.
 */
function loadAliasMap() {
  const labelsData = readYamlArrayFile(LABELS_CONFIG, "labels config");
  return buildLabelAliasMap(labelsData);
}

/**
 * Detect issue type from branch name using prefix patterns
 * @param {string} branchName - Branch name to analyze
 * @returns {string|null} Canonical type label or null if none matched
 */
function detectTypeFromBranch(branchName = "") {
  if (!branchName) return null;

  const lowerBranch = branchName.toLowerCase();
  for (const [prefix, typeLabel] of Object.entries(BRANCH_PREFIX_TYPE_MAP)) {
    if (lowerBranch.startsWith(prefix)) {
      core.info(
        `[labeling.agent] Detected type from branch prefix '${prefix}': ${typeLabel}`,
      );
      return typeLabel;
    }
  }
  return null;
}

/**
 * Detect issue type from content (title + body) using keyword heuristics
 * Enhanced with priority ordering - checks title first for higher confidence
 * @param {string} title - Issue/PR title
 * @param {string} body - Issue/PR body
 * @returns {string|null} Canonical type label or null if none matched
 */
function detectIssueTypeFromContent(title = "", body = "") {
  // Check title first (higher confidence)
  const lowerTitle = title.toLowerCase();
  for (const [keyword, typeLabel] of Object.entries(KEYWORD_TYPE_MAP)) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      core.info(
        `[labeling.agent] Detected type from title keyword '${keyword}': ${typeLabel}`,
      );
      return typeLabel;
    }
  }

  // Check body if no match in title
  const lowerBody = body.toLowerCase();
  for (const [keyword, typeLabel] of Object.entries(KEYWORD_TYPE_MAP)) {
    if (lowerBody.includes(keyword.toLowerCase())) {
      core.info(
        `[labeling.agent] Detected type from body keyword '${keyword}': ${typeLabel}`,
      );
      return typeLabel;
    }
  }

  return null;
}

/**
 * Removes or migrates any label on an issue/PR that is not in the canonical set.
 * @param {Object} github - Octokit instance.
 * @param {string} owner
 * @param {string} repo
 * @param {number} number - Issue/PR number.
 * @param {string[]} currentLabels
 * @param {Set<string>} canonicalSet
 * @param {Object} aliasMap
 * @param {boolean} dryRun
 * @param {function} log
 */
async function standardizeLabelsOnItem(
  github,
  owner,
  repo,
  number,
  currentLabels,
  canonicalSet,
  aliasMap = {},
  dryRun = false,
  log = console.log,
) {
  for (const label of currentLabels) {
    if (!canonicalSet.has(label)) {
      // Migrate legacy/alias to canonical
      const canonical = findStandardLabel(label, aliasMap, canonicalSet);
      if (canonical) {
        if (!dryRun) {
          await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: [canonical],
          });
        }
        log(
          `[labeling.agent] Migrated: ${label} -> ${canonical} on #${number}`,
        );
      }
      // Remove non-canonical label
      if (!dryRun) {
        await github.rest.issues.removeLabel({
          owner,
          repo,
          issue_number: number,
          name: label,
        });
      }
      log(
        `[labeling.agent] Removed non-canonical label: ${label} from #${number}`,
      );
    }
  }
}

/**
 * Main orchestrator for labeling agent with comprehensive error handling
 * @param {Object} opts - Configuration options
 * @param {Object} [opts.context=github.context] - GitHub context
 * @param {Object} [opts.github] - Octokit instance
 * @param {boolean} [opts.dryRun=false] - Dry run mode
 * @param {number} [opts.maxRetries=3] - Maximum retry attempts for API calls
 * @returns {Promise<Object>} Report object with summary of actions taken
 */
async function runLabelingAgent(opts = {}) {
  const startTime = Date.now();
  const report = {
    success: false,
    added: [],
    removed: [],
    migrated: [],
    errors: [],
    rulesApplied: [],
    duration: 0,
  };

  try {
    // Initialize context and GitHub client
    const context = opts.context || github.context;
    const octokit =
      opts.github ||
      github.getOctokit(
        core.getInput("github-token") || process.env.GITHUB_TOKEN,
      );
    const dryRun = !!opts.dryRun;
    const maxRetries = opts.maxRetries || 3;

    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const isPR = !!context.payload.pull_request;
    const isIssue = !!context.payload.issue;
    const number = isIssue
      ? context.payload.issue.number
      : isPR
        ? context.payload.pull_request.number
        : null;

    if (!number) {
      core.info("[labeling.agent] No issue or PR in context");
      report.success = true;
      report.duration = Date.now() - startTime;
      return report;
    }

    core.info(
      `[labeling.agent] Processing ${isPR ? "PR" : "Issue"} #${number}`,
    );
    if (dryRun) {
      core.info("[labeling.agent] Running in DRY RUN mode");
    }

    // Load canonical configurations with error handling
    let canonicalSet, aliasMap, labelerRules;
    try {
      core.startGroup("Loading canonical configurations");
      canonicalSet = loadCanonicalLabels();
      core.info(
        `[labeling.agent] Loaded ${canonicalSet.size} canonical labels`,
      );

      aliasMap = loadAliasMap();
      core.info(
        `[labeling.agent] Loaded ${Object.keys(aliasMap).length} label aliases`,
      );

      labelerRules = fetchLabelerRules(LABELER_RULES);
      core.info(
        `[labeling.agent] Loaded ${Object.keys(labelerRules).length} labeler rules`,
      );
      core.endGroup();
    } catch (error) {
      core.error(
        `[labeling.agent] Configuration loading failed: ${error.message}`,
      );
      core.endGroup();
      report.errors.push(`Configuration error: ${error.message}`);
      core.setFailed(error.message);
      report.duration = Date.now() - startTime;
      return report;
    }

    // Get current labels
    const currentLabels = isIssue
      ? (context.payload.issue.labels || []).map((l) => l.name)
      : (context.payload.pull_request.labels || []).map((l) => l.name);

    core.info(
      `[labeling.agent] Current labels (${currentLabels.length}): ${currentLabels.join(", ") || "none"}`,
    );

    // Step 1: Apply labeler rules (branch patterns and file changes)
    try {
      core.startGroup("Applying labeler rules");
      const appliedFromRules = await applyLabelerRules({
        github: octokit,
        context,
        labelerRules,
        currentLabels,
        dryRun,
        maxRetries,
      });

      if (appliedFromRules.length > 0) {
        report.added.push(...appliedFromRules);
        report.rulesApplied.push(
          `File/branch patterns matched: ${appliedFromRules.join(", ")}`,
        );
      }
      core.endGroup();
    } catch (error) {
      core.warning(
        `[labeling.agent] Labeler rules application failed: ${error.message}`,
      );
      report.errors.push(`Labeler rules error: ${error.message}`);
      core.endGroup();
    }

    // Step 2: Detect type from branch prefix (for PRs)
    if (isPR) {
      try {
        const branchName = context.payload.pull_request.head.ref;
        const branchType = detectTypeFromBranch(branchName);
        if (
          branchType &&
          canonicalSet.has(branchType) &&
          !currentLabels.includes(branchType)
        ) {
          if (!dryRun) {
            await octokit.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels: [branchType],
            });
          }
          report.added.push(branchType);
          report.rulesApplied.push(`Branch prefix detection: ${branchType}`);
        } else if (branchType && !canonicalSet.has(branchType)) {
          core.warning(
            `[labeling.agent] Branch-derived type is non-canonical and will be skipped: ${branchType}`,
          );
        }
      } catch (error) {
        core.warning(
          `[labeling.agent] Branch type detection failed: ${error.message}`,
        );
        report.errors.push(`Branch detection error: ${error.message}`);
      }
    }

    // Step 3: Enforce one-hot constraints (status, priority, type)
    try {
      core.startGroup("Enforcing one-hot label constraints");
      await enforceOneHotLabels({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels,
        dryRun,
      });
      core.endGroup();
    } catch (error) {
      core.warning(
        `[labeling.agent] One-hot enforcement failed: ${error.message}`,
      );
      report.errors.push(`One-hot enforcement error: ${error.message}`);
      core.endGroup();
    }

    // Step 4: Apply defaults for missing required labels
    try {
      core.startGroup("Applying default labels");
      await applyDefaultStatus({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels,
        dryRun,
        isPR,
      });

      await applyDefaultPriority({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels,
        dryRun,
      });

      await applyDefaultType({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels,
        dryRun,
        isPR,
      });
      core.endGroup();
    } catch (error) {
      core.warning(
        `[labeling.agent] Default label application failed: ${error.message}`,
      );
      report.errors.push(`Default labels error: ${error.message}`);
      core.endGroup();
    }

    // Step 5: Content-based type detection (if no type label yet)
    const hasTypeLabel = currentLabels.some((l) => l.startsWith("type:"));
    if (!hasTypeLabel) {
      try {
        const title = isIssue
          ? context.payload.issue.title
          : context.payload.pull_request.title;
        const body = isIssue
          ? context.payload.issue.body
          : context.payload.pull_request.body;
        const detectedType = detectIssueTypeFromContent(title, body);

        if (detectedType && canonicalSet.has(detectedType)) {
          if (!dryRun) {
            await octokit.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels: [detectedType],
            });
          }
          report.added.push(detectedType);
          report.rulesApplied.push(
            `Content-based type detection: ${detectedType}`,
          );
        } else if (detectedType && !canonicalSet.has(detectedType)) {
          core.warning(
            `[labeling.agent] Content-derived type is non-canonical and will be skipped: ${detectedType}`,
          );
        }
      } catch (error) {
        core.warning(
          `[labeling.agent] Content type detection failed: ${error.message}`,
        );
        report.errors.push(`Content detection error: ${error.message}`);
      }
    }

    // Step 6: Changelog nudge for PRs
    if (isPR) {
      try {
        const changelogLabels = [
          "meta:no-changelog",
          "meta:needs-changelog",
          "meta:changelog",
        ];
        if (!currentLabels.some((l) => changelogLabels.includes(l))) {
          if (!dryRun) {
            await octokit.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels: ["meta:needs-changelog"],
            });
          }
          report.added.push("meta:needs-changelog");
          core.info("[labeling.agent] Added meta:needs-changelog");
        }
      } catch (error) {
        core.warning(
          `[labeling.agent] Changelog label application failed: ${error.message}`,
        );
        report.errors.push(`Changelog label error: ${error.message}`);
      }
    }

    // Step 7: Standardize/migrate non-canonical labels
    try {
      core.startGroup("Standardizing labels");
      await standardizeLabelsOnItem(
        octokit,
        owner,
        repo,
        number,
        currentLabels,
        canonicalSet,
        aliasMap,
        dryRun,
        core.info,
      );
      core.endGroup();
    } catch (error) {
      core.warning(
        `[labeling.agent] Label standardization failed: ${error.message}`,
      );
      report.errors.push(`Standardization error: ${error.message}`);
      core.endGroup();
    }

    // Generate summary report
    report.success = true;
    report.duration = Date.now() - startTime;

    core.info(
      `[labeling.agent] Completed in ${report.duration}ms (DRY_RUN=${dryRun})`,
    );
    core.info(
      `[labeling.agent] Summary: ${report.added.length} added, ${report.removed.length} removed, ${report.migrated.length} migrated, ${report.errors.length} errors`,
    );

    // Output structured report
    const summaryReport = buildLabelingReport({
      added: report.added,
      removed: report.removed,
      migrated: report.migrated,
      rulesApplied: report.rulesApplied,
      errors: report.errors,
      context,
    });

    core.summary.addRaw(summaryReport).write();

    return report;
  } catch (error) {
    core.error(`[labeling.agent] Fatal error: ${error.message}`);
    core.error(error.stack);
    report.errors.push(`Fatal error: ${error.message}`);
    report.duration = Date.now() - startTime;
    core.setFailed(error.message);
    return report;
  }
}

export {
  runLabelingAgent,
  detectIssueTypeFromContent,
  detectTypeFromBranch,
  loadCanonicalLabels,
  loadAliasMap,
};
