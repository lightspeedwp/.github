/**
 * ============================================================================
 * Agent: status-one-hot.enforcer.js
 * Location: .github/agents/status-one-hot.enforcer.js
 * Description:
 *   - Enforces exactly one status label per issue/PR and applies default priority/status labels.
 *   - Main functions: run(), enforceOneHotStatus(), applyDefaultStatus(), applyDefaultPriority().
 *   - Uses shared utilities: status-enforcer.
 *   - Shared test helpers: mockOctokit, mockContext, expectDryRun, etc.
 *   - Coverage: Enforces one-hot status, applies defaults, handles dry-run and error scenarios.
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - See org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when logic or helpers expand
 *   - Add new helpers to tests/utility/test-helpers.js as needed
 * ============================================================================
 */

const {
    enforceOneHotStatus,
    applyDefaultStatus,
    applyDefaultPriority,
} = require('../../scripts/utility/status-enforcer');
const actionsCore = require('@actions/core');
const actionsGithub = require('@actions/github');

/**
 * Main orchestrator for Status One-Hot Enforcer Agent.
 * Ensures only one status label is present and applies defaults as needed.
 * @param {Object} context - GitHub Actions context object.
 * @returns {Promise<void>}
 */
// ...existing code...
async function run(context = actionsGithub.context) {
    try {
        const token = process.env.GITHUB_TOKEN || core.getInput('github-token');
        if (!token) {
            throw new Error('GITHUB_TOKEN is required');
        }
        const octokit = actionsGithub.getOctokit(token);

        const owner = context.repo.owner;
        const repo = context.repo.repo;

        const item = context.payload.issue || context.payload.pull_request;
        if (!item) {
            core.info('No issue or PR in context; exiting.');
            return;
        }
        const issueOrPrNumber = item.number;
        const currentLabels = (item.labels || []).map((l) => l.name || l);
        const isPR = !!context.payload.pull_request;

        // Enforce one-hot status, apply default status/priority as needed
        await enforceOneHotStatus(
            octokit,
            owner,
            repo,
            issueOrPrNumber,
            currentLabels,
            isPR
        );
        await applyDefaultStatus(octokit, owner, repo, issueOrPrNumber, isPR);
        if (!isPR) {
            await applyDefaultPriority(
                octokit,
                owner,
                repo,
                issueOrPrNumber,
                currentLabels
            );
        }

        actionsCore.info('Status/priority enforcement completed.');
    } catch (e) {
        actionsCore.setFailed(e.message);
    }
}

if (require.main === module) {
    run();
}

module.exports = { run };
