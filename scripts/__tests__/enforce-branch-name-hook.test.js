/**
 * @jest-environment node
 *
 * Contract tests for the PreToolUse branch guard,
 * .claude/hooks/enforce-branch-name.mjs (spec 016, contracts/hooks.md).
 *
 * Each case spawns the real hook with a tool-call payload inside a temporary
 * repository. Exit 2 means refused, exit 0 means allowed.
 */

const path = require('path');
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
  test('starts with "Branch guard:" so the SC-007 transcript search finds it', () => {
    const run = runBash(fx, 'git checkout -b feature/thing');
    expect(run.status).toBe(2);
    expect(run.stderr.split('\n')[0]).toMatch(/^Branch guard: /);
  });

  test('leaves out a suggestion that would itself fail the validator (T046)', () => {
    const run = runBash(fx, 'git checkout -b feature/thing');
    expect(run.status).toBe(2);
    expect(run.stderr).not.toMatch(/did you mean/);
  });

  test('names the rule, suggests a valid name, and gives the fix in order', () => {
    const run = runBash(fx, 'git checkout -b feature/issue-triage');
    expect(run.status).toBe(2);
    const lines = run.stderr.split('\n');
    const at = (pattern) => lines.findIndex((line) => pattern.test(line));

    const rule = at(/^Branch creation blocked: 'feature\/issue-triage'.*invalid_type/);
    const suggestion = at(/did you mean 'feat\/issue-triage'/);
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

  test('allows a commit on develop when only docs/** and .github/specs/** are staged', () => {
    fx.write('docs/guide.md', '# Changed\n');
    fx.write('.github/specs/016-x/spec.md', '# Spec\n');
    expect(runBash(fx, 'git commit -m "docs"').status).toBe(0);
  });

  test('allows git add of docs then commit on develop in one command', () => {
    fx.write('docs/guide.md', '# Changed\n', { stage: false });
    expect(runBash(fx, 'git add docs/guide.md && git commit -m "docs"').status).toBe(0);
  });

  test('lists the files outside the allowed paths in the refusal', () => {
    fx.write('docs/guide.md', '# Changed\n');
    fx.write('package.json', '{"name":"x"}\n');
    const run = runBash(fx, 'git commit -m "mixed"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/Needs a feature branch: .*package\.json/);
    expect(run.stderr).not.toMatch(/Needs a feature branch: .*docs\/guide\.md/);
  });

  test('counts git add -A as every changed file', () => {
    fx.write('docs/guide.md', '# Changed\n', { stage: false });
    fx.write('app.js', 'x\n', { stage: false });
    const run = runBash(fx, 'git add -A && git commit -m "x"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/Needs a feature branch: .*app\.js/);
  });

  test('does not let a path escape docs/ through ..', () => {
    const run = runGuard(
      fx,
      mcp('push_files', {
        branch: 'develop',
        files: [{ path: 'docs/../package.json', content: 'x' }],
      })
    );
    expect(run.status).toBe(2);
  });

  test('allows a push to develop whose diff touches only allowed paths', () => {
    fx.write('docs/guide.md', '# Changed\n');
    fx.git('commit', '--quiet', '-m', 'docs');
    expect(runBash(fx, 'git push origin develop').status).toBe(0);
  });

  test('refuses a push to develop whose diff touches other files', () => {
    fx.write('package.json', '{"name":"x"}\n');
    fx.git('commit', '--quiet', '-m', 'code');
    expect(runBash(fx, 'git push origin HEAD:develop').status).toBe(2);
  });
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

  test('allows a push to an existing branch that is the head of an open PR', () => {
    const run = runBash(fx, 'git push origin copilot/fix-login', { GH_STUB_MODE: 'open' });
    expect(run.status).toBe(0);
  });

  test('allows a commit on an existing branch that is the head of an open PR', () => {
    expect(runBash(fx, 'git commit -m "x"', { GH_STUB_MODE: 'open' }).status).toBe(0);
  });

  test('refuses when the open PR comes from a fork', () => {
    const run = runBash(fx, 'git push origin copilot/fix-login', { GH_STUB_MODE: 'fork' });
    expect(run.status).toBe(2);
  });

  test('refuses a branch that exists only locally, even if gh reports a PR', () => {
    fx.branch('copilot/local-only');
    const run = runBash(fx, 'git commit -m "x"', { GH_STUB_MODE: 'open' });
    expect(run.status).toBe(2);
  });
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

  test('allows push_files to develop when every path is under docs/', () => {
    const run = runGuard(
      fx,
      mcp('push_files', { branch: 'develop', files: [{ path: 'docs/a.md', content: 'a' }] })
    );
    expect(run.status).toBe(0);
  });

  test('refuses Bash gh pr create from a claude/* head (T044)', () => {
    const run = runBash(
      fx,
      'gh pr create --repo lightspeedwp/.github --head claude/x-y --base develop'
    );
    expect(run.status).toBe(2);
  });

  test('refuses Bash gh pr create into main from a feature branch on .github (T044)', () => {
    const run = runBash(fx, 'gh pr create -R lightspeedwp/.github --base main --head feat/a-b');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/only release\/\* and hotfix\/\* target main/);
  });

  test('uses the current branch as the gh pr create head (T044)', () => {
    fx.branch('chore/session-abc123');
    expect(runBash(fx, 'gh pr create -R lightspeedwp/.github --fill').status).toBe(2);
  });

  test('refuses gh api content writes to main (T044)', () => {
    const run = runBash(
      fx,
      'gh api -X PUT repos/lightspeedwp/.github/contents/docs/a.md -f branch=main -f message=x -f content=eA=='
    );
    expect(run.status).toBe(2);
  });

  test('refuses gh api branch creation with a forbidden prefix (T044)', () => {
    const run = runBash(
      fx,
      'gh api repos/lightspeedwp/.github/git/refs -f ref=refs/heads/claude/x -f sha=abc'
    );
    expect(run.status).toBe(2);
  });

  test('allows gh api reads and other owners (T044)', () => {
    expect(runBash(fx, 'gh api repos/lightspeedwp/.github/pulls').status).toBe(0);
    expect(runBash(fx, 'gh pr create -R someone/else --head claude/x-y').status).toBe(0);
  });
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

  const edit = (tool, file, extra = {}) => ({
    tool_name: tool,
    tool_input: { file_path: file, ...extra },
  });

  test('refuses Edit of .claude/hooks/enforce-branch-name.mjs', () => {
    const run = runGuard(fx, edit('Edit', '.claude/hooks/enforce-branch-name.mjs'));
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/branch-guard file/);
  });

  test('refuses Write to .claude/settings.local.json, by absolute path too', () => {
    expect(runGuard(fx, edit('Write', '.claude/settings.local.json')).status).toBe(2);
    const absolute = path.join(fx.repo, '.claude', 'settings.local.json');
    expect(runGuard(fx, edit('Write', absolute)).status).toBe(2);
  });

  test.each([
    'sed -i "s/1/0/" .claude/settings.json',
    'rm .claude/hooks/x',
    'rm -rf .claude',
    'echo {} > .claude/settings.json',
    'echo {} >> ".claude/settings.local.json"',
    'cat x | tee .claude/settings.json',
    'cp /tmp/x .claude/hooks/enforce-branch-name.mjs',
    'mv .claude/settings.json /tmp/x',
    'git restore .claude/settings.json',
    'git checkout HEAD -- .claude/hooks/session-start.sh',
  ])('refuses the shell write %s', (command) => {
    expect(runBash(fx, command).status).toBe(2);
  });

  test('allows redirection text inside quotes (FR-012)', () => {
    expect(runBash(fx, 'echo "> .claude/settings.json"').status).toBe(0);
    expect(runBash(fx, "grep -n 'rm .claude/hooks' notes.md").status).toBe(0);
  });

  test('refuses an Edit that adds an env override or disableAllHooks to settings.local.json', () => {
    const run = runGuard(
      fx,
      edit('Edit', '.claude/settings.local.json', {
        old_string: '{',
        new_string: '{"env":{"LS_ENFORCE_BRANCH_NAMES":"0"},"disableAllHooks":true,',
      })
    );
    expect(run.status).toBe(2);
  });

  test('refuses Write to ~/.claude/settings.json resolved against $HOME', () => {
    const env = { HOME: fx.root };
    expect(
      runGuard(fx, edit('Write', path.join(fx.root, '.claude', 'settings.json')), env).status
    ).toBe(2);
    expect(runGuard(fx, edit('Write', '~/.claude/settings.json'), env).status).toBe(2);
  });

  test('refuses Write to the managed settings file', () => {
    expect(runGuard(fx, edit('Write', '/etc/claude-code/managed-settings.json')).status).toBe(2);
  });

  test('allows edits to other files', () => {
    expect(runGuard(fx, edit('Edit', 'docs/guide.md')).status).toBe(0);
    expect(runGuard(fx, edit('Write', '.claude/cloud/setup.sh')).status).toBe(0);
  });

  test('allows edits to guard files when the hook starts with the switch off', () => {
    const run = runGuard(fx, edit('Edit', '.claude/settings.json'), {
      LS_ENFORCE_BRANCH_NAMES: '0',
    });
    expect(run.status).toBe(0);
    expect(run.json().systemMessage).toMatch(/^Branch guard \(warning only\):/);
  });
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

  test("refuses git commit with 'Branch guard unavailable' when the validator fails to load", () => {
    fx.branch('feat/good-name');
    const run = runBash(fx, 'git commit -m "x"', FAULT);
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(
      /^Branch guard unavailable: .*Open an issue on lightspeedwp\/\.github/
    );
  });

  test('refuses MCP create_pull_request on a fault', () => {
    const run = runGuard(
      fx,
      mcp('create_pull_request', { head: 'feat/a-b', base: 'develop' }),
      FAULT
    );
    expect(run.status).toBe(2);
  });

  test.each(['git branch -D old-thing', 'git checkout -b feat/new-thing', 'gh pr create --fill'])(
    'refuses the branch operation %s on a fault (FR-012a)',
    (command) => {
      expect(runBash(fx, command, FAULT).status).toBe(2);
    }
  );

  test('allows switching to an existing branch on a fault, with a warning (FR-012a)', () => {
    const run = runBash(fx, 'git switch develop', FAULT);
    expect(run.status).toBe(0);
    expect(run.json().systemMessage).toMatch(/Branch guard unavailable/);
  });
});

