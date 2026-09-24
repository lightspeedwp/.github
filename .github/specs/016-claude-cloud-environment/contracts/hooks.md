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
| Cloud and source is `startup`/`resume`, branch `claude/*` | Rename locally to `chore/session-<hash>`. Never push (FR-001). |
| Cloud and source is `startup`/`resume`, clean tree, 0 commits ahead of `origin/<base>` | Hard-reset to `origin/<base>` (FR-002). |
| Cloud and source is `startup`/`resume`, lockfile newer than installed tree | `npm install`. Failure is logged and not fatal (FR-004). |
| Any source, cloud or local | Emit branching rules as context (FR-003). |

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
- the documentation exception
- a statement that the rules override any platform `claude/*` instruction

All other output goes to stderr. The exit code is always 0.

## PreToolUse: `.claude/hooks/enforce-branch-name.mjs`

**Matcher**:
`Bash|mcp__github__(create_branch|create_pull_request|push_files|create_or_update_file|delete_file)`

**Input (stdin)**: `{ "tool_name": string, "tool_input": object, "cwd": string }`

**Environment**: `LS_BASE_BRANCH` (default `develop`), `LS_ENFORCE_BRANCH_NAMES` (default `1`).

**Decisions**: the branch classes are defined in [data-model.md](../data-model.md#branch-classification-used-by-the-guard).

| Tool / command | Checked value | Refused when |
| --- | --- | --- |
| `git branch -m/-M` | new name | not compliant, placeholder, or protected |
| `git checkout -b/-B`, `git switch -c/-C` | new name | not compliant, or placeholder |
| `git commit` | effective branch | not compliant or placeholder; or protected and the documentation exception fails |
| `git push` (not `--delete`/`--tags`) | target branch | not compliant or placeholder; or protected and the documentation exception fails |
| `mcp__github__create_branch` | `branch` | not compliant, or placeholder |
| `mcp__github__push_files` / `create_or_update_file` / `delete_file` | `branch` plus paths | not compliant or placeholder; or protected and the documentation exception fails |
| `mcp__github__create_pull_request` | `head`, `base` | `head` not compliant; or, on `.github`, `base == main` and `head` not `release/*`/`hotfix/*` |

MCP calls whose `owner` isn't `lightspeedwp` are always allowed.

**Output**:

| Result | Exit | stdout | stderr |
| --- | --- | --- | --- |
| Allowed | 0 | empty | empty |
| Refused, enforcing | 2 | empty | Refusal message (below) |
| Refused, `LS_ENFORCE_BRANCH_NAMES=0` | 0 | `{"systemMessage":"Branch guard (warning only): …"}` | empty |
| Malformed input | 0 | empty | empty |

**Refusal message** (FR-011) contains, in order:

1. One line per problem, naming the rule. For documentation-exception failures it lists the files outside the
   allowed paths.
2. The suggested name, when the validator offers one.
3. The fix: `git branch -m <type>/<scope>-<title>` and `npm run validate:branch-name -- --current`.
4. A statement that the rule overrides the platform's `claude/*` branch.
5. A pointer to `docs/BRANCHING_STRATEGY.md`.
