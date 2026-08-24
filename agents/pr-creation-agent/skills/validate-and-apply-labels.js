/**
 * Skill: validate-and-apply-labels
 * Validates GitHub labels against canonical set
 *
 * @param {Object} input - Input object
 * @param {Array<string>} input.labels - Labels to validate (e.g., ["type:feature", "area:agents"])
 * @param {string} input.branchType - Branch type for conditional labels (optional)
 * @param {Object} input.config - Configuration object (optional)
 * @param {Object} input.mockGitHub - Mock GitHub API for testing (optional)
 * @returns {Object} Validation result with valid flag and applied labels
 */

// Canonical labels from .github/labels.yml (source of truth)
const CANONICAL_LABELS = {
  "type:feature": 2,
  "type:bug": 2,
  "type:task": 2,
  "type:documentation": 2,
  "type:chore": 2,
  "type:refactor": 2,
  "type:test": 2,
  "status:needs-triage": 3,
  "status:in-progress": 3,
  "status:ready": 3,
  "priority:critical": 1,
  "priority:important": 1,
  "priority:normal": 1,
  "area:ci": 2,
  "area:documentation": 2,
  "area:security": 2,
  "area:ai": 2,
};

// Mutually exclusive label families
const EXCLUSIVE_FAMILIES = {
  type: [
    "type:feature",
    "type:bug",
    "type:task",
    "type:documentation",
    "type:chore",
    "type:refactor",
    "type:test",
  ],
  status: ["status:needs-triage", "status:in-progress", "status:ready"],
  priority: ["priority:critical", "priority:important", "priority:normal"],
};

export async function validateAndApplyLabels(input) {
  const { labels = [] } = input;

  // If no labels provided, that's valid (no labels required)
  if (!labels || labels.length === 0) {
    return {
      valid: true,
      appliedLabels: [],
      errors: [],
      deduplicatedCount: 0,
    };
  }

  // Validate each label
  const validLabels = [];
  const invalidLabels = [];
  const errors = [];
  const conflicts = [];
  const seenLabels = new Set();
  let deduplicatedCount = 0;

  for (const label of labels) {
    if (!label || typeof label !== "string") {
      errors.push("invalid-label-format");
      invalidLabels.push(label);
      continue;
    }

    // Check if already seen (deduplication)
    if (seenLabels.has(label)) {
      deduplicatedCount++;
      continue;
    }

    // Check if label is in canonical set (using own property check to prevent prototype pollution)
    let isValid = false;
    if (Object.prototype.hasOwnProperty.call(CANONICAL_LABELS, label)) {
      isValid = true;
    }

    if (!isValid) {
      errors.push("non-canonical-label");
      invalidLabels.push(label);
      continue;
    }

    validLabels.push(label);
    seenLabels.add(label);
  }

  // Check for conflicting labels
  for (const [family, familyLabels] of Object.entries(EXCLUSIVE_FAMILIES)) {
    const appliedInFamily = validLabels.filter((l) => familyLabels.includes(l));
    if (appliedInFamily.length > 1) {
      conflicts.push({
        family,
        labels: appliedInFamily,
      });
    }
  }

  // Sort labels by priority (lower priority number = higher priority)
  validLabels.sort((a, b) => {
    const priorityA = CANONICAL_LABELS[a] || 99;
    const priorityB = CANONICAL_LABELS[b] || 99;
    return priorityA - priorityB;
  });

  const result = {
    valid: errors.length === 0 && conflicts.length === 0,
    appliedLabels: validLabels,
    errors: errors.length > 0 ? errors : undefined,
    deduplicatedCount,
  };

  // Add optional properties
  if (invalidLabels.length > 0) {
    result.invalidLabels = invalidLabels;
  }

  if (conflicts.length > 0) {
    result.conflicts = conflicts;
  }

  return result;
}

export default validateAndApplyLabels;
