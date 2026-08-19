/**
 * Skill: orchestrate-pr-creation
 * Orchestrates PR creation by combining outputs from Skills 1-3
 *
 * Accepts inputs from prior skills and builds complete PR object:
 * - Skill 1: branchType (e.g., "feat", "fix")
 * - Skill 2: templateFile, templateMetadata
 * - Skill 3: appliedLabels
 *
 * @param {Object} input - Input object
 * @param {string} input.branchName - Full branch name (e.g., "feat/user-auth-system")
 * @param {string} input.branchType - Branch type from Skill 1 (e.g., "feat")
 * @param {string} input.templateFile - Template file from Skill 2 (e.g., "pr_feature.md")
 * @param {Object} input.templateMetadata - Template metadata from Skill 2
 * @param {Array} input.appliedLabels - Applied labels from Skill 3
 * @param {string} input.templateContent - Template content (optional, for body construction)
 * @param {Object} input.prContext - PR context (owner, repo, base branch)
 * @returns {Object} Orchestrated PR object ready for submission
 */

export async function orchestratePrCreation(input) {
  const {
    branchName,
    branchType,
    templateFile,
    templateMetadata,
    appliedLabels = [],
    templateContent = "",
    prContext = {},
  } = input;

  // Validate required inputs
  if (!branchName || typeof branchName !== "string") {
    return {
      valid: false,
      error: "Branch name is required and must be a string",
      pr: null,
    };
  }

  if (!branchType || typeof branchType !== "string") {
    return {
      valid: false,
      error: "Branch type is required and must be a string",
      pr: null,
    };
  }

  if (!templateFile || typeof templateFile !== "string") {
    return {
      valid: false,
      error: "Template file is required and must be a string",
      pr: null,
    };
  }

  try {
    // Extract scope from branch name (between first / and first -)
    const scope = extractScope(branchName);

    // Build PR title from branch type and scope
    const title = buildPrTitle(branchType, scope);

    // Build PR body from template content and metadata
    const body = buildPrBody(
      templateContent,
      templateMetadata,
      branchType,
      appliedLabels,
    );

    // Validate PR readiness
    const readinessValidation = validatePrReadiness(
      title,
      body,
      templateMetadata,
      appliedLabels,
    );

    if (!readinessValidation.valid) {
      return {
        valid: false,
        error: "PR validation failed",
        validationErrors: readinessValidation.errors,
        warnings: readinessValidation.warnings,
        pr: null,
      };
    }

    // Build PR object
    const pr = {
      title,
      body,
      head: branchName,
      base: prContext.baseBranch || "develop",
      labels: appliedLabels,
      draft: false,
      metadata: {
        branchType,
        scope,
        templateFile,
        templateMetadata,
        generatedAt: new Date().toISOString(),
      },
    };

    return {
      valid: true,
      pr,
      title,
      bodyPreview: body.substring(0, 200) + "...",
      labels: appliedLabels,
      readinessScore: calculateReadinessScore(
        title,
        body,
        templateMetadata,
        appliedLabels,
      ),
      warnings: readinessValidation.warnings,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Error orchestrating PR creation: ${error.message}`,
      pr: null,
      warnings: [],
    };
  }
}

/**
 * Extract scope from branch name (e.g., "user" from "feat/user-auth-system")
 * Format: {type}/{scope}-{short-title}
 * Takes first component of scope
 */
function extractScope(branchName) {
  // Match first word after / and before first -
  const match = branchName.match(/\/([a-z0-9]+)/);
  return match ? match[1] : "general";
}

/**
 * Build PR title from branch type and scope
 */
function buildPrTitle(branchType, scope) {
  const titleMap = {
    feat: "feat",
    fix: "fix",
    docs: "docs",
    hotfix: "hotfix",
    refactor: "refactor",
    chore: "chore",
    ci: "ci",
    test: "test",
    security: "security",
    perf: "perf",
  };

  const prefix = titleMap[branchType] || branchType;
  const capitalizedScope =
    scope.charAt(0).toUpperCase() + scope.slice(1).replace(/-/g, " ");

  switch (branchType) {
    case "feat":
      return `feat: ${capitalizedScope} — Implementation`;
    case "fix":
      return `fix: ${capitalizedScope} — Issue Resolution`;
    case "docs":
      return `docs: ${capitalizedScope} — Documentation Update`;
    case "hotfix":
      return `hotfix: ${capitalizedScope} — Critical Fix`;
    case "refactor":
      return `refactor: ${capitalizedScope} — Code Cleanup`;
    case "perf":
      return `perf: ${capitalizedScope} — Performance Optimization`;
    case "security":
      return `security: ${capitalizedScope} — Security Hardening`;
    default:
      return `${prefix}: ${capitalizedScope}`;
  }
}

/**
 * Build PR body from template and metadata
 */
function buildPrBody(templateContent, templateMetadata, branchType, labels) {
  if (!templateContent) {
    return buildMinimalBody(branchType, templateMetadata, labels);
  }

  // If template content exists, use it as base and append metadata
  let body = templateContent;

  // Add labels section if labels present
  if (labels && labels.length > 0) {
    body += "\n\n## Labels\n\n";
    labels.forEach((label) => {
      body += `- \`${label}\`\n`;
    });
  }

  // Add metadata section
  if (templateMetadata) {
    body += "\n\n---\n\n## Template Metadata\n\n";
    body += `- Template: ${templateMetadata.templateFile || "unknown"}\n`;
    body += `- Complete: ${templateMetadata.complete ? "Yes" : "No"}\n`;

    if (templateMetadata.missingSections?.length > 0) {
      body += `- Missing Sections: ${templateMetadata.missingSections.join(", ")}\n`;
    }
  }

  return body;
}

