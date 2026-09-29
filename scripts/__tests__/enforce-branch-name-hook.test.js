/**
 * @jest-environment node
 *
 * Contract tests for the PreToolUse branch guard,
 * .claude/hooks/enforce-branch-name.mjs (spec 016, contracts/hooks.md).
 *
 * Each case spawns the real hook with a tool-call payload inside a temporary
 * repository. Exit 2 means refused, exit 0 means allowed.
 */

const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');
const { GUARD, createFixture, runBash, runGuard } = require('./helpers/claude-hook-harness');

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

  // `git branch -m old new` renames old. When that is not the checked-out branch
  // the session stays put, and the following commit is judged on the branch it is
  // actually on.
  test('does not treat a rename of another branch as moving the session', () => {
    fx.branch('main');
    fx.git('branch', 'legacy-thing');
    const run = runBash(fx, 'git branch -m legacy-thing feat/good-name && git commit -m "x"');
    // main is still checked out, so the commit is still refused.
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/'main' is protected/);
  });

  // `git checkout <path>` restores a file; HEAD does not move.
  test('does not treat a file checkout as a branch switch', () => {
    fx.branch('main');
    fx.write('docs/guide.md', '# Changed\n', { stage: false });
    const run = runBash(fx, 'git checkout docs/guide.md && git commit -m "x"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/'main' is protected/);
  });

  test('still treats a real branch checkout as a switch', () => {
    fx.branch('main');
    fx.git('branch', 'feat/good-name');
    const run = runBash(fx, 'git checkout feat/good-name && git commit -m "x"');
    // The session moved off main, so the commit on the feature branch is allowed.
    expect(run.status).toBe(0);
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

  // `-u` stages every modified tracked file, so pairing an already-staged doc
  // file with a `-u` must not let a modified non-doc file through unseen.
  test.each(['-u', '--update'])(
    'refuses a commit on develop that stages a non-doc file via git add %s',
    (flag) => {
      fx.write('docs/a.md', 'docs\n');
      fx.git('add', 'docs/a.md');
      fx.write('package.json', '{"name":"x"}\n', { stage: false });
      expect(runBash(fx, `git add ${flag} && git commit -m "x"`).status).toBe(2);
    }
  );

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

  // Every refspec on the command line is checked, not just the first, and a
  // flag that fans out to many branches cannot be used to skip the check.
  test.each([
    'git push origin feat/good-name main',
    'git push --tags origin main',
    'git push origin main --tags',
  ])('refuses a push that carries main as a later refspec: %s', (command) => {
    fx.branch('feat/good-name');
    expect(runBash(fx, command).status).toBe(2);
  });

  // Run from a compliant branch, so the only thing that can block these is the
  // fan-out flag itself. Without that, the current branch would be the reason.
  test.each(['git push --all origin', 'git push --branches origin', 'git push --mirror'])(
    'refuses a fan-out push from a compliant branch: %s',
    (command) => {
      fx.branch('feat/good-name');
      expect(runBash(fx, command).status).toBe(2);
    }
  );

  // An empty refspec matches every ref, so it is refused outright. A tag
  // destination is not a branch, so it is skipped rather than refused. Asserting
  // either code for both would detect no regression in either direction.
  test.each([
    ['git push origin :', 2],
    ['git push origin +:', 2],
    ['git push origin HEAD:refs/tags/v1', 0],
  ])('handles an uncheckable refspec exactly: %s', (command, expected) => {
    fx.branch('feat/good-name');
    expect(runBash(fx, command).status).toBe(expected);
  });

  test('still allows a tags-only push that names no branch', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'git push --tags origin').status).toBe(0);
  });

  // A write with no branch field lands on the repository's default branch,
  // which is often main. main is protected with no exception while the base
  // branch has a docs exception, so the call must be refused outright rather
  // than checked against a guessed branch. Both entry points are covered: the
  // GitHub MCP tools and a `gh api` contents call.
  test.each(['push_files', 'create_or_update_file', 'delete_file'])(
    'refuses a contents %s with no branch field',
    (tool) => {
      const input = { path: 'docs/a.md', content: 'a' };
      const run = runGuard(fx, mcp(tool, input));
      expect(run.status).toBe(2);
    }
  );

  // `-u` must not be read as "all files": it stages modified tracked files only,
  // and only under a pathspec. An untracked file it would never stage must not
  // block, and a pathspec must limit the check to that subtree.
  // `git commit <path>` records only that path and ignores the rest of the index,
  // so reading the index alone would let a non-documentation change reach the base
  // branch while only documentation is staged.
  // `--signoff` takes no value. Treating it as if it did consumed the next word,
  // so a named path was swallowed and the guard fell back to the index, which held
  // only documentation, and let the file through onto the base branch.
  // An attached value takes the rest of the word, so `-mfix` is the message "fix"
  // and the next argument is still a path.
  test.each(['git commit -mfix package.json', 'git commit -amfix package.json'])(
    'refuses %s when only documentation is staged',
    (command) => {
      fx.write('docs/guide.md', '# Changed\n');
      const run = runBash(fx, command);
      expect(run.status).toBe(2);
      expect(run.stderr).toMatch(/package\.json/);
    }
  );

  test('refuses git commit --signoff package.json when only documentation is staged', () => {
    fx.write('docs/guide.md', '# Changed\n');
    const run = runBash(fx, 'git commit --signoff package.json');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/package\.json/);
  });

  test.each(['git commit -m "x" package.json', 'git commit -m "x" -- package.json'])(
    'refuses %s when only documentation is staged',
    (command) => {
      fx.write('docs/guide.md', '# Changed\n');
      const run = runBash(fx, command);
      expect(run.status).toBe(2);
      expect(run.stderr).toMatch(/package\.json/);
    }
  );

  test('still allows a commit naming only documentation paths', () => {
    fx.write('docs/guide.md', '# Changed\n');
    expect(runBash(fx, 'git commit -m "docs" docs/guide.md').status).toBe(0);
  });

  test.each([
    'git commit -m "update package.json handling"',
    'git commit -am "docs"',
    'git commit -a -m "docs"',
  ])('does not read the message of %s as a path', (command) => {
    fx.write('docs/guide.md', '# Changed\n');
    // A message is a value of the m flag, not a path. Reading it as one makes the
    // commit look like it named a path, which is then judged in place of the
    // index: `git commit -am "docs"` looked like a commit of a file called "docs".
    expect(runBash(fx, command).status).toBe(0);
  });

  test('does not treat an untracked file as staged by git add -u', () => {
    fx.write('docs/a.md', 'docs\n');
    fx.git('add', 'docs/a.md');
    fx.write('untracked.txt', 'new\n', { stage: false });
    expect(runBash(fx, 'git add -u && git commit -m "x"').status).toBe(0);
  });

  test('honours a pathspec given to git add -u', () => {
    fx.write('docs/a.md', 'docs\n');
    fx.write('src/a.js', 'code\n', { stage: false });
    expect(runBash(fx, 'git add -u docs && git commit -m "x"').status).toBe(0);
  });

  test('refuses a gh api contents write with no branch field', () => {
    const run = runBash(
      fx,
      'gh api -X PUT repos/lightspeedwp/.github/contents/docs/a.md -f message=x -f content=a'
    );
    expect(run.status).toBe(2);
  });

  test('still allows a contents write that names a feature branch', () => {
    const run = runGuard(
      fx,
      mcp('create_or_update_file', { branch: 'feat/good-name', path: 'docs/a.md', content: 'a' })
    );
    expect(run.status).toBe(0);
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

  // A `--input` JSON body carries the branch instead of -f, so a write must
  // still be refused when that body names main, and allowed on a feature branch.
  test('refuses a gh api contents write whose --input body names main', () => {
    fx.write('body.json', JSON.stringify({ branch: 'main', message: 'x', content: 'a' }));
    const run = runBash(
      fx,
      'gh api -X PUT repos/lightspeedwp/.github/contents/docs/a.md --input body.json'
    );
    expect(run.status).toBe(2);
  });

  test('allows a gh api contents write whose --input body names a feature branch', () => {
    fx.write('body.json', JSON.stringify({ branch: 'feat/good-name', message: 'x', content: 'a' }));
    const run = runBash(
      fx,
      'gh api -X PUT repos/lightspeedwp/.github/contents/docs/a.md --input body.json'
    );
    expect(run.status).toBe(0);
  });

  // A branch name the guard cannot read must not be treated as no branch name.
  // An empty head or ref reached nameProblem as '', which is not a problem, so
  // the write went ahead unchecked.
  test('refuses a gh api pull-request POST with no head', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/pulls -f base=develop -f title=x'
    );
    expect(run.status).toBe(2);
  });

  test('refuses a gh api pull-request POST with no base', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/pulls -f head=feat/a-b -f title=x'
    );
    expect(run.status).toBe(2);
  });

  test('refuses a gh api branch creation with no ref', () => {
    const run = runBash(fx, 'gh api -X POST repos/lightspeedwp/.github/git/refs -f sha=abc');
    expect(run.status).toBe(2);
  });

  test('refuses a gh api branch creation whose ref cannot be read from its file', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs -F ref=@missing-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    // The file cannot be read, so the message must say so rather than judge the
    // literal "@missing-ref.txt" as if it were the branch name.
    expect(run.stderr).toMatch(/could not read/);
  });

  // -F ref=@file sends the file's contents, so the guard must read it to learn
  // the branch name. Judging the literal "@bad-ref.txt" also refuses, but for
  // the wrong reason, so the message is asserted to name the real branch.
  test('judges the branch name inside a -F ref=@file field', () => {
    fx.write('bad-ref.txt', 'refs/heads/claude/x-from-file\n');
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs -F ref=@bad-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/x-from-file/);
    expect(run.stderr).not.toMatch(/@bad-ref\.txt/);
  });

  test('allows a gh api branch creation whose -F ref=@file holds a valid name', () => {
    fx.write('good-ref.txt', 'refs/heads/feat/good-name\n');
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs -F ref=@good-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(0);
  });

  test('refuses a gh api write whose request body is on stdin', () => {
    const run = runBash(fx, 'gh api -X POST repos/lightspeedwp/.github/pulls --input - -f title=x');
    expect(run.status).toBe(2);
  });

  test('refuses a gh api write whose request body file is missing', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/pulls --input missing-body.json'
    );
    expect(run.status).toBe(2);
  });

  // An unrelated unreadable field says nothing about the branch, so it must not
  // block a write whose head and base are both readable.
  // gh reads an @path only for the typed flag (-F/--field). The string flag
  // (-f/--raw-field) sends the value as written, so an @path there is a branch
  // name in its own right and is judged as one. Verified against the installed
  // `gh api --help`: --field is typed, --raw-field is a string.
  test('judges -f ref=@path as the literal value gh would send', () => {
    fx.write('literal-ref.txt', 'refs/heads/feat/good-name\n');
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs -f ref=@literal-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).not.toMatch(/good-name/);
  });

  test('judges --raw-field ref=@path as the literal value gh would send', () => {
    fx.write('raw-ref.txt', 'refs/heads/feat/good-name\n');
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs --raw-field ref=@raw-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).not.toMatch(/good-name/);
  });

  test('reads --field ref=@path the way gh does', () => {
    fx.write('typed-ref.txt', 'refs/heads/claude/x-typed\n');
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs --field ref=@typed-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/x-typed/);
  });

  // gh also accepts the attached `--flag=value` form. If the parser only read
  // the separated form, the branch would be missing and the write unguarded.
  test('reads the branch from an attached --field=ref=@path', () => {
    fx.write('attached-ref.txt', 'refs/heads/claude/x-attached\n');
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs --field=ref=@attached-ref.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/x-attached/);
  });

  test('refuses a branch creation whose attached --field=ref is missing', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs --field=ref=@no-such-file.txt -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/could not read/);
  });

  test('refuses a pull-request POST whose attached --field=head is absent', () => {
    const run = runBash(fx, 'gh api -X POST repos/lightspeedwp/.github/pulls --field=title=x');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/name head explicitly/);
  });

  test('reads a request body given as an attached --input=file', () => {
    fx.write('attached-body.json', JSON.stringify({ branch: 'main', message: 'x', content: 'a' }));
    const run = runBash(
      fx,
      'gh api -X PUT repos/lightspeedwp/.github/contents/docs/a.md --input=attached-body.json'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/main/);
  });

  // A leading `cd` must be followed when resolving a relative path, or the
  // self-protection the guard applies to its own files is bypassed by simply
  // changing directory first.
  test.each([
    'cd .claude/hooks && rm enforce-branch-name.mjs',
    'cd .claude/hooks && tee session-start.sh',
    "cd .claude && cat <<'EOF' > settings.json\n{}\nEOF",
  ])('refuses a guard-file write that cds first: %s', (command) => {
    const run = runBash(fx, command);
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/branch-guard file|Edit blocked/);
  });

  // `cd` with no argument goes home and `cd -` to the previous directory, so the
  // tracker must resolve both rather than leave a stale directory in place.
  test('follows a bare cd to the home directory', () => {
    // HOME points into the fixture, so the resolution is hermetic rather than
    // depending on the host account's home directory.
    const run = runBash(fx, 'cd && rm .claude/settings.json', { HOME: fx.root });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/branch-guard file/);
  });

  // A `cd -` with no earlier cd in the same command has no previous directory to
  // return to, and the hook process's own OLDPWD says nothing about the shell the
  // command runs in, so the destination is undetermined and the guard fails closed.
  test('fails closed on a leading cd - rather than trusting the hook OLDPWD', () => {
    const run = runBash(fx, 'cd - && rm .claude/settings.json', { OLDPWD: fx.repo });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/can't resolve/);
  });

  test('refuses a guard-file write after an untrackable cd -', () => {
    const run = runBash(fx, 'cd - && rm .claude/settings.json', { OLDPWD: '' });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/can't resolve|cannot be ruled out/);
  });

  // A `cd` that cannot succeed leaves the shell where it was, so the tracked
  // directory must not move. Moving it anyway resolved a relative guard-file
  // write against a directory that does not exist and missed the write.
  test.each([
    'cd /nonexistent-dir-xyz && rm .claude/settings.json',
    'cd .claude/hooks && cd /nonexistent-abc && rm session-start.sh',
  ])('keeps the directory when the cd fails: %s', (command) => {
    expect(runBash(fx, command).status).toBe(2);
  });

  // An absolute target resolves whatever the working directory is, so it stays
  // checked even when a `cd` destination cannot be determined.
  test('still checks an absolute guard-file target when a cd is undetermined', () => {
    const absolute = path.join(fx.repo, '.claude', 'settings.json');
    const run = runBash(fx, `cd - && rm ${absolute}`, { OLDPWD: '' });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/branch-guard file/);
  });

  // `cd -` returns to the directory this command last left, not the hook
  // process's own OLDPWD, so after a successful cd it resolves to that.
  test('resolves cd - to the directory the same command last left', () => {
    const run = runBash(fx, 'cd .claude/hooks && cd - && rm .claude/settings.json', {
      OLDPWD: fx.root,
    });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/branch-guard file/);
  });

  // Everything after `--` is an operand, so `cd -- -` names a directory called
  // `-` rather than the previous directory.
  test('treats a dash argument after -- as a directory name', () => {
    const dash = path.join(fx.root, '-');
    fs.mkdirSync(dash, { recursive: true });
    const run = runBash(fx, `cd -- - && rm settings.json`, { HOME: dash });
    expect(run.status).toBe(0);
  });

  // A `cd` the shell rejects, or one that runs in a subshell, leaves the parent
  // shell where it was. The direction that matters is under-blocking: a subshell
  // `cd` that moves away from a protected file, after which a relative target is
  // resolved against a directory the command never runs in.
  test.each([
    ['cd a b && rm .claude/settings.json', 'cd the shell rejects'],
    ['cd /nonexistent-dir && rm .claude/settings.json', 'cd that cannot succeed'],
    ['cd /nonexistent-dir & rm .claude/settings.json', 'a failing cd in the background'],
  ])('keeps the directory for %s', (command) => {
    expect(runBash(fx, command).status).toBe(2);
  });

  // The reverse shape is the one that catches the subshell flag being dropped: the
  // `cd` moves to a harmless directory, and the write that follows really runs in
  // the project where that file is protected.
  test('refuses a write that follows a subshell cd away from a protected file', () => {
    const run = runBash(fx, 'cd / & rm .claude/settings.json');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/branch-guard file/);
  });

  // A list is not a subshell, so the cd is followed and the target resolves where
  // the shell really is.
  test('allows a write after a cd in a list, resolved where the shell really is', () => {
    expect(runBash(fx, 'cd / && rm .claude/settings.json').status).toBe(0);
  });

  test('refuses a write in a pipeline stage after a subshell cd', () => {
    expect(runBash(fx, 'cd / | tee .claude/settings.json').status).toBe(2);
  });

  // A subshell `cd` must not be treated as a move in the other direction either:
  // the write really does run in the project, where a bare name is not protected.
  test('allows a background write that really runs outside the hooks directory', () => {
    expect(runBash(fx, 'cd .claude/hooks & rm settings.json').status).toBe(0);
  });

  // && and || are lists, not pipelines: both sides run in the current shell, so a
  // cd there must be followed.
  test.each(['cd .claude/hooks && rm settings.json', 'cd .claude/hooks || rm settings.json'])(
    'follows a cd in a %s list',
    (command) => {
      expect(runBash(fx, command).status).toBe(2);
    }
  );

  // An undetermined current branch, on a detached HEAD or in a repository the
  // guard cannot read, must not be treated as a valid branch to write on.
  test.each(['git commit -m x', 'git push origin HEAD'])(
    'refuses %s on a detached HEAD where the branch cannot be determined',
    (command) => {
      fx.git('checkout', '--detach', 'HEAD');
      const run = runBash(fx, command);
      expect(run.status).toBe(2);
    }
  );

  // Guards the whole bug class: every property the consumers read has to survive
  // the transformations parseShell applies. A flag set on a raw segment and
  // dropped by the final map left `subshell` undefined, so a pipeline or
  // background `cd` moved the tracked directory. This asserts the property set
  // itself, so a future field cannot be lost the same way unnoticed.
  test('every segment keeps the properties the guard reads', () => {
    const source = fs.readFileSync(GUARD, 'utf8');
    // The properties the consumers destructure or read off a segment.
    const required = ['words', 'writes', 'subshell'];
    for (const name of required) {
      expect(source).toMatch(new RegExp(`return \\{[^}]*\\b${name}\\b`));
    }
    // And the flag is read, not merely set.
    expect(source).toMatch(/tracker\.cd\(args, segment\.subshell\)/);
  });

  // A single `&` backgrounds the whole list it terminates, so a `cd` earlier in
  // that list runs in the subshell too and must not move the tracked directory.
  test.each(['cd / && rm .claude/settings.json &', 'cd / || rm .claude/settings.json &'])(
    'keeps the directory for a cd in a backgrounded list: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(2);
    }
  );

  // A `;` or newline starts a new list, which a trailing `&` does not cross: the
  // cd before it ran in the parent shell, so the backgrounded command really does
  // resolve from the new directory.
  test.each([
    ['cd / ; rm .claude/settings.json &', 0],
    ['cd .claude/hooks ; rm settings.json &', 2],
    ['cd .claude/hooks ; ls &', 0],
  ])('tracks a parent cd across a list boundary: %s', (command, expected) => {
    expect(runBash(fx, command).status).toBe(expected);
  });

  // A compound command puts a shell keyword where the command word is expected,
  // so the real command has to be found past it or the whole segment goes
  // unchecked.
  test.each([
    'if true; then rm .claude/settings.json; fi',
    'if true; then git push origin main; fi',
    'while true; do rm .claude/hooks/session-start.sh; done',
    'for f in a; do rm .claude/settings.json; done',
    'true && { rm .claude/hooks/enforce-branch-name.mjs; }',
    '{ cat x > .claude/settings.json; }',
    '(rm .claude/settings.json)',
    '(rm -rf .claude/hooks)',
  ])('refuses a guard write hidden behind shell syntax: %s', (command) => {
    expect(runBash(fx, command).status).toBe(2);
  });

  test.each(['( echo hi )', '{ echo hi; }', 'if true; then echo hi; fi', "echo 'notes)'"])(
    'allows shell syntax with no guard write: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(0);
    }
  );

  // Every stage of a pipeline runs in a subshell, so a `cd` after the pipe moves
  // nothing. Marking only the stage before it left this exploitable.
  test.each(['cat x | cd / ; rm .claude/settings.json', 'true | cd / && rm .claude/settings.json'])(
    'refuses a write that follows a cd in the stage after a pipe: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(2);
    }
  );

  test.each(['cat x | wc -l', 'cat x | cd /', 'cd / | cat'])(
    'allows a harmless pipeline: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(0);
    }
  );

  // A `)` outside parentheses closes a case-arm pattern, and a parenthesised
  // group is a subshell. Both were ways to hide the real command.
  test.each([
    'case x in p) rm .claude/settings.json;; esac',
    '(cd /; echo done) ; rm .claude/settings.json',
    '(cd / ; echo done); rm .claude/settings.json',
    '(cd /) ; rm .claude/settings.json',
  ])('refuses a guard write hidden in a case arm or group: %s', (command) => {
    expect(runBash(fx, command).status).toBe(2);
  });

  // A case arm body runs in the current shell, not a subshell, so a cd there
  // really does move the directory and a following relative target resolves
  // against the new one.
  test('allows a cd in a case arm, which is not a subshell', () => {
    expect(runBash(fx, 'case x in a) cd /; rm .claude/settings.json;; esac').status).toBe(0);
  });

  test.each(['case x in p) echo hi;; esac', '(echo hi)', 'echo "a)b"'])(
    'allows case arms, groups and quoted brackets with no guard write: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(0);
    }
  );

  // touch changes a file, so it belongs with the other write verbs.
  test.each(['touch .claude/settings.json', 'touch .claude/hooks/enforce-branch-name.mjs'])(
    'refuses touch on a guard file: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(2);
    }
  );

  test('allows touch on a file that is not a guard file', () => {
    expect(runBash(fx, 'touch README.md').status).toBe(0);
  });

  // Deleting a protected branch is a write on that branch, so it is judged like
  // any other change to it. -D and -d were classified as query flags, which
  // skipped the check entirely.
  test.each(['-D', '-d'])('refuses git branch %s main', (flag) => {
    expect(runBash(fx, `git branch ${flag} main`).status).toBe(2);
  });

  // Deleting a remote-tracking ref is a normal operation, and the local name
  // rule must not reject it.
  test.each(['git branch -dr origin/feat/scope-title', 'git branch -r -d origin/main'])(
    'allows deleting a remote-tracking ref: %s',
    (command) => {
      expect(runBash(fx, command).status).toBe(0);
    }
  );

  // A branch that predates the naming convention can only be removed by deleting
  // it, so a deletion is judged on protection rather than on the name.
  test.each(['legacy-thing', 'old-name'])(
    'allows deleting a branch with a legacy name: %s',
    (name) => {
      expect(runBash(fx, `git branch -D ${name}`).status).toBe(0);
    }
  );

  test('still refuses creating a branch with a legacy name', () => {
    expect(runBash(fx, 'git branch legacy-thing').status).toBe(2);
  });

  test('checks every branch named in a multiple deletion', () => {
    expect(runBash(fx, 'git branch -D develop some-other').status).toBe(2);
  });

  test('still allows git branch -d on a branch that is not protected', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'git branch -d feat/old-branch').status).toBe(0);
  });

  // Creating a protected branch is a write on it, whichever form creates it.
  test.each([
    'git checkout -b main',
    'git switch -c main',
    'git branch -c main copied',
    'git branch -C main copied',
  ])('refuses %s on a protected branch', (command) => {
    expect(runBash(fx, command).status).toBe(2);
  });

  test('allows a cd that does not write to a guard file', () => {
    expect(runBash(fx, 'cd .claude/hooks && ls').status).toBe(0);
  });

  test('refuses a guard-file write on a fault that cds first', () => {
    const run = runBash(fx, 'cd .claude/hooks && rm enforce-branch-name.mjs', {
      NODE_ENV: 'test',
      LS_GUARD_FORCE_FAULT: '1',
    });
    expect(run.status).toBe(2);
  });

  // @- means standard input, which the guard has already consumed.
  test('refuses a gh api branch creation whose ref is read from stdin', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/git/refs -F ref=@- -f sha=abc'
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/could not read/);
  });

  test('allows a gh api pull-request POST whose unreadable field is not a branch field', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/pulls -f head=feat/a-b -f base=develop -F title=@missing-title.txt'
    );
    expect(run.status).toBe(0);
  });

  test('still allows a gh api pull-request POST that names head and base', () => {
    const run = runBash(
      fx,
      'gh api -X POST repos/lightspeedwp/.github/pulls -f head=feat/a-b -f base=develop -f title=x'
    );
    expect(run.status).toBe(0);
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
    // A heredoc must not smuggle a redirect past the guard: the body is
    // dropped, but the rest of the opening line is still parsed.
    "cat <<'EOF' > .claude/settings.json\n{}\nEOF",
    'cat <<EOF > .claude/settings.json\n{}\nEOF',
    "cat <<-'EOF' >> .claude/hooks/enforce-branch-name.mjs\nbody\n\tEOF",
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

  // The validator being unavailable must not become the way around
  // self-protection: a guard file is still a guard file when the hook is the
  // thing that failed, for both the edit tools and a shell write.
  test('refuses an Edit to a guard file on a fault', () => {
    const run = runGuard(
      fx,
      { tool_name: 'Edit', tool_input: { file_path: '.claude/hooks/enforce-branch-name.mjs' } },
      FAULT
    );
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/^Branch guard unavailable:/);
  });

  test('refuses a Write to a guard file on a fault', () => {
    const run = runGuard(
      fx,
      { tool_name: 'Write', tool_input: { file_path: '.claude/settings.json' } },
      FAULT
    );
    expect(run.status).toBe(2);
  });

  test('refuses a shell write to a guard file on a fault', () => {
    const run = runBash(fx, 'rm .claude/hooks/enforce-branch-name.mjs', FAULT);
    expect(run.status).toBe(2);
  });

  test('refuses a heredoc redirect to a guard file on a fault', () => {
    const run = runBash(fx, "cat <<'EOF' > .claude/settings.json\n{}\nEOF", FAULT);
    expect(run.status).toBe(2);
  });

  test('still allows an edit to a normal file on a fault', () => {
    const run = runGuard(fx, { tool_name: 'Edit', tool_input: { file_path: 'README.md' } }, FAULT);
    expect(run.status).toBe(0);
    expect(run.json().systemMessage).toMatch(/^Branch guard unavailable:/);
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

describe('the guard launcher (API ref deletion, CodeRabbit #3524)', () => {
  // `gh api -X DELETE repos/.../git/refs/heads/main` is the REST form of the
  // remote deletion the push path refuses. Skipping DELETE left the documented
  // protection dependent on which command was used.
  test.each(['main', 'develop'])('refuses deleting the %s ref through the API', (branch) => {
    fx.branch('feat/good-name');
    const run = runGuard(fx, {
      tool_name: 'Bash',
      tool_input: {
        command: `gh api -X DELETE repos/lightspeedwp/.github/git/refs/heads/${branch}`,
      },
    });
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/protected/);
  });

  test('still allows deleting an unprotected ref through the API', () => {
    fx.branch('feat/good-name');
    const run = runGuard(fx, {
      tool_name: 'Bash',
      tool_input: {
        command: 'gh api -X DELETE repos/lightspeedwp/.github/git/refs/heads/feat/good-name',
      },
    });
    expect(run.status).toBe(0);
  });
});

describe('cd resolution, the REST PR check and the fault path (CodeRabbit #3524)', () => {
  // A cd in the same list moves the directory the following git commands run in.
  // Judging them against the hook's own directory let a commit into a checkout
  // on main through, which is the one thing the guard exists to stop.
  test('judges a git command after a cd against the directory it runs in', () => {
    const other = createFixture();
    try {
      // The other checkout is on main and this one is on a compliant branch, so
      // the two answers differ. Asserting only the exit code is not enough: the
      // guard refuses for several unrelated reasons, and before the fix this case
      // was refused because the *first* repository was read as detached rather
      // than because main was seen. The message names the branch that was judged.
      other.branch('main');
      const run = runBash(fx, `cd ${JSON.stringify(other.repo)} && git commit -m "x"`, {
        CLAUDE_PROJECT_DIR: path.dirname(other.repo),
      });
      expect(run.status).toBe(2);
      expect(run.stderr).toMatch(/'main' is protected/);
    } finally {
      other.cleanup();
    }
  });

  // `git -C` applies to the one invocation it prefixes. When the directory and
  // branch were loop-level, the commit in the second segment was judged against
  // the first one's checkout.
  // `git -C` also applies to the push it prefixes: the target has to be judged
  // against the checkout the push comes from, not the one the hook started in.
  // The push names a protected branch, and the *other* checkout is the one on it,
  // so the refusal can only come from that checkout being read. Naming a
  // documentation path instead would be refused by the base-branch exception and
  // would pass even with the -C scoping broken.
  test('judges a git -C push against the checkout it comes from', () => {
    const other = createFixture();
    try {
      other.branch('main');
      fx.branch('feat/good-name');
      const run = runBash(fx, `git -C ${JSON.stringify(other.repo)} push origin HEAD:main`, {
        CLAUDE_PROJECT_DIR: path.dirname(other.repo),
      });
      expect(run.status).toBe(2);
      expect(run.stderr).toMatch(/'main' is protected/);
    } finally {
      other.cleanup();
    }
  });

  // The same command with an unprotected target is allowed, which is what makes
  // the refusal attributable to the -C rather than to the refspec.
  test('allows that push when the branch it names is not protected', () => {
    const other = createFixture();
    try {
      other.branch('feat/other-work');
      fx.branch('feat/good-name');
      const run = runBash(
        fx,
        `git -C ${JSON.stringify(other.repo)} push origin HEAD:feat/other-work`,
        { CLAUDE_PROJECT_DIR: path.dirname(other.repo) }
      );
      expect(run.status).toBe(0);
    } finally {
      other.cleanup();
    }
  });

  test('does not carry git -C over to the next command', () => {
    const other = createFixture();
    try {
      other.branch('feat/other-work');
      fx.branch('main');
      const run = runBash(
        fx,
        `git -C ${JSON.stringify(other.repo)} log -1 >/dev/null; git commit -m "x"`,
        { CLAUDE_PROJECT_DIR: path.dirname(other.repo) }
      );
      // main is protected, and this checkout is the one the commit lands in.
      expect(run.status).toBe(2);
      expect(run.stderr).toMatch(/'main' is protected/);
    } finally {
      other.cleanup();
    }
  });

  test('still allows a commit after a cd into a compliant checkout', () => {
    const other = createFixture();
    try {
      other.branch('feat/other-work');
      const run = runBash(fx, `cd ${JSON.stringify(other.repo)} && git commit -m "x"`, {
        CLAUDE_PROJECT_DIR: path.dirname(other.repo),
      });
      expect(run.status).toBe(0);
    } finally {
      other.cleanup();
    }
  });

  // The contract requires the REST endpoint because a cloud session cannot reach
  // GraphQL. `gh pr list` failing there made hasOpenPr return false, so the legacy
  // exception never applied and every commit on an existing PR branch was refused.
  test('asks for open pull requests over REST, not through the GraphQL-backed gh pr list', () => {
    fx.branch('copilot/legacy');
    fx.git('push', '--quiet', 'origin', 'copilot/legacy');
    const run = runBash(fx, 'git commit -m "x"', { GH_STUB_MODE: 'open' });
    expect(run.status).toBe(0);
    const calls = fx.calls().filter((call) => call.startsWith('gh '));
    expect(calls.some((call) => call.includes('api -X GET repos/lightspeedwp/.github/pulls'))).toBe(
      true
    );
    expect(calls.some((call) => call.includes('pr list'))).toBe(false);
  });

  // A command handed to another shell is the same command as the unquoted form, so
  // it is read rather than disclaimed. A combined cluster is the common form in
  // agent-issued commands, and there the `-c` sits inside one word like "-lc", so
  // a lookup for a standalone "-c" missed it entirely.
  test.each(['sh -c', 'bash -c', 'zsh -c', 'bash -lc', 'sh -ec'])(
    'refuses a protected push hidden inside %s',
    (form) => {
      fx.branch('feat/good-name');
      expect(runBash(fx, `${form} "git push origin main"`).status).toBe(2);
    }
  );

  test('refuses a placeholder commit hidden inside a nested shell', () => {
    fx.branch('chore/session-abc123');
    expect(runBash(fx, `bash -c "git commit -m 'x'"`).status).toBe(2);
  });

  // A wrapper's own options and leading values sit between it and the command.
  // Reading one of them as the command name left the push behind it unchecked.
  // `env -i` is excluded from the command list below because it clears the
  // environment, which takes the stubbed git off PATH and makes the command fail
  // for an unrelated reason. It is covered by the `commandOf` assertion instead.
  test.each([
    'timeout 60 git push origin main',
    'timeout --preserve-status 30 git push origin main',
    'timeout -s TERM 5 git push origin main',
    'nice -n 10 git push origin main',
    'stdbuf -o0 git push origin main',
  ])('refuses the protected push behind %s', (command) => {
    fx.branch('feat/good-name');
    expect(runBash(fx, command).status).toBe(2);
  });

  test('still allows a compliant command behind a wrapper', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'timeout 60 git status').status).toBe(0);
    expect(runBash(fx, 'nice -n 10 git status').status).toBe(0);
  });

  // `env -i` cannot be exercised through a real command here: clearing the
  // environment takes the stubbed git off PATH, so the command fails before the
  // guard can judge it. The option handling is asserted against the guard's own
  // wrapper list instead, which is what decides the resolution.
  // A cloud session reaches GitHub through a local proxy whose path carries the
  // repository after a `git/` prefix, and whose authority is the proxy rather than
  // github.com. Reading only the authority, or requiring exactly two path
  // segments, meant the legacy pull-request exception and the gh checks silently
  // never ran there.
  test.each([
    'http://local_proxy@127.0.0.1:/git/lightspeedwp/.github',
    'http://local_proxy@127.0.0.1:/git/lightspeedwp/.github.git',
  ])('identifies the repository behind the cloud proxy URL %s', (url) => {
    fx.branch('copilot/fix-login');
    fx.git('push', '--quiet', 'origin', 'copilot/fix-login');
    // A cloud session has no GitHub remote, only the proxy. The fixture's GitHub
    // remote is removed so the lookup has nothing else to find: with it still
    // present the answer comes from there and the proxy is never consulted, which
    // is exactly the gap this covers.
    fx.git('remote', 'remove', 'github');
    fx.git('remote', 'set-url', '--push', 'origin', url);
    const run = runBash(fx, 'git commit -m "x"', { GH_STUB_MODE: 'open' });
    expect(run.status).toBe(0);
    const calls = fx.calls().filter((call) => call.startsWith('gh '));
    expect(calls.some((call) => call.includes('repos/lightspeedwp/.github/pulls'))).toBe(true);
  });

  test('treats a wrapper option as belonging to the wrapper', () => {
    const guard = fs.readFileSync(GUARD, 'utf8');
    const wrappers = guard.match(/const WRAPPERS = new Set\(\[([\s\S]*?)\]\);/)[1];
    // The wrappers that were missing, each of which prefixes a command in
    // agent-issued shell text.
    for (const wrapper of ['timeout', 'nice', 'stdbuf', 'ionice', 'chrt']) {
      expect(wrappers).toContain(wrapper);
    }
    // Options are recorded per wrapper. A single shared list is wrong because a
    // flag that takes a value for one wrapper takes none for another, and
    // `env -i` taking a value there swallowed the command itself.
    expect(guard).toMatch(/const WRAPPER_OPTIONS = \{/);
    const table = guard.slice(guard.indexOf('const WRAPPER_OPTIONS = {'));
    expect(table).toMatch(/env: new Set\(\[([^\]]*)\]\)/);
    const envOptions = table.match(/env: new Set\(\[([^\]]*)\]\)/)[1];
    // `-i` is the flag that made `env -i git push` resolve to "git"'s absence.
    expect(envOptions).not.toContain("'-i'");
  });

  // `&>` redirects both streams, so a guard file can be written through it. The
  // ampersand was read as a background operator, which put the write in the wrong
  // place and let it through.
  test.each(['echo x &> .claude/settings.json', 'echo x &>> .claude/settings.json'])(
    'refuses the guard-file write %s',
    (command) => {
      fx.branch('feat/good-name');
      expect(runBash(fx, command).status).toBe(2);
    }
  );

  test('still allows a plain redirect to a file outside the guard', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'echo x > /tmp/opencode-note').status).toBe(0);
  });

  test('still allows an allowed command hidden inside a nested shell', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'bash -c "git status"').status).toBe(0);
    expect(runBash(fx, 'bash -lc "git status"').status).toBe(0);
  });

  // A long option ending in c carries no command. Treating it as the command flag
  // would read the next word as a command to check.
  // A command substitution inside a double-quoted argument is a command of its
  // own. Collapsing it into the surrounding word hid it, so the inner command was
  // never examined.
  // The enclosing command is harmless and must be allowed on its own, so the only
  // thing that can refuse the pair is the substitution. `echo` writes nothing the
  // guard protects, and the outer command touches no branch.
  test.each([
    ['git commit -m plain text', 'git commit -m "$(git push origin main)"'],
    [
      'git commit -m plain text',
      'git commit -m ' + String.fromCharCode(96) + 'git push origin main' + String.fromCharCode(96),
    ],
  ])('refuses the push hidden in the substitution of %s', (plain, substituted) => {
    fx.branch('feat/good-name');
    // The same command without a substitution is allowed, which is what makes
    // the refusal attributable to the substitution rather than to the commit.
    expect(runBash(fx, plain).status).toBe(0);
    expect(runBash(fx, substituted).status).toBe(2);
  });

  // The substitution is checked as a command in its own right, so a guard-file
  // delete hidden inside one is refused.
  test('refuses a guard-file delete inside a command substitution', () => {
    fx.branch('feat/good-name');
    // Written with String.fromCharCode rather than a backtick literal: this file
    // is a template-literal-containing module and a raw backtick would close it.
    const tick = String.fromCharCode(96);
    expect(runBash(fx, 'git commit -m ' + tick + 'rm .claude/settings.json' + tick).status).toBe(2);
    const run = runBash(fx, 'git commit -m "$(rm .claude/settings.json)"');
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/guard|settings/i);
  });

  // The unquoted form reaches the same code path, and before this was handled
  // `echo $(git push origin main)` was a single segment naming echo.
  test('refuses the push hidden in an unquoted command substitution', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'echo plain text >/dev/null').status).toBe(0);
    expect(runBash(fx, 'echo $(git push origin main) >/dev/null').status).toBe(2);
  });

  // Inside a parenthesised group the substitution was read as part of the outer
  // word, so the inner command went unchecked there.
  test('refuses the push hidden in a substitution inside a group', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'echo plain >/dev/null').status).toBe(0);
    expect(runBash(fx, '(echo $(git push origin main))').status).toBe(2);
  });

  test('still allows a substitution that touches nothing protected', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'echo "$(git rev-parse HEAD)" >/dev/null').status).toBe(0);
  });

  test('does not mistake a long option ending in c for the command flag', () => {
    fx.branch('feat/good-name');
    expect(runBash(fx, 'bash --norc').status).toBe(0);
  });

  // Self-protection has to hold while the guard is broken, which is exactly when
  // isGuardFileWrite runs. A nested command names the interpreter, not the file.
  const FAULT = { LS_GUARD_FORCE_FAULT: '1' };
  test.each([
    'bash -c "rm .claude/settings.json"',
    'bash -c "rm -f .claude/hooks/enforce-branch-name.mjs"',
    'bash -lc "rm .claude/settings.json"',
    'eval "rm .claude/settings.json"',
  ])('blocks the nested guard-file write %s on a fault', (command) => {
    const run = runBash(fx, command, FAULT);
    expect(run.status).toBe(2);
  });

  test('still allows a nested non-guard command on a fault', () => {
    const run = runBash(fx, 'bash -c "ls"', FAULT);
    expect(run.status).toBe(0);
  });
});

