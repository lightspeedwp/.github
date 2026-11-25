/**
 * @jest-environment node
 *
 * Unit tests for the client report and CSV outputs (spec 023, User Story 4).
 */

const fs = require('node:fs');
const path = require('node:path');

const {
  CHECK_GUIDE,
  CSV_COLUMNS,
  csvField,
  renderClientReport,
  renderCsv,
} = require('../../lib/report-formats.cjs');
const { main, EXIT_ERROR, EXIT_FINDINGS } = require('../../lib/schema-tool.cjs');
const { VOCAB_FILE, page, stubFetch, tempDir } = require('./helpers.cjs');

const SITE = 'https://beta.local';

const report = {
  vocabulary: { version: '30.1' },
  totals: { error: 1, warn: 2, info: 1 },
  notes: [],
  skipped: [{ kind: 'single', label: 'Presets', url: '', reason: 'no published items' }],
  pages: [
    {
      url: `${SITE}/`,
      kind: 'home',
      label: 'Home page',
      status: 200,
      types: { WebPage: 1, WebSite: 1, Organization: 1 },
      findings: [],
    },
    {
      url: `${SITE}/special/a/`,
      kind: 'single',
      label: 'Specials',
      status: 200,
      types: { Offer: 1, WebPage: 1, BreadcrumbList: 1 },
      findings: [
        {
          severity: 'error',
          check: 'unknown-property',
          path: 'block0<Offer>',
          detail: "'pricee' is not a schema.org property.",
        },
        {
          severity: 'warn',
          check: 'expired-offer',
          path: 'block0<Offer>',
          detail: 'Offer ended on 2026-09-01 but still says LimitedAvailability.',
        },
        {
          severity: 'info',
          check: 'pending-type',
          path: 'block0<TouristTrip>',
          detail: "'TouristTrip' is still in schema.org's pending section.",
        },
      ],
    },
    {
      url: `${SITE}/special/b/`,
      kind: 'single',
      label: '',
      status: 200,
      types: { Offer: 1 },
      findings: [
        {
          severity: 'warn',
          check: 'expired-offer',
          path: 'block0<Offer>',
          detail: 'Offer ended on 2026-09-01 but still says LimitedAvailability.',
        },
      ],
    },
  ],
};

describe('CHECK_GUIDE', () => {
  it('explains every check the validator can report', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', '..', 'lib', 'schema-tool.cjs'),
      'utf8'
    );
    const checks = new Set(
      [
        ...source.matchAll(/check: '([a-z-]+)'/g),
        ...source.matchAll(/add\(\s*'(?:error|warn|info)',\s*'([a-z-]+)'/g),
      ].map((m) => m[1])
    );
    expect(checks.size).toBeGreaterThan(20);
    for (const check of checks) {
      expect(CHECK_GUIDE[check]).toEqual({
        title: expect.any(String),
        why: expect.any(String),
        fix: expect.any(String),
      });
    }
  });
});

