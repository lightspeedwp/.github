/**
 * Handle-Needs-Type Handler
 *
 * Assigns issue type label based on analysis.
 * Handles: type:bug, type:feature, type:epic, type:story, type:task
 */

/**
 * Prepare type assignment
 */
export function prepareTypeAssignment(issue, analysis, suggestions) {
  if (!suggestions.type) {
    return {
      applied: false,
      reason: "No type suggestion available",
    };
  }

  const typeLabel = suggestions.type.suggestion;
  const currentType = issue.labels.find((l) => l.name.startsWith("type:"));

  return {
    applied: true,
    proposed: typeLabel,
    current: currentType?.name || null,
    confidence: suggestions.type.confidence,
    reason: suggestions.type.reason,
    needsUpdate: currentType?.name !== typeLabel,
    labelsToAdd: [typeLabel],
    labelsToRemove: currentType ? [currentType.name] : [],
  };
}

/**
 * Apply type assignment
 */
export async function applyTypeAssignment(issue, assignment, githubAPI) {
  if (!assignment.applied) {
    return {
      status: "skipped",
      reason: assignment.reason,
    };
  }

  if (!assignment.needsUpdate) {
    return {
      status: "already-assigned",
      currentType: assignment.current,
    };
  }

  try {
    const newLabels = [
      ...issue.labels.map((l) => l.name).filter((l) => !l.startsWith("type:")),
      ...assignment.labelsToAdd,
    ];

    await githubAPI.updateIssue(issue.number, {
      labels: newLabels,
    });

    const comment = `✅ **Type assigned:** ${assignment.proposed}\n> Confidence: ${assignment.confidence}%`;
    await githubAPI.postComment(issue.number, comment);

    return {
      success: true,
      applied: assignment.proposed,
      confidence: assignment.confidence,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Handler function for type assignment
 */
export async function handleNeedsType(issue, recommendations, options = {}) {
  const { githubAPI = null, dryRun = false, analysis = null } = options;

  if (!recommendations.type) {
    return {
      status: "skipped",
      reason: "No type suggestion available",
    };
  }

  const assignment = prepareTypeAssignment(issue, analysis, recommendations);

  if (dryRun) {
    return {
      status: "dry-run",
      message: "Would assign type",
      proposed: assignment.proposed,
      confidence: assignment.confidence,
    };
  }

  if (!githubAPI) {
    return {
      status: "error",
      error: "GitHub API not available",
    };
  }

  return await applyTypeAssignment(issue, assignment, githubAPI);
}
