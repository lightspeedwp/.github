/**
 * Handle PR Opened Event
 * Processes when a pull request is opened
 * - Link PR to related issue
 * - Sync labels from issue to PR
 * - Trigger automatic phase progression (pending → in-progress)
 */

const { execFileSync } = require("child_process");
const phaseStateMachine = require("../includes/phase-state-machine");
const labelValidator = require("../includes/label-validator");
const auditLogger = require("../includes/audit-logger");

const OWNER = "lightspeedwp";
const REPO = ".github";

/**
 * Handle PR opened event
 * @param {object} pr - Pull request object from GitHub API
 * @param {number} linkedIssueNumber - Issue number linked in PR body
 * @returns {object} Result of handling
 */
function handlePROpened(pr, linkedIssueNumber) {
  const result = {
    success: true,
    prNumber: pr.number,
    changes: [],
    warnings: [],
    errors: [],
  };

  try {
    if (!linkedIssueNumber) {
      result.warnings.push(
        'No linked issue found in PR body (expected "Resolves #123" or "Related: #456")',
      );
      return result;
    }

    // Fetch the linked issue
    let issue;
    try {
      const issueOutput = execFileSync(
        "gh",
        [
          "issue",
          "view",
          String(linkedIssueNumber),
          "--repo",
          `${OWNER}/${REPO}`,
          "--json",
          "number,labels,title",
        ],
        { encoding: "utf-8" },
      );

      issue = JSON.parse(issueOutput);
    } catch (error) {
      result.warnings.push(
        `Could not fetch issue #${linkedIssueNumber}: ${error.message}`,
      );
      return result;
    }

    const issueLabels = issue.labels.map((l) => l.name);
    const openspecLabel = labelValidator.getOpenSpecLabel(issueLabels);

    if (!openspecLabel) {
      result.warnings.push(`Issue #${linkedIssueNumber} has no OpenSpec label`);
      return result;
    }

    // Check if we should trigger phase progression
    const triggers = phaseStateMachine.getProgressionTriggers(openspecLabel);
    const prOpenedTrigger = triggers["PR opened"];

    if (prOpenedTrigger) {
      result.changes.push({
        type: "phase-progression",
        currentState: openspecLabel,
        nextState: prOpenedTrigger,
        trigger: "PR opened",
        issueNumber: linkedIssueNumber,
        prNumber: pr.number,
        reason: `Automatic phase progression triggered by PR #${pr.number}`,
      });
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Extract linked issue number from PR body
 * @param {string} prBody - PR description/body text
 * @returns {number|null} Issue number or null
 */
function extractLinkedIssue(prBody) {
  if (!prBody) return null;

  // Match patterns like "Resolves #123", "Fixes #123", "Related: #456"
  const patterns = [
    /(?:Resolves|Fixes|closes?|fix|resolve|related)\s+#(\d+)/i,
    /#(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = prBody.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

/**
 * Apply phase progression to linked issue
 * @param {number} issueNumber - Issue number
 * @param {string} nextLabel - Next OpenSpec label
 * @param {string} currentLabel - Current OpenSpec label
 * @param {boolean} dryRun - Whether to perform dry run
 * @returns {boolean} Success
 */
function applyPhaseProgression(
  issueNumber,
  nextLabel,
  currentLabel,
  dryRun = false,
) {
  if (dryRun) {
    console.log(`[DRY RUN] Would update issue #${issueNumber}`);
    console.log(`  Remove: ${currentLabel}`);
    console.log(`  Add: ${nextLabel}`);
    return true;
  }

  try {
    // Remove current OpenSpec label
    execFileSync(
      "gh",
      [
        "issue",
        "edit",
        String(issueNumber),
        "--repo",
        `${OWNER}/${REPO}`,
        "--remove-label",
        currentLabel,
      ],
      { encoding: "utf-8" },
    );

    // Add next OpenSpec label
    execFileSync(
      "gh",
      [
        "issue",
        "edit",
        String(issueNumber),
        "--repo",
        `${OWNER}/${REPO}`,
        "--add-label",
        nextLabel,
      ],
      { encoding: "utf-8" },
    );

    // Log the audit entry
    auditLogger.logEvent({
      issueNumber,
      prNumber: null, // Will be set by caller if available
      eventType: "pr-opened",
      action: "phase-progression",
      previousState: currentLabel,
      nextState: nextLabel,
      timestamp: new Date().toISOString(),
      reason: "Automatic phase progression triggered by PR opening",
    });

    return true;
  } catch (error) {
    console.error(`Failed to update issue #${issueNumber}:`, error.message);
    return false;
  }
}

// CLI entry point
if (require.main === module) {
  const args = require("minimist")(process.argv.slice(2));
  const prNumber = parseInt(args.pr, 10);
  const dryRun = args["dry-run"] === "true";
  const prBody = process.env.PR_BODY || "";

  try {
    const linkedIssue = extractLinkedIssue(prBody);
    const result = handlePROpened({ number: prNumber }, linkedIssue);

    if (result.success && result.changes.length > 0) {
      for (const change of result.changes) {
        applyPhaseProgression(
          change.issueNumber,
          change.nextState,
          change.currentState,
          dryRun,
        );
      }
    }

    console.log(
      JSON.stringify(
        {
          status: result.success ? "success" : "failed",
          prNumber,
          linkedIssue,
          changes: result.changes,
          warnings: result.warnings,
          errors: result.errors,
        },
        null,
        2,
      ),
    );

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = {
  handlePROpened,
  extractLinkedIssue,
  applyPhaseProgression,
};
