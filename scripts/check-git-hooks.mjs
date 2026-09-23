#!/usr/bin/env node
/**
 * Warn when the Husky Git hooks are not installed (#3493).
 *
 * `core.hooksPath` points at `.husky/_`, which only `npm run prepare` creates.
 * A checkout installed with `npm ci --ignore-scripts` (worktrees, bots) has no
 * `.husky/_`, and Git then runs no hooks at all, without any warning. This
 * check makes that visible.
 *
 * Usage: node scripts/check-git-hooks.mjs [--strict]
 *   Exits 0 with a warning by default; `--strict` exits 1 instead.
 *   Skipped in CI, where hooks are not used and workflows are the gate.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const HOOKS = ['pre-commit', 'pre-push'];

function git(...args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

export function findProblems() {
  const root = git('rev-parse', '--show-toplevel');
  if (!root) return [];

  const hooksPath = git('config', 'core.hooksPath');
  if (!hooksPath) {
    return ['core.hooksPath is not set, so the Husky hooks are not active.'];
  }

  const directory = path.resolve(root, hooksPath);
  if (!existsSync(directory)) {
    return [`core.hooksPath is ${hooksPath}, which does not exist, so Git runs no hooks.`];
  }

  return HOOKS.filter((hook) => !existsSync(path.join(directory, hook))).map(
    (hook) => `${hook} is missing from ${hooksPath}.`
  );
}

function main() {
  if (process.env.CI) return;

  const problems = findProblems();
  if (!problems.length) return;

  const strict = process.argv.includes('--strict');
  console.warn(
    [
      '⚠️  Git hooks are not installed; pre-commit and pre-push checks will not run.',
      ...problems.map((problem) => `   - ${problem}`),
      '   Fix: npm run prepare',
    ].join('\n')
  );
  if (strict) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