/**
 * Build minimal PR body when template content unavailable
 */
function buildMinimalBody(branchType, templateMetadata, labels) {
  let body = "## Summary\n\n[Please provide a summary of changes]\n\n";

  body += "## Changes\n\n[List key changes made]\n\n";

  if (templateMetadata?.missingSections?.length > 0) {
    body += "## Missing Template Sections\n\n";
    templateMetadata.missingSections.forEach((section) => {
      body += `- [ ] ${section}\n`;
    });
    body += "\n";
  }

  if (labels && labels.length > 0) {
    body += "## Labels\n\n";
    labels.forEach((label) => {
      body += `- \`${label}\`\n`;
    });
  }

  return body;
}

/**
 * Validate PR readiness
 */
function validatePrReadiness(title, body, templateMetadata, labels) {
  const errors = [];
  const warnings = [];

  // Title validation
  if (!title || title.length === 0) {
    errors.push("PR title is empty");
  } else if (title.length > 120) {
    warnings.push(`PR title is long (${title.length} chars, recommend ≤ 120)`);
  }

  // Body validation
  if (!body || body.length === 0) {
    errors.push("PR body is empty");
  } else if (body.length < 50) {
    warnings.push("PR body is very short (< 50 chars)");
  }

  // Template metadata validation
  if (templateMetadata) {
    if (!templateMetadata.complete) {
      warnings.push(
        `Template incomplete: missing ${templateMetadata.missingSections?.length || 0} sections`,
      );
    }
  }

  // Labels validation
  if (!labels || labels.length === 0) {
    warnings.push("No labels assigned to PR");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate PR readiness score (0-1)
 */
function calculateReadinessScore(title, body, templateMetadata, labels) {
  let score = 1.0;

  // Title length deduction
  if (!title || title.length === 0) score -= 0.2;
  else if (title.length > 120) score -= 0.05;

  // Body length deduction
  if (!body || body.length === 0) score -= 0.2;
  else if (body.length < 50) score -= 0.1;
  else if (body.length < 200) score -= 0.05;

  // Template completeness deduction
  if (templateMetadata) {
    if (!templateMetadata.complete) {
      const missingSectionCount = templateMetadata.missingSections?.length || 0;
      score -= Math.min(0.2, missingSectionCount * 0.05);
    }
  } else {
    score -= 0.1;
  }

  // Labels deduction
  if (!labels || labels.length === 0) score -= 0.1;

  return Math.max(0, Math.min(1, score));
}

export default orchestratePrCreation;
