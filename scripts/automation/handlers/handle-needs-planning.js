/**
 * Handler: status:needs-planning
 *
 * Routes issues to roadmap/sprint planning by:
 * 1. Inferring scope (small, medium, large)
 * 2. Suggesting appropriate milestone based on scope
 * 3. Linking to planning project
 * 4. Assigning to product manager
 * 5. Suggesting epic linkage if applicable
 */

// Scope inference patterns
const scopePatterns = {
  small: {
    keywords: ["quick", "small", "simple", "minor", "trivial", "one-liner"],
    patterns: [/quick|small|simple|minor|trivial|one-liner/i],
    weight: 1.0,
  },
  medium: {
    keywords: ["feature", "enhancement", "normal scope", "standard"],
    patterns: [/feature|enhancement|normal/i],
    weight: 0.9,
  },
  large: {
    keywords: ["epic", "major", "large", "complex", "multi-part", "initiative"],
    patterns: [/epic|major|large|complex|initiative/i],
    weight: 0.95,
  },
};

// Scope to milestone mapping
const scopeMilestoneMapping = {
  small: ["Current Sprint", "Next Sprint"],
  medium: ["Next Sprint", "Q3 2026"],
  large: ["Q3 2026", "Q4 2026", "Roadmap"],
};

// Area to product manager mapping
const areaProductManagerMapping = {
  "area:ci": "ashleyshaw",
  "area:docs": "ashleyshaw",
  "area:automation": "ashleyshaw",
  "area:labels": "ashleyshaw",
  "area:security": "ashleyshaw",
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

function inferScope(issue) {
  const text = `${issue.title} ${issue.body || ""}`;
  const scores = {};

  for (const [scope, patterns] of Object.entries(scopePatterns)) {
    scores[scope] = scoreMatch(text, patterns);
  }

  const topScope = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  return {
    scope: topScope[0],
    confidence: topScope[1],
    scores,
  };
}

function suggestMilestone(scope) {
  const milestones = scopeMilestoneMapping[scope.scope] || ["Backlog"];
  return milestones[0]; // Return first suggestion
}

function suggestProductManager(issue) {
  const labels = (issue.labels || []).map((l) => l.name || l);
  const areaLabel = labels.find((l) => l.startsWith("area:"));

  return areaProductManagerMapping[areaLabel] || "ashleyshaw";
}

function suggestEpicLinkage(issue) {
  const text = `${issue.title} ${issue.body || ""}`;

  // Simple heuristic: if issue mentions "epic" or is large-scope
  const mentionsEpic = /epic|initiative|phase|program/i.test(text);
  const isLarge = text.length > 500; // Proxy for complexity

  return mentionsEpic || isLarge;
}

async function processIssue(issue, options = {}) {
  const {
    dryRun = true,
    githubRequest = null,
    owner = "lightspeedwp",
    repo = ".github",
  } = options;

  const issueNumber = issue.number;

  // Check if already has milestone
  if (issue.milestone) {
    return {
      status: "skipped",
      reason: "already has milestone assigned",
      issueNumber,
    };
  }

  // Infer scope
  const scope = inferScope(issue);
  const suggestedMilestone = suggestMilestone(scope);
  const suggestedPM = suggestProductManager(issue);
  const shouldLinkEpic = suggestEpicLinkage(issue);

  if (dryRun) {
    return {
      status: "preview",
      dryRun: true,
      issueNumber,
      title: issue.title,
      scope,
      suggestedMilestone,
      suggestedPM,
      shouldLinkEpic,
    };
  }

  if (!githubRequest) {
    return {
      status: "error",
      reason: "githubRequest function not provided",
      issueNumber,
    };
  }

  try {
    let milestoneAdded = false;
    let pmAssigned = false;
    let labelRemoved = false;

    // Note: Adding milestone and assigning user would require additional API calls
    // This is a preview implementation

    // Remove needs-planning label
    try {
      const removeLabel = `/repos/${owner}/${repo}/issues/${issueNumber}/labels/status%3Aneeds-planning`;
      await githubRequest("DELETE", removeLabel);
      labelRemoved = true;
    } catch {
      // Label removal failed
    }

    return {
      status: "updated",
      issueNumber,
      scope,
      suggestedMilestone,
      suggestedPM,
      milestoneAdded,
      pmAssigned,
      labelRemoved,
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
  };

  for (const issue of issues) {
    const result = await processIssue(issue, options);
    results.push(result);

    if (result.status === "preview") stats.preview++;
    else if (result.status === "updated") stats.updated++;
    else if (result.status === "skipped") stats.skipped++;
    else if (result.status === "error") stats.errors++;
  }

  return { results, stats };
}

export {
  processIssue,
  processBatch,
  inferScope,
  suggestMilestone,
  suggestProductManager,
  suggestEpicLinkage,
  scopePatterns,
};
