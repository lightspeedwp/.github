#!/usr/bin/env node

/**
 * Branch Name Validation Library
 * Validates Git branch names against LightSpeed organization standards
 * Pattern: {type}/{scope}-{title}
 * Types: 24 authorized branch types (feat, fix, hotfix, etc.)
 * Forbidden prefixes: claude/, copilot/, openai/
 */

const AUTHORIZED_TYPES = [
  "feat",
  "fix",
  "hotfix",
  "release",
  "refactor",
  "chore",
  "task",
  "docs",
  "test",
  "perf",
  "ci",
  "build",
  "deps",
  "security",
  "design",
  "a11y",
  "ux",
  "i18n",
  "ops",
  "proto",
  "ds",
  "audit",
  "codex",
  "revert",
  "research",
];

const FORBIDDEN_PREFIXES = ["claude/", "copilot/", "openai/"];

// Pattern for extracting type, scope, title (must be exact case - lowercase)
const PARSE_PATTERN =
  /^([a-z0-9]+)\/([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/**
 * Levenshtein distance for fuzzy string matching
 * Used to suggest closest valid type when user enters invalid type
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }
  return matrix[len1][len2];
}

/**
 * Find the closest valid type to an invalid type
 */
function findSuggestedType(invalidType) {
  const distances = AUTHORIZED_TYPES.map((type) => ({
    type,
    distance: levenshteinDistance(invalidType.toLowerCase(), type),
  }));
  const closest = distances.sort((a, b) => a.distance - b.distance)[0];
  return closest.distance <= 2 ? closest.type : null;
}

/**
 * Parse branch name into components
 */
function parseBranchName(branchName) {
  const match = branchName.match(PARSE_PATTERN);
  if (!match) return null;

  return {
    type: match[1],
    scope: match[2],
    title: match[3],
  };
}

/**
 * Validate scope or title format
 */
function validateScopeOrTitle(value) {
  // Must not be empty
  if (!value || value.length === 0) {
    return { valid: false, error: "empty" };
  }

  // Must be lowercase
  if (value !== value.toLowerCase()) {
    return { valid: false, error: "not_lowercase" };
  }

  // Must contain only lowercase letters, numbers, and hyphens
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(value)) {
    // Check specific issues
    if (/_/.test(value)) {
      return { valid: false, error: "contains_underscores" };
    }
    if (/--/.test(value)) {
      return { valid: false, error: "consecutive_hyphens" };
    }
    if (/[^a-z0-9-]/.test(value)) {
      return { valid: false, error: "invalid_characters" };
    }
    return { valid: false, error: "invalid_format" };
  }

  return { valid: true };
}

/**
 * Main validation function
 * Returns: { valid, type, scope, title, errors, suggested_name }
 */
function validateBranchName(branchName) {
  const result = {
    valid: false,
    type: null,
    scope: null,
    title: null,
    errors: [],
    suggested_name: null,
  };

  if (!branchName || typeof branchName !== "string") {
    result.errors.push("empty_branch_name");
    return result;
  }

  const trimmed = branchName.trim();

  // Check forbidden prefixes FIRST (highest priority)
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (trimmed.startsWith(prefix)) {
      result.errors.push("forbidden_prefix");
      // Try to extract scope-title for suggestion
      const rest = trimmed.substring(prefix.length);
      const parts = rest.split("-");
      if (parts.length >= 2) {
        result.suggested_name = `feat/${rest}`;
      } else {
        result.suggested_name = "feat/example-branch";
      }
      return result;
    }
  }

  // Check if branch name contains uppercase letters
  if (trimmed !== trimmed.toLowerCase()) {
    result.errors.push("contains_uppercase");
    result.suggested_name = trimmed.toLowerCase();
    return result;
  }

  // Parse into components
  const parsed = parseBranchName(trimmed);

  if (!parsed) {
    // Pattern doesn't match - could be several issues
    // Try to determine which parts are wrong
    const slashIndex = trimmed.indexOf("/");

    if (slashIndex === -1) {
      // No slash separator
      result.errors.push("malformed_pattern");
      result.suggested_name = "feat/scope-title";
      return result;
    }

    const potentialType = trimmed.substring(0, slashIndex);
    const potentialRest = trimmed.substring(slashIndex + 1);

    // Check if type is valid
    if (!AUTHORIZED_TYPES.includes(potentialType)) {
      result.errors.push("invalid_type");
      const suggested = findSuggestedType(potentialType);
      if (suggested) {
        result.suggested_name = `${suggested}/${potentialRest}`;
      } else {
        result.suggested_name = `feat/${potentialRest}`;
      }
      return result;
    }

    // Type is valid but scope-title part is malformed
    if (potentialRest.length === 0) {
      result.errors.push("empty_scope_and_title");
      result.suggested_name = `${potentialType}/scope-title`;
      return result;
    }

    // Check for hyphen separator between scope and title
    const hyphenIndex = potentialRest.indexOf("-");
    if (
      hyphenIndex === -1 ||
      hyphenIndex === 0 ||
      hyphenIndex === potentialRest.length - 1
    ) {
      result.errors.push("malformed_scope_title");
      result.suggested_name = `${potentialType}/scope-title`;
      return result;
    }

    const scope = potentialRest.substring(0, hyphenIndex);
    const title = potentialRest.substring(hyphenIndex + 1);

    // Validate scope and title separately
    const scopeValidation = validateScopeOrTitle(scope, "scope");
    const titleValidation = validateScopeOrTitle(title, "title");

    if (!scopeValidation.valid) {
      result.errors.push(`malformed_scope_${scopeValidation.error}`);
      result.suggested_name = `${potentialType}/example-${title}`;
      return result;
    }

    if (!titleValidation.valid) {
      result.errors.push(`malformed_title_${titleValidation.error}`);
      result.suggested_name = `${potentialType}/${scope}-example`;
      return result;
    }

    // If we get here, something else is wrong
    result.errors.push("malformed_pattern");
    result.suggested_name = `${potentialType}/${scope}-${title}`;
    return result;
  }

  // Successfully parsed - validate each component
  const { type, scope, title } = parsed;

  // Validate type
  if (!AUTHORIZED_TYPES.includes(type)) {
    result.errors.push("invalid_type");
    const suggested = findSuggestedType(type);
    result.suggested_name = `${suggested || "feat"}/${scope}-${title}`;
    return result;
  }

  // Validate scope
  const scopeValidation = validateScopeOrTitle(scope, "scope");
  if (!scopeValidation.valid) {
    result.errors.push(`malformed_scope_${scopeValidation.error}`);
    result.suggested_name = `${type}/example-${title}`;
    return result;
  }

  // Validate title
  const titleValidation = validateScopeOrTitle(title, "title");
  if (!titleValidation.valid) {
    result.errors.push(`malformed_title_${titleValidation.error}`);
    result.suggested_name = `${type}/${scope}-example`;
    return result;
  }

  // All validations passed
  result.valid = true;
  result.type = type;
  result.scope = scope;
  result.title = title;
  result.errors = [];
  result.suggested_name = null;

  return result;
}

