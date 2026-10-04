/**
 * Guards JS-family extension coverage across the formatting and lint entry
 * points.
 *
 * The repository is ESM ("type": "module"), so config files must be .cjs, and
 * .mjs appears too. Those extensions were silently excluded from both
 * lint-staged and the eslint/prettier scripts because the globs only named
 * js/jsx/ts/tsx — so .cjs config files were committed unformatted and never
 * linted, and nothing flagged it.
 *
 * Rather than assert one hard-coded glob, this walks the files actually
 * tracked by git and fails whenever a JS-family extension present in the tree
 * is not covered. Adding a .mts file without extending the globs now fails
 * here instead of drifting unnoticed.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repositoryRoot = path.resolve(__dirname, '../../..');

// Canonical Node/TS module extensions. Anything outside this set is not
// expected to be linted as JavaScript and is ignored on purpose.
const JS_FAMILY = new Set(['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'mts', 'cts']);

const COVERED_SCRIPTS = ['lint:js', 'lint:js:fix', 'lint:js:ci', 'format:js', 'format:check'];

function extensionsCovered(text) {
  const found = new Set();

  for (const match of text.matchAll(/\{([^{}]+)\}/g)) {
    for (const part of match[1].split(',')) {
      const extension = part.trim().replace(/^\*\./, '');
      if (extension) found.add(extension);
    }
  }

  for (const match of text.matchAll(/\*\.([A-Za-z0-9]+)/g)) {
    found.add(match[1]);
  }

  return found;
}

function trackedJsExtensions() {
  // maxBuffer must exceed the default 1 MiB: this repository tracks well over
  // ten thousand files, and ls-files overflows the default with ENOBUFS.
  const listed = execFileSync('git', ['ls-files'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }).split('\n');

  const present = new Set();
  for (const file of listed) {
    const extension = path.extname(file).replace(/^\./, '').toLowerCase();
    if (JS_FAMILY.has(extension)) present.add(extension);
  }

  return present;
}

describe('JS-family extension coverage', () => {
  const present = trackedJsExtensions();
  const lintStaged = require(path.join(repositoryRoot, '.lintstagedrc.cjs'));
  const pkg = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'));

  it('finds JS-family extensions in the tree (guards the check itself)', () => {
    expect(present.size).toBeGreaterThan(0);
  });

  it('covers every present extension in lint-staged', () => {
    const covered = new Set();
    for (const pattern of Object.keys(lintStaged)) {
      for (const extension of extensionsCovered(pattern)) covered.add(extension);
    }

    expect([...present].filter((extension) => !covered.has(extension))).toEqual([]);
  });

  it.each(COVERED_SCRIPTS)('covers every present extension in %s', (scriptName) => {
    const covered = extensionsCovered(pkg.scripts[scriptName]);

    expect([...present].filter((extension) => !covered.has(extension))).toEqual([]);
  });
});
