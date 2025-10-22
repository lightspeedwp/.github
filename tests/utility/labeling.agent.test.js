/**
 * ============================================================================
 * Agent: labeling.agent.js
 * Location: .github/agents/labeling.agent.js
 * Description:
 *   - Applies, enforces, and standardizes org-wide labels, including one-hot status enforcement.
 *   - Main functions: run(), label application, canonical lookup, heuristics, status enforcement, report generation.
 *   - Uses shared utilities: label-lookup, label-reporting, labeler-utils, status-enforcer, label-heuristics.
 *   - Shared test helpers: mockOctokit, mockContext, expectMarkdownReport, mockPrPayload, expectDryRun, etc.
 *   - Coverage: Applies labels, status, priority, posts markdown reports, handles dry-run and error scenarios.
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - See org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when expanding agent logic or adding new shared helpers
 *   - Add new helpers to tests/utility/test-helpers.js as needed
 * ============================================================================
 */

const {
    fetchCanonicalLabels,
    buildLabelAliasMap,
    findStandardLabel,
} = require('../../scripts/utility/label-lookup');
const {
    fetchLabelerRules,
    applyLabelerRules,
} = require('../../scripts/utility/labeler-utils');
const {
    buildLabelingReport,
} = require('../../scripts/utility/label-reporting');
const {
    enforceOneHotStatus,
    applyDefaultStatus,
    applyDefaultPriority,
} = require('../../scripts/utility/status-enforcer');
const {
    suggestLabelsFromContent,
} = require('../../scripts/utility/label-heuristics');
const core = require('@actions/core');
const github = require('@actions/github');

const config = {
    dryRun: process.env.DRY_RUN === 'true',
    verbose: process.env.VERBOSE === 'true',
    token: process.env.GITHUB_TOKEN,
    orgRepo: '.github',
    orgOwner: 'lightspeedwp',
};

/**
 * Main orchestrator for labeling agent.
 * @param {Object} context - GitHub Actions context object.
 * @returns {Promise<void>}
 */
async function run(context = github.context) {
    try {
        if (!config.token) {
            throw new Error('GITHUB_TOKEN is required');
        }
        const octokit = github.getOctokit(config.token);
        const owner = context.repo.owner;
        const repo = context.repo.repo;

        // Fetch canonical labels and build alias map
        const canonicalLabels = await fetchCanonicalLabels(
            octokit,
            config.orgOwner,
            config.orgRepo
        );
        const aliasMap = buildLabelAliasMap(canonicalLabels);

        // Fetch labeler rules
        const labelerRules = await fetchLabelerRules(
            octokit,
            config.orgOwner,
            config.orgRepo
        );

        // Issue/PR logic
        const item = context.payload.issue || context.payload.pull_request;
        if (!item) {
            core.info('No issue or PR in context; exiting.');
            return;
        }
        const issueOrPrNumber = item.number;

        // Get changed files for PRs (used for labeler rules)
        let changedFiles = [];
        if (context.payload.pull_request) {
            const { data: files } = await octokit.rest.pulls.listFiles({
                owner,
                repo,
                pull_number: issueOrPrNumber,
            });
            changedFiles = files.map((f) => f.filename);
        }

        // Apply labeler rules
        const branch = context.payload.pull_request
            ? context.payload.pull_request.head.ref
            : '';
        const labelerLabels = applyLabelerRules(
            labelerRules,
            changedFiles,
            branch
        )
            .map((lbl) => findStandardLabel(lbl, aliasMap))
            .filter(Boolean);

        // Content-based heuristics
        const contentLabels = suggestLabelsFromContent(item, aliasMap);

        // Combine and dedupe all suggested labels
        const currentLabels = (item.labels || []).map((l) => l.name || l);
        const allLabels = Array.from(
            new Set([...labelerLabels, ...contentLabels])
        );

        // Apply new labels
        const newLabels = allLabels.filter((l) => !currentLabels.includes(l));
        if (newLabels.length > 0 && !config.dryRun) {
            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: issueOrPrNumber,
                labels: newLabels,
            });
            core.info(
                `Applied labels to #${issueOrPrNumber}: ${newLabels.join(', ')}`
            );
        } else if (config.dryRun) {
            core.info(
                `[DRY RUN] Would apply labels to #${issueOrPrNumber}: ${newLabels.join(', ')}`
            );
        }

        // Status enforcement (exactly one status label, default if missing)
        await enforceOneHotStatus(
            octokit,
            owner,
            repo,
            issueOrPrNumber,
            currentLabels,
            !!context.payload.pull_request
        );
        await applyDefaultStatus(
            octokit,
            owner,
            repo,
            issueOrPrNumber,
            !!context.payload.pull_request
        );
        if (context.payload.issue) {
            await applyDefaultPriority(
                octokit,
                owner,
                repo,
                issueOrPrNumber,
                currentLabels
            );
        }

        // Reporting
        const report = buildLabelingReport({
            type: context.payload.issue ? 'Issue' : 'Pull Request',
            newLabels,
            suggestions: [],
        });
        if (!config.dryRun) {
            await octokit.rest.issues.createComment({
                owner,
                repo,
                issue_number: issueOrPrNumber,
                body: report,
            });
            core.info(`Posted labeling report for #${issueOrPrNumber}`);
        } else {
            core.info(report);
        }
    } catch (e) {
        core.setFailed(e.message);
    }
}

if (require.main === module) {
    run();
}

module.exports = {
    run,
};
