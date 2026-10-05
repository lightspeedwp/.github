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
 * Keeps only the references GitHub renders as links, preserving the order of
 * the candidates. A reference found by a pattern but not rendered as a link
 * (for example one in a code sample) is dropped. This can only narrow a list.
 * @param {{ rest: { markdown: { render: Function } } }} github Octokit client.
 * @param {string} body Pull request body.
 * @param {number[]} candidates Issue numbers a pattern found in the body.
 * @param {string} repo `owner/name`.
 * @returns {Promise<number[]>} The candidates GitHub renders as links.
 */
async function onlyRenderedLinks(github, body, candidates, repo) {
  if (candidates.length === 0) {
    return [];
  }
  const rendered = new Set(await renderedIssueLinks(github, body, repo));
  return candidates.filter((number) => rendered.has(number));
}

module.exports = { issuesFromRenderedHtml, renderedIssueLinks, onlyRenderedLinks };
