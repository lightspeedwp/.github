/**
 * Tests for the rendered-link helper and its use in phase progression.
 *
 * The HTML fixtures are real output of the GitHub Markdown API (POST /markdown,
 * mode gfm, context lightspeedwp/.github), saved so the tests need no network.
 */

const {
  issuesFromRenderedHtml,
  onlyRenderedLinks,
  renderedIssueLinks,
} = require('../includes/rendered-links.cjs');
const {
  extractLinkedIssues,
  extractRenderedLinkedIssues,
} = require('../handlers/orchestrate-phase-progression.cjs');
const { bodies } = require('./fixtures/rendered-keyword-bodies.json');

const REPO = 'lightspeedwp/.github';

/** A client whose Markdown API returns the saved HTML for a known body. */
function clientFor(fixture) {
  const calls = [];
  return {
    calls,
    rest: {
      markdown: {
        render: async (args) => {
          calls.push(args);
          return { data: fixture.html };
        },
      },
    },
  };
}

describe('issuesFromRenderedHtml', () => {
  it('reads the links GitHub rendered, in order', () => {
    expect(issuesFromRenderedHtml(bodies.keywords.html, REPO)).toEqual([3556, 449, 3733, 3734]);
  });

  it.each([
    'keywordInFence',
    'keywordInIndentedCode',
    'keywordInCodeSpan',
    'keywordInComment',
    'keywordOtherRepository',
    'keywordMissingIssue',
  ])('finds only the real link in %s', (name) => {
    expect(issuesFromRenderedHtml(bodies[name].html, REPO)).toEqual([449]);
  });

  it('ignores links into other repositories, escaped HTML and empty input', () => {
    expect(
      issuesFromRenderedHtml('<a href="https://github.com/other/repo/issues/1">x</a>', REPO)
    ).toEqual([]);
    expect(
      issuesFromRenderedHtml(
        '<pre><code>&lt;a href="https://github.com/lightspeedwp/.github/issues/5"&gt;</code></pre>',
        REPO
      )
    ).toEqual([]);
    expect(issuesFromRenderedHtml('', REPO)).toEqual([]);
    expect(issuesFromRenderedHtml(undefined, REPO)).toEqual([]);
  });

  it('drops duplicates and accepts pull request links and fragments', () => {
    const html =
      '<a href="https://github.com/lightspeedwp/.github/issues/10">a</a>' +
      '<a href="https://github.com/lightspeedwp/.github/pull/7#issuecomment-1">b</a>' +
      '<a class="x" href="https://github.com/lightspeedwp/.github/issues/10">c</a>';
    expect(issuesFromRenderedHtml(html, REPO)).toEqual([10, 7]);
  });
});

describe('renderedIssueLinks', () => {
  it('renders in gfm mode with the repository as context', async () => {
    const client = clientFor(bodies.keywords);
    await expect(renderedIssueLinks(client, bodies.keywords.body, REPO)).resolves.toEqual([
      3556, 449, 3733, 3734,
    ]);
    expect(client.calls).toEqual([{ text: bodies.keywords.body, mode: 'gfm', context: REPO }]);
  });

  it('makes no request for an empty body', async () => {
    const client = clientFor({ html: '' });
    await expect(renderedIssueLinks(client, '  ', REPO)).resolves.toEqual([]);
    expect(client.calls).toEqual([]);
  });

  it('lets a render failure through so a caller can skip its write', async () => {
    const client = { rest: { markdown: { render: () => Promise.reject(new Error('HTTP 502')) } } };
    await expect(renderedIssueLinks(client, 'Closes #1', REPO)).rejects.toThrow('HTTP 502');
  });
});

describe('onlyRenderedLinks', () => {
  it('keeps the candidates GitHub renders as links, in the candidates order', async () => {
    const client = clientFor(bodies.keywordInFence);
    await expect(
      onlyRenderedLinks(client, bodies.keywordInFence.body, [3556, 449], REPO)
    ).resolves.toEqual([449]);
  });

  it('makes no request when there are no candidates', async () => {
    const client = clientFor(bodies.keywords);
    await expect(onlyRenderedLinks(client, 'nothing', [], REPO)).resolves.toEqual([]);
    expect(client.calls).toEqual([]);
  });
});

describe('phase progression linked issues', () => {
  it.each([
    'keywordInFence',
    'keywordInIndentedCode',
    'keywordInCodeSpan',
    'keywordInComment',
    'keywordMissingIssue',
  ])('the text extraction alone also picks up the code sample in %s', (name) => {
    // This is the defect: reading text finds an issue GitHub does not link.
    expect(extractLinkedIssues(bodies[name].body).length).toBeGreaterThan(1);
  });

  it.each([
    ['keywords', [3556, 449, 3733, 3734]],
    ['keywordInFence', [449]],
    ['keywordInIndentedCode', [449]],
    ['keywordInCodeSpan', [449]],
    ['keywordInComment', [449]],
    ['keywordOtherRepository', [449]],
    ['keywordMissingIssue', [449]],
  ])('moves only the issues GitHub links in %s', async (name, expected) => {
    const result = await extractRenderedLinkedIssues(
      clientFor(bodies[name]),
      bodies[name].body,
      REPO
    );
    expect([...result].sort((a, b) => a - b)).toEqual([...expected].sort((a, b) => a - b));
  });

  it('never adds an issue the text extraction did not find', async () => {
    const client = clientFor(bodies.keywords);
    // The text has no keyword reference, so a rendered link elsewhere cannot add one.
    await expect(extractRenderedLinkedIssues(client, 'See #3556', REPO)).resolves.toEqual([]);
  });

  it('throws when the body cannot be rendered, so the workflow changes nothing', async () => {
    const client = { rest: { markdown: { render: () => Promise.reject(new Error('HTTP 502')) } } };
    await expect(extractRenderedLinkedIssues(client, 'Closes #1', REPO)).rejects.toThrow(
      'HTTP 502'
    );
  });

  it('makes no render request for a body with no keyword reference', async () => {
    const client = clientFor(bodies.keywords);
    await extractRenderedLinkedIssues(client, 'No references here', REPO);
    expect(client.calls).toEqual([]);
  });
});
