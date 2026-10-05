/**
 * Tests for the locked-file approval guard (spec 008, task T080).
 */

const {
  APPROVER,
  approvedInRegister,
  evaluate,
  isApprovalComment,
  isChangeRequestTitle,
  isLocked,
  issuesFromRenderedHtml,
  linkedIssues,
} = require('../check-locked-file-approval.cjs');

const register = {
  requests: [
    { issue_number: 3556, status: 'approved' },
    { issue_number: 3557, status: 'pending' },
  ],
};

const titlesByIssue = {
  3556: '[ISSUE-TYPE-UPDATE-REQUEST] Replace Question with Decision',
  3557: '[TEMPLATE-UPDATE-REQUEST] Decision issue template',
  4000: 'task: label-consolidation - Six PR templates [TEMPLATE-UPDATE-REQUEST]',
  449: 'epic: label-governance - Stabilise canonical labels',
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

  describe('issues linked from a body rendered by the GitHub Markdown API', () => {
    // Real output of POST /markdown (mode gfm, context lightspeedwp/.github),
    // saved so the tests need no network. Nothing in the guard parses Markdown.
    const fixtures = require('./fixtures/rendered-pr-bodies.json').bodies;
    const linked = (name) => issuesFromRenderedHtml(fixtures[name].html);

    test.each([
      ['plain', [3556, 449]],
      ['fullUrl', [3556]],
      ['markdownLink', [3556]],
      ['pullRequestRef', [3734]],
      ['htmlAnchor', [3556]],
      ['paragraphContinuation', [3556]],
      ['nestedList', [3556]],
    ])('finds the links GitHub renders in %s', (name, expected) => {
      expect(linked(name)).toEqual(expected);
    });

    test.each([
      'fenceFour',
      'fenceThree',
      'fenceTilde',
      'fenceUnclosed',
      'indented',
      'indentedTab',
      'indentedAfterHeading',
      'indentedInList',
      'inlineSingle',
      'inlineDouble',
      'htmlComment',
      'otherRepository',
      'noReferences',
    ])('finds no link to #3556 in %s, because GitHub renders none', (name) => {
      expect(linked(name)).not.toContain(3556);
    });

    test('a reference outside a four-backtick fence is still found', () => {
      expect(linked('fenceFour')).toEqual([449]);
    });

    test('evaluate does not accept an approval borrowed through code', () => {
      for (const name of ['fenceFour', 'indented', 'inlineDouble', 'htmlComment']) {
        const result = evaluate({
          changedFiles: ['.github/labels.yml'],
          issues: linked(name),
          register,
          titlesByIssue,
        });
        expect(result.ok).toBe(false);
        expect(result.approvedBy).toEqual({});
      }
    });

    test('evaluate accepts a link GitHub renders', () => {
      const result = evaluate({
        changedFiles: ['.github/issue-types.yml'],
        issues: linked('plain'),
        register,
        titlesByIssue,
      });
      expect(result.ok).toBe(true);
    });

    test('ignores links into other repositories and tolerates empty or missing HTML', () => {
      const html = '<a href="https://github.com/other/repo/issues/3556">x</a>';
      expect(issuesFromRenderedHtml(html)).toEqual([]);
      expect(issuesFromRenderedHtml('')).toEqual([]);
      expect(issuesFromRenderedHtml(undefined)).toEqual([]);
    });

    test('ignores text that only looks like a link, such as escaped HTML in code', () => {
      const html =
        '<pre><code>&lt;a href="https://github.com/lightspeedwp/.github/issues/3556"&gt;x&lt;/a&gt;</code></pre>';
      expect(issuesFromRenderedHtml(html)).toEqual([]);
    });

    test('keeps order, drops duplicates and accepts a link with a fragment', () => {
      const html =
        '<a href="https://github.com/lightspeedwp/.github/issues/10">a</a>' +
        '<a href="https://github.com/lightspeedwp/.github/pull/7#issuecomment-1">b</a>' +
        '<a class="x" href="https://github.com/lightspeedwp/.github/issues/10">c</a>';
      expect(issuesFromRenderedHtml(html)).toEqual([10, 7]);
    });

    describe('linkedIssues', () => {
      const clientReturning = (data) => ({
        calls: [],
        rest: {
          markdown: {
            render(args) {
              this.calls.push(args);
              return Promise.resolve({ data });
            },
          },
        },
      });

      test('renders the body in gfm mode with the repository as context', async () => {
        const github = clientReturning(fixtures.plain.html);
        github.rest.markdown.calls = github.calls;
        await expect(linkedIssues(github, fixtures.plain.body)).resolves.toEqual([3556, 449]);
        expect(github.calls).toEqual([
          { text: fixtures.plain.body, mode: 'gfm', context: 'lightspeedwp/.github' },
        ]);
      });

      test('makes no request for an empty body', async () => {
        const github = clientReturning('');
        github.rest.markdown.calls = github.calls;
        await expect(linkedIssues(github, '   ')).resolves.toEqual([]);
        expect(github.calls).toEqual([]);
      });

      test('lets a render failure through, so the workflow fails closed', async () => {
        const github = {
          rest: { markdown: { render: () => Promise.reject(new Error('HTTP 502')) } },
        };
        await expect(linkedIssues(github, 'Closes #3556')).rejects.toThrow('HTTP 502');
      });
    });
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
    const result = evaluate({ changedFiles: ['docs/README.md'], issues: [], register });
    expect(result.ok).toBe(true);
    expect(result.locked).toEqual([]);
  });

  test('fails a locked-file change with no linked approved request', () => {
    const result = evaluate({
      changedFiles: ['.github/labels.yml', 'docs/LABEL_STRATEGY.md'],
      issues: [3557],
      register,
      titlesByIssue,
    });
    expect(result.ok).toBe(false);
    expect(result.locked).toEqual(['.github/labels.yml']);
    expect(result.message).toMatch(/no linked change request is approved/);
  });

  test('names a failed issue lookup in the failure, still failing closed', () => {
    const result = evaluate({
      changedFiles: ['.github/labels.yml'],
      issues: [4000],
      register,
      // #4000 could not be read, so it has no title and cannot count as approved.
      titlesByIssue: {},
      lookupFailures: [{ issue: 4000, message: 'HTTP 502' }],
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/no linked change request is approved/);
    expect(result.message).toMatch(/Could not read #4000 \(HTTP 502\)/);
    expect(result.message).toMatch(/re-run the check/);
  });

  test('does not mention lookup failures when the request is approved anyway', () => {
    const result = evaluate({
      changedFiles: ['.github/issue-types.yml'],
      issues: [3556, 4000],
      register,
      titlesByIssue,
      lookupFailures: [{ issue: 4000, message: 'HTTP 502' }],
    });
    expect(result.ok).toBe(true);
    expect(result.message).not.toMatch(/Could not read/);
  });

  test('says nothing extra for an ordinary rejection with no lookup failure', () => {
    const result = evaluate({
      changedFiles: ['.github/labels.yml'],
      issues: [3557],
      register,
      titlesByIssue,
    });
    expect(result.message).not.toMatch(/Could not read/);
  });

  test('passes a locked-file change linked to a request approved in the register', () => {
    const result = evaluate({
      changedFiles: ['.github/issue-types.yml'],
      issues: [3556],
      register,
      titlesByIssue,
    });
    expect(result.ok).toBe(true);
    expect(result.approvedBy).toEqual({ 3556: 'change-request register' });
  });

  test('passes a locked-file change linked to an issue with the approver’s approval comment', () => {
    const result = evaluate({
      changedFiles: ['.github/PULL_REQUEST_TEMPLATE/pr_docs.md'],
      issues: [4000],
      register,
      titlesByIssue,
      commentsByIssue: { 4000: [{ user: { login: APPROVER }, body: 'Approved, ship it' }] },
    });
    expect(result.ok).toBe(true);
    expect(result.approvedBy).toEqual({ 4000: `approval comment by @${APPROVER}` });
  });

  test('does not accept an approval comment from anyone else', () => {
    const result = evaluate({
      changedFiles: ['.github/branch-labels.yml'],
      issues: [4000],
      register,
      titlesByIssue,
      commentsByIssue: { 4000: [{ user: { login: 'teammate' }, body: 'Approved' }] },
    });
    expect(result.ok).toBe(false);
  });

  test.each([
    ['[LABEL-UPDATE-REQUEST] Import five labels', true],
    ['[ISSUE-TYPE-UPDATE-REQUEST] Decision type', true],
    ['task: six PR templates [TEMPLATE-UPDATE-REQUEST]', true],
    ['epic: label-governance - Stabilise canonical labels', false],
    ['LABEL-UPDATE-REQUEST without brackets', false],
    [undefined, false],
  ])('isChangeRequestTitle(%p) is %p', (title, expected) => {
    expect(isChangeRequestTitle(title)).toBe(expected);
  });

  test('does not accept the approver’s comment on an issue that is not a change request', () => {
    const result = evaluate({
      changedFiles: ['.github/labels.yml'],
      issues: [449],
      register,
      titlesByIssue,
      commentsByIssue: { 449: [{ user: { login: APPROVER }, body: 'Approved' }] },
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/without one of those tags/);
  });

  test('does not accept a register approval when the issue title is unknown', () => {
    const result = evaluate({
      changedFiles: ['.github/issue-types.yml'],
      issues: [3556],
      register,
    });
    expect(result.ok).toBe(false);
  });
});
