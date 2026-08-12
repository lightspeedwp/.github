/**
 * Handler: status:needs-dev
 *
 * Verifies development readiness by:
 * 1. Checking for required type and area labels
 * 2. Verifying project/sprint assignment
 * 3. Validating design/spec references
 * 4. Flagging blockers
 * 5. Suggesting project assignment if missing
 */

async function validatePrerequisites(issue) {
  const labels = (issue.labels || []).map((l) => l.name || l);
  const issues = [];

  // Check for type label
  const hasType = labels.some((l) => l.startsWith("type:"));
  if (!hasType) {
    issues.push("missing type: label");
  }

  // Check for area label
  const hasArea = labels.some((l) => l.startsWith("area:"));
  if (!hasArea) {
    issues.push("missing area: label");
  }

  // Check for project association
  const hasProject = issue.project_cards && issue.project_cards.length > 0;
  if (!hasProject) {
    issues.push("not assigned to project/sprint");
  }

  // Check for design/spec reference (optional)
  const body = issue.body || "";
  const hasDesignReference =
    body.includes("figma") ||
    body.includes("design") ||
    body.includes("specification") ||
    body.includes("spec");

  return {
    valid: issues.length === 0,
    issues,
    hasDesignReference,
  };
}

function suggestProject(issue) {
  const labels = (issue.labels || []).map((l) => l.name || l);
  const areaLabel = labels.find((l) => l.startsWith("area:"));

  // Map areas to suggested projects
  const projectMapping = {
    "area:ci": "CI/CD Pipeline",
    "area:docs": "Documentation",
    "area:security": "Security Hardening",
    "area:automation": "Automation",
    "area:labels": "Label Governance",
  };

  return projectMapping[areaLabel] || null;
}

async function processIssue(issue, options = {}) {
  const {
    dryRun = true,
    githubRequest = null,
    owner = "lightspeedwp",
    repo = ".github",
  } = options;

  const issueNumber = issue.number;

  // Validate prerequisites
  const validation = await validatePrerequisites(issue);

  if (!validation.valid) {
    if (dryRun) {
      return {
        status: "preview",
        dryRun: true,
        issueNumber,
        title: issue.title,
        validation,
        suggestedProject: suggestProject(issue),
      };
    }

    return {
      status: "warning",
      reason: `missing prerequisites: ${validation.issues.join(", ")}`,
      issueNumber,
      validation,
    };
  }

  // All prerequisites met
  if (dryRun) {
    return {
      status: "preview",
      dryRun: true,
      issueNumber,
      title: issue.title,
      validation,
      isReady: true,
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
    // Remove needs-dev label if prerequisites met
    let labelRemoved = false;
    try {
      const removeLabel = `/repos/${owner}/${repo}/issues/${issueNumber}/labels/status%3Aneeds-dev`;
      await githubRequest("DELETE", removeLabel);
      labelRemoved = true;
    } catch {
      // Label removal failed
    }

    return {
      status: "updated",
      issueNumber,
      validation,
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
    warnings: 0,
    errors: 0,
  };

  for (const issue of issues) {
    const result = await processIssue(issue, options);
    results.push(result);

    if (result.status === "preview") stats.preview++;
    else if (result.status === "updated") stats.updated++;
    else if (result.status === "warning") stats.warnings++;
    else if (result.status === "error") stats.errors++;
  }

  return { results, stats };
}

export { processIssue, processBatch, validatePrerequisites, suggestProject };
