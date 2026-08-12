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
 * @see ../../../.github/agents/reviewer.agent.md
 */

import * as core from "@actions/core";
import * as github from "@actions/github";
import { Logger } from "../utils/logger.js";

const logger = new Logger(process.env.LOG_LEVEL || "info");

function categorizeFile(filename) {
  const lower = filename.toLowerCase();

  if (/\.github\/workflows/.test(lower)) {
    return { category: "Workflows", riskLevel: "CRITICAL" };
  }
  if (/\.github|secrets|api[_-]?key|password|token/.test(lower)) {
    return { category: "Configuration", riskLevel: "HIGH" };
  }
  if (
    /package\.(json|[-.]?lock)|composer\.(json|lock)|yarn\.lock|pnpm-lock\.yaml|requirements\.txt/.test(
      lower,
    )
  ) {
    return { category: "Dependencies", riskLevel: "HIGH" };
  }
  if (/migration|schema|database/.test(lower)) {
    return { category: "Database", riskLevel: "HIGH" };
  }
  if (/security|license|codeofconduct/.test(lower)) {
    return { category: "Security", riskLevel: "HIGH" };
  }
  if (/src\/|test\/|spec\/|\.test\.|\.spec\./.test(lower)) {
    return { category: "Code", riskLevel: "MEDIUM" };
  }
  if (/readme|docs\/|documentation/.test(lower)) {
    return { category: "Documentation", riskLevel: "LOW" };
  }
  return { category: "Other", riskLevel: "LOW" };
}

function hasSecurityFileChange(files) {
  return files.some(
    (f) =>
      f.filename &&
      /security|license|codeofconduct|\.github\/workflows/.test(
        f.filename.toLowerCase(),
      ),
  );
}

function hasLargeDeletion(files) {
  const totalDeletions = files.reduce((sum, f) => sum + (f.deletions || 0), 0);
  return totalDeletions > 500;
}

function hasMigrationWithoutRollback(files) {
  const hasMigration = files.some(
    (f) =>
      f.filename && /migration|schema.*change/.test(f.filename.toLowerCase()),
  );
  if (!hasMigration) return false;

  const hasRollbackDoc = files.some(
    (f) =>
      f.filename &&
      /rollback|revert|downgrade|(?:\b|[._-])down(?:\b|[._-])/.test(
        f.filename.toLowerCase(),
      ),
  );
  return !hasRollbackDoc;
}

/**
 * Main orchestrator for Reviewer Agent.
 * Posts a summary comment on PRs with CI status and file analysis.
 * @param {Object} context - GitHub Actions context object.
 * @param {Object} options - Configuration options.
 * @param {boolean} options.dryRun - If true, logs comment instead of posting.
 * @returns {Promise<void>}
 */
async function run(context = github.context, options = {}) {
  const startTime = Date.now();
  try {
    const token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error(
        "Missing GITHUB_TOKEN: provide via 'github-token' input or GITHUB_TOKEN env var",
      );
    }

    logger.info("Reviewer agent started", {
      event: "start",
      prNumber: context.payload.pull_request?.number,
      repo: context.repo.repo,
    });

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
      throw new Error(`Failed to initialize GitHub client: ${error.message}`, {
        cause: error,
      });
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
      files = await octokit.paginate(octokit.rest.pulls.listFiles, {
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pr.number,
        per_page: 100,
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch files for PR #${pr.number}: ${error.message}`,
        { cause: error },
      );
    }
    const changed = files.map((f) => f.filename);

    const srcTouched = changed.some(
      (f) => f.startsWith("src/") || /\.(js|ts|php|py)$/i.test(f),
    );

    const changelogNames = [
      "changelog.md",
      "changelog.txt",
      "history.md",
      "news.md",
      "releases.md",
    ];
    const hasChangelog = changed.some(
      (f) =>
        changelogNames.includes(f.toLowerCase().split("/").pop()) ||
        f.toLowerCase().includes("docs/changelog"),
    );
    const categorized = changed.map((f) => categorizeFile(f));
    const riskCounts = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };
    categorized.forEach((c) => {
      riskCounts[c.riskLevel]++;
    });

    const blockers = [];
    if (state !== "success") blockers.push("CI checks not green");
    if (requireChangelog && srcTouched && !hasChangelog)
      blockers.push("CHANGELOG.md missing for code change");
    if (riskCounts.CRITICAL > 0)
      blockers.push(
        `⚠️ ${riskCounts.CRITICAL} critical-risk file(s) modified (workflows, secrets)`,
      );
    if (hasSecurityFileChange(files))
      blockers.push("⚠️ Security-sensitive files modified (review carefully)");
    if (hasLargeDeletion(files))
      blockers.push("⚠️ Large deletion detected (>500 lines removed)");
    if (hasMigrationWithoutRollback(files))
      blockers.push("⚠️ Database migration without rollback plan documented");

    const emoji = blockers.length ? "❌" : state === "success" ? "✅" : "⚠️";
    const riskSummary = `**Risk Distribution:** ${riskCounts.CRITICAL} critical, ${riskCounts.HIGH} high, ${riskCounts.MEDIUM} medium, ${riskCounts.LOW} low`;
    const summary = `## 🔍 Reviewer Summary for PR #${pr.number}
**CI Status:** ${emoji} \`${state}\`
**Files changed:** ${files.length}
${riskSummary}

### Recommendations
${blockers.length ? blockers.map((b) => `- ${b}`).join("\n") : "- Ready to proceed pending human review"}

---
<!-- reviewer-agent-summary -->`;

    logger.info("Review analysis complete", {
      event: "analysis",
      filesChanged: files.length,
      criticalRisk: riskCounts.CRITICAL,
      highRisk: riskCounts.HIGH,
      mediumRisk: riskCounts.MEDIUM,
      lowRisk: riskCounts.LOW,
      blockers: blockers.length,
    });

    if (dryRun) {
      core.info(`DRY-RUN: Would post comment:\n${summary}`);
      logger.info("Dry-run mode: comment not posted", { event: "dry-run" });
    } else {
      try {
        const prComments = await octokit.paginate(
          octokit.rest.issues.listComments,
          {
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pr.number,
            per_page: 100,
          },
        );

        const existingComment = prComments.find((c) =>
          c.body?.includes("<!-- reviewer-agent-summary -->"),
        );

        if (existingComment) {
          await octokit.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: existingComment.id,
            body: summary,
          });
          core.info("Reviewer comment updated.");
          logger.info("Comment updated successfully", {
            event: "comment-updated",
            commentId: existingComment.id,
          });
        } else {
          await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pr.number,
            body: summary,
          });
          core.info("Reviewer comment posted.");
          logger.info("Comment posted successfully", {
            event: "comment-created",
            prNumber: pr.number,
          });
        }
      } catch (error) {
        throw new Error(
          `Failed to post comment on PR #${pr.number}: ${error.message}`,
          { cause: error },
        );
      }
    }

    logger.info("Reviewer agent completed successfully", {
      event: "complete",
      duration: Date.now() - startTime,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Reviewer agent failed", {
      event: "error",
      error: message,
      duration: Date.now() - startTime,
    });
    core.setFailed(message);
    process.exit(1);
  }
}

if (process.argv[1] && /reviewer\.agent\.js$/.test(process.argv[1])) {
  run();
}

export { run };
