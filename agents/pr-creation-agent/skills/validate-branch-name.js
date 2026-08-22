/**
 * Skill: validate-branch-name
 * Validates branch follows {type}/{scope}-{short-title} format
 *
 * @param {Object} input - Input object
 * @param {string} input.branchName - Branch name to validate
 * @param {Object} input.config - Validation configuration
 * @returns {Object} Validation result with valid flag and errors
 */

const FORBIDDEN_PREFIXES = ["claude", "bot", "automated"];
const ALLOWED_TYPES = [
  "feat",
  "fix",
  "hotfix",
  "release",
  "refactor",
  "chore",
  "docs",
  "test",
  "perf",
  "ci",
  "build",
  "deps",
  "security",
  "revert",
  "research",
  "design",
  "a11y",
  "ux",
  "i18n",
  "ops",
  "proto",
  "ds",
  "api",
  "schema",
  "telemetry",
  "content",
  "seo",
  "config",
  "migrate",
  "qa",
  "uat",
  "audit",
  "codex",
];

export async function validateBranchName(input) {
  const { branchName, config = {} } = input;

  if (!branchName || typeof branchName !== "string") {
    return {
      valid: false,
      errors: ["branch-name-required"],
      type: null,
    };
  }

  const errors = [];

  // Check for forbidden prefixes
  for (const forbidden of FORBIDDEN_PREFIXES) {
    if (branchName.startsWith(forbidden + "/")) {
      errors.push("branch-prefix-forbidden");
      return {
        valid: false,
        errors,
        type: forbidden,
      };
    }
  }

  // Validate format: {type}/{scope}-{short-title}
  // Must have: type/slug where slug contains hyphens
  const match = branchName.match(/^([a-z0-9]+)\/(.+)$/);

  if (!match) {
    errors.push("branch-prefix-missing");
    return {
      valid: false,
      errors,
      type: null,
    };
  }

  const [, type, slug] = match;

  // Check if type is allowed
  if (!ALLOWED_TYPES.includes(type)) {
    errors.push("branch-type-invalid");
    return {
      valid: false,
      errors,
      type,
    };
  }

  // Check slug format (must have at least one hyphen)
  if (!slug.includes("-") || !slug.match(/^[a-z0-9-]+$/)) {
    errors.push("branch-slug-invalid");
    return {
      valid: false,
      errors,
      type,
    };
  }

  return {
    valid: true,
    errors: [],
    type,
  };
}

export default validateBranchName;
