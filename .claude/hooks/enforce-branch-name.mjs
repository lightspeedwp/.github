#!/usr/bin/env node
/**
 * PreToolUse hook: enforce the LightSpeed branching strategy (spec 016).
 *
 * Refuses (exit 2, reason on stderr for Claude) when Claude would:
 *   - create or rename a branch to an invalid or placeholder name (git, the
 *     GitHub MCP tools, or gh api);
 *   - commit on, or push to, an invalid branch, the chore/session-* placeholder,
 *     a detached HEAD, or a protected branch (main / LS_BASE_BRANCH), with two
 *     exceptions: docs-only changes on the base branch (never main), and
 *     existing branches that are the head of an open PR in this repository;
 *   - write files through the GitHub MCP tools or gh api under the same rules;
 *   - open a PR from an invalid head, or into main from anything other than
 *     release/* or hotfix/* (MCP, gh pr create or gh api);
 *   - change, move or delete the guard's own files or any settings file that
 *     can switch hooks off.
 *
 * Validation reuses lib/validate-branch-name.js (the same rules CI applies).
 * LS_ENFORCE_BRANCH_NAMES=0 in the environment the session started with
 * downgrades refusals to warnings. If the guard itself fails while enforcing,
 * git and GitHub writes are refused and everything else is allowed with a
 * warning (FR-012a).
 * See docs/BRANCHING_STRATEGY.md and docs/CLAUDE_CLOUD_ENVIRONMENT.md.
 */

import { execFileSync } from 'child_process';
import { existsSync, readFileSync, realpathSync } from 'fs';
import path from 'path';

// Loaded in main() with a dynamic import, so a missing or broken validator
// reaches the fault handler instead of crashing Node (research R11).
let validateBranchName;

const BASE_BRANCH = process.env.LS_BASE_BRANCH || 'develop';
const ENFORCE = process.env.LS_ENFORCE_BRANCH_NAMES !== '0';
const PROTECTED = new Set(['main', BASE_BRANCH]);
const PLACEHOLDER = /^chore\/session-[a-z0-9]+$/;
const DOC_PREFIXES = ['.github/specs/', 'docs/'];
const OWNER = 'lightspeedwp';
const THIS_REPO = '.github';
const DETACHED = '(detached HEAD)';
const CHECK_TIMEOUT_MS = 5000;
const HOME = process.env.HOME || '';

// ── Branch names ────────────────────────────────────────────────────────────

/** Reason a branch name may not be created, or null when it is fine. */
function nameProblem(name) {
  if (!name) return null;
  if (PLACEHOLDER.test(name)) {
    return `'${name}' is the session placeholder, not a real branch name`;
  }
  const result = validateBranchName(name);
  if (result.valid) return null;
  // Only suggest a name that would itself pass (FR-011).
  const suggestion = result.suggested_name;
  const hint =
    suggestion && validateBranchName(suggestion).valid ? ` (did you mean '${suggestion}'?)` : '';
  return `'${name}' does not match {type}/{scope}-{title}: ${result.errors.join(', ')}${hint}`;
}

/** Strip an `owner:` prefix from a PR head such as `someone:feat/x-y`. */
function headBranch(head) {
  return (head || '').includes(':') ? head.split(':').pop() : head || '';
}

// ── Git helpers ─────────────────────────────────────────────────────────────

function run(cmd, args, cwd, timeout = CHECK_TIMEOUT_MS) {
  try {
    return execFileSync(cmd, args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout,
    });
  } catch {
    return null;
  }
}

/**
 * The branch commits land on. During a rebase that is the branch being
 * rebased; with a detached HEAD and no rebase, merge, cherry-pick or revert in
 * progress it is DETACHED; outside a repository it is ''.
 */
