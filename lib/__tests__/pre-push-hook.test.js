import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const HOOK_PATH = path.join(process.cwd(), '.husky/pre-push');
const temporaryDirectories = [];

function createRepository(branchName) {
  const repository = fs.mkdtempSync(path.join(os.tmpdir(), 'pre-push-hook-'));
  temporaryDirectories.push(repository);

  execFileSync('git', ['init', '--quiet'], { cwd: repository });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: repository });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: repository });
  execFileSync('git', ['commit', '--quiet', '--allow-empty', '--message', 'fixture'], {
    cwd: repository,
  });
  execFileSync('git', ['checkout', '--quiet', '-B', branchName], { cwd: repository });

  return repository;
}

function runHook(branchName, npmExitCode = 0) {
  const repository = createRepository(branchName);
  const binDirectory = path.join(repository, 'bin');
  const npmLog = path.join(repository, 'npm-arguments.log');
  const npmPath = path.join(binDirectory, 'npm');

  fs.mkdirSync(binDirectory);
  fs.writeFileSync(
    npmPath,
    '#!/usr/bin/env sh\nprintf \'%s\\n\' "$@" > "$MOCK_NPM_LOG"\nexit "$MOCK_NPM_EXIT"\n'
  );
  fs.chmodSync(npmPath, 0o755);

  const result = spawnSync('sh', [HOOK_PATH], {
    cwd: repository,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${binDirectory}:${process.env.PATH}`,
      MOCK_NPM_EXIT: String(npmExitCode),
      MOCK_NPM_LOG: npmLog,
    },
  });

  return {
    ...result,
    npmArguments: fs.existsSync(npmLog) ? fs.readFileSync(npmLog, 'utf8').trim().split('\n') : [],
    repository,
  };
}

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => {
    fs.rmSync(directory, { recursive: true, force: true });
  });
});

describe('pre-push branch-name hook', () => {
  test('passes the current branch to the repository validator', () => {
    const result = runHook('feat/scope-title');

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.npmArguments).toEqual([
      'run',
      'validate:branch-name',
      '--',
      '--branch',
      'feat/scope-title',
    ]);
    expect(result.stdout).toContain('Validating branch name: feat/scope-title');
    expect(result.stdout).toContain('Branch name is valid');
  });

  test('blocks the push and prints recovery guidance when validation fails', () => {
    const result = runHook('feature/scope-title', 1);

    expect(result.status).toBe(1);
    expect(result.npmArguments).toEqual([
      'run',
      'validate:branch-name',
      '--',
      '--branch',
      'feature/scope-title',
    ]);
    expect(result.stdout).toContain('Branch name validation failed');
    expect(result.stdout).toContain('npm run validate:branch-name -- --help');
    expect(result.stdout).toContain('git push --no-verify');
  });

  test.each(['main', 'develop'])('skips validation on protected branch %s', (branchName) => {
    const result = runHook(branchName, 1);

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
    expect(result.npmArguments).toEqual([]);
  });

  test('skips validation in detached HEAD state', () => {
    const result = runHook('feat/scope-title', 1);

    execFileSync('git', ['checkout', '--quiet', '--detach'], { cwd: result.repository });
    const detachedResult = spawnSync('sh', [HOOK_PATH], {
      cwd: result.repository,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: process.env.PATH,
      },
    });

    expect(detachedResult.status).toBe(0);
    expect(detachedResult.stdout).toBe('');
    expect(detachedResult.stderr).toBe('');
  });
});
