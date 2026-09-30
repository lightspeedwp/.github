const { CONFLICT_COMMENT_MARKER, processPullRequest } = require('../keep-pr-current.cjs');

/**
 * A pull request as `pulls.get` returns it.
 */
function pullRequest(number, overrides = {}) {
  return {
    number,
    state: 'open',
    draft: false,
    mergeable_state: 'dirty',
    head: {
      sha: `sha${number}`,
      repo: { owner: { login: 'lightspeedwp' }, archived: false },
    },
    base: { ref: 'develop', repo: { owner: { login: 'lightspeedwp' } } },
    ...overrides,
  };
}

/**
 * An Octokit-like client for `processPullRequest`.
 *
 * `results` maps a pull request number to the outcome its `updateBranch` call
 * should produce. `comments` is the existing comment set per pull request, and
 * the client records what was written where.
 */
function mockGithub({ results = {}, pulls = {}, comments = {}, commentStatus = {} } = {}) {
  // `commentStatus` makes one comment call fail for a given pull request, to
  // model a transient 5xx or a secondary rate limit on the comment path.
  const written = { created: [], updated: [] };

  const github = {
    paginate: jest.fn(async (method, params) => {
      // Mirrors actions/github-script's paginate: calls the route and resolves
      // with the first page of data.
      return method(params).then((response) => response.data);
    }),
    rest: {
      pulls: {
        get: jest.fn(async ({ pull_number: number }) => ({
          data: pulls[number] || pullRequest(number),
        })),
        updateBranch: jest.fn(async ({ pull_number: number }) => {
          const result = results[number] || {
            status: 202,
          };
          if (result.status >= 400) {
            const error = new Error(result.message || 'failed');
            error.status = result.status;
            error.response = { data: { message: result.message || '' } };
            throw error;
          }
          return { status: result.status };
        }),
      },
      issues: {
        listComments: jest.fn(async ({ issue_number: number }) => {
          if (commentStatus[number]?.listComments) {
            throw Object.assign(new Error('boom'), { status: commentStatus[number].listComments });
          }
          return { data: comments[number] || [] };
        }),
        createComment: jest.fn(async (params) => {
          if (commentStatus[params.issue_number]?.createComment) {
            throw Object.assign(new Error('boom'), {
              status: commentStatus[params.issue_number].createComment,
            });
          }
          written.created.push(params);
          return { data: { id: written.created.length } };
        }),
        updateComment: jest.fn(async (params) => {
          if (commentStatus[params.comment_id]?.updateComment) {
            throw Object.assign(new Error('boom'), {
              status: commentStatus[params.comment_id].updateComment,
            });
          }
          written.updated.push(params);
          return { data: { id: 1 } };
        }),
      },
    },
  };

  return { github, written };
}

const silentLogger = { info: () => {}, warning: () => {} };

function conflict(message = 'merge conflict between base and head') {
  return { status: 422, message };
}

/**
 * The log block of a conflict comment: the fenced list under the Log summary.
 * The heading and the conflict URL always name the pull request itself, so an
 * assertion about cross-contamination has to look here and only here.
 */
function logBlock(body) {
  const match = String(body).match(/<details><summary>Log<\/summary>[\s\S]*?```([\s\S]*?)```/);
  return match ? match[1] : '';
}