describe('unusual git states (FR-005, FR-006)', () => {
  test('refuses a commit on a detached HEAD with nothing in progress', () => {
    fx.git('checkout', '--quiet', '--detach');
    const run = runBash(fx, 'git commit -m "x"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/HEAD is detached/);
  });

  test('judges a commit during a rebase by the branch being rebased', () => {
    fx.branch('claude/x-abc123');
    fx.write('docs/a.md', 'a\n');
    fx.git('commit', '--quiet', '-m', 'a');
    fx.git('checkout', '--quiet', 'develop');
    fx.write('docs/a.md', 'b\n');
    fx.git('commit', '--quiet', '-m', 'b');
    fx.git('checkout', '--quiet', 'claude/x-abc123');
    try {
      fx.git('rebase', 'develop');
    } catch {
      // The conflicting rebase stops with a detached HEAD, as intended.
    }
    const run = runBash(fx, 'git commit -m "resolve"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/claude\/x-abc123/);
  });

  test('allows a force-push to a compliant, unprotected branch', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'git push --force-with-lease origin feat/good-name').status).toBe(0);
  });

  test('judges a refspec push by its target branch', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'git push origin feat/good-name:claude/other').status).toBe(2);
    expect(runBash(fx, 'git push upstream HEAD:feat/other-name').status).toBe(0);
  });
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
