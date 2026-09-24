/**
 * @jest-environment node
 *
 * Contract tests for the PreToolUse branch guard,
 * .claude/hooks/enforce-branch-name.mjs (spec 016, contracts/hooks.md).
 *
 * Each case spawns the real hook with a tool-call payload inside a temporary
 * repository. Exit 2 means refused, exit 0 means allowed. Cases marked
 * `test.todo` describe behaviour that tasks T020–T023 have not built yet.
 */

const { createFixture, runBash, runGuard } = require('./helpers/claude-hook-harness');

jest.setTimeout(30000);

let fx;

beforeEach(() => {
  fx = createFixture();
});

afterEach(() => {
  fx.cleanup();
});

const mcp = (name, input) => ({
  tool_name: `mcp__github__${name}`,
  tool_input: { owner: 'lightspeedwp', repo: '.github', ...input },
});

describe('naming and the session placeholder (T008)', () => {
  test('refuses a commit on the chore/session-* placeholder', () => {
    fx.branch('chore/session-abc123');
    const run = runBash(fx, 'git commit -m "x"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/session placeholder/);
  });

  test('refuses pushing a claude/* branch', () => {
    fx.branch('claude/foo');
    expect(runBash(fx, 'git push -u origin claude/foo').status).toBe(2);
  });

  test('allows deleting a remote claude/* branch', () => {
    expect(runBash(fx, 'git push origin --delete claude/foo').status).toBe(0);
  });

  test('allows rename then commit in one command', () => {
    fx.branch('chore/session-abc123');
    const run = runBash(fx, 'git branch -m feat/good-name && git commit -m "x"');
    expect(run.status).toBe(0);
  });

  test('ignores branch names inside quoted commit messages', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'git commit -m "move off claude/x-y and copilot/z"').status).toBe(0);
    expect(runBash(fx, "git commit -m 'git push origin claude/x'").status).toBe(0);
  });

  test('ignores branch names inside here-documents', () => {
    fx.branch('feat/good-name');
    const command = "git commit -F - <<'EOF'\ngit checkout -b claude/x\nEOF";
    expect(runBash(fx, command).status).toBe(0);
  });

  test('refuses creating a branch with an unauthorised type', () => {
    const run = runBash(fx, 'git checkout -b feature/thing');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/Branch creation blocked/);
  });

  test('refuses renaming to a forbidden prefix', () => {
    expect(runBash(fx, 'git branch -m claude/new-name').status).toBe(2);
    expect(runBash(fx, 'git switch -c openai/some-thing').status).toBe(2);
  });
});

describe('refusal message (FR-011)', () => {
  test('names the rule, suggests a name, and gives the fix in order', () => {
    const run = runBash(fx, 'git checkout -b feature/thing');
    expect(run.status).toBe(2);
    const lines = run.stderr.split('\n');
    const at = (pattern) => lines.findIndex((line) => pattern.test(line));

    const rule = at(/^Branch creation blocked: 'feature\/thing'.*invalid_type/);
    const suggestion = at(/did you mean 'feat\/thing'/);
    const rename = at(/git branch -m <type>\/<scope>-<title>/);
    const validate = at(/npm run validate:branch-name -- --current/);
    const override = at(/overrides any claude\/\* branch named by the platform/);
    const pointer = at(/docs\/BRANCHING_STRATEGY\.md/);

    for (const index of [rule, suggestion, rename, validate, override, pointer]) {
      expect(index).toBeGreaterThanOrEqual(0);
    }
    expect(suggestion).toBeGreaterThanOrEqual(rule);
    expect(rename).toBeGreaterThan(rule);
    expect(validate).toBeGreaterThan(rename);
    expect(override).toBeGreaterThan(validate);
    expect(pointer).toBeGreaterThan(override);
  });
});

