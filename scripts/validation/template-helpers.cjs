// Shared template validation helpers for GitHub Actions workflows
// Used by: validate-pr-template.yml, template-enforcement.yml

/**
 * Removes all HTML comments from text.
 * @param {string} text - The text to clean.
 * @returns {string} Text with HTML comments removed.
 */
function stripHtmlComments(text) {
  return (text || '').replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Extracts content between a heading and the next heading at the same or higher level.
 * @param {string} body - The document body to search.
 * @param {RegExp} headingRegex - Regex to match the target heading.
 * @returns {string} Content between the heading and the next heading (trimmed).
 */
function sectionBody(body, headingRegex) {
  const text = (body || '').replace(/\r\n/g, '\n');
  const match = text.match(headingRegex);
  if (!match || match.index === undefined) {
    return '';
  }

  // Extract heading level from the matched heading (count # symbols)
  const headingLevel = match[0].match(/^#+/)[0].length;

  const start = match.index + match[0].length;
  const remainder = text.slice(start);
  // Only look for headings at same or higher level (fewer or equal # symbols)
  const nextHeadingRegex = new RegExp(`^#{1,${headingLevel}}\\s+.+$`, 'm');
  const nextHeading = remainder.match(nextHeadingRegex);
  const end = nextHeading ? start + nextHeading.index : text.length;
  return text.slice(start, end).trim();
}

/**
 * Detects whether text contains a GitHub issue or pull request reference.
 * Supports same-repo (#123), cross-repo (owner/repo#123), and full URLs.
 * @param {string} sectionText - The text to search.
 * @returns {boolean} True if an issue reference is found.
 */
function hasIssueReference(sectionText) {
  const cleaned = stripHtmlComments(sectionText);
  // Matches same-repo (#123) or cross-repo (owner/repo#123) issue references (optionally preceded by
  // GitHub closing keywords) at the start of a line, plus full GitHub issue/PR URLs anywhere in the text.
  return /(?:^|\n)\s*(?:[-*]\s*)?(?:(?:closes|fixes|resolves|relates to)\s+)?(?:[\w.-]+\/[\w.-]+)?#\d+\b/i.test(cleaned)
    || /https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(?:issues|pull)\/\d+\b/.test(cleaned);
}

/**
 * Detects whether text contains a non-placeholder changelog entry.
 * @param {string} sectionText - The text to search.
 * @returns {boolean} True if a valid changelog entry exists.
 */
function hasChangelogEntry(sectionText) {
  const cleaned = stripHtmlComments(sectionText);
  return /(?:^|\n)\s*[-*]\s+(?!\[?\s*placeholder\s*\]?)(?:.+\S)/im.test(cleaned);
}

/**
 * Detects whether all checklist items are checked.
 * Returns false if any items are unchecked or no checklist exists.
 * @param {string} sectionText - The text to search.
 * @returns {boolean} True if all checklist items are checked.
 */
function hasCompletedChecklist(sectionText) {
  const cleaned = stripHtmlComments(sectionText);
  const hasUnchecked = /(?:^|\n)\s*-\s*\[\s\]\s*/.test(cleaned);
  const hasChecked = /(?:^|\n)\s*-\s*\[[xX]\]\s*/.test(cleaned);
  return hasChecked && !hasUnchecked;
}

/**
 * Extracts all linked issue numbers from text.
 * Supports all GitHub closing keywords (close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved).
 * Supports relating keyword (relates to).
 * Optional colons after keywords are supported: e.g. "Closes: #123" or "fixes #123".
 * Handles same-repo (#123) and cross-repo (owner/repo#123) references.
 * Returns deduplicated array of issue numbers.
 * @param {string} text - The text to parse.
 * @returns {number[]} Array of unique issue numbers.
 */
function extractIssueNumbers(text) {
  const cleaned = stripHtmlComments(text);
  const issuePattern = /\b(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved|relates\s+to):?\s+(?:[\w.-]+\/[\w.-]+)?#(\d+)|#(\d+)/gi;
  const issues = [];
  let match;

  while ((match = issuePattern.exec(cleaned)) !== null) {
    const issueNum = match[1] || match[2];
    if (issueNum) {
      issues.push(parseInt(issueNum, 10));
    }
  }

  return [...new Set(issues)]; // Remove duplicates
}

/**
 * Extracts issue numbers that are being closed (not merely related).
 * Recognizes all GitHub closing keywords (close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved).
 * Optional colons after keywords are supported: e.g. "Closes: #123" or "fixes #123".
 * Ignores "relates to" keyword which does not close issues.
 * Handles same-repo (#123) and cross-repo (owner/repo#123) references.
 * Returns deduplicated array of issue numbers.
 * @param {string} text - The text to parse.
 * @returns {number[]} Array of unique issue numbers being closed.
 */
function extractClosingIssueNumbers(text) {
  const cleaned = stripHtmlComments(text);
  const closingPattern = /\b(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved):?\s+(?:[\w.-]+\/[\w.-]+)?#(\d+)/gi;
  const issues = [];
  let match;

  while ((match = closingPattern.exec(cleaned)) !== null) {
    issues.push(parseInt(match[1], 10));
  }

  return [...new Set(issues)]; // Remove duplicates
}

/**
 * Validates that a PR body contains all required sections and content.
 * Release branches check for "Linked issues & merged PRs" instead of "Linked issues".
 * Changelog section is skipped if the PR has the "meta:no-changelog" label.
 * @param {string} body - The PR body text.
 * @param {Array} labels - Array of label objects with 'name' property.
 * @param {string} headRef - The PR head branch name (used to detect release branches).
 * @returns {object} Object with 'missing' array listing absent required sections.
 */
function validatePullRequestBody(body, labels, headRef) {
  const labelNames = new Set((labels || []).map((label) => label.name));
  const missing = [];
  const isReleaseBranch = /^release\//i.test(String(headRef || ''));

  const linkedIssues = sectionBody(
    body,
    isReleaseBranch
      ? /^##\s+Linked issues\s*&\s*merged PRs\s*$/im
      : /^##\s+Linked issues\s*$/im
  );
  if (!hasIssueReference(linkedIssues)) {
    missing.push(isReleaseBranch ? 'Linked issues & merged PRs' : 'Linked issues');
  }

  const changelog = sectionBody(body, /^##\s+Changelog\s*$/im);
  if (!labelNames.has('meta:no-changelog') && !hasChangelogEntry(changelog)) {
    missing.push('Changelog');
  }

  const checklist = sectionBody(
    body,
    /^###\s+Checklist\s+\(Global DoD\s*\/\s*PR\)\s*$/im
  );
  if (!hasCompletedChecklist(checklist)) {
    missing.push('Global DoD checklist');
  }

  return { missing };
}

module.exports = {
  stripHtmlComments,
  sectionBody,
  hasIssueReference,
  hasChangelogEntry,
  hasCompletedChecklist,
  extractIssueNumbers,
  extractClosingIssueNumbers,
  validatePullRequestBody
};
