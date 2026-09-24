/**
 * Regression guard for the @actions/core import form (#3561).
 *
 * PR #3547 changed `import core from "@actions/core"` to
 * `import * as core from "@actions/core"` in the labelling agents, because
 * the package becomes ESM-only in 3.x and an ESM module has no default
 * export. That is what blocked #3503.
 *
 * `tests/js/import-includes-smoke.test.js` cannot catch a regression here:
 * it only regex-matches *relative* specifiers and never executes anything,
 * so a bare specifier like `@actions/core` is invisible to it.
 *
 * This guard checks the two properties the fix actually depends on:
 *   1. real source never uses a default import of the package, and
 *   2. the installed package still exposes every member those files use,
 *      verified with native ESM resolution.
 *
 * Deliberately not importing the agent modules themselves: several of them
 * are CommonJS-within-an-ESM-package or run `main()` on import, so loading
 * them here would test unrelated behaviour and produce false results.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '../../..');
const SPECIFIER = '@actions/core';
// Bare `import name from "@actions/core"` is the form that breaks on an
// ESM-only release; `import * as core` is the supported form.
const DEFAULT_IMPORT = new RegExp(
  String.raw`^\s*import\s+[A-Za-z_$][\w$]*\s+from\s+["']${SPECIFIER}["']`,
  'm'
);
const NAMESPACE_IMPORT = new RegExp(
  String.raw`^\s*import\s+\*\s+as\s+\w+\s+from\s+["']${SPECIFIER}["']`,
  'm'
);
// Parked trees are not shipped code: `.jest-skip/**` holds intentionally
// disabled suites and `**/fixtures/**` holds deliberately invalid input.
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'coverage',
  'dist',
  'build',
  '.jest-skip',
  'fixtures',
]);
const SCAN_ROOTS = ['scripts', 'agents'];

/** Real source files that import @actions/core, as repo-relative POSIX paths. */
function findConsumers(dir = ROOT, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === ROOT ? SCAN_ROOTS.includes(entry.name) : true) findConsumers(full, found);
    } else if (/\.(js|mjs)$/.test(entry.name) && full !== __filename) {
      const source = fs.readFileSync(full, 'utf8');
      if (source.includes(SPECIFIER)) {
        found.push({ file: path.relative(ROOT, full).split(path.sep).join('/'), source });
      }
    }
  }
  return found;
}

describe('@actions/core import form (#3561)', () => {
  const consumers = findConsumers();

  test('real source has @actions/core consumers to guard', () => {
    expect(consumers.length).toBeGreaterThan(0);
  });

  test('no real source uses a default import of @actions/core', () => {
    const offenders = consumers
      .filter(({ source }) => DEFAULT_IMPORT.test(source))
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  test('ESM consumers use the namespace form the fix relies on', () => {
    const namespaceFiles = consumers.filter(({ source }) => NAMESPACE_IMPORT.test(source));
    // Guard against the form silently reverting to a named import, which is
    // also unavailable once the package ships no CommonJS build.
    const namedOnly = consumers
      .filter(({ source }) => {
        const imports = source.match(
          new RegExp(String.raw`^\s*import\s+[^;\n]*from\s+["']${SPECIFIER}["']`, 'gm')
        );
        return imports && imports.every((line) => !NAMESPACE_IMPORT.test(line));
      })
      .map(({ file }) => file);
    expect(namespaceFiles.length).toBeGreaterThan(0);
    expect(namedOnly).toEqual([]);
  });

  test('the installed package exposes every member those files call', () => {
    const used = new Set();
    for (const { source } of consumers) {
      for (const match of source.matchAll(new RegExp(String.raw`\bcore\.(\w+)`, 'g'))) {
        used.add(match[1]);
      }
    }
    expect(used.size).toBeGreaterThan(0);

    // Native ESM resolution in a real Node process, so an ESM-only release
    // is exercised the way GitHub Actions runs it.
    const result = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `const m = await import('${SPECIFIER}');
         const used = ${JSON.stringify([...used])};
         const missing = used.filter((key) => !(key in m));
         if (missing.length) { console.error('missing: ' + missing.join(', ')); process.exit(1); }
         console.log('ok ' + used.length);`,
      ],
      { cwd: ROOT, encoding: 'utf8' }
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`ok ${used.size}`);
  }, 120000);
});