function currentBranch(cwd) {
  const name = (run('git', ['branch', '--show-current'], cwd) ?? '').trim();
  if (name) return name;
  const gitDir = (run('git', ['rev-parse', '--absolute-git-dir'], cwd) ?? '').trim();
  if (!gitDir) return '';
  for (const dir of ['rebase-merge', 'rebase-apply']) {
    const file = path.join(gitDir, dir, 'head-name');
    if (existsSync(file))
      return readFileSync(file, 'utf8')
        .trim()
        .replace(/^refs\/heads\//, '');
  }
  for (const marker of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD']) {
    if (existsSync(path.join(gitDir, marker))) return '';
  }
  return DETACHED;
}

function lines(output) {
  return output === null ? null : output.split('\n').filter(Boolean);
}

/** Paths from `git status --porcelain`, following renames. */
function statusPaths(cwd) {
  const out = lines(run('git', ['status', '--porcelain'], cwd));
  return out && out.map((line) => line.slice(3).split(' -> ').pop());
}

/** `owner/repo` of a remote, parsed from its URL, or null. */
function remoteRepo(cwd, remote = 'origin') {
  const url = (run('git', ['remote', 'get-url', remote], cwd) ?? '').trim();
  const match = url.match(/[/:]([^/:]+)\/([^/]+?)(?:\.git)?\/?$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

// ── Exceptions ──────────────────────────────────────────────────────────────

/**
 * Files outside the documentation exception, or null when every path is
 * covered. An empty or unknown set is never covered (FR-005, research R4).
 */
function undocumentedFiles(paths, root) {
  if (!paths || paths.length === 0) return ['(no changed files could be determined)'];
  const outside = paths.filter((file) => {
    const relative = normaliseRepoPath(file, root);
    return !relative || !DOC_PREFIXES.some((prefix) => relative.startsWith(prefix));
  });
  return outside.length ? outside : null;
}

/** Repository-relative, normalised path, or null when it leaves the repository. */
function normaliseRepoPath(file, root) {
  const absolute = resolveLoose(path.resolve(root, file));
  const base = resolveLoose(root);
  const relative = path.relative(base, absolute).split(path.sep).join('/');
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : null;
}

/**
 * The legacy PR exception: the branch exists on GitHub and is the head of an
 * open PR in this repository. Any error, empty result or timeout means "not
 * verified" (FR-006, research R9). Runs only on the refusal path.
 */
function hasOpenPr(branch, { cwd, remote = 'origin', repo = null }) {
  if (!branch) return false;
  if (!repo && run('git', ['ls-remote', '--exit-code', '--heads', remote, branch], cwd) === null) {
    return false;
  }
  const args = ['pr', 'list', '--head', branch, '--state', 'open'];
  if (repo) args.push('--repo', repo);
  args.push('--json', 'number,isCrossRepository', '--limit', '1');
  const out = run('gh', args, cwd);
  try {
    const prs = JSON.parse(out);
    return Array.isArray(prs) && prs.some((pr) => pr && pr.isCrossRepository === false);
  } catch {
    return false;
  }
}

/**
 * Reason a commit, push or file write to `branch` is refused, or null.
 * `paths()` lists the affected files (called only for the base branch);
 * `legacy()` runs the open-PR check (called only for a non-compliant branch).
 */
function writeProblem(branch, { paths, root, legacy }) {
  if (!branch) return null;
  if (branch === DETACHED) {
    return 'HEAD is detached and no rebase, merge, cherry-pick or revert is in progress; check out a named branch first';
  }
  if (branch === 'main')
    return `'main' is protected and has no exception; work on a feature branch and open a PR`;
  if (branch === BASE_BRANCH) {
    const outside = undocumentedFiles(paths(), typeof root === 'function' ? root() : root);
    if (!outside) return null;
    return `'${branch}' is protected; only changes under ${DOC_PREFIXES.join(' or ')} may go there directly. Needs a feature branch: ${outside.join(', ')}`;
  }
  if (PLACEHOLDER.test(branch)) return nameProblem(branch);
  const problem = nameProblem(branch);
  if (problem && legacy()) return null;
  return problem;
}

/** Reason a PR may not be opened, as a list. */
function prProblems({ owner, repo, head, base }) {
  if ((owner || '').toLowerCase() !== OWNER) return [];
  const problems = [];
  const branch = headBranch(head);
  const problem = nameProblem(branch);
  if (problem) problems.push(`PR blocked: head ${problem}.`);
  if (
    (repo || '').toLowerCase() === THIS_REPO &&
    base === 'main' &&
    !/^(release|hotfix)\//.test(branch)
  ) {
    problems.push(
      `PR blocked: only release/* and hotfix/* target main; use base '${BASE_BRANCH}'.`
    );
  }
  return problems;
}

// ── Guard files (FR-013a) ───────────────────────────────────────────────────

/** Resolve symlinks for the longest existing prefix of `target`. */
function resolveLoose(target) {
  let existing = target;
  const rest = [];
  while (!existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) return target;
    rest.unshift(path.basename(existing));
    existing = parent;
  }
  try {
    return path.join(realpathSync(existing), ...rest);
  } catch {
    return target;
  }
}

function projectDir(cwd) {
  return process.env.CLAUDE_PROJECT_DIR || cwd || process.cwd();
}

function protectedFiles(project) {
  const files = [
    path.join(project, '.claude', 'settings.json'),
    path.join(project, '.claude', 'settings.local.json'),
    '/etc/claude-code/managed-settings.json',
  ];
  if (HOME) files.push(path.join(HOME, '.claude', 'settings.json'));
  return {
    hooksDir: resolveLoose(path.join(project, '.claude', 'hooks')),
    files: files.map(resolveLoose),
  };
}

function expandHome(file) {
  if (!HOME) return file;
  return file.replace(/^~(?=\/|$)/, HOME).replace(/^\$\{?HOME\}?(?=\/|$)/, HOME);
}

/** Absolute, symlink-resolved path for a tool or shell argument. */
function resolvePath(file, cwd) {
  return resolveLoose(path.resolve(cwd, expandHome(file)));
}

function isGuardFile(resolved, guard) {
  return (
    resolved === guard.hooksDir ||
    resolved.startsWith(guard.hooksDir + path.sep) ||
    guard.files.includes(resolved)
  );
}

/** True when deleting or moving `resolved` would take a guard file with it. */
function containsGuardFile(resolved, guard) {
  const inside = (target) => target.startsWith(resolved + path.sep);
  return inside(guard.hooksDir) || guard.files.some(inside);
}

function guardFileProblem(file) {
  return `Edit blocked: '${file}' is a branch-guard file and can't be changed while enforcement is on.`;
}

/** Problems for Edit, Write, MultiEdit and NotebookEdit. */
function checkEdit(toolInput, cwd) {
  const file = toolInput.file_path || toolInput.notebook_path;
  if (!file) return [];
  const project = projectDir(cwd);
  return isGuardFile(resolvePath(file, project), protectedFiles(project))
    ? [guardFileProblem(file)]
    : [];
}

// ── Shell parsing ───────────────────────────────────────────────────────────

const HEREDOC = /<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\1\b/g;

/**
 * Split a command into segments of words and redirections. Quoted text stays
 * inside a word, so commit messages never look like commands (FR-012), while
 * operators outside quotes are still seen.
 */
function parseShell(command) {
  const src = command.replace(HEREDOC, ' ');
  const segments = [[]];
  let word = null;
  const extend = (text) => {
    word = word || { text: '' };
    word.text += text;
  };
  const end = () => {
    if (word) segments.at(-1).push(word);
    word = null;
  };
  const split = () => {
    end();
    segments.push([]);
  };

  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (c === "'") {
      const close = src.indexOf("'", i + 1);
      const stop = close === -1 ? src.length : close;
      extend(src.slice(i + 1, stop));
      i = stop;
    } else if (c === '"') {
      let j = i + 1;
      let text = '';
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\\' && j + 1 < src.length) {
          text += src[j + 1];
          j += 2;
        } else {
          text += src[j];
          j += 1;
        }
      }
      extend(text);
      i = j;
    } else if (c === '\\' && i + 1 < src.length) {
      extend(src[i + 1]);
      i += 1;
    } else if (c === '\n' || c === ';' || c === '|' || c === '&') {
      if (c === '&' && src[i - 1] === '>') continue; // `>&2` is a redirection
      if ((c === '|' || c === '&') && src[i + 1] === c) i += 1;
      split();
    } else if (c === '>') {
      // A leading digit is a file descriptor (`2>`), not part of a word.
      if (word && /^\d+$/.test(word.text)) word = null;
      end();
      const append = src[i + 1] === '>';
      if (append) i += 1;
      if (src[i + 1] === '&') {
        i += 1;
        while (/\d|-/.test(src[i + 1] || '')) i += 1;
        continue;
      }
      segments.at(-1).push({ redirect: true });
    } else if (c === '<') {
      end();
    } else if (/\s/.test(c)) {
      end();
    } else {
      extend(c);
    }
  }
  end();

  return segments
    .map((tokens) => {
      const words = [];
      const writes = [];
      for (let i = 0; i < tokens.length; i += 1) {
        if (tokens[i].redirect) {
          if (tokens[i + 1] && !tokens[i + 1].redirect) writes.push(tokens[i + 1].text);
          i += 1;
        } else {
          words.push(tokens[i].text);
        }
      }
      return { words, writes };
    })
    .filter((segment) => segment.words.length || segment.writes.length);
}

