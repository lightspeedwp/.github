#!/usr/bin/env node
/**
 * PreToolUse hook: enforce the LightSpeed branching strategy (spec 018).
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
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'fs';
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

/**
 * Total time the guard may spend on the pull-request check in one invocation.
 *
 * This has to sit well below the hook timeout in .claude/settings.json, and below
 * the time every other check can take together. A hook that reaches its timeout is
 * killed, and a killed hook is treated as non-blocking, so a budget that matched
 * the timeout would fail open exactly when the budget was exhausted. The check
 * makes two network calls of at most CHECK_TIMEOUT_MS each, and it runs per
 * refspec and per commit, so without a ceiling one command could hold the guard
 * for a minute.
 *
 * The budget is a gate, not a measurement: it is consulted before the check runs
 * and cannot interrupt one in progress, so the real worst case is this plus a
 * single in-flight check.
 */
const PR_CHECK_BUDGET_MS = 5000;
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

/**
 * Owner and repository of the first remote that names both, starting with
 * `preferred`. Null when none does, which the caller treats as "not verified".
 */
function repositoryIdentity(cwd, preferred) {
  for (const name of [preferred, ...(lines(run('git', ['remote'], cwd)) ?? [])]) {
    if (!name) continue;
    // Both URLs are consulted. A clone can fetch from a local mirror and push to
    // GitHub, and a cloud session's only remote is a local proxy that names the
    // repository in its path, so neither URL alone identifies every repository the
    // guard has to ask about.
    for (const args of [
      ['remote', 'get-url', name],
      ['remote', 'get-url', '--push', name],
    ]) {
      const found = identityFromUrl((run('git', args, cwd) ?? '').trim());
      if (found) return found;
    }
  }
  return null;
}

/** Owner and repository of the named remote, or null when its URL names neither. */
/**
 * Owner and repository named by a git remote URL, or null when it names neither.
 */
