#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: status-enforcer.js
 * Location: .github/agents/includes/status-enforcer.js
 * Description: Utility functions for enforcing status and priority label conventions.
 * Version: v2.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */

import core from '@actions/core';

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
async function enforceOneHotStatus({
    github,
    owner,
    repo,
    number,
    currentLabels,
    dryRun = false,
}) {
    try {
        const categories = {
            'status:': [],
            'priority:': [],
            'type:': [],
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

        // Enforce one-hot: keep first, remove rest
        for (const [prefix, labels] of Object.entries(categories)) {
            if (labels.length > 1) {
                const [keep, ...remove] = labels;
                core.info(
                    `[status-enforcer] Multiple ${prefix}* labels found on #${number}: ${labels.join(', ')}`
                );
                core.info(
                    `[status-enforcer] Keeping: ${keep}, removing: ${remove.join(', ')}`
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
                                `[status-enforcer] Removed extra label: ${label} from #${number}`
                            );
                        } catch (error) {
                            // Label might already be removed or not exist
                            if (error.status !== 404) {
                                core.warning(
                                    `[status-enforcer] Failed to remove label ${label}: ${error.message}`
                                );
                            }
                        }
                    } else {
                        core.info(
                            `[status-enforcer] [DRY RUN] Would remove: ${label}`
                        );
                    }
                }
            }
        }
    } catch (error) {
        core.error(
            `[status-enforcer] Error enforcing one-hot status: ${error.message}`
        );
        throw error;
    }
}

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
            label.startsWith('status:')
        );

        if (!hasStatus) {
            const defaultStatus = isPR
                ? 'status:needs-review'
                : 'status:needs-triage';

            core.info(
                `[status-enforcer] No status label found on #${number}, applying default: ${defaultStatus}`
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
                        `[status-enforcer] Applied default status: ${defaultStatus} to #${number}`
                    );
                } catch (error) {
                    core.warning(
                        `[status-enforcer] Failed to add default status label: ${error.message}`
                    );
                }
            } else {
                core.info(
                    `[status-enforcer] [DRY RUN] Would add: ${defaultStatus}`
                );
            }
        }
    } catch (error) {
        core.error(
            `[status-enforcer] Error applying default status: ${error.message}`
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
            label.startsWith('priority:')
        );

        if (!hasPriority) {
            const defaultPriority = 'priority:normal';

            core.info(
                `[status-enforcer] No priority label found on #${number}, applying default: ${defaultPriority}`
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
                        `[status-enforcer] Applied default priority: ${defaultPriority} to #${number}`
                    );
                } catch (error) {
                    core.warning(
                        `[status-enforcer] Failed to add default priority label: ${error.message}`
                    );
                }
            } else {
                core.info(
                    `[status-enforcer] [DRY RUN] Would add: ${defaultPriority}`
                );
            }
        }
    } catch (error) {
        core.error(
            `[status-enforcer] Error applying default priority: ${error.message}`
        );
        throw error;
    }
}

export {
    enforceOneHotStatus,
    applyDefaultStatus,
    applyDefaultPriority,
};
