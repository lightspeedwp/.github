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
 * @param {Object} options - Configuration options.
 * @param {boolean} options.dryRun - If true, logs comment instead of posting.
 * @returns {Promise<void>}
 */
async function run(context = github.context, options = {}) {
  try {
    const token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error(
        "Missing GITHUB_TOKEN: provide via 'github-token' input or GITHUB_TOKEN env var",
      );
    }

    const requireChangelog =
      (core.getInput("require-changelog") || "false") === "true";
    const dryRun =
      options.dryRun ||
      process.argv.includes("--dry-run") ||
      process.env.DRY_RUN === "true";

    let octokit;
    try {
      octokit = github.getOctokit(token);
    } catch (error) {
      throw new Error(`Failed to initialize GitHub client: ${error.message}`);
    }

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
    } catch (error) {
      core.warning(
        `Could not fetch CI status for ref ${pr.head.sha}: ${error.message}`,
      );
    }

    let files;
    try {
      const response = await octokit.rest.pulls.listFiles({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pr.number,
        per_page: 100,
      });
      files = response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch files for PR #${pr.number}: ${error.message}`,
      );
    }
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

    if (dryRun) {
      core.info(`DRY-RUN: Would post comment:\n${summary}`);
    } else {
      try {
        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: pr.number,
          body: summary,
        });
        core.info("Reviewer comment posted.");
      } catch (error) {
        throw new Error(
          `Failed to post comment on PR #${pr.number}: ${error.message}`,
        );
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(message);
    process.exit(1);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  run();
}

export { run };
