/**
 * Tests for tests/jest.working-tree-guard.cjs (#3498), run in throwaway Git
 * repositories through a child process so the guard sees their status.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const guard = path.join(__dirname, '..', 'jest.working-tree-guard.cjs');

function repo() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tree-guard-'));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args]);
  git('init', '-q');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Test');
  fs.writeFileSync(path.join(directory, 'tracked.txt'), 'one\n');
  git('add', 'tracked.txt');
  git('commit', '-qm', 'init');
  return { directory, git };
}

/** Run setup, then `during` (JS source), then teardown; report the outcome. */
function runGuard(directory, during, { skipSetup = false } = {}) {
  const script = `
    const fs = require("node:fs");
    const { setup, teardown } = require(${JSON.stringify(guard)});
    (async () => {
      ${skipSetup ? '' : 'await setup();'}
      ${during}
      try { await teardown(); console.log("PASS"); }
      catch (error) { console.log("FAIL " + error.message); }
    })();
  `;
  const env = { ...process.env };
  delete env.ALLOW_TEST_ARTEFACTS;
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: directory,
    encoding: 'utf8',
    env,
  });
  return `${result.stdout}${result.stderr}`;
}

describe('working tree guard', () => {
  const directories = [];
  const make = () => {
    const created = repo();
    directories.push(created.directory);
    return created;
  };
  afterAll(() => directories.forEach((d) => fs.rmSync(d, { force: true, recursive: true })));

  test('fails when a test creates a file', () => {
    const { directory } = make();
    const output = runGuard(directory, 'fs.writeFileSync("new.txt", "x");');
    expect(output).toContain('FAIL');
    expect(output).toContain('?? new.txt');
  });

  test('fails when a test changes an already modified file', () => {
    const { directory } = make();
    fs.writeFileSync(path.join(directory, 'tracked.txt'), 'local edit\n');
    const output = runGuard(
      directory,
      'fs.writeFileSync("tracked.txt", "rewritten by a test\\n");'
    );
    expect(output).toContain('FAIL');
    expect(output).toContain('tracked.txt');
  });

  test('passes when nothing changes, including a rename made before the run', () => {
    const { directory, git } = make();
    git('mv', 'tracked.txt', 'renamed.txt');
    expect(runGuard(directory, '')).toContain('PASS');
  });

  test('warns instead of passing silently when setup did not run', () => {
    const { directory } = make();
    const output = runGuard(directory, '', { skipSetup: true });
    expect(output).toContain('did not run');
  });
});
