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
import { existsSync, readFileSync, realpathSync, statSync } from 'fs';
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
  // An empty branch means the guard could not work out where the write lands, on
  // a detached HEAD or in a repository it could not read. Treating that as valid
  // skipped validation entirely, so it is refused instead of passed through.
  if (!branch) {
    return 'the current branch could not be determined, so this write cannot be checked; check out a named branch and retry';
  }
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
  if (file === UNRESOLVABLE) {
    return "Edit blocked: this command changes directory to a path the guard can't resolve, so a guard-file write cannot be ruled out";
  }
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

// Keep the rest of the opening line (redirects, pipes, `&&`); drop only the body.
const HEREDOC = /<<-?\s*['"]?(\w+)['"]?([^\n]*)\n[\s\S]*?\n\t*\1(?=\n|$)/g;

/**
 * Split a command into segments of words and redirections. Quoted text stays
 * inside a word, so commit messages never look like commands (FR-012), while
 * operators outside quotes are still seen.
 */
function parseShell(command) {
  const src = command.replace(HEREDOC, (_match, _tag, rest) => ` ${rest}`);
  const segments = [[]];
  // Index of the first segment of the current list, so a trailing `&` marks only
  // the list it backgrounds rather than every earlier command.
  let listStart = 0;
  // Every stage of a pipeline runs in a subshell, so the stage after a `|` needs
  // marking too, and that segment is only created on the next split.
  let pendingSubshell = false;
  // Depth of parenthesised groups, whose commands all run in a subshell.
  let parenDepth = 0;
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
    // Inside a parenthesised group both the segment being closed and the next
    // one run in the subshell, so a `cd` in either cannot move the parent.
    if (parenDepth > 0) {
      const closing = segments.at(-1);
      if (closing) closing.subshell = true;
    }
    const next = [];
    if (pendingSubshell || parenDepth > 0) next.subshell = true;
    segments.push(next);
    // Only the segment that follows a pipeline is marked by a pending flag; a
    // later list boundary must not inherit it.
    pendingSubshell = false;
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
    } else if (c === ')' && parenDepth === 0) {
      // A `)` outside parentheses closes a case-arm pattern, so the arm's
      // command starts here: `case x in p) rm <guard file>;; esac` would
      // otherwise hide the rm behind the pattern.
      split();
    } else if (c === '(') {
      // A parenthesised group is a subshell, so a `cd` inside it does not move
      // the directory the rest of the command runs in.
      parenDepth += 1;
      end();
    } else if (c === ')' && parenDepth > 0) {
      parenDepth -= 1;
      end();
      // `(cd /)` has no separator inside it, so split() never ran for the group
      // and the segment holding the cd was never marked. Mark it here.
      const group = segments.at(-1);
      if (group) group.subshell = true;
    } else if (c === '\n' || c === ';' || c === '|' || c === '&') {
      if (c === '&' && src[i - 1] === '>') continue; // `>&2` is a redirection
      const doubled = src[i + 1] === c;
      // A single `|` or `&` starts a pipeline stage or a background command,
      // either of which runs in a subshell, so a `cd` there leaves the parent
      // shell where it was. `&&` and `||` are lists: both sides run in the
      // current shell, so they must not be marked.
      //
      // A shell running with `shopt -s lastpipe` keeps the final stage in the
      // current shell, which would make this over-block rather than under-block.
      // The command string is run by the caller's shell, whose options the guard
      // cannot see, so the default behaviour is assumed: that is the direction
      // that fails closed.
      if (!doubled && (c === '|' || c === '&')) {
        // A single `&` backgrounds the whole list it terminates, not just the last
        // command in it: `cd /tmp && rm x &` runs the entire and-list in a
        // subshell, so the parent shell's directory never changed. Every segment
        // back to the start of that list is therefore in the subshell.
        if (c === '&') {
          for (let n = listStart; n < segments.length; n += 1) segments[n].subshell = true;
        } else {
          // Mark this stage and the next one: every stage of a pipeline runs in a
          // subshell, not only the one before the pipe.
          const last = segments.at(-1);
          if (last) last.subshell = true;
          pendingSubshell = true;
        }
      }
      if (doubled) i += 1;
      // A `;` or newline starts a new list, which is the boundary a following `&`
      // does not cross.
      if (c === ';' || c === '\n') listStart = segments.length;
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
      // The flag is set on the raw token list itself, not on a token.
      const subshell = tokens.subshell === true;
      for (let i = 0; i < tokens.length; i += 1) {
        if (tokens[i].redirect) {
          if (tokens[i + 1] && !tokens[i + 1].redirect) writes.push(tokens[i + 1].text);
          i += 1;
        } else {
          words.push(tokens[i].text);
        }
      }
      // Every property the consumers read has to be carried through here. The
      // subshell flag was set on the raw segment and dropped by this map, which
      // left `segment.subshell` undefined and let a pipeline or background `cd`
      // move the tracked directory.
      return { words, writes, subshell };
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

/**
 * Shell keywords that can appear where a command word is expected. In a
 * compound command the first word after a separator is often one of these, and
 * treating it as the command meant the real command was never examined, so
 * `if true; then rm <guard file>; fi` passed.
 */
const SHELL_KEYWORDS = new Set([
  'if', 'then', 'else', 'elif', 'fi',
  'while', 'until', 'do', 'done',
  'case', 'esac', 'select',
  'for', 'in', 'function',
  '{', '}', '[[', ']]', '!',
]);

/** Leading grouping punctuation, as in `(rm file)`. */
const GROUPING_LEAD = /^[({\[]+/;
/** A word that is nothing but grouping punctuation, such as `{`. */
const GROUPING_ONLY = /^[({\[]+[)\]}]*$/;

/** The command word and its arguments, skipping leading shell syntax. */
function commandOf(words) {
  let i = 0;
  while (
    i < words.length &&
    (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[i]) ||
      WRAPPERS.has(words[i]) ||
      SHELL_KEYWORDS.has(words[i]) ||
      GROUPING_ONLY.test(words[i]))
  ) {
    // A wrapper takes arguments before the command, so it is skipped but the
    // scan continues; a keyword or grouping token is not a command at all.
    i += 1;
  }
  const raw = words[i] ? words[i] : '';
  const name = raw ? path.basename(raw.replace(GROUPING_LEAD, '')) : '';
  return { name, args: words.slice(i + 1) };
}

/** Value of `--flag value`, `--flag=value` or `-f value`. */
function flagValue(args, names) {
  for (let i = 0; i < args.length; i += 1) {
    for (const name of names) {
      if (args[i] === name) return args[i + 1];
      if (name.startsWith('--') && args[i].startsWith(`${name}=`))
        return args[i].slice(name.length + 1);
      // A short flag also accepts its value attached, so `-XPUT` names the same
      // method as `-X PUT`. Missing it made such a call look like a read.
      if (!name.startsWith('--') && args[i].startsWith(name) && args[i].length > name.length) {
        return args[i].slice(name.length);
      }
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

/**
 * Each field flag with its `key=value` argument, for both `--flag value` and
 * the attached `--flag=value` form gh also accepts.
 */
function fieldArgs(args) {
  const pairs = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (FIELD_FLAGS.has(arg)) {
      if (args[i + 1] !== undefined) pairs.push([arg, args[i + 1]]);
      i += 1;
      continue;
    }
    for (const flag of FIELD_FLAGS) {
      if (arg.startsWith(`${flag}=`)) {
        pairs.push([flag, arg.slice(flag.length + 1)]);
        break;
      }
    }
  }
  return pairs;
}

// gh reads an `@path` value for the typed flag (-F/--field) and sends the value
// as written for the string flag (-f/--raw-field), so an @path there is a
// literal branch name and is judged as one. Verified against the installed
// `gh api --help`, where --field is the typed flag and --raw-field the string
// one.
const FILE_FIELD_FLAGS = new Set(['-F', '--field']);
const FIELD_FLAGS = new Set(['-f', '-F', '--field', '--raw-field']);

  function apiFields(args, cwd) {
    const fields = {};
    for (const [flag, argument] of fieldArgs(args)) {
      const [key, ...rest] = argument.split('=');
      const value = resolveFieldValue(rest.join('='), cwd, flag);
      if (value !== null) fields[key] = value;
    }
    // A write sent as `--input body.json` carries its branch there, not in -f.
    const body = readBody(inputArg(args), cwd);
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === 'string' && !(key in fields)) fields[key] = value;
      }
    }
    return fields;
  }

  /**
   * The value gh would send for a field, or null when it cannot be determined.
   * `gh` reads `@file` as the file's contents, so the guard has to do the same
   * to know the real value; storing the literal "@file" would judge a branch
   * name the caller never sent.
   */
  function resolveFieldValue(value, cwd, flag) {
    if (!flag || !FILE_FIELD_FLAGS.has(flag) || !value.startsWith('@')) return value;
    return readInline(value.slice(1), cwd);
  }

  function readInline(file, cwd) {
    // `@-` reads standard input, which the guard has already consumed for its
    // own payload. Treat it as unreadable rather than looking for a file named
    // "-" in the working directory.
    if (file === '-') return null;
    try {
      return readFileSync(path.resolve(cwd, file), 'utf8').trim();
    } catch {
      return null;
    }
  }

  /**
   * Fields the call asked for that the guard could not read. A write whose
   * branch names cannot be read is refused, never judged on an empty value.
   */
  function unreadableApiFields(args, cwd) {
    const unreadable = [];
    for (const [flag, argument] of fieldArgs(args)) {
      const [key, ...rest] = argument.split('=');
      if (resolveFieldValue(rest.join('='), cwd, flag) === null) unreadable.push(key);
    }
    const file = inputArg(args);
    // `--input -` reads the caller's stdin, which the guard has already
    // consumed for its own payload and cannot recover.
    if (file && (file === '-' || readBody(file, cwd) === null)) {
      unreadable.push('the request body');
    }
    return unreadable;
  }

  /** The `--input` argument, for both `--input file` and `--input=file`. */
  function inputArg(args) {
    const at = args.indexOf('--input');
    if (at >= 0) return args[at + 1];
    const attached = args.find((arg) => arg.startsWith('--input='));
    return attached ? attached.slice('--input='.length) : null;
  }

  /** Parse a JSON request body from a file, or null if absent or invalid. */
  function readBody(file, cwd) {
    if (file === '-') return null;
    try {
      // Relative to the command's own working directory, not the hook's.
      return JSON.parse(readFileSync(path.resolve(cwd, file), 'utf8'));
    } catch {
      return null;
    }
  }

/**
 * The directory a `cd` segment leaves the shell in, or null when it cannot be
 * determined. `cd` with no argument goes to the home directory and `cd -` to the
 * previous one; a `cd -` with no OLDPWD cannot be tracked, and null makes the
 * guard fail closed rather than judge a relative path against a stale directory.
 */
const UNDETERMINED = null;

/**
 * Follows the shell's working directory across `cd` segments, so a relative
 * write target resolves against the directory the command is really in.
 *
 * A `cd` that cannot succeed leaves the shell where it was, so the tracked
 * directory only moves when the destination exists; otherwise `cd
 * /nonexistent && rm .claude/settings.json` would resolve against a directory
 * that does not exist and miss a protected file. `cd -` returns to the directory
 * this tracker last left, not the hook process's own OLDPWD. When a destination
 * cannot be determined at all, `known` goes false and the caller fails closed.
 */
function createCwdTracker(start) {
  let cwd = start;
  let previous = UNDETERMINED;
  let known = true;
  return {
    get cwd() {
      return cwd;
    },
    get known() {
      return known;
    },
    cd(args, subshell = false) {
      // Everything after `--` is an operand, including a dash-prefixed name, so
      // `cd -- -` is a directory literally called `-` and not the previous one.
      const separator = args.indexOf('--');
      const before = separator < 0 ? args : args.slice(0, separator);
      const after = separator < 0 ? [] : args.slice(separator + 1);
      const operands = [...after, ...before.filter((arg) => !arg.startsWith('-'))];
      let target;
      if (after.length === 0 && before.includes('-')) {
        // A lone `-` before any `--` is the shell's previous directory.
        target = previous;
      } else {
        // `cd a b` is rejected by the shell, so the directory must not move.
        if (operands.length > 1) return;
        target = operands.length === 0 ? HOME || UNDETERMINED : operands.at(-1);
      }
      // A `cd` in a pipeline stage or a background command runs in a subshell and
      // leaves the parent shell where it was.
      if (subshell) return;
      if (target === UNDETERMINED) {
        known = false;
        return;
      }
      if (/\$\{?[A-Za-z_]/.test(target)) {
        // $PWD is the one expansion worth resolving; any other variable could
        // name anything, so the destination is treated as undetermined.
        const expanded = target.replace(/^\$\{?PWD\}?/, cwd);
        if (expanded === target) {
          known = false;
          return;
        }
        target = expanded;
      }
      const destination = path.resolve(cwd, expandHome(target));
      let isDir = false;
      try {
        isDir = statSync(destination).isDirectory();
      } catch {
        isDir = false;
      }
      if (!isDir) return; // The cd fails, so the shell does not move.
      previous = cwd;
      cwd = destination;
    },
  };
}

const UNRESOLVABLE = '<unresolvable working directory>';
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

/** Trailing grouping punctuation, as the `)` left on the last word of `(rm x)`. */
const GROUPING_TRAIL = /[)\]}]+$/;

/** Whether a shell target names a guard file, with or without a trailing bracket. */
function resolvesToGuardFile(file, cwd, guard) {
  return [file, file.replace(GROUPING_TRAIL, '')].some(
    (candidate) => candidate && isGuardFile(resolvePath(candidate, cwd), guard)
  );
}

/** Whether deleting or moving a shell target would take a guard file with it. */
function resolvesIntoGuardTree(file, cwd, guard) {
  return [file, file.replace(GROUPING_TRAIL, '')].some(
    (candidate) => candidate && containsGuardFile(resolvePath(candidate, cwd), guard)
  );
}

/** Guard files that a shell segment would change, move or delete. */
function shellGuardWrites({ words, writes }, tracker, guard) {
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

  // An absolute target resolves whatever the working directory is, so it is
  // always checked. Only a relative target needs the tracked directory, and one
  // that is unknown cannot be ruled out, so the guard fails closed on those.
  if (!tracker.known && targets.some((file) => !path.isAbsolute(file))) {
    return [UNRESOLVABLE];
  }
  // `(rm .claude/settings.json)` leaves the closing bracket on the last word, so
  // the resolved path is `.claude/settings.json)` and matched nothing. The
  // unstripped form is checked too, so a file that genuinely ends in a bracket
  // is still judged on its own name and only the bracketed spelling also counts.
  const hits = targets.filter((file) => resolvesToGuardFile(file, tracker.cwd, guard));
  hits.push(...destructive.filter((file) => resolvesIntoGuardTree(file, tracker.cwd, guard)));
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
  // Relative paths resolve against the directory the shell is in by then, so a
  // leading `cd` must be followed. Without this, `cd .claude/hooks && rm
  // enforce-branch-name.mjs` resolved against the project root, matched no guard
  // file, and the self-protection was bypassed.
  const tracker = createCwdTracker(cwd);
  const added = [];

  for (const segment of parseShell(command)) {
    for (const file of shellGuardWrites(segment, tracker, guard)) problems.push(guardFileProblem(file));

    const { name, args } = commandOf(segment.words);
    if (name === 'cd') {
      tracker.cd(args, segment.subshell);
      continue;
    }
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
      if (rest.some((arg) => ['-u', '--update'].includes(arg))) {
        // `-u` stages modified tracked files only, and only under any pathspec
        // given. `git status --porcelain` would add untracked files that `-u`
        // never stages and would ignore the pathspec, so both over-block.
        added.push(...(lines(run('git', ['diff', '--name-only', 'HEAD', '--', ...positional], gitCwd)) ?? []));
      } else if (rest.some((arg) => ['-A', '--all', '.', ':/'].includes(arg))) {
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
      if (rest.some((arg) => ['-d', '--delete'].includes(arg))) continue;
      if (rest.some((arg) => ['--all', '--branches', '--mirror'].includes(arg))) {
        problems.push(
          'Push blocked: --all/--branches/--mirror push protected branches; push one branch.'
        );
        continue;
      }
      const remote = positional[0] || 'origin';
      const tagsOnly = rest.includes('--tags') && positional.length < 2;
      const refspecs = positional.length > 1 ? positional.slice(1) : tagsOnly ? [] : [undefined];
      for (const refspec of refspecs) {
        const [source, destination] = refspec ? refspec.replace(/^\+/, '').split(':') : [];
        // `git push origin :` and `+:` carry an empty source and destination and
        // match every ref, so they fan out exactly like --all does.
        if (source === '' && destination === '') {
          problems.push('Push blocked: an empty refspec pushes every ref; name a branch.');
          continue;
        }
        if (destination === '') continue; // `git push origin :branch` deletes it
        // Only branch destinations carry branch-name rules. An explicitly
        // qualified non-branch ref such as refs/tags/... is out of scope, and
        // running the branch check over it would judge a name that was never a
        // branch. A short name containing a slash is still a branch: `claude/x`
        // and `feat/y` are the normal way to write one.
        const raw = destination ?? source ?? branch;
        if (/^refs\//.test(raw) && !/^refs\/heads\//.test(raw)) continue;
        let target = raw.replace(/^refs\/heads\//, '');
        if (target === 'HEAD') target = branch;
        const from = source && source !== 'HEAD' ? source : 'HEAD';
        const paths = () =>
          lines(run('git', ['diff', '--name-only', `${remote}/${target}...${from}`], gitCwd));
        const problem = writeProblem(target, { paths, root, legacy: legacy(target, remote) });
        if (problem) problems.push(`Push blocked: ${problem}.`);
      }
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
    // With no branch the write lands on the repository's default branch, which
    // is often `main`. writeProblem treats a missing branch as uncheckable and
    // allows it, so the call would land on main having been checked against
    // nothing. Refuse rather than assume.
    if (!input.branch) {
      return ['Write blocked: name the target branch explicitly.'];
    }
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

  const fields = apiFields(args, cwd);
  const method = (
    flagValue(args, ['--method', '-X']) ||
    (Object.keys(fields).length || inputArg(args) ? 'POST' : 'GET')
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

  // A branch name the guard could not read is not a branch name it may pass
  // through: an empty head or ref reaches nameProblem as '', which is not a
  // problem, so the write would go ahead unchecked. Refuse instead.
  // An unrelated unreadable field, such as a title read from a file, says
  // nothing about the branch, so only the keys this endpoint checks are
  // considered. The request body is always relevant: it may carry them.
  const bodyUnreadable = unreadableApiFields(args, cwd).includes('the request body');
  const unreadableKey = (keys) => {
    const found = unreadableApiFields(args, cwd).filter((key) => keys.includes(key));
    return found.length ? found : null;
  };
  const refuseUnreadable = (keys, missing) => {
    if (bodyUnreadable) {
      return ['Write blocked: could not read the request body, so the target branch cannot be checked.'];
    }
    const found = unreadableKey(keys);
    if (found) {
      return [
        `Write blocked: could not read ${found.join(', ')}, so the target branch cannot be checked.`,
      ];
    }
    return missing ? [`Write blocked: name ${missing} explicitly.`] : null;
  };

  if (/^pulls\/?$/.test(resource) && method === 'POST') {
    const refusal = refuseUnreadable(
      ['head', 'base'],
      !fields.head ? 'head' : !fields.base ? 'base' : null
    );
    if (refusal) return refusal;
    return prProblems({ owner: apiOwner, repo: apiRepo, head: fields.head, base: fields.base });
  }
  // Any write method changes a branch, not only POST: an update of an existing ref
  // is just as much a branch write, and reading the method correctly is only
  // useful if every write form is checked.
  if (/^git\/refs\/?$/.test(resource) && /^(POST|PUT|PATCH)$/.test(method)) {
    const refusal = refuseUnreadable(['ref'], !fields.ref ? 'ref' : null);
    if (refusal) return refusal;
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
    // GitHub writes to the repository's default branch when no branch is given,
    // and that is often `main` rather than this repository's base branch. The
    // base branch has a documentation exception and `main` has none, so
    // assuming the base branch would check the write against the wrong branch
    // and could let it land on main. Refuse instead of guessing.
    if (!fields.branch) {
      return ['Write blocked: name the target branch explicitly.'];
    }
    const target = fields.branch;
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
 * Whether a call would change a protected guard file, judged without the
 * validator. Self-protection must hold even when the validator cannot be
 * loaded, otherwise the guard's own fault is the way around it.
 */
function isGuardFileWrite(input) {
  const tool = input.tool_name || '';
  const toolInput = input.tool_input || {};
  const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || '.';
  const project = projectDir(cwd);
  const guard = protectedFiles(project);
  if (EDIT_TOOLS.has(tool)) {
    const file = toolInput.file_path || toolInput.notebook_path;
    return Boolean(file) && isGuardFile(resolvePath(file, project), guard);
  }
  if (tool !== 'Bash') return false;
  const tracker = createCwdTracker(cwd);
  for (const segment of parseShell(String(toolInput.command || ''))) {
    if (shellGuardWrites(segment, tracker, guard).length) return true;
    const { name, args } = commandOf(segment.words);
    if (name === 'cd') tracker.cd(args, segment.subshell);
  }
  return false;
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
    // A protected guard-file write is blocking on its own account. Classifying
    // only git and GitHub writes would let an Edit or a shell command rewrite
    // the hook that is currently failing, which is precisely the case where the
    // self-protection contract must not bend.
    write = isWrite(input) || isGuardFileWrite(input);
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
