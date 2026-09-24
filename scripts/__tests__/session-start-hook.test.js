/**
 * @jest-environment node
 *
 * Contract tests for the SessionStart hook, .claude/hooks/session-start.sh
 * (spec 016, contracts/hooks.md). Each case runs the real hook in a temporary
 * repository with a bare `origin` and a stubbed `npm`.
 */

const fs = require('fs');
const path = require('path');
const { createFixture, runSessionStart } = require('./helpers/claude-hook-harness');

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

describe('dependency install (T014, FR-004)', () => {
  const lockfile = () => path.join(fx.repo, 'package-lock.json');
  const installed = () => path.join(fx.repo, 'node_modules', '.package-lock.json');
  const npmCalls = () => fx.calls().filter((call) => call.startsWith('npm install'));

  beforeEach(() => {
    fs.writeFileSync(lockfile(), '{}\n');
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
