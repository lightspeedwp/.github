/**
 * Tests for the rendered-link helper and its use in phase progression.
 *
 * The HTML fixtures are real output of the GitHub Markdown API (POST /markdown,
 * mode gfm, context lightspeedwp/.github), saved so the tests need no network.
 */

const {
  issuesFromRenderedHtml,
  keywordIssuesFromRenderedHtml,
  renderedIssueLinks,
  renderedKeywordIssues,
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
      issuesFromRenderedHtml('<a href="https://github.com/other/repo/issues/3556">x</a>', REPO)
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

describe('keywordIssuesFromRenderedHtml', () => {
  it('reads each keyword form GitHub rendered as a link, in order', () => {
    expect(keywordIssuesFromRenderedHtml(bodies.keywords.html, REPO)).toEqual([
      3556, 449, 3733, 3734,
    ]);
    expect(keywordIssuesFromRenderedHtml(bodies.keywordForms.html, REPO)).toEqual([
      449, 3733, 3734,
    ]);
  });

  it.each([
    'keywordInFence',
    'keywordInIndentedCode',
    'keywordInCodeSpan',
    'keywordInComment',
    'keywordOtherRepository',
    'keywordMissingIssue',
    'keywordFencedWithSeparateLink',
  ])('finds only the real keyword link in %s', (name) => {
    expect(keywordIssuesFromRenderedHtml(bodies[name].html, REPO)).toEqual([449]);
  });

  it('is not vouched for by a separate plain link to the same issue', () => {
    // "See #3556" is a real link, but the keyword reference to #3556 is in a fence.
    const { body, html } = bodies.keywordFencedWithSeparateLink;
    expect(issuesFromRenderedHtml(html, REPO)).toContain(3556);
    expect(extractLinkedIssues(body)).toContain(3556);
    expect(keywordIssuesFromRenderedHtml(html, REPO)).not.toContain(3556);
  });

  it('needs the keyword directly in front of the link', () => {
    const link = '<a href="https://github.com/lightspeedwp/.github/issues/12">#12</a>';
    expect(keywordIssuesFromRenderedHtml(`<p>See ${link}</p>`, REPO)).toEqual([]);
    expect(keywordIssuesFromRenderedHtml(`<p>Closes ${link}</p>`, REPO)).toEqual([12]);
    expect(keywordIssuesFromRenderedHtml(`<p>Closes\n${link}</p>`, REPO)).toEqual([12]);
    expect(keywordIssuesFromRenderedHtml(`<p>Closes, and ${link}</p>`, REPO)).toEqual([]);
    expect(keywordIssuesFromRenderedHtml(`<p>Disclosesx ${link}</p>`, REPO)).toEqual([]);
  });

  it('ignores other repositories, empty and missing input', () => {
    expect(
      keywordIssuesFromRenderedHtml(
        'Closes <a href="https://github.com/other/repo/issues/9">x</a>',
        REPO
      )
    ).toEqual([]);
    expect(keywordIssuesFromRenderedHtml('', REPO)).toEqual([]);
    expect(keywordIssuesFromRenderedHtml(undefined, REPO)).toEqual([]);
  });
});

describe('renderedIssueLinks and renderedKeywordIssues', () => {
  it('render in gfm mode with the repository as context', async () => {
    const client = clientFor(bodies.keywords);
    await expect(renderedIssueLinks(client, bodies.keywords.body, REPO)).resolves.toEqual([
      3556, 449, 3733, 3734,
    ]);
    await expect(renderedKeywordIssues(client, bodies.keywords.body, REPO)).resolves.toEqual([
      3556, 449, 3733, 3734,
    ]);
    expect(client.calls[0]).toEqual({ text: bodies.keywords.body, mode: 'gfm', context: REPO });
  });

  it('make no request for an empty body', async () => {
    const client = clientFor({ html: '' });
    await expect(renderedIssueLinks(client, '  ', REPO)).resolves.toEqual([]);
    await expect(renderedKeywordIssues(client, '', REPO)).resolves.toEqual([]);
    expect(client.calls).toEqual([]);
  });

  it('let a render failure through so a caller can skip its write', async () => {
    const client = { rest: { markdown: { render: () => Promise.reject(new Error('HTTP 502')) } } };
    await expect(renderedIssueLinks(client, 'Closes #1', REPO)).rejects.toThrow('HTTP 502');
    await expect(renderedKeywordIssues(client, 'Closes #1', REPO)).rejects.toThrow('HTTP 502');
  });
});

describe('phase progression linked issues', () => {
  it.each([
    'keywordInFence',
    'keywordInIndentedCode',
    'keywordInCodeSpan',
    'keywordInComment',
    'keywordMissingIssue',
    'keywordFencedWithSeparateLink',
  ])('the text extraction alone also picks up the code sample in %s', (name) => {
    // This is the defect: reading text finds an issue GitHub does not link.
    expect(extractLinkedIssues(bodies[name].body).length).toBeGreaterThan(1);
  });

  it.each([
    ['keywords', [3556, 449, 3733, 3734]],
    ['keywordForms', [449, 3733, 3734]],
    ['keywordInFence', [449]],
    ['keywordInIndentedCode', [449]],
    ['keywordInCodeSpan', [449]],
    ['keywordInComment', [449]],
    ['keywordOtherRepository', [449]],
    ['keywordMissingIssue', [449]],
    ['keywordFencedWithSeparateLink', [449]],
  ])('moves only the issues GitHub links with a keyword in %s', async (name, expected) => {
    const result = await extractRenderedLinkedIssues(
      clientFor(bodies[name]),
      bodies[name].body,
      REPO
    );
    expect([...result].sort((a, b) => a - b)).toEqual([...expected].sort((a, b) => a - b));
  });

  it('never adds an issue that has no keyword in front of its link', async () => {
    await expect(
      extractRenderedLinkedIssues(
        clientFor(bodies.keywordFencedWithSeparateLink),
        'See #3556',
        REPO
      )
    ).resolves.not.toContain(3556);
  });

  it('throws when the body cannot be rendered, so the workflow changes nothing', async () => {
    const client = { rest: { markdown: { render: () => Promise.reject(new Error('HTTP 502')) } } };
    await expect(extractRenderedLinkedIssues(client, 'Closes #1', REPO)).rejects.toThrow(
      'HTTP 502'
    );
  });

  it('makes no render request for an empty body', async () => {
    const client = clientFor(bodies.keywords);
    await extractRenderedLinkedIssues(client, '   ', REPO);
    expect(client.calls).toEqual([]);
  });
});
