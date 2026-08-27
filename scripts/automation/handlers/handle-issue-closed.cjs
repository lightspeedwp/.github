/**
 * Handle Issue Closed Event
 * Processes when an issue is closed
 * - Preserve OpenSpec labels for historical tracking
 * - Generate final audit report
 * - Archive issue metadata
 */

const auditLogger = require("../includes/audit-logger.cjs");
const labelValidator = require("../includes/label-validator.cjs");

const OWNER = "lightspeedwp";
const REPO = ".github";

/**
 * Handle issue closed event
 * @param {object} issue - Issue object from GitHub API
 * @returns {object} Result of handling
 */
function handleIssueClosed(issue) {
  const result = {
    success: true,
    issueNumber: issue.number,
    closedIssue: issue.title,
    changes: [],
    warnings: [],
    errors: [],
  };

  try {
    const currentLabels = issue.labels.map((l) => l.name);
    const openspecLabel = labelValidator.getOpenSpecLabel(currentLabels);

    if (openspecLabel) {
      result.changes.push({
        type: "label-preservation",
        label: openspecLabel,
        message: `OpenSpec label preserved for historical tracking: ${openspecLabel}`,
      });
    } else {
      result.warnings.push("Issue has no OpenSpec label at closure");
    }

    // Generate final audit report
    const auditReport = generateFinalAuditReport(issue.number);
    if (auditReport) {
      result.changes.push({
        type: "audit-report",
        report: auditReport,
      });
    }

    // Log closure event
    auditLogger.logEvent({
      issueNumber: issue.number,
      eventType: "issue-closed",
      action: "closure",
      label: openspecLabel || "none",
      timestamp: new Date().toISOString(),
      reason: "Issue closure - preserving labels for historical tracking",
    });

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error.message);
    return result;
  }
}

/**
 * Generate final audit report for closed issue
 * @param {number} issueNumber - Issue number
 * @returns {object|null} Audit report or null
 */
function generateFinalAuditReport(issueNumber) {
  try {
    const auditTrail = auditLogger.getIssueAuditTrail(issueNumber);

    if (auditTrail.length === 0) {
      return null;
    }

    const phaseTransitions = auditTrail.filter(
      (e) =>
        e.action === "phase-progression" || e.action === "phase-completion",
    );

    const report = {
      issueNumber,
      totalEvents: auditTrail.length,
      eventTypes: auditTrail.reduce((acc, e) => {
        acc[e.eventType] = (acc[e.eventType] || 0) + 1;
        return acc;
      }, {}),
      phaseTransitions: phaseTransitions.length,
      timeline: {
        firstEvent: auditTrail[0]?.timestamp,
        lastEvent: auditTrail[auditTrail.length - 1]?.timestamp,
        duration: calculateDuration(
          auditTrail[0]?.timestamp,
          auditTrail[auditTrail.length - 1]?.timestamp,
        ),
      },
      transitions: phaseTransitions.map((e) => ({
        from: e.previousState,
        to: e.nextState,
        timestamp: e.timestamp,
      })),
    };

    return report;
  } catch (error) {
    console.error(
      `Failed to generate audit report for issue #${issueNumber}:`,
      error.message,
    );
    return null;
  }
}

/**
 * Calculate duration between two timestamps
 * @param {string} startTime - ISO 8601 timestamp
 * @param {string} endTime - ISO 8601 timestamp
 * @returns {string|null} Human-readable duration or null
 */
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return null;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    // Convert to human-readable format
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  } catch (error) {
    console.error("Failed to calculate duration:", error.message);
    return null;
  }
}

/**
 * Archive issue metadata (for historical reference)
 * @param {number} issueNumber - Issue number
 * @param {object} metadata - Issue metadata to archive
 * @returns {boolean} Success
 */
function archiveIssueMetadata(issueNumber, metadata) {
  try {
    const archiveEntry = {
      issueNumber,
      archivedAt: new Date().toISOString(),
      metadata,
    };

    // Log to audit logger
    auditLogger.logEvent({
      issueNumber,
      eventType: "archive",
      action: "metadata-archive",
      metadata: archiveEntry,
      timestamp: new Date().toISOString(),
      reason: "Archiving issue metadata for historical reference",
    });

    return true;
  } catch (error) {
    console.error(
      `Failed to archive metadata for issue #${issueNumber}:`,
      error.message,
    );
    return false;
  }
}

module.exports = {
  handleIssueClosed,
  generateFinalAuditReport,
  calculateDuration,
  archiveIssueMetadata,
};
