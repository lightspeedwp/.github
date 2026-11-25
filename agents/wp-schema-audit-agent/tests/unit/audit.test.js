/**
 * @jest-environment node
 *
 * Unit tests for page audits, URL discovery and the CLI (spec 023, User
 * Stories 1 and 2). The network is replaced by a fetch stub throughout.
 */

const http = require('node:http');

const {
  auditPage,
  discoverUrls,
  fetchUrl,
  isLocalHost,
  main,
  EXIT_OK,
  EXIT_FINDINGS,
  EXIT_ERROR,
} = require('../../lib/schema-tool.cjs');
const { VOCAB_FILE, loadVocab, page, stubFetch, checks } = require('./helpers.cjs');

const vocab = loadVocab();
const SITE = 'https://beta.local';

function output() {
  let text = '';
  return {
    write: (chunk) => (text += chunk),
    get text() {
      return text;
    },
  };
}

describe('isLocalHost', () => {
  it('relaxes certificate checks only for local development hosts', () => {
    for (const host of [
      'localhost',
      '127.0.0.1',
      '[::1]',
      'beta.local',
      'shop.test',
      'app.localhost',
    ]) {
      expect(isLocalHost(host)).toBe(true);
    }
    for (const host of [
      'southerndestinations.lightspeedwp.dev',
      'example.com',
      'local.example.com',
    ]) {
      expect(isLocalHost(host)).toBe(false);
    }
  });
});

describe('fetchUrl', () => {
  let server;
  afterEach(() => server && server.close());

  it('rejects when the server closes the connection mid-body', async () => {
    server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': '1000' });
      res.write('<html>');
      setImmediate(() => res.socket.destroy());
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    await expect(fetchUrl(`http://127.0.0.1:${port}/`)).rejects.toThrow();
  });
});

describe('auditPage', () => {
  it('reports a single page that redirects to an archive', async () => {
    const fetch = stubFetch({
      [`${SITE}/special/a/`]: {
        redirectTo: `${SITE}/specials/`,
        body: page([{ '@type': 'WebPage', name: 'Specials' }]),
      },
    });
    const result = await auditPage(`${SITE}/special/a/`, { vocab, fetch });
    expect(result.finalUrl).toBe(`${SITE}/specials/`);
    expect(checks(result.findings)).toEqual(['warn redirected']);
  });

  it('reports HTTP errors, pages without JSON-LD and fetch failures', async () => {
    const fetch = stubFetch({
      [`${SITE}/plain/`]: { body: '<html></html>' },
      [`${SITE}/down/`]: new Error('connect ECONNREFUSED'),
    });
    expect(checks((await auditPage(`${SITE}/gone/`, { vocab, fetch })).findings)).toEqual([
      'error http-status',
    ]);
    expect(checks((await auditPage(`${SITE}/plain/`, { vocab, fetch })).findings)).toEqual([
      'warn no-structured-data',
    ]);
    expect(checks((await auditPage(`${SITE}/down/`, { vocab, fetch })).findings)).toEqual([
      'error fetch-failed',
    ]);
  });

  it('lists errors before warnings before notes', async () => {
    const fetch = stubFetch({
      [`${SITE}/`]: { body: page([{ '@type': 'TouristTrip', nmae: 'x', offers: [] }]) },
    });
    const severities = (await auditPage(`${SITE}/`, { vocab, fetch })).findings.map(
      (f) => f.severity
    );
    expect(severities).toEqual(
      [...severities].sort(
        (a, b) => ['error', 'warn', 'info'].indexOf(a) - ['error', 'warn', 'info'].indexOf(b)
      )
    );
  });
});

