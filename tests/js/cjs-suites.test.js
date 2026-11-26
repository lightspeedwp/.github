/**
 * Keeps every tracked `*.test.cjs` suite accounted for (GIT-2913).
 *
 * Jest matches `.cjs` files, but some CommonJS suites are written for `node:test` or with their
 * own harness and Jest cannot run them. Those are listed in `testPathIgnorePatterns` and run by
 * `npm run test:cjs-node`. Suites that only test mocks are excluded and run nowhere. Without a
 * check, a new `.cjs` suite can fall between the three and silently never run.
 */

import { execFileSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../..');

// Suites that never require the script they describe, so they test no code. Rewrite each against
// its real script, then remove it from this list and from `testPathIgnorePatterns`.
const EXCLUDED_MOCK_ONLY = [
  'scripts/automation/__tests__/update-projects-status.test.cjs',
  'scripts/workflows/__tests__/orchestrate-phase-progression.test.cjs',
  'scripts/workflows/changelog/__tests__/merge-entries.integration.test.cjs',
  'scripts/workflows/projects/__tests__/archive-projects.test.cjs',
  'scripts/workflows/projects/__tests__/scan-completion.test.cjs',
];

const jestConfig = require(path.join(repoRoot, '.jest.config.cjs'));
const packageScripts = require(path.join(repoRoot, 'package.json')).scripts;

const ignoredCjs = jestConfig.testPathIgnorePatterns
  .filter((pattern) => pattern.endsWith('.test.cjs'))
  .map((pattern) => pattern.replace('<rootDir>/', ''))
  .sort();

const nodeSuites = packageScripts['test:cjs-node']
  .split(/\s+/)
  .filter((entry) => entry.endsWith('.test.cjs'))
  .sort();

const trackedCjs = execFileSync('git', ['ls-files', '*.test.cjs'], {
  cwd: repoRoot,
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)
  .sort();

describe('CommonJS test suites', () => {
  it('lists every node:test suite in both the Jest ignore list and test:cjs-node', () => {
    const missingFromIgnore = nodeSuites.filter((file) => !ignoredCjs.includes(file));

    expect(missingFromIgnore).toEqual([]);
  });

  it('excludes only the suites named as mock-only', () => {
    const excluded = ignoredCjs.filter((file) => !nodeSuites.includes(file));

    expect(excluded).toEqual([...EXCLUDED_MOCK_ONLY].sort());
  });

  it('points test:cjs-node only at files that exist', () => {
    const missing = nodeSuites.filter((file) => !trackedCjs.includes(file));

    expect(missing).toEqual([]);
  });

  it('accounts for every tracked .cjs suite: Jest, node --test or excluded', () => {
    const accountedElsewhere = new Set(ignoredCjs);
    const runByJest = trackedCjs.filter((file) => !accountedElsewhere.has(file));

    expect(runByJest.length + ignoredCjs.length).toBe(trackedCjs.length);
    expect(runByJest.length).toBeGreaterThan(0);
  });
});
