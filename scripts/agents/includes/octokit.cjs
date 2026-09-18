/**
 * octokit.cjs
 *
 * Loads @actions/github from CommonJS.
 *
 * @actions/github v9 is ESM-only: its package.json "exports" map declares an
 * "import" condition but no "require", so `require("@actions/github")` from a
 * .cjs file throws
 *
 *   ERR_PACKAGE_PATH_NOT_EXPORTED: No "exports" main defined in
 *   node_modules/@actions/github/package.json
 *
 * A dynamic import() works from CommonJS and returns the ESM namespace, so the
 * client is created through that instead. The import is memoised, so repeated
 * calls in one process resolve the module once.
 *
 * Usage, from an async function:
 *
 *   const { getOctokit } = require("./octokit.cjs");
 *   const github = await getOctokit(token);
 */

let modulePromise;

/**
 * Create an authenticated Octokit client.
 *
 * @param {string} token   GitHub token.
 * @param {object} [options] Passed through to @actions/github's getOctokit.
 * @returns {Promise<object>} The authenticated client.
 */
async function getOctokit(token, options) {
  if (!modulePromise) {
    modulePromise = import("@actions/github");
  }

  const actionsGithub = await modulePromise;

  return actionsGithub.getOctokit(token, options);
}

module.exports = { getOctokit };
