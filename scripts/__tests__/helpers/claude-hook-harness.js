/**
 * Shared harness for the Claude Code hook contract tests (spec 016).
 *
 * The hooks are tested as black boxes: each test spawns the real hook with a
 * JSON payload on stdin inside a throwaway git repository, and inspects the
 * exit code, stdout and stderr. `gh`, `npm` and `git ls-remote` are stubbed on
 * PATH so network-dependent paths can be controlled and counted.
 */

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const GUARD = path.join(REPO_ROOT, '.claude', 'hooks', 'enforce-branch-name.mjs');
const SESSION_START = path.join(REPO_ROOT, '.claude', 'hooks', 'session-start.sh');
const REAL_GIT = execFileSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' }).trim();

/** Run git in a directory with a fixed identity, returning trimmed stdout. */
function git(cwd, ...args) {
  return execFileSync(REAL_GIT, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 'test@example.com',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 'test@example.com',
    },
  }).trim();
}

function writeExecutable(file, body) {
  fs.writeFileSync(file, body);
  fs.chmodSync(file, 0o755);
}

/**
 * Create a temporary repository with a bare `origin`, a `develop` and a `main`
 * branch, and a stub directory for PATH.
 *
 * Stubs:
 *   - gh: GH_STUB_MODE=open prints one open PR from this repository, fork prints
 *     one from a fork, empty prints [], fail exits 1, hang sleeps 30 s. Every
 *     call is logged to the stub log.
 *   - git: logs `ls-remote` calls, then runs the real git.
 *   - npm: logs every call and exits 0.
 */
function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ls-hook-'));
  const repo = path.join(root, 'repo');
  const origin = path.join(root, 'origin.git');
  const stubs = path.join(root, 'stubs');
  const log = path.join(root, 'stub.log');
  fs.mkdirSync(repo);
  fs.mkdirSync(stubs);
  fs.writeFileSync(log, '');

  git(root, 'init', '--quiet', '--bare', '--initial-branch=develop', origin);
  git(repo, 'init', '--quiet', '--initial-branch=develop');
  git(repo, 'config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(repo, 'README.md'), '# Fixture\n');
  fs.mkdirSync(path.join(repo, 'docs'));
  fs.writeFileSync(path.join(repo, 'docs', 'guide.md'), '# Guide\n');
  fs.writeFileSync(path.join(repo, 'package.json'), '{}\n');
  git(repo, 'add', '.');
  git(repo, 'commit', '--quiet', '-m', 'initial');
  git(repo, 'branch', 'main');
  git(repo, 'remote', 'add', 'origin', origin);
  git(repo, 'push', '--quiet', 'origin', 'develop', 'main');

  writeExecutable(
    path.join(stubs, 'gh'),
    `#!/bin/sh
echo "gh $*" >> "${log}"
case "\${GH_STUB_MODE:-empty}" in
  open) echo '[{"number":1,"isCrossRepository":false}]' ;;
  fork) echo '[{"number":1,"isCrossRepository":true}]' ;;
  empty) echo '[]' ;;
  fail) exit 1 ;;
  hang) exec sleep 30 ;;
esac
`
  );
  writeExecutable(
    path.join(stubs, 'git'),
    `#!/bin/sh
for arg in "$@"; do
  if [ "$arg" = "ls-remote" ]; then echo "git ls-remote" >> "${log}"; break; fi
done
exec "${REAL_GIT}" "$@"
`
  );
  writeExecutable(
    path.join(stubs, 'npm'),
    `#!/bin/sh
echo "npm $*" >> "${log}"
exit 0
`
  );

  return {
    root,
    repo,
    origin,
    stubs,
    git: (...args) => git(repo, ...args),
    /** Check out a new branch at the current HEAD. */
    branch(name) {
      git(repo, 'checkout', '--quiet', '-B', name);
    },
    /** Write a file (relative to the repo) and optionally stage it. */
    write(file, content = 'changed\n', { stage = true } = {}) {
      const full = path.join(repo, file);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
      if (stage) git(repo, 'add', file);
    },
    /** Lines written to the stub log since the fixture was created. */
    calls() {
      return fs.readFileSync(log, 'utf8').split('\n').filter(Boolean);
    },
    clearCalls() {
      fs.writeFileSync(log, '');
    },
    cleanup() {
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

/** Environment for a hook run: stubs first on PATH, enforcement on by default. */
function hookEnv(fixture, env = {}) {
  const base = { ...process.env };
  delete base.LS_ENFORCE_BRANCH_NAMES;
  delete base.LS_BASE_BRANCH;
  delete base.CLAUDE_CODE_REMOTE;
  return {
    ...base,
    PATH: `${fixture.stubs}${path.delimiter}${process.env.PATH}`,
    CLAUDE_PROJECT_DIR: fixture.repo,
    LS_ENFORCE_BRANCH_NAMES: '1',
    LS_BASE_BRANCH: 'develop',
    ...env,
  };
}

function result(run) {
  return {
    status: run.status,
    stdout: run.stdout || '',
    stderr: run.stderr || '',
    json() {
      return JSON.parse(run.stdout);
    },
  };
}

/**
 * Run the PreToolUse guard. `payload` is either a raw stdin string or an object
 * `{ tool_name, tool_input, cwd }`; `cwd` defaults to the fixture repository.
 */
function runGuard(fixture, payload, env = {}) {
  const input =
    typeof payload === 'string' ? payload : JSON.stringify({ cwd: fixture.repo, ...payload });
  return result(
    spawnSync('node', [GUARD], {
      input,
      cwd: fixture.repo,
      encoding: 'utf8',
      env: hookEnv(fixture, env),
      timeout: 30000,
    })
  );
}

/** Shorthand for a Bash tool call. */
function runBash(fixture, command, env = {}) {
  return runGuard(fixture, { tool_name: 'Bash', tool_input: { command } }, env);
}

/** Run the SessionStart hook with `{ source }` on stdin. */
function runSessionStart(fixture, source, env = {}) {
  return result(
    spawnSync('bash', [SESSION_START], {
      input: JSON.stringify({ source }),
      cwd: fixture.repo,
      encoding: 'utf8',
      env: hookEnv(fixture, env),
      timeout: 60000,
    })
  );
}

module.exports = {
  GUARD,
  SESSION_START,
  createFixture,
  runGuard,
  runBash,
  runSessionStart,
};