function identityFromUrl(url) {
  if (!url) return null;
  // A local or self-hosted path, as a test fixture or a bare repository uses,
  // names no owner and repository. The scp-like form git writes for SSH and an
  // explicit URL are the only forms that carry one, and a path is refused rather
  // than split, since /srv/git/origin would otherwise become owner "git" and
  // repository "origin" and a request against a repository that does not exist.
  const scp = url.match(/^(?:[A-Za-z0-9._-]+@)?[^/:]+:(.+?)(?:\.git)?\/?$/);
  if (scp) {
    const parts = scp[1].split('/').filter(Boolean);
    if (parts.length === 2 && parts[0] && parts[1]) return { owner: parts[0], repo: parts[1] };
  }
  if (!/^(https?|git|ssh):\/\//.test(url)) return null;
  try {
    const parsed = new URL(url);
    // A cloud session reaches GitHub through a local proxy whose path carries the
    // repository after a `git/` prefix, and whose authority is the proxy rather than
    // github.com. Taking the repository from the path is what makes the legacy
    // pull-request exception and the gh checks work there at all: on the authority
    // alone, or on a path that has to be exactly two segments, both silently did
    // nothing in the one environment the guard exists for.
    const parts = parsed.pathname
      .replace(/^\/+/, '')
      .replace(/^git\//, '')
      .split('/')
      .map((part) => part.replace(/\.git$/, ''))
      .filter(Boolean);
    if (parts.length >= 2) return { owner: parts[parts.length - 2], repo: parts[parts.length - 1] };
  } catch {
    return null;
  }
  return null;
}

/** Owner and repository of the named remote, or null when it names neither. */
function remoteRepo(cwd, remote = 'origin') {
  return identityFromUrl((run('git', ['remote', 'get-url', remote], cwd) ?? '').trim());
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
  // Cached per branch, and the total spent here is capped. Without either, a
  // command listing several refspecs ran the two network calls once per refspec
  // and once per commit, so a push naming five branches could hold the guard for
  // fifty seconds. The answer cannot change within one invocation, and a branch
  // with no pull request is a permanent answer rather than a transient one.
  const key = `${repo || ''}|${remote}|${cwd}|${branch}`;
  if (openPrCache.has(key)) return openPrCache.get(key);
  // Past the budget the answer is "not verified", which is the direction the
  // contract already requires for a timeout: the exception does not apply.
  const left = PR_CHECK_BUDGET_MS - openPrSpent;
  if (left <= 0) return false;
  const started = Date.now();
  try {
    // Each call is capped by half of what is left, because the check makes two
    // sequential calls (ls-remote, then the API) and passing the whole remainder
    // to each let one check take twice the budget. The floor is one second: below
    // that a call cannot complete anyway, and its timeout is the answer either
    // way, so the exception simply does not apply.
    const perCall = Math.max(Math.floor(left / 2), 1000);
    const answer = checkOpenPr(branch, { cwd, remote, repo, timeout: perCall });
    openPrCache.set(key, answer);
    return answer;
  } finally {
    // Accumulated as a number rather than a Set: two checks taking the same number
    // of milliseconds are two checks, and a Set would drop the second.
    openPrSpent += Date.now() - started;
  }
}

/** Answers already looked up, keyed by repository, remote, directory and branch. */
const openPrCache = new Map();

/** Milliseconds already spent on the pull-request check in this invocation. */
let openPrSpent = 0;

function checkOpenPr(branch, { cwd, remote = 'origin', repo = null, timeout = CHECK_TIMEOUT_MS }) {
  if (
    !repo &&
    run('git', ['ls-remote', '--exit-code', '--heads', remote, branch], cwd, timeout) === null
  ) {
    return false;
  }
  // `gh api` has no --repo flag. Its flags are -X, -f, -F, -H, --input, --jq,
  // --paginate and --hostname, so passing one makes the call fail outright and the
  // exception never applies. The repository is already carried by the endpoint, so
  // an explicit `repo` needs nothing further.
  //
  // The REST endpoint, not `gh pr list`, and that is not a style choice:
  // `gh pr list` goes through GraphQL, which a cloud session cannot reach. The
  // call failed there, hasOpenPr returned false, the legacy exception never
  // applied, and every commit on an existing copilot/* PR branch was refused in
  // the one environment the guard exists for (contracts/hooks.md, research R9).
  // The identity comes from the first remote whose URL names an owner and a
  // repository. A local or self-hosted path names neither, so the lookup moves on
  // rather than asking GitHub about a repository that does not exist. Scanning
  // also covers a clone configured with both an internal mirror and the GitHub
  // remote, where only one of the two can answer the question.
  const target = repo
    ? { owner: repo.split('/')[0], repo: repo.split('/')[1] }
    : repositoryIdentity(cwd, remote);
  if (!target) return false;
  const args = [
    'api',
    '-X',
    'GET',
    `repos/${target.owner}/${target.repo}/pulls`,
    '-f',
    `head=${target.owner}:${branch}`,
    '-f',
    'state=open',
    '-f',
    'per_page=1',
  ];
  const out = run('gh', args, cwd, timeout);
  try {
    const prs = JSON.parse(out);
    if (!Array.isArray(prs) || prs.length === 0) return false;
    // The exception is for a PR whose head is in this repository. A fork's branch
    // is not, so a cross-repository PR does not qualify.
    const pr = prs[0];
    const head = pr && pr.head && pr.head.repo ? pr.head.repo.full_name : null;
    const base = pr && pr.base && pr.base.repo ? pr.base.repo.full_name : null;
    return Boolean(head && base && head === base);
  } catch {
    return false;
  }
}

/** Whether `repo` is the repository whose base-branch rules this guard enforces. */
function isThisRepo(repo) {
  // An unnamed repository cannot be shown to be another one, so it is judged by
  // this repository's stricter rules rather than waved through.
  const name = String(repo || '').toLowerCase();
  return name === '' || name === THIS_REPO;
}

/**
 * Whether `name` is protected in `repo`. `main` is protected on every LightSpeed
 * repository (FR-009); the base branch only on this one (T049).
 */
function isProtectedIn(repo, name) {
  return name === 'main' || (PROTECTED.has(name) && isThisRepo(repo));
}

/**
 * Reason a commit, push or file write to `branch` is refused, or null.
 * `paths()` lists the affected files (called only for the base branch);
 * `legacy()` runs the open-PR check (called only for a non-compliant branch).
 */
function writeProblem(branch, { paths, root, legacy, repo = THIS_REPO }) {
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
    // The base branch and its documentation exception are this repository's own
    // rules. On another LightSpeed repository only `main` is protected (FR-009), so
    // a write to the branch of the same name is an ordinary one and the exception
    // is neither needed nor judged (T049).
    if (!isThisRepo(repo)) return null;
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
/** Index of the `)` closing the `(` at `open`, or the end of the source. */
function matchingParen(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === '(') depth += 1;
    else if (src[i] === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return src.length;
}

function parseShell(command) {
  const src = command.replace(HEREDOC, (_match, _tag, rest) => ` ${rest}`);
  const segments = [[]];
  // Command substitutions found inside quotes, appended as their own segments
  // once the surrounding list is closed. Appending them inline would split the
  // list the words around them belong to, and a segment is a single command.
  const substitutions = [];
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
        } else if (src[j] === '$' && src[j + 1] === '(') {
          // A command substitution inside a double-quoted argument is a command
          // in its own right, and collapsing it into the surrounding word hides
          // it: `git commit -m "$(git rev-parse main)"` reads as one word and the
          // substitution is never examined. It is emitted as its own segment,
          // which is what makes the inner command visible to the checks below.
          const close = matchingParen(src, j + 1);
          const inner = src.slice(j + 2, close);
          // The substituted text is queued as a segment of its own so the inner
          // command is examined. It is a separate list, not a word of the
          // surrounding one: a word here is a string, and the command checks read
          // each word, so appending the parsed words to the current segment
          // would merge two unrelated commands into one.
          substitutions.push(...parseShell(inner));
          j = close + 1;
        } else {
          text += src[j];
          j += 1;
        }
      }
      if (text) extend(text);
      i = j;
    } else if ((c === '&' || c === '>') && (src[i + 1] === '>' || src[i + 1] === '|')) {
      // `&>` and `&>>` redirect both streams and `>|` overrides noclobber. The
      // `&` branch below read the ampersand as a background operator and marked
      // the rest of the list as a subshell, so the write that followed was judged
      // in the wrong place and a guard file could be overwritten through
      // `echo x &> .claude/settings.json`.
      // The target follows as its own word, exactly as the single-`>` branch below
      // does: marking the word that happens to be open would leave an attached
      // target (`&>.claude/settings.json`) inside that word, where the candidate
      // scan does not look for a write.
      const width = src[i + 1] === '>' && src[i + 2] === '>' ? 3 : 2;
      if (word && /^\d+$/.test(word.text)) word = null;
      end();
      segments.at(-1).push({ redirect: true });
      i += width - 1;
    } else if (c === '$' && src[i + 1] === '(') {
      // The unquoted form: `echo $(git push origin main)` is two commands and only
      // the outer one would otherwise be seen. Treated like the quoted and backtick
      // forms, so all three are checked the same way. The enclosing parenthesis is
      // found by matchingParen, so a group or a case pattern around the
      // substitution does not confuse where the command ends.
      const close = matchingParen(src, i + 1);
      substitutions.push(...parseShell(src.slice(i + 2, close)));
      i = close;
    } else if (c === '`') {
      // The older substitution form, outside quotes. It is a command in its own
      // right, so it is queued and checked like the $(...) form; folding it into
      // the surrounding word would hide it entirely.
      const close = src.indexOf('`', i + 1);
      const stop = close === -1 ? src.length : close;
      substitutions.push(...parseShell(src.slice(i + 1, stop)));
      i = stop;
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

  const mapped = segments
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

  // A substitution is a command in its own right, so its segments are returned
  // alongside the enclosing ones rather than merged into them: a segment is one
  // command, and `git commit -m "$(git push origin main)"` is two. `parseShell`
  // has already shaped them, so they are not put through the mapping above.
  return mapped.concat(substitutions);
}

// `git branch` flags that list, delete or configure rather than create a branch.
const BRANCH_QUERY_FLAGS = new Set([
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

const WRAPPERS = new Set([
  'sudo',
  'env',
  'command',
  'time',
  'timeout',
  'nice',
  'stdbuf',
  'nohup',
  'exec',
  'xargs',
  'ionice',
  'chrt',
]);

/**
 * Interpreters whose command string is still a shell command this guard has to
 * read. `env` and `sudo` are wrappers and are already skipped by WRAPPERS; these
 * take the command as an argument instead, so the name alone tells the guard
 * nothing and the argument has to be parsed.
 */
const NESTED_SHELLS = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh', 'busybox']);

/**
 * How many levels of nested interpreter are read. Three is far past any
 * legitimate use, and the bound is what stops `bash -c "bash -c ..."` becoming
 * unbounded recursion in a guard that runs on every command.
 */
const NESTED_DEPTH = 3;

/**
 * Shell keywords that can appear where a command word is expected. In a
 * compound command the first word after a separator is often one of these, and
 * treating it as the command meant the real command was never examined, so
 * `if true; then rm <guard file>; fi` passed.
 */
const SHELL_KEYWORDS = new Set([
  'if',
  'then',
  'else',
  'elif',
  'fi',
  'while',
  'until',
  'do',
  'done',
  'case',
  'esac',
  'select',
  'for',
  'in',
  'function',
  '{',
  '}',
  '[[',
  ']]',
  '!',
]);

// The `[` is a literal member of the class, so it needs no escape of its own.
const GROUPING_LEAD = /^[({[]+/;
const GROUPING_ONLY = /^[({[]+[)\]}]*$/;

// Options each wrapper takes before its command, per wrapper rather than shared:
// a flag that takes a value for one wrapper takes none for another, and a shared
// list misreads the command. `env -i` takes no value, so consuming one there
// swallowed the command itself and left the push behind it unchecked.
const WRAPPER_OPTIONS = {
  env: new Set(['-u', '--unset', '-C', '--chdir', '-S', '--split-string']),
  timeout: new Set(['-s', '--signal', '-k', '--kill-after']),
  stdbuf: new Set(['-i', '-o', '-e']),
  nice: new Set(['-n', '--adjustment']),
  ionice: new Set(['-c', '-n', '-p', '-t']),
  chrt: new Set(['-p', '--pid', '-u', '--other-pid']),
  sudo: new Set([
    '-u',
    '--user',
    '-g',
    '--group',
    '-h',
    '--host',
    '-p',
    '--prompt',
    '-C',
    '--close-from',
    '-T',
    '--command-timeout',
    '-R',
    '--chroot',
    '-D',
    '--chdir',
  ]),
  command: new Set(['-v', '--verbose']),
  xargs: new Set(['-n', '-P', '-I', '-d', '-a', '-E', '-s', '-L', '-I']),
};

/**
 * The command a segment runs and the arguments after it, with environment
 * assignments, shell keywords and wrappers peeled off the front.
 */
function commandOf(words) {
  let i = 0;
  for (;;) {
    if (i >= words.length) break;
    const word = words[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(word)) {
      i += 1;
      continue;
    }
    if (SHELL_KEYWORDS.has(word) || GROUPING_ONLY.test(word)) {
      i += 1;
      continue;
    }
    if (WRAPPERS.has(word)) {
      i += 1;
      const takesValue = WRAPPER_OPTIONS[word] || new Set();
      // The wrapper's own options, consuming a value only for the ones that take
      // one for *this* wrapper.
      while (i < words.length && words[i].startsWith('-') && words[i] !== '-') {
        const option = words[i];
        i += takesValue.has(option) ? 2 : 1;
      }
      // `timeout 60` style: a leading value that is not an option.
      while (i < words.length && /^[0-9.]+[smhd]?$/.test(words[i])) i += 1;
      continue;
    }
    break;
  }
  const raw = words[i] ? words[i] : '';
  const name = raw ? path.basename(raw.replace(GROUPING_LEAD, '')) : '';
  return { name, args: words.slice(i + 1) };
}

/**
 * The flags of a `git branch` call, with short clusters expanded, so `-dr` is
 * recognised as `-d -r` rather than as a single unknown flag.
 */
function gitBranchFlags(rest) {
  const flags = [];
  for (const arg of rest) {
    if (!arg.startsWith('-') || arg.startsWith('--')) {
      flags.push(arg);
      continue;
    }
    if (/^-[a-zA-Z]+$/.test(arg))
      flags.push(
        ...arg
          .slice(1)
          .split('')
          .map((c) => `-${c}`)
      );
    else flags.push(arg);
  }
  return flags;
}

/**
 * Why a branch must not be created, renamed or deleted. The shared validator
 * accepts `main` and the base branch as valid names, so the protected set is
 * what actually stops a write to them; every branch operation has to consult it,
 * not just a rename.
 */
function protectedBranchProblem(target) {
  if (!target) return null;
  return nameProblem(target) || (PROTECTED.has(target) ? `'${target}' is protected` : null);
}

// Flags of `gh pr create` and `gh api` that take a separate value. A value
// belongs to its flag and is never itself a flag, so `--title '-Rother/other'`
// must not be read as a repository option.
const VALUE_FLAGS = new Set([
  '--title',
  '-t',
  '--body',
  '-b',
  '--body-file',
  '-F',
  '--head',
  '-H',
  '--base',
  '-B',
  '--repo',
  '-R',
  '--assignee',
  '-a',
  '--label',
  '-l',
  '--milestone',
  '-m',
  '--project',
  '-p',
  '--reviewer',
  '-r',
  '--template',
  '-T',
  '--recover',
  '--method',
  '-X',
  '-f',
  '--field',
  '--raw-field',
  '--header',
  '--input',
  '-q',
  '--jq',
  '--template',
  '--hostname',
  '--cache',
  '--preview',
  '--query',
]);

/**
 * The value-taking flags of `gh pr create`. They differ from the shared set in one
 * flag: `-f` takes a value in `gh api` but is the valueless `--fill` in
 * `gh pr create`, so treating it as a value flag would swallow the `--base` or
 * `--head` after it and hide the target from the guard.
 */
const PR_CREATE_VALUE_FLAGS = new Set([...VALUE_FLAGS].filter((flag) => flag !== '-f'));

/**
 * Value of `--flag value`, `--flag=value` or `-f value`, taking the last occurrence as gh does.
 * The value of any other value-taking flag is skipped, so only real flag
 * occurrences can override an earlier one.
 */
function flagValue(args, names, valueFlags = VALUE_FLAGS) {
  let found;
  let seen = false;
  for (let i = 0; i < args.length; i += 1) {
    if (valueFlags.has(args[i]) && !names.includes(args[i])) {
      i += 1;
      continue;
    }
    for (const name of names) {
      if (args[i] === name) {
        found = args[i + 1];
        seen = true;
        i += 1;
        break;
      } else if (name.startsWith('--') && args[i].startsWith(`${name}=`)) {
        found = args[i].slice(name.length + 1);
        seen = true;
      } else if (
        // A short flag also accepts its value attached, so `-XPUT` names the same
        // method as `-X PUT`. Missing it made such a call look like a read.
        !name.startsWith('--') &&
        args[i].startsWith(name) &&
        args[i].length > name.length
      ) {
        found = args[i].slice(name.length);
        seen = true;
      }
    }
  }
  return seen ? found : undefined;
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

/**
 * The endpoint argument of a `gh api` call, without a query string or fragment:
 * `graphql?x=1` and `repos/o/r/git/refs?x=1` are the same routes as without the
 * suffix, so every route check must see the bare path.
 */
function apiEndpoint(args) {
  for (let i = 1; i < args.length; i += 1) {
    if (API_VALUE_FLAGS.has(args[i])) i += 1;
    else if (!args[i].startsWith('-')) return args[i].replace(/[?#].*$/s, '');
  }
  return '';
}

/**
 * Each field flag with its `key=value` argument, in every form gh accepts.
 *
 * Four, and all four reach the same handler:
 *
 *   - separated:        `-f key=value`
 *   - long `=`:         `--field=key=value`
 *   - attached short:   `-fkey=value`
 *   - attached `=`:     `-fkey` is `-f` with the value attached, and
 *                       `-fkey=` likewise, so both are read as one flag.
 *
 * The attached short form was missing, which let `-fquery=...` past this function
 * entirely: no pair was produced, the method was inferred as GET, and `checkGh`
 * returned no problems while gh still sent the field. That is a bypass of the
 * checks below, and of every caller of this function.
 *
 * Semantics verified against the installed `gh` (2.102.0) rather than assumed: it
 * accepts `-fquery=`, `-Fquery=` and `-XPOST`, and rejects `--fieldquery=` with
 * `unknown flag`. A long flag does not take an attached value, so `--fieldquery=`
 * is correctly not matched here. A short flag whose value is empty (`-fn=`) is
 * still a pair with an empty value, and a value beginning with `-` is still a
 * value, so neither is skipped.
 */
function fieldArgs(args) {
  const pairs = [];
  const record = (flag, argument) => {
    if (argument !== undefined) pairs.push([flag, argument]);
  };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (FIELD_FLAGS.has(arg)) {
      // The separated form consumes the next argument even when it is absent, so
      // a trailing `-f` does not also read as an endpoint.
      record(arg, args[i + 1]);
      i += 1;
      continue;
    }
    // The value of any other value-taking flag is that flag's, never a field:
    // `-t '-fn=refs/heads/ok'` is a template, which gh does not send as a field.
    if (VALUE_FLAGS.has(arg)) {
      i += 1;
      continue;
    }
    let matched = false;
    for (const flag of FIELD_FLAGS) {
      if (arg.startsWith(`${flag}=`)) {
        record(flag, arg.slice(flag.length + 1));
        matched = true;
        break;
      }
    }
    if (matched) continue;
    // The attached short form, for the single-letter flags only. `-Fquery=x` and
    // `-fquery=x` are the flag with its value attached, which pflag accepts and
    // which the `--fieldquery=` spelling above deliberately does not.
    for (const flag of SHORT_FIELD_FLAGS) {
      if (arg.startsWith(flag) && arg.length > flag.length) {
        const attached = arg.slice(flag.length);
        record(flag, attached.startsWith('=') ? attached.slice(1) : attached);
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
// The single-letter field flags, which also accept their value attached.
const SHORT_FIELD_FLAGS = new Set(['-f', '-F']);

function apiFields(args, cwd) {
  const fields = {};
  const input = inputArg(args);
  if (input !== null) {
    const body = readBody(input, cwd);
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === 'string') fields[key] = value;
      }
    }
    return fields;
  }
  for (const [flag, argument] of fieldArgs(args)) {
    const [key, ...rest] = argument.split('=');
    const value = resolveFieldValue(rest.join('='), cwd, flag);
    if (value !== null) fields[key] = value;
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
  const file = inputArg(args);
  if (file) {
    // With `--input`, gh sends the body and turns field flags into URL
    // parameters, so a flag the guard cannot read (`-F ref=@-`) changes nothing
    // about the target. Only the body can be unreadable. `--input -` reads the
    // caller's stdin, which the guard has already consumed for its own payload
    // and cannot recover.
    return file === '-' || readBody(file, cwd) === null ? ['the request body'] : [];
  }
  const unreadable = [];
  for (const [flag, argument] of fieldArgs(args)) {
    const [key, ...rest] = argument.split('=');
    if (resolveFieldValue(rest.join('='), cwd, flag) === null) unreadable.push(key);
  }
  return unreadable;
}

/** The `--input` argument, for both `--input file` and `--input=file`, taking the last occurrence as gh does. */
function inputArg(args) {
  let found = null;
  let seen = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--input') {
      seen = true;
      found = args[i + 1];
      i += 1;
    } else if (args[i].startsWith('--input=')) {
      seen = true;
      found = args[i].slice('--input='.length);
    } else if (VALUE_FLAGS.has(args[i])) {
      // The value belongs to its own flag: `--template '--input=ok.json'` is a
      // template, not an input file.
      i += 1;
    }
  }
  return seen ? found : null;
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
      // Declared without an initialiser because both paths below assign it before
      // it is read: a `statSync` that throws still has to say the cd failed.
      let isDir;
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
  'touch',
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
/**
 * The paths `git commit` will record instead of the whole index, or null when the
 * command commits the index.
 *
 * `git commit -- <path>` and `git commit -m x <path>` both record only the named
 * paths and ignore everything else staged. Parsing them off the command line needs
 * the flags that take a value to be skipped, since `-m "some message"` would
 * otherwise look like a path.
 */
function commitOperands(rest) {
  const separator = rest.indexOf('--');
  if (separator >= 0) return rest.slice(separator + 1).filter(Boolean);
  const operands = [];
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    // A long option that takes a value consumes it.
    if (/^--(message|file|author|date|reuse-message|fixup|squash|trailer)$/.test(arg)) {
      i += 1;
      continue;
    }
    // A combined cluster such as `-am` is a flag list, and `m`, `F`, `C` and `c`
    // each take a value. Skipping only an exact `-m` left `git commit -am "docs"`
    // reading the message "docs" as a path, which then looked like a named path
    // and was judged in place of the index.
    //
    // An attached value takes the rest of the word: `-mfix` is the message "fix",
    // not a flag plus a separate argument. Consuming the next argument there would
    // drop the path in `git commit -mfix package.json`, so the guard judged the
    // index and let the file through onto the base branch.
    if (/^-[A-Za-z]+$/.test(arg)) {
      if (/[mFCc]/.test(arg.slice(1))) {
        const letter = arg.slice(1).search(/[mFCc]/);
        // The value is attached only when nothing follows the flag letter.
        if (letter === arg.length - 2) i += 1;
      }
      continue;
    }
    if (arg.startsWith('-')) continue;
    operands.push(arg);
  }
  return operands.length ? operands : null;
}

/**
 * The command string an interpreter invocation carries, or null when it carries
 * none.
 *
 * `sh -c`, `bash -c` and `eval` pass it as a separate argument, but a combined
 * cluster is the common form in agent-issued commands: `bash -lc`, `sh -ec`. The
 * `-c` is then inside a single word like "-lc", so looking for an exact "-c"
 * misses it and the command is never read. The cluster is split and the option
 * that ends in `c` is treated as the command flag.
 */
function nestedCommand(name, args) {
  if (name === 'eval') return args.join(' ') || null;
  if (args.includes('-c')) return args[args.indexOf('-c') + 1] || null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('-') || arg === '-') continue;
    const letters = arg.replace(/^-+/, '');
    // Only a leading cluster counts: `-lc` is a cluster, `sh -s -c` is not, and a
    // long option such as --norc must not be mistaken for one.
    if (/^[a-zA-Z]+$/.test(letters) && letters.endsWith('c')) {
      return args[i + 1] || null;
    }
  }
  return null;
}

/**
 * Files a pathspec covers, as repository-relative names, or an empty list when it
 * is not a readable directory.
 */
function listFiles(target, cwd) {
  if (!existsSync(target) || !statSync(target).isDirectory()) return [];
  const root = (run('git', ['rev-parse', '--show-toplevel'], cwd) ?? '').trim() || cwd;
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else found.push(path.relative(root, full).split(path.sep).join('/'));
    }
  };
  walk(target);
  return found;
}

function checkBash(command, cwd, depth = 0) {
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
    for (const file of shellGuardWrites(segment, tracker, guard))
      problems.push(guardFileProblem(file));

    const { name, args } = commandOf(segment.words);

    // A command handed to another interpreter is still this shell's command, so
    // it is checked rather than declared out of scope: `bash -c "git push origin
    // main"` is the same write as the unquoted form, and a guard that only sees
    // the interpreter name is bypassed by adding four characters. The quoted
    // text arrives as one word because the tokenizer strips the quotes, which is
    // what makes the inner command recoverable.
    //
    // The inner check starts from the directory the outer shell has reached, so
    // a `cd` before the nested call still applies, and it is passed the same
    // guard list. The recursion is bounded by NESTED_DEPTH, because each level
    // can nest another.
    if (NESTED_SHELLS.has(name) || name === 'eval') {
      const inner = nestedCommand(name, args);
      if (inner) {
        if (depth >= NESTED_DEPTH) {
          problems.push(
            `Refused: a command nested ${NESTED_DEPTH} shells deep was not checked, so its effect is unknown.`
          );
        } else {
          problems.push(...checkBash(inner, tracker.cwd, depth + 1));
        }
      }
      continue;
    }

    if (name === 'cd') {
      tracker.cd(args, segment.subshell);
      // A cd in the same list moves the directory the following git and gh
      // commands run in, so their cwd and the branch they judge have to follow
      // it. Without this, `cd ../other-checkout && git commit` was judged against
      // this repository's branch and staged files, so a commit into a checkout
      // sitting on main was allowed. A cd inside a subshell is deliberately not
      // followed: it cannot affect the parent shell's directory.
      if (!segment.subshell && tracker.known) {
        gitCwd = tracker.cwd;
        branch = currentBranch(gitCwd) || branch;
      }
      continue;
    }
    if (name === 'gh') {
      problems.push(...checkGh(args, gitCwd, branch));
      continue;
    }
    if (name !== 'git') continue;

    // Skip git's global options: -C <path>, -c <k=v>, --no-pager, etc.
    // `git -C` applies to the one invocation it prefixes, so the directory and
    // branch are computed for this segment and do not carry to the next. They used
    // to be loop-level, which meant `git -C ../other log -1; git commit -m x` had
    // its commit judged against the other checkout: a commit onto main was allowed
    // because ../other was on a feature branch.
    let i = 0;
    let segCwd = gitCwd;
    let segBranch = branch;
    while (i < args.length && args[i].startsWith('-')) {
      if (args[i] === '-C' && args[i + 1]) {
        // `git -C` is relative to the shell's current directory, which a
        // preceding cd may have moved, not to the directory the hook started in.
        segCwd = path.resolve(tracker.cwd, args[i + 1]);
        segBranch = currentBranch(segCwd) || segBranch;
      }
      i += ['-C', '-c'].includes(args[i]) ? 2 : 1;
    }
    const sub = args[i];
    const rest = args.slice(i + 1);
    const positional = rest.filter((arg) => !arg.startsWith('-'));
    const root = () =>
      (run('git', ['rev-parse', '--show-toplevel'], segCwd) ?? '').trim() || project;
    const legacy = (target, remote) => () => hasOpenPr(target, { cwd: segCwd, remote });

    if (sub === 'branch' && rest.some((arg) => ['-m', '-M', '--move'].includes(arg))) {
      const target = positional.at(-1);
      const problem = protectedBranchProblem(target);
      if (problem) problems.push(`Rename blocked: ${problem}.`);
      // A rename moves HEAD only when it renames the branch that is checked out.
      // `git branch -m old new` renames old; when that is not the current branch the
      // session stays where it is, and treating the new name as current would judge
      // the following commit against a branch nobody is on.
      else if (positional.length < 2 || positional[0] === segBranch) {
        // Only the loop-level value is set. `segBranch` is read by the commit and
        // refspec branches below, which a rename does not reach, and the next
        // command in the list starts from `branch` anyway.
        branch = target;
      }
    } else if (
      sub === 'branch' &&
      gitBranchFlags(rest).some((flag) => ['-d', '-D', '--delete'].includes(flag)) &&
      positional.length >= 1
    ) {
      // Deleting a branch is a write on that branch, so it is judged the same
      // way as creating or renaming one. These flags were previously listed as
      // query flags, which skipped the check for the whole command.
      // `-r`/`--remotes` deletes a remote-tracking ref such as origin/main, which
      // is a normal operation and not a write to the local protected branch, so
      // the local branch-name rule does not apply to those targets.
      const remote = gitBranchFlags(rest).some((flag) => ['-r', '--remotes'].includes(flag));
      // `git branch -D main develop` names two branches, so every positional is
      // a deletion target and each has to be checked.
      for (const target of positional) {
        if (remote) continue;
        // A deletion only has to avoid removing a protected branch. Whether the
        // name matches the current convention is irrelevant: deleting a branch
        // created before the convention is how those are cleaned up, and
        // blocking it would leave them behind.
        if (PROTECTED.has(target)) {
          problems.push(`Branch deletion blocked: '${target}' is protected.`);
        }
      }
    } else if (
      (sub === 'checkout' || sub === 'switch') &&
      rest.some((arg) => ['-b', '-B', '-c', '-C', '--create', '--force-create'].includes(arg))
    ) {
      const flag = rest.findIndex((arg) =>
        ['-b', '-B', '-c', '-C', '--create', '--force-create'].includes(arg)
      );
      const target = rest[flag + 1];
      const problem = protectedBranchProblem(target);
      if (problem) problems.push(`Branch creation blocked: ${problem}.`);
      else {
        // A rename changes the current branch, so the name is written back to the
        // loop-level value as well as this segment's: `git branch -m feat/x && git
        // commit` must be judged as a commit on feat/x, not on the branch being
        // renamed away.
        branch = target;
      }
    } else if (
      sub === 'branch' &&
      positional.length >= 1 &&
      !rest.some((a) => BRANCH_QUERY_FLAGS.has(a.split('=')[0]))
    ) {
      // `git branch <name>`, `-f <name>` and `-c/-C <old> <new>` create or reset a branch.
      const copy = rest.some((arg) => ['-c', '-C', '--copy'].includes(arg));
      const problem = protectedBranchProblem(copy ? positional.at(-1) : positional[0]);
      if (problem) problems.push(`Branch creation blocked: ${problem}.`);
    } else if (
      (sub === 'checkout' || sub === 'switch') &&
      positional.length === 1 &&
      !rest.includes('--')
    ) {
      // `git checkout <path>` restores a file from the index and leaves HEAD where
      // it is; only a branch or a commit moves the session. A name that resolves to
      // an existing branch switches, and a path that does not. Reading the
      // operand as a branch either way meant a following commit was judged against
      // a branch that had not been checked out.
      if (
        sub === 'switch' ||
        run('git', ['rev-parse', '--verify', positional[0]], segCwd) !== null
      ) {
        // A checkout moves the current branch, so the loop-level value follows it
        // for the commands that follow in the same list. As with the rename above,
        // only `branch` is set: the commit and refspec branches that read
        // `segBranch` are not reached from a checkout.
        branch = positional[0];
      }
    } else if (sub === 'add') {
      if (rest.some((arg) => ['-u', '--update'].includes(arg))) {
        // `-u` stages modified tracked files only, and only under any pathspec
        // given. `git status --porcelain` would add untracked files that `-u`
        // never stages and would ignore the pathspec, so both over-block.
        added.push(
          ...(lines(run('git', ['diff', '--name-only', 'HEAD', '--', ...positional], segCwd)) ?? [])
        );
      } else if (rest.some((arg) => ['-A', '--all', '.', ':/'].includes(arg))) {
        added.push(...(statusPaths(segCwd) ?? []));
      } else {
        // A directory pathspec stands for the files under it. `git add docs` adds
        // docs/guide.md, but the pathspec itself normalises to "docs", which does
        // not start with "docs/" and so failed the documentation exception for a
        // legitimate documentation-only commit.
        //
        // The files are listed from the working tree rather than the index: this
        // runs while the command is being judged, before `git add` has actually
        // staged anything, so the index does not yet describe the result. The
        // contents are irrelevant, only the names and their repository-relative
        // form, which is what the exception is judged on.
        for (const pathspec of positional) {
          const absolute = path.resolve(segCwd, pathspec);
          let names;
          try {
            names = listFiles(absolute, segCwd);
          } catch {
            names = [pathspec];
          }
          added.push(...(names.length ? names : [pathspec]));
        }
      }
    } else if (sub === 'commit') {
      const all = rest.some((arg) => arg === '--all' || /^-[a-zA-Z]*a/.test(arg));
      // `git commit -m x <path>` has --only semantics: git records the named paths
      // and ignores the rest of the index. Reading the index alone would miss that,
      // so with only documentation staged, `git commit -m x package.json` passed
      // the documentation exception and put a non-documentation change on the base
      // branch.
      //
      // The named paths come from the index diff for exactly those paths, which is
      // what git will record and needs no re-parsing of the command line to tell a
      // path from a flag's value. A named path with no staged change is still
      // listed: it is being committed, and the guard cannot show it is
      // documentation.
      const only = commitOperands(rest);
      let onlyPaths = null;
      if (only) {
        const named = lines(run('git', ['diff', '--cached', '--name-only', '--', ...only], segCwd));
        onlyPaths = named === null ? null : [...new Set([...named, ...only])];
      }
      const paths = () => {
        if (onlyPaths) return onlyPaths;
        const staged = lines(run('git', ['diff', '--cached', '--name-only'], segCwd));
        if (staged === null) return null;
        const tracked = all ? (lines(run('git', ['diff', '--name-only'], segCwd)) ?? []) : [];
        return [...new Set([...staged, ...tracked, ...added])];
      };
      const problem = writeProblem(segBranch, { paths, root, legacy: legacy(segBranch, 'origin') });
      if (problem) problems.push(`Commit blocked: ${problem}.`);
    } else if (sub === 'push') {
      // `git push --delete <branch>` and `git push origin :<branch>` both remove
      // a remote branch, and neither reaches the refspec loop below, so the
      // protected names have to be refused here. A local `git branch -D main` is
      // already refused, but a remote deletion is the irreversible one: the
      // branch is gone from the shared repository, and re-creating it does not
      // restore a merge that only existed there.
      if (rest.some((arg) => ['-d', '--delete'].includes(arg))) {
        for (const target of positional) {
          if (PROTECTED.has(target.replace(/^refs\/heads\//, ''))) {
            problems.push(`Remote branch deletion blocked: '${target}' is protected.`);
          }
        }
        continue;
      }
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
        if (destination === '') {
          // `git push origin :branch` deletes the branch named by the empty
          // source, so the protected names apply here too.
          const target = source.replace(/^refs\/heads\//, '');
          if (PROTECTED.has(target)) {
            problems.push(`Remote branch deletion blocked: '${target}' is protected.`);
          }
          continue;
        }
        // Only branch destinations carry branch-name rules. An explicitly
        // qualified non-branch ref such as refs/tags/... is out of scope, and
        // running the branch check over it would judge a name that was never a
        // branch. A short name containing a slash is still a branch: `claude/x`
        // and `feat/y` are the normal way to write one.
        // This segment's values, not the loop-level ones: `git -C` applies to the
        // invocation it prefixes, and reading the loop-level branch made
        // `git -C ../other push` judge the target against this checkout.
        const raw = destination ?? source ?? segBranch;
        if (/^refs\//.test(raw) && !/^refs\/heads\//.test(raw)) continue;
        let target = raw.replace(/^refs\/heads\//, '');
        if (target === 'HEAD') target = segBranch;
        const from = source && source !== 'HEAD' ? source : 'HEAD';
        const paths = () =>
          lines(run('git', ['diff', '--name-only', `${remote}/${target}...${from}`], segCwd));
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
  return writeProblem(branch, { paths: () => paths, root, legacy, repo });
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
/**
 * The GraphQL document an `api graphql` call carries, as text.
 *
 * The document can arrive through gh's own `--query` option, through a field
 * (`-f`, `-F`, `--field`, `--raw-field`) or as the `query` key of an `--input`
 * body, so all three are read. The fields go through the same helpers the REST
 * path uses, which is what makes `-F query=@file` resolve `@file` against the
 * command's own working directory the way gh does. When `--input` supplies the
 * body, gh puts field flags in the URL query string, where the GraphQL endpoint
 * ignores them, so only the body's query is used. A body without a query is
 * refused rather than checked against a document gh does not send.
 */
function graphqlQuery(args, cwd) {
  // gh sends the last occurrence of a repeated flag, so every tier below keeps
  // the last readable document rather than the first (issue #3691, gap 5).
  const lastInput = inputArg(args);
  if (lastInput) {
    // The body is the document gh sends; flags ride in the URL query string,
    // where the GraphQL endpoint ignores them. A body without a query string
    // therefore supplies no document at all, and the caller refuses the call
    // as unreadable rather than judging a flag document gh never sends.
    const inputBody = readBody(lastInput, cwd);
    return inputBody && typeof inputBody === 'object' && typeof inputBody.query === 'string'
      ? inputBody.query
      : '';
  }
  // Tier priority without `--input`: --query, then -f query.
  let inline = null;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--query') {
      if (typeof args[i + 1] === 'string') inline = args[i + 1];
      i += 1;
    } else if (args[i].startsWith('--query=')) {
      inline = args[i].slice('--query='.length);
    } else if (VALUE_FLAGS.has(args[i])) {
      i += 1;
    }
  }
  if (inline !== null) return inline;
  let fieldQuery = null;
  for (const [flag, argument] of fieldArgs(args)) {
    const [key, ...rest] = argument.split('=');
    if (key !== 'query') continue;
    const value = resolveFieldValue(rest.join('='), cwd, flag);
    if (value !== null) fieldQuery = value;
  }
  if (fieldQuery !== null) return fieldQuery;
  return '';
}

/**
 * Whether the document itself could not be read, as opposed to naming no branch.
 *
 * `gh` sends the document from a field the guard cannot resolve — a typed
 * `-F query=@absent.graphql`, or an `--input` file that is not there. That is not
 * a document naming no branch, it is a document the guard never saw, and a write
 * on an unseen document is refused rather than judged on an empty one. The REST
 * path reaches the same conclusion through `unreadableApiFields`.
 */
function graphqlQueryUnreadable(args, cwd) {
  // The body is what gh sends when `--input` is present; the flags ride in the
  // URL query string, where the GraphQL endpoint ignores them. An unreadable
  // body — or a body with no query string in it — means the document was never
  // seen, whatever the flags say, and the call is refused. Without `--input`,
  // last occurrence wins within each tier, mirroring graphqlQuery (issue
  // #3691, gap 5).
  const lastInput = inputArg(args);
  if (lastInput) {
    const inputBody = readBody(lastInput, cwd);
    return (
      inputBody === null || typeof inputBody !== 'object' || typeof inputBody.query !== 'string'
    );
  }
  let inlineSeen = false;
  let inlineUnreadable = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--query') {
      inlineSeen = true;
      inlineUnreadable = typeof args[i + 1] !== 'string';
      i += 1;
    } else if (args[i].startsWith('--query=')) {
      inlineSeen = true;
      inlineUnreadable = false;
    } else if (VALUE_FLAGS.has(args[i])) {
      i += 1;
    }
  }
  if (inlineSeen) return inlineUnreadable;
  let fieldSeen = false;
  let fieldUnreadable = false;
  for (const [flag, argument] of fieldArgs(args)) {
    const [key, ...rest] = argument.split('=');
    if (key !== 'query') continue;
    fieldSeen = true;
    fieldUnreadable = resolveFieldValue(rest.join('='), cwd, flag) === null;
  }
  if (fieldSeen) return fieldUnreadable;
  return false;
}

/**
 * Branch names a GraphQL mutation names, with the key each was bound to.
 *
 * The keys are the ones the mutations that write a branch actually use:
 * `branchName` inside the nested `branch` input of createCommitOnBranch, and `name`
 * for createRef, which is given a qualified `refs/heads/...` name. `oid`,
 * `expression` and `repositoryNameWithOwner` are deliberately not read: they carry
 * a commit id, a path expression and an owner/repository, none of which is a branch
 * name, and judging them refused a query that was never a write.
 *
 * `updateRef` and `deleteRef` identify their ref by node id, so no field in those
 * documents names a branch. The caller refuses a mutation that writes a branch
 * without naming one, which is what covers them.
 */
function graphqlBranchNames(query, variables = {}) {
  // Each entry carries the repository that scopes it, or null when the
  // document does not scope it: a literal or a variable-bound name is scoped by
  // the `repositoryNameWithOwner` in its enclosing branch input, or bound to the
  // same stem for `branch: $b` and `input: $b`. A foreign repository takes that
  // name out of scope, exactly like a literal repositoryNameWithOwner in another
  // organisation; an unscopable name is judged, so an unrelated foreign variable
  // cannot vouch for it.
  const found = [];
  const scoped = (value, owner) => {
    if (typeof value === 'string' && value.trim()) found.push({ value: value.trim(), owner });
  };
  // The `owner/repo` owner bound to a variable stem, or null when the stem
  // names none or names it malformed. Malformed stays unscopable (judged)
  // rather than out of scope.
  const stemOwner = (stem) => {
    for (const key of [
      `${stem}[branch][repositoryNameWithOwner]`,
      `${stem}[repositoryNameWithOwner]`,
    ]) {
      const repo = variables[key];
      if (typeof repo !== 'string' || !repo.includes('/')) continue;
      const owner = repo.split('/')[0].toLowerCase();
      if (owner) return owner;
    }
    return null;
  };
  // Comments and string contents are not input fields: text such as
  // `# repositoryNameWithOwner: "other-org/x"` must not scope a write.
  const views = graphqlViews(query);
  const outside = (pattern) => matchesOutsideStrings(views, pattern);
  const branchOwner = (offset) => {
    const branch = outside(/\bbranch\s*:\s*\{([^{}]*)\}/g).find(
      (match) => offset > match.index && offset < match.index + match[0].length
    );
    if (!branch) return null;
    const innerStart = branch.index + branch[0].indexOf('{') + 1;
    const repository = [
      ...views.clean
        .slice(innerStart, branch.index + branch[0].length - 1)
        .matchAll(/\brepositoryNameWithOwner\s*:\s*"((?:[^"\\]|\\.)*)"/gi),
    ].find((match) => !views.inString(innerStart + match.index));
    return repository ? graphqlOwner(repository[1]) : null;
  };
  // A literal is either a plain string or a block string (`"""main"""`); both name
  // the branch, and escapes in a plain string are decoded.
  const literal = (match) => graphqlLiteral(match[1] ?? match[2]);
  for (const match of outside(/\bbranchName\b\s*:\s*(?:"""([\s\S]*?)"""|"((?:[^"\\]|\\.)*)")/g)) {
    // A literal branch name is scoped by the repository of the `branch: {...}`
    // input it sits in, like a variable-bound one, so a foreign literal exempts
    // only itself.
    scoped(literal(match), branchOwner(match.index));
  }
  // The `refs/heads/` prefix is checked on the decoded value, because
  // `"refs/heads/main"` and `"refs/heads/main"` both resolve to it.
  for (const match of outside(/\bname\b\s*:\s*(?:"""([\s\S]*?)"""|"((?:[^"\\]|\\.)*)")/g)) {
    const value = literal(match).trim();
    if (value.startsWith('refs/heads/')) scoped(value, null);
  }
  // A name bound to a variable is read from the value gh would send with it, so
  // `name: $n` with `-f n=refs/heads/main` is judged on `refs/heads/main` rather
  // than skipped.
  //
  // Only read when the document writes a branch at all. `name:` is a field on many
  // operations that are nothing to do with a branch — `createCheckRun(name: "ci")`,
  // and every read of `repository(owner:, name:)` — and judging those as branch names
  // refused a read-only query and reported a check name as a protected branch. The
  // variable spelling of a document must not be treated more strictly than the
  // literal spelling of the same document.
  // Variables are resolved only inside the argument list of a branch-writing
  // mutation. `createLabel(input: $i)` or `createCheckRun(name: $n)` beside a
  // branch write carries a label or check name, not a branch.
  const writeRanges = branchWriteFields(views).map((field) => [
    field.offset,
    field.offset + field.text.length,
  ]);
  const inWrite = (match) =>
    writeRanges.some(([start, end]) => match.index >= start && match.index < end);
  const outsideWrites = (pattern) => outside(pattern).filter(inWrite);
  if (writeRanges.length) {
    for (const match of outsideWrites(/\b(?:branchName|name)\s*:\s*\$([A-Za-z_][A-Za-z0-9_]*)/g)) {
      scoped(variables[match[1]], branchOwner(match.index));
    }
    // `createCommitOnBranch` takes its target as a nested input, so the branch can
    // arrive as `branch: $b` rather than as `branchName:`. gh sends a nested GraphQL
    // input field as `b[branchName]=main`, and that field is the one supplying `$b`,
    // so the value is read from it and judged like any other name.
    //
    // Resolving it is what keeps this consistent rather than merely safe: refusing
    // every `branch: $b` would also refuse a compliant commit, while `branchName: $b`
    // and `name: $n` are both resolved. A variable is not treated more strictly for
    // being spelled this way.
    for (const match of outsideWrites(/\bbranch\s*:\s*\$([A-Za-z_][A-Za-z0-9_]*)/g)) {
      // Keyed by the full field name, as graphqlVariables stores it. Flattening it to
      // `branchName` would collide with a real variable of that name, and the verdict
      // would depend on the order the flags were given.
      scoped(variables[`${match[1]}[branchName]`], stemOwner(match[1]));
    }
    // A whole input object bound to one variable names no `branchName` or `name`
    // key in the document itself: `createCommitOnBranch(input: $b)`. Without this
    // the document is allowed precisely because its target was hidden (issue
    // #3691, gap 1). The leaves the body map or the field flags stored under
    // `b[branch][branchName]`, `b[branchName]` or `b[name]` are judged instead;
    // when none resolves, the caller refuses the write as unreadable.
    for (const match of outsideWrites(/\binput\s*:\s*\$([A-Za-z_][A-Za-z0-9_]*)/g)) {
      const stem = match[1];
      const owner = stemOwner(stem);
      for (const key of [`${stem}[branch][branchName]`, `${stem}[branchName]`, `${stem}[name]`]) {
        scoped(variables[key], owner);
      }
    }
  }
  // `mergeBranch` writes to the branch named by `base`, and takes the repository by
  // node id, so the name is unscoped and judged (issue #3691, gap 7). `head` is the
  // source being merged in, not a branch that changes, so it is not read. The three
  // spellings are the ones the other branch writes have: a literal, a variable, and
  // a whole input object bound to one variable.
  for (const field of branchWriteFields(views).filter(
    ({ field: name }) => name === 'mergeBranch'
  )) {
    const fieldViews = graphqlViews(field.text);
    for (const match of matchesOutsideStrings(
      fieldViews,
      /\bbase\s*:\s*(?:"""([\s\S]*?)"""|"((?:[^"\\]|\\.)*)")/g
    )) {
      scoped(literal(match), null);
    }
    for (const match of matchesOutsideStrings(
      fieldViews,
      /\bbase\s*:\s*\$([A-Za-z_][A-Za-z0-9_]*)/g
    )) {
      scoped(variables[match[1]], null);
    }
    for (const match of matchesOutsideStrings(
      fieldViews,
      /\binput\s*:\s*\$([A-Za-z_][A-Za-z0-9_]*)/g
    )) {
      scoped(variables[`${match[1]}[base]`], null);
    }
  }
  return found.filter((entry) => entry.value);
}

/**
 * The owner a `repositoryNameWithOwner` string literal names, with GraphQL string
 * escapes decoded (`"lightspeedwp/.github"` is `lightspeedwp`).
 * @param {string} raw - The literal's contents, as written in the document
 * @returns {string | null} The lower-cased owner, or null when the literal uses an
 *   encoding that cannot be decoded or names no owner. A null owner is unscoped,
 *   so the write is judged rather than treated as foreign.
 */
function graphqlOwner(raw) {
  let decoded = raw;
  if (raw.includes('\\')) {
    try {
      decoded = JSON.parse(
        `"${raw.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))}"`
      );
    } catch {
      return null;
    }
  }
  const owner = decoded.split('/')[0].trim().toLowerCase();
  return decoded.includes('/') && owner ? owner : null;
}

/**
 * A GraphQL string literal's value, with escapes decoded. A literal that cannot be
 * decoded is returned as written, which then fails the branch-name check.
 * @param {string} raw - The literal's contents
 * @returns {string}
 */
function graphqlLiteral(raw) {
  if (!raw.includes('\\')) return raw;
  try {
    return JSON.parse(
      `"${raw.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))}"`
    );
  } catch {
    return raw;
  }
}

/**
 * Whether a `refUpdates: [...]` list carries a variable as an entry of its own
 * (`refUpdates: [$u]`, or `[{name: "refs/heads/ok"}, $u]`). An entry variable holds
 * a whole update object, which has no readable leaf, so the target cannot be
 * resolved. A variable inside an entry (`{name: $n}`) is not this case.
 * @param {{ clean: string, inString: (index: number) => boolean }} views
 * @returns {boolean}
 */
function hasListEntryVariable(views) {
  const opener = /\brefUpdates\s*:\s*\[/g;
  for (const match of matchesOutsideStrings(views, opener)) {
    let brackets = 0;
    let braces = 0;
    for (let i = match.index + match[0].length - 1; i < views.clean.length; i += 1) {
      if (views.inString(i)) continue;
      const char = views.clean[i];
      if (char === '[') brackets += 1;
      else if (char === ']') {
        brackets -= 1;
        if (brackets === 0) break;
      } else if (char === '{') braces += 1;
      else if (char === '}') braces -= 1;
      else if (char === '$' && brackets === 1 && braces === 0) return true;
    }
  }
  return false;
}

/**
 * A GraphQL document read the way GraphQL reads it: comments (`#` to the end of
 * the line, outside a string) are removed and string literals are located.
 *
 * Matching the document with plain regular expressions let a comment or a string
 * carry text that looked like an input field, such as
 * `# repositoryNameWithOwner: "other-org/other-repo"` placed before the real one,
 * which then supplied the repository that scoped a protected branch write.
 *
 * @param {string} query - The document
 * @returns {{ clean: string, inString: (index: number) => boolean }} The document
 *   with comments blanked (same length, so offsets are unchanged), and a test for
 *   whether an offset falls inside a string literal
 */
function graphqlViews(query) {
  const ranges = [];
  let clean = '';
  let i = 0;
  while (i < query.length) {
    const char = query[i];
    if (char === '#') {
      while (i < query.length && query[i] !== '\n' && query[i] !== '\r') {
        clean += ' ';
        i += 1;
      }
    } else if (query.startsWith('"""', i)) {
      let end = i + 3;
      while (end < query.length && !query.startsWith('"""', end)) {
        end += query.startsWith('\\"""', end) ? 4 : 1;
      }
      end = Math.min(end + 3, query.length);
      ranges.push([i + 3, Math.max(end - 3, i + 3)]);
      clean += query.slice(i, end);
      i = end;
    } else if (char === '"') {
      let end = i + 1;
      while (end < query.length && query[end] !== '"' && query[end] !== '\n') {
        end += query[end] === '\\' ? 2 : 1;
      }
      end = Math.min(end, query.length);
      ranges.push([i + 1, end]);
      clean += query.slice(i, Math.min(end + 1, query.length));
      i = Math.min(end + 1, query.length);
    } else {
      // Commas outside strings are insignificant in GraphQL, so
      // `createRef,(input: ...)` is the same document as `createRef (input: ...)`.
      clean += char === ',' ? ' ' : char;
      i += 1;
    }
  }
  return {
    clean,
    inString: (index) => ranges.some(([start, end]) => index >= start && index < end),
  };
}

/**
 * Matches of a global pattern in a GraphQL document that start outside any
 * string literal, so text inside a string never counts as an input field.
 * @param {{ clean: string, inString: (index: number) => boolean }} views
 * @param {RegExp} pattern - A global pattern
 * @returns {RegExpMatchArray[]}
 */
function matchesOutsideStrings(views, pattern) {
  return [...views.clean.matchAll(pattern)].filter((match) => !views.inString(match.index));
}

/**
 * The argument list of each mutation field that writes a branch, in document order.
 * A mutation is judged on its own arguments, so one that resolves to a branch
 * cannot vouch for another that does not.
 * @param {{ clean: string, inString: (index: number) => boolean }} views
 * @returns {{ field: string, text: string }[]}
 */
function branchWriteFields(views) {
  const fields = [];
  const opener =
    /\b(createCommitOnBranch|createRef|updateRefs|updateRef|deleteRef|mergeBranch)\s*\(/g;
  for (const match of matchesOutsideStrings(views, opener)) {
    const start = match.index + match[0].length - 1;
    let depth = 0;
    let end = views.clean.length;
    for (let i = start; i < views.clean.length; i += 1) {
      if (views.inString(i)) continue;
      const char = views.clean[i];
      if (char === '(') depth += 1;
      else if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    fields.push({
      field: match[1],
      text: views.clean.slice(match.index, end),
      offset: match.index,
    });
  }
  return fields;
}

/**
 * The GraphQL variables a call carries, keyed by the name the document refers to.
 *
 * Without `--input`, every field other than `query` and `operationName` is sent
 * as a variable, so `-f n=refs/heads/main` supplies `$n`. Nested GraphQL input
 * fields arrive as `b[branchName]=main`, which supplies the variable `b`; only
 * the leaf is used here, since a branch name is what a leaf carries.
 *
 * When `--input` supplies the body, gh puts field flags in the URL query
 * string, where the GraphQL endpoint ignores them: the body's `variables` map
 * is then the only source of variables, and the flags are not consulted at all.
 */
function graphqlVariables(args, cwd) {
  const lastInput = inputArg(args);
  const inputBody = lastInput ? readBody(lastInput, cwd) : null;
  if (inputBody && typeof inputBody === 'object') {
    return graphqlBodyVariables(inputBody);
  }
  const variables = Object.create(null);
  for (const [flag, argument] of fieldArgs(args)) {
    const index = argument.indexOf('=');
    if (index < 1) continue;
    const key = argument.slice(0, index);
    const raw = argument.slice(index + 1);
    if (key === 'query' || key === 'operationName') continue;
    const value = resolveFieldValue(raw, cwd, flag);
    // A nested field keeps its full key. Flattening `b[branchName]` onto
    // `branchName` collided with a genuine top-level variable of that name, and
    // the verdict would depend on the order the flags were given. A repeated
    // key keeps the last value, as gh sends the last occurrence, and that holds
    // for an unreadable last value too (`-f n=ok -F n=@-`): it is stored as null,
    // so the variable is unresolved and refused rather than judged on the
    // earlier, benign value gh never sends.
    variables[key] = value;
  }
  return variables;
}

/**
 * Variables from an `--input` body's `variables` map, keyed the way gh's field
 * syntax would key them (issue #3691, gap 4). A string leaf keeps its name; a
 * nested input object contributes its `branchName`, `name` and
 * `repositoryNameWithOwner` leaves under `var[leaf]` and `var[branch][leaf]`
 * keys, which is how graphqlBranchNames looks a `branch: $b` or `input: $b`
 * spelling up. gh sends the last file when `--input` is repeated, and the
 * caller passes that file's body (issue #3691, gap 5).
 */
function graphqlBodyVariables(inputBody) {
  const variables = Object.create(null);
  if (!inputBody.variables || typeof inputBody.variables !== 'object') return variables;
  const store = (key, value) => {
    if (typeof value === 'string' && value && !(key in variables)) variables[key] = value;
  };
  for (const [varName, varValue] of Object.entries(inputBody.variables)) {
    // Only a valid GraphQL name is a variable. A key such as
    // `b[branch][branchName]` is ignored by the server, but flattening would
    // store it under the key a real `b` object is flattened to, and a decoy
    // placed first would hide the real target.
    if (!/^[_A-Za-z][_0-9A-Za-z]*$/.test(varName)) continue;
    if (typeof varValue === 'string') {
      store(varName, varValue);
      continue;
    }
    if (!varValue || typeof varValue !== 'object' || Array.isArray(varValue)) continue;
    for (const leaf of ['branchName', 'name', 'base', 'repositoryNameWithOwner']) {
      store(`${varName}[${leaf}]`, varValue[leaf]);
    }
    const container = varValue.branch;
    if (container && typeof container === 'object' && !Array.isArray(container)) {
      for (const leaf of ['branchName', 'name', 'repositoryNameWithOwner']) {
        store(`${varName}[branch][${leaf}]`, container[leaf]);
      }
    }
  }
  return variables;
}

/**
 * Problems with the branch names a GraphQL mutation names.
 *
 * A mutation is not decomposed: the values bound to the branch keys are judged by
 * the same rules as any other branch name, and a mutation that writes a branch
 * without naming one is refused because nothing about it can be shown to be safe.
 */
function graphqlBranchProblems(query, variables = {}) {
  if (!query) return [];
  // A GraphQL call names no owner in its path, so the owner comes from the
  // document. A document naming only another organisation is allowed: the contract
  // says a call whose owner isn't `lightspeedwp` is always allowed.
  //
  // A document naming no owner is still judged. Only createCommitOnBranch takes
  // `repositoryNameWithOwner`; CreateRefInput, UpdateRefInput and DeleteRefInput
  // identify their target by node id, so the commonest real ref mutations name no
  // owner and could equally well target this organisation. Judging them is a wrong
  // refusal for a ref mutation in another organisation, in the direction the
  // contract already prefers: a check that cannot be scoped to this repository has
  // to fail closed.
  //
  // The exemption is per field and per name, never per document: a foreign owner
  // written in one mutation must not let another mutation in the same document
  // through, whether that one names its branch in a variable, binds a whole input to
  // a variable, or names no branch at all. Each entry carries its own owner scope
  // and each field is checked for a resolved target below.
  // Comments and string contents are not input fields, so an owner written in
  // either never scopes or vouches for anything.
  const views = graphqlViews(query);
  const problems = [];
  // Keyed by owner scope as well as name: a foreign `main` and a local `main` are
  // different writes, and the foreign one must not hide the local one.
  const judged = new Set();
  for (const entry of graphqlBranchNames(query, variables)) {
    // createRef is given a qualified ref name, so the branch part is what is judged.
    const name = entry.value.replace(/^refs\/heads\//, '').replace(/\.git$/, '');
    const key = `${entry.owner ?? ''}|${name}`;
    if (!name || judged.has(key)) continue;
    judged.add(key);
    // A variable-bound name scoped to a foreign repository is outside this
    // guard's scope, like a literal repositoryNameWithOwner in another
    // organisation. The scope travels with the name (not the document), so an
    // unrelated foreign variable cannot vouch for a write it does not scope.
    if (entry.owner && entry.owner !== OWNER) continue;
    if (PROTECTED.has(name)) {
      problems.push(`Write blocked: '${name}' is protected.`);
      continue;
    }
    if (PLACEHOLDER.test(name)) {
      problems.push(`Write blocked: '${name}' is the session placeholder, not a real branch name.`);
      continue;
    }
    const result = nameProblem(name);
    if (result) problems.push(`Write blocked: ${result}.`);
  }
  // A ref mutation has to resolve to a branch the guard can read, and one that
  // does not is refused. There are three ways to fail that, all of them real:
  //
  //   - `updateRef` and `deleteRef` identify their ref by node id, so no branch is
  //     named at all;
  //   - `createRef` may bind its name to a GraphQL variable, and gh sends every
  //     field other than `query` as a variable, so `name:$n` with `-f n=refs/heads/main`
  //     writes `main` without the word appearing in the document;
  //   - `createRef` may simply omit the name.
  //
  // The test is per mutation rather than per document, so a compliant branch named
  // elsewhere in the document cannot stand in for one of these. That was the sharpest
  // bypass here: it took one extra field beside a valid `branchName` and nothing else.
  //
  // A variable-carried name is refused rather than resolved. gh's own help says
  // every non-`query` field becomes a variable, so the value is on the command line
  // and could be read — but a variable may equally arrive in an `--input` body or be
  // built at runtime, and a guard that trusts one source and not another is not a
  // check. Refusing is the direction the contract requires when a check cannot be
  // completed, and it is the same reason the REST path refuses a ref write that
  // names no branch.
  //
  // Two conditions, and they are independent of each other:
  //
  //   - `updateRef` and `deleteRef` identify their ref by node id, so they name no
  //     branch however many other fields the document carries. Either is refused
  //     wherever it appears, including beside a compliant `branchName` — the branch
  //     it acts on is not the one that field names.
  //   - `createRef` names a branch only as a literal. Bound to a variable, nested in
  //     an input, or omitted, the document yields no name, and a document with no
  //     name at all is refused.
  //
  // Each mutation field is judged on its own arguments, so a compliant name in one
  // field cannot stand in for the ref mutation in the next.
  const nodeIdRefWrite = matchesOutsideStrings(views, /\b(?:updateRef|deleteRef)\b/g).length > 0;
  // A branch-writing mutation that resolves to no branch is refused. That includes a
  // `createCommitOnBranch` whose `branchName` is bound to a variable the guard cannot
  // read, which would otherwise be allowed precisely because its name was hidden.
  // `updateRefs` is included in WRITES_A_BRANCH because a word boundary after
  // `updateRef` does not match it — the trailing `s` is a word character — so a
  // variable-carried name inside `refUpdates` was neither resolved nor refused. Its
  // literal form was already read by the loop above, which is why only the variable
  // form showed the gap.
  // A branch name bound to a variable the guard cannot read is a branch write it
  // cannot judge, so it is refused. `branch` is included because the nested input
  // form reaches here with nothing resolved: a `branch: $b` whose value was not
  // supplied as a field leaves `seen` empty, and the variable form of a nested
  // input is exactly the shape that supplies no literal name. `input` is included
  // because a whole input object bound to one variable (`input: $b`) likewise
  // supplies no literal name; without it the write was allowed unseen (issue
  // #3691, gap 1).
  //
  // Resolution is tracked per mutation field, never per document: a field whose
  // target resolved (to any scope) says nothing about another field's whole input
  // bound to a variable the guard could not read, such as an `updateRefs(input: $i)`
  // beside a compliant `createRef`. `updateRef` and `deleteRef` are covered above.
  const unresolvedField = branchWriteFields(views).some(({ field, text }) => {
    if (field === 'updateRef' || field === 'deleteRef') return false;
    if (field === 'updateRefs') {
      // `updateRefs` writes several refs, so one resolved target proves nothing
      // about the others. Every `name:` in the field must be a literal or a
      // variable the guard can read, and the list or the whole input bound to
      // a variable (`refUpdates: $u`, `input: $i`) cannot be resolved at all:
      // an array-valued variable has no readable leaf.
      const fieldViews = graphqlViews(text);
      const wholeVariable = matchesOutsideStrings(
        fieldViews,
        /\b(?:refUpdates|input)\s*:\s*\$[A-Za-z_]/g
      );
      const unreadableName = matchesOutsideStrings(
        fieldViews,
        /\bname\s*:\s*\$([A-Za-z_][A-Za-z0-9_]*)/g
      ).some((match) => typeof variables[match[1]] !== 'string' || !variables[match[1]]);
      return wholeVariable.length > 0 || unreadableName || hasListEntryVariable(fieldViews);
    }
    if (graphqlBranchNames(text, variables).length > 0) return false;
    // A commit whose own `branch` input names a foreign repository is outside
    // this guard's scope, however its branch is given.
    const fieldViews = graphqlViews(text);
    const foreign = matchesOutsideStrings(
      fieldViews,
      /\brepositoryNameWithOwner\s*:\s*"((?:[^"\\]|\\.)*)"/gi
    ).some((match) => {
      const owner = graphqlOwner(match[1]);
      return owner !== null && owner !== OWNER;
    });
    if (field === 'createCommitOnBranch' && foreign) return false;
    // Every remaining field must name its branch. One that resolves none, such as a
    // commit whose `branch` is given by node id (`branch: {id: ...}`), cannot be
    // checked and is refused.
    return true;
  });
  if (nodeIdRefWrite || unresolvedField) {
    problems.push(
      'Write blocked: a ref mutation names no branch the guard can read, so the target cannot be checked.'
    );
  }
  return problems;
}

function checkGh(args, cwd, branch) {
  // `gh pr create` and `gh api` disagree on `-f`, so each reads its own flag set.
  const valueFlags = args[0] === 'pr' ? PR_CREATE_VALUE_FLAGS : VALUE_FLAGS;
  const repoFlag = flagValue(args, ['--repo', '-R'], valueFlags);
  // The repository is resolved the same way the pull-request check resolves it,
  // so a clone whose origin names no repository still finds the one that does. A
  // `gh pr create` with an empty owner was judged against a repository that does
  // not exist, which either refused a legitimate command or let one through.
  const [owner, repo] = repoFlag
    ? repoFlag.split('/')
    : Object.values(repositoryIdentity(cwd, 'origin') || { owner: '', repo: '' });
  const root = projectDir(cwd);

  if (args[0] === 'pr' && args[1] === 'create') {
    const head = flagValue(args, ['--head', '-H'], valueFlags) || branch;
    const base = flagValue(args, ['--base', '-B'], valueFlags);
    return prProblems({ owner, repo, head, base });
  }
  if (args[0] !== 'api') return [];

  const fields = apiFields(args, cwd);
  // A GraphQL document is a write signal in itself. `gh api graphql --query '...'`
  // carries no field flag, so without this the method was inferred as GET and the
  // call returned before the GraphQL branch, letting the mutation through on the
  // strength of the document alone. A `query` field the guard could not resolve
  // counts too, or an unreadable one would read as a read.
  const carriesDocument =
    args.includes('--query') ||
    args.some((arg) => arg.startsWith('--query=')) ||
    Object.keys(fields).includes('query') ||
    fieldArgs(args).some(([, argument]) => argument.split('=')[0] === 'query');
  const method = (
    flagValue(args, ['--method', '-X']) ||
    (Object.keys(fields).length || inputArg(args) || carriesDocument ? 'POST' : 'GET')
  ).toUpperCase();
  if (method === 'GET') return [];
  // GraphQL reaches the same writes through a different transport: createRef,
  // updateRef and createCommitOnBranch all take a branch or a commit on a named
  // ref, and the whole mutation arrives as one `query=` field. There is no REST
  // path to match, so the endpoint returned nothing and the call was allowed. The
  // branch names the mutation mentions are checked instead, which covers the same
  // ground as the REST branches below: a forbidden name is refused, and a mutation
  // that names no branch is not this guard's business.
  // `gh api /graphql` carries a leading slash, which the endpoint matcher must
  // tolerate the same way the REST path below strips one (issue #3691, gap 3):
  // gh sends the same request with or without the slash.
  const apiEp = apiEndpoint(args).replace(/^\//, '');
  if (/^graphql$/.test(apiEp)) {
    if (graphqlQueryUnreadable(args, cwd)) {
      return [
        'Write blocked: could not read the GraphQL document, so the target branch cannot be checked.',
      ];
    }
    return graphqlBranchProblems(graphqlQuery(args, cwd), graphqlVariables(args, cwd));
  }

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
      return [
        'Write blocked: could not read the request body, so the target branch cannot be checked.',
      ];
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
    const target = (fields.ref || '').replace(/^refs\/heads\//, '');
    // The shared validator accepts `main` and the base branch as valid names, so
    // the protected set is what stops creating them here (issue #3691, gap 6),
    // matching the GraphQL createRef/createCommitOnBranch path.
    if (isProtectedIn(apiRepo, target)) {
      return [`Branch creation blocked: '${target}' is protected.`];
    }
    const problem = nameProblem(target);
    return problem ? [`Branch creation blocked: ${problem}.`] : [];
  }
  const ref = resource.match(/^git\/refs\/heads\/(.+)$/);
  // A DELETE against a ref removes the branch, so it is judged like the other
  // writes rather than skipped. `gh api -X DELETE repos/.../git/refs/heads/main`
  // is the REST form of the remote deletion the push path already refuses, and
  // leaving it out made the documented protection depend on which command was
  // used.
  if (ref && method === 'DELETE' && isProtectedIn(apiRepo, ref[1].replace(/^refs\/heads\//, ''))) {
    return [`Remote branch deletion blocked: '${ref[1]}' is protected.`];
  }
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
  // A short flag accepts its value attached, so `-XDELETE` names the same method
  // as `-X DELETE`. The alternatives are matched in that order because the
  // attached form has no word boundary after the flag letter: with `\b` after
  // `-X` it did not match at all, and a call on the fault path was then read as a
  // read and allowed.
  /\bgh\s+api\b[^|;&]*\s(-X[A-Za-z]+|-X\b|--method|-f[A-Za-z]|-f\b|-F[A-Za-z]|-F\b|--field|--raw-field|--input)/,
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
/**
 * Whether a command, or anything nested inside it, writes a guard file. Used on
 * the fault path, where the guard is loaded but a check could not run, so the
 * self-protection cannot depend on the rest of the guard working.
 */
function mentionsGuardFile(command, cwd, guard, depth) {
  // Past the bound this is treated as a write, not as "nothing found". The normal
  // path refuses a command nested deeper than NESTED_DEPTH; returning false here
  // meant the fault path did the opposite and allowed it, so a guard-file removal
  // nested four shells deep was only permitted while the guard was broken. That is
  // the one case the self-protection contract says must not relax.
  if (depth > NESTED_DEPTH) return true;
  const tracker = createCwdTracker(cwd);
  for (const segment of parseShell(command)) {
    if (shellGuardWrites(segment, tracker, guard).length) return true;
    const { name, args } = commandOf(segment.words);
    if (name === 'cd') {
      tracker.cd(args, segment.subshell);
      continue;
    }
    if (NESTED_SHELLS.has(name) || name === 'eval') {
      const inner = nestedCommand(name, args);
      if (inner && mentionsGuardFile(inner, tracker.cwd, guard, depth + 1)) return true;
    }
  }
  return false;
}

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
  // Recurses for the same reason checkBash does. This path runs when the guard
  // itself could not load, and self-protection has to hold there too: a
  // `bash -c "rm .claude/settings.json"` names the interpreter, not the file, so
  // without recursion the write was allowed while the guard was broken. The
  // check is deliberately cheap, so nesting is expanded to the same bound.
  if (mentionsGuardFile(String(toolInput.command || ''), cwd, guard, 0)) return true;
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
