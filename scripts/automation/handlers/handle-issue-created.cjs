/**
 * Handle Issue Created Event
 * Processes when a new issue is created
 * - Check for missing OpenSpec labels
 * - Suggest appropriate label based on issue type
 * - Trigger DoR/DoD template injection if needed
 */

const { execFileSync } = require("child_process");
const phaseStateMachine = require("../includes/phase-state-machine.cjs");
const labelValidator = require("../includes/label-validator.cjs");
const auditLogger = require("../includes/audit-logger.cjs");

const OWNER = "lightspeedwp";
const REPO = ".github";

// Map issue types to initial OpenSpec labels
const TYPE_TO_INITIAL_LABEL = {
  "type:feature": "openspec:specification-pending",
  "type:enhancement": "openspec:specification-pending",
  "type:bug": "openspec:implementation-pending",
  "type:documentation": "openspec:implementation-pending",
  "type:refactor": "openspec:specification-pending",
};

/**
 * Handle issue created event
 * @param {object} issue - Issue object from GitHub API
 * @returns {object} Result of handling
 */
function handleIssueCreated(issue) {
  const result = {
    success: true,
    issueNumber: issue.number,
    changes: [],
    warnings: [],
    errors: [],
  };

  try {
    const currentLabels = issue.labels.map((l) => l.name);

    // Check if issue already has an OpenSpec label
    const hasOpenSpecLabel = labelValidator.getOpenSpecLabel(currentLabels);
    if (hasOpenSpecLabel) {
      result.changes.push({
        type: "openspec_already_present",
        label: hasOpenSpecLabel,
        message: `Issue already has OpenSpec label: ${hasOpenSpecLabel}`,
      });
      return result;
    }

    // Determine suggested OpenSpec label based on type label
    const typeLabel = currentLabels.find((l) => l.startsWith("type:"));
    const suggestedLabel = typeLabel
      ? TYPE_TO_INITIAL_LABEL[typeLabel]
      : "openspec:specification-pending";

    if (!suggestedLabel) {
      result.warnings.push(
        `Unable to determine initial OpenSpec label for type: ${typeLabel}`,
      );
      return result;
    }

    // Validate the label combination
    const validation = labelValidator.validateLabels([
      ...currentLabels,
      suggestedLabel,
    ]);
    if (!validation.valid) {
      result.warnings.push(...validation.conflicts);
    }

    // Record change
    result.changes.push({
      issueNumber: issue.number,
      labelToAdd: suggestedLabel,
      reason: `Initial OpenSpec label for new issue (type: ${typeLabel || "unknown"})`,
    });

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Apply initial label to newly created issue
 * @param {number} issueNumber - Issue number
 * @param {string} label - Label to add
 * @param {boolean} dryRun - Whether to perform dry run
 * @returns {boolean} Success
 */
function applyInitialLabel(issueNumber, label, dryRun = false) {
  if (dryRun) {
    console.log(
      `[DRY RUN] Would add initial label to issue #${issueNumber}: ${label}`,
    );
    return true;
  }

  try {
    execFileSync(
      "gh",
      [
        "issue",
        "edit",
        String(issueNumber),
        "--repo",
        `${OWNER}/${REPO}`,
        "--add-label",
        label,
      ],
      { encoding: "utf-8" },
    );

    // Log the audit entry
    auditLogger.logEvent({
      issueNumber,
      eventType: "issue-created",
      action: "add-label",
      label,
      timestamp: new Date().toISOString(),
      reason: "Initial OpenSpec label for new issue",
    });

    return true;
  } catch (error) {
    console.error(
      `Failed to add initial label to issue #${issueNumber}:`,
      error.message,
    );
    return false;
  }
}

/**
 * Get initial OpenSpec label for issue type
 * @param {string} typeLabel - Type label (e.g., 'type:feature')
 * @returns {string|null} Initial OpenSpec label or null
 */
function getInitialLabel(typeLabel) {
  return TYPE_TO_INITIAL_LABEL[typeLabel] || "openspec:specification-pending";
}

module.exports = {
  handleIssueCreated,
  applyInitialLabel,
  getInitialLabel,
};
