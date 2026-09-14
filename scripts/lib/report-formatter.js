/**
 * report-formatter.js — Branch audit report formatting.
 *
 * Formats audit reports and deletion candidates as Markdown and JSON
 * per the contract specifications.
 *
 * @module scripts/lib/report-formatter
 */

export function formatAuditReportMarkdown(auditReport) {
  const lines = [
    "# Branch Audit Report",
    "",
    `**Date:** ${new Date(auditReport.timestamp).toISOString()}`,
    `**Mode:** ${auditReport.dryRun ? "Dry run (no deletions)" : "Live execution"}`,
    `**Threshold:** ${auditReport.inactiveDays} days inactive`,
    "",
  ];

  return lines.join("\n");
}

export function formatAuditReportJSON(auditReport) {
  return JSON.stringify(auditReport, null, 2);
}

export function formatDeletionCandidatesJSON(candidates, summary, timestamp, repository) {
  return JSON.stringify(
    {
      timestamp,
      repository,
      summary,
      candidates,
    },
    null,
    2,
  );
}

export function formatDISCUSSSection(discussBranches) {
  const lines = ["## Manual Review Required (DISCUSS)", ""];

  if (discussBranches.length === 0) {
    lines.push("- None", "");
  } else {
    for (const branch of discussBranches) {
      lines.push(
        `### \`${branch.name}\``,
        `- **Reason:** ${branch.reason}`,
        `- **Age:** ${branch.ageInDays || 0} days`,
        `- **Type:** ${branch.type || "unknown"}`,
        "",
      );
    }
  }

  return lines.join("\n");
}
