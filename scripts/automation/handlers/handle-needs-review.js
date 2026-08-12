/**
 * Handler: status:needs-review
 *
 * Automatically assigns reviewers based on issue area by:
 * 1. Inferring review type (code, design, spec)
 * 2. Identifying relevant area from labels/content
 * 3. Suggesting reviewers from CODEOWNERS and recent committers
 * 4. Assigning team members
 * 5. Removing status:needs-review label when complete
 *
 * Supports dry-run/preview mode for safe validation.
 */

// Review type inference
const reviewTypePatterns = {
  code: {
    keywords: ["code", "implementation", "bug", "feature", "refactor"],
    patterns: [/code|implementation|bug fix|feature/i, /\.js|\.ts|\.php/i],
    weight: 1.0,
  },
  design: {
    keywords: ["design", "ui", "ux", "figma", "component"],
    patterns: [/design|ui|ux|figma/i, /component|layout/i],
    weight: 0.95,
  },
  spec: {
    keywords: ["spec", "specification", "architecture", "proposal"],
    patterns: [/spec|specification|architecture|proposal/i],
    weight: 0.9,
  },
  documentation: {
    keywords: ["docs", "documentation", "readme", "guide"],
    patterns: [/docs?|documentation|readme|guide/i],
    weight: 0.85,
  },
};

// Area to reviewer mapping (from CODEOWNERS)
const areaReviewerMapping = {
  "area:ci": ["ashleyshaw"],
  "area:docs": ["ashleyshaw"],
  "area:security": ["ashleyshaw"],
  "area:automation": ["ashleyshaw"],
  "area:labels": ["ashleyshaw"],
  "area:tests": ["ashleyshaw"],
  "area:scripts": ["ashleyshaw"],
  "area:accessibility": ["ashleyshaw"],
};

// Review type to reviewer priority
const reviewTypeReviewers = {
  code: ["ashleyshaw"],
  design: ["ashleyshaw"],
  spec: ["ashleyshaw"],
  documentation: ["ashleyshaw"],
};

function scoreMatch(text, patterns) {
  if (!text) return 0;

  const lowerText = text.toLowerCase();
  let score = 0;

  for (const pattern of patterns.patterns) {
    if (pattern.test(text)) {
      score = Math.max(score, patterns.weight);
    }
  }

  const keywordCount = patterns.keywords.filter((kw) =>
    lowerText.includes(kw.toLowerCase()),
  ).length;

  if (keywordCount > 0) {
    score = Math.max(score, Math.min(patterns.weight * 0.7, 0.8));
  }

  return score;
}

function inferReviewType(issue) {
  const text = `${issue.title} ${issue.body || ""}`;
  const scores = {};

  for (const [type, patterns] of Object.entries(reviewTypePatterns)) {
    scores[type] = scoreMatch(text, patterns);
  }

  const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  return {
    type: topType[0],
    confidence: topType[1],
    scores,
  };
}

function suggestReviewers(issue, reviewType, areaLabel) {
  const reviewers = new Set();

  // Add reviewers based on area
  if (areaLabel && areaReviewerMapping[areaLabel]) {
    areaReviewerMapping[areaLabel].forEach((r) => reviewers.add(r));
  }

  // Add reviewers based on review type
  if (reviewTypeReviewers[reviewType.type]) {
    reviewTypeReviewers[reviewType.type].forEach((r) => reviewers.add(r));
  }

  // Return unique reviewers (max 3)
  return Array.from(reviewers).slice(0, 3);
}

async function processIssue(issue, options = {}) {
  const {
    dryRun = true,
    githubRequest = null,
    owner = "lightspeedwp",
    repo = ".github",
  } = options;

  const issueNumber = issue.number;

  // Check if already has reviewers assigned
  const assignees = (issue.assignees || []).map((a) => a.login || a);
  if (assignees.length > 0) {
    return {
      status: "skipped",
      reason: "already has reviewers assigned",
      issueNumber,
    };
  }

  // Infer review type
  const reviewType = inferReviewType(issue);

  // Extract area from labels
  const labels = (issue.labels || []).map((l) => l.name || l);
  const areaLabel = labels.find((l) => l.startsWith("area:"));

  // Suggest reviewers
  const suggestedReviewers = suggestReviewers(issue, reviewType, areaLabel);

  if (suggestedReviewers.length === 0) {
    return {
      status: "warning",
      reason: "no reviewers could be suggested",
      issueNumber,
      reviewType,
    };
  }

  // If dry-run, return preview
  if (dryRun) {
    return {
      status: "preview",
      dryRun: true,
      issueNumber,
      title: issue.title,
      reviewType,
      suggestedReviewers,
      areaLabel,
    };
  }

  // Apply changes
  if (!githubRequest) {
    return {
      status: "error",
      reason: "githubRequest function not provided",
      issueNumber,
    };
  }

  try {
    // Assign reviewers
    let reviewersAssigned = false;
    if (suggestedReviewers.length > 0) {
      try {
        const assignPath = `/repos/${owner}/${repo}/issues/${issueNumber}/assignees`;
        await githubRequest("POST", assignPath, {
          assignees: suggestedReviewers,
        });
        reviewersAssigned = true;
      } catch {
        // Assignment failed but we'll try to remove label anyway
      }
    }

    // Remove needs-review label
    let labelRemoved = false;
    try {
      const removeLabel = `/repos/${owner}/${repo}/issues/${issueNumber}/labels/status%3Aneeds-review`;
      await githubRequest("DELETE", removeLabel);
      labelRemoved = true;
    } catch {
      // Label removal failed but issue was assigned
    }

    return {
      status: "updated",
      issueNumber,
      reviewType,
      reviewersAssigned,
      labelRemoved,
      suggestedReviewers,
    };
  } catch (error) {
    return {
      status: "error",
      reason: error.message,
      issueNumber,
    };
  }
}

async function processBatch(issues, options = {}) {
  const results = [];
  const stats = {
    preview: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    warnings: 0,
  };

  for (const issue of issues) {
    const result = await processIssue(issue, options);
    results.push(result);

    if (result.status === "preview") stats.preview++;
    else if (result.status === "updated") stats.updated++;
    else if (result.status === "skipped") stats.skipped++;
    else if (result.status === "error") stats.errors++;
    else if (result.status === "warning") stats.warnings++;
  }

  return { results, stats };
}

export {
  processIssue,
  processBatch,
  inferReviewType,
  suggestReviewers,
  reviewTypePatterns,
  areaReviewerMapping,
};
