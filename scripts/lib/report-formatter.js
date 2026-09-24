/**
 * report-formatter.js — Branch audit report formatting.
 *
 * Formats audit reports and deletion candidates as Markdown and JSON
 * per the contract specifications.
 *
 * @module scripts/lib/report-formatter
 */

/**
 * Format the audit report header with timestamp, run mode, and age threshold.
 * An invalid timestamp propagates a RangeError from toISOString.
 *
 * @param {object} auditReport - Report with timestamp, dryRun, and inactiveDays.
 * @returns {string} Markdown header, not a complete branch audit.
 * @throws {RangeError} When the timestamp is not a valid date.
 */
export function formatAuditReportMarkdown(auditReport) {
  const lines = [
    '# Branch Audit Report',
    '',
    `**Date:** ${new Date(auditReport.timestamp).toISOString()}`,
    `**Mode:** ${auditReport.dryRun ? 'Dry run (no deletions)' : 'Live execution'}`,
    `**Threshold:** ${auditReport.inactiveDays} days inactive`,
    '',
  ];

  return lines.join('\n');
}

/**
 * Serialize an audit report as indented JSON.
 *
 * @param {object} auditReport - Report to serialize.
 * @returns {string|undefined} JSON, or undefined for an unserializable top-level value.
 * @throws {TypeError} When JSON serialization encounters a cycle or BigInt.
 */
export function formatAuditReportJSON(auditReport) {
  return JSON.stringify(auditReport, null, 2);
}

/**
 * Serialize deletion candidates with their summary, timestamp, and repository.
 *
 * @param {object[]} candidates - Candidate records.
 * @param {object} summary - Summary to include alongside candidates.
 * @param {string} timestamp - Report timestamp.
 * @param {string} repository - Repository identifier.
 * @returns {string} Indented JSON report.
 * @throws {TypeError} When JSON serialization encounters a cycle or BigInt.
 */
export function formatDeletionCandidatesJSON(candidates, summary, timestamp, repository) {
  return JSON.stringify(
    {
      timestamp,
      repository,
      summary,
      candidates,
    },
    null,
    2
  );
}

/**
 * Format branches requiring manual review as a Markdown section.
 * Empty input displays "None"; missing age and type display as zero and
 * "unknown", respectively.
 *
 * @param {object[]} discussBranches - Branch records with name and reason.
 * @returns {string} DISCUSS section.
 */
export function formatDISCUSSSection(discussBranches) {
  const lines = ['## Manual Review Required (DISCUSS)', ''];

  if (discussBranches.length === 0) {
    lines.push('- None', '');
  } else {
    for (const branch of discussBranches) {
      lines.push(
        `### \`${branch.name}\``,
        `- **Reason:** ${branch.reason}`,
        `- **Age:** ${branch.ageInDays || 0} days`,
        `- **Type:** ${branch.type || 'unknown'}`,
        ''
      );
    }
  }

  return lines.join('\n');
}
