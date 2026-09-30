const fs = require('node:fs');
const path = require('node:path');

const {
  CONFLICT_COMMENT_MARKER,
  buildConflictComment,
  classifyUpdateResult,
  normaliseCommentBody,
  shouldAttemptUpdate,
} = require('../keep-pr-current.cjs');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflowPath = path.join(repositoryRoot, '.github/workflows/keep-pr-current.yml');
const mergifyConfigPath = path.join(repositoryRoot, '.github/mergify.yml');

/**
 * A pull request as `pulls.get` returns it. Overrides are merged one level deep
 * so a test can vary the head repository without restating the whole object.
 */
function pullRequest(overrides = {}) {
  const base = {
    state: 'open',
    draft: false,
    mergeable_state: 'behind',
    head: { sha: 'headsha123', repo: { owner: { login: 'lightspeedwp' }, archived: false } },
    base: { ref: 'develop', repo: { owner: { login: 'lightspeedwp' } } },
  };

  const merged = { ...base, ...overrides };
  if (overrides.head) {
    merged.head = { ...base.head, ...overrides.head };
  }
  if (overrides.base) {
    merged.base = { ...base.base, ...overrides.base };
  }
  return merged;
}

describe('shouldAttemptUpdate', () => {
  test('attempts the update for a same-repository pull request on develop', () => {
    expect(shouldAttemptUpdate(pullRequest())).toEqual({ attempt: true, reason: 'behind' });
  });

  // The exclusions the removed Mergify rule expressed as -draft and
  // -from-fork. Both are behaviour a reader of this file would otherwise have
  // to take on trust from the old rule.
  test('skips drafts', () => {
    expect(shouldAttemptUpdate(pullRequest({ draft: true })).reason).toBe('draft');
  });

  test('skips pull requests from a fork', () => {
    const forked = pullRequest({
      head: { repo: { owner: { login: 'anupamme' }, archived: false } },
    });

    expect(shouldAttemptUpdate(forked).reason).toBe('from-fork');
  });

  test('skips a merged pull request, which is what produced "head ref does not exist"', () => {
    expect(shouldAttemptUpdate(pullRequest({ state: 'closed' })).reason).toBe('not-open');
  });

  test('skips archived head repositories', () => {
    const archived = pullRequest({
      head: { repo: { owner: { login: 'lightspeedwp' }, archived: true } },
    });

    expect(shouldAttemptUpdate(archived).reason).toBe('archived-head');
  });

  test('skips pull requests against another base branch', () => {
    expect(shouldAttemptUpdate(pullRequest({ base: { ref: 'main' } })).reason).toBe('not-develop');
  });

  // The regression this guards. After the base branch moves, GitHub reports
  // `unknown` until mergeability is recomputed. The update API is the real
  // test, so that window must not stop the attempt: skipping on `unknown`
  // would strand every open pull request on every push to develop.
  test('still attempts the update while mergeability is unknown', () => {
    expect(shouldAttemptUpdate(pullRequest({ mergeable_state: 'unknown' })).attempt).toBe(true);
  });

  test('still attempts the update when the pull request is already known to conflict', () => {
    // Reported as a comment, not suppressed: the outcome is information, and
    // the API call is what turns it into a fact rather than a stale state.
    expect(shouldAttemptUpdate(pullRequest({ mergeable_state: 'dirty' })).attempt).toBe(true);
  });

  test('tolerates a pull request with no repository information', () => {
    expect(shouldAttemptUpdate({ state: 'open', draft: false, head: {}, base: {} }).attempt).toBe(
      true
    );
  });
});

describe('classifyUpdateResult', () => {
  test('202 is the base branch being merged in', () => {
    expect(classifyUpdateResult({ status: 202 })).toBe('updated');
  });

  // Both messages below were observed against this repository on 2026-09-30,
  // from `PUT /pulls/{n}/update-branch`. GitHub sends both as 422, so the
  // message is what separates them.
  test('422 with a merge-conflict message is a conflict', () => {
    expect(
      classifyUpdateResult({ status: 422, message: 'merge conflict between base and head' })
    ).toBe('conflict');
  });

  // The regression this guards. Most open pull requests are not behind develop,
  // so this is the response the workflow sees most often. Classifying it as a
  // conflict would post a false conflict comment on every open pull request
  // every time develop is pushed to.
  test('422 saying there are no new commits means already current', () => {
    expect(
      classifyUpdateResult({ status: 422, message: 'There are no new commits on the base branch.' })
    ).toBe('current');
  });

  // Observed against this repository on 2026-09-30, on #3580 — a pull request
  // merged four days earlier whose head branch was auto-deleted. This is the
  // same text Mergify reported on #3580 and #3662 seconds after each merge.
  test('422 saying the head ref does not exist means gone, not conflict', () => {
    expect(classifyUpdateResult({ status: 422, message: 'head ref does not exist' })).toBe('gone');
  });

  // A wrong expected_head_sha did not produce this. On a genuinely behind pull
  // request a deliberately wrong value still returned 202 and updated the
  // branch, so the documented 422 mismatch was not reproducible and there is
  // nothing to match on.
  test('a response mentioning the expected head SHA is not silently accepted', () => {
    expect(classifyUpdateResult({ status: 422, message: 'Expected head sha does not match' })).toBe(
      'error'
    );
  });

  // GitHub documents 422 as "Validation failed, or the endpoint has been
  // spammed", so a throttled endpoint can arrive as 422. It must not be read
  // as a conflict, which would comment on every pull request while throttled.
  test('a throttled response is retryable whatever the status', () => {
    expect(
      classifyUpdateResult({ status: 422, message: 'You have exceeded a secondary rate limit' })
    ).toBe('retry');
    expect(classifyUpdateResult({ status: 429, message: 'Too Many Requests' })).toBe('retry');
    expect(classifyUpdateResult({ status: 403, message: 'rate limit exceeded' })).toBe('retry');
  });

  // Not one of the three observed 422 messages, so it is surfaced as an error
  // rather than turned into a conflict comment on a pull request that may have
  // nothing wrong with it.
  test('an unrecognised 422 is an error rather than a conflict', () => {
    expect(classifyUpdateResult({ status: 422, message: 'something new' })).toBe('error');
  });

  test('403 is denied rather than gone: they mean different things', () => {
    expect(classifyUpdateResult({ status: 403 })).toBe('denied');
  });

  test('a 5xx is an error', () => {
    expect(classifyUpdateResult({ status: 503, message: 'Service unavailable' })).toBe('error');
    expect(classifyUpdateResult({ status: 500 })).toBe('error');
  });

  test('no status at all is an error, not a silent success', () => {
    expect(classifyUpdateResult({})).toBe('error');
  });

  test('404 is the head branch having been deleted, not an error', () => {
    expect(classifyUpdateResult({ status: 404 })).toBe('gone');
  });

  test('anything else is an error', () => {
    expect(classifyUpdateResult({ status: 500, message: 'boom' })).toBe('error');
  });

  test('no status at all is an error, not a silent success', () => {
    expect(classifyUpdateResult({})).toBe('error');
  });
});

