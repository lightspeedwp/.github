#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: status-enforcer.js
 * Location: .github/.github/agents/includes/status-enforcer.js
 * Description: Utility functions for enforcing status and priority label conventions.
 * Version: v1.1.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */

// Preferred ordering for retaining a single status label when multiples exist.
const STATUS_PRIORITY_ORDER = [
    'status:blocked',
    'status:needs-review',
    'status:in-progress',
    'status:needs-qa',
    'status:ready',
    'status:needs-triage',
    'status:done',
];

function pickPrimaryStatus(statusLabels) {
    for (const candidate of STATUS_PRIORITY_ORDER) {
        if (statusLabels.includes(candidate)) return candidate;
    }
    return statusLabels[0]; // fallback deterministic
}

/**
 * Enforce exactly one status:* label per issue/PR.
 * Signature kept broad for bridge adapter compatibility.
 */
async function enforceOneHotStatus(
    octokit,
    owner,
    repo,
    issueOrPrNumber,
    labels = [],
    isPR = false,
    dryRun = false
) {
    if (!octokit) return;
    const statusLabels = labels.filter((l) => l.startsWith('status:'));
    if (statusLabels.length <= 1) return; // nothing to do

    const keep = pickPrimaryStatus(statusLabels);
    const toRemove = statusLabels.filter((l) => l !== keep);
    for (const label of toRemove) {
        if (dryRun) continue;
        try {
            await octokit.rest.issues.removeLabel({
                owner,
                repo,
                issue_number: issueOrPrNumber,
                name: label,
            });
        } catch (e) {
            // Ignore not-found errors (race conditions) – surface others.
            if (e.status !== 404) throw e;
        }
    }
}

/**
 * Apply default status label if none present.
 * Issues: status:needs-triage
 * PRs: status:needs-review
 */
async function applyDefaultStatus(
    octokit,
    owner,
    repo,
    issueOrPrNumber,
    labels = [],
    isPR = false,
    dryRun = false
) {
    if (!octokit) return;
    const hasStatus = labels.some((l) => l.startsWith('status:'));
    if (hasStatus) return;
    const defaultLabel = isPR ? 'status:needs-review' : 'status:needs-triage';
    if (dryRun) return;
    await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueOrPrNumber,
        labels: [defaultLabel],
    });
}

/**
 * Apply default priority label if none present (issues only).
 * Issues get priority:normal when no priority:* present.
 */
async function applyDefaultPriority(
    octokit,
    owner,
    repo,
    issueOrPrNumber,
    labels = [],
    isPR = false,
    dryRun = false
) {
    if (!octokit || isPR) return; // Do not apply to PRs.
    const hasPriority = labels.some((l) => l.startsWith('priority:'));
    if (hasPriority) return;
    if (dryRun) return;
    await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueOrPrNumber,
        labels: ['priority:normal'],
    });
}

module.exports = {
    enforceOneHotStatus,
    applyDefaultStatus,
    applyDefaultPriority,
};
