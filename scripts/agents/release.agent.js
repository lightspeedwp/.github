/**
 * ============================================================================
 * Agent: release.agent.js
 * Location: .github/agents/release.agent.js
 * Description:
 *   - Automates release validation, semantic versioning, changelog enforcement, Git tagging, and GitHub Releases publication.
 *   - Main functions: run(), validate(), tag(), publish().
 *   - Uses shared utilities: release-enforcer.
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 * ============================================================================
 */

const {
  enforceOneHotStatus,
  applyDefaultStatus,
  applyDefaultPriority,
} = require("./includes/status-enforcer");
const core = require("@actions/core");
const github = require("@actions/github");

/**
 * Main orchestrator for Status One-Hot Enforcer Agent.
 * Ensures only one status label is present and applies defaults as needed.
 * @param {Object} context - GitHub Actions context object.
 * @returns {Promise<void>}
 */
// ...existing code...
async function run(context = github.context) {
  try {
    const token = process.env.GITHUB_TOKEN || core.getInput("github-token");
    if (!token) {
      throw new Error("GITHUB_TOKEN is required");
    }
    const octokit = github.getOctokit(token);

    const owner = context.repo.owner;
    const repo = context.repo.repo;

    const item = context.payload.issue || context.payload.pull_request;
    if (!item) {
      core.info("No issue or PR in context; exiting.");
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
      isPR,
    );
    await applyDefaultStatus(octokit, owner, repo, issueOrPrNumber, isPR);
    if (!isPR) {
      await applyDefaultPriority(
        octokit,
        owner,
        repo,
        issueOrPrNumber,
        currentLabels,
      );
    }

    core.info("Status/priority enforcement completed.");
  } catch (e) {
    core.setFailed(e.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
