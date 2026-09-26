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
      try {
        ${skipSetup ? '' : 'await setup();'}
        ${during}
        await teardown();
        console.log("PASS");
      } catch (error) {
        console.log("FAIL " + error.message);
      }
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

  test('fails when a test deletes an untracked file', () => {
    const { directory } = make();
    fs.writeFileSync(path.join(directory, 'untracked.txt'), 'temporary\n');
    const output = runGuard(directory, 'fs.unlinkSync("untracked.txt");');
    expect(output).toContain('FAIL');
    expect(output).toContain('?? untracked.txt');
  });

  test('guards the repository named by globalConfig.rootDir, not the process directory', () => {
    // Jest can be launched from anywhere with an absolute --config path. Using
    // process.cwd() made the guard record `not-a-work-tree` and disable itself.
    const { directory, git } = make();
    git('config', 'user.email', 't@t');
    git('config', 'user.name', 't');
    fs.writeFileSync(path.join(directory, 'tracked.txt'), 'clean\n');
    git('add', '-A');
    git('commit', '-qm', 'init');

    const script = `
      const fs = require("node:fs");
      const path = require("node:path");
      const { setup, teardown } = require(${JSON.stringify(guard)});
      (async () => {
        try {
          await setup({ rootDir: ${JSON.stringify(directory)} });
          fs.writeFileSync(path.join(${JSON.stringify(directory)}, "stray.txt"), "x");
          await teardown({ rootDir: ${JSON.stringify(directory)} });
          console.log("PASS");
        } catch (error) {
          console.log("FAIL " + error.message);
        }
      })();
    `;
    const env = { ...process.env };
    delete env.ALLOW_TEST_ARTEFACTS;
    // cwd is deliberately NOT the repository.
    const result = spawnSync(process.execPath, ['-e', script], {
      cwd: os.tmpdir(),
      encoding: 'utf8',
      env,
    });
    const output = `${result.stdout}${result.stderr}`;
    expect(output).toContain('FAIL');
    expect(output).toContain('stray.txt');
  });

  test('fails when a test changes only a file mode', () => {
    // `git hash-object` covers content only, so a chmod left the snapshot value
    // unchanged and the change passed unnoticed even though git reports it.
    const { directory } = make();
    fs.writeFileSync(path.join(directory, 'untracked.txt'), 'artefact\n');
    const output = runGuard(
      directory,
      'require("fs").chmodSync(require("path").join(dir, "untracked.txt"), 0o755);'.replace(
        'dir',
        JSON.stringify(directory)
      )
    );
    expect(output).toContain('FAIL');
    expect(output).toContain('untracked.txt');
  });

  test('passes outside a Git work tree', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tree-guard-no-git-'));
    directories.push(directory);
    expect(runGuard(directory, '')).toContain('PASS');
  });

  test('surfaces Git errors inside a work tree', () => {
    const { directory } = make();
    fs.writeFileSync(path.join(directory, '.git', 'config'), '[invalid\n');
    const output = runGuard(directory, '');
    expect(output).toContain('FAIL');
    expect(output).toMatch(/bad config|invalid config|config file/i);
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
