/**
 * Handle PR Merged Event
 * Processes when a pull request is merged
 * - Extract linked issue from PR
 * - Trigger automatic phase completion (in-progress → complete)
 * - Generate completion report
 */

const { execFileSync } = require("child_process");
const phaseStateMachine = require("../includes/phase-state-machine.cjs");
const labelValidator = require("../includes/label-validator.cjs");
const auditLogger = require("../includes/audit-logger");

const OWNER = "lightspeedwp";
const REPO = ".github";

/**
 * Handle PR merged event
 * @param {object} pr - Pull request object from GitHub API
 * @param {number} linkedIssueNumber - Issue number linked in PR
 * @returns {object} Result of handling
 */
function handlePRMerged(pr, linkedIssueNumber) {
  const result = {
    success: true,
    prNumber: pr.number,
    changes: [],
    warnings: [],
    errors: [],
  };

  try {
    if (!linkedIssueNumber) {
      result.warnings.push("No linked issue found in PR body");
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
          "number,labels,title,state",
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
    const currentOpenSpec = labelValidator.getOpenSpecLabel(issueLabels);

    if (!currentOpenSpec) {
      result.warnings.push(`Issue #${linkedIssueNumber} has no OpenSpec label`);
      return result;
    }

    // Check if we should trigger phase completion
    const triggers = phaseStateMachine.getProgressionTriggers(currentOpenSpec);
    const prMergedTrigger = triggers["PR merged"];

    if (prMergedTrigger) {
      result.changes.push({
        type: "phase-completion",
        currentState: currentOpenSpec,
        nextState: prMergedTrigger,
        trigger: "PR merged",
        issueNumber: linkedIssueNumber,
        prNumber: pr.number,
        reason: `Automatic phase completion triggered by PR #${pr.number} merge`,
      });

      // If transitioning to implementation-pending, note that
      if (prMergedTrigger === phaseStateMachine.STATES.IMPLEMENTATION_PENDING) {
        result.changes.push({
          type: "phase-note",
          message: `Issue ${linkedIssueNumber} ready for implementation after specification completion`,
        });
      }
    } else {
      result.warnings.push(
        `No phase progression trigger found for state: ${currentOpenSpec}`,
      );
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Apply phase completion to linked issue
 * @param {number} issueNumber - Issue number
 * @param {string} nextLabel - Next OpenSpec label (completion state)
 * @param {string} currentLabel - Current OpenSpec label
 * @param {boolean} dryRun - Whether to perform dry run
 * @returns {boolean} Success
 */
function applyPhaseCompletion(
  issueNumber,
  nextLabel,
  currentLabel,
  dryRun = false,
) {
  if (dryRun) {
    console.log(`[DRY RUN] Would complete phase for issue #${issueNumber}`);
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

    // Add completion OpenSpec label
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

    // Update related status label
    updateStatusLabel(issueNumber, "status:ready", dryRun);

    // Log the audit entry
    auditLogger.logEvent({
      issueNumber,
      prNumber: null, // Will be set by caller if available
      eventType: "pr-merged",
      action: "phase-completion",
      previousState: currentLabel,
      nextState: nextLabel,
      timestamp: new Date().toISOString(),
      reason: "Automatic phase completion triggered by PR merge",
    });

    return true;
  } catch (error) {
    console.error(
      `Failed to complete phase for issue #${issueNumber}:`,
      error.message,
    );
    return false;
  }
}

/**
 * Update status label when phase completes
 * @param {number} issueNumber - Issue number
 * @param {string} statusLabel - Status label to set
 * @param {boolean} dryRun - Whether to perform dry run
 * @returns {boolean} Success
 */
function updateStatusLabel(issueNumber, statusLabel, dryRun = false) {
  if (dryRun) {
    console.log(
      `[DRY RUN] Would update status label for issue #${issueNumber}: ${statusLabel}`,
    );
    return true;
  }

  try {
    const issueOutput = execFileSync(
      "gh",
      [
        "issue",
        "view",
        String(issueNumber),
        "--repo",
        `${OWNER}/${REPO}`,
        "--json",
        "labels",
      ],
      { encoding: "utf-8" },
    );

    const issue = JSON.parse(issueOutput);
    const currentLabels = issue.labels.map((l) => l.name);
    const currentStatus = labelValidator.getStatusLabels(currentLabels);

    // Remove old status labels
    for (const label of currentStatus) {
      execFileSync(
        "gh",
        [
          "issue",
          "edit",
          String(issueNumber),
          "--repo",
          `${OWNER}/${REPO}`,
          "--remove-label",
          label,
        ],
        { encoding: "utf-8" },
      );
    }

    // Add new status label
    execFileSync(
      "gh",
      [
        "issue",
        "edit",
        String(issueNumber),
        "--repo",
        `${OWNER}/${REPO}`,
        "--add-label",
        statusLabel,
      ],
      { encoding: "utf-8" },
    );

    return true;
  } catch (error) {
    console.error(
      `Failed to update status label for issue #${issueNumber}:`,
      error.message,
    );
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
    const result = handlePRMerged({ number: prNumber }, linkedIssue);

    if (result.success && result.changes.length > 0) {
      for (const change of result.changes) {
        if (change.type === "phase-completion") {
          applyPhaseCompletion(
            change.issueNumber,
            change.nextState,
            change.currentState,
            dryRun,
          );
        }
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
  handlePRMerged,
  extractLinkedIssue,
  applyPhaseCompletion,
  updateStatusLabel,
};

/**
 * Extract linked issue number from PR body
 * @param {string} prBody - PR body content
 * @returns {number|null} Issue number or null
 */
function extractLinkedIssue(prBody) {
  if (!prBody) return null;

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
 * Generate completion report for issue
 * @param {number} issueNumber - Issue number
 * @returns {object} Completion report
 */
function generateCompletionReport(issueNumber) {
  try {
    const auditTrail = auditLogger.getIssueAuditTrail(issueNumber);

    return {
      issueNumber,
      eventsCount: auditTrail.length,
      timestamps: auditTrail.map((e) => e.timestamp),
      transitions: auditTrail
        .filter(
          (e) =>
            e.action === "phase-progression" || e.action === "phase-completion",
        )
        .map((e) => ({
          from: e.previousState,
          to: e.nextState,
          trigger: e.reason,
          timestamp: e.timestamp,
        })),
    };
  } catch (error) {
    console.error(
      `Failed to generate completion report for issue #${issueNumber}:`,
      error.message,
    );
    return null;
  }
}

module.exports = {
  handlePRMerged,
  applyPhaseCompletion,
  updateStatusLabel,
  generateCompletionReport,
};
