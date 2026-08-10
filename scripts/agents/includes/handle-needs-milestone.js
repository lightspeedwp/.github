/**
 * Handle-Needs-Milestone Handler
 *
 * Assigns milestone based on version/release detection from issue.
 * Handles semantic versioning (v1.0, v2.1.0, etc.) and release references.
 */

export function prepareMilestoneAssignment(issue, suggestions) {
  if (!suggestions.milestone) {
    return {
      applied: false,
      reason: "No milestone suggestion available",
    };
  }

  return {
    applied: true,
    proposed: suggestions.milestone.suggestion,
    confidence: suggestions.milestone.confidence,
    reason: suggestions.milestone.reason,
    current: issue.milestone?.title || null,
    needsUpdate:
      !issue.milestone ||
      issue.milestone.title !== suggestions.milestone.suggestion,
  };
}

export async function handleNeedsMilestone(
  issue,
  recommendations,
  options = {},
) {
  const { githubAPI = null, dryRun = false } = options;

  if (!recommendations.milestone) {
    return {
      status: "skipped",
      reason: "No milestone suggestion available",
    };
  }

  const assignment = prepareMilestoneAssignment(issue, recommendations);

  if (!assignment.needsUpdate) {
    return {
      status: "already-assigned",
      currentMilestone: assignment.current,
    };
  }

  if (dryRun) {
    return {
      status: "dry-run",
      message: "Would assign milestone",
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

  try {
    await githubAPI.updateIssue(issue.number, {
      milestone: assignment.proposed,
    });

    const comment = `✅ **Milestone assigned:** ${assignment.proposed}\n> Confidence: ${assignment.confidence}%`;
    await githubAPI.postComment(issue.number, comment);

    return {
      success: true,
      assigned: assignment.proposed,
      confidence: assignment.confidence,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
