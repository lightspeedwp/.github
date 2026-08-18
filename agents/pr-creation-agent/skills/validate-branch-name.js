/**
 * Skill: validate-branch-name
 * Validates branch follows {type}/{scope}-{short-title} format
 *
 * @param {Object} input - Input object
 * @param {string} input.branchName - Branch name to validate
 * @param {Object} input.config - Validation configuration
 * @returns {Object} Validation result with valid flag and errors
 */
export async function validateBranchName(input) {
  const { branchName, config = {} } = input;

  if (!branchName || typeof branchName !== "string") {
    return {
      valid: false,
      errors: ["Branch name is required and must be a string"],
      branchName: null,
      type: null,
      scope: null,
      shortTitle: null,
    };
  }

  const errors = [];
  const warnings = [];

  // Get allowed types from config
  const allowedTypes = config.allowed_types || getDefaultAllowedTypes();

  // Validate format: {type}/{scope}-{short-title}
  const branchPattern = /^([a-z0-9]+)\/([a-z0-9-]+)-([a-z0-9-]+)$/;
  const match = branchName.match(branchPattern);

  if (!match) {
    errors.push(
      `Branch name does not match required format: {type}/{scope}-{short-title}. ` +
        `Received: "${branchName}". ` +
        `Example: feat/user-auth-api or fix/button-styling`,
    );

    // Provide specific feedback based on what's wrong
    if (!branchName.includes("/")) {
      errors.push(
        `Missing forward slash (/). Format: {type}/{scope}-{short-title}`,
      );
    } else if (!branchName.includes("-")) {
      errors.push(`Missing hyphen (-). Format: {type}/{scope}-{short-title}`);
    }

    // Check for common mistakes
    if (branchName.includes("_")) {
      errors.push(`Branch names use hyphens (-) not underscores (_)`);
    }
    if (branchName.match(/[A-Z]/)) {
      errors.push(`Branch names must be lowercase`);
    }

    return {
      valid: false,
      errors,
      warnings,
      branchName,
      type: null,
      scope: null,
      shortTitle: null,
    };
  }

  const [, type, scope, shortTitle] = match;

  // Validate type is in allowed list
  if (!allowedTypes.includes(type)) {
    errors.push(
      `Branch type "${type}" is not allowed. ` +
        `Allowed types: ${allowedTypes.join(", ")}`,
    );
  }

  // Validate scope length (must be 1-50 chars)
  if (scope.length < 1 || scope.length > 50) {
    errors.push(
      `Scope must be 1-50 characters. ` +
        `Received: "${scope}" (${scope.length} chars)`,
    );
  }

  // Validate short title length (must be 1-50 chars)
  if (shortTitle.length < 1 || shortTitle.length > 50) {
    errors.push(
      `Short title must be 1-50 characters. ` +
        `Received: "${shortTitle}" (${shortTitle.length} chars)`,
    );
  }

  // Warn if scope or title is too long (for readability)
  if (scope.length > 30) {
    warnings.push(
      `Scope is long (${scope.length} chars). Consider shortening for readability`,
    );
  }

  if (shortTitle.length > 30) {
    warnings.push(
      `Short title is long (${shortTitle.length} chars). Consider shortening for readability`,
    );
  }

  // Warn about overly long branch names (should be < 100 total)
  if (branchName.length > 100) {
    warnings.push(
      `Branch name is long (${branchName.length} chars). Prefer under 100 chars`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    branchName,
    type,
    scope,
    shortTitle,
    metadata: {
      format: "valid",
      length: branchName.length,
      partsCount: 3,
    },
  };
}

/**
 * Get default allowed types
 */
function getDefaultAllowedTypes() {
  return [
    "feat",
    "fix",
    "docs",
    "chore",
    "ci",
    "refactor",
    "test",
    "perf",
    "build",
    "deps",
    "security",
    "hotfix",
    "design",
    "a11y",
    "ux",
    "i18n",
    "ops",
  ];
}

export default validateBranchName;
