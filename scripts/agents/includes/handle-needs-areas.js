/**
 * Handle-Needs-Areas Handler
 *
 * Assigns area labels based on analysis.
 * Handles: area:frontend, area:backend, area:ci, area:docs, area:security
 */

/**
 * Prepare area label assignments
 */
export function prepareAreaAssignments(issue, suggestions) {
  if (!suggestions.areas || suggestions.areas.length === 0) {
    return {
      applied: false,
      reason: "No area suggestions available",
    };
  }

  // Get current area labels
  const currentAreas = issue.labels.filter((l) => l.name.startsWith("area:"));
  const currentAreaNames = currentAreas.map((l) => l.name);

  // Filter suggestions above minimum confidence threshold
  const qualityAreas = suggestions.areas.filter((a) => a.confidence >= 70);

  // Prepare labels to add and remove
  const labelsToAdd = qualityAreas
    .map((a) => a.label)
    .filter((label) => !currentAreaNames.includes(label));

  const currentOnlyLabels = currentAreaNames.filter(
    (label) => !qualityAreas.map((a) => a.label).includes(label),
  );

  return {
    applied: true,
    proposed: qualityAreas,
    current: currentAreas,
    labelsToAdd,
    labelsToRemove: currentOnlyLabels,
    needsUpdate: labelsToAdd.length > 0 || currentOnlyLabels.length > 0,
  };
}

/**
 * Apply area assignments
 */
export async function applyAreaAssignments(issue, assignments, githubAPI) {
  if (!assignments.applied) {
    return {
      status: "skipped",
      reason: assignments.reason,
    };
  }

  if (!assignments.needsUpdate) {
    return {
      status: "already-assigned",
      currentAreas: assignments.current.map((l) => l.name),
    };
  }

  try {
    // Build new labels list
    const baseLabels = issue.labels
      .map((l) => l.name)
      .filter((l) => !l.startsWith("area:"));

    const newLabels = [...new Set([...baseLabels, ...assignments.labelsToAdd])];

    await githubAPI.updateIssue(issue.number, {
      labels: newLabels,
    });

    // Post comment with area assignments
    let comment = `✅ **Areas assigned:**\n`;
    assignments.proposed.forEach((area) => {
      comment += `- ${area.label} (${area.confidence}%)\n`;
    });

    await githubAPI.postComment(issue.number, comment);

    return {
      success: true,
      applied: assignments.proposed.map((a) => a.label),
      confidences: assignments.proposed.map((a) => ({
        label: a.label,
        confidence: a.confidence,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Handler function for area assignment
 */
export async function handleNeedsAreas(issue, recommendations, options = {}) {
  const { githubAPI = null, dryRun = false } = options;

  if (!recommendations.areas || recommendations.areas.length === 0) {
    return {
      status: "skipped",
      reason: "No area suggestions available",
    };
  }

  const assignments = prepareAreaAssignments(issue, recommendations);

  if (dryRun) {
    return {
      status: "dry-run",
      message: "Would assign areas",
      proposed: assignments.proposed.map((a) => a.label),
      count: assignments.proposed.length,
    };
  }

  if (!githubAPI) {
    return {
      status: "error",
      error: "GitHub API not available",
    };
  }

  return await applyAreaAssignments(issue, assignments, githubAPI);
}
