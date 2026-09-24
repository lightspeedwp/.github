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
 * The contract this guard enforces is narrow and deliberate: an
 * `@actions/core` import must not carry a default clause. Namespace and
 * named imports are both valid against the ESM-only release (verified on
 * 3.0.1), so they are not rejected here.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '../../..');
// Matches a whole import declaration for the specifier, including a
// multi-line clause list, and captures the clause before `from`.
// The clause may not contain `;` or the word `import`, so it can never span
// across an earlier import statement and capture unrelated text. The
// specifier is a literal rather than an interpolated pattern: it is a fixed
// string, and interpolation would only add needless complexity.
const IMPORT_CLAUSE = /import\s+((?:(?!\bimport\b)[^;])*?)\s+from\s+["']@actions\/core["']/g;
// A clause beginning with an identifier is a default import, e.g.
// `core` or `core, { info }`. Namespace (`* as core`) and named (`{ info }`)
// clauses start with `*` or `{` and are unaffected.
const HAS_DEFAULT_CLAUSE = /^[A-Za-z_$][\w$]*(\s*,|\s*$)/;
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

/** Import clauses of @actions/core, per repo-relative file. */
function findImports(dir = ROOT, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === ROOT ? SCAN_ROOTS.includes(entry.name) : true) findImports(full, found);
    } else if (/\.(js|mjs)$/.test(entry.name) && full !== __filename) {
      const source = fs.readFileSync(full, 'utf8');
      if (!source.includes('@actions/core')) continue;
      const clauses = [...source.matchAll(IMPORT_CLAUSE)].map((match) => match[1].trim());
      found.push({ file: path.relative(ROOT, full).split(path.sep).join('/'), source, clauses });
    }
  }
  return found;
}

describe('@actions/core import form (#3561)', () => {
  const consumers = findImports();
  const imports = consumers.flatMap(({ file, clauses }) =>
    clauses.map((clause) => ({ file, clause }))
  );

  test('real source has @actions/core imports to guard', () => {
    expect(imports.length).toBeGreaterThan(0);
  });

  test('no import uses a default clause (breaks on the ESM-only release)', () => {
    const offenders = imports
      .filter(({ clause }) => HAS_DEFAULT_CLAUSE.test(clause))
      .map(({ file, clause }) => `${file}: ${clause.replace(/\s+/g, ' ')}`);
    expect(offenders).toEqual([]);
  });

  test('the installed package exposes every member those files call', () => {
    const used = new Set();
    for (const { source } of consumers) {
      for (const match of source.matchAll(/\bcore\.(\w+)/g)) {
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
        `const m = await import('@actions/core');
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
