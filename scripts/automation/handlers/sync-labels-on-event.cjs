/**
 * Sync Labels on Event
 * Automatically syncs and validates label combinations on issue events
 * - Validates label combinations against canonical set
 * - Detects and reports conflicts
 * - Suggests related label syncs
 * - Handles all openspec:*, status:*, and type:* labels
 */

const phaseStateMachine = require("../includes/phase-state-machine.cjs");
const labelValidator = require("../includes/label-validator.cjs");
const auditLogger = require("../includes/audit-logger");

const OWNER = "lightspeedwp";
const REPO = ".github";

/**
 * Sync labels on issue event
 * Main entry point for label synchronization
 * @param {object} issue - Issue object from GitHub
 * @param {string} eventType - Type of event (created, labeled, reopened, closed)
 * @param {object} options - Options (dryRun, verbose, etc.)
 * @returns {object} Sync result with changes and conflicts
 */
function syncLabelsOnEvent(issue, eventType, options = {}) {
  const result = {
    success: true,
    issueNumber: issue.number,
    eventType: eventType,
    currentLabels: issue.labels.map((l) => l.name),
    suggestedChanges: [],
    labelsToAdd: [],
    labelsToRemove: [],
    conflicts: [],
    warnings: [],
    errors: [],
    dryRun: options.dryRun !== false,
  };

  try {
    // Get current labels
    const currentLabels = result.currentLabels;

    // Validate current label combination
    const validation = labelValidator.validateLabels(currentLabels);
    if (!validation.valid) {
      result.conflicts.push(...validation.conflicts);
    }
    if (validation.warnings.length > 0) {
      result.warnings.push(...validation.warnings);
    }

    // Handle based on event type
    switch (eventType) {
      case "created":
        handleIssueCreated(issue, result);
        break;
      case "labeled":
        handleIssueLabeledEvent(issue, result);
        break;
      case "reopened":
        handleIssueReopened(issue, result);
        break;
      case "closed":
        handleIssueClosed(issue, result);
        break;
    }

    // Apply suggested changes
    if (result.labelsToAdd.length > 0 || result.labelsToRemove.length > 0) {
      if (!options.dryRun) {
        applyLabelChanges(
          issue.number,
          result.labelsToAdd,
          result.labelsToRemove,
        );
      }
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Handle issue created event
 * Validates and ensures required labels are present
 * @private
 */
function handleIssueCreated(issue, result) {
  const currentLabels = result.currentLabels;

  // Check if issue has a type label
  const hasTypeLabel = currentLabels.some((l) => l.startsWith("type:"));
  if (!hasTypeLabel) {
    result.warnings.push(
      "No type label found. Recommend adding type:task, type:feature, or type:epic",
    );
  }

  // Check if issue has an openspec label
  const hasOpenSpecLabel = currentLabels.some((l) => l.startsWith("openspec:"));
  if (hasOpenSpecLabel) {
    // Validate openspec + status combination
    syncOpenSpecLabels(issue, result);
  }
}

/**
 * Handle issue labeled event
 * When a label is added, sync related labels
 * @private
 */
function handleIssueLabeledEvent(issue, result) {
  const currentLabels = result.currentLabels;

  // If an openspec label was added, sync related labels
  const openspecLabels = currentLabels.filter((l) => l.startsWith("openspec:"));
  if (openspecLabels.length > 0) {
    syncOpenSpecLabels(issue, result);
  }

  // If a status label was added, validate against openspec
  const statusLabels = currentLabels.filter((l) => l.startsWith("status:"));
  if (statusLabels.length > 0) {
    syncStatusLabels(issue, result);
  }
}

/**
 * Handle issue reopened event
 * Ensure labels are consistent when issue is reopened
 * @private
 */
function handleIssueReopened(issue, result) {
  const currentLabels = result.currentLabels;

  // Check for stale done/complete labels
  const hasDoneLabel = currentLabels.includes("status:done");
  if (hasDoneLabel) {
    result.warnings.push(
      'Issue reopened but has "status:done" label. Consider removing it.',
    );
  }

  const hasCompleteLabel = currentLabels.some((l) => l.includes("complete"));
  if (hasCompleteLabel) {
    result.warnings.push(
      "Issue reopened but has completion label. May need to reset phase.",
    );
  }
}

/**
 * Handle issue closed event
 * Validate final state before closing
 * @private
 */
function handleIssueClosed(issue, result) {
  const currentLabels = result.currentLabels;

  // Check if issue has proper completion status
  const hasCompletionLabel = currentLabels.some(
    (l) => l.includes("complete") || l === "status:done",
  );

  if (!hasCompletionLabel) {
    result.warnings.push(
      "Issue closed without completion status. Add status:done or implementation:complete",
    );
  }
}

/**
 * Sync openspec labels
 * When an openspec label is present, ensure related status labels are compatible
 * @private
 */
function syncOpenSpecLabels(issue, result) {
  const currentLabels = result.currentLabels;
  const openspecLabel = currentLabels.find((l) => l.startsWith("openspec:"));

  if (!openspecLabel) return;

  // Get recommended status for this openspec state
  const recommendations = getRecommendedLabelsForOpenSpec(openspecLabel);

  // Check if recommended labels are present
  recommendations.forEach((rec) => {
    const labelFamily = rec.split(":")[0];
    const hasLabelInFamily = currentLabels.some((l) =>
      l.startsWith(labelFamily + ":"),
    );

    if (!hasLabelInFamily && rec !== openspecLabel) {
      result.suggestedChanges.push({
        label: rec,
        reason: `Recommended for ${openspecLabel}`,
        type: "add",
      });

      // Add to actual changes if not conflicting
      if (!wouldConflict(rec, currentLabels)) {
        result.labelsToAdd.push(rec);
      }
    }
  });
}

/**
 * Sync status labels
 * Validate that status labels are compatible with openspec labels
 * @private
 */
function syncStatusLabels(issue, result) {
  const currentLabels = result.currentLabels;
  const statusLabel = currentLabels.find((l) => l.startsWith("status:"));
  const openspecLabel = currentLabels.find((l) => l.startsWith("openspec:"));

  if (!statusLabel || !openspecLabel) return;

  // Validate compatibility
  const isCompatible = isStatusOpenSpecCompatible(statusLabel, openspecLabel);
  if (!isCompatible) {
    result.conflicts.push(
      `Status label "${statusLabel}" is not compatible with "${openspecLabel}"`,
    );
  }
}

/**
 * Get recommended labels for an openspec state
 * @private
 */
function getRecommendedLabelsForOpenSpec(openspecLabel) {
  const recommendations = {
    "openspec:specification-pending": [
      "status:needs-planning",
      "priority:important",
    ],
    "openspec:specification-in-progress": ["status:in-progress", "meta:has-pr"],
    "openspec:specification-complete": ["status:ready"],
    "openspec:implementation-pending": [
      "status:needs-planning",
      "priority:important",
    ],
    "openspec:implementation-in-progress": [
      "status:in-progress",
      "meta:has-pr",
    ],
    "openspec:implementation-complete": ["status:done"],
  };

  return recommendations[openspecLabel] || [];
}

/**
 * Check if a status label is compatible with an openspec label
 * @private
 */
function isStatusOpenSpecCompatible(statusLabel, openspecLabel) {
  const compatibility = {
    "status:needs-planning": [
      "openspec:specification-pending",
      "openspec:implementation-pending",
    ],
    "status:in-progress": [
      "openspec:specification-in-progress",
      "openspec:implementation-in-progress",
    ],
    "status:ready": ["openspec:specification-complete"],
    "status:done": ["openspec:implementation-complete"],
    "status:blocked": [
      "openspec:specification-in-progress",
      "openspec:implementation-in-progress",
    ],
    "status:on-hold": [
      "openspec:specification-pending",
      "openspec:implementation-pending",
    ],
  };

  const compatibleLabels = compatibility[statusLabel] || [];
  return compatibleLabels.includes(openspecLabel);
}

/**
 * Check if a label would conflict with current labels
 * @private
 */
function wouldConflict(label, currentLabels) {
  const validator = labelValidator.validateLabels([...currentLabels, label]);
  return !validator.valid;
}

/**
 * Apply label changes to an issue
 * Uses GitHub CLI to add/remove labels
 * @private
 */
function applyLabelChanges(issueNumber, labelsToAdd, labelsToRemove) {
  try {
    if (labelsToAdd.length > 0) {
      auditLogger.logLabelChange({
        issueNumber,
        action: "add",
        labels: labelsToAdd,
      });
      // GitHub API call would go here
    }

    if (labelsToRemove.length > 0) {
      auditLogger.logLabelChange({
        issueNumber,
        action: "remove",
        labels: labelsToRemove,
      });
      // GitHub API call would go here
    }
  } catch (error) {
    console.error("Error applying label changes:", error);
  }
}

/**
 * Batch sync labels on multiple issues
 * @param {array} issues - Array of issue objects
 * @param {string} eventType - Event type for all issues
 * @param {object} options - Options (dryRun, limit, etc.)
 * @returns {object} Batch result with statistics
 */
function batchSyncLabels(issues, eventType, options = {}) {
  const results = [];
  const stats = {
    total: issues.length,
    processed: 0,
    conflicts: 0,
    warnings: 0,
    changesApplied: 0,
  };

  // Limit processing if specified
  const limit = options.limit || issues.length;
  const issuesToProcess = issues.slice(0, limit);

  issuesToProcess.forEach((issue) => {
    const result = syncLabelsOnEvent(issue, eventType, options);
    results.push(result);

    stats.processed++;
    if (result.conflicts.length > 0) stats.conflicts++;
    if (result.warnings.length > 0) stats.warnings++;
    if (result.labelsToAdd.length > 0 || result.labelsToRemove.length > 0) {
      stats.changesApplied++;
    }
  });

  return {
    success: true,
    results,
    stats,
    dryRun: options.dryRun !== false,
  };
}

module.exports = {
  syncLabelsOnEvent,
  batchSyncLabels,
  // Export internal functions for testing
  handleIssueCreated,
  handleIssueLabeledEvent,
  handleIssueReopened,
  handleIssueClosed,
  syncOpenSpecLabels,
  syncStatusLabels,
  getRecommendedLabelsForOpenSpec,
  isStatusOpenSpecCompatible,
};
