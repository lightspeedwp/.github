/**
 * Apply label changes computed by the label handlers through the GitHub API.
 *
 * The handlers (sync-labels-on-event, orchestrate-phase-progression) only
 * compute what should change; this module performs the writes, so the
 * handlers stay pure and testable.
 *
 * - Adds only labels that already exist in the repository. The add-labels
 *   endpoint would otherwise create missing labels silently, spreading
 *   ad-hoc labels across organisation repos.
 * - Removing a label the issue no longer has (404) is not an error.
 */

/**
 * @param {object} params
 * @param {object} params.github - Octokit client (actions/github-script `github`)
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {number} params.issueNumber
 * @param {string[]} [params.add]
 * @param {string[]} [params.remove]
 * @param {boolean} [params.dryRun]
 * @param {Set<string>} [params.repoLabels] - Pre-fetched label names, to avoid
 *   one list call per issue when processing several.
 * @returns {Promise<{added: string[], removed: string[], skipped: string[]}>}
 */
async function applyLabelChanges({
  github,
  owner,
  repo,
  issueNumber,
  add = [],
  remove = [],
  dryRun = false,
  repoLabels,
}) {
  const result = { added: [], removed: [], skipped: [] };
  const removeSet = new Set(remove);
  const toAdd = [...new Set(add)].filter((label) => !removeSet.has(label));
  const toRemove = [...removeSet];

  if (toAdd.length === 0 && toRemove.length === 0) {
    return result;
  }

  const known = repoLabels || (await listRepoLabels(github, owner, repo));
  const existing = toAdd.filter((label) => known.has(label));
  result.skipped = toAdd.filter((label) => !known.has(label));

  if (dryRun) {
    result.added = existing;
    result.removed = toRemove;
    return result;
  }

  for (const name of toRemove) {
    try {
      await github.rest.issues.removeLabel({ owner, repo, issue_number: issueNumber, name });
      result.removed.push(name);
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }
  }

  if (existing.length > 0) {
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: existing,
    });
    result.added = existing;
  }

  return result;
}

/**
 * @returns {Promise<Set<string>>}
 */
async function listRepoLabels(github, owner, repo) {
  const labels = await github.paginate(github.rest.issues.listLabelsForRepo, {
    owner,
    repo,
    per_page: 100,
  });

  return new Set(labels.map((label) => label.name));
}

module.exports = { applyLabelChanges, listRepoLabels };