// `git branch` flags that list, delete or configure rather than create a branch.
const BRANCH_QUERY_FLAGS = new Set([
  '-d',
  '-D',
  '--delete',
  '-l',
  '--list',
  '-a',
  '--all',
  '-r',
  '--remotes',
  '--show-current',
  '-v',
  '-vv',
  '--verbose',
  '--contains',
  '--no-contains',
  '--merged',
  '--no-merged',
  '--points-at',
  '--sort',
  '--format',
  '-u',
  '--set-upstream-to',
  '--unset-upstream',
  '--edit-description',
  '--column',
  '--no-column',
]);

const WRAPPERS = new Set(['sudo', 'env', 'command', 'time', 'nohup', 'exec', 'xargs']);

/** The command word and its arguments, skipping assignments and wrappers. */
function commandOf(words) {
  let i = 0;
  while (
    i < words.length &&
    (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[i]) || WRAPPERS.has(words[i]))
  ) {
    i += 1;
  }
  const name = words[i] ? path.basename(words[i]) : '';
  return { name, args: words.slice(i + 1) };
}

/** Value of `--flag value`, `--flag=value` or `-f value`. */
function flagValue(args, names) {
  for (let i = 0; i < args.length; i += 1) {
    for (const name of names) {
      if (args[i] === name) return args[i + 1];
      if (name.startsWith('--') && args[i].startsWith(`${name}=`))
        return args[i].slice(name.length + 1);
    }
  }
  return undefined;
}

