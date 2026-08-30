/**
 * Integration workflow helpers for PR triage to label sync pipeline
 * These functions represent the workflow logic combining triage and label sync operations
 */

/**
 * Triage PRs and extract issue links
 */
export function triageAndExtractIssues(prs) {
  const triaged = [];

  prs.forEach((pr) => {
    const issues = [];
    const regex = /#(\d+)/g;
    let match;
    while ((match = regex.exec(pr.body || "")) !== null) {
      issues.push(parseInt(match[1], 10));
    }

    const triage = {
      prNumber: pr.number,
      title: pr.title,
      author: pr.user?.login,
      linkedIssues: [...new Set(issues)],
      needsReview:
        pr.labels?.some((l) => l.name === "status:needs-review") || false,
      needsChangelog:
        pr.labels?.some((l) => l.name === "meta:needs-changelog") || false,
    };

    triaged.push(triage);
  });

  return triaged;
}

/**
 * Sync labels based on triage results
 */
export function syncLabelsBasedOnIssues(prs, triageData) {
  const syncResults = {
    labelsAdded: 0,
    labelsRemoved: 0,
    prsSynced: [],
    errors: [],
  };

  prs.forEach((pr) => {
    try {
      const triage = triageData.find((t) => t.prNumber === pr.number);
      if (!triage) return;

      const changes = {
        prNumber: pr.number,
        labelChanges: [],
      };

      // Add meta:has-pr label if PR has linked issues
      if (triage.linkedIssues.length > 0) {
        if (!pr.labels?.some((l) => l.name === "meta:has-pr")) {
          syncResults.labelsAdded++;
          changes.labelChanges.push("add:meta:has-pr");
        }
      } else {
        // Remove meta:has-pr if no linked issues
        if (pr.labels?.some((l) => l.name === "meta:has-pr")) {
          syncResults.labelsRemoved++;
          changes.labelChanges.push("remove:meta:has-pr");
        }
      }

      if (changes.labelChanges.length > 0) {
        syncResults.prsSynced.push(changes);
      }
    } catch (error) {
      syncResults.errors.push({
        prNumber: pr.number,
        error: error.message,
      });
    }
  });

  return syncResults;
}

/**
 * Generate summary for triage workflow
 */
export function generateTriageSummary(triageData, syncResults) {
  return {
    totalPRs: triageData.length,
    prsWithLinkedIssues: triageData.filter((t) => t.linkedIssues.length > 0)
      .length,
    prsNeedingReview: triageData.filter((t) => t.needsReview).length,
    prsNeedingChangelog: triageData.filter((t) => t.needsChangelog).length,
    totalLinkedIssues: triageData.reduce(
      (sum, t) => sum + t.linkedIssues.length,
      0,
    ),
    labelSyncStats: {
      added: syncResults.labelsAdded,
      removed: syncResults.labelsRemoved,
      synced: syncResults.prsSynced.length,
    },
  };
}
