// Shared template validation helpers for GitHub Actions workflows
// Used by: validate-pr-template.yml, template-enforcement.yml

function stripHtmlComments(text) {
  return (text || '').replace(/<!--[\s\S]*?-->/g, '');
}

function sectionBody(body, headingRegex) {
  const text = (body || '').replace(/\r\n/g, '\n');
  const match = text.match(headingRegex);
  if (!match || match.index === undefined) {
    return '';
  }

  const start = match.index + match[0].length;
  const remainder = text.slice(start);
  const nextHeading = remainder.match(/^#+\s+.+$/m);
  const end = nextHeading ? start + nextHeading.index : text.length;
  return text.slice(start, end).trim();
}

function hasIssueReference(sectionText) {
  const cleaned = stripHtmlComments(sectionText);
  // Matches same-repo (#123) or cross-repo (owner/repo#123) issue references (optionally preceded by
  // GitHub closing keywords) at the start of a line, plus full GitHub issue/PR URLs anywhere in the text.
  return /(?:^|\n)\s*(?:[-*]\s*)?(?:(?:closes|fixes|resolves|relates to)\s+)?(?:[\w.-]+\/[\w.-]+)?#\d+\b/i.test(cleaned)
    || /https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(?:issues|pull)\/\d+\b/.test(cleaned);
}

function hasChangelogEntry(sectionText) {
  const cleaned = stripHtmlComments(sectionText);
  return /(?:^|\n)\s*[-*]\s+(?!\[?\s*placeholder\s*\]?)(?:.+\S)/im.test(cleaned);
}

function hasCompletedChecklist(sectionText) {
  const cleaned = stripHtmlComments(sectionText);
  const hasUnchecked = /(?:^|\n)\s*-\s*\[\s\]\s*/.test(cleaned);
  const hasChecked = /(?:^|\n)\s*-\s*\[[xX]\]\s*/.test(cleaned);
  return hasChecked && !hasUnchecked;
}

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
  validatePullRequestBody
};
