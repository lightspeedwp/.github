/**
 * Skill: submit-pr
 * Submits PR to GitHub using orchestrated PR object from Skill 4
 *
 * Takes the complete PR object from Skill 4 and creates it on GitHub
 *
 * @param {Object} input - Input object
 * @param {Object} input.pr - PR object from Skill 4 (title, body, head, base, labels)
 * @param {Object} input.githubContext - GitHub context (owner, repo, token)
 * @param {boolean} input.dryRun - If true, validate but don't create (default: false)
 * @returns {Object} PR submission result with GitHub response or validation errors
 */

export async function submitPr(input) {
  const { pr, githubContext = {}, dryRun = false } = input;

  // Validate required inputs
  if (!pr || typeof pr !== "object") {
    return {
      valid: false,
      error: "PR object is required and must be an object",
      submitted: false,
      prUrl: null,
    };
  }

  if (
    pr.title === undefined ||
    pr.body === undefined ||
    pr.head === undefined ||
    pr.base === undefined ||
    !Array.isArray(pr.labels)
  ) {
    return {
      valid: false,
      error:
        "PR object missing required fields: title, body, head, base, labels",
      submitted: false,
      prUrl: null,
      missingFields: identifyMissingFields(pr),
    };
  }

  try {
    // Validate PR before submission
    const validation = validatePrForSubmission(pr);
    if (!validation.valid) {
      return {
        valid: false,
        error: "PR validation failed",
        validationErrors: [...validation.errors],
        warnings: validation.warnings,
        submitted: false,
        prUrl: null,
      };
    }

    // If dry-run, return validated PR without submitting
    if (dryRun) {
      return {
        valid: true,
        dryRun: true,
        submitted: false,
        prUrl: null,
        prPreview: {
          title: pr.title,
          body: pr.body.substring(0, 300) + "...",
          head: pr.head,
          base: pr.base,
          labels: pr.labels,
        },
        warnings: validation.warnings,
        message: "Dry-run: PR validated but not submitted",
      };
    }

    // Submit PR to GitHub
    const submission = await submitToGithub(pr, githubContext);

    if (!submission.success) {
      return {
        valid: false,
        error: submission.error,
        submitted: false,
        prUrl: null,
        details: submission.details,
      };
    }

    return {
      valid: true,
      submitted: true,
      prUrl: submission.prUrl,
      prNumber: submission.prNumber,
      prId: submission.prId,
      message: `PR #${submission.prNumber} successfully created`,
      labels: submission.labels,
      warnings: validation.warnings,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Error submitting PR: ${error.message}`,
      submitted: false,
      prUrl: null,
    };
  }
}

/**
 * Identify missing required fields in PR object
 */
function identifyMissingFields(pr) {
  const required = ["title", "body", "head", "base", "labels"];
  return required.filter(
    (field) =>
      pr[field] === undefined ||
      (field === "labels" && !Array.isArray(pr.labels)),
  );
}

/**
 * Validate PR before submission
 */
function validatePrForSubmission(pr) {
  const errors = [];
  const warnings = [];

  // Title validation
  if (!pr.title || pr.title.length === 0) {
    errors.push("PR title is empty");
  } else if (pr.title.length > 250) {
    warnings.push(
      `PR title is long (${pr.title.length} chars, recommend ≤ 250)`,
    );
  }

  // Body validation
  if (!pr.body || pr.body.length === 0) {
    errors.push("PR body is empty");
  } else if (pr.body.length < 50) {
    errors.push("PR body is too short (< 50 chars required)");
  }

  // Branch validation
  if (!pr.head || pr.head.length === 0) {
    errors.push("Head branch (PR branch) is missing");
  }

  if (!pr.base || pr.base.length === 0) {
    errors.push("Base branch is missing");
  }

  // Labels validation
  if (!Array.isArray(pr.labels)) {
    errors.push("Labels must be an array");
  } else if (pr.labels.length === 0) {
    warnings.push("No labels assigned to PR");
  } else {
    // Validate each label format: prefix:name (lowercase, single colon, both parts non-empty)
    for (const label of pr.labels) {
      // Type check
      if (typeof label !== "string") {
        errors.push(`Invalid label type: ${typeof label} (must be string)`);
        continue;
      }

      // Format check: must match prefix:name pattern
      if (!label.match(/^[a-z0-9]+:[a-z0-9-]+$/)) {
        errors.push(
          `Invalid label format: "${label}" (must be lowercase prefix:name)`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Submit PR to GitHub (simulated)
 * In production, this would use octokit or GitHub API
 */
async function submitToGithub(pr, githubContext) {
  // Validate GitHub context
  if (!githubContext.owner || !githubContext.repo) {
    return {
      success: false,
      error: "GitHub context missing: owner and repo required",
      details: {
        missingFields: ["owner", "repo"].filter((f) => !githubContext[f]),
      },
    };
  }

  // Simulated GitHub API response
  // In production, this would call GitHub API
  const prNumber = Math.floor(Math.random() * 10000) + 1000;
  const prId = `PR_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  return {
    success: true,
    prUrl: `https://github.com/${githubContext.owner}/${githubContext.repo}/pull/${prNumber}`,
    prNumber,
    prId,
    labels: pr.labels,
  };
}

export default submitPr;
