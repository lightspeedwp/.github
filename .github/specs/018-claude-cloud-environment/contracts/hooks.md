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
| Cloud and source is `startup`/`resume`, clean tree, 0 commits ahead of `origin/<base>` | Hard-reset to `origin/<base>` (FR-002). |
| Cloud and source is `startup`/`resume`, installed dependency tree missing or lockfile newer than the installed tree | `npm install`. Failure is logged and not fatal (FR-004). |
| Any source, cloud or local | Emit branching rules as context (FR-003). |

**Contract test (FR-004)**: In a temporary cloud project, stub `npm`, remove `node_modules`, and give the lockfile
an old timestamp. Run the hook with both `startup` and `resume`; each must invoke `npm install`. With an installed
tree newer than the lockfile, neither source should invoke it.

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

**Emergency procedure**: An Owner can set `LS_ENFORCE_BRANCH_NAMES=0` in the environment used to start a new
session. In that session, guard faults produce a visible warning and allow the write to proceed (FR-013). Existing
sessions keep their starting setting. With enforcement on, guard faults still block git and GitHub writes with exit
2 (FR-012a). Restore enforcement after the fault is fixed.

**Legacy PR exception check**: `git ls-remote --exit-code --heads origin <branch>`, then
`gh api repos/{owner}/{repo}/pulls?head={owner}:<branch>&state=open&per_page=1` (REST: cloud sessions can't reach GitHub's GraphQL API, which `gh pr list` uses), each with a 5-second timeout. Any failure means
the exception doesn't apply (research R9). The exception applies only to a PR whose head is in this repository (the PR's `head.repo.full_name` equals its `base.repo.full_name`). "Not verified" means a check errors, exits non-zero, returns no PR or takes longer than 5 seconds (FR-006).

**Refusal message** (FR-011) contains, in order:

1. One line per problem, naming the rule. For documentation-exception failures it lists the files outside the
   allowed paths.
2. The suggested name, when the validator offers one.
3. The fix: `git branch -m <type>/<scope>-<title>` and `npm run validate:branch-name -- --current`.
4. A statement that the rule overrides the platform's `claude/*` branch.
5. A pointer to `docs/BRANCHING_STRATEGY.md`.
