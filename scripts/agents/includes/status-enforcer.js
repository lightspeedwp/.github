#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: status-enforcer.js
 * Location: includes/status-enforcer.js
 * Description: Utility functions for enforcing status and priority label conventions.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

import core from "@actions/core";

// Preferred ordering for retaining a single status label when multiples exist.
const STATUS_PRIORITY_ORDER = [
  "status:blocked",
  "status:needs-review",
  "status:in-progress",
  "status:needs-qa",
  "status:ready",
  "status:needs-triage",
  "status:done",
];

function _pickPrimaryStatus(statusLabels) {
  for (const candidate of STATUS_PRIORITY_ORDER) {
    if (statusLabels.includes(candidate)) return candidate;
  }
  return statusLabels[0]; // fallback deterministic
}

/**
 * Enforce exactly one label per category (status:*, priority:*, type:*).
 * Removes extra labels if multiple are found in a category.
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {number} params.number - Issue/PR number
 * @param {string[]} params.currentLabels - Current labels on the item
 * @param {boolean} params.dryRun - If true, only log actions without applying
 * @returns {Promise<void>}
 */
async function enforceOneHotLabels({
  github,
  owner,
  repo,
  number,
  currentLabels,
  dryRun = false,
}) {
  try {
    const categories = {
      "status:": [],
      "priority:": [],
      "type:": [],
    };

    // Group labels by category
    for (const label of currentLabels) {
      for (const prefix of Object.keys(categories)) {
        if (label.startsWith(prefix)) {
          categories[prefix].push(label);
          break;
        }
      }
    }

    // Enforce one-hot: keep first (or priority-ordered for status), remove rest
    for (const [prefix, labels] of Object.entries(categories)) {
      if (labels.length > 1) {
        // Use priority ordering for status labels, first label for others
        const keep =
          prefix === "status:" ? _pickPrimaryStatus(labels) : labels[0];
        const remove = labels.filter((l) => l !== keep);
        core.info(
          `[label-enforcer] Multiple ${prefix}* labels found on #${number}: ${labels.join(", ")}`,
        );
        core.info(
          `[label-enforcer] Keeping: ${keep}, removing: ${remove.join(", ")}`,
        );

        for (const label of remove) {
          if (!dryRun) {
            try {
              await github.rest.issues.removeLabel({
                owner,
                repo,
                issue_number: number,
                name: label,
              });
              core.info(
                `[label-enforcer] Removed extra label: ${label} from #${number}`,
              );
            } catch (error) {
              // Label might already be removed or not exist
              if (error.status !== 404) {
                core.warning(
                  `[label-enforcer] Failed to remove label ${label}: ${error.message}`,
                );
              }
            }
          } else {
            core.info(`[label-enforcer] [DRY RUN] Would remove: ${label}`);
          }
        }
      }
    }
  } catch (error) {
    core.error(
      `[label-enforcer] Error enforcing one-hot labels: ${error.message}`,
    );
    throw error;
  }
}

// Keep backward compatibility alias
const enforceOneHotStatus = enforceOneHotLabels;

/**
 * Apply default status label if none present.
 * - Issues get status:needs-triage
 * - PRs get status:needs-review
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {number} params.number - Issue/PR number
 * @param {string[]} params.currentLabels - Current labels on the item
 * @param {boolean} params.dryRun - If true, only log actions without applying
 * @param {boolean} [params.isPR] - Whether this is a PR (vs issue)
 * @returns {Promise<void>}
 */
async function applyDefaultStatus({
  github,
  owner,
  repo,
  number,
  currentLabels,
  dryRun = false,
  isPR = false,
}) {
  try {
    // Check if any status:* label exists
    const hasStatus = currentLabels.some((label) =>
      label.startsWith("status:"),
    );

    if (!hasStatus) {
      const defaultStatus = isPR
        ? "status:needs-review"
        : "status:needs-triage";

      core.info(
        `[label-enforcer] No status label found on #${number}, applying default: ${defaultStatus}`,
      );

      if (!dryRun) {
        try {
          await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: [defaultStatus],
          });
          core.info(
            `[label-enforcer] Applied default status: ${defaultStatus} to #${number}`,
          );
        } catch (error) {
          core.warning(
            `[label-enforcer] Failed to add default status label: ${error.message}`,
          );
        }
      } else {
        core.info(`[label-enforcer] [DRY RUN] Would add: ${defaultStatus}`);
      }
    }
  } catch (error) {
    core.error(
      `[label-enforcer] Error applying default status: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Apply default priority label if none present.
 * Default is priority:normal for all items.
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {number} params.number - Issue/PR number
 * @param {string[]} params.currentLabels - Current labels on the item
 * @param {boolean} params.dryRun - If true, only log actions without applying
 * @returns {Promise<void>}
 */
async function applyDefaultPriority({
  github,
  owner,
  repo,
  number,
  currentLabels,
  dryRun = false,
}) {
  try {
    // Check if any priority:* label exists
    const hasPriority = currentLabels.some((label) =>
      label.startsWith("priority:"),
    );

    if (!hasPriority) {
      const defaultPriority = "priority:normal";

      core.info(
        `[label-enforcer] No priority label found on #${number}, applying default: ${defaultPriority}`,
      );

      if (!dryRun) {
        try {
          await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: [defaultPriority],
          });
          core.info(
            `[label-enforcer] Applied default priority: ${defaultPriority} to #${number}`,
          );
        } catch (error) {
          core.warning(
            `[label-enforcer] Failed to add default priority label: ${error.message}`,
          );
        }
      } else {
        core.info(`[label-enforcer] [DRY RUN] Would add: ${defaultPriority}`);
      }
    }
  } catch (error) {
    core.error(
      `[label-enforcer] Error applying default priority: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Apply default type label if none present.
 * Default is type:task for issues, type:chore for PRs.
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.github - Octokit instance
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {number} params.number - Issue/PR number
 * @param {string[]} params.currentLabels - Current labels on the item
 * @param {boolean} params.dryRun - If true, only log actions without applying
 * @param {boolean} [params.isPR] - Whether this is a PR (vs issue)
 * @returns {Promise<void>}
 */
async function applyDefaultType({
  github,
  owner,
  repo,
  number,
  currentLabels,
  dryRun = false,
  isPR = false,
}) {
  try {
    // Check if any type:* label exists
    const hasType = currentLabels.some((label) => label.startsWith("type:"));

    if (!hasType) {
      // Default type based on item type
      // For PRs, type should be determined by branch prefix (handled by labeler)
      // So we only apply fallback if still missing after labeler runs
      const defaultType = isPR ? "type:chore" : "type:task";

      core.info(
        `[label-enforcer] No type label found on #${number}, applying default: ${defaultType}`,
      );

      if (!dryRun) {
        try {
          await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: [defaultType],
          });
          core.info(
            `[label-enforcer] Applied default type: ${defaultType} to #${number}`,
          );
        } catch (error) {
          core.warning(
            `[label-enforcer] Failed to add default type label: ${error.message}`,
          );
        }
      } else {
        core.info(`[label-enforcer] [DRY RUN] Would add: ${defaultType}`);
      }
    }
  } catch (error) {
    core.error(
      `[label-enforcer] Error applying default type: ${error.message}`,
    );
    throw error;
  }
}

export {
  enforceOneHotLabels,
  enforceOneHotStatus,
  applyDefaultStatus,
  applyDefaultPriority,
  applyDefaultType,
};
