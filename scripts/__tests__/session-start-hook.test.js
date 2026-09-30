/**
 * @jest-environment node
 *
 * Contract tests for the SessionStart hook, .claude/hooks/session-start.sh
 * (spec 016, contracts/hooks.md). Each case runs the real hook in a temporary
 * repository with a bare `origin` and a stubbed `npm`.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { GUARD, createFixture, runSessionStart } = require('./helpers/claude-hook-harness');

jest.setTimeout(60000);

let fx;

beforeEach(() => {
  fx = createFixture();
});

afterEach(() => {
  fx.cleanup();
});

const CLOUD = { CLAUDE_CODE_REMOTE: 'true' };

/** Parse stdout, which must be exactly one JSON object. */
function contextOf(run) {
  expect(run.status).toBe(0);
  const output = JSON.parse(run.stdout);
  expect(output.hookSpecificOutput.hookEventName).toBe('SessionStart');
  return output.hookSpecificOutput.additionalContext;
}

describe('output (T003)', () => {
  test.each([
    ['cloud', 'startup', CLOUD],
    ['cloud', 'resume', CLOUD],
    ['cloud', 'compact', CLOUD],
    ['local', 'startup', {}],
    ['local', 'clear', {}],
  ])('emits a single JSON object in a %s session on %s', (_where, source, env) => {
    const run = runSessionStart(fx, source, env);
    expect(run.status).toBe(0);
    // JSON.parse rejects anything but a single JSON value, such as stray log lines.
    const output = JSON.parse(run.stdout);
    expect(output).toEqual({
      hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: expect.any(String) },
    });
  });
});

