/**
 * Handler: status:needs-triage
 *
 * Automatically assigns type, area, and team lead to untriaged issues by:
 * 1. Analysing issue title/description to infer type (feature, bug, etc.)
 * 2. Detecting area from keywords/content
 * 3. Suggesting team lead assignee based on area
 * 4. Adding inferred labels with confidence scoring
 * 5. Removing status:needs-triage label when complete
 *
 * Supports confidence-based filtering and dry-run/preview mode.
 */

// Type detection patterns
const typePatterns = {
  feature: {
    keywords: [
      "add",
      "implement",
      "create",
      "new capability",
      "feature request",
      "enhancement",
    ],
    patterns: [/^(add|implement|create|new)\s+/i, /feature request/i],
    weight: 1.0,
  },
  bug: {
    keywords: ["bug", "broken", "crash", "error", "failing", "regression"],
    patterns: [/^(bug|error|crash|broken)/i, /doesn't?\s+work/i, /failing/i],
    weight: 1.0,
  },
  epic: {
    keywords: ["epic", "initiative", "roadmap", "phase"],
    patterns: [/^epic:/i, /large initiative/i],
    weight: 0.95,
  },
  story: {
    keywords: ["user story", "as a", "i want", "so that"],
    patterns: [/^as\s+a/i, /i want to/i, /so that/i],
    weight: 0.9,
  },
  task: {
    keywords: ["task", "refactor", "cleanup", "maintenance"],
    patterns: [/^task:/i, /refactor/i, /cleanup/i],
    weight: 0.85,
  },
  design: {
    keywords: ["design", "ui", "ux", "figma"],
    patterns: [/design|ui|ux/i, /figma/i],
    weight: 0.85,
  },
};

// Area detection patterns
const areaPatterns = {
  "area:ci": {
    keywords: ["ci", "github actions", "workflow", "pipeline"],
    patterns: [/ci|github actions|workflow|pipeline/i],
    weight: 1.0,
  },
  "area:docs": {
    keywords: ["docs", "documentation", "readme", "guide"],
    patterns: [/docs?|documentation|readme|guide/i],
    weight: 1.0,
  },
  "area:security": {
    keywords: ["security", "vulnerability", "permission", "auth"],
    patterns: [/security|vulnerab|permission|auth/i],
    weight: 1.0,
  },
  "area:automation": {
    keywords: ["automation", "automate", "script", "agent"],
    patterns: [/automat|script|agent/i],
    weight: 0.95,
  },
  "area:labels": {
    keywords: ["label", "taxonomy", "governance"],
    patterns: [/label|taxonomy|governance/i],
    weight: 0.9,
  },
  "area:tests": {
    keywords: ["test", "testing", "coverage"],
    patterns: [/test|coverage|spec/i],
    weight: 0.95,
  },
  "area:scripts": {
    keywords: ["script", "tool", "utility"],
    patterns: [/script|tool|utility/i],
    weight: 0.85,
  },
  "area:accessibility": {
    keywords: ["a11y", "accessibility", "wcag"],
    patterns: [/a11y|accessibil|wcag/i],
    weight: 0.95,
  },
};

// Team lead mapping
const teamLeadMapping = {
  "area:ci": "ashleyshaw",
  "area:docs": "ashleyshaw",
  "area:security": "ashleyshaw",
  "area:automation": "ashleyshaw",
  "area:labels": "ashleyshaw",
  "area:tests": "ashleyshaw",
  "area:scripts": "ashleyshaw",
  "area:accessibility": "ashleyshaw",
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

function inferType(issue) {
  const text = `${issue.title} ${issue.body || ""}`;
  const scores = {};

  for (const [type, patterns] of Object.entries(typePatterns)) {
    scores[type] = scoreMatch(text, patterns);
  }

  const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  return {
    type: topType[0],
    confidence: topType[1],
    scores,
  };
}

function inferArea(issue) {
  const text = `${issue.title} ${issue.body || ""}`;
  const scores = {};

  for (const [area, patterns] of Object.entries(areaPatterns)) {
    scores[area] = scoreMatch(text, patterns);
  }

  const ranked = Object.entries(scores)
    .filter(([_, score]) => score > 0.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return ranked.map(([area, confidence]) => ({
    area,
    confidence,
  }));
}

function suggestAssignee(inferredAreas) {
  if (!inferredAreas || inferredAreas.length === 0) {
    return null;
  }

  const topArea = inferredAreas[0];
  return teamLeadMapping[topArea.area] || null;
}

async function processIssue(issue, options = {}) {
  const {
    dryRun = true,
    githubRequest = null,
    confidenceThreshold = 0.9,
    owner = "lightspeedwp",
    repo = ".github",
  } = options;

  const issueNumber = issue.number;

  const labels = (issue.labels || []).map((l) => l.name || l);
  const hasType = labels.some((l) => l.startsWith("type:"));
  const hasArea = labels.some((l) => l.startsWith("area:"));

  if (hasType && hasArea) {
    return {
      status: "skipped",
      reason: "already has type and area labels",
      issueNumber,
    };
  }

  const typeInference = inferType(issue);
  const areaInference = inferArea(issue);
  const suggestedAssignee = suggestAssignee(areaInference);

  const typeConfidentEnough =
    typeInference.confidence >= confidenceThreshold * 0.85;
  const areaConfidentEnough =
    areaInference.length > 0 &&
    areaInference[0].confidence >= confidenceThreshold * 0.85;

  if (!typeConfidentEnough && !areaConfidentEnough) {
    return {
      status: "warning",
      reason: `type and area confidence both below threshold`,
      issueNumber,
      typeInference,
      areaInference,
    };
  }

  const labelsToAdd = [];

  if (!hasType) {
    labelsToAdd.push(`type:${typeInference.type}`);
  }

  if (!hasArea && areaInference.length > 0) {
    labelsToAdd.push(areaInference[0].area);
    if (
      areaInference.length > 1 &&
      areaInference[1].confidence > confidenceThreshold * 0.85
    ) {
      labelsToAdd.push(areaInference[1].area);
    }
  }

  if (dryRun) {
    return {
      status: "preview",
      dryRun: true,
      issueNumber,
      title: issue.title,
      typeInference,
      areaInference,
      labelsToAdd,
      suggestedAssignee,
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
    if (labelsToAdd.length > 0) {
      const addLabelsPath = `/repos/${owner}/${repo}/issues/${issueNumber}/labels`;
      await githubRequest("POST", addLabelsPath, { labels: labelsToAdd });
    }

    let assigneeAdded = false;
    if (suggestedAssignee) {
      try {
        const assignPath = `/repos/${owner}/${repo}/issues/${issueNumber}/assignees`;
        await githubRequest("POST", assignPath, {
          assignees: [suggestedAssignee],
        });
        assigneeAdded = true;
      } catch {
        // Assignee addition failed but labels were added
      }
    }

    let labelRemoved = false;
    try {
      const removeLabel = `/repos/${owner}/${repo}/issues/${issueNumber}/labels/status%3Aneeds-triage`;
      await githubRequest("DELETE", removeLabel);
      labelRemoved = true;
    } catch {
      // Label removal failed but issue was updated
    }

    return {
      status: "updated",
      issueNumber,
      typeInference,
      areaInference,
      labelsAdded: labelsToAdd.length,
      assigneeAdded,
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
  inferType,
  inferArea,
  suggestAssignee,
  typePatterns,
  areaPatterns,
};