describe('discoverUrls', () => {
  const rest = (route) => `${SITE}/wp-json/${route}`;
  const routes = {
    [rest('wp/v2/types')]: {
      body: {
        post: { name: 'Posts', rest_base: 'posts', rest_namespace: 'wp/v2' },
        page: { name: 'Pages', rest_base: 'pages', rest_namespace: 'wp/v2' },
        attachment: { name: 'Media', rest_base: 'media', rest_namespace: 'wp/v2' },
        tour: { name: 'Tours', rest_base: 'tour', rest_namespace: 'wp/v2' },
        special: { name: 'Specials', rest_base: 'special', rest_namespace: 'wp/v2' },
        popup: { name: 'Popups', rest_base: 'popups', rest_namespace: 'wp/v2' },
        team: { name: 'Team', rest_base: 'team', rest_namespace: 'wp/v2' },
      },
    },
    [rest('wp/v2/posts?per_page=1&_fields=link')]: { body: [{ link: `${SITE}/hello-world/` }] },
    [rest('wp/v2/tour?per_page=1&_fields=link')]: { body: [{ link: `${SITE}/tour/a/` }] },
    [rest('wp/v2/special?per_page=1&_fields=link')]: { body: [{ link: `${SITE}/special/a/` }] },
    [rest('wp/v2/popups?per_page=1&_fields=link')]: { body: [{ link: `${SITE}/popup/a/` }] },
    [rest('wp/v2/team?per_page=1&_fields=link')]: { body: [] },
    [`${SITE}/hello-world/`]: { body: '' },
    [`${SITE}/tour/a/`]: { body: '' },
    [`${SITE}/special/a/`]: { redirectTo: `${SITE}/specials/`, body: '' },
    [`${SITE}/?post_type=tour`]: { redirectTo: `${SITE}/tours/`, body: '' },
    [`${SITE}/?post_type=special`]: { redirectTo: `${SITE}/specials/`, body: '' },
    [`${SITE}/?post_type=popup`]: { body: '' },
    [rest('wp/v2/taxonomies')]: {
      body: {
        category: { name: 'Categories', rest_base: 'categories', rest_namespace: 'wp/v2' },
        nav_menu: { name: 'Menus', rest_base: 'menus', rest_namespace: 'wp/v2' },
        'travel-style': {
          name: 'Travel Styles',
          rest_base: 'travel-style',
          rest_namespace: 'wp/v2',
        },
      },
    },
    [rest('wp/v2/categories?per_page=1&hide_empty=true&orderby=count&order=desc&_fields=link')]: {
      body: [{ link: `${SITE}/category/news/` }],
    },
    [rest('wp/v2/travel-style?per_page=1&hide_empty=true&orderby=count&order=desc&_fields=link')]: {
      body: [],
    },
    [`${SITE}/category/news/`]: { body: '' },
    [rest('wp/v2/pages?per_page=100&_fields=link,slug')]: {
      body: [
        { slug: 'contact', link: `${SITE}/contact/` },
        { slug: 'sample-page', link: `${SITE}/sample-page/` },
        { slug: 'about-us', link: `${SITE}/about-us/` },
      ],
    },
    [rest('wp/v2/users?per_page=1&_fields=link')]: { body: [{ link: `${SITE}/author/admin/` }] },
    [`${SITE}/author/admin/`]: { body: '' },
  };

  it('picks one URL per public type, archive, taxonomy, key page, author and search', async () => {
    const result = await discoverUrls(`${SITE}/`, { fetch: stubFetch(routes), search: 'safari' });
    expect(result.urls.map((u) => `${u.kind} ${u.url}`)).toEqual([
      `home ${SITE}/`,
      `single ${SITE}/hello-world/`,
      `single ${SITE}/tour/a/`,
      `archive ${SITE}/tours/`,
      `single ${SITE}/special/a/`,
      `archive ${SITE}/specials/`,
      `term ${SITE}/category/news/`,
      `page ${SITE}/contact/`,
      `page ${SITE}/about-us/`,
      `author ${SITE}/author/admin/`,
      `search ${SITE}/?s=safari`,
    ]);
    expect(result.urls.find((u) => u.url === `${SITE}/special/a/`).note).toBe(
      `redirects to ${SITE}/specials/`
    );
  });

  it('explains what it skipped and why', async () => {
    const { skipped } = await discoverUrls(SITE, { fetch: stubFetch(routes) });
    expect(skipped.map((s) => `${s.label}: ${s.reason}`)).toEqual([
      'Popups: HTTP 404',
      'Team: no published items',
      'Travel Styles: no terms in use',
    ]);
  });

  it('finds archives WordPress renders in place, preferring the canonical URL', async () => {
    const archiveBody = (canonical) =>
      `<html><head>${canonical ? `<link rel="canonical" href="${canonical}" />` : ''}</head>` +
      '<body class="archive post-type-archive post-type-archive-tour"></body></html>';
    const inPlace = (canonical) => ({
      ...routes,
      [`${SITE}/?post_type=tour`]: { body: archiveBody(canonical) },
      // The home page fallback carries no archive class, so it is not an archive.
      [`${SITE}/?post_type=special`]: { body: '<body class="home blog">' },
    });
    const archives = async (canonical) =>
      (await discoverUrls(SITE, { fetch: stubFetch(inPlace(canonical)) })).urls
        .filter((u) => u.kind === 'archive')
        .map((u) => u.url);
    expect(await archives(`${SITE}/tours/`)).toEqual([`${SITE}/tours/`]);
    expect(await archives(null)).toEqual([`${SITE}/?post_type=tour`]);
  });

  it('falls back to ?rest_route= when pretty REST URLs are unavailable', async () => {
    const fetch = stubFetch({ [`${SITE}/?rest_route=/wp/v2/types`]: { body: {} } });
    const result = await discoverUrls(SITE, { fetch });
    expect(result.urls.map((u) => u.kind)).toEqual(['home', 'search']);
  });

  it('fails clearly when the REST API is unreachable', async () => {
    await expect(discoverUrls(SITE, { fetch: stubFetch({}) })).rejects.toThrow(
      /REST API is not reachable/
    );
  });
});