describe('buildConflictComment', () => {
  const body = buildConflictComment({ pullNumber: 3524, mergeableState: 'dirty' });

  test('carries the marker the workflow upserts on', () => {
    expect(body).toContain(CONFLICT_COMMENT_MARKER);
  });

  test('names the pull request state that caused it', () => {
    expect(body).toContain('dirty');
    expect(body).toContain('3524');
  });

  test('explains that this is not a failing check', () => {
    expect(body).toMatch(/not a failure of any check/i);
  });

  test('does not leave conflict markers in its own output', () => {
    expect(body).not.toMatch(/^<{7}/m);
  });
});

describe('normaliseCommentBody', () => {
  // URLs carry the pull request number, so a comment whose only difference is
  // its URL would otherwise be rewritten on every run. Comments for different
  // pull requests still differ in the number in the prose.
  test('ignores URL-only differences so repeated runs do not repost', () => {
    const first = buildConflictComment({ pullNumber: 3524, mergeableState: 'dirty' });
    const second = `${first}\nhttps://github.com/lightspeedwp/.github/pull/3524/conflicts\n`;

    expect(normaliseCommentBody(first)).toBe(normaliseCommentBody(second));
  });

  test('still distinguishes comments for different pull requests', () => {
    const first = normaliseCommentBody(
      buildConflictComment({ pullNumber: 3524, mergeableState: 'dirty' })
    );
    const second = normaliseCommentBody(
      buildConflictComment({ pullNumber: 3532, mergeableState: 'dirty' })
    );

    expect(first).not.toBe(second);
  });
});

describe('the removed Mergify rule', () => {
  test('is no longer configured', () => {
    const config = fs.readFileSync(mergifyConfigPath, 'utf8');

    expect(config).not.toContain('Keep same-repository pull requests on develop current');
    expect(config).not.toMatch(/^\s*update:\s*\{\}/m);
  });

  test('leaves Dependabot auto-merge in place', () => {
    const config = fs.readFileSync(mergifyConfigPath, 'utf8');

    expect(config).toContain('merge_protections_settings');
    expect(config).toContain('author~=^(dependabot\\[bot\\]|app/dependabot)$');
  });

  // Without this the workflow could silently stop being wired to anything and
  // branches would quietly stop being kept current.
  test('is replaced by a workflow on the same base branch', () => {
    const config = fs.readFileSync(mergifyConfigPath, 'utf8');

    expect(config).toContain('.github/workflows/keep-pr-current.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
  });
});

describe('keep-pr-current workflow', () => {
  const workflow = fs.readFileSync(workflowPath, 'utf8');

  // The defect being fixed. A workflow that called setFailed on a conflict
  // would reproduce the red check under a different name.
  test('never fails the job on a conflict', () => {
    expect(workflow).not.toMatch(/core\.setFailed/);
    expect(workflow).not.toMatch(/process\.exit\(1\)/);
    expect(workflow).not.toMatch(/exit 1/);
  });

  test('runs when develop moves, which is when branches fall behind', () => {
    expect(workflow).toMatch(/^\s*push:\s*$/m);
    expect(workflow).toMatch(/^\s*- develop\s*$/m);
  });

  test('has the write permissions the update API needs', () => {
    expect(workflow).toMatch(/^permissions:\s*$/m);
    expect(workflow).toMatch(/^\s{2}contents:\s*write\s*$/m);
    expect(workflow).toMatch(/^\s{2}pull-requests:\s*write\s*$/m);
  });

  // The API call moved into the module so it can be unit tested; the workflow
  // must not reach back into the API itself.
  test('delegates the API call to the module rather than duplicating it', () => {
    expect(workflow).toContain('processPullRequest');
    expect(workflow).not.toContain('updateBranch');
  });

  // The defect CodeRabbit raised: a log array declared outside the loop put one
  // pull request's API response into a later one's comment.
  test('keeps no state outside the per-pull-request loop', () => {
    expect(workflow).not.toContain('const log = []');
  });

  test('never checks out pull request code', () => {
    expect(workflow).toContain('persist-credentials: false');
    expect(workflow).toMatch(/uses:\s*actions\/github-script@/);
  });

  test('pins every action to a commit', () => {
    const uses = workflow.match(/uses:\s*\S+/g) || [];

    expect(uses.length).toBeGreaterThan(0);
    for (const line of uses) {
      expect(line).toMatch(/@[0-9a-f]{40}(\s|$)/);
    }
  });
});
