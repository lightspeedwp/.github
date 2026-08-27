/**
 * Sample Test Fixtures
 *
 * Issue data for unit, integration, and E2E testing
 */

/**
 * Well-labeled issue (passes all validations)
 */
export const wellLabeledIssue = {
  number: 123,
  title: "Button not working on mobile",
  state: "open",
  labels: ["type:bug", "priority:high", "area:ui", "status:in-progress"],
  url: "https://github.com/lightspeedwp/.github/issues/123",
  created_at: "2026-08-01T10:00:00Z",
  updated_at: "2026-08-12T15:30:00Z",
  milestone: "v1.5.0",
};

/**
 * Issue with missing type label (Tier 1 failure)
 */
export const missingTypeLabel = {
  number: 124,
  title: "Add dark mode support",
  state: "open",
  labels: ["priority:normal", "area:ui"],
  url: "https://github.com/lightspeedwp/.github/issues/124",
  created_at: "2026-08-05T09:00:00Z",
  updated_at: "2026-08-12T10:00:00Z",
  milestone: "v1.5.0",
};

/**
 * Issue with conflicting labels (Tier 1 failure)
 */
export const conflictingLabels = {
  number: 125,
  title: "Fix performance regression",
  state: "open",
  labels: ["type:bug", "type:performance", "status:open", "status:in-progress"],
  url: "https://github.com/lightspeedwp/.github/issues/125",
  created_at: "2026-08-06T08:00:00Z",
  updated_at: "2026-08-12T12:00:00Z",
  milestone: "v1.5.0",
};

/**
 * Pull request with status label
 */
export const prWithStatus = {
  number: 126,
  title: "Add type checking to api-client.js",
  state: "open",
  labels: ["type:chore", "status:review", "area:ci"],
  url: "https://github.com/lightspeedwp/.github/pull/126",
  created_at: "2026-08-10T14:00:00Z",
  updated_at: "2026-08-12T16:00:00Z",
  isPR: true,
  milestone: "v1.5.0",
};

/**
 * PR without status label (Tier 1 failure for PRs)
 */
export const prWithoutStatus = {
  number: 127,
  title: "Refactor validation.js",
  state: "open",
  labels: ["type:refactor", "area:code"],
  url: "https://github.com/lightspeedwp/.github/pull/127",
  created_at: "2026-08-11T11:00:00Z",
  updated_at: "2026-08-12T17:00:00Z",
  isPR: true,
  milestone: "v1.5.0",
};

/**
 * Issue without milestone (Tier 1 failure)
 */
export const noMilestone = {
  number: 128,
  title: "Update documentation",
  state: "open",
  labels: ["type:documentation", "area:docs"],
  url: "https://github.com/lightspeedwp/.github/issues/128",
  created_at: "2026-08-12T09:00:00Z",
  updated_at: "2026-08-12T10:00:00Z",
};

/**
 * Issue with incomplete labeling (Tier 2 warning)
 */
export const incompleteLabelingIssue = {
  number: 129,
  title: "Consider adding optional chaining",
  state: "open",
  labels: ["type:suggestion", "area:api"],
  url: "https://github.com/lightspeedwp/.github/issues/129",
  created_at: "2026-08-08T13:00:00Z",
  updated_at: "2026-08-12T14:00:00Z",
  milestone: "v1.5.0",
  // Missing: priority, status
};

/**
 * Collection of issues for validation testing
 */
export const issueSet = {
  mixed: [
    wellLabeledIssue,
    missingTypeLabel,
    conflictingLabels,
    prWithStatus,
    prWithoutStatus,
    noMilestone,
    incompleteLabelingIssue,
  ],
  wellLabeled: [wellLabeledIssue, prWithStatus],
  incomplete: [
    missingTypeLabel,
    conflictingLabels,
    prWithoutStatus,
    noMilestone,
  ],
};

/**
 * Sample GitHub API responses
 */
export const apiResponses = {
  authenticateSuccess: {
    login: "test-bot",
    name: "Test Bot",
    email: "bot@example.com",
    type: "User",
  },

  issuesList: {
    data: [wellLabeledIssue, incompleteLabelingIssue],
  },

  applyLabelsSuccess: {
    data: wellLabeledIssue,
  },

  rateLimitInfo: {
    data: {
      resources: {
        core: {
          limit: 60,
          remaining: 45,
          reset: Math.floor(Date.now() / 1000) + 3600,
        },
      },
    },
  },

  rateLimitExceeded: {
    status: 403,
    message: "API rate limit exceeded",
  },
};

/**
 * Sample confidence scoring contexts
 */
export const scoringContexts = {
  highConfidence: {
    issueTitle: "Button not working on mobile",
    issueBody: "When I click the button on mobile, nothing happens",
    existingLabels: [],
    issueType: "bug",
  },

  lowConfidence: {
    issueTitle: "Button colors",
    issueBody: "Can we change button colors?",
    existingLabels: ["type:design", "area:ui"],
    issueType: "question",
  },

  conflict: {
    issueTitle: "Fix bug and add feature",
    existingLabels: ["type:bug", "status:open"],
    issueType: "bug",
  },
};

/**
 * Sample validation results
 */
export const validationResults = {
  tier1Passed: {
    passed: true,
    blockers: [],
    count: 0,
    total: 4,
    details: { issuesChecked: 7 },
  },

  tier1Failed: {
    passed: false,
    blockers: [
      {
        rule: "All issues have type label",
        message: "1 issues missing type: label",
        passed: false,
        failCount: 1,
      },
      {
        rule: "No conflicting labels",
        message: "1 issues have conflicting labels",
        passed: false,
        failCount: 1,
      },
    ],
    count: 2,
    total: 4,
    details: { issuesChecked: 7 },
  },

  tier2Failed: {
    passed: false,
    warnings: [
      {
        rule: "All issues have priority label",
        message: "57% of issues have priority: label (need 90%+)",
        passed: false,
        coverage: 57,
        threshold: 90,
      },
    ],
    count: 1,
    total: 4,
    details: { issuesChecked: 7 },
  },
};

/**
 * Sample error scenarios
 */
export const errorScenarios = {
  authentication: new Error("GitHub authentication failed: Invalid token"),
  authorization: new Error(
    "API Error: 403 Forbidden - Insufficient permissions",
  ),
  rateLimit: new Error("API Error: 429 Too Many Requests"),
  notFound: new Error("API Error: 404 Not Found"),
  validation: new Error("Validation error: Invalid label name"),
  network: new Error("ETIMEDOUT: connection timeout"),
  unknown: new Error("Unexpected error occurred"),
};

export default {
  wellLabeledIssue,
  missingTypeLabel,
  conflictingLabels,
  prWithStatus,
  prWithoutStatus,
  noMilestone,
  incompleteLabelingIssue,
  issueSet,
  apiResponses,
  scoringContexts,
  validationResults,
  errorScenarios,
};
