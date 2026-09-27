const fs = require('fs');
const os = require('os');
const path = require('path');

// Isolates these tests from the real .github/footers.yml and from
// process.cwd() -- loadFooterConfig() reads process.cwd() + '.github/footers.yml'
// on every call, so each test gets its own fixture directory with that
// same layout, and mocks cwd to point there for the duration of the test.
// This keeps the exact-phrase assertions stable even if the real
// .github/footers.yml's phrase list changes later, or the test runner's
// working directory isn't the repo root.
const FIXTURE_CONFIG = [
  'categories:',
  '  docs:',
  '    phrases:',
  '      - "Fixture docs phrase A."',
  '      - "Fixture docs phrase B."',
  'default:',
  '  phrases:',
  '    - "Fixture default phrase."',
  '',
].join('\n');

function setUpFixtureCwd() {
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'header-footer-fixture-'));
  fs.mkdirSync(path.join(fixtureDir, '.github'), { recursive: true });
  fs.writeFileSync(path.join(fixtureDir, '.github', 'footers.yml'), FIXTURE_CONFIG);
  return jest.spyOn(process, 'cwd').mockReturnValue(fixtureDir);
}

describe('header-footer', () => {
  let cwdSpy;

  afterEach(() => {
    cwdSpy?.mockRestore();
  });

  test('ensureFooter appends the canonical docs footer', async () => {
    cwdSpy = setUpFixtureCwd();
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-footer-'));
    const filePath = path.join(tmpDir, 'branching-strategy.md');

    fs.writeFileSync(
      filePath,
      [
        '---',
        'title: Org-wide Git Branching Strategy',
        'description: Canonical branch naming and merge discipline.',
        'file_type: documentation',
        '---',
        '',
        '# Org-wide Git Branching Strategy',
        '',
        'Primary operations reference.',
        '',
      ].join('\n')
    );

    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(true);

    // selectFooter()'s hash deterministically maps seed "branching" to
    // index 0 of the fixture's 2-phrase "docs" category list.
    const output = fs.readFileSync(filePath, 'utf8');
    expect(output).toContain('Fixture docs phrase A.');
    expect(output).not.toContain('https://lightspeedwp.agency/contact');
  });

  test('ensureFooter is idempotent for a bare, generic configured footer', async () => {
    // "Fixture docs phrase A." matches no footer pattern, so the end-anchored
    // matcher cannot see it -- which is the point. Some real configured footers
    // are bare and generic too ("Need help? Say hi--work with us."), so without
    // an explicit check the second run would fail to find the footer it had just
    // written and append a second one. That is the compounding bug #3443 fixed,
    // and it was reachable again once the matcher stopped treating every
    // phrase-shaped line as a footer.
    cwdSpy = setUpFixtureCwd();
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-idempotent-'));
    const filePath = path.join(tmpDir, 'repeat.md');

    fs.writeFileSync(filePath, '# Repeat\n\nPrimary operations reference.\n');

    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(true);
    const afterFirst = fs.readFileSync(filePath, 'utf8');

    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(false);
    expect(fs.readFileSync(filePath, 'utf8')).toBe(afterFirst);
    expect(afterFirst.match(/Fixture docs phrase A\./g)).toHaveLength(1);
  });

  test('ensureFooter still appends when the file ends with unrelated prose', async () => {
    // The idempotency check compares against the literal footer this call would
    // write, so it must not be widened into "the file ends with something that
    // looks like a footer".
    cwdSpy = setUpFixtureCwd();
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-prose-'));
    const filePath = path.join(tmpDir, 'prose.md');

    fs.writeFileSync(filePath, 'Runbook\n\nUpdate when the API version changes.\n');

    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(true);

    const output = fs.readFileSync(filePath, 'utf8');
    expect(output).toContain('Update when the API version changes.');
    expect(output).toContain('Fixture docs phrase A.');
  });

  test('ensureFooter ignores footer text mentioned in the body', async () => {
    cwdSpy = setUpFixtureCwd();
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-footer-body-'));
    const filePath = path.join(tmpDir, 'branding-note.md');

    fs.writeFileSync(
      filePath,
      [
        '---',
        'title: Branding note',
        'description: Body text mentions the footer phrase.',
        'file_type: documentation',
        '---',
        '',
        'This note mentions Fixture docs phrase A. in the body.',
        '',
      ].join('\n')
    );

    // Same seed as the previous test: selectFooter()'s hash deterministically
    // maps "branching" to the fixture's "docs" category index-0 phrase
    // ("Fixture docs phrase A."), so the appended footer is guaranteed to
    // be that same phrase, letting this assert on exactly 2 occurrences --
    // one from the body, one appended.
    expect(ensureFooter(filePath, { category: 'docs', seed: 'branching' })).toBe(true);

    const output = fs.readFileSync(filePath, 'utf8');
    const footerMatches = output.match(/Fixture docs phrase A\./g) || [];
    expect(footerMatches).toHaveLength(2);
  });

  test('ensureFooter uses the top-level default for an unknown category', async () => {
    cwdSpy = setUpFixtureCwd();
    const { ensureFooter } = await import('../header-footer.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-footer-default-'));
    const filePath = path.join(tmpDir, 'default-footer.md');

    fs.writeFileSync(filePath, '# Default footer test\n');

    // "unknown" isn't a key under the fixture's `categories`, so this
    // exercises getFooterPhrases()'s fallback to the top-level `default`
    // block -- the exact regression this PR fixes (it previously read
    // config.categories.default, which footers.yml never defines, and
    // silently fell through to DEFAULT_FOOTERS instead).
    expect(ensureFooter(filePath, { category: 'unknown', seed: 'b' })).toBe(true);

    const output = fs.readFileSync(filePath, 'utf8');
    expect(output).toContain('Fixture default phrase.');
  });

  test('getFooterPhrases honours a config with only a top-level default (#3538)', async () => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'header-footer-default-only-'));
    fs.mkdirSync(path.join(fixtureDir, '.github'), { recursive: true });
    fs.writeFileSync(
      path.join(fixtureDir, '.github', 'footers.yml'),
      ['default:', '  phrases:', '    - "Fixture default phrase."', ''].join('\n')
    );
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(fixtureDir);

    const { getFooterPhrases } = await import('../header-footer.js');

    expect(getFooterPhrases('docs')).toEqual(['Fixture default phrase.']);
    expect(getFooterPhrases('unknown')).toEqual(['Fixture default phrase.']);
  });
});