describe('processPullRequest', () => {
  test('a conflicting pull request gets a comment naming only itself', async () => {
    const { github, written } = mockGithub({ results: { 101: conflict() } });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 101,
      logger: silentLogger,
    });

    expect(result.outcome).toBe('conflict');
    expect(written.created).toHaveLength(1);
    expect(logBlock(written.created[0].body)).toContain('#101');
  });

  // The regression this guards. The caller iterates over every open pull
  // request in one run, and the log lines used to live in an array declared
  // outside that loop, so each comment carried every earlier pull request's
  // status too — publishing one pull request's API response on another.
  test('a later pull request never sees an earlier one in its comment', async () => {
    const { github, written } = mockGithub({
      results: { 101: conflict(), 202: conflict() },
    });

    await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 101,
      logger: silentLogger,
    });
    await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 202,
      logger: silentLogger,
    });

    expect(written.created).toHaveLength(2);
    const [first, second] = written.created.map((call) => logBlock(call.body));

    expect(first).toContain('#101');
    expect(first).not.toContain('#202');
    expect(second).toContain('#202');
    expect(second).not.toContain('#101');
  });

  test('an already-current pull request gets no comment', async () => {
    const { github, written } = mockGithub({
      results: { 303: { status: 422, message: 'There are no new commits on the base branch.' } },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 303,
      logger: silentLogger,
    });

    expect(result.outcome).toBe('current');
    expect(written.created).toHaveLength(0);
  });

  // Mergify reported this one on #3580 and #3662, seconds after those pull
  // requests merged. Treating it as a conflict would comment on a merged pull
  // request telling a human to resolve a conflict that does not exist.
  test('a merged pull request with a deleted branch gets no conflict comment', async () => {
    const { github, written } = mockGithub({
      results: { 404: { status: 422, message: 'head ref does not exist' } },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 404,
      logger: silentLogger,
    });

    expect(result.outcome).toBe('gone');
    expect(written.created).toHaveLength(0);
  });

  test('a successful update reports updated and posts nothing', async () => {
    const { github, written } = mockGithub({ results: { 505: { status: 202 } } });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 505,
      logger: silentLogger,
    });

    expect(result.outcome).toBe('updated');
    expect(written.created).toHaveLength(0);
  });

  // An unrecognised response must not look like a clean success and must not
  // become a conflict comment on a pull request that may be fine.
  test('an unrecognised response is reported and warns', async () => {
    const warnings = [];
    const { github, written } = mockGithub({
      results: { 606: { status: 503, message: 'Service unavailable' } },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 606,
      logger: { info: () => {}, warning: (line) => warnings.push(line) },
    });

    expect(result.outcome).toBe('error');
    expect(written.created).toHaveLength(0);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('#606');
    expect(warnings[0]).toContain('was not updated');
  });

  test('an unknown 422 message is an error, not a conflict', async () => {
    const { github, written } = mockGithub({
      results: { 707: { status: 422, message: 'Something GitHub has not said before' } },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 707,
      logger: silentLogger,
    });

    expect(result.outcome).toBe('error');
    expect(written.created).toHaveLength(0);
  });

  test('a draft is skipped without calling the API', async () => {
    const { github } = mockGithub({ pulls: { 808: pullRequest(808, { draft: true }) } });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 808,
      logger: silentLogger,
    });

    expect(result.outcome).toBe('skipped');
    expect(github.rest.pulls.updateBranch).not.toHaveBeenCalled();
  });

  test('an existing comment is updated rather than duplicated', async () => {
    const existing = {
      // A real id: without one the fixture cannot tell a correct update from a
      // call that forgot `comment_id`, and the assertion below would pass either
      // way.
      id: 4242,
      user: { type: 'Bot' },
      body: `${CONFLICT_COMMENT_MARKER}\n## Pull request #909 could not be updated automatically\n\nold body\n`,
    };
    const { github, written } = mockGithub({
      results: { 909: conflict() },
      comments: { 909: [existing] },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 909,
      logger: silentLogger,
    });

    expect(result.commented).toBe(true);
    expect(written.created).toHaveLength(0);
    expect(written.updated).toHaveLength(1);
    // The id of the comment that was found, not an assertion that it is absent.
    expect(written.updated[0].comment_id).toBe(4242);
    expect(written.updated[0].body).toContain('#909');
  });

  test('an unchanged comment is left alone', async () => {
    const { github, written } = mockGithub({ results: { 1: conflict() } });
    await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 1,
      logger: silentLogger,
    });

    const body = written.created[0].body;
    const second = mockGithub({
      results: { 1: conflict() },
      comments: { 1: [{ user: { type: 'Bot' }, body }] },
    });
    const result = await processPullRequest({
      github: second.github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 1,
      logger: silentLogger,
    });

    expect(result.commented).toBe(false);
    expect(second.written.updated).toHaveLength(0);
    expect(second.written.created).toHaveLength(0);
  });

  // The defect this covers. The caller loops over every open pull request in one
  // run, so a rejection on the comment path for one pull request must not stop
  // the rest, and must not fail the job: the workflow's contract is that no
  // outcome turns a check red.
  test('a failing comment call does not stop the next pull request', async () => {
    const { github, written } = mockGithub({
      results: { 111: conflict(), 222: conflict() },
      commentStatus: { 111: { createComment: 502 } },
    });

    const first = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 111,
      logger: silentLogger,
    });
    const second = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 222,
      logger: silentLogger,
    });

    // The first still reports the real outcome...
    expect(first.outcome).toBe('conflict');
    // ...and did not throw, so the loop reached the second.
    expect(second.outcome).toBe('conflict');
    expect(written.created).toHaveLength(1);
    expect(written.created[0].body).toContain('#222');
  });

  test.each([
    ['listComments', 'listing comments'],
    ['createComment', 'creating a comment'],
    ['updateComment', 'updating a comment'],
  ])('a failing %s is reported and does not throw', async (call) => {
    const existing = { id: 77, user: { type: 'Bot' }, body: '<!-- keep-pr-current -->\nold\n' };
    const warnings = [];
    const status = call === 'updateComment' ? 502 : call === 'createComment' ? 429 : 500;
    const comments = call === 'updateComment' ? { 333: [existing] } : {};
    const { github } = mockGithub({
      results: { 333: conflict() },
      comments,
      commentStatus: { [call === 'updateComment' ? 77 : 333]: { [call]: status } },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 333,
      logger: { info: () => {}, warning: (line) => warnings.push(line) },
    });

    expect(result.outcome).toBe('conflict');
    expect(result.commented).toBe(false);
    expect(warnings.join('\n')).toContain('#333');
    expect(warnings.join('\n')).toContain(String(status));
  });

  // A failure writing the comment must be visible as more than a log line, so
  // the job summary counts it rather than reporting every pull request as done.
  test('a failed comment is reflected in the returned result', async () => {
    const { github } = mockGithub({
      results: { 444: conflict() },
      commentStatus: { 444: { createComment: 503 } },
    });

    const result = await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 444,
      logger: silentLogger,
    });

    expect(result.commentFailed).toBe(true);
    expect(result.commentStatus).toBe(503);
  });

  test('comments are paginated, so an older marker comment is still found', async () => {
    const { github } = mockGithub({ results: { 10: conflict() } });

    await processPullRequest({
      github,
      owner: 'lightspeedwp',
      repo: '.github',
      number: 10,
      logger: silentLogger,
    });

    expect(github.paginate).toHaveBeenCalledWith(
      github.rest.issues.listComments,
      expect.any(Object)
    );
  });
});
