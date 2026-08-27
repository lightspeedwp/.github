/**
 * Handle Issue Labeled Event
 * Processes when a label is added to an issue
 * - Validates label combinations
 * - Triggers automatic phase progression
 * - Syncs related labels
 */

const { execFileSync } = require("child_process");
const phaseStateMachine = require("../includes/phase-state-machine.cjs");
const labelValidator = require("../includes/label-validator.cjs");
const auditLogger = require("../includes/audit-logger.cjs");

const OWNER = "lightspeedwp";
const REPO = ".github";

/**
 * Handle issue labeled event
 * @param {object} issue - Issue object from GitHub API
 * @param {string} addedLabel - Label that was just added
 * @returns {object} Result of handling
 */
function handleIssueLabled(issue, addedLabel) {
  const result = {
    success: true,
    issueNumber: issue.number,
    labelAdded: addedLabel,
    changes: [],
    warnings: [],
    errors: [],
  };

  try {
    // Get current labels
    const currentLabels = issue.labels.map((l) => l.name);

    // Validate the new label combination
    const validation = labelValidator.validateLabels([
      ...currentLabels,
      addedLabel,
    ]);
    if (!validation.valid) {
      result.warnings.push(...validation.conflicts);
    }

    // Check if this is an OpenSpec label
    const isOpenSpecLabel = addedLabel.startsWith("openspec:");

    if (isOpenSpecLabel) {
      result.changes.push(
        handleOpenSpecLabelAdded(issue, addedLabel, currentLabels),
      );
    }

    // Check for suggested label syncing
    if (validation.suggestions.length > 0) {
      result.warnings.push(...validation.suggestions);
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Handle OpenSpec label being added
 * Checks if we should automatically advance the phase
 * @private
 */
function handleOpenSpecLabelAdded(issue, label, currentLabels) {
  const changes = {
    issueNumber: issue.number,
    labelAdded: label,
    labelsToAdd: [],
    labelsToRemove: [],
    reason: null,
  };

  // Remove conflicting OpenSpec labels from same phase
  const specLabels = [
    ...phaseStateMachine.STATES.SPECIFICATION_PENDING,
    ...phaseStateMachine.STATES.SPECIFICATION_IN_PROGRESS,
    ...phaseStateMachine.STATES.SPECIFICATION_COMPLETE,
    ...phaseStateMachine.STATES.IMPLEMENTATION_PENDING,
    ...phaseStateMachine.STATES.IMPLEMENTATION_IN_PROGRESS,
    ...phaseStateMachine.STATES.IMPLEMENTATION_COMPLETE,
  ];

  const existingOpenSpecLabels = currentLabels.filter(
    (l) => l.startsWith("openspec:") && l !== label,
  );

  if (existingOpenSpecLabels.length > 0) {
    // Check if this is a valid transition
    const currentOpenSpec = existingOpenSpecLabels[0];
    if (phaseStateMachine.isValidTransition(currentOpenSpec, label)) {
      changes.labelsToRemove.push(currentOpenSpec);
      changes.reason = `Valid transition: ${currentOpenSpec} → ${label}`;
    }
  }

  // Suggest related status label based on OpenSpec label
  const phase = phaseStateMachine.getPhase(label);
  const step = phaseStateMachine.getStep(label);

  const statusSuggestions = {
    pending: "status:needs-planning",
    "in-progress": "status:in-progress",
    complete: "status:ready",
  };

  const suggestedStatus = statusSuggestions[step];
  if (suggestedStatus && !currentLabels.includes(suggestedStatus)) {
    // Check for conflicting status labels
    const currentStatusLabels = labelValidator.getStatusLabels(currentLabels);
    if (currentStatusLabels.length > 0) {
      changes.labelsToRemove.push(...currentStatusLabels);
    }
    changes.labelsToAdd.push(suggestedStatus);
    changes.reason = `Status sync for ${label} (${step} phase)`;
  }

  return changes;
}

/**
 * Check for automatic phase progression triggers
 * @param {object} issue - Issue object
 * @param {string} label - Label that was added
 * @returns {object|null} Trigger result or null
 */
function checkProgressionTrigger(issue, label) {
  const currentLabels = issue.labels.map((l) => l.name);
  const currentOpenSpec = labelValidator.getOpenSpecLabel(currentLabels);

  if (!currentOpenSpec) return null;

  const triggers = phaseStateMachine.getProgressionTriggers(currentOpenSpec);
  const triggerKey = `${label} added`;

  if (triggers[triggerKey]) {
    return {
      currentState: currentOpenSpec,
      nextState: triggers[triggerKey],
      trigger: triggerKey,
    };
  }

  return null;
}

/**
 * Apply label changes to issue
 * @param {number} issueNumber - Issue number
 * @param {array} labelsToAdd - Labels to add
 * @param {array} labelsToRemove - Labels to remove
 * @param {boolean} dryRun - Whether to perform dry run
 * @returns {boolean} Success
 */
function applyLabelChanges(
  issueNumber,
  labelsToAdd,
  labelsToRemove,
  dryRun = false,
) {
  if (dryRun) {
    console.log(`[DRY RUN] Would update labels for issue #${issueNumber}`);
    if (labelsToAdd.length > 0) console.log(`  Add: ${labelsToAdd.join(", ")}`);
    if (labelsToRemove.length > 0)
      console.log(`  Remove: ${labelsToRemove.join(", ")}`);
    return true;
  }

  try {
    // Add labels
    for (const label of labelsToAdd) {
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
    }

    // Remove labels
    for (const label of labelsToRemove) {
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

    return true;
  } catch (error) {
    console.error(
      `Failed to update labels for issue #${issueNumber}:`,
      error.message,
    );
    return false;
  }
}

module.exports = {
  handleIssueLabled,
  handleOpenSpecLabelAdded,
  checkProgressionTrigger,
  applyLabelChanges,
};
