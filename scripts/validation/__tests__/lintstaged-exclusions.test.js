/**
 * Guards the exclusion list in .lintstagedrc.cjs and the one flat ESLint config.
 *
 * lint-staged passes native absolute paths, so on Windows an excluded directory
 * arrives as `C:\repo\.github\projects\active\...`. The exclusion patterns are
 * written with forward slashes, so a backslash path used to slip past them and the
 * deliberately excluded project files were linted anyway.
 */

const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '../../..');
const lintStaged = require('../../../.lintstagedrc.cjs');

const jsTask = lintStaged['*.{js,jsx,ts,tsx,cjs,mjs}'];
const mdTask = lintStaged['*.{md,mdx}'];

describe('lint-staged exclusions', () => {
  it.each([
    ['POSIX', '/repo/.github/projects/active/plan/script.js'],
    ['Windows', 'C:\\repo\\.github\\projects\\active\\plan\\script.js'],
    ['Windows vendored skill', 'C:\\repo\\skills\\x\\plugin-provided\\y\\run.js'],
    ['Windows dashboard', 'C:\\repo\\scripts\\dashboard\\app.js'],
  ])('sends no excluded %s path to ESLint or Prettier', (_label, file) => {
    expect(jsTask([file])).toEqual([]);
  });

  it('still lints a path that is not excluded, on both separator forms', () => {
    for (const file of ['/repo/scripts/validation/a.js', 'C:\\repo\\scripts\\validation\\a.js']) {
      const commands = jsTask([file]);

      expect(commands).toHaveLength(2);
      expect(commands[0]).toContain('eslint --fix');
    }
  });

  it('applies the same exclusions to Markdown on a Windows path', () => {
    expect(mdTask(['C:\\repo\\.github\\projects\\active\\plan\\notes.md'])).toEqual([]);
  });
});

describe('ESLint configuration', () => {
  it('has exactly one flat config, with no stale hidden sibling', () => {
    // A dotted `.eslint.config.cjs` is never discovered by ESLint, and the one that
    // existed imported a plugin this repository no longer installs.
    expect(fs.existsSync(path.join(repositoryRoot, 'eslint.config.cjs'))).toBe(true);
    expect(fs.existsSync(path.join(repositoryRoot, '.eslint.config.cjs'))).toBe(false);
  });
});
