/**
 * Decide whether to merge `develop` into a pull request branch, and how to
 * report the outcome.
 *
 * This replaces the Mergify `update` rule that used to own this job
 * (`.github/mergify.yml`, removed in the pull request that added this file).
 * The behaviour is deliberately identical — merge the base in, skip drafts and
 * forks, act on any staleness — but the *reporting* is different, and that is
 * the whole point of the change.
 *
 * Mergify's `update` action has no option that affects how a failure is
 * reported. Its schema accepts only `bot_account`
 * (https://docs.mergify.com/mergify-configuration-schema.json, `$defs.UpdateActionModel`,
 * `additionalProperties: false`), and when Mergify cannot perform the update it
 * reports the rule's check run with conclusion `failure`. That happens both
 * when the update genuinely conflicts and when Mergify declines for its own
 * reasons, so a red `Base branch update has failed` is left behind on a pull
 * request that nobody can act on. See #3574.
 *
 * Everything here is a pure function of its arguments, or takes an injected
 * Octokit-like client, so the behaviour is testable without a network round trip.
 */

/**
 * Marker used to find and update this workflow's own comment, so repeated runs
 * on the same pull request do not stack up duplicates. Deliberately distinct
 * from the AI Feedback Validation marker and from the PR template routing
 * comment's `## PR Template Routing` heading.
 */
const CONFLICT_COMMENT_MARKER = '<!-- keep-pr-current -->';

/**
 * Should the base branch be merged into this pull request's head branch?
 *
 * The exclusions mirror what the Mergify rule used to express, and Mergify's
 * own documented preconditions (https://docs.mergify.com/workflow/actions/update:
 * "A pull request is updated only when it is open, has no conflict, is not in a
 * merge queue, and is behind its base branch").
 *
 * `mergeableState` is advisory only and never blocks the attempt. GitHub
 * reports `unknown` for a short window after the base branch moves, and
 * treating that window as "conflicting" would strand every open pull request
 * on every push to `develop`. The update API is the real test: it either
 * merges, or it reports a conflict, and the conflict path is reported as
 * information rather than as a failure.
 *
 * @param {object} pullRequest - A `pulls.get` response.
 * @returns {{attempt: boolean, reason: string}}
 */
function shouldAttemptUpdate(pullRequest) {
  if (!pullRequest || pullRequest.state !== 'open') {
    return { attempt: false, reason: 'not-open' };
  }

  if (pullRequest.draft) {
    return { attempt: false, reason: 'draft' };
  }

  const headOwner = pullRequest.head?.repo?.owner?.login;
  const baseOwner = pullRequest.base?.repo?.owner?.login;
  if (headOwner && baseOwner && headOwner !== baseOwner) {
    return { attempt: false, reason: 'from-fork' };
  }

  if (pullRequest.head?.repo?.archived) {
    return { attempt: false, reason: 'archived-head' };
  }

  if (pullRequest.base?.ref && pullRequest.base.ref !== 'develop') {
    return { attempt: false, reason: 'not-develop' };
  }

  return { attempt: true, reason: 'behind' };
}

/**
 * Classify the result of `PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch`.
 *
 * The status alone is not enough, because GitHub answers **422 for three
 * unrelated situations**. All four responses below were observed against this
 * repository on 2026-09-30 against a deliberately wrong `expected_head_sha`:
 *
 *   | HTTP | message                                             | when                                  |
 *   | ---- | --------------------------------------------------- | ------------------------------------- |
 *   | 202  | `Updating pull request branch.`                      | the merge was started                 |
 *   | 422  | `There are no new commits on the base branch.`      | already current                       |
 *   | 422  | `merge conflict between base and head`               | head conflicts with base              |
 *   | 422  | `head ref does not exist`                            | head branch deleted after the merge   |
 *   | 404  | `Not Found`                                          | the pull request itself is gone       |
 *
 * The third is the same text Mergify reported on #3580 and #3662, seconds
 * after those pull requests merged and their branches were auto-deleted. Reading
 * it as a conflict would post a false conflict comment on a merged pull
 * request, so the message is what decides.
 *
 * GitHub documents only 202, 403 and 422 for this endpoint
 * (https://docs.github.com/en/rest/pulls/pulls#update-a-pull-request-branch),
 * where 422 is described as "Validation failed, or the endpoint has been
 * spammed" — so a secondary rate limit can also arrive as 422 and is treated as
 * retryable rather than as a conflict.
 *
 * An unrecognised response is `error`. It is surfaced as a warning and in the
 * job summary, never as a passing no-op, and never as a conflict comment on a
 * pull request that may have nothing wrong with it.
 *
 * @param {{status?: number, message?: string}} outcome
 * @returns {'updated'|'current'|'conflict'|'gone'|'denied'|'retry'|'error'}
 */
