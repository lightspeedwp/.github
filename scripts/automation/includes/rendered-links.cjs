/**
 * Which issues a pull request body really links to, decided by GitHub.
 *
 * Reading references with a regular expression finds text that GitHub does not
 * render as a link: a reference inside a fenced or indented code block, a code
 * span or an HTML comment, or one that names another repository or an issue that
 * does not exist. Reimplementing Markdown to exclude those cases is fragile, so
 * this module asks GitHub: it renders the body with the Markdown API (gfm mode)
 * and reads the issue links out of the HTML it returns. Nothing here parses
 * Markdown.
 */

'use strict';

/**
 * Issue and pull request numbers a rendered body links to in one repository.
 * @param {string} html Output of the GitHub Markdown render API (gfm mode).
 * @param {string} repo `owner/name`; links into other repositories are ignored.
 * @returns {number[]} Unique numbers, in order of appearance.
 */
function issuesFromRenderedHtml(html, repo) {
  const escaped = repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const link = new RegExp(
    `<a\\b[^>]*?\\bhref="https://github\\.com/${escaped}/(?:issues|pull)/(\\d+)(?:[/?#][^"]*)?"`,
    'gi'
  );
  const numbers = [];
  for (const match of String(html || '').matchAll(link)) {
    numbers.push(Number(match[1]));
  }
  return [...new Set(numbers)];
}

/**
 * Renders a body with GitHub and returns the issues it links to. A failure
 * throws, so a caller that writes to issues can skip the write instead of
 * guessing.
 * @param {{ rest: { markdown: { render: Function } } }} github Octokit client (github-script).
 * @param {string} body Pull request body.
 * @param {string} repo `owner/name`, used as the rendering context.
 * @returns {Promise<number[]>} Unique numbers, in order of appearance.
 */
async function renderedIssueLinks(github, body, repo) {
  if (!String(body || '').trim()) {
    return [];
  }
  const { data } = await github.rest.markdown.render({
    text: String(body),
    mode: 'gfm',
    context: repo,
  });
  return issuesFromRenderedHtml(data, repo);
}

/**
 * Issues a pull request body links to with a closing or relation keyword
 * (Resolves, Closes, Fixes, Related, Related to), read from the HTML GitHub
 * rendered. The keyword has to sit directly in front of the rendered link, so
 * it is the occurrence GitHub linked that counts, not just the number: a
 * keyword reference in a code sample renders as plain code text with no link
 * after the keyword, and a separate plain link to the same issue elsewhere in
 * the body cannot vouch for it.
 * @param {string} html Output of the GitHub Markdown render API (gfm mode).
 * @param {string} repo `owner/name`; links into other repositories are ignored.
 * @returns {number[]} Unique numbers, in order of appearance.
 */
function keywordIssuesFromRenderedHtml(html, repo) {
  const escaped = repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keywordLink = new RegExp(
    `\\b(?:Resolves|Closes|Fixes|Related(?:\\s+to)?)\\s+<a\\b[^>]*?\\bhref="https://github\\.com/${escaped}/(?:issues|pull)/(\\d+)(?:[/?#][^"]*)?"`,
    'gi'
  );
  const numbers = [];
  for (const match of String(html || '').matchAll(keywordLink)) {
    numbers.push(Number(match[1]));
  }
  return [...new Set(numbers)];
}

/**
 * Renders a body with GitHub and returns the issues it links to with a keyword.
 * A failure throws, so a caller that writes to issues can skip the write.
 * @param {{ rest: { markdown: { render: Function } } }} github Octokit client (github-script).
 * @param {string} body Pull request body.
 * @param {string} repo `owner/name`, used as the rendering context.
 * @returns {Promise<number[]>} Unique numbers, in order of appearance.
 */
async function renderedKeywordIssues(github, body, repo) {
  if (!String(body || '').trim()) {
    return [];
  }
  const { data } = await github.rest.markdown.render({
    text: String(body),
    mode: 'gfm',
    context: repo,
  });
  return keywordIssuesFromRenderedHtml(data, repo);
}

module.exports = {
  issuesFromRenderedHtml,
  keywordIssuesFromRenderedHtml,
  renderedIssueLinks,
  renderedKeywordIssues,
};
