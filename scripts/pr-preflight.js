#!/usr/bin/env node

/**
 * Pull request preflight.
 *
 * Run this before opening a pull request. It applies the same rules as the
 * required checks that fail most often on opening:
 *
 * 1. Route the branch name to its PR template, as the routing check does.
 * 2. Compare a body file with that template's sections.
 * 3. Predict the changelog gate from the diff, labels and intended PR author.
 * 4. Run the specification audit when the diff touches `.github/specs/`.
 *
 * Usage:
 *   node scripts/pr-preflight.js --branch <name> --skeleton
 *   node scripts/pr-preflight.js --branch <name> [--body-file <file>]
 *     [--labels a,b] [--base origin/develop] [--author <login>]
 *
 * Exit code 0 when every applicable check passes, 1 otherwise.
 */

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bodyFailureMessage,
  checkPrBody,
  predictChangelogGate,
  renderSkeleton,
} from './pr-preflight-rules.js';

function parseArgs(argv) {
  const args = { base: 'origin/develop', labels: [], author: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--skeleton') args.skeleton = true;
    else if (flag === '--branch') args.branch = argv[++i];
    else if (flag === '--body-file' || flag === '--author') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`${flag} requires ${flag === '--body-file' ? 'a file path' : 'a PR author login'}.`);
      }
      if (flag === '--body-file') args.bodyFile = value;
      else args.author = value;
      i += 1;
    } else if (flag === '--base') args.base = argv[++i];
    else if (flag === '--labels') args.labels = (argv[++i] || '').split(',').filter(Boolean);
    else throw new Error(`Unknown argument: ${flag}`);
  }
  return args;
}

function run(file, fileArgs) {
  return execFileSync(file, fileArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function main() {
  // The router and the audit read repository-relative paths, so run from the
  // repository root wherever the command was started. A body file given as a
  // relative path is resolved before the move.
  const args = parseArgs(process.argv.slice(2));
  if (args.bodyFile) args.bodyFile = path.resolve(args.bodyFile);
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  if (!args.branch) {
    console.error('Branch name required: --branch <name>');
    return 1;
  }

  const routing = JSON.parse(run('node', ['scripts/pr-template-router.js', args.branch]));
  const templateFile = `.github/PULL_REQUEST_TEMPLATE/${routing.template}.md`;
  if (!fs.existsSync(templateFile)) {
    // The workflow skips the body check in this case, with a warning.
    console.error(`skip PR body: template ${templateFile} does not exist`);
    args.skeleton = false;
    args.bodyFile = undefined;
  }
  const template = fs.existsSync(templateFile) ? fs.readFileSync(templateFile, 'utf8') : '';
  console.error(`branch type ${routing.branch_type}, template ${routing.template}.md`);

  if (args.skeleton) {
    process.stdout.write(`\n${renderSkeleton(template)}`);
    return 0;
  }

  let failed = false;
  const fail = (message) => {
    failed = true;
    console.error(`FAIL ${message}`);
  };

  if (args.bodyFile) {
    const result = checkPrBody({ template, body: fs.readFileSync(args.bodyFile, 'utf8') });
    const message = bodyFailureMessage({ templateName: routing.template, result });
    if (message) fail(message);
    else if (result.todo.length > 0) {
      fail(`PR body still has TODO markers in: ${result.todo.map((h) => `"## ${h}"`).join(', ')}.`);
    } else console.log('ok   PR body has every template section with content');
  } else {
    console.log('skip PR body (no --body-file)');
  }

  // Compare the final working tree with the common ancestor so edits that
  // restore a tracked file to its original state do not count as PR changes.
  const mergeBase = run('git', ['merge-base', args.base, 'HEAD']).trim();
  const tracked = run('git', ['diff', '--name-only', '-z', mergeBase, '--']).split('\0');
  const untracked = run('git', ['ls-files', '--others', '--exclude-standard', '-z']).split('\0');
  const changed = [...new Set([...tracked, ...untracked].filter(Boolean))];
  const labels = [
    ...new Set([...routing.default_labels.filter((l) => l.startsWith('type:')), ...args.labels]),
  ];
  const gate = predictChangelogGate({ changed, labels, author: args.author });
  if (gate.outcome === 'fail') fail(`changelog gate: ${gate.reason}`);
  else console.log(`ok   changelog gate: ${gate.reason}`);

  if (changed.some((f) => f.startsWith('.github/specs/'))) {
    try {
      run('bash', ['.specify/scripts/bash/audit-specs.sh']);
      console.log('ok   specification audit');
    } catch (error) {
      fail(
        `specification audit failed:\n${String(error.stdout || error.message)
          .split('\n')
          .slice(-12)
          .join('\n')}`
      );
    }
  }

  return failed ? 1 : 0;
}

process.exitCode = main();