describe('protected branches and the documentation exception (T009)', () => {
  test('refuses a commit on develop that stages a non-documentation file', () => {
    fx.write('package.json', '{"name":"x"}\n');
    expect(runBash(fx, 'git commit -m "x"').status).toBe(2);
  });

  test('refuses git add of a non-documentation file then commit on develop', () => {
    fx.write('package.json', '{"name":"x"}\n', { stage: false });
    expect(runBash(fx, 'git add package.json && git commit -m "x"').status).toBe(2);
  });

  test('refuses a commit on main, even when only docs are staged', () => {
    fx.branch('main');
    fx.write('docs/guide.md', '# Changed\n');
    expect(runBash(fx, 'git commit -m "docs"').status).toBe(2);
  });

  test('refuses a push to main, including HEAD:main', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'git push origin HEAD:main').status).toBe(2);
    fx.branch('main');
    expect(runBash(fx, 'git push origin main').status).toBe(2);
  });

  test('refuses MCP push_files to main with only docs paths', () => {
    const run = runGuard(
      fx,
      mcp('push_files', { branch: 'main', files: [{ path: 'docs/a.md', content: 'a' }] })
    );
    expect(run.status).toBe(2);
  });

  test('refuses a commit on develop with nothing staged (unknown path set)', () => {
    expect(runBash(fx, 'git commit -m "x"').status).toBe(2);
  });

  test.todo('allows a commit on develop when only docs/** and .github/specs/** are staged');
  test.todo('lists the files outside the allowed paths in the refusal');
  test.todo('allows a push to develop whose diff touches only allowed paths');
});

describe('legacy PR exception (T010)', () => {
  beforeEach(() => {
    fx.branch('copilot/fix-login');
    fx.git('push', '--quiet', 'origin', 'copilot/fix-login');
  });

  test.each(['empty', 'fail'])('refuses the push when gh reports %s', (mode) => {
    const run = runBash(fx, 'git push origin copilot/fix-login', { GH_STUB_MODE: mode });
    expect(run.status).toBe(2);
  });

  test('refuses the push when the open-PR check times out', () => {
    const run = runBash(fx, 'git push origin copilot/fix-login', { GH_STUB_MODE: 'hang' });
    expect(run.status).toBe(2);
  });

  test('refuses creating a new copilot/* branch, even with an open PR', () => {
    const run = runBash(fx, 'git checkout -b copilot/other-fix', { GH_STUB_MODE: 'open' });
    expect(run.status).toBe(2);
  });

  test.todo('allows a push to an existing branch that is the head of an open PR');
  test.todo('allows a commit on an existing branch that is the head of an open PR');
});

describe('GitHub MCP tools (T011)', () => {
  test('refuses a PR into main from a feature branch on .github', () => {
    const run = runGuard(fx, mcp('create_pull_request', { head: 'feat/a-b', base: 'main' }));
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/only release\/\* and hotfix\/\* target main/);
  });

  test('allows a PR into main from release/*', () => {
    const run = runGuard(fx, mcp('create_pull_request', { head: 'release/v1-2-0', base: 'main' }));
    expect(run.status).toBe(0);
  });

  test('refuses a PR whose head is claude/*', () => {
    const run = runGuard(fx, mcp('create_pull_request', { head: 'claude/x-y', base: 'develop' }));
    expect(run.status).toBe(2);
  });

  test('ignores repositories outside the lightspeedwp owner', () => {
    const run = runGuard(fx, {
      tool_name: 'mcp__github__create_pull_request',
      tool_input: { owner: 'someone-else', repo: 'x', head: 'claude/x-y', base: 'main' },
    });
    expect(run.status).toBe(0);
  });

  test('refuses create_branch with a placeholder name', () => {
    const run = runGuard(fx, mcp('create_branch', { branch: 'chore/session-abc123' }));
    expect(run.status).toBe(2);
  });

  test('allows file writes to a compliant branch', () => {
    const run = runGuard(
      fx,
      mcp('create_or_update_file', { branch: 'feat/good-name', path: 'src/a.js', content: 'a' })
    );
    expect(run.status).toBe(0);
  });

  test.todo('allows push_files to develop when every path is under docs/');
});

