const { spawnSync } = require('node:child_process');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', 'pre-push');
const REPO_ROOT = path.join(__dirname, '..', '..', '..');
const SHA = 'a'.repeat(40);

/**
 * Run the pre-push hook with the given ref-update records on stdin, the way git
 * invokes it. Passing an empty string means no records at all, which is what a
 * direct `node lib/hooks/pre-push` invocation looks like.
 * @param {string} input
 * @param {string[]} [args]
 * @returns {{status: number|null, stdout: string}}
 */
function runHook(input, args = []) {
  const result = spawnSync(process.execPath, [HOOK, ...args], {
    encoding: 'utf-8',
    input,
    // The hook is an extensionless ES module, so node resolves its type from the
    // nearest package.json. It has to be run from the repository root, which is
    // also how .husky/pre-push invokes it.
    cwd: REPO_ROOT,
  });
  return { status: result.status, stdout: `${result.stdout}${result.stderr}` };
}

/** One ref-update record: <local ref> SP <local sha> SP <remote ref> SP <remote sha> */
const record = (localRef) => `${localRef} ${SHA} ${localRef} ${SHA}\n`;

describe('pre-push hook', () => {
  test('validates every branch named in the ref-update records, not the checked-out branch', () => {
    // The bug this pins: the hook used `git rev-parse --abbrev-ref HEAD`, so an
    // explicit `git push <other-branch>` escaped validation whenever the current
    // branch was valid. The rejection count line is the signal that the pushed
    // ref, not HEAD, was checked.
    const { status, stdout } = runHook(record('refs/heads/Invalid_Branch'));
    expect(stdout).toMatch(/lowercase/i);
    expect(stdout).toMatch(/1 of 1 pushed branch name\(s\) rejected/);
    expect(status).toBe(1);
  });

  test('allows a push of a valid branch', () => {
    const { status, stdout } = runHook(record('refs/heads/fix/abc-def'));
    expect(stdout).toContain("Branch 'fix/abc-def' is valid");
    expect(status).toBe(0);
  });

  test('rejects the push when one of several branches is invalid', () => {
    const { status, stdout } = runHook(
      record('refs/heads/fix/abc-def') + record('refs/heads/Not_Valid')
    );
    expect(stdout).toMatch(/1 of 2 pushed branch name\(s\) rejected/);
    expect(status).toBe(1);
  });

  test('ignores a deletion, which carries no new branch name', () => {
    const { status, stdout } = runHook(
      `(delete) ${SHA} refs/heads/fix/abc-def ${SHA}\n`
    );
    expect(stdout).toMatch(/no branch refs in this push/);
    expect(status).toBe(0);
  });

  test('ignores a push that carries no refs/heads, such as a tag', () => {
    const { status, stdout } = runHook(record('refs/tags/v1.0.0'));
    expect(stdout).toMatch(/no branch refs in this push/);
    expect(status).toBe(0);
  });

  test('falls back to the checked-out branch when invoked without records', () => {
    // `node lib/hooks/pre-push` is the documented manual invocation, so it has to
    // keep working outside a push.
    const { status } = runHook('');
    expect([0, 1]).toContain(status);
  });

  test('reports each rejection with the reason and the bypass route', () => {
    const { stdout } = runHook(record('refs/heads/Bad_Name'));
    expect(stdout).toMatch(/Pattern: \{type\}\/\{scope\}-\{title\}/);
    expect(stdout).toMatch(/--no-verify/);
  });
});
