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
 * Supports confidence-based filtering (default >90%) and dry-run/preview mode.
 *
 * Usage:
 *   import { processIssue } from './handle-needs-triage.js';
 *   const result = await processIssue(issue, { dryRun: true, confidenceThreshold: 0.9 });
 *
 * Note: Type and area detection use keyword matching and pattern recognition.
 * Confidence scoring prevents false positives on edge cases.
 */

// Type detection patterns (keyword → type mapping)
const typePatterns = {
  feature: {
    keywords: [
      "add",
      "implement",
      "create",
      "new capability",
      "feature request",
      "enhancement",
      "would like",
      "suggestion",
    ],
    patterns: [
      /^(add|implement|create|new)\s+/i,
      /feature request/i,
      /would like to/i,
    ],
    weight: 1.0,
  },

  bug: {
    keywords: [
      "bug",
      "broken",
      "crash",
      "error",
      "issue",
      "failing",
      "doesn't work",
      "not working",
      "regression",
      "broken",
    ],
    patterns: [
      /^(bug|error|issue|crash|broken)/i,
      /doesn't?\s+work/i,
      /failing/i,
      /regression/i,
    ],
    weight: 1.0,
  },

  epic: {
    keywords: [
      "epic",
      "initiative",
      "roadmap",
      "large initiative",
      "phase",
      "program",
    ],
    patterns: [/^epic:/i, /large initiative/i, /multi-part/i],
    weight: 0.95,
  },

  story: {
    keywords: [
      "user story",
      "as a",
      "i want",
      "so that",
      "story",
      "user request",
    ],
    patterns: [/^as\s+a/i, /i want to/i, /so that/i, /user story/i],
    weight: 0.9,
  },

  task: {
    keywords: [
      "task",
      "refactor",
      "cleanup",
      "update",
      "maintenance",
      "housekeeping",
    ],
    patterns: [/^task:/i, /refactor/i, /cleanup/i, /maintenance/i],
    weight: 0.85,
  },

  design: {
    keywords: ["design", "ui", "ux", "interface", "layout", "component design"],
    patterns: [/design|ui|ux/i, /figma/i],
    weight: 0.85,
  },
};

// Area detection patterns (keyword → area mapping)
const areaPatterns = {
  "area:ci": {
    keywords: ["ci", "github actions", "workflow", "pipeline", "build", "test"],
    patterns: [/ci|github actions|workflow|pipeline|build|test/i],
    weight: 1.0,
  },

  "area:docs": {
    keywords: [
      "docs",
      "documentation",
      "readme",
      "guide",
      "example",
      "tutorial",
    ],
    patterns: [/docs?|documentation|readme|guide|tutorial/i],
    weight: 1.0,
  },

  "area:security": {
    keywords: [
      "security",
      "vulnerability",
      "exploit",
      "safe",
      "permission",
      "auth",
    ],
    patterns: [/security|vulnerab|exploit|permission|auth|safe/i],
    weight: 1.0,
  },

  "area:automation": {
    keywords: [
      "automation",
      "automate",
      "script",
      "scripting",
      "workflow",
      "agent",
    ],
    patterns: [/automat|script|workflow|agent/i],
    weight: 0.95,
  },

  "area:labels": {
    keywords: ["label", "labeling", "taxonomy", "governance"],
    patterns: [/label|tagging|taxonomy|governance/i],
    weight: 0.9,
  },

  "area:tests": {
    keywords: ["test", "testing", "unit test", "integration test", "coverage"],
    patterns: [/test|coverage|spec/i],
    weight: 0.95,
  },

  "area:scripts": {
    keywords: ["script", "tool", "utility", "command"],
    patterns: [/script|tool|utility|command/i],
    weight: 0.85,
  },

  "area:accessibility": {
    keywords: ["a11y", "accessibility", "wcag", "contrast", "keyboard"],
    patterns: [/a11y|accessibil|wcag|contrast|keyboard/i],
    weight: 0.95,
  },
};