describe('enforcement switch and self-protection (T012)', () => {
  test('allows reading guard files', () => {
    expect(runBash(fx, 'cat .claude/settings.json').status).toBe(0);
  });

  test('downgrades refusals to warnings when the hook starts with the switch off', () => {
    fx.branch('chore/session-abc123');
    const off = { LS_ENFORCE_BRANCH_NAMES: '0' };
    const cases = [
      runBash(fx, 'git commit -m "x"', off),
      runBash(fx, 'git push -u origin claude/foo', off),
      runGuard(fx, mcp('create_pull_request', { head: 'claude/x-y', base: 'develop' }), off),
    ];
    for (const run of cases) {
      expect(run.status).toBe(0);
      expect(run.json().systemMessage).toMatch(/^Branch guard \(warning only\):/);
    }
  });

  test('ignores the switch when it is set inside the command (FR-013)', () => {
    fx.branch('chore/session-abc123');
    expect(runBash(fx, 'LS_ENFORCE_BRANCH_NAMES=0 git commit -m "x"').status).toBe(2);
    expect(runBash(fx, 'export LS_ENFORCE_BRANCH_NAMES=0 && git commit -m "x"').status).toBe(2);
  });

  test.todo('refuses Edit of .claude/hooks/enforce-branch-name.mjs');
  test.todo('refuses Write to .claude/settings.local.json');
  test.todo(
    'refuses sed -i, rm, redirection and git restore that target .claude/settings.json or .claude/hooks/'
  );
  test.todo('refuses an Edit that adds an env override or disableAllHooks to settings.local.json');
  test.todo('refuses Write to ~/.claude/settings.json resolved against $HOME');
  test.todo('allows edits to guard files when the hook starts with the switch off');
});

describe('guard faults (T013)', () => {
  test('allows malformed stdin silently', () => {
    const run = runGuard(fx, 'not json');
    expect(run.status).toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toBe('');
  });

  const FAULT = { NODE_ENV: 'test', LS_GUARD_FORCE_FAULT: '1' };

  test('warns and allows a non-git command on a fault', () => {
    const run = runBash(fx, 'ls', FAULT);
    expect(run.status).toBe(0);
    expect(run.json().systemMessage).toMatch(/^Branch guard unavailable: .*LS_GUARD_FORCE_FAULT/);
  });

  test('warns and allows git commit on a fault when the hook starts with the switch off', () => {
    fx.branch('chore/session-abc123');
    const run = runBash(fx, 'git commit -m "x"', { ...FAULT, LS_ENFORCE_BRANCH_NAMES: '0' });
    expect(run.status).toBe(0);
    expect(run.json().systemMessage).toMatch(
      /^Branch guard \(warning only\): Branch guard unavailable:/
    );
  });

  test('ignores the fault flag outside test mode', () => {
    fx.branch('chore/session-abc123');
    const run = runBash(fx, 'git commit -m "x"', { ...FAULT, NODE_ENV: 'production' });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/session placeholder/);
  });

  test.todo("refuses git commit with 'Branch guard unavailable' when the validator fails to load");
  test.todo('refuses MCP create_pull_request on a fault');
});

describe('speed on the normal path (T041, SC-008)', () => {
  const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  test('adds 150 ms or less per call and makes no network checks', () => {
    fx.branch('feat/good-name');
    runBash(fx, 'git status'); // Warm the filesystem cache before timing.
    fx.clearCalls();

    const timings = [];
    for (let i = 0; i < 20; i += 1) {
      const command = i % 2 ? 'git commit -m "x"' : 'git status';
      const start = process.hrtime.bigint();
      const run = runBash(fx, command);
      timings.push(Number(process.hrtime.bigint() - start) / 1e6);
      expect(run.status).toBe(0);
    }

    expect(median(timings)).toBeLessThanOrEqual(150);
    expect(fx.calls().filter((call) => /^(gh |git ls-remote)/.test(call))).toEqual([]);
  });
});