describe('renderClientReport', () => {
  const md = renderClientReport(report, {
    client: 'Southern Destinations',
    site: SITE,
    date: '2026-10-15',
  });

  it('opens with the client, site, date and standard checked', () => {
    expect(md).toMatch(/^# Structured data report: Southern Destinations\n/);
    expect(md).toContain(`- **Site:** ${SITE}`);
    expect(md).toContain('- **Date:** 2026-10-15');
    expect(md).toContain('schema.org release 30.1');
  });

  it('counts distinct issues by priority, not raw findings', () => {
    expect(md).toContain('| Must fix | 1 |');
    expect(md).toContain('| Should fix | 1 |');
    expect(md).toContain('| Could improve | 1 |');
    expect(md).toContain('1 of 3 pages have nothing that needs fixing.');
  });

  it('lists each page with its main subject and leaves supporting types out', () => {
    expect(md).toContain(`| [/](${SITE}/) | Home page | Web page (WebPage) | OK |`);
    expect(md).toContain(
      `| [/special/a/](${SITE}/special/a/) | Specials: single item | Offer, Web page (WebPage) | 2 to fix |`
    );
    expect(md).toContain(`| [/special/b/](${SITE}/special/b/) | Single item | Offer | 1 to fix |`);
  });

  it('explains each issue in plain English, most severe first, with every page affected', () => {
    const issues = md.slice(md.indexOf('## Issues to fix'), md.indexOf('## Suggestions'));
    expect(issues.indexOf(CHECK_GUIDE['unknown-property'].title)).toBeLessThan(
      issues.indexOf(CHECK_GUIDE['expired-offer'].title)
    );
    expect(issues).toContain(`- **What to do:** ${CHECK_GUIDE['expired-offer'].fix}`);
    expect(issues).toContain(
      `- **Pages affected (2):** [/special/a/](${SITE}/special/a/), [/special/b/](${SITE}/special/b/)`
    );
  });

  it('keeps suggestions separate, and says what was not checked', () => {
    expect(md).toMatch(
      /## Suggestions for improvement[\s\S]*Uses a type schema.org has not finalised/
    );
    expect(md).toContain('Not checked, with the reason: Presets (no published items).');
    expect(md).toContain('Rich Results Test');
  });

  it('calls out an issue that affects every page, since one setting usually fixes it', () => {
    const empty = {
      severity: 'warn',
      check: 'empty-value',
      path: 'block0<WebSite>',
      detail: "'description' is empty.",
    };
    const everywhere = {
      ...report,
      pages: report.pages.map((p) => ({ ...p, findings: [...p.findings, empty] })),
    };
    expect(renderClientReport(everywhere, { site: SITE })).toContain(
      `One issue affects every page, usually because of a single site-wide setting, so fixing it once clears it everywhere: "${CHECK_GUIDE['empty-value'].title}" ('description' is empty.).`
    );
    expect(md).not.toContain('affects every page');
  });

  it('says so plainly when there is nothing to fix', () => {
    const clean = { ...report, pages: [report.pages[0]], skipped: [] };
    expect(renderClientReport(clean, { site: SITE })).toContain(
      'All 1 pages have valid structured data with nothing that needs fixing.'
    );
  });
});

describe('renderCsv', () => {
  const csv = renderCsv(report);
  const lines = csv
    .replace(/^\uFEFF/, '')
    .trimEnd()
    .split('\r\n');

  it('starts with a byte order mark and a header row', () => {
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(lines[0]).toBe(CSV_COLUMNS.join(','));
  });

  it('has one row per finding and one row for each page without findings', () => {
    expect(lines).toHaveLength(1 + 1 + 3 + 1);
    expect(lines[1]).toBe(`${SITE}/,/,Home page,200,None,,,No issues found,,,,`);
    expect(
      lines[2].startsWith(
        `${SITE}/special/a/,/special/a/,Specials: single item,200,Must fix,error,unknown-property,`
      )
    ).toBe(true);
  });

  it('quotes fields with commas or quotes', () => {
    expect(csvField('a, b')).toBe('"a, b"');
    expect(csvField('say "hi"')).toBe('"say ""hi"""');
    expect(csvField('line\nbreak')).toBe('"line\nbreak"');
  });

  it('defuses values a spreadsheet would run as formulas', () => {
    expect(csvField('=HYPERLINK("http://x")')).toBe('"\'=HYPERLINK(""http://x"")"');
    expect(csvField('+1')).toBe("'+1");
    expect(csvField('-2')).toBe("'-2");
    expect(csvField('@SUM(A1)')).toBe("'@SUM(A1)");
  });
});

describe('main: report output', () => {
  const routes = {
    [`${SITE}/wp-json/wp/v2/types`]: { body: { tour: { name: 'Tours', rest_base: 'tour' } } },
    [`${SITE}/wp-json/wp/v2/tour?per_page=1&_fields=link`]: { body: [{ link: `${SITE}/tour/a/` }] },
    [`${SITE}/`]: { body: page([{ '@type': 'WebPage', name: 'Home' }]) },
    [`${SITE}/tour/a/`]: { body: page([{ '@type': 'Offer', name: 'No price' }]) },
    [`${SITE}/?s=a`]: { body: page([{ '@type': 'WebPage', name: 'Search' }]) },
  };
  const out = () => {
    let text = '';
    return {
      write: (c) => (text += c),
      get text() {
        return text;
      },
    };
  };

  it('audit writes a client report and a CSV, and says what it wrote', async () => {
    const dir = tempDir();
    const reportFile = path.join(dir, 'report.md');
    const csvFile = path.join(dir, 'findings.csv');
    const stdout = out();
    const code = await main(
      [
        'audit',
        SITE,
        '--vocab',
        VOCAB_FILE,
        '--format',
        'report',
        '--out',
        reportFile,
        '--csv',
        csvFile,
        '--client',
        'Beta',
        '--today',
        '2026-10-15',
      ],
      { stdout, fetch: stubFetch(routes) }
    );
    expect(code).toBe(EXIT_FINDINGS);
    expect(stdout.text).toMatch(/Checked 3 page\(s\)/);
    expect(stdout.text).toContain(`Wrote ${reportFile}`);
    const md = fs.readFileSync(reportFile, 'utf8');
    expect(md).toMatch(/^# Structured data report: Beta/);
    expect(md).toContain(`| [/tour/a/](${SITE}/tour/a/) | Tours: single item | Offer | 1 to fix |`);
    expect(fs.readFileSync(csvFile, 'utf8')).toContain('rich-result-required');
  });

  it('refuses to replace an existing file without --force', async () => {
    const file = path.join(tempDir(), 'report.md');
    fs.writeFileSync(file, 'keep me');
    const stderr = out();
    const args = [
      'validate',
      `${SITE}/`,
      '--vocab',
      VOCAB_FILE,
      '--format',
      'report',
      '--out',
      file,
    ];
    expect(await main(args, { stdout: out(), stderr, fetch: stubFetch(routes) })).toBe(EXIT_ERROR);
    expect(stderr.text).toMatch(/already exists; pass --force/);
    expect(fs.readFileSync(file, 'utf8')).toBe('keep me');
    await main([...args, '--force'], { stdout: out(), fetch: stubFetch(routes) });
    expect(fs.readFileSync(file, 'utf8')).toMatch(/^# Structured data report/);
  });

  it('prints CSV to stdout with --format csv, and rejects unknown formats', async () => {
    const stdout = out();
    await main(['validate', `${SITE}/`, '--vocab', VOCAB_FILE, '--format', 'csv'], {
      stdout,
      fetch: stubFetch(routes),
    });
    expect(stdout.text.startsWith(`\uFEFF${CSV_COLUMNS.join(',')}`)).toBe(true);
    const stderr = out();
    expect(
      await main(['validate', `${SITE}/`, '--vocab', VOCAB_FILE, '--format', 'html'], {
        stdout: out(),
        stderr,
        fetch: stubFetch(routes),
      })
    ).toBe(EXIT_ERROR);
    expect(stderr.text).toMatch(/--format must be one of/);
  });
});
