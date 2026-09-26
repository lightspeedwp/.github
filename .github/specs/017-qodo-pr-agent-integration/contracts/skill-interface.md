# Contract: Shared Skill `skills/qodo-pr-agent`

**Feature**: [../spec.md](../spec.md) | Satisfies FR-014, FR-015, FR-017

## Layout

```text
skills/qodo-pr-agent/
├── SKILL.md            # name: lightspeed-qodo-pr-agent; purpose, input/output, errors, examples
├── metadata.yml        # version, owners, platforms (matches skills/pr-review/metadata.yml)
└── scripts/
    └── run-qodo-pr-agent.sh
```

The skill is registered in `skills/SKILL_REGISTRY.json` under the `core` group.

## Invocation

```text
run-qodo-pr-agent.sh <tool> (--pr-url <url> | --diff-file <path>) [--question "<text>"] [--out <dir>]
```

| Argument | Rules |
| --- | --- |
| `<tool>` | One of `review`, `improve`, `describe`, `ask`, `generate_labels`, `update_changelog`, `add_docs`. With `--diff-file`, only `review`, `improve`, `describe` and `ask` are allowed. |
| `--pr-url` | A GitHub PR URL. Requires `GITHUB_TOKEN` in the environment. |
| `--diff-file` | A unified diff. Needs no GitHub token. Used for pre-PR self-review. |
| `--question` | Required for `ask`. |
| `--out` | Output directory; the default is a temp directory. |

**Environment**:

- `ANTHROPIC_API_KEY_QODO_PR_AGENT` only (FR-002: a dedicated key, with no fallback to a shared `ANTHROPIC_API_KEY`). The script maps it to `ANTHROPIC__KEY`.
- `GITHUB_TOKEN`, for PR mode only.

**Runtime**: the script prefers `docker run` of the pinned image digest, which is the same digest as the reusable workflow. Otherwise it uses `pipx run pr-agent==0.46.0` (needs Python ≥ 3.12).

**Always-set upstream flags**: `--config.publish_output=false`, `--config.verbosity_level=2`, `--config.propagate_tool_errors=true`, `--config.response_language=en-GB`. The skill **never publishes to a PR**.

## Output

The script writes `<out>/result.json` and prints the same JSON to stdout:

```json
{
  "status": "ok | skipped | error",
  "reason": "no-credential | no-runtime | rate-limited | tool-disabled | upstream-error | null",
  "tool": "review",
  "markdown": "…",
  "data": {},
  "truncated": false
}
```

Exit codes: `0` for `ok` **and** `skipped`, and `2` for `error`. A skipped result is never a failure (FR-014).

## Caller obligations

Every consuming `AGENT.md` or `SKILL.md` documents these in its `## Qodo PR-Agent integration` section:

1. Treat `skipped` and `error` as "no input". Continue with existing behaviour, and state `Qodo PR-Agent input skipped: <reason>` in the caller's own output.
2. **Labels**: intersect suggested names with `.github/labels.yml`, and never create or apply a name outside it. Record the dropped names.
3. **Changelog**: run the proposal through the changelog agent's validation. On failure, reject it and name the failing rule.
4. Never post the skill's markdown to a PR verbatim, unless the caller's own contract already allows it to comment.
