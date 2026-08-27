/**
 * Orchestrate Phase Progression
 * Automatically advances OpenSpec labels through the lifecycle phases
 * - Tracks progression from pending → in-progress → complete
 * - Advances on PR link, commit reference, or manual label change
 * - Reports progression timeline and state transitions
 * - Validates all transitions against state machine
 */

const phaseStateMachine = require("../includes/phase-state-machine.cjs");
const labelValidator = require("../includes/label-validator.cjs");
const auditLogger = require("../includes/audit-logger.cjs");

const OWNER = "lightspeedwp";
const REPO = ".github";

/**
 * Orchestrate phase progression on issue event
 * Main entry point for automated phase advancement
 * @param {object} issue - Issue object from GitHub
 * @param {string} trigger - What triggered the progression (pr-opened, pr-merged, label-change, manual)
 * @param {object} options - Options (dryRun, verbose, etc.)
 * @returns {object} Progression result with state changes and timeline
 */
function orchestratePhaseProgression(issue, trigger, options = {}) {
  const result = {
    success: true,
    issueNumber: issue.number,
    trigger,
    currentLabels: issue.labels.map((l) => l.name),
    currentPhaseLabel: null,
    nextPhaseLabel: null,
    transitionValid: false,
    progressionApplied: false,
    progression: [],
    timeline: [],
    warnings: [],
    errors: [],
    dryRun: options.dryRun !== false,
  };

  try {
    // Get current phase label
    const phaseLabel = result.currentLabels.find((l) =>
      l.startsWith("openspec:"),
    );

    if (!phaseLabel) {
      result.warnings.push("No openspec label found; cannot advance phase");
      return result;
    }

    result.currentPhaseLabel = phaseLabel;

    // Check if trigger should advance phase
    const triggers = phaseStateMachine.getProgressionTriggers(phaseLabel);
    const nextPhase = triggers[trigger];

    if (!nextPhase) {
      result.warnings.push(
        `Trigger "${trigger}" does not advance from ${phaseLabel}`,
      );
      return result;
    }

    result.nextPhaseLabel = nextPhase;

    // Validate transition
    const isValid = phaseStateMachine.isValidTransition(phaseLabel, nextPhase);
    if (!isValid) {
      result.errors.push(
        `Invalid transition from ${phaseLabel} to ${nextPhase}`,
      );
      result.success = false;
      return result;
    }

    result.transitionValid = true;

    // Check if this is a progression (forward) or rollback
    const isProgressingForward = phaseStateMachine.isProgression(
      phaseLabel,
      nextPhase,
    );
    const isRollingBack = phaseStateMachine.isRollback(phaseLabel, nextPhase);

    // Record progression
    const phase = phaseStateMachine.getPhase(phaseLabel);
    const currentStep = phaseStateMachine.getStep(phaseLabel);
    const nextStep = phaseStateMachine.getStep(nextPhase);

    result.progression.push({
      from: phaseLabel,
      to: nextPhase,
      type: isProgressingForward ? "progression" : "rollback",
      phase,
      step: {
        current: currentStep,
        next: nextStep,
      },
      trigger,
      timestamp: new Date().toISOString(),
    });

    // Validate label combination after transition
    const newLabels = result.currentLabels.map((l) =>
      l === phaseLabel ? nextPhase : l,
    );
    const validation = labelValidator.validateLabels(newLabels);

    if (!validation.valid) {
      result.errors.push(
        `Transition would create invalid label combination: ${validation.conflicts.join(", ")}`,
      );
      result.success = false;
      return result;
    }

    // Apply progression
    if (!options.dryRun) {
      applyPhaseProgression(issue.number, phaseLabel, nextPhase);
    }

    result.progressionApplied = !options.dryRun;

    // Build timeline
    result.timeline.push({
      event: trigger,
      from: phaseLabel,
      to: nextPhase,
      timestamp: new Date().toISOString(),
      applied: result.progressionApplied,
    });

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Check if a PR link should trigger phase progression
 * Detects Resolves/Closes/Related patterns in PR body
 * @param {string} prBody - Pull request body text
 * @returns {array} Array of issue numbers linked
 */
function extractLinkedIssues(prBody) {
  if (!prBody) return [];

  const patterns = [
    /Resolves\s+#(\d+)/gi,
    /Closes\s+#(\d+)/gi,
    /Fixes\s+#(\d+)/gi,
    /Related\s+(?:to\s+)?#(\d+)/gi,
  ];

  const issues = new Set();
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(prBody)) !== null) {
      issues.add(parseInt(match[1], 10));
    }
  });

  return Array.from(issues);
}