describe('the guard launcher (CodeRabbit #3524)', () => {
  // A hook command that cannot start is treated as non-blocking, so invoking the
  // guard through `node` fails open wherever node is absent. settings.json calls a
  // launcher instead, which can refuse for that reason — and can still be switched
  // off, which matters because the hook matches Bash, Edit and Write: an
  // unconditional refusal would block every call in the session, `ls` included.
  const LAUNCHER = path.join(path.dirname(GUARD), 'run-guard.sh');
  const PROJECT = path.join(path.dirname(GUARD), '..', '..');
  const settings = require('../../.claude/settings.json');
  const preToolUse = settings.hooks.PreToolUse.flatMap((entry) => entry.hooks);

  /** A PATH with the shell utilities the launcher needs but no node. */
  const pathWithoutNode = () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'guard-path-'));
    for (const tool of ['bash', 'sh', 'printf', 'cat']) {
      const source = spawnSync('bash', ['-c', `command -v ${tool}`], {
        encoding: 'utf8',
      }).stdout.trim();
      if (source) fs.symlinkSync(source, path.join(dir, tool));
    }
    return dir;
  };

  const launch = (env) => {
    const run = spawnSync('bash', [LAUNCHER], { input: '{}', encoding: 'utf8', env });
    return { status: run.status, stdout: run.stdout, stderr: run.stderr };
  };

  test('is what settings.json invokes, not a bare node call', () => {
    const commands = preToolUse.map((hook) => hook.command);
    expect(commands).toHaveLength(1);
    expect(commands[0]).toContain('.claude/hooks/run-guard.sh');
    expect(commands[0]).not.toBe(
      'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/enforce-branch-name.mjs'
    );
  });

  test('refuses with exit 2 when node is not on PATH', () => {
    const dir = pathWithoutNode();
    try {
      const run = launch({ PATH: dir, CLAUDE_PROJECT_DIR: PROJECT });
      expect(run.status).toBe(2);
      expect(run.stderr).toMatch(/node is not on PATH/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test('warns and allows with the enforcement switch off, even without node', () => {
    const dir = pathWithoutNode();
    try {
      const run = launch({ PATH: dir, CLAUDE_PROJECT_DIR: PROJECT, LS_ENFORCE_BRANCH_NAMES: '0' });
      expect(run.status).toBe(0);
      expect(run.stderr).toMatch(/enforcement is off/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  // The switch is only the launcher's business when the guard cannot run at all.
  // With node present the guard must still start, because that is the one case
  // where it has something to say with enforcement off: it reports the skipped
  // check and lets the action through (FR-013). Short-circuiting before it ran
  // would leave that warning-only mode unreachable through settings.json.
  test('still starts the guard with the switch off when node is available', () => {
    const run = spawnSync('bash', [LAUNCHER], {
      input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git commit -m x' } }),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PROJECT_DIR: PROJECT, LS_ENFORCE_BRANCH_NAMES: '0' },
    });
    expect(run.status).toBe(0);
    // The guard's own warning names the guard, not the launcher.
    expect(run.stderr).not.toMatch(/node is not on PATH/);
  });

  // The message reaches the session as JSON on stdout, so a broken message there
  // would be worse than none at all.
  test('emits a parseable JSON system message when it refuses', () => {
    const run = launch({
      ...process.env,
      CLAUDE_PROJECT_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'guard-proj-')),
    });
    expect(run.status).toBe(2);
    const parsed = JSON.parse(run.stdout.trim());
    expect(parsed.systemMessage).toMatch(/is missing/);
  });

  // A missing guard file is exactly the case where a developer needs to put the
  // file back, and the hook matches Edit and Write, so the opt-out has to be
  // reachable here too.
  test('warns and allows with the switch off when the guard file is missing', () => {
    const run = launch({
      ...process.env,
      CLAUDE_PROJECT_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'guard-proj-')),
      LS_ENFORCE_BRANCH_NAMES: '0',
    });
    expect(run.status).toBe(0);
    expect(run.stderr).toMatch(/enforcement is off/);
  });

  // `gh api` has no --repo flag, so passing one makes the call fail and the
  // exception never applies. The file-write path reaches hasOpenPr with the
  // repository already known, so it is the one that would have broken.
  test('sends no --repo flag, which gh api would reject', () => {
    const guard = fs.readFileSync(GUARD, 'utf8');
    const whole = guard.slice(guard.indexOf('function hasOpenPr'));
    const body = whole.slice(0, whole.indexOf('\n}\n'));
    expect(body).not.toMatch(/'--repo'/);
    // The repository travels in the endpoint instead.
    expect(body).toMatch(/repos\/\$\{target\.owner\}\/\$\{target\.repo\}\/pulls/);
  });

  test("passes the guard's own exit code through when node is available", () => {
    const run = spawnSync('bash', [LAUNCHER], {
      input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git status' } }),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PROJECT_DIR: PROJECT },
    });
    expect(run.status).toBe(0);
  });
});