// Team lead mapping (area → assignee)
const teamLeadMapping = {
  "area:ci": "ashleyshaw", // CI owner
  "area:docs": "ashleyshaw", // Docs lead
  "area:security": "ashleyshaw", // Security lead
  "area:automation": "ashleyshaw", // Automation lead
  "area:labels": "ashleyshaw", // Labels governance
  "area:tests": "ashleyshaw", // QA lead
  "area:scripts": "ashleyshaw", // Scripts lead
  "area:accessibility": "ashleyshaw", // A11y lead
};

// Score type/area inference
function scoreMatch(text, patterns) {
  if (!text) return 0;

  const lowerText = text.toLowerCase();
  let score = 0;

  // Check patterns
  for (const pattern of patterns.patterns) {
    if (pattern.test(text)) {
      score = Math.max(score, patterns.weight);
    }
  }

  // Check keywords (lower weight)
  const keywordCount = patterns.keywords.filter((kw) =>
    lowerText.includes(kw.toLowerCase()),
  ).length;

  if (keywordCount > 0) {
    score = Math.max(score, Math.min(patterns.weight * 0.7, 0.8));
  }

  return score;
}

// Infer issue type from content
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

// Infer issue area from content
function inferArea(issue) {
  const text = `${issue.title} ${issue.body || ""}`;
  const scores = {};

  for (const [area, patterns] of Object.entries(areaPatterns)) {
    scores[area] = scoreMatch(text, patterns);
  }

  // Return top 1-2 areas with confidence >0.5
  const ranked = Object.entries(scores)
    .filter(([_, score]) => score > 0.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return ranked.map(([area, confidence]) => ({
    area,
    confidence,
  }));
}

// Suggest assignee based on inferred area
function suggestAssignee(inferredAreas) {
  if (!inferredAreas || inferredAreas.length === 0) {
    return null;
  }

  const topArea = inferredAreas[0];
  return teamLeadMapping[topArea.area] || null;
}

// Process a single issue
async function processIssue(issue, options = {}) {
  const {
    dryRun = true,
    githubRequest = null,
    confidenceThreshold = 0.9,
    owner = "lightspeedwp",
    repo = ".github",
  } = options;

  const issueNumber = issue.number;

  // Validate confidenceThreshold is in valid range [0, 1]
  if (
    typeof confidenceThreshold !== "number" ||
    confidenceThreshold < 0 ||
    confidenceThreshold > 1
  ) {
    return {
      status: "invalid-configuration",
      reason: `confidenceThreshold must be a number between 0 and 1, got ${confidenceThreshold}`,
      issueNumber,
    };
  }

  // Check if already triaged (has type and area labels)
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

  // Infer type and area
  const typeInference = inferType(issue);
  const areaInference = inferArea(issue);
  const suggestedAssignee = suggestAssignee(areaInference);

  // Check confidence thresholds (warn only if both type and area are below threshold)
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

  // Prepare labels to add
  const labelsToAdd = [];

  if (!hasType) {
    labelsToAdd.push(`type:${typeInference.type}`);
  }

  if (!hasArea && areaInference.length > 0) {
    labelsToAdd.push(areaInference[0].area);
    if (
      areaInference.length > 1 &&
      areaInference[1].confidence > confidenceThreshold
    ) {
      labelsToAdd.push(areaInference[1].area);
    }
  }

  // If dry-run, return preview
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

  // Apply changes (requires githubRequest function)
  if (!githubRequest) {
    return {
      status: "error",
      reason: "githubRequest function not provided",
      issueNumber,
    };
  }

  try {
    // Add labels
    if (labelsToAdd.length > 0) {
      const addLabelsPath = `/repos/${owner}/${repo}/issues/${issueNumber}/labels`;
      await githubRequest("POST", addLabelsPath, { labels: labelsToAdd });
    }

    // Assign team lead if suggested
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

    // Try to remove needs-triage label
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

// Batch process multiple issues
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

// Export for use in orchestrator
export {
  processIssue,
  processBatch,
  inferType,
  inferArea,
  suggestAssignee,
  typePatterns,
  areaPatterns,
};
