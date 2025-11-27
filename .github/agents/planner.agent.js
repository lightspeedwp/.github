/**
 * ============================================================================
 * Agent: planner.agent.js
 * Location: .github/agents/planner.agent.js
 * Description:
 *   - Posts a PR task checklist and exit criteria for every pull request.
 *   - Main functions: run(), checklist generation, PR context analysis, markdown comment posting.
 *   - Uses shared utilities: label-reporting (optional).
 *   - Shared test helpers: mockOctokit, mockContext, expectMarkdownReport, mockPrPayload, expectDryRun, etc.
 *   - Coverage: Checklist posting, exit criteria, dry-run logic, error handling.
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - See org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock with new coverage or helpers
 *   - Add new helpers to tests/utility/test-helpers.js as needed
 * ============================================================================
 */

const actionsCore = require("@actions/core");
const actionsGithub = require("@actions/github");

/**
 * Main orchestrator for Planner Agent.
 * Posts a checklist comment on every PR for contributor and reviewer workflow.
 * @param {Object} context - GitHub Actions context object.
 * @returns {Promise<void>}
 */
async function run(context = actionsGithub.context) {
  try {
    const dry =
      (actionsCore.getInput("dry-run") || process.env.DRY_RUN) === "true";
    const pr = context.payload.pull_request;
    if (!pr) {
      actionsCore.info("No PR in context; exiting.");
      return;
    }
    const checklist = [
      "- [ ] Confirm scope & acceptance criteria",
      "- [ ] Link related issues & project items",
      "- [ ] Update/verify tests & coverage",
      "- [ ] Run linters/formatters",
      "- [ ] Update CHANGELOG.md (if user-facing)",
      "- [ ] Update docs (README/examples)",
      "- [ ] Security & secrets check",
      "- [ ] Self-review; request review",
    ];
    const body = `## 🧭 Planner: Task Ledger for PR #${pr.number}
**Title:** ${pr.title}

### Checklist
${checklist.join("\n")}

### Exit Criteria
- Tests green, linters clean
- Reviewer approvals complete
- No blocking labels
`;

    if (dry) {
      actionsCore.info("[DRY RUN] Would post planner comment:\n" + body);
      return;
    }
    const octokit = actionsGithub.getOctokit(
      process.env.GITHUB_TOKEN || actionsCore.getInput("github-token"),
    );
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body,
    });
    actionsCore.info("Planner comment posted.");
  } catch (e) {
    actionsCore.setFailed(e.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