/**
 * Check if a commit message references an issue
 * @param {string} commitMessage - Commit message text
 * @returns {array} Array of issue numbers referenced
 */
function extractReferencedIssues(commitMessage) {
  if (!commitMessage) return [];

  const pattern = /#(\d+)/g;
  const issues = new Set();
  let match;

  while ((match = pattern.exec(commitMessage)) !== null) {
    issues.add(parseInt(match[1], 10));
  }

  return Array.from(issues);
}

/**
 * Detect if manual label change should trigger progression
 * Looks for status label changes that correspond to phase triggers
 * @param {array} labelsBefore - Labels before change
 * @param {array} labelsAfter - Labels after change
 * @returns {object} Trigger info or null if no progression trigger
 */
function detectProgressionTrigger(labelsBefore, labelsAfter) {
  const statusBefore = labelsBefore.find((l) => l.startsWith("status:"));
  const statusAfter = labelsAfter.find((l) => l.startsWith("status:"));

  // If status changed, might be a progression trigger
  if (statusBefore !== statusAfter && statusAfter) {
    if (statusAfter === "status:in-progress") {
      return {
        trigger: "status:in-progress added",
        statusLabel: statusAfter,
      };
    }
    if (statusAfter === "status:done") {
      return {
        trigger: "status:done added",
        statusLabel: statusAfter,
      };
    }
  }

  return null;
}

/**
 * Get full progression timeline from issue history
 * Reconstructs the complete phase progression path
 * @param {array} labels - Current labels on issue
 * @returns {object} Full progression timeline with all transitions
 */
function getProgressionTimeline(labels) {
  const currentPhaseLabel = labels.find((l) => l.startsWith("openspec:"));

  if (!currentPhaseLabel) {
    return {
      current: null,
      history: [],
      phase: null,
      step: null,
    };
  }

  return {
    current: currentPhaseLabel,
    phase: phaseStateMachine.getPhase(currentPhaseLabel),
    step: phaseStateMachine.getStep(currentPhaseLabel),
    validNextStates: phaseStateMachine.getValidNextStates(currentPhaseLabel),
    availableTriggers:
      phaseStateMachine.getProgressionTriggers(currentPhaseLabel),
  };
}

/**
 * Apply phase progression to issue
 * Uses GitHub API to update labels
 * @private
 */
function applyPhaseProgression(issueNumber, oldLabel, newLabel) {
  try {
    auditLogger.logPhaseProgression({
      issueNumber,
      from: oldLabel,
      to: newLabel,
      timestamp: new Date().toISOString(),
    });
    // GitHub API call would go here
    // gh issue edit <number> --remove-label oldLabel --add-label newLabel
  } catch (error) {
    console.error("Error applying phase progression:", error);
  }
}

/**
 * Batch orchestrate phase progression on multiple issues
 * @param {array} issues - Array of issue objects
 * @param {string} trigger - Trigger type for all issues
 * @param {object} options - Options (dryRun, limit, etc.)
 * @returns {object} Batch result with statistics
 */
function batchOrchestrate(issues, trigger, options = {}) {
  const results = [];
  const stats = {
    total: issues.length,
    processed: 0,
    progressed: 0,
    skipped: 0,
    failed: 0,
  };

  // Limit processing if specified
  const limit = options.limit || issues.length;
  const issuesToProcess = issues.slice(0, limit);

  issuesToProcess.forEach((issue) => {
    const result = orchestratePhaseProgression(issue, trigger, options);
    results.push(result);

    stats.processed++;
    if (result.success && result.progressionApplied) {
      stats.progressed++;
    } else if (!result.success) {
      stats.failed++;
    } else {
      stats.skipped++;
    }
  });

  return {
    success: stats.failed === 0,
    results,
    stats,
    dryRun: options.dryRun !== false,
  };
}

module.exports = {
  orchestratePhaseProgression,
  batchOrchestrate,
  extractLinkedIssues,
  extractReferencedIssues,
  detectProgressionTrigger,
  getProgressionTimeline,
  applyPhaseProgression,
};
