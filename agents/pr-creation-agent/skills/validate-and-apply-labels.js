/**
 * Skill: validate-and-apply-labels
 * Validates and applies GitHub labels to PRs based on branch type and template context
 *
 * @param {Object} input - Input object
 * @param {string} input.branchType - Branch type from Skill 1 (e.g., "feat", "fix")
 * @param {string} input.templateFile - Template file from Skill 2 (e.g., "pr_feature.md")
 * @param {Object} input.templateMetadata - Template metadata from Skill 2
 * @param {Object} input.prContext - PR context (owner, repo, prNumber)
 * @param {Array} input.config - Optional label configuration
 * @returns {Object} Label validation and application result
 */

export async function validateAndApplyLabels(input) {
  const {
    branchType,
    templateFile,
    templateMetadata,
    _prContext = {},
    _config = {},
  } = input;

  if (!branchType || typeof branchType !== "string") {
    return {
      valid: false,
      error: "Branch type is required and must be a string",
      appliedLabels: [],
      validationErrors: [],
      warnings: [],
    };
  }

  if (!templateFile || typeof templateFile !== "string") {
    return {
      valid: false,
      error: "Template file is required and must be a string",
      branchType,
      appliedLabels: [],
      validationErrors: [],
      warnings: [],
    };
  }

  try {
    // Map branch type to label(s)
    const typeLabels = getBranchTypeLabels(branchType, config);

    // Determine additional context labels
    const contextLabels = extractContextLabels(templateMetadata, config);

    // Combine all labels
    const allLabels = [...new Set([...typeLabels, ...contextLabels])];

    // Validate labels against canonical set
    const validationResult = validateLabels(allLabels, config);

    if (!validationResult.valid) {
      return {
        valid: false,
        error: "Label validation failed",
        branchType,
        templateFile,
        appliedLabels: validationResult.validLabels,
        rejectedLabels: validationResult.invalidLabels,
        validationErrors: validationResult.errors,
        warnings: validationResult.warnings,
      };
    }

    // Return success with labels ready to apply
    return {
      valid: true,
      branchType,
      templateFile,
      appliedLabels: validationResult.validLabels,
      rejectedLabels: validationResult.invalidLabels,
      validationErrors: validationResult.errors,
      warnings: validationResult.warnings,
      metadata: {
        typeLabels,
        contextLabels,
        totalLabels: validationResult.validLabels.length,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: `Error validating labels: ${error.message}`,
      branchType,
      templateFile,
      appliedLabels: [],
      validationErrors: [error.message],
      warnings: [],
    };
  }
}

/**
 * Map branch type to standard labels
 */
function getBranchTypeLabels(branchType, config) {
  const labelMap = config.branchTypeLabels || getDefaultBranchTypeLabels();
  return labelMap[branchType] || [];
}

/**
 * Get default branch type to label mappings
 */
function getDefaultBranchTypeLabels() {
  return {
    feat: ["type:feature"],
    fix: ["type:bug"],
    docs: ["type:documentation"],
    hotfix: ["type:bug", "priority:critical"],
    refactor: ["type:code-refactor"],
    chore: ["type:chore"],
    ci: ["type:build-ci"],
    test: ["type:testing-coverage"],
    security: ["type:security"],
    design: ["type:feature"],
    a11y: ["type:feature", "area:a11y"],
    ux: ["type:feature"],
    release: ["type:release"],
    research: ["type:feature"],
    revert: ["type:chore"],
    i18n: ["type:feature"],
    ops: ["type:chore"],
    perf: ["type:feature"],
    build: ["type:build-ci"],
    deps: ["type:chore"],
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
    audit: ["type:feature"],
  };
}

/**
 * Extract context-based labels from template metadata
 */
function extractContextLabels(templateMetadata, _config) {
  const labels = [];

  if (!templateMetadata) {
    return labels;
  }

  // Add label if template is incomplete (missing required sections)
  if (
    templateMetadata.missingSections &&
    templateMetadata.missingSections.length > 0
  ) {
    labels.push("meta:needs-more-info");
  }

  // Add label if all required sections present
  if (templateMetadata.complete) {
    labels.push("meta:ready-for-review");
  }

  return labels;
}

/**
 * Validate labels against canonical label set
 */
function validateLabels(labels, config) {
  const validLabels = [];
  const invalidLabels = [];
  const errors = [];
  const warnings = [];

  // Get canonical labels from config or defaults
  const canonicalLabels = config.canonicalLabels || getDefaultCanonicalLabels();

  for (const label of labels) {
    if (canonicalLabels.includes(label)) {
      validLabels.push(label);
    } else {
      invalidLabels.push(label);
      errors.push(
        `Label "${label}" not found in canonical label set. Available labels: ${canonicalLabels.join(", ")}`,
      );
    }
  }

  // Check for commonly used but invalid label patterns
  for (const label of invalidLabels) {
    if (label.match(/^(bug|feature|urgent|help|critical)$/)) {
      warnings.push(
        `Label "${label}" looks like a bare type label. Use prefixed format: type:${label}`,
      );
    }
  }

  return {
    valid: invalidLabels.length === 0,
    validLabels,
    invalidLabels,
    errors: errors.length > 0 ? errors : [],
    warnings: warnings.length > 0 ? warnings : [],
  };
}

/**
 * Get default canonical label set
 */
function getDefaultCanonicalLabels() {
  return [
    // Type labels
    "type:bug",
    "type:feature",
    "type:task",
    "type:documentation",
    "type:code-refactor",
    "type:build-ci",
    "type:testing-coverage",
    "type:security",
    "type:release",
    "type:chore",

    // Status labels
    "status:needs-triage",
    "status:in-progress",
    "status:blocked",
    "status:done",
    "status:on-hold",

    // Priority labels
    "priority:critical",
    "priority:important",
    "priority:normal",
    "priority:low",

    // Area labels
    "area:ci",
    "area:docs",
    "area:security",
    "area:labels",
    "area:a11y",
    "area:performance",

    // Meta labels
    "meta:needs-more-info",
    "meta:ready-for-review",
    "meta:needs-changelog",
    "meta:has-pr",
    "meta:stale",
    "meta:no-changelog",

    // WordPress-specific
    "wp:plugin",
    "wp:theme",
    "wp:block-plugin",
    "wp:block-theme",
  ];
}

export default validateAndApplyLabels;
