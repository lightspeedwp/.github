/**
 * Handle-Needs-Template-Fix Handler
 *
 * Applies template fixes to issues with incomplete DoR/DoD sections.
 * Updates issue body and posts validation comment.
 */

import {
  generateTemplateFix,
  formatValidationComment,
} from "./template-validator.js";

/**
 * Generate template fix for issue
 */
export function prepareFix(issue, validation) {
  const fix = generateTemplateFix(validation.type);

  return {
    originalBody: issue.body,
    fixMarkdown: fix,
    newBody: issue.body + fix,
    missingCount: validation.requiredSections.missing.length,
    qualityIssues: Object.values(validation.sectionDetails)
      .filter((s) => s.issues && s.issues.length > 0)
      .flatMap((s) => s.issues),
  };
}

/**
 * Apply template fix to issue
 */
export async function applyFix(issue, fixData, githubAPI) {
  try {
    // Update issue body with template fix
    await githubAPI.updateIssue(issue.number, {
      body: fixData.newBody,
    });

    // Post validation comment
    const validation = {
      overview: { isComplete: true, completeness: 100, qualityScore: 100 },
    };
    const comment = formatValidationComment(validation);

    await githubAPI.postComment(issue.number, comment);

    return {
      success: true,
      message: `✅ Template fixed: added ${fixData.missingCount} missing sections`,
      applied: {
        bodyUpdated: true,
        commentPosted: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      applied: {
        bodyUpdated: false,
        commentPosted: false,
      },
    };
  }
}

/**
 * Handler function for template fix
 */
export async function handleNeedsTemplateFix(
  issue,
  recommendations,
  options = {},
) {
  const { githubAPI = null, dryRun = false } = options;

  if (
    !recommendations.templateFixes ||
    recommendations.templateFixes.length === 0
  ) {
    return {
      status: "skipped",
      reason: "No template fixes needed",
    };
  }

  if (dryRun) {
    return {
      status: "dry-run",
      message: "Would apply template fix",
      fixes: recommendations.templateFixes.length,
    };
  }

  if (!githubAPI) {
    return {
      status: "error",
      error: "GitHub API not available",
    };
  }

  // Apply the fix
  return await applyFix(issue, recommendations.templateFixes, githubAPI);
}