/**
 * Generate human-readable error message
 */
function formatErrorMessage(branchName, validationResult) {
  const { errors, suggested_name } = validationResult;

  if (errors.length === 0) {
    return `✅ Branch '${branchName}' is valid`;
  }

  const mainError = errors[0];
  const invalidType = branchName.split("/")[0];
  const prefix = FORBIDDEN_PREFIXES.find((p) => branchName.startsWith(p));
  // eslint-disable-next-line no-useless-assignment
  let message = "";

  switch (mainError) {
    case "empty_branch_name":
      message = "❌ Branch name cannot be empty";
      break;

    case "forbidden_prefix":
      message = `❌ Forbidden prefix '${prefix}'.\n\nThe prefix '${prefix}' is reserved for system internal use.\n\nUse the pattern: {type}/{scope}-{title}\nExample: feat/user-auth-improvements`;
      break;

    case "invalid_type":
      message = `❌ Invalid type '${invalidType}'. Not recognized.\n\nAllowed types (24):\n  feat fix hotfix release refactor chore task docs test perf\n  ci build deps security design a11y ux i18n ops proto ds\n  audit codex revert research\n\nExample: feat/user-auth-improvements`;
      break;

    case "malformed_pattern":
    case "malformed_scope_title":
    case "empty_scope_and_title":
      message = `❌ Branch name does not match pattern {type}/{scope}-{title}.\n\nRules:\n  - Start with one of 24 types\n  - Follow with a forward slash (/)\n  - Then scope-title (lowercase, hyphens only)\n\nExample: feat/user-auth-improvements`;
      break;

    case "contains_uppercase":
      message = `❌ Branch name must be lowercase.\n\nThe branch name contains uppercase letters, which are not allowed.\n\nRules:\n  - Use only lowercase letters (a-z), numbers (0-9), and hyphens (-)\n  - Pattern: {type}/{scope}-{title}\n\nExample: feat/user-auth-improvements`;
      break;

    case "malformed_scope_empty":
    case "malformed_scope_not_lowercase":
    case "malformed_scope_contains_underscores":
    case "malformed_scope_consecutive_hyphens":
    case "malformed_scope_invalid_characters":
    case "malformed_scope_invalid_format":
      message = `❌ Scope contains invalid characters or format issues.\n\nScope must:\n  - Use only lowercase letters (a-z), numbers (0-9), and hyphens (-)\n  - Start and end with a letter or number\n  - Not contain consecutive hyphens\n\nInvalid: user_auth, User-Auth, user--auth\nValid: user-auth, api-v2-response`;
      break;

    case "malformed_title_empty":
    case "malformed_title_not_lowercase":
    case "malformed_title_contains_underscores":
    case "malformed_title_consecutive_hyphens":
    case "malformed_title_invalid_characters":
    case "malformed_title_invalid_format":
      message = `❌ Title contains invalid characters or format issues.\n\nTitle must:\n  - Use only lowercase letters (a-z), numbers (0-9), and hyphens (-)\n  - Start and end with a letter or number\n  - Not contain consecutive hyphens\n\nInvalid: bug_fix, Bug-Fix, auth--handler\nValid: auth-fix, response-routing`;
      break;

    default:
      message = `❌ Branch name validation failed.`;
  }

  if (suggested_name) {
    message += `\n\nDid you mean: ${suggested_name}?`;
  }

  return message;
}

// Export for use as library (ES modules)
export {
  validateBranchName,
  formatErrorMessage,
  AUTHORIZED_TYPES,
  FORBIDDEN_PREFIXES,
};
