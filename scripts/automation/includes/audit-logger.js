/**
 * Audit Logger
 * Logs all label changes for tracking and debugging
 */

const fs = require('fs');
const path = require('path');

/**
 * Audit event types
 */
const EVENT_TYPES = {
  LABEL_ADDED: 'LABEL_ADDED',
  LABEL_REMOVED: 'LABEL_REMOVED',
  LABEL_CHANGED: 'LABEL_CHANGED',
  PHASE_ADVANCED: 'PHASE_ADVANCED',
  PHASE_ROLLED_BACK: 'PHASE_ROLLED_BACK',
  SYNC_COMPLETED: 'SYNC_COMPLETED',
  VALIDATION_WARNING: 'VALIDATION_WARNING',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EVENT_PROCESSED: 'EVENT_PROCESSED',
};

/**
 * Create audit log entry
 * @param {object} options - Audit event options
 * @returns {object} Audit log entry
 */
function createAuditEntry(options) {
  return {
    timestamp: new Date().toISOString(),
    type: options.type || 'UNKNOWN',
    issueNumber: options.issueNumber || null,
    prNumber: options.prNumber || null,
    actor: options.actor || 'system',
    event: options.event || null,
    details: {
      added: options.added || [],
      removed: options.removed || [],
      before: options.before || null,
      after: options.after || null,
      reason: options.reason || null,
    },
    metadata: {
      branch: options.branch || null,
      commit: options.commit || null,
      workflow: options.workflow || null,
    },
  };
}

/**
 * Format audit entry for human reading
 * @param {object} entry - Audit log entry
 * @returns {string} Formatted entry
 */
function formatAuditEntry(entry) {
  const issueRef = entry.issueNumber ? `#${entry.issueNumber}` : 'N/A';
  const prRef = entry.prNumber ? `PR #${entry.prNumber}` : 'N/A';

  let details = `[${entry.type}] ${entry.timestamp} | Issue: ${issueRef} | PR: ${prRef} | Actor: ${entry.actor}`;

  if (entry.details.reason) {
    details += ` | Reason: ${entry.details.reason}`;
  }

  if (entry.details.added.length > 0) {
    details += `\n  Added: ${entry.details.added.join(', ')}`;
  }

  if (entry.details.removed.length > 0) {
    details += `\n  Removed: ${entry.details.removed.join(', ')}`;
  }

  if (entry.event) {
    details += `\n  Event: ${entry.event}`;
  }

  return details;
}

/**
 * Write audit log to file
 * @param {array} entries - Array of audit log entries
 * @param {string} logPath - Path to log file
 */
function writeAuditLog(entries, logPath) {
  const logDir = path.dirname(logPath);

  // Ensure directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Write as JSONL (JSON Lines) format - one entry per line
  const content = entries
    .map(entry => JSON.stringify(entry))
    .join('\n');

  fs.writeFileSync(logPath, content, 'utf8');
}

/**
 * Read audit log from file
 * @param {string} logPath - Path to log file
 * @returns {array} Array of audit log entries
 */
function readAuditLog(logPath) {
  if (!fs.existsSync(logPath)) {
    return [];
  }

  const content = fs.readFileSync(logPath, 'utf8');
  if (!content.trim()) {
    return [];
  }

  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

/**
 * Append entry to audit log
 * @param {object} entry - Audit log entry
 * @param {string} logPath - Path to log file
 */
function appendAuditLog(entry, logPath) {
  const logDir = path.dirname(logPath);

  // Ensure directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Append to file
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf8');
}

/**
 * Filter audit log entries
 * @param {array} entries - Array of audit log entries
 * @param {object} filter - Filter criteria
 * @returns {array} Filtered entries
 */
function filterAuditLog(entries, filter) {
  return entries.filter(entry => {
    if (filter.type && entry.type !== filter.type) return false;
    if (filter.issueNumber && entry.issueNumber !== filter.issueNumber) return false;
    if (filter.prNumber && entry.prNumber !== filter.prNumber) return false;
    if (filter.actor && entry.actor !== filter.actor) return false;
    if (filter.startDate && new Date(entry.timestamp) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(entry.timestamp) > new Date(filter.endDate)) return false;
    return true;
  });
}

/**
 * Generate audit summary
 * @param {array} entries - Array of audit log entries
 * @returns {object} Audit summary
 */
function generateAuditSummary(entries) {
  const summary = {
    totalEvents: entries.length,
    byType: {},
    byActor: {},
    labelChanges: {
      added: {},
      removed: {},
    },
    timeRange: {
      start: entries.length > 0 ? entries[0].timestamp : null,
      end: entries.length > 0 ? entries[entries.length - 1].timestamp : null,
    },
  };

  entries.forEach(entry => {
    // Count by type
    summary.byType[entry.type] = (summary.byType[entry.type] || 0) + 1;

    // Count by actor
    summary.byActor[entry.actor] = (summary.byActor[entry.actor] || 0) + 1;

    // Track label changes
    entry.details.added.forEach(label => {
      summary.labelChanges.added[label] = (summary.labelChanges.added[label] || 0) + 1;
    });

    entry.details.removed.forEach(label => {
      summary.labelChanges.removed[label] = (summary.labelChanges.removed[label] || 0) + 1;
    });
  });

  return summary;
}

/**
 * Get audit trail for an issue
 * @param {array} entries - Array of audit log entries
 * @param {number} issueNumber - Issue number
 * @returns {array} Issue audit trail
 */
function getIssueAuditTrail(entries, issueNumber) {
  return entries.filter(e => e.issueNumber === issueNumber);
}

/**
 * Get phase progression history
 * @param {array} entries - Array of audit log entries
 * @param {number} issueNumber - Issue number
 * @returns {array} Phase progression events
 */
function getPhaseProgressionHistory(entries, issueNumber) {
  const issueTrail = getIssueAuditTrail(entries, issueNumber);
  return issueTrail.filter(e =>
    e.type === EVENT_TYPES.PHASE_ADVANCED ||
    e.type === EVENT_TYPES.PHASE_ROLLED_BACK
  );
}

module.exports = {
  EVENT_TYPES,
  createAuditEntry,
  formatAuditEntry,
  writeAuditLog,
  readAuditLog,
  appendAuditLog,
  filterAuditLog,
  generateAuditSummary,
  getIssueAuditTrail,
  getPhaseProgressionHistory,
};
