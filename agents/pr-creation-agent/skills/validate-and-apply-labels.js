/**
 * Skill: validate-and-apply-labels
 * Validates GitHub labels against canonical set and maps branch types to labels
 *
 * @param {Object} input - Input object
 * @param {Array<string>} input.labels - Labels to validate (e.g., ["type:feature", "area:agents"])
 * @param {string} input.branchType - Branch type for conditional labels (optional)
 * @param {string} input.templateFile - PR template file (optional)
 * @param {Object} input.config - Configuration object (optional)
 * @param {Object} input.mockGitHub - Mock GitHub API for testing (optional)
 * @returns {Object} Validation result with valid flag and applied labels
 */

const CANONICAL_LABELS = {
  "type:feature": 2,
  "type:bug": 2,
  "type:task": 2,
  "type:docs": 2,
  "type:documentation": 2,
  "type:chore": 2,
  "type:refactor": 2,
  "type:test": 2,
  "type:testing-coverage": 2,
  "type:build-ci": 2,
  "status:needs-triage": 3,
  "status:in-progress": 3,
  "status:done": 3,
  "priority:critical": 1,
  "priority:important": 1,
  "priority:normal": 1,
  "area:agents": 2,
  "area:ci": 2,
  "area:docs": 2,
  "area:security": 2,
  "area:a11y": 2,
  "meta:needs-more-info": 3,
  "meta:ready-for-review": 3,
};

// Default branch type to label mapping (30+ branch types)
const BRANCH_TYPE_LABELS = {
  feat: ["type:feature"],
  fix: ["type:bug"],
  docs: ["type:documentation"],
  hotfix: ["type:bug", "priority:critical"],
  security: ["area:security", "type:bug"],
  chore: ["type:chore"],
  test: ["type:testing-coverage"],
  refactor: ["type:refactor"],
  ci: ["type:build-ci"],
  build: ["type:build-ci"],
  deps: ["type:chore"],
  perf: ["type:feature"],
  release: ["type:feature"],
  research: ["type:feature"],
  revert: ["type:chore"],
  design: ["type:feature"],
  a11y: ["type:feature", "area:a11y"],
  ux: ["type:feature"],
  i18n: ["type:feature"],
  ops: ["type:chore"],
  proto: ["type:feature"],
  ds: ["type:feature"],
  api: ["type:feature"],
  schema: ["type:feature"],
  telemetry: ["type:feature"],
  content: ["type:documentation"],
  seo: ["type:documentation"],
  config: ["type:chore"],
  migrate: ["type:chore"],
  qa: ["type:chore"],
  uat: ["type:chore"],
  audit: ["type:chore"],
  codex: ["type:documentation"],
};

// Mutually exclusive label families
const EXCLUSIVE_FAMILIES = {
  type: [
    "type:feature",
    "type:bug",
    "type:task",
    "type:docs",
    "type:documentation",
    "type:chore",
    "type:refactor",
    "type:test",
    "type:testing-coverage",
    "type:build-ci",
  ],
  status: ["status:needs-triage", "status:in-progress", "status:done"],
  priority: ["priority:critical", "priority:important", "priority:normal"],
  meta: ["meta:needs-more-info", "meta:ready-for-review"],
};

export async function validateAndApplyLabels(input) {
  const {
    labels = [],
    branchType,
    templateFile,
    templateMetadata = null,
    config = {},
  } = input;

  // Handle branchType-based label mapping (if either branchType or templateFile is explicitly provided)
  if ("branchType" in input || "templateFile" in input) {
    // Validate branchType
    if (!branchType || typeof branchType !== "string") {
      return {
        valid: false,
        error: "Branch type is required and must be a string",
        appliedLabels: [],
        branchType: branchType,
        validationErrors: [],
        warnings: [],
      };
    }

    // Validate templateFile
    if (!templateFile || typeof templateFile !== "string") {
      return {
        valid: false,
        error: "Template file is required and must be a string",
        appliedLabels: [],
        branchType,
        validationErrors: [],
        warnings: [],
      };
    }

    // Map branch type to labels
    const customBranchLabels = config.branchTypeLabels || BRANCH_TYPE_LABELS;
    let mappedLabels = customBranchLabels[branchType] || [];

    // Make a copy to avoid mutation
    mappedLabels = [...mappedLabels];

    // Add template metadata labels
    if (
      templateMetadata &&
      templateMetadata.missingSections &&
      templateMetadata.missingSections.length > 0
    ) {
      mappedLabels.push("meta:needs-more-info");
    } else if (templateMetadata && templateMetadata.complete === true) {
      mappedLabels.push("meta:ready-for-review");
    }

    // Deduplicate labels
    const seenLabels = new Set();
    const deduplicatedLabels = [];
    for (const label of mappedLabels) {
      if (!seenLabels.has(label)) {
        deduplicatedLabels.push(label);
        seenLabels.add(label);
      }
    }

    // Validate labels against canonical set
    const validationErrors = [];
    const warnings = [];
    const customCanonicalLabels = config.canonicalLabels;

    for (const label of deduplicatedLabels) {
      // Check for bare labels (missing prefix)
      if (!label.includes(":")) {
        warnings.push(
          `Label "${label}" looks like a bare type label and should have a prefix (e.g., "type:${label}")`,
        );
      }

      // Validate against custom or default canonical set
      if (customCanonicalLabels) {
        if (!customCanonicalLabels.includes(label)) {
          validationErrors.push(
            `Label "${label}" not found in canonical label set`,
          );
        }
      } else {
        if (
          !CANONICAL_LABELS[label] &&
          !label.match(/^(type|status|priority|area|meta|wp):[a-z0-9-]+$/)
        ) {
          validationErrors.push(
            `Label "${label}" not found in canonical label set`,
          );
        }
      }
    }

    const isValid = validationErrors.length === 0 && mappedLabels.length > 0;

    // Separate context labels from type labels
    const typeLabels = deduplicatedLabels.filter((l) => l.startsWith("type:"));
    const contextLabels = deduplicatedLabels.filter(
      (l) => !l.startsWith("type:"),
    );

    return {
      valid: isValid,
      appliedLabels: deduplicatedLabels,
      branchType,
      templateFile,
      validationErrors,
      warnings,
      deduplicatedCount: mappedLabels.length - deduplicatedLabels.length,
      metadata: {
        typeLabels,
        contextLabels,
        totalLabels: deduplicatedLabels.length,
      },
    };
  }

  // If no labels provided, that's valid (no labels required)
  if (!labels || labels.length === 0) {
    return {
      valid: true,
      appliedLabels: [],
      errors: [],
      deduplicatedCount: 0,
      validationErrors: [],
      warnings: [],
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

    // Check if label is canonical or has valid prefix format
    let isValid = false;
    if (CANONICAL_LABELS[label]) {
      isValid = true;
    } else if (label.match(/^[a-z]+:[a-z0-9-]+$/)) {
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
    validationErrors: errors.length > 0 ? errors : [],
    warnings: [],
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
