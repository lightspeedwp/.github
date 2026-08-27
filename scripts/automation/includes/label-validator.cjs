/**
 * Label Validator
 * Validates label combinations and detects conflicts
 */

const phaseStateMachine = require("./phase-state-machine.cjs");

/**
 * Mutually exclusive label groups
 * Only one label per group can be applied
 */
const MUTEX_GROUPS = {
  specification_phase: [
    "openspec:specification-pending",
    "openspec:specification-in-progress",
    "openspec:specification-complete",
  ],
  implementation_phase: [
    "openspec:implementation-pending",
    "openspec:implementation-in-progress",
    "openspec:implementation-complete",
  ],
  status: [
    "status:needs-planning",
    "status:needs-triage",
    "status:ready",
    "status:in-progress",
    "status:on-hold",
    "status:blocked",
    "status:done",
  ],
};

/**
 * Label requirements based on other labels
 * If a label is present, these other labels should also be present
 */
const LABEL_REQUIREMENTS = {
  "openspec:specification-in-progress": [
    "type:task",
    "type:feature",
    "type:epic",
  ],
  "openspec:specification-complete": ["type:task", "type:feature", "type:epic"],
  "openspec:implementation-pending": ["type:task", "type:feature", "type:epic"],
  "openspec:implementation-in-progress": [
    "type:task",
    "type:feature",
    "type:epic",
  ],
  "openspec:implementation-complete": [
    "type:task",
    "type:feature",
    "type:epic",
  ],
};

/**
 * Recommended label combinations
 */
const RECOMMENDED_COMBINATIONS = {
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
  "openspec:implementation-in-progress": ["status:in-progress", "meta:has-pr"],
  "openspec:implementation-complete": ["status:done"],
};

/**
 * Validate label combination
 * Returns validation result with any conflicts or warnings
 * @param {array} labels - Array of label names
 * @returns {object} Validation result
 */
function validateLabels(labels) {
  const result = {
    valid: true,
    conflicts: [],
    warnings: [],
    suggestions: [],
  };

  if (!Array.isArray(labels)) {
    result.valid = false;
    result.conflicts.push("Labels must be an array");
    return result;
  }

  // Check for mutex violations
  Object.entries(MUTEX_GROUPS).forEach(([groupName, groupLabels]) => {
    const presentLabels = labels.filter((l) => groupLabels.includes(l));
    if (presentLabels.length > 1) {
      result.valid = false;
      result.conflicts.push(
        `Multiple labels from ${groupName}: ${presentLabels.join(", ")}`,
      );
    }
  });

  // Check for missing requirements
  labels.forEach((label) => {
    const requirements = LABEL_REQUIREMENTS[label];
    if (requirements) {
      const hasMissing =
        requirements.length > 0 &&
        !requirements.some((req) => labels.includes(req));

      if (hasMissing) {
        result.warnings.push(
          `Label "${label}" requires one of: ${requirements.join(", ")}`,
        );
      }
    }
  });

  // Suggest additional labels
  labels.forEach((label) => {
    const recommended = RECOMMENDED_COMBINATIONS[label];
    if (recommended) {
      const missing = recommended.filter((l) => !labels.includes(l));
      if (missing.length > 0) {
        result.suggestions.push(
          `For "${label}", consider adding: ${missing.join(", ")}`,
        );
      }
    }
  });

  // Additional check: cannot have both specification and implementation labels
  const hasSpecification = labels.some(
    (l) => l && l.startsWith("openspec:specification"),
  );
  const hasImplementation = labels.some(
    (l) => l && l.startsWith("openspec:implementation"),
  );

  if (hasSpecification && hasImplementation) {
    result.valid = false;
    result.conflicts.push(
      "Cannot have both specification and implementation OpenSpec labels simultaneously",
    );
  }

  return result;
}

/**
 * Get mutex violations for a label set
 * @param {array} labels - Array of label names
 * @returns {array} Array of conflict objects
 */
function getMutexViolations(labels) {
  const violations = [];

  Object.entries(MUTEX_GROUPS).forEach(([groupName, groupLabels]) => {
    const presentLabels = labels.filter((l) => groupLabels.includes(l));
    if (presentLabels.length > 1) {
      violations.push({
        group: groupName,
        labels: presentLabels,
        message: `Cannot have multiple labels from ${groupName}: ${presentLabels.join(", ")}`,
      });
    }
  });

  return violations;
}

/**
 * Check if an OpenSpec label is in a label set
 * @param {array} labels - Array of label names
 * @returns {string|null} OpenSpec label or null
 */
function getOpenSpecLabel(labels) {
  const specLabels = [
    ...MUTEX_GROUPS.specification_phase,
    ...MUTEX_GROUPS.implementation_phase,
  ];

  return labels.find((l) => specLabels.includes(l)) || null;
}

/**
 * Check if a type label exists
 * @param {array} labels - Array of label names
 * @returns {string|null} Type label or null
 */
function getTypeLabel(labels) {
  return labels.find((l) => l && l.startsWith("type:")) || null;
}

/**
 * Get all status labels
 * @param {array} labels - Array of label names
 * @returns {array} Status labels
 */
function getStatusLabels(labels) {
  return labels.filter((l) => l && l.startsWith("status:"));
}

/**
 * Get all priority labels
 * @param {array} labels - Array of label names
 * @returns {array} Priority labels
 */
function getPriorityLabels(labels) {
  return labels.filter((l) => l && l.startsWith("priority:"));
}

/**
 * Get all area labels
 * @param {array} labels - Array of label names
 * @returns {array} Area labels
 */
function getAreaLabels(labels) {
  return labels.filter((l) => l && l.startsWith("area:"));
}

/**
 * Check if a label transition is allowed
 * @param {array} currentLabels - Current set of labels
 * @param {array} newLabels - Desired new set of labels
 * @returns {object} Validation result
 */
function validateTransition(currentLabels, newLabels) {
  const result = {
    valid: true,
    added: [],
    removed: [],
    conflicts: [],
    warnings: [],
  };

  // Find added and removed labels
  result.added = newLabels.filter((l) => !currentLabels.includes(l));
  result.removed = currentLabels.filter((l) => !newLabels.includes(l));

  // Validate new label set
  const validation = validateLabels(newLabels);
  result.conflicts = validation.conflicts;
  result.warnings = validation.warnings;
  result.valid = validation.valid;

  // Check if OpenSpec label is changing (not allowed without valid transition)
  const currentOpenSpec = getOpenSpecLabel(currentLabels);
  const newOpenSpec = getOpenSpecLabel(newLabels);

  if (currentOpenSpec && newOpenSpec && currentOpenSpec !== newOpenSpec) {
    if (!phaseStateMachine.isValidTransition(currentOpenSpec, newOpenSpec)) {
      result.valid = false;
      result.conflicts.push(
        `Invalid OpenSpec transition: ${currentOpenSpec} → ${newOpenSpec}`,
      );
    }
  }

  return result;
}

module.exports = {
  MUTEX_GROUPS,
  LABEL_REQUIREMENTS,
  RECOMMENDED_COMBINATIONS,
  validateLabels,
  getMutexViolations,
  getOpenSpecLabel,
  getTypeLabel,
  getStatusLabels,
  getPriorityLabels,
  getAreaLabels,
  validateTransition,
};
