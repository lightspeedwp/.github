/**
 * Handle-Needs-Assignee Handler
 *
 * Assigns suggested users/teams to issues.
 * Uses confidence-scored assignee suggestions from analysis.
 */

export function prepareAssigneeAssignment(issue, suggestions) {
  if (!suggestions.assignees || suggestions.assignees.length === 0) {
    return {
      applied: false,
      reason: "No assignee suggestions available",
    };
  }

  // Filter suggestions above confidence threshold
  const qualityAssignees = suggestions.assignees.filter(
    (a) => a.confidence >= 75,
  );

  // Remove @ symbol for GitHub API
  const assignees = qualityAssignees.map((a) => a.assignee.replace(/^@/, ""));

  // Get current assignees
  const currentAssignees = issue.assignees.map((a) => a.login);

  // Find assignees to add
  const assigneesToAdd = assignees.filter((a) => !currentAssignees.includes(a));

  return {
    applied: true,
    proposed: qualityAssignees,
    current: currentAssignees,
    assigneesToAdd,
    needsUpdate: assigneesToAdd.length > 0,
  };
}

export async function handleNeedsAssignee(
  issue,
  recommendations,
  options = {},
) {
  const { githubAPI = null, dryRun = false } = options;

  if (!recommendations.assignees || recommendations.assignees.length === 0) {
    return {
      status: "skipped",
      reason: "No assignee suggestions available",
    };
  }

  const assignment = prepareAssigneeAssignment(issue, recommendations);

  if (!assignment.needsUpdate) {
    return {
      status: "already-assigned",
      currentAssignees: assignment.current,
    };
  }

  if (dryRun) {
    return {
      status: "dry-run",
      message: "Would assign users",
      proposed: assignment.proposed.map((a) => a.assignee),
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
      assignees: [...assignment.current, ...assignment.assigneesToAdd],
    });

    let comment = `✅ **Assignees suggested:**\n`;
    assignment.proposed.forEach((assignee) => {
      comment += `- ${assignee.assignee} (${assignee.confidence}% — ${assignee.reason})\n`;
    });

    await githubAPI.postComment(issue.number, comment);

    return {
      success: true,
      assigned: assignment.assigneesToAdd,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
