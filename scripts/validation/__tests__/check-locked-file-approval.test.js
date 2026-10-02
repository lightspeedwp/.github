/**
 * Tests for the locked-file approval guard (spec 008, task T080).
 */

const {
  APPROVER,
  approvedInRegister,
  evaluate,
  isApprovalComment,
  isLocked,
  referencedIssues,
} = require('../check-locked-file-approval.cjs');

const register = {
  requests: [
    { issue_number: 3556, status: 'approved' },
    { issue_number: 3557, status: 'pending' },
  ],
};

describe('check-locked-file-approval', () => {
  test.each([
    '.github/labels.yml',
    '.github/issue-types.yml',
    '.github/ISSUE_TEMPLATE/06-decision.md',
    '.github/PULL_REQUEST_TEMPLATE/pr_aiops.md',
    '.github/PULL_REQUEST_TEMPLATE/config.yml',
    '.github/branch-types.yml',
    '.github/branch-labels.yml',
  ])('treats %s as locked', (file) => {
    expect(isLocked(file)).toBe(true);
  });

  test.each([
    '.github/labeler.yml',
    '.github/ISSUE_TEMPLATE/config.yml',
    '.github/workflows/labeling-unified.yml',
    'docs/LABEL_STRATEGY.md',
    'labels.yml',
  ])('does not treat %s as locked', (file) => {
    expect(isLocked(file)).toBe(false);
  });

  test('finds issue references and ignores code spans, comments and URLs to other repositories', () => {
    const body = [
      'Closes #3729',
      'Relates to https://github.com/lightspeedwp/.github/issues/3556',
      'Not this: `#999`, <!-- #998 -->, https://github.com/other/repo/issues/997, a&#35;1',
      'Part of #449 and #3729 again',
    ].join('\n');
    expect(referencedIssues(body)).toEqual([3729, 449, 3556]);
  });

  test('reads approved requests from the register and tolerates a missing one', () => {
    expect([...approvedInRegister(register)]).toEqual([3556]);
    expect(approvedInRegister(null).size).toBe(0);
  });

  test('accepts only the approver’s comment that starts with "Approved"', () => {
    expect(
      isApprovalComment({ user: { login: APPROVER }, body: 'Approved 2026-10-02: all of it' })
    ).toBe(true);
    expect(isApprovalComment({ user: { login: 'someone-else' }, body: 'Approved' })).toBe(false);
    expect(isApprovalComment({ user: { login: APPROVER }, body: 'Not approved yet' })).toBe(false);
  });

  test('passes when no locked file changes', () => {
    const result = evaluate({ changedFiles: ['docs/README.md'], body: '', register });
    expect(result.ok).toBe(true);
    expect(result.locked).toEqual([]);
  });

  test('fails a locked-file change with no linked approved request', () => {
    const result = evaluate({
      changedFiles: ['.github/labels.yml', 'docs/LABEL_STRATEGY.md'],
      body: 'Relates to #3557',
      register,
    });
    expect(result.ok).toBe(false);
    expect(result.locked).toEqual(['.github/labels.yml']);
    expect(result.message).toMatch(/no linked change request is approved/);
  });

  test('passes a locked-file change linked to a request approved in the register', () => {
    const result = evaluate({
      changedFiles: ['.github/issue-types.yml'],
      body: 'Closes #3556',
      register,
    });
    expect(result.ok).toBe(true);
    expect(result.approvedBy).toEqual({ 3556: 'change-request register' });
  });

  test('passes a locked-file change linked to an issue with the approver’s approval comment', () => {
    const result = evaluate({
      changedFiles: ['.github/PULL_REQUEST_TEMPLATE/pr_docs.md'],
      body: 'Closes #4000',
      register,
      commentsByIssue: { 4000: [{ user: { login: APPROVER }, body: 'Approved, ship it' }] },
    });
    expect(result.ok).toBe(true);
    expect(result.approvedBy).toEqual({ 4000: `approval comment by @${APPROVER}` });
  });

  test('does not accept an approval comment from anyone else', () => {
    const result = evaluate({
      changedFiles: ['.github/branch-labels.yml'],
      body: 'Closes #4000',
      register,
      commentsByIssue: { 4000: [{ user: { login: 'teammate' }, body: 'Approved' }] },
    });
    expect(result.ok).toBe(false);
  });
});
