/**
 * Unified Labeling Agent for LightSpeedWP
 * Applies, enforces, and standardizes labels on issues and PRs.
 * Uses canonical config from .github/automation/labels.yml, .github/automation/labeler.yml, .github/automation/issue-types.yml.
 * Replaces all prior split agents.
 *
 * @module labeling.agent.js
 * @author LightSpeedWP
 */

const fs = require('fs');
const yaml = require('js-yaml');
const core = require('@actions/core');
const github = require('@actions/github');
const {
    buildLabelAliasMap,
    findStandardLabel,
} = require('./includes/label-lookup');
const {
    enforceOneHotStatus,
    applyDefaultStatus,
    applyDefaultPriority,
} = require('./includes/status-enforcer');

// Environment configurable paths (fallback to repo defaults)
const LABELS_CONFIG =
    process.env.LABELS_CONFIG || '.github/automation/labels.yml';
const ISSUE_TYPES_CONFIG =
    process.env.ISSUE_TYPES_CONFIG || '.github/automation/issue-types.yml'; // reserved for later phases

function readYamlArrayFile(path, purpose) {
    if (!fs.existsSync(path)) {
        throw new Error(`[labeling.agent] Missing ${purpose} file at: ${path}`);
    }
    const raw = fs.readFileSync(path, 'utf8');
    const data = yaml.load(raw);
    if (!Array.isArray(data)) {
        throw new Error(
            `[labeling.agent] Expected array in ${purpose} file: ${path}`
        );
    }
    return data;
}

/**
 * Loads canonical label definitions from LABELS_CONFIG.
 * @returns {Set<string>} Set of canonical label names.
 */
function loadCanonicalLabels() {
    const labelsData = readYamlArrayFile(LABELS_CONFIG, 'labels config');
    return new Set(labelsData.map((l) => (typeof l === 'string' ? l : l.name)));
}

/**
 * Loads alias mapping from LABELS_CONFIG.
 * @returns {Object} aliasMap - Maps alias to canonical label.
 */
function loadAliasMap() {
    const labelsData = readYamlArrayFile(LABELS_CONFIG, 'labels config');
    return buildLabelAliasMap(labelsData);
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
    log = console.log
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
                    `[labeling.agent] Migrated: ${label} -> ${canonical} on #${number}`
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
                `[labeling.agent] Removed non-canonical label: ${label} from #${number}`
            );
        }
    }
}

/**
 * Main orchestrator for labeling agent.
 * @param {Object} opts
 * @param {Object} [opts.context=github.context]
 * @param {Object} [opts.github]
 * @param {boolean} [opts.dryRun=false]
 * @returns {Promise<void>}
 */
async function runLabelingAgent(opts = {}) {
    const context = opts.context || github.context;
    const octokit =
        opts.github ||
        github.getOctokit(
            core.getInput('github-token') || process.env.GITHUB_TOKEN
        );
    const dryRun = !!opts.dryRun;

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
        core.info('No issue or PR in context.');
        return;
    }

    // Load canonical set and alias map using env-driven paths
    let canonicalSet, aliasMap;
    try {
        canonicalSet = loadCanonicalLabels();
        aliasMap = loadAliasMap();
    } catch (e) {
        core.setFailed(e.message);
        return;
    }

    // Get current labels
    const currentLabels = isIssue
        ? (context.payload.issue.labels || []).map((l) => l.name)
        : (context.payload.pull_request.labels || []).map((l) => l.name);

    // Enforce one-hot status/priority/type
    await enforceOneHotStatus({
        github: octokit,
        owner,
        repo,
        number,
        currentLabels,
        dryRun,
    });
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

    // Changelog nudge for PRs
    if (isPR) {
        const changelogLabels = [
            'no-changelog',
            'changelog:added',
            'changelog:changed',
            'changelog:fixed',
            'changelog:security',
            'changelog:deprecated',
            'changelog:removed',
        ];
        if (!currentLabels.some((l) => changelogLabels.includes(l))) {
            if (!dryRun) {
                await octokit.rest.issues.addLabels({
                    owner,
                    repo,
                    issue_number: number,
                    labels: ['meta:needs-changelog'],
                });
            }
            core.info('[labeling.agent] Added meta:needs-changelog');
        }
    }

    // Standardize/migrate labels
    await standardizeLabelsOnItem(
        octokit,
        owner,
        repo,
        number,
        currentLabels,
        canonicalSet,
        aliasMap,
        dryRun,
        core.info
    );

    core.info(
        `[labeling.agent] Completed env-driven labeling run (LABELS_CONFIG=${LABELS_CONFIG}, DRY_RUN=${dryRun}).`
    );
}

if (require.main === module) {
    runLabelingAgent().catch((e) => {
        core.setFailed(e.message);
    });
}

module.exports = { runLabelingAgent };
