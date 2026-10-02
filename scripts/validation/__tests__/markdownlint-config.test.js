/**
 * Guards the markdownlint fix-mode invariants. A bare `markdownlint-cli2`
 * invocation once auto-fixed whole files (the loaded config defaulted to
 * `fix: true`), which rewrote unrelated lines and leaked them into commits
 * through lint-staged. A second, never-loaded config file carrying
 * `fix: false` made the behaviour harder to diagnose. Both are asserted
 * here rather than left to a code review to catch.
 *
 * 1. The loaded `.markdownlint-cli2.cjs` defaults to `fix: false`.
 * 2. No dead `.markdownlint-cli2.config.cjs` exists to contradict it.
 * 3. Every flow that intends to fix passes `--fix` explicitly, so the new
 *    default does not silently disable fixing where it is wanted.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

describe('markdownlint fix-mode configuration', () => {
  it('leaves fix unset so bare runs check and --fix still fixes', () => {
    // The CLI --fix flag is overridden by an explicit config value, so
    // neither fix:true (bare runs rewrite files) nor fix:false (explicit
    // --fix silently stops working) is safe. The key must be absent.
    const config = require(path.join(REPO_ROOT, '.markdownlint-cli2.cjs'));
    expect('fix' in config).toBe(false);
  });

  it('carries no dead CLI2 config file', () => {
    expect(fs.existsSync(path.join(REPO_ROOT, '.markdownlint-cli2.config.cjs'))).toBe(false);
  });

  it('keeps explicit --fix on every flow that intends to fix', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
    expect(pkg.scripts['lint:md:fix']).toContain('--fix');
    expect(pkg.scripts.lint).not.toContain('--fix');
    const hook = fs.readFileSync(
      path.join(REPO_ROOT, 'scripts/validation/lint-md-staged.cjs'),
      'utf8'
    );
    expect(hook).toContain('"--fix"');
  });
});