function classifyUpdateResult({ status, message = '' } = {}) {
  const text = String(message).toLowerCase();

  // 202 Accepted — the base branch was merged into the head branch.
  if (status === 202) {
    return 'updated';
  }

  // Message checks come before status checks, because the 422 cases are
  // distinguished only by their message.
  if (text.includes('no new commits on the base branch')) {
    return 'current';
  }
  if (text.includes('merge conflict between base and head')) {
    return 'conflict';
  }
  if (text.includes('head ref does not exist')) {
    return 'gone';
  }

  // Rate limiting and endpoint throttling: documented as 403/422, and the
  // message is the only reliable signal. Not observed on this repository.
  if (
    status === 429 ||
    /rate limit|abuse detection|try again later|endpoint has been spammed/.test(text)
  ) {
    return 'retry';
  }

  // 403 Forbidden. GitHub documents the status but not the message; the most
  // common cause is a token that cannot write this head branch, for example a
  // fork whose author has not enabled maintainer edits. Not observed here.
  if (status === 403) {
    return 'denied';
  }

  // 404 Not Found. Observed for a pull request that no longer exists.
  if (status === 404) {
    return 'gone';
  }

  // 5xx and anything unrecognised, including a 422 whose message is not one of
  // the three above.
  return 'error';
}

/**
 * Build the comment posted when a pull request cannot be updated automatically.
 *
 * @param {object} params
 * @param {number} params.pullNumber
 * @param {string} params.mergeableState - `mergeable_state` from the pull request.
 * @param {string[]} [params.log] - Log lines for this pull request only.
 * @returns {string} Markdown comment body.
 */
function buildConflictComment({ pullNumber, mergeableState = 'unknown', log = [] }) {
  const conflictUrl = `https://github.com/lightspeedwp/.github/pull/${pullNumber}/conflicts`;

  return [
    CONFLICT_COMMENT_MARKER,
    `## Pull request #${pullNumber} could not be updated automatically`,
    '',
    `\`develop\` cannot be merged into this branch automatically because the two conflict`,
    `(\`mergeable_state: ${mergeableState}\`). Merging cannot resolve a conflict, so this needs`,
    'a human. This is a property of the branch, not a failure of any check — no check is',
    'reporting red because of it, and the up-to-date requirement on `develop` is unchanged.',
    '',
    '**To resolve it:**',
    '',
    '1. Merge `develop` into this branch locally (`git merge origin/develop`) and push the',
    '   result, or rebase the branch onto `develop`.',
    '2. Open the **Resolve conflicts** view to jump straight to the conflicting files:',
    `   ${conflictUrl}`,
    '',
    'Common conflict sources in this repository are the per-pull-request files that every',
    'pull request rewrites (`FEEDBACK_RESPONSE.md`) and the shared `[Unreleased]` list in',
    '`CHANGELOG.md`. `CHANGELOG.md` is union-merged via `.gitattributes`, so it merges cleanly;',
    'a conflict there means a change larger than an added entry.',
    ...(log.length
      ? ['', '<details><summary>Log</summary>', '', '```', ...log, '```', '</details>']
      : []),
    '',
  ].join('\n');
}

/**
 * The subset of {@link buildConflictComment} that changes as the branch
 * changes, used to decide whether an existing comment still needs updating.
 *
 * @param {string} body
 * @returns {string}
 */
