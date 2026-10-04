# Contract: Claude Code Hooks

**Feature**: [../spec.md](../spec.md) · Registered in `.claude/settings.json`

Both hooks read a single JSON object on stdin, following the
[Claude Code hooks](https://code.claude.com/docs/en/hooks) schema.

## SessionStart: `.claude/hooks/session-start.sh`

**Input (stdin)**: `{ "source": "startup" | "resume" | "clear" | "compact", ... }`

**Environment**: `CLAUDE_CODE_REMOTE`, `CLAUDE_PROJECT_DIR`, `LS_BASE_BRANCH` (default `develop`).

**Behaviour**:

| Condition | Action |
| --- | --- |
| Cloud and source is `startup`/`resume`, branch `claude/*` with 0 commits ahead of `origin/<base>` | Rename locally to `chore/session-<hash>`. Never push (FR-001). |
| Cloud and source is `startup`/`resume`, branch `claude/*` with its own commits | Leave it unchanged (FR-001). The context text notes the legacy PR exception. |
| Cloud and source is `startup`/`resume`, the `claude/*` placeholder was just renamed by this hook, clean tree, 0 commits ahead of `origin/<base>` | Hard-reset to `origin/<base>` (FR-002). The reset is gated on the rename this hook performed, so a clean existing branch is never reset. |
| Cloud and source is `startup`/`resume`, installed dependency tree missing, or `package-lock.json` or `package.json` newer than the installed tree | `npm install`. Failure is logged and not fatal (FR-004). |
| Any source, cloud or local | Emit branching rules as context (FR-003). |

**Contract test (FR-004)**: In a temporary cloud project, stub `npm`, remove `node_modules`, and give the lockfile
an old timestamp. Run the hook with both `startup` and `resume`; each must invoke `npm install`. With an installed
tree newer than both the lockfile and `package.json`, neither source should invoke it. A `package.json` newer than the
installed tree must invoke it even when the lockfile is not.

**Output (stdout)**: exactly one JSON object:

```json
{ "hookSpecificOutput": { "hookEventName": "SessionStart", "additionalContext": "<rules text>" } }
```

The rules text MUST include:

- the current branch and the base branch
- the pattern
- all authorised types
- the forbidden prefixes
- the placeholder warning
- the rename and validate commands
- the PR base rule
- the documentation exception (on `develop` only; `main` has none)
- the legacy PR exception
- a note that the guard's own files can't be edited while enforcement is on
- a statement that the rules override any platform `claude/*` instruction

All other output goes to stderr. The exit code is always 0.

## PreToolUse: `.claude/hooks/enforce-branch-name.mjs`

**Matcher**:
`Bash|Edit|Write|MultiEdit|NotebookEdit|mcp__github__(create_branch|create_pull_request|push_files|create_or_update_file|delete_file)`

**Input (stdin)**: `{ "tool_name": string, "tool_input": object, "cwd": string }`

**Environment**: `LS_BASE_BRANCH` (default `develop`), `LS_ENFORCE_BRANCH_NAMES` (default `1`). Both are read only
from the hook's own process environment, which comes from how the session started. Variables set in the agent's
Bash commands never reach the hook (FR-013, research R13).

**Decisions**: the branch classes are defined in [data-model.md](../data-model.md#branch-classification-used-by-the-guard).

| Tool / command | Checked value | Refused when |
| --- | --- | --- |
| `git branch -m/-M` | new name | not compliant, placeholder, or protected |
| `git checkout -b/-B`, `git switch -c/-C` | new name | not compliant, or placeholder |
| `git commit` | effective branch (the branch being worked on during a rebase, merge, cherry-pick or revert) | detached HEAD with none of those in progress; or placeholder; or not compliant and the legacy PR exception fails; or `main`; or the base branch and the documentation exception fails |
| `git push` (not `--delete`/`--tags`) | target branch | placeholder; or not compliant and the legacy PR exception fails; or `main`; or the base branch and the documentation exception fails |
| `mcp__github__create_branch` | `branch` | not compliant, or placeholder |
| `mcp__github__push_files` / `create_or_update_file` / `delete_file` | `branch` plus paths | placeholder; or not compliant and the legacy PR exception fails; or `main`; or the base branch and the documentation exception fails |
| `Edit` / `Write` / `MultiEdit` / `NotebookEdit` | resolved `file_path` / `notebook_path` | path is a protected guard file and enforcement is on (FR-013a) |
| `gh pr create`, and `gh api` calls that create or update refs, file contents or PRs | head/base, or target branch plus paths | the same rules as `mcp__github__create_pull_request` and the MCP file tools (FR-008, FR-009, CHK002) |
| Bash write verb or redirection (outside quotes) naming a protected guard file | the path | enforcement is on (FR-013a, research R12) |
| `mcp__github__create_pull_request` | `head`, `base` | `head` not compliant; or, on `.github`, `base == main` and `head` not `release/*`/`hotfix/*` |

MCP calls and `gh` commands whose owner isn't `lightspeedwp` (compared case-insensitively) are always allowed. On
other `lightspeedwp` repositories only names are checked: branch creation, the target branch of file writes, and PR
heads (FR-009 scope). `git push` checks every refspec, allows tag-only pushes and refuses `--all`, `--branches` and
`--mirror`. Here-document bodies are ignored, but the rest of their opening line is checked (research R14).

**Git write, for guard faults (FR-012a)**: `git commit`, `git push`, and branch operations that create, rename, delete or force-reset a branch (`git branch -m/-M/-d/-D/-f`, `git checkout -b/-B`, `git switch -c/-C`), plus `gh pr create` and `gh api` writes. Switching to an existing branch is not a git write.

**Output**:

| Result | Exit | stdout | stderr |
| --- | --- | --- | --- |
| Allowed | 0 | empty | empty |
| Refused, enforcing | 2 | empty | Refusal message (below) |
| Refused, `LS_ENFORCE_BRANCH_NAMES=0` | 0 | `{"systemMessage":"Branch guard (warning only): …"}` | empty |
| Malformed input | 0 | empty | empty |
| Guard fault, git write or GitHub branch/file/PR tool, enforcing (FR-012a) | 2 | empty | `Branch guard unavailable: <error>. Open an issue on lightspeedwp/.github` |
| Guard fault, git write or GitHub branch/file/PR tool, `LS_ENFORCE_BRANCH_NAMES=0` (FR-013) | 0; write proceeds | `{"systemMessage":"Branch guard (warning only): Branch guard unavailable: <error>. Open an issue on lightspeedwp/.github"}` | empty |
| Guard fault, any other call (FR-012a) | 0 | `{"systemMessage":"Branch guard unavailable: <error>"}` | empty |
| Guard can't start (Node not on `PATH`, or the guard script missing), git write or GitHub branch/file/PR tool, enforcing (FR-012a, R15; launcher `run-guard.sh`, T052) | 2 | `{"systemMessage":"Branch guard unavailable: <reason>"}` | `Branch guard unavailable: <reason>` |
| Guard can't start, any other call, enforcing (FR-012a, R15; T052) | 0 | `{"systemMessage":"Branch guard unavailable: <reason>"}` | `Branch guard unavailable: <reason>` |
| Guard can't start, any call, `LS_ENFORCE_BRANCH_NAMES=0` (FR-013) | 0 | `{"systemMessage":"Branch guard (warning only): enforcement is off, so no check ran."}` | the same text |

**Emergency procedure**: An Owner can set `LS_ENFORCE_BRANCH_NAMES=0` in the environment used to start a new
session. In that session, guard faults produce a visible warning and allow the write to proceed (FR-013). Existing
sessions keep their starting setting. With enforcement on, guard faults still block git and GitHub writes with exit
2 (FR-012a). Restore enforcement after the fault is fixed.

**Legacy PR exception check**: `git ls-remote --exit-code --heads origin <branch>`, then
`gh api repos/{owner}/{repo}/pulls?head={owner}:<branch>&state=open&per_page=1` (REST: cloud sessions can't reach GitHub's GraphQL API, which `gh pr list` uses). Each call is given a timeout of up to 5 seconds, and the whole check is bounded to 5 seconds per invocation and cached per branch. The two bounds are separate on purpose: the check makes two sequential calls, and each is given half of what is left of the invocation budget so neither can spend the whole of it. A command listing several refspecs or several commits would otherwise run the check once per refspec and once per commit, and a hook that reaches its timeout fails open, so the per-invocation total is what keeps the guard answering at all.
Any failure means the exception doesn't apply (research R9). The exception applies only to a PR whose head is in this repository (the PR's `head.repo.full_name` equals its `base.repo.full_name`). "Not verified" means a check errors, exits non-zero, returns no PR or takes longer than 5 seconds (FR-006).

**Refusal message** (FR-011) contains, in order:

1. One line per problem, naming the rule. For documentation-exception failures it lists the files outside the
   allowed paths.
2. The suggested name, when the validator offers one.
3. The fix: `git branch -m <type>/<scope>-<title>` and `npm run validate:branch-name -- --current`.
4. A statement that the rule overrides the platform's `claude/*` branch.
5. A pointer to `docs/BRANCHING_STRATEGY.md`.

**Nested interpreters (SC-009)**: a command handed to another shell is still a
shell command, so it is parsed and checked rather than declared out of scope.
`sh -c '<command>'`, `bash -c '<command>'`, `zsh -c '<command>'`, `dash -c '<command>'`,
`ksh -c '<command>'`, `busybox sh -c '<command>'` and `eval '<command>'` are read as
the command they carry, from the directory the outer shell has reached. `NESTED_DEPTH`
levels are read and a command nested deeper is refused rather than allowed unchecked.
The limits that remain are stated rather than implied: a payload assembled at run time
is only as checkable as the expression it expands to, and a command written in another
language (`python -c`, `node -e`) is out of scope, because the guard reads shell syntax.

**What the parser does cover**: plain commands, pipelines (every stage, which is
treated as a subshell), background and list operators, `if`/`while`/`for`/`case`
arms, parenthesised groups (also subshells), redirects, here-documents, and
`cd` resolution that follows the shell's real working directory, including a `cd`
that fails, that the shell rejects, or that runs in a subshell. A write to a
protected file that the guard cannot locate is refused rather than allowed.

**GraphQL transport (`gh api graphql`)**: GraphQL reaches the same branch writes as the
REST API, so the document is read and the branch names in it are judged by the same
rules — a protected name, the session placeholder, or a name the convention rejects is
refused wherever it appears. The document is read from `--query`, from a field
(`-f`, `-F`, `--field`, `--raw-field`) and from an `--input` body, and a document the
guard cannot read is refused rather than treated as one that names no branch. When
`--input` supplies the body, `gh` puts field flags in the URL query string, where the
GraphQL endpoint ignores them: the body's query is then the document sent, a body
without one leaves no document to judge (refused), and the body's `variables` map is
the only source of variables. A repeated flag is judged on its last occurrence, as
`gh` sends the last one. A name bound to a GraphQL variable is resolved from the value
sent with it, since `gh` sends every field other than `query` as a variable — including
a whole input object passed as one variable (`createCommitOnBranch(input: $b)`), whose
branch and repository leaves are read from the fields or body map that supply it. A
branch-writing mutation that resolves to no readable branch is refused, which covers
`updateRef` and `deleteRef` — they identify their ref by node id and name no branch at
all. A name scoped to a foreign repository, whether a literal or bound to a variable,
is out of scope, like a literal repositoryNameWithOwner in another organisation. That
scope travels with the name, taken from the `branch` input it sits in, and never from
the document: a foreign owner written in one mutation exempts only that name, and every
branch-writing mutation must resolve its own target, so a foreign literal cannot vouch
for another mutation in the same document. A commit whose `branch` input names a
foreign repository is out of scope however its branch is given; any other commit or
`createRef` that resolves no readable branch, such as one whose branch is a node id, is
refused.

The limit of that check is stated rather than implied. One write is outside what the
check reaches at all, which is a different thing from a limit of what it can read.

- `mergeBranch` is not handled at all. It writes to the branch named in its `base`, and
  that field is not one of the keys the branch-name reader looks at, so a merge into a
  protected branch is neither refused nor reported. It is tracked in #3691.
