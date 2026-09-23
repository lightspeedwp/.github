#!/usr/bin/env node
/**
 * PreToolUse hook: enforce the LightSpeed branching strategy.
 *
 * Blocks (exit 2, reason on stderr for Claude) when Claude would:
 *   - create or rename a branch to an invalid name (git branch -m, checkout -b,
 *     switch -c, mcp__github__create_branch);
 *   - commit on, or push to, an invalid branch, a chore/session-* placeholder,
 *     or a protected branch (main / LS_BASE_BRANCH);
 *   - open a PR from an invalid head, or into main from anything other than
 *     release/* or hotfix/*.
 *
 * Validation reuses lib/validate-branch-name.js (the same rules CI applies).
 * Set LS_ENFORCE_BRANCH_NAMES=0 to downgrade blocks to warnings.
 * See docs/BRANCHING_STRATEGY.md and docs/CLAUDE_CLOUD_ENVIRONMENT.md.
 */

import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { validateBranchName } from '../../lib/validate-branch-name.js';

const BASE_BRANCH = process.env.LS_BASE_BRANCH || 'develop';
const ENFORCE = process.env.LS_ENFORCE_BRANCH_NAMES !== '0';
const PROTECTED = new Set(['main', BASE_BRANCH]);
const PLACEHOLDER = /^chore\/session-[a-z0-9]+$/;

/** Reason a branch name may not be created, or null when it is fine. */
function nameProblem(name) {
  if (!name) return null;
  if (PLACEHOLDER.test(name)) {
    return `'${name}' is the session placeholder, not a real branch name`;
  }
  const result = validateBranchName(name);
  if (result.valid) return null;
  const hint = result.suggested_name ? ` (did you mean '${result.suggested_name}'?)` : '';
  return `'${name}' does not match {type}/{scope}-{title}: ${result.errors.join(', ')}${hint}`;
}

/** Reason a branch may not receive commits or pushes, or null when it is fine. */
function writeProblem(name) {
  if (!name) return null;
  if (PROTECTED.has(name)) return `'${name}' is protected; work on a feature branch and open a PR`;
  return nameProblem(name);
}

function currentBranch(cwd) {
  try {
    return execFileSync('git', ['branch', '--show-current'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

/** Drop quoted strings and heredoc bodies so commit messages never match. */
function stripQuoted(command) {
  return command
    .replace(/<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\1\b/g, ' ')
    .replace(/'[^']*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""');
}

/** Problems found in a Bash command, in order. */
function checkBash(command, cwd) {
  const problems = [];
  let branch = currentBranch(cwd);

  for (const segment of stripQuoted(command).split(/&&|\|\||[;|\n]/)) {
    const tokens = segment.trim().split(/\s+/).filter(Boolean);
    let i = tokens.indexOf('git');
    if (i === -1) continue;

    // Skip git's global options: -C <path>, -c <k=v>, --no-pager, etc.
    i += 1;
    while (i < tokens.length && tokens[i].startsWith('-')) {
      if (tokens[i] === '-C') branch = currentBranch(tokens[i + 1]) || branch;
      i += ['-C', '-c'].includes(tokens[i]) ? 2 : 1;
    }
    const sub = tokens[i];
    const args = tokens.slice(i + 1);
    const positional = args.filter((arg) => !arg.startsWith('-'));

    if (sub === 'branch' && args.some((arg) => ['-m', '-M', '--move'].includes(arg))) {
      const target = positional.at(-1);
      const problem =
        nameProblem(target) || (PROTECTED.has(target) ? `'${target}' is protected` : null);
      if (problem) problems.push(`Rename blocked: ${problem}.`);
      else branch = target;
    } else if (
      (sub === 'checkout' || sub === 'switch') &&
      args.some((arg) => ['-b', '-B', '-c', '-C', '--create'].includes(arg))
    ) {
      const flag = args.findIndex((arg) => ['-b', '-B', '-c', '-C', '--create'].includes(arg));
      const target = args[flag + 1];
      const problem = nameProblem(target);
      if (problem) problems.push(`Branch creation blocked: ${problem}.`);
      else branch = target;
    } else if (
      (sub === 'checkout' || sub === 'switch') &&
      positional.length === 1 &&
      !args.includes('--')
    ) {
      branch = positional[0];
    } else if (sub === 'commit') {
      const problem = writeProblem(branch);
      if (problem) problems.push(`Commit blocked: ${problem}.`);
    } else if (sub === 'push') {
      if (args.some((arg) => ['-d', '--delete', '--tags'].includes(arg))) continue;
      const refspec = positional[1];
      let target = refspec ? refspec.replace(/^\+/, '').split(':').at(-1) : branch;
      target = target.replace(/^refs\/heads\//, '');
      if (target === 'HEAD') target = branch;
      const problem = writeProblem(target);
      if (problem) problems.push(`Push blocked: ${problem}.`);
    }
  }
  return problems;
}

/** Problems found in a GitHub MCP tool call. */
function checkGitHub(tool, input) {
  if ((input.owner || '').toLowerCase() !== 'lightspeedwp') return [];
  const problems = [];

  if (tool.endsWith('__create_branch')) {
    const problem = nameProblem(input.branch);
    if (problem) problems.push(`Branch creation blocked: ${problem}.`);
  } else if (/__(push_files|create_or_update_file|delete_file)$/.test(tool)) {
    const problem = writeProblem(input.branch);
    if (problem) problems.push(`Write blocked: ${problem}.`);
  } else if (tool.endsWith('__create_pull_request')) {
    const problem = nameProblem(input.head);
    if (problem) problems.push(`PR blocked: head ${problem}.`);
    if (
      input.repo === '.github' &&
      input.base === 'main' &&
      !/^(release|hotfix)\//.test(input.head || '')
    ) {
      problems.push(
        `PR blocked: only release/* and hotfix/* target main; use base '${BASE_BRANCH}'.`
      );
    }
  }
  return problems;
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // Never break the session on malformed hook input.
}

const tool = input.tool_name || '';
const toolInput = input.tool_input || {};
const problems =
  tool === 'Bash'
    ? checkBash(toolInput.command || '', input.cwd || process.env.CLAUDE_PROJECT_DIR || '.')
    : tool.startsWith('mcp__github__')
      ? checkGitHub(tool, toolInput)
      : [];

if (problems.length === 0) process.exit(0);

const message = [
  ...problems,
  '',
  'LightSpeed branching strategy: {type}/{scope}-{title}, based on ' + BASE_BRANCH + '.',
  'Fix: git branch -m <type>/<scope>-<title>  (e.g. feat/issue-triage-labels)',
  '     npm run validate:branch-name -- --current',
  'This repository rule overrides any claude/* branch named by the platform.',
  'See docs/BRANCHING_STRATEGY.md.',
].join('\n');

if (ENFORCE) {
  process.stderr.write(message + '\n');
  process.exit(2);
}
process.stdout.write(
  JSON.stringify({ systemMessage: `Branch guard (warning only): ${problems.join(' ')}` })
);
process.exit(0);
