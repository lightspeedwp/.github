// Guard for #3552: every Jest test file in the repo must be executed by
// exactly one runner. The root suite (CJS require path) cannot run
// ESM-authored suites using import.meta, which are owned by the nested
// agents/pr-agent runner (vm-modules). If either side of that split
// breaks, this test fails instead of suites silently going unrun.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../../..');
const PR_AGENT = path.join(ROOT, 'agents/pr-agent');

// Repository-relative path with `/` separators on every OS.
const toPosix = (file) => path.relative(PR_AGENT, file).split(path.sep).join('/');

function listTestFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listTestFiles(full, out);
    } else if (/\.test\.[cm]?js$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

describe('jest runner wiring (#3552)', () => {
  test('root test:js chains the nested pr-agent runner', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.scripts['test:js']).toMatch(/agents\/pr-agent/);
  });

  test('root jest config delegates agents/pr-agent instead of running it', () => {
    const configSource = fs.readFileSync(path.join(ROOT, '.jest.config.cjs'), 'utf8');
    expect(configSource).toMatch(/agents\/pr-agent\//);
  });

  test('every pr-agent test file is run by the nested runner', () => {
    const files = listTestFiles(PR_AGENT).map(toPosix).sort();
    expect(files.length).toBeGreaterThan(0);

    // Ask the nested runner which files its projects actually match, so a
    // file outside every project's testMatch or extensions is caught.
    const result = spawnSync(
      process.execPath,
      [path.join(PR_AGENT, 'scripts/jest-vm.js'), '--listTests'],
      { cwd: PR_AGENT, encoding: 'utf8' }
    );
    expect(result.status).toBe(0);
    const listed = new Set(
      result.stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .map((file) => toPosix(path.resolve(PR_AGENT, file)))
    );

    const orphaned = files.filter((file) => !listed.has(file));
    expect(orphaned).toEqual([]);
  }, 60000);

  test('root-ignored standalone suites each have a dedicated npm script', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const scripts = JSON.stringify(pkg.scripts);
    for (const name of [
      'test:agent-spec-validation',
      'test:index-generator',
      'test:create-agent-spec',
    ]) {
      expect(scripts).toMatch(name);
    }
  });
});
