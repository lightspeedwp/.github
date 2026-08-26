/**
 * ============================================================================
 * Agent: reviewer.agent.js
 * Location: reviewer.agent.js
 * Description:
 *   - Posts automated review summaries for PRs, including CI status, changelog presence, and recommendations.
 *   - Main functions: run(), CI status check, file analysis, markdown summary/comment.
 *   - Uses shared utilities: label-reporting.
 *   - Shared test helpers: mockOctokit, mockContext, mockChangedFiles, expectCommentPosted, expectDryRun, etc.
 *   - Coverage: Review summary posting, changelog checks, CI state, dry-run, error handling.
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/HEAD/instructions/coding-standards.instructions.md)
 *   - See org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock with new logic or helper usage
 *   - Add new helpers to tests/utility/test-helpers.js as needed
 * ============================================================================
 * @module scripts/agents/reviewer.agent.js
 * @see ../../agents/reviewer.agent.md
 */

import * as core from "@actions/core";
import * as github from "@actions/github";
import { pathToFileURL } from "url";

/**
 * Main orchestrator for Reviewer Agent.
 * Posts a summary comment on PRs with CI status and file analysis.
 * @param {Object} context - GitHub Actions context object.
 * @returns {Promise<void>}
 */
async function run(context = github.context) {
  try {
    const token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing token");
    const requireChangelog =
      (core.getInput("require-changelog") || "false") === "true";
    const octokit = github.getOctokit(token);
    const pr = context.payload.pull_request;
    if (!pr) {
      core.info("No PR in context; exiting.");
      return;
    }

    let state = "unknown";
    try {
      const { data } = await octokit.rest.repos.getCombinedStatusForRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: pr.head.sha,
      });
      state = data.state;
    } catch (e) {
      core.info("Could not fetch CI status.");
    }
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pr.number,
      per_page: 100,
    });
    const changed = files.map((f) => f.filename);

    const srcTouched = changed.some(
      (f) => f.startsWith("src/") || /\.(js|ts|php|py)$/i.test(f),
    );
    const hasChangelog = changed.some(
      (f) => f.toLowerCase() === "changelog.md",
    );
    const blockers = [];
    if (state !== "success") blockers.push("CI checks not green");
    if (requireChangelog && srcTouched && !hasChangelog)
      blockers.push("CHANGELOG.md missing for code change");

    const emoji = blockers.length ? "❌" : state === "success" ? "✅" : "⚠️";
    const summary = `## 🔍 Reviewer Summary for PR #${pr.number}
**CI Status:** ${emoji} \`${state}\`
**Files changed:** ${files.length}

### Recommendations
${blockers.length ? blockers.map((b) => `- ${b}`).join("\n") : "- Ready to proceed pending human review"}
`;

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: summary,
    });
    core.info("Reviewer comment posted.");
  } catch (e) {
    core.setFailed(e.message);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  run();
}

export { run };
