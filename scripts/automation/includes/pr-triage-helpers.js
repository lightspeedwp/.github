/**
 * Pure function helpers for PR triage operations
 * These functions contain the core logic and can be imported by both
 * production scripts and tests, avoiding duplication.
 */

/**
 * Parse command-line arguments
 */
export function parseConfig(args) {
  const config = {
    dryRun: args.includes("--dry-run"),
    verbose: args.includes("--verbose"),
    format: "json",
    output: ".github/reports",
  };

  const formatIdx = args.indexOf("--format");
  if (formatIdx !== -1 && formatIdx + 1 < args.length) {
    config.format = args[formatIdx + 1];
  }

  const outputIdx = args.indexOf("--output");
  if (outputIdx !== -1 && outputIdx + 1 < args.length) {
    config.output = args[outputIdx + 1];
  }

  return config;
}

/**
 * Extract linked issue numbers from PR body
 */
export function extractIssuesFromBody(body) {
  const issues = [];
  const regex = /(?:Fixes|Closes|Resolves|Relates to|#)[\s#]+(\d+)/gi;
  let match;
  while ((match = regex.exec(body)) !== null) {
    issues.push(parseInt(match[1], 10));
  }
  return [...new Set(issues)];
}

/**
 * Determine triage status from labels
 */
export function determineTriage(labels) {
  return {
    needsReview: labels.some((l) => l.name === "status:needs-review"),
    needsChangelog: labels.some((l) => l.name === "meta:needs-changelog"),
    isBot: labels.some((l) => l.name === "type:bot"),
  };
}

/**
 * Build metadata for a PR
 */
export function buildMetadata(pr, triageStatus) {
  return {
    prNumber: pr.number,
    title: pr.title,
    author: pr.user?.login,
    needsReview: triageStatus.needsReview,
    needsChangelog: triageStatus.needsChangelog,
    linkedIssues: extractIssuesFromBody(pr.body || ""),
    suggestedMilestone: triageStatus.needsReview ? "In Review" : "Backlog",
  };
}

/**
 * Generate summary statistics from PR metadata
 */
export function generateSummary(prs, metadata) {
  return {
    totalPRs: prs.length,
    reviewed: metadata.filter((m) => !m.needsReview).length,
    needsReview: metadata.filter((m) => m.needsReview).length,
    changelogs: metadata.filter((m) => m.needsChangelog).length,
    linkedIssues: metadata.reduce((sum, m) => sum + m.linkedIssues.length, 0),
  };
}
