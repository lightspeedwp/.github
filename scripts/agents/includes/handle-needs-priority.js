/**
 * Handle-Needs-Priority Handler
 *
 * Assigns priority label based on analysis.
 * Handles: priority:critical, priority:important, priority:normal
 */

export async function handleNeedsPriority(
  issue,
  recommendations,
  options = {},
) {
  const { githubAPI = null, dryRun = false } = options;

  if (!recommendations.priority) {
    return {
      status: "skipped",
      reason: "No priority suggestion available",
    };
  }

  const priorityLabel = recommendations.priority.level;

  if (!dryRun && githubAPI) {
    const newLabels = [
      ...issue.labels
        .map((l) => l.name)
        .filter((l) => !l.startsWith("priority:")),
      priorityLabel,
    ];

    await githubAPI.updateIssue(issue.number, {
      labels: newLabels,
    });

    const comment = `✅ **Priority assigned:** ${priorityLabel}\n> Confidence: ${recommendations.priority.confidence}%`;
    await githubAPI.postComment(issue.number, comment);

    return {
      success: true,
      applied: priorityLabel,
      confidence: recommendations.priority.confidence,
    };
  }

  return {
    status: dryRun ? "dry-run" : "skipped",
    proposed: priorityLabel,
    confidence: recommendations.priority.confidence,
  };
}
