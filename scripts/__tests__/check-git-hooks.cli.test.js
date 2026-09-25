/**
 * Runs scripts/check-git-hooks.mjs (#3493) against throwaway Git repositories.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const script = path.join(__dirname, '..', 'check-git-hooks.mjs');

function repo(setup) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hooks-check-'));
  execFileSync('git', ['init', '-q', directory]);
  setup(directory);
  return directory;
}

function run(directory, ...args) {
  const env = { ...process.env };
  delete env.CI;
  return spawnSync(process.execPath, [script, ...args], {
    cwd: directory,
    encoding: 'utf8',
    env,
  });
}

const git = (directory, ...args) => execFileSync('git', ['-C', directory, ...args]);

function writeHook(directory, hook, mode = 0o755) {
  const file = path.join(directory, '.husky', '_', hook);
  fs.writeFileSync(file, '');
  if (process.platform !== 'win32') fs.chmodSync(file, mode);
}

describe('check-git-hooks CLI', () => {
  const directories = [];
  afterAll(() => directories.forEach((d) => fs.rmSync(d, { force: true, recursive: true })));

  test('warns when core.hooksPath points at a missing directory', () => {
    const directory = repo((d) => git(d, 'config', 'core.hooksPath', '.husky/_'));
    directories.push(directory);

    const result = run(directory);
    expect(result.status).toBe(0);
    expect(result.stderr).toContain('does not exist');
    expect(result.stderr).toContain('npm run prepare');

    expect(run(directory, '--strict').status).toBe(1);
  });

  test('warns when core.hooksPath uses another directory', () => {
    const directory = repo((d) => {
      fs.mkdirSync(path.join(d, 'custom-hooks'), { recursive: true });
      for (const hook of ['pre-commit', 'pre-push']) {
        fs.writeFileSync(path.join(d, 'custom-hooks', hook), '');
      }
      git(d, 'config', 'core.hooksPath', 'custom-hooks');
    });
    directories.push(directory);

    expect(run(directory, '--strict').stderr).toContain('not .husky/_');
  });

  test('warns when core.hooksPath is unset', () => {
    const directory = repo(() => {});
    directories.push(directory);

    expect(run(directory, '--strict').stderr).toContain('not set');
  });

  test('names a missing hook', () => {
    const directory = repo((d) => {
      fs.mkdirSync(path.join(d, '.husky', '_'), { recursive: true });
      fs.writeFileSync(path.join(d, '.husky', '_', 'pre-commit'), '');
      git(d, 'config', 'core.hooksPath', '.husky/_');
    });
    directories.push(directory);

    expect(run(directory, '--strict').stderr).toContain('pre-push is missing');
  });

  test('reports a non-executable hook as missing', () => {
    if (process.platform === 'win32') return;

    const directory = repo((d) => {
      fs.mkdirSync(path.join(d, '.husky', '_'), { recursive: true });
      writeHook(d, 'pre-commit');
      writeHook(d, 'pre-push', 0o644);
      git(d, 'config', 'core.hooksPath', '.husky/_');
    });
    directories.push(directory);

    expect(run(directory, '--strict').stderr).toContain('pre-push is missing or not executable');
  });

  test('passes silently when both hooks are installed', () => {
    const directory = repo((d) => {
      fs.mkdirSync(path.join(d, '.husky', '_'), { recursive: true });
      for (const hook of ['pre-commit', 'pre-push']) {
        writeHook(d, hook);
      }
      git(d, 'config', 'core.hooksPath', '.husky/_');
    });
    directories.push(directory);

    const result = run(directory, '--strict');
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });

  test('is skipped in CI', () => {
    const directory = repo(() => {});
    directories.push(directory);

    const result = spawnSync(process.execPath, [script, '--strict'], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, CI: 'true' },
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });

  test('does not treat CI=false as CI', () => {
    const directory = repo(() => {});
    directories.push(directory);

    const result = spawnSync(process.execPath, [script, '--strict'], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, CI: 'false' },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Git hooks are not installed');
  });
});