function normaliseCommentBody(body) {
  return String(body || '')
    .split('\n')
    .filter((line) => !/^\s*https:\/\/github\.com\//.test(line))
    .join('\n')
    .trim();
}

/**
 * Run the update for one pull request and report the outcome.
 *
 * The per-pull-request log is built here rather than by the caller, so state
 * cannot carry from one pull request to the next: the caller iterates over many
 * pull requests in a single run, and a log array shared across iterations put
 * every earlier pull request's status into a later one's comment.
 *
 * @param {object} params
 * @param {object} params.github - Octokit-like client (actions/github-script `github`).
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {number} params.number - Pull request number.
 * @param {{info: Function, warning: Function}} [params.logger] - actions/core-like.
 * @returns {Promise<{outcome: string, status?: number|null, message?: string,
 *   commented?: boolean, commentFailed?: boolean, commentStatus?: number|null}>}
 *
 * Never throws for an API rejection. The caller iterates over every open pull
 * request in one run, so any escape would stop the rest of them; each failure is
 * returned instead, classified, and raised as a warning.
 */
async function processPullRequest({ github, owner, repo, number, logger = console }) {
  let pullRequest;
  try {
    ({ data: pullRequest } = await github.rest.pulls.get({ owner, repo, pull_number: number }));
  } catch (error) {
    const status = error.status ?? null;
    if (status === 404) {
      // Merged or deleted between listing and reading. Nothing to do, and not a
      // failure of this workflow.
      logger.info(`#${number}: gone, could not read (404).`);
      return { outcome: 'gone', status, message: error.message || '' };
    }
    // Anything else — a 5xx, a throttled call — is transient and must be
    // visible. It is reported as retryable so the next run tries again, and it
    // is raised as a warning so it is not mistaken for a clean pass.
    logger.warning(
      `#${number}: could not read the pull request (HTTP ${status ?? 'unknown'}` +
        `${error.message ? `, ${error.message}` : ''}). Retried on the next run.`
    );
    return { outcome: 'retry', status, message: error.message || '' };
  }

  const decision = shouldAttemptUpdate(pullRequest);
  if (!decision.attempt) {
    logger.info(`#${number}: skipped (${decision.reason}).`);
    return { outcome: 'skipped', message: decision.reason };
  }

  let status;
  let message = '';
  try {
    // expected_head_sha is documented as the guard against merging into a head
    // that moved
    // (https://docs.github.com/en/rest/pulls/pulls#update-a-pull-request-branch:
    // "If the expected SHA does not match the pull request's HEAD, you will
    // receive a 422 Unprocessable Entity status"). It was **not** observed to
    // be enforced on 2026-09-30 — a deliberately wrong value still returned 202
    // and updated the branch — so it is defence in depth, not the thing that
    // makes this call safe. The staleness check also runs first, which is why a
    // wrong value on an already-current pull request still returns the
    // "no new commits" 422.
    const response = await github.rest.pulls.updateBranch({
      owner,
      repo,
      pull_number: number,
      expected_head_sha: pullRequest.head.sha,
    });
    status = response.status;
  } catch (error) {
    status = error.status;
    // The API's own message is what distinguishes the 422 cases, so prefer it
    // over Octokit's wrapper text.
    message = error.response?.data?.message || error.message || '';
  }

  const outcome = classifyUpdateResult({ status, message });
  logger.info(`#${number}: ${outcome} (HTTP ${status}${message ? `, ${message}` : ''}).`);

  if (outcome === 'conflict') {
    // Scoped to this pull request. Deliberately not accumulated across calls.
    const log = [`#${number} HTTP ${status}: ${message}`];
    const body = buildConflictComment({
      pullNumber: number,
      mergeableState: pullRequest.mergeable_state || 'unknown',
      log,
    });

    // Every call on the comment path is guarded. The caller loops over every
    // open pull request in one run, so a rejection here — a transient 5xx, or a
    // secondary rate limit on a shared token — must not escape and stop the
    // remaining pull requests, and must not fail the job. The conflict itself
    // is still reported; only the comment is missed, and the miss is visible.
    try {
      // Upsert rather than append, so a pull request that stays conflicting
      // across several pushes to develop carries one comment instead of one per
      // run. Paginated, so a pull request with more than a page of earlier
      // comments still finds its own.
      const comments = await github.paginate(github.rest.issues.listComments, {
        owner,
        repo,
        issue_number: number,
        per_page: 100,
      });
      // Anchored to the start of the body, not `includes`. Other bot comments
      // on this repository are `type: Bot` and mention this workflow by name --
      // the Linear review comment carries the branch and workflow names -- so a
      // substring match would treat one of those as this workflow's comment and
      // rewrite it. Anchoring is used rather than an App-login comparison
      // because the App login is not known to this module and would have to be
      // threaded in for no extra safety: only a comment this workflow wrote
      // starts with the marker.
      const existing = comments.find(
        (comment) =>
          comment.user?.type === 'Bot' &&
          String(comment.body || '')
            .trimStart()
            .startsWith(CONFLICT_COMMENT_MARKER)
      );

      if (existing && normaliseCommentBody(existing.body) === normaliseCommentBody(body)) {
        logger.info(`#${number}: conflict comment already up to date.`);
        return { outcome, status, message, commented: false };
      }
      if (existing) {
        await github.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
      } else {
        await github.rest.issues.createComment({ owner, repo, issue_number: number, body });
      }
      return { outcome, status, message, commented: true };
    } catch (error) {
      // Surfaced three ways so it cannot pass unnoticed: a warning annotation,
      // the outcome the caller puts in its summary, and the return value.
      logger.warning(
        `#${number}: conflict comment could not be written (HTTP ${error.status ?? 'unknown'}` +
          `${error.message ? `, ${error.message}` : ''}). The conflict is real and this ` +
          'pull request was not updated; the comment will be retried on the next run.'
      );
      return {
        outcome,
        status,
        message,
        commented: false,
        commentFailed: true,
        commentStatus: error.status ?? null,
      };
    }
  }

  // Surfaced rather than logged quietly. The job still exits 0, because a
  // repository or permission problem is not a reason to fail every pull
  // request's check, but it must not look like a clean success either.
  if (outcome === 'error' || outcome === 'denied' || outcome === 'retry') {
    logger.warning(
      `#${number}: ${outcome} (HTTP ${status}${message ? `, ${message}` : ''}) — ` +
        'no conflict comment was posted and this pull request was not updated.'
    );
  }

  return { outcome, status, message };
}

module.exports = {
  CONFLICT_COMMENT_MARKER,
  buildConflictComment,
  classifyUpdateResult,
  normaliseCommentBody,
  processPullRequest,
  shouldAttemptUpdate,
};