// `gh api` flags that take a value, so the value isn't mistaken for the endpoint.
const API_VALUE_FLAGS = new Set([
  '-X',
  '--method',
  '-f',
  '-F',
  '--field',
  '--raw-field',
  '-H',
  '--header',
  '--input',
  '-q',
  '--jq',
  '-t',
  '--template',
  '--hostname',
  '--cache',
  '-p',
  '--preview',
]);

/** The endpoint argument of a `gh api` call. */
function apiEndpoint(args) {
  for (let i = 1; i < args.length; i += 1) {
    if (API_VALUE_FLAGS.has(args[i])) i += 1;
    else if (!args[i].startsWith('-')) return args[i];
  }
  return '';
}

/** `-f key=value` fields of a `gh api` call. */
function apiFields(args) {
  const fields = {};
  for (let i = 0; i < args.length; i += 1) {
    if (['-f', '-F', '--field', '--raw-field'].includes(args[i]) && args[i + 1]) {
      const [key, ...value] = args[i + 1].split('=');
      fields[key] = value.join('=');
      i += 1;
    }
  }
  return fields;
}

const SHORT_WRITE_VERBS = new Set([
  'rm',
  'mv',
  'tee',
  'truncate',
  'chmod',
  'chown',
  'unlink',
  'shred',
]);
const DESTINATION_VERBS = new Set(['cp', 'ln', 'install', 'rsync']);

/** Guard files that a shell segment would change, move or delete. */
function shellGuardWrites({ words, writes }, cwd, guard) {
  const { name, args } = commandOf(words);
  const operands = args.filter((arg) => !arg.startsWith('-'));
  const targets = [...writes];
  const destructive = [];

  if (SHORT_WRITE_VERBS.has(name)) {
    targets.push(...operands);
    if (name === 'rm' || name === 'mv') destructive.push(...operands);
  } else if (DESTINATION_VERBS.has(name) && operands.length) {
    targets.push(operands.at(-1));
  } else if (
    (name === 'sed' || name === 'perl') &&
    args.some((arg) => /^(-i|--in-place)/.test(arg) || /^-[a-z]*i/.test(arg))
  ) {
    targets.push(...operands);
  } else if (name === 'dd') {
    targets.push(...args.filter((arg) => arg.startsWith('of=')).map((arg) => arg.slice(3)));
  } else if (name === 'git') {
    const sub = args.find((arg) => !arg.startsWith('-'));
    const rest = args.slice(args.indexOf(sub) + 1);
    if (['restore', 'rm', 'mv', 'apply'].includes(sub))
      targets.push(...rest.filter((a) => !a.startsWith('-')));
    if (sub === 'checkout' && rest.includes('--'))
      targets.push(...rest.slice(rest.indexOf('--') + 1));
  }

  const hits = targets.filter((file) => isGuardFile(resolvePath(file, cwd), guard));
  hits.push(...destructive.filter((file) => containsGuardFile(resolvePath(file, cwd), guard)));
  return [...new Set(hits)];
}