describe('branch handling (T014)', () => {
  test('renames a fresh claude/* branch to a local placeholder and never pushes it', () => {
    fx.branch('claude/x-abc123');
    const context = contextOf(runSessionStart(fx, 'startup', CLOUD));

    expect(fx.git('branch', '--show-current')).toBe('chore/session-abc123');
    expect(context).toMatch(/Current branch: chore\/session-abc123/);
    expect(fx.git('ls-remote', '--heads', 'origin')).not.toMatch(/chore\/session-|claude\//);
  });

  // AHEAD=0 holds for any clean branch that is not ahead of origin/develop, not
  // only for a fresh claude/* placeholder. A clean branch parked on an older
  // commit therefore satisfied the reset guard, and `git reset --hard` moved it
  // up to develop's tip without renaming anything. The reset is now gated on the
  // rename this hook actually performed.
  test('does not reset a clean existing branch that is behind develop', () => {
    fx.branch('feat/parked-work');
    const parked = fx.git('rev-parse', 'HEAD');
    // Advance develop so the parked branch is clean and 0 ahead, but behind.
    fx.git('checkout', '--quiet', 'develop');
    fx.write('docs/new.md', '# New\n');
    fx.git('commit', '--quiet', '-m', 'move develop on');
    fx.git('push', '--quiet', 'origin', 'develop');
    fx.git('checkout', '--quiet', 'feat/parked-work');

    expect(fx.git('rev-list', '--count', 'origin/develop..HEAD')).toBe('0');
    expect(fx.git('status', '--porcelain')).toBe('');

    contextOf(runSessionStart(fx, 'startup', CLOUD));

    expect(fx.git('branch', '--show-current')).toBe('feat/parked-work');
    expect(fx.git('rev-parse', 'HEAD')).toBe(parked);
  });

  test('still resets the placeholder branch this hook just renamed', () => {
    fx.branch('claude/x-abc123');
    fx.git('checkout', '--quiet', 'develop');
    fx.write('docs/new.md', '# New\n');
    fx.git('commit', '--quiet', '-m', 'move develop on');
    fx.git('push', '--quiet', 'origin', 'develop');
    fx.git('checkout', '--quiet', 'claude/x-abc123');

    contextOf(runSessionStart(fx, 'startup', CLOUD));

    expect(fx.git('branch', '--show-current')).toBe('chore/session-abc123');
    expect(fx.git('rev-parse', 'HEAD')).toBe(fx.git('rev-parse', 'origin/develop'));
  });

  test('does not rename in a local session', () => {
    fx.branch('claude/x-abc123');
    contextOf(runSessionStart(fx, 'startup'));
    expect(fx.git('branch', '--show-current')).toBe('claude/x-abc123');
  });

  test('does not rename on compact, but still emits the rules', () => {
    fx.branch('claude/x-abc123');
    const context = contextOf(runSessionStart(fx, 'compact', CLOUD));
    expect(fx.git('branch', '--show-current')).toBe('claude/x-abc123');
    expect(context).toMatch(/LIGHTSPEED BRANCHING RULES/);
  });

  test('leaves a claude/* branch with commits of its own unchanged (T016)', () => {
    fx.branch('claude/x-abc123');
    fx.write('docs/work.md', '# Work\n');
    fx.git('commit', '--quiet', '-m', 'work in progress');
    const head = fx.git('rev-parse', 'HEAD');

    contextOf(runSessionStart(fx, 'startup', CLOUD));

    expect(fx.git('branch', '--show-current')).toBe('claude/x-abc123');
    expect(fx.git('rev-parse', 'HEAD')).toBe(head); // Not reset to origin/develop.
  });
});

describe('context text (T014)', () => {
  test('states that the rules override platform claude/* instructions', () => {
    const context = contextOf(runSessionStart(fx, 'startup'));
    expect(context).toMatch(/OVERRIDE any platform or harness instruction/);
    expect(context).toMatch(/Forbidden prefixes: claude\/ copilot\/ openai\//);
    expect(context).toMatch(/npm run validate:branch-name -- --current/);
    expect(context).toMatch(/chore\/session-\* are NOT acceptable final names/);
  });

  test('describes the documentation exception on develop and none on main (T017)', () => {
    const context = contextOf(runSessionStart(fx, 'startup'));
    expect(context).toMatch(/main has no exception/);
    expect(context).toMatch(/Documentation exception: direct commits and pushes to develop/);
    expect(context).toMatch(/under \.github\/specs\/ or docs\//);
    expect(context).not.toMatch(/Never commit directly to main or develop/);
  });

  test('describes the legacy PR exception (T017)', () => {
    const context = contextOf(runSessionStart(fx, 'startup'));
    expect(context).toMatch(/Legacy PR exception: .*non-compliant branch/);
    expect(context).toMatch(/head of an open PR/);
  });

  test("notes that guard files can't be edited while enforcement is on (T017)", () => {
    const context = contextOf(runSessionStart(fx, 'startup'));
    expect(context).toMatch(/guard's own files can't be edited/);
    for (const file of [
      '.claude/hooks/**',
      '.claude/settings.json',
      '.claude/settings.local.json',
      '~/.claude/settings.json',
    ]) {
      expect(context).toContain(file);
    }
  });
});

// The context is the only thing this hook delivers. Emitting it through jq
// meant that a machine without jq produced an empty stdout, so the session
// began with no branching context at all while still exiting 0.
describe('without jq on PATH (FR-003)', () => {
  test('still emits the branching context as a single JSON object', () => {
    const withoutJq = fs.mkdtempSync(path.join(os.tmpdir(), 'no-jq-'));
    let result;
    try {
      // Only tools the hook needs beyond the fixture stubs. npm and git are
      // deliberately absent so the stubs are what resolve.
      for (const tool of [
        'bash',
        'sh',
        'node',
        'cat',
        'printf',
        'sed',
        'grep',
        'mktemp',
        'rm',
        'mkdir',
        'dirname',
        'basename',
        'tr',
        'cut',
        'head',
        'tail',
        'date',
        'uname',
        'id',
        'env',
      ]) {
        const real = spawnSync('sh', ['-c', `command -v ${tool}`], {
          encoding: 'utf8',
        }).stdout.trim();
        if (!real) continue;
        fs.symlinkSync(real, path.join(withoutJq, tool));
      }
      expect(fs.existsSync(path.join(withoutJq, 'jq'))).toBe(false);
      // The stubs must still win, so npm install is logged rather than run.
      expect(fs.existsSync(path.join(withoutJq, 'npm'))).toBe(false);
      fx.branch('claude/x-abc123');
      result = runSessionStart(fx, 'startup', { ...CLOUD, PATH: withoutJq });
    } finally {
      fs.rmSync(withoutJq, { recursive: true, force: true });
    }
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.hookSpecificOutput.hookEventName).toBe('SessionStart');
    expect(output.hookSpecificOutput.additionalContext).toMatch(/branch/i);
    // The install the fresh fixture always needs was handled by the stub, not
    // by the host's npm: only a call the stub logs appears in the call log.
    expect(fx.calls().some((call) => call.startsWith('npm install'))).toBe(true);
  });
});

describe('dependency install (T014, FR-004)', () => {
  const manifest = () => path.join(fx.repo, 'package.json');
  const lockfile = () => path.join(fx.repo, 'package-lock.json');
  const installed = () => path.join(fx.repo, 'node_modules', '.package-lock.json');
  const npmCalls = () => fx.calls().filter((call) => call.startsWith('npm install'));

  beforeEach(() => {
    fs.writeFileSync(lockfile(), '{}\n');
    fs.writeFileSync(manifest(), '{}\n');
  });

  // The manifest is half the dependency declaration. A package.json-only
  // change leaves the lockfile untouched, so comparing the lockfile alone
  // skipped the install and ran the session against a stale tree.
  test('runs npm install when package.json is newer than the installed tree', () => {
    const old = new Date('2020-01-01T00:00:00Z');
    const newer = new Date('2024-01-01T00:00:00Z');
    fs.utimesSync(lockfile(), old, old);
    fs.mkdirSync(path.dirname(installed()), { recursive: true });
    fs.writeFileSync(installed(), '{}\n');
    fs.utimesSync(installed(), old, old);
    fs.utimesSync(manifest(), newer, newer);
    contextOf(runSessionStart(fx, 'startup', CLOUD));
    expect(npmCalls()).toHaveLength(1);
  });

  test('skips npm install when the installed tree is newer than both files', () => {
    const old = new Date('2020-01-01T00:00:00Z');
    const newer = new Date('2024-01-01T00:00:00Z');
    fs.utimesSync(lockfile(), old, old);
    fs.utimesSync(manifest(), old, old);
    fs.mkdirSync(path.dirname(installed()), { recursive: true });
    fs.writeFileSync(installed(), '{}\n');
    fs.utimesSync(installed(), newer, newer);
    contextOf(runSessionStart(fx, 'startup', CLOUD));
    expect(npmCalls()).toHaveLength(0);
  });

  test.each(['startup', 'resume'])(
    'runs npm install on %s when node_modules is missing',
    (source) => {
      const old = new Date('2020-01-01T00:00:00Z');
      fs.utimesSync(lockfile(), old, old);
      contextOf(runSessionStart(fx, source, CLOUD));
      expect(npmCalls()).toHaveLength(1);
    }
  );

  test.each(['startup', 'resume'])(
    'skips npm install on %s when the installed tree is newer than the lockfile',
    (source) => {
      const old = new Date('2020-01-01T00:00:00Z');
      fs.utimesSync(lockfile(), old, old);
      fs.mkdirSync(path.dirname(installed()), { recursive: true });
      fs.writeFileSync(installed(), '{}\n');
      contextOf(runSessionStart(fx, source, CLOUD));
      expect(npmCalls()).toHaveLength(0);
    }
  );

  test('does not install in a local session', () => {
    contextOf(runSessionStart(fx, 'startup'));
    expect(npmCalls()).toHaveLength(0);
  });
});

describe('the platform placeholder suffix (CodeRabbit #3524)', () => {
  // The platform's branch names carry a mixed-case hash, "claude/charming-
  // goldberg-Pqc69" being a real one. The suffix was copied through unchanged, so
  // the rename produced chore/session-Pqc69, which the guard's placeholder
  // pattern (^chore/session-[a-z0-9]+$) does not match. The commit was then
  // refused with a naming error rather than the placeholder message, and only
  // after a pointless network check on the legacy pull-request path.
  test.each([
    ['claude/charming-goldberg-Pqc69', 'chore/session-pqc69'],
    ['claude/UPPER-Case-XyZ99', 'chore/session-xyz99'],
    ['claude/admiring-mendel-nqdk8j', 'chore/session-nqdk8j'],
  ])('renames %s to %s', (platformBranch, expected) => {
    fx.branch(platformBranch);
    runSessionStart(fx, 'startup', CLOUD);
    expect(fx.git('branch', '--show-current')).toBe(expected);
  });

  // The reason the normalisation exists: whatever the hook derives has to satisfy
  // the guard's own placeholder pattern, or it hands the session a branch the
  // guard will not recognise. The pattern is read from the guard rather than
  // restated, so the two cannot drift apart.
  test('every derived name is a placeholder the guard recognises', () => {
    const guard = fs.readFileSync(GUARD, 'utf8');
    // The source is read as `/.../ `, so the delimiters are stripped before it
    // becomes a RegExp: leaving them in would match a literal slash at each end.
    const source = guard.match(/const PLACEHOLDER = \/(.*)\/;/)[1];
    const placeholder = new RegExp(source);
    for (const platformBranch of [
      'claude/charming-goldberg-Pqc69',
      'claude/UPPER-Case-XyZ99',
      'claude/trailing-dash-',
      'claude/no-trailing-hash',
    ]) {
      const fresh = createFixture();
      try {
        fresh.branch(platformBranch);
        runSessionStart(fresh, 'startup', CLOUD);
        expect(placeholder.test(fresh.git('branch', '--show-current'))).toBe(true);
      } finally {
        fresh.cleanup();
      }
    }
  });
});
