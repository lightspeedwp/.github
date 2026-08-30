/**
 * Pure function helpers for PR label synchronization
 * These functions contain the core logic and can be imported by both
 * production scripts and tests, avoiding duplication.
 */

/**
 * Extract PR numbers from text
 */
export function extractPRs(text) {
  const prs = [];
  const regex = /#(\d+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    prs.push(parseInt(match[1], 10));
  }
  return [...new Set(prs)];
}

/**
 * Validate a PR number
 */
export function validatePR(prNumber) {
  if (!prNumber || typeof prNumber !== "number") {
    return { valid: false, reason: "Invalid PR number" };
  }
  if (prNumber < 1) {
    return { valid: false, reason: "PR number must be positive" };
  }
  if (prNumber > 999999) {
    return { valid: false, reason: "PR number exceeds maximum" };
  }
  return { valid: true };
}

/**
 * Determine label action based on PR validity
 */
export function determineLabelAction(hasValidPR) {
  return {
    shouldAdd: hasValidPR,
    shouldRemove: !hasValidPR,
    label: "meta:has-pr",
  };
}

/**
 * Build sync configuration
 */
export function buildSyncConfig(options = {}) {
  return {
    dryRun: options.dryRun || false,
    verbose: options.verbose || false,
    issueNumber: options.issueNumber || null,
    format: options.format || "json",
    output: options.output || ".github/reports",
  };
}

/**
 * Process an issue for label synchronization
 */
export function processIssue(issue, _config) {
  const changes = {
    issueNumber: issue.number,
    currentLabels: issue.labels || [],
    prNumbers: extractPRs(issue.body || ""),
    validPRs: [],
    invalidPRs: [],
    labelsToAdd: [],
    labelsToRemove: [],
  };

  for (const prNum of changes.prNumbers) {
    const validation = validatePR(prNum);
    if (validation.valid) {
      changes.validPRs.push(prNum);
    } else {
      changes.invalidPRs.push({ number: prNum, reason: validation.reason });
    }
  }

  const hasValidPR = changes.validPRs.length > 0;
  const action = determineLabelAction(hasValidPR);

  if (
    action.shouldAdd &&
    !changes.currentLabels.some((l) => l.name === action.label)
  ) {
    changes.labelsToAdd.push(action.label);
  }

  if (
    action.shouldRemove &&
    changes.currentLabels.some((l) => l.name === action.label)
  ) {
    changes.labelsToRemove.push(action.label);
  }

  return changes;
}

/**
 * Generate synchronization report
 */
export function generateReport(processedIssues, config) {
  const report = {
    config,
    timestamp: new Date().toISOString(),
    issues: processedIssues,
    summary: {
      totalIssues: processedIssues.length,
      issuesWithPRs: processedIssues.filter((i) => i.validPRs.length > 0)
        .length,
      labelsAdded: processedIssues.reduce(
        (sum, i) => sum + i.labelsToAdd.length,
        0,
      ),
      labelsRemoved: processedIssues.reduce(
        (sum, i) => sum + i.labelsToRemove.length,
        0,
      ),
      errors: processedIssues.reduce((sum, i) => sum + i.invalidPRs.length, 0),
    },
  };
  return report;
}
