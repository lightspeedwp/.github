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

const DEFAULT_ALLOWED_TYPES = ALLOWED_TYPES;
const MAX_LENGTH = 50;
const WARN_LENGTH = 30;

export async function validateBranchName(input) {
  const { branchName, config } = input;
  const allowedTypes = config?.allowed_types ?? DEFAULT_ALLOWED_TYPES;

  if (branchName === "" || branchName === null || branchName === undefined) {
    return {
      valid: false,
      errors: ["Branch name is required"],
      type: null,
    };
  }

  if (typeof branchName !== "string") {
    return {
      valid: false,
      errors: ["Branch name must be a string"],
      type: null,
    };
  }

  const errors = [];
  const warnings = [];

  for (const forbidden of FORBIDDEN_PREFIXES) {
    if (branchName.startsWith(forbidden + "/")) {
      return {
        valid: false,
        errors: [
          `Branch prefix "${forbidden}" is forbidden`,
          "branch-prefix-forbidden",
        ],
        type: forbidden,
      };
    }
  }

  // Format: {type}/{scope}-{short-title}, lowercase letters/digits/hyphens,
  // plus dots (needed for version-style slugs like "release/v1.0.0").
  const match = branchName.match(/^([a-z0-9-]+)\/([a-z0-9.-]+)$/);

  if (!match) {
    if (!branchName.includes("/")) {
      errors.push(
        "Branch name does not match required format: missing forward slash separating type from scope/title",
        "branch-prefix-missing",
      );
    } else if (/[A-Z]/.test(branchName)) {
      errors.push(
        "Branch name does not match required format: must be lowercase",
        "branch-slug-invalid",
      );
    } else if ((branchName.match(/\//g) || []).length > 1) {
      errors.push(
        "Branch name does not match required format: only one forward slash is allowed, separating type from {scope}-{short-title}",
        "branch-slug-invalid",
      );
    } else {
      errors.push(
        "Branch name does not match required format: use only lowercase letters, digits, hyphens and dots",
        "branch-slug-invalid",
      );
    }
    return {
      valid: false,
      errors,
      type: null,
    };
  }

  const [, type, slug] = match;

  // Reject a malformed type segment (leading/trailing/doubled hyphen, e.g.
  // "-feat" or "fe--at") as a format error before checking it against the
  // allowlist -- every real entry in ALLOWED_TYPES is hyphen-free, so a
  // malformed type would always fail that check too, but with the
  // misleading "type not allowed" message rather than naming the actual
  // problem.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(type)) {
    return {
      valid: false,
      errors: [
        `Branch type "${type}" is not a valid format: must not start or end with a hyphen or contain empty segments`,
        "branch-slug-invalid",
      ],
      type,
    };
  }

  if (!allowedTypes.includes(type)) {
    return {
      valid: false,
      errors: [
        `Branch type "${type}" is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
        "branch-type-invalid",
      ],
      type,
    };
  }

  // Release branches name a bare version (e.g. "release/v1.0.0"), which
  // has no {scope}-{short-title} split at all -- documented as the
  // canonical release branch format, so it's accepted as a version-only
  // slug rather than forced through the general two-part convention.
  const isReleaseVersionSlug =
    type === "release" && !slug.includes("-") && /^v?\d+(?:\.\d+)*$/.test(slug);

  if (isReleaseVersionSlug) {
    return {
      valid: true,
      errors: [],
      warnings,
      branchName,
      type,
      scope: slug,
      shortTitle: null,
      metadata: {
        format: "valid",
        length: branchName.length,
        partsCount: 2,
      },
    };
  }

  if (!slug.includes("-")) {
    errors.push(
      "Missing hyphen separating scope from short title (expected {scope}-{short-title})",
      "branch-slug-invalid",
    );
    return {
      valid: false,
      errors,
      type,
    };
  }

  const hyphenIndex = slug.indexOf("-");
  const scope = slug.slice(0, hyphenIndex);
  const shortTitle = slug.slice(hyphenIndex + 1);

  // A valid segment is lowercase/digit runs joined by single hyphens --
  // no leading/trailing hyphen and no doubled hyphen (which would mean an
  // empty component, e.g. "a--b" -> scope "a", title "-b").
  const segmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!scope) {
    errors.push("Scope must not be empty");
  } else if (!segmentPattern.test(scope)) {
    errors.push(
      "Scope must not start or end with a hyphen or contain empty segments",
    );
  } else if (scope.length > MAX_LENGTH) {
    errors.push(`Scope must be ${MAX_LENGTH} characters or fewer`);
  } else if (scope.length > WARN_LENGTH) {
    warnings.push(
      `Scope is long (${scope.length} chars); consider shortening it`,
    );
  }

  if (!shortTitle) {
    errors.push("Short title must not be empty");
  } else if (!segmentPattern.test(shortTitle)) {
    errors.push(
      "Short title must not start or end with a hyphen or contain empty segments",
    );
  } else if (shortTitle.length > MAX_LENGTH) {
    errors.push(`Short title must be ${MAX_LENGTH} characters or fewer`);
  } else if (shortTitle.length > WARN_LENGTH) {
    warnings.push(
      `Short title is long (${shortTitle.length} chars); consider shortening it`,
    );
  }

  if (branchName.length > 150) {
    errors.push("Branch name must be 150 characters or fewer", "name-too-long");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      type,
    };
  }

  if (branchName.length > WARN_LENGTH * 2) {
    warnings.push(
      `Branch name is long (${branchName.length} chars); consider shortening it`,
    );
  }

  return {
    valid: true,
    errors: [],
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

export default validateBranchName;
