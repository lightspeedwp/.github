const fs = require('fs');
const os = require('os');
const path = require('path');

// Architecture guard for #3544: the footer phrase/config-selection
// algorithm must have a single source of truth
// (scripts/agents/includes/footer-phrases.js). Both callers delegate to
// it while keeping their own (intentionally different) DEFAULT_FOOTERS.
// If either module reintroduces independent selection logic, the parity
// assertions below fail.
const CONFIGS = {
  full: [
    'categories:',
    '  docs:',
    '    phrases:',
    '      - "Docs A."',
    '      - "Docs B."',
    'default:',
    '  phrases:',
    '    - "Default phrase."',
    '',
  ].join('\n'),
  defaultOnly: ['default:', '  phrases:', '    - "Default phrase."', ''].join('\n'),
};

function setUpConfigCwd(yaml) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'footer-parity-'));
  fs.mkdirSync(path.join(dir, '.github'), { recursive: true });
  if (yaml !== null) {
    fs.writeFileSync(path.join(dir, '.github', 'footers.yml'), yaml);
  }
  return jest.spyOn(process, 'cwd').mockReturnValue(dir);
}

describe('footer phrase parity (#3544)', () => {
  let cwdSpy;

  afterEach(() => {
    cwdSpy?.mockRestore();
  });

  test.each([
    ['full config, known category', CONFIGS.full, 'docs', ['Docs A.', 'Docs B.']],
    ['full config, unknown category', CONFIGS.full, 'nope', ['Default phrase.']],
    ['default-only config, known category', CONFIGS.defaultOnly, 'docs', ['Default phrase.']],
    ['default-only config, unknown category', CONFIGS.defaultOnly, 'nope', ['Default phrase.']],
  ])('both modules resolve %s identically', async (_, yaml, category, expected) => {
    cwdSpy = setUpConfigCwd(yaml);
    const headerFooter = await import('../includes/header-footer.js');
    const branding = await import('../branding.agent.js');

    expect(headerFooter.getFooterPhrases(category)).toEqual(expected);
    expect(branding.getFooterPhrases(category)).toEqual(expected);
  });

  test('seeded selection is deterministic and identical in both modules', async () => {
    cwdSpy = setUpConfigCwd(CONFIGS.full);
    const headerFooter = await import('../includes/header-footer.js');
    const branding = await import('../branding.agent.js');

    const a = headerFooter.selectFooter(['x', 'y', 'z'], 'parity-seed');
    const b = branding.selectFooter(['x', 'y', 'z'], 'parity-seed');
    expect(a).toBe(b);
  });

  test('each module keeps its own hardcoded fallback when no config exists', async () => {
    cwdSpy = setUpConfigCwd(null);
    const headerFooter = await import('../includes/header-footer.js');
    const branding = await import('../branding.agent.js');

    expect(headerFooter.getFooterPhrases('docs')).toEqual(headerFooter.DEFAULT_FOOTERS);
    expect(branding.getFooterPhrases('docs')).toEqual(branding.DEFAULT_FOOTERS);
    // The fallbacks intentionally differ (#3544 investigation) and must
    // not be silently unified by the shared implementation.
    expect(headerFooter.DEFAULT_FOOTERS).not.toEqual(branding.DEFAULT_FOOTERS);
  });

  test('both callers delegate to the shared module rather than reimplementing it', async () => {
    // The output matrix above cannot catch a reimplementation: a copy that
    // behaves identically leaves every assertion green. Injected and verified --
    // a duplicated algorithm in header-footer.js passed all 7 tests. So the
    // single-source constraint is asserted structurally here, on the call sites.
    const headerFooter = await import('../includes/header-footer.js');
    const branding = await import('../branding.agent.js');

    // Matched on the name only: under ESM-to-CJS interop the call is emitted as
    // `(0, _footerPhrases.resolveFooterPhrases)(...)`, so a strict
    // `name(` pattern would not match a genuine delegation.
    expect(headerFooter.getFooterPhrases.toString()).toContain('resolveFooterPhrases');
    expect(headerFooter.selectFooter.toString()).toContain('selectFooterPhrase');
    expect(branding.getFooterPhrases.toString()).toContain('resolveFooterPhrases');
    expect(branding.selectFooter.toString()).toContain('selectFooterPhrase');
  });

  test('only the shared module carries the selection algorithm', () => {
    // Belt and braces: if a caller is later refactored so the function-identity
    // check no longer applies, no caller may carry its own copy of the
    // category-then-default resolution or the seeded hash.
    for (const caller of ['../includes/header-footer.js', '../branding.agent.js']) {
      const source = fs.readFileSync(require.resolve(caller), 'utf8');
      expect(source).not.toMatch(/config\.categories\s*&&/);
      expect(source).not.toMatch(/charCodeAt\(/);
    }
    const shared = fs.readFileSync(require.resolve('../includes/footer-phrases.js'), 'utf8');
    expect(shared).toMatch(/config\.categories\s*&&/);
    expect(shared).toMatch(/charCodeAt\(/);
  });

  test('shared module resolves the full contract directly', async () => {
    const { resolveFooterPhrases, selectFooterPhrase } = await import(
      '../includes/footer-phrases.js'
    );
    const fallback = ['fb'];

    expect(resolveFooterPhrases(null, 'docs', fallback)).toEqual(fallback);
    expect(
      resolveFooterPhrases({ categories: { docs: { phrases: ['c'] } } }, 'docs', fallback)
    ).toEqual(['c']);
    expect(resolveFooterPhrases({ default: { phrases: ['d'] } }, 'docs', fallback)).toEqual([
      'd',
    ]);
    expect(selectFooterPhrase([], 's', 'fb0')).toBe('fb0');
    expect(selectFooterPhrase(['a', 'b'], 's', 'fb0')).toBe(
      selectFooterPhrase(['a', 'b'], 's', 'fb0')
    );
  });
});
