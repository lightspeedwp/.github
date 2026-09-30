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
 * Everything here is a pure function of its arguments: the workflow performs
 * the API calls and passes in what it read, so the decision can be tested
 * without a network round trip.
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
 * Classify the result of `PUT /repos/{owner}/{repo}/pulls/{n}/update-branch`.
 *
 * Every outcome other than a genuine infrastructure error is a success from
 * this workflow's point of view. A conflict is a fact about the repository, not
 * a failure of the automation, and the caller must never turn one into a red
 * check — that is the defect being fixed.
 *
 * @param {{status?: number, message?: string}} outcome
 * @returns {'updated'|'conflict'|'gone'|'error'}
 */
function classifyUpdateResult({ status, message = '' } = {}) {
  // 202 Accepted — the base branch was merged into the head branch.
  if (status === 202) {
    return 'updated';
  }

  // 409 Conflict — the merge cannot be performed as-is. This is the case
  // Mergify reported as a failed check.
  if (status === 409) {
    return 'conflict';
  }

  // 404 Not Found. In practice this is the head branch having been deleted
  // after the pull request merged, which GitHub does automatically here
  // (`delete_branch_on_merge` is on). Mergify reported the equivalent as
  // "head ref does not exist" — a failure on a pull request that had already
  // been merged, and that no one could act on.
  if (status === 404) {
    return 'gone';
  }

  // 422 Unprocessable Entity. GitHub returns this both for a concurrent push
  // that moved the head out from under `expected_head_sha` and for
  // mergeability GitHub will not accept. Treat it as a conflict to report
  // rather than as an error, so a lost race does not turn the check red.
  if (status === 422) {
    return 'conflict';
  }

  if (status === 403) {
    return 'gone';
  }

  return message ? 'error' : 'error';
}

/**
 * Build the comment posted when a pull request cannot be updated automatically.
 *
 * @param {object} params
 * @param {number} params.pullNumber
 * @param {string} params.mergeableState - `mergeable_state` from the pull request.
 * @param {string[]} [params.log] - Per-pull-request log lines already emitted.
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
    `1. Merge \`develop\` into this branch locally (\`git merge origin/develop\`) and push the`,
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

module.exports = {
  CONFLICT_COMMENT_MARKER,
  buildConflictComment,
  classifyUpdateResult,
  normaliseCommentBody,
  shouldAttemptUpdate,
};