// ── Bash ────────────────────────────────────────────────────────────────────

/** Problems found in a Bash command, in order. */
function checkBash(command, cwd) {
  const problems = [];
  const project = projectDir(cwd);
  const guard = protectedFiles(project);
  let branch = currentBranch(cwd);
  let gitCwd = cwd;
  const added = [];

  for (const segment of parseShell(command)) {
    for (const file of shellGuardWrites(segment, cwd, guard)) problems.push(guardFileProblem(file));

    const { name, args } = commandOf(segment.words);
    if (name === 'gh') {
      problems.push(...checkGh(args, gitCwd, branch));
      continue;
    }
    if (name !== 'git') continue;

    // Skip git's global options: -C <path>, -c <k=v>, --no-pager, etc.
    let i = 0;
    while (i < args.length && args[i].startsWith('-')) {
      if (args[i] === '-C' && args[i + 1]) {
        gitCwd = path.resolve(cwd, args[i + 1]);
        branch = currentBranch(gitCwd) || branch;
      }
      i += ['-C', '-c'].includes(args[i]) ? 2 : 1;
    }
    const sub = args[i];
    const rest = args.slice(i + 1);
    const positional = rest.filter((arg) => !arg.startsWith('-'));
    const root = () =>
      (run('git', ['rev-parse', '--show-toplevel'], gitCwd) ?? '').trim() || project;
    const legacy = (target, remote) => () => hasOpenPr(target, { cwd: gitCwd, remote });

    if (sub === 'branch' && rest.some((arg) => ['-m', '-M', '--move'].includes(arg))) {
      const target = positional.at(-1);
      const problem =
        nameProblem(target) || (PROTECTED.has(target) ? `'${target}' is protected` : null);
      if (problem) problems.push(`Rename blocked: ${problem}.`);
      else branch = target;
    } else if (
      (sub === 'checkout' || sub === 'switch') &&
      rest.some((arg) => ['-b', '-B', '-c', '-C', '--create', '--force-create'].includes(arg))
    ) {
      const flag = rest.findIndex((arg) =>
        ['-b', '-B', '-c', '-C', '--create', '--force-create'].includes(arg)
      );
      const target = rest[flag + 1];
      const problem = nameProblem(target);
      if (problem) problems.push(`Branch creation blocked: ${problem}.`);
      else branch = target;
    } else if (
      sub === 'branch' &&
      positional.length >= 1 &&
      !rest.some((a) => BRANCH_QUERY_FLAGS.has(a.split('=')[0]))
    ) {
      // `git branch <name>`, `-f <name>` and `-c/-C <old> <new>` create or reset a branch.
      const copy = rest.some((arg) => ['-c', '-C', '--copy'].includes(arg));
      const problem = nameProblem(copy ? positional.at(-1) : positional[0]);
      if (problem) problems.push(`Branch creation blocked: ${problem}.`);
    } else if (
      (sub === 'checkout' || sub === 'switch') &&
      positional.length === 1 &&
      !rest.includes('--')
    ) {
      branch = positional[0];
    } else if (sub === 'add') {
      if (rest.some((arg) => ['-A', '--all', '.', ':/'].includes(arg))) {
        added.push(...(statusPaths(gitCwd) ?? []));
      } else {
        added.push(...positional);
      }
    } else if (sub === 'commit') {
      const all = rest.some((arg) => arg === '--all' || /^-[a-zA-Z]*a/.test(arg));
      const paths = () => {
        const staged = lines(run('git', ['diff', '--cached', '--name-only'], gitCwd));
        if (staged === null) return null;
        const tracked = all ? (lines(run('git', ['diff', '--name-only'], gitCwd)) ?? []) : [];
        return [...new Set([...staged, ...tracked, ...added])];
      };
      const problem = writeProblem(branch, { paths, root, legacy: legacy(branch, 'origin') });
      if (problem) problems.push(`Commit blocked: ${problem}.`);
    } else if (sub === 'push') {
      if (rest.some((arg) => ['-d', '--delete', '--tags'].includes(arg))) continue;
      const remote = positional[0] || 'origin';
      const refspec = positional[1];
      const [source, destination] = refspec ? refspec.replace(/^\+/, '').split(':') : [];
      let target = (destination ?? source ?? branch).replace(/^refs\/heads\//, '');
      if (target === 'HEAD') target = branch;
      if (destination === '') continue; // `git push origin :branch` deletes it
      const from = source && source !== 'HEAD' ? source : 'HEAD';
      const paths = () =>
        lines(run('git', ['diff', '--name-only', `${remote}/${target}...${from}`], gitCwd));
      const problem = writeProblem(target, { paths, root, legacy: legacy(target, remote) });
      if (problem) problems.push(`Push blocked: ${problem}.`);
    }
  }
  return problems;
}

// ── GitHub (MCP tools and the gh CLI) ───────────────────────────────────────

function fileWriteProblem({ owner, repo, branch, paths, root }) {
  if ((owner || '').toLowerCase() !== OWNER) return null;
  const legacy = () => hasOpenPr(branch, { repo: `${owner}/${repo}` });
  return writeProblem(branch, { paths: () => paths, root, legacy });
}

/** Problems found in a GitHub MCP tool call. */
function checkGitHub(tool, input, cwd) {
  if ((input.owner || '').toLowerCase() !== OWNER) return [];
  const root = projectDir(cwd);

  if (tool.endsWith('__create_branch')) {
    const problem = nameProblem(input.branch);
    return problem ? [`Branch creation blocked: ${problem}.`] : [];
  }
  if (/__(push_files|create_or_update_file|delete_file)$/.test(tool)) {
    const paths = Array.isArray(input.files)
      ? input.files.map((file) => file && file.path).filter(Boolean)
      : [input.path].filter(Boolean);
    const problem = fileWriteProblem({ ...input, branch: input.branch, paths, root });
    return problem ? [`Write blocked: ${problem}.`] : [];
  }
  if (tool.endsWith('__create_pull_request')) return prProblems(input);
  return [];
}

/** Problems found in a `gh` command (FR-008, FR-009). */
function checkGh(args, cwd, branch) {
  const repoFlag = flagValue(args, ['--repo', '-R']);
  const [owner, repo] = repoFlag
    ? repoFlag.split('/')
    : Object.values(remoteRepo(cwd) || { owner: '', repo: '' });
  const root = projectDir(cwd);

  if (args[0] === 'pr' && args[1] === 'create') {
    const head = flagValue(args, ['--head', '-H']) || branch;
    const base = flagValue(args, ['--base', '-B']);
    return prProblems({ owner, repo, head, base });
  }
  if (args[0] !== 'api') return [];

  const fields = apiFields(args);
  const method = (
    flagValue(args, ['--method', '-X']) ||
    (Object.keys(fields).length || args.includes('--input') ? 'POST' : 'GET')
  ).toUpperCase();
  if (method === 'GET') return [];
  const endpoint = apiEndpoint(args)
    .replace(/^\//, '')
    .replace('{owner}', owner)
    .replace('{repo}', repo);
  const match = endpoint.match(/^repos\/([^/]+)\/([^/]+)\/(.*)$/);
  if (!match) return [];
  const [, apiOwner, apiRepo, resource] = match;
  if (apiOwner.toLowerCase() !== OWNER) return [];

  if (/^pulls\/?$/.test(resource) && method === 'POST') {
    return prProblems({ owner: apiOwner, repo: apiRepo, head: fields.head, base: fields.base });
  }
  if (/^git\/refs\/?$/.test(resource) && method === 'POST') {
    const problem = nameProblem((fields.ref || '').replace(/^refs\/heads\//, ''));
    return problem ? [`Branch creation blocked: ${problem}.`] : [];
  }
  const ref = resource.match(/^git\/refs\/heads\/(.+)$/);
  if (ref && method !== 'DELETE') {
    const problem = fileWriteProblem({
      owner: apiOwner,
      repo: apiRepo,
      branch: ref[1],
      paths: null,
      root,
    });
    return problem ? [`Write blocked: ${problem}.`] : [];
  }
  const contents = resource.match(/^contents\/(.+)$/);
  if (contents && ['PUT', 'DELETE'].includes(method)) {
    // Without a branch field, GitHub writes to the default branch.
    const target = fields.branch || BASE_BRANCH;
    const problem = fileWriteProblem({
      owner: apiOwner,
      repo: apiRepo,
      branch: target,
      paths: [contents[1]],
      root,
    });
    return problem ? [`Write blocked: ${problem}.`] : [];
  }
  return [];
}

// ── Decision ────────────────────────────────────────────────────────────────

/**
 * Load the validator. With NODE_ENV=test, LS_GUARD_FORCE_FAULT=1 makes the load
 * fail so tests can exercise the fault handler. It can only cause a fault; it
 * can never load a different validator.
 */
async function loadValidator() {
  if (process.env.NODE_ENV === 'test' && process.env.LS_GUARD_FORCE_FAULT === '1') {
    throw new Error('validator load forced to fail (LS_GUARD_FORCE_FAULT)');
  }
  ({ validateBranchName } = await import('../../lib/validate-branch-name.js'));
}

/** Refusal text for a list of problems (FR-011, SC-007). */
function refusalMessage(problems) {
  return [
    'Branch guard: this action breaks the LightSpeed branching strategy.',
    ...problems,
    '',
    'LightSpeed branching strategy: {type}/{scope}-{title}, based on ' + BASE_BRANCH + '.',
    'Fix: git branch -m <type>/<scope>-<title>  (e.g. feat/issue-triage-labels)',
    '     npm run validate:branch-name -- --current',
    'This repository rule overrides any claude/* branch named by the platform.',
    'See docs/BRANCHING_STRATEGY.md.',
  ].join('\n');
}

const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);

/** Evaluate one tool call and exit with the decision. */
async function main(input) {
  await loadValidator();

  const tool = input.tool_name || '';
  const toolInput = input.tool_input || {};
  const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || '.';
  let problems = [];
  if (tool === 'Bash') problems = checkBash(toolInput.command || '', cwd);
  else if (EDIT_TOOLS.has(tool)) problems = checkEdit(toolInput, cwd);
  else if (tool.startsWith('mcp__github__')) problems = checkGitHub(tool, toolInput, cwd);

  if (problems.length === 0) process.exit(0);

  if (ENFORCE) {
    process.stderr.write(refusalMessage(problems) + '\n');
    process.exit(2);
  }
  process.stdout.write(
    JSON.stringify({ systemMessage: `Branch guard (warning only): ${problems.join(' ')}` })
  );
  process.exit(0);
}

const GIT_WRITE = [
  /\bgit\b[^|;&]*\b(commit|push)\b/,
  /\bgit\b[^|;&]*\bbranch\b[^|;&]*\s(-[mMdDf]|--move|--delete|--force)\b/,
  /\bgit\b[^|;&]*\bcheckout\b[^|;&]*\s-[bB]\b/,
  /\bgit\b[^|;&]*\bswitch\b[^|;&]*\s(-[cC]|--create|--force-create)\b/,
  /\bgh\s+pr\s+create\b/,
  /\bgh\s+api\b[^|;&]*\s(-X|--method|-f|-F|--field|--raw-field|--input)\b/,
];

/** Whether a call is a git or GitHub write, judged without the validator. */
function isWrite(input) {
  const tool = input.tool_name || '';
  if (tool.startsWith('mcp__github__')) return true;
  if (tool !== 'Bash') return false;
  const command = String((input.tool_input || {}).command || '');
  return GIT_WRITE.some((pattern) => pattern.test(command));
}

/**
 * The guard could not evaluate the call because of its own fault (FR-012a).
 * While enforcing, git and GitHub writes are refused; everything else is
 * allowed with a warning. With enforcement off, the write proceeds with a
 * warning (FR-013).
 */
function handleFault(input, error) {
  const reason = error && error.message ? error.message : String(error);
  const unavailable = `Branch guard unavailable: ${reason}. Open an issue on lightspeedwp/.github`;
  let write = true;
  try {
    write = isWrite(input);
  } catch {
    // Classification failed too: treat the call as a write.
  }
  if (ENFORCE && write) {
    process.stderr.write(unavailable + '\n');
    process.exit(2);
  }
  const prefix = ENFORCE ? '' : 'Branch guard (warning only): ';
  process.stdout.write(JSON.stringify({ systemMessage: `${prefix}${unavailable}` }));
  process.exit(0);
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // Never break the session on malformed hook input.
}
if (!input || typeof input !== 'object') process.exit(0);

try {
  await main(input);
} catch (error) {
  handleFault(input, error);
}
