/**
 * AI Feedback Validation Helpers
 *
 * Validates:
 * - PR links to one or more GitHub issues
 * - FEEDBACK_RESPONSE.md exists and is properly formatted
 * - Feedback items have valid status markers
 * - Deferred feedback items reference followup issues
 */

/**
 * Validate AI feedback requirements for a PR
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - PR number
 * @param {string} prBody - PR body content
 * @returns {object} Validation result with passed status and issues
 */
async function validateAIFeedback(owner, repo, prNumber, prBody) {
  const validation = {
    passed: true,
    issues: {
      missingIssueLink: false,
      missingFeedbackResponse: false,
      incompleteFeedbackTracking: [],
      invalidStatus: [],
      deferredNoIssue: []
    }
  };

  // Check for issue links: "Resolves #123" or "Closes #123"
  const issueLinkPattern = /(?:Resolves|Closes|Fixes|Refs?)\s+#(\d+)/gi;
  const issueLinks = [];
  let match;

  while ((match = issueLinkPattern.exec(prBody)) !== null) {
    issueLinks.push(parseInt(match[1]));
  }

  if (issueLinks.length === 0) {
    validation.issues.missingIssueLink = true;
    validation.passed = false;
  }

  // Check for FEEDBACK_RESPONSE.md file
  const fs = require('fs');
  const feedbackResponsePath = 'FEEDBACK_RESPONSE.md';
  const hasFeedbackResponse = fs.existsSync(feedbackResponsePath);

  if (!hasFeedbackResponse) {
    // Note: missing feedback response is a warning, not a failure
    validation.issues.missingFeedbackResponse = true;
  }

  // Validate FEEDBACK_RESPONSE.md content if it exists
  if (hasFeedbackResponse) {
    const content = fs.readFileSync(feedbackResponsePath, 'utf8');
    const fileValidation = validateFeedbackResponseFile(content);

    if (!fileValidation.valid) {
      validation.issues.incompleteFeedbackTracking = fileValidation.errors;
      validation.passed = false;
    }

    // Check for invalid status markers
    const invalidStatuses = checkInvalidStatuses(content);
    if (invalidStatuses.length > 0) {
      validation.issues.invalidStatus = invalidStatuses;
      validation.passed = false;
    }

    // Check for deferred items without issue references
    const deferredWithoutIssue = checkDeferredWithoutIssue(content);
    if (deferredWithoutIssue.length > 0) {
      validation.issues.deferredNoIssue = deferredWithoutIssue;
      // This is a warning, not a failure
    }
  }

  return validation;
}

/**
 * Validate FEEDBACK_RESPONSE.md file structure
 * @param {string} content - File content
 * @returns {object} Validation result with valid flag and errors array
 */
function validateFeedbackResponseFile(content) {
  const errors = [];

  // Check for required sections
  const hasHeader = /^#\s+AI\s+Feedback\s+Response/mi.test(content);
  if (!hasHeader) {
    errors.push('Missing "# AI Feedback Response" header');
  }

  // Check for feedback table or list
  const hasFeedbackSection =
    /^##\s+(Feedback|Addressed|In\s+Progress)/mi.test(content) ||
    /\|\s*Feedback\s*\|/.test(content);

  if (!hasFeedbackSection) {
    errors.push('Missing feedback tracking section (table or list)');
  }

  // Check for status tracking (at least one status marker)
  const hasStatusMarkers = /(?:✅|📋|❌)\s+(?:Addressed|Deferred|Rejected)/i.test(content);
  if (!hasStatusMarkers) {
    errors.push('No feedback status markers found (use ✅ Addressed, 📋 Deferred, or ❌ Rejected)');
  }

  // Check for completeness marker or status summary
  const isComplete =
    /(?:All\s+)?feedback\s+(?:items\s+)?(?:addressed|completed|resolved)/i.test(content) ||
    /(?:Outstanding|Pending|Remaining)\s+feedback/i.test(content);

  if (!isComplete) {
    errors.push('Missing completion status (document should indicate if all feedback is addressed)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check for invalid status markers in feedback response
 * @param {string} content - File content
 * @returns {array} Array of invalid status descriptions
 */
function checkInvalidStatuses(content) {
  const invalidStatuses = [];

  // Pattern for status markers followed by text
  const statusPattern = /^[^✅📋❌]*([✅📋❌])\s+(.+?)(?=\n|$)/gm;
  let match;
  const validStatusTexts = ['addressed', 'deferred', 'rejected'];

  while ((match = statusPattern.exec(content)) !== null) {
    const statusText = match[2].toLowerCase();

    // Check if status text is one of the valid ones
    if (!validStatusTexts.some(valid => statusText.includes(valid))) {
      // Only flag if it looks like a status line (followed by description or issue number)
      if (/^(addressed|deferred|rejected|fixed|pending|todo|wip|done|open)/i.test(statusText)) {
        invalidStatuses.push(
          `Line ${content.substring(0, match.index).split('\n').length}: "${match[0].trim()}" — use ✅ Addressed, 📋 Deferred, or ❌ Rejected`
        );
      }
    }
  }

  return invalidStatuses;
}

/**
 * Check for deferred feedback without issue references
 * @param {string} content - File content
 * @returns {array} Array of deferred items without issue references
 */
function checkDeferredWithoutIssue(content) {
  const deferredWithoutIssue = [];
  const issuePattern = /#\d+/;

  // Split by lines and find deferred items
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/📋\s+deferred/i.test(line)) {
      // Check if this line or the next few lines contain an issue reference
      const context = [line, lines[i + 1] || '', lines[i + 2] || ''].join(' ');

      if (!issuePattern.test(context)) {
        deferredWithoutIssue.push(
          `Line ${i + 1}: Deferred feedback should reference a followup issue (e.g., #123)`
        );
      }
    }
  }

  return deferredWithoutIssue;
}

module.exports = {
  validateAIFeedback,
  validateFeedbackResponseFile,
  checkInvalidStatuses,
  checkDeferredWithoutIssue
};
