const fs = require('fs');
const os = require('os');
const path = require('path');

// Isolates these tests from the real .github/footers.yml and from
// process.cwd() -- loadFooterConfig() reads process.cwd() + '.github/footers.yml'
// on every call, so each test gets its own fixture directory with that
// same layout and mocks cwd to point there for the test's duration.
// Phrases must match one of FOOTER_PATTERNS' hardcoded literal fragments
// (branding.agent.js's dedup regex recognizes specific English phrases,
// not arbitrary config content) -- "Prefer a guided" and "Need help?" are
// both entries in FOOTER_PATTERNS, same as the real .github/footers.yml.
const FIXTURE_CONFIG = [
  'categories:',
  '  docs:',
  '    phrases:',
  '      - "Prefer a guided setup? Book a consult."',
  'default:',
  '  phrases:',
  '    - "Need help? Say hi."',
  '',
].join('\n');

function setUpFixtureCwd() {
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-agent-fixture-'));
  fs.mkdirSync(path.join(fixtureDir, '.github'), { recursive: true });
  fs.writeFileSync(path.join(fixtureDir, '.github', 'footers.yml'), FIXTURE_CONFIG);
  return jest.spyOn(process, 'cwd').mockReturnValue(fixtureDir);
}

describe('branding.agent footer functions', () => {
  let cwdSpy;

  afterEach(() => {
    cwdSpy?.mockRestore();
  });

  test('loadFooterConfig reads .github/footers.yml, not .github/automation/footers.yml', async () => {
    cwdSpy = setUpFixtureCwd();
    const { getFooterPhrases } = await import('../branding.agent.js');
    expect(getFooterPhrases('docs')).toEqual(['Prefer a guided setup? Book a consult.']);
  });

  test('getFooterPhrases falls back to the top-level default for an unknown category', async () => {
    cwdSpy = setUpFixtureCwd();
    const { getFooterPhrases } = await import('../branding.agent.js');
    expect(getFooterPhrases('unknown')).toEqual(['Need help? Say hi.']);
  });

  test('ensureFooter is idempotent across repeated runs, including asterisk-wrapped footers', async () => {
    cwdSpy = setUpFixtureCwd();
    const { ensureFooter } = await import('../branding.agent.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-agent-idempotent-'));
    const filePath = path.join(tmpDir, 'test.md');

    fs.writeFileSync(
      filePath,
      '# Test\n\nSome content.\n\n*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*\n'
    );

    ensureFooter(filePath, { category: 'docs', seed: 'x' });
    const afterFirstRun = fs.readFileSync(filePath, 'utf8');

    ensureFooter(filePath, { category: 'docs', seed: 'x' });
    const afterSecondRun = fs.readFileSync(filePath, 'utf8');

    expect(afterFirstRun).toBe(afterSecondRun);
    expect(afterSecondRun.trim().split(/\n\s*\n/)).toHaveLength(3);
  });
});