describe('main', () => {
  const pages = {
    [`${SITE}/ok/`]: { body: page([{ '@type': 'WebPage', name: 'OK' }]) },
    [`${SITE}/bad/`]: { body: page([{ '@type': 'Offer', name: 'Empty' }]) },
  };

  it('exits 0 when every page is clean and 1 when there are warnings', async () => {
    const fetch = stubFetch(pages);
    const out = output();
    expect(
      await main(['validate', `${SITE}/ok/`, '--vocab', VOCAB_FILE], { stdout: out, fetch })
    ).toBe(EXIT_OK);
    expect(out.text).toMatch(/0 error\(s\), 0 warning\(s\)/);
    expect(
      await main(['validate', `${SITE}/bad/`, '--vocab', VOCAB_FILE], { stdout: output(), fetch })
    ).toBe(EXIT_FINDINGS);
  });

  it('writes a JSON report with --json', async () => {
    const out = output();
    await main(['validate', `${SITE}/bad/`, '--vocab', VOCAB_FILE, '--json'], {
      stdout: out,
      fetch: stubFetch(pages),
    });
    const report = JSON.parse(out.text);
    expect(report.pages[0]).toMatchObject({
      url: `${SITE}/bad/`,
      status: 200,
      types: { Offer: 1 },
    });
    expect(report.totals.warn).toBeGreaterThan(0);
  });

  it('exits 2 with a message on bad usage', async () => {
    const err = output();
    expect(await main(['validate'], { stdout: output(), stderr: err, fetch: stubFetch({}) })).toBe(
      EXIT_ERROR
    );
    expect(err.text).toMatch(/at least one URL/);
    expect(await main(['validate', '--vocab'], { stdout: output(), stderr: output() })).toBe(
      EXIT_ERROR
    );
    expect(await main(['nonsense'], { stdout: output(), stderr: output() })).toBe(EXIT_ERROR);
  });
});
