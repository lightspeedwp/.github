#!/usr/bin/env node

/**
 * Locked-file approval guard (spec 008, task T080; constitution Principle II).
 *
 * A pull request that changes a LOCKED file may merge only after its change
 * request is approved. The PR body must link the change-request issue, and
 * that issue must either be recorded as `approved` in the spec 008
 * change-request register or carry an approval comment by the approver.
 *
 * The workflow `.github/workflows/locked-files-guard.yml` runs this module
 * from the base branch, and reads the register from the base branch too, so
 * a pull request cannot approve itself by editing either file.
 *
 * @module scripts/validation/check-locked-file-approval
 */

'use strict';

/** Constitution v1.4.0 LOCKED files. */
const LOCKED_PATTERNS = [
  /^\.github\/labels\.yml$/,
  /^\.github\/issue-types\.yml$/,
  /^\.github\/ISSUE_TEMPLATE\/[^/]+\.md$/,
  /^\.github\/PULL_REQUEST_TEMPLATE\/[^/]+\.md$/,
  /^\.github\/PULL_REQUEST_TEMPLATE\/config\.yml$/,
  /^\.github\/branch-types\.yml$/,
  /^\.github\/branch-labels\.yml$/,
];

/** The GitHub login whose approval counts (constitution: Approval Authority). */
const APPROVER = 'ashleyshaw';

/** Path of the spec 008 change-request register. */
const REGISTER_PATH = '.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json';

/**
 * @param {string} file Repository-relative path.
 * @returns {boolean} True when the file is LOCKED.
 */
function isLocked(file) {
  return LOCKED_PATTERNS.some((pattern) => pattern.test(file));
}

/**
 * Issue numbers referenced in a pull request body (`#123` or an issue URL in
 * this repository). Code spans and HTML comments are ignored.
 * @param {string} body Pull request body.
 * @param {string} [repo] `owner/name`, to match full issue URLs.
 * @returns {number[]} Unique issue numbers, in order of appearance.
 */
function referencedIssues(body, repo = 'lightspeedwp/.github') {
  const text = String(body || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/`[^`]*`/g, ' ');
  const numbers = [];
  for (const match of text.matchAll(/(?:^|[^\w&/])#(\d+)\b/g)) {
    numbers.push(Number(match[1]));
  }
  const escaped = repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const url = new RegExp(`https://github\\.com/${escaped}/issues/(\\d+)\\b`, 'g');
  for (const match of text.matchAll(url)) {
    numbers.push(Number(match[1]));
  }
  return [...new Set(numbers)];
}

/**
 * Issue numbers recorded as approved in the change-request register.
 * @param {object|null} register Parsed register (`{ requests: [...] }`).
 * @returns {Set<number>} Approved issue numbers.
 */
function approvedInRegister(register) {
  const requests = (register && Array.isArray(register.requests) && register.requests) || [];
  return new Set(
    requests
      .filter((request) => request && request.status === 'approved')
      .map((request) => Number(request.issue_number))
      .filter(Number.isInteger)
  );
}

/**
 * True when a comment is the approver's approval.
 * @param {{user?: {login?: string}, body?: string}} comment Issue comment.
 * @returns {boolean}
 */
function isApprovalComment(comment) {
  return (
    Boolean(comment) &&
    comment.user &&
    comment.user.login === APPROVER &&
    /^\s*approved\b/i.test(String(comment.body || ''))
  );
}

/**
 * Decide whether a pull request may merge.
 * @param {object} input
 * @param {string[]} input.changedFiles Paths the pull request changes.
 * @param {string} input.body Pull request body.
 * @param {object|null} input.register Change-request register from the base branch.
 * @param {Record<number, Array<object>>} [input.commentsByIssue] Comments on each referenced issue.
 * @returns {{locked: string[], issues: number[], approvedBy: Record<number, string>, ok: boolean, message: string}}
 */
function evaluate({ changedFiles, body, register, commentsByIssue = {} }) {
  const locked = changedFiles.filter(isLocked);
  const issues = referencedIssues(body);
  if (locked.length === 0) {
    return { locked, issues, approvedBy: {}, ok: true, message: 'No locked file changed.' };
  }

  const approved = approvedInRegister(register);
  const approvedBy = {};
  for (const issue of issues) {
    if (approved.has(issue)) {
      approvedBy[issue] = 'change-request register';
    } else if ((commentsByIssue[issue] || []).some(isApprovalComment)) {
      approvedBy[issue] = `approval comment by @${APPROVER}`;
    }
  }

  const ok = Object.keys(approvedBy).length > 0;
  const list = locked.map((file) => `\`${file}\``).join(', ');
  const message = ok
    ? `Locked files changed (${list}); approved through ${Object.entries(approvedBy)
        .map(([issue, how]) => `#${issue} (${how})`)
        .join(', ')}.`
    : `Locked files changed (${list}), but no linked change request is approved. ` +
      `Link the [LABEL-UPDATE-REQUEST], [ISSUE-TYPE-UPDATE-REQUEST] or [TEMPLATE-UPDATE-REQUEST] issue ` +
      `in the PR body, and get it approved by @${APPROVER} (constitution Principle II).`;
  return { locked, issues, approvedBy, ok, message };
}

module.exports = {
  APPROVER,
  LOCKED_PATTERNS,
  REGISTER_PATH,
  approvedInRegister,
  evaluate,
  isApprovalComment,
  isLocked,
  referencedIssues,
};
