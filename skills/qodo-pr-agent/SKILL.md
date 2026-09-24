---
name: "lightspeed-qodo-pr-agent"
description: "Use this skill when an agent needs Qodo PR-Agent output (review, improve, describe, ask, labels, changelog, docs) for a PR or diff without publishing to GitHub. Returns a normalised ok/skipped/error result so callers can fall back cleanly."
---

# lightspeed-qodo-pr-agent

## Purpose

This skill gives every LightSpeed agent and skill one shared way to get [Qodo PR-Agent](../../docs/QODO_PR_AGENT.md) output as an **input**. Publishing is always off, so the skill never posts to GitHub. Callers decide what to do with the result and must keep working when it is unavailable.

Qodo PR-Agent is the third-party tool, and is **not** the internal [`agents/pr-agent/`](../../agents/pr-agent/AGENT.md).

## Capabilities

| Tool | PR mode (`--pr-url`) | Diff mode (`--diff-file`) | Typical caller |
| --- | --- | --- | --- |
| `review` | ✅ | ✅ | `skills/pr-review`, `agents/reviewer-agent/`, internal PR agent self-review gate |
| `improve` | ✅ | ✅ | Internal PR agent self-review gate |
| `describe` | ✅ | ✅ | Internal PR agent (diff-derived body section) |
| `ask` | ✅ | ✅ | `skills/pr-review`, `agents/qa-subagent.agent.md` |
| `generate_labels` | ✅ | — | `agents/labeling-agent/`, `skills/label-governance` |
| `update_changelog` | ✅ | — | `agents/changelog-agent/`, `skills/changelog-generator` |
| `add_docs` | ✅ | — | `agents/document-reviewer-agent/` |

`similar_issue` is not supported, because it is deferred (spec 017, research R8).

## Input Interface

```text
scripts/run-qodo-pr-agent.sh <tool> (--pr-url <url> | --diff-file <path>) [--question "<text>"] [--out <dir>]
```

| Argument or env | Required | Notes |
| --- | --- | --- |
| `<tool>` | yes | One of the tools above |
| `--pr-url` | one of | GitHub PR URL. Needs `GITHUB_TOKEN`. |
| `--diff-file` | one of | Unified diff (`git diff origin/develop...HEAD > pr.diff`). Needs no GitHub token. |
| `--question` | for `ask` | The question text |
| `--out` | no | Output directory (default: a temp directory) |
| `ANTHROPIC_API_KEY_QODO_PR_AGENT` | yes | Falls back to `ANTHROPIC_API_KEY` for local use |
| `GITHUB_TOKEN` | PR mode | Read access to the PR is enough |

**Runtime**: Docker, preferred, runs the same digest-pinned image as the workflow. Otherwise `pipx` with Python 3.12 or newer runs `pr-agent==0.46.0`.

## Output Interface

The script writes `<out>/result.json` and prints the same JSON to stdout:

| Field | Type | Meaning |
| --- | --- | --- |
| `status` | `ok`, `skipped` or `error` | `skipped` means "no input", and is never a failure |
| `reason` | string or null | `no-credential`, `no-runtime`, `tool-disabled`, `rate-limited` or `upstream-error` |
| `tool` | string | The tool that was requested |
| `markdown` | string or null | The tool's Markdown output when `status` is `ok` |
| `data` | object or null | Structured output, when the tool provides it (diff mode) |
| `truncated` | boolean | `true` when upstream clipped a large patch |

Exit codes: `0` for `ok` **and** `skipped`, `2` for `error`, `64` for a usage error.

## Usage in Agents

Every caller documents these obligations in its own `## Qodo PR-Agent integration` section:

1. Treat `skipped` and `error` as "no input". Continue with existing behaviour, and state `Qodo PR-Agent input skipped: <reason>` in the caller's own output.
2. **Labels**: intersect suggested names with `.github/labels.yml`, and never create or apply a name outside it. Record the dropped names.
3. **Changelog**: run the proposal through the changelog agent's validation. On failure, reject it and name the failing rule.
4. Never post the skill's markdown to a PR verbatim, unless the caller's own contract already allows it to comment.

## Error Handling

| Situation | Result |
| --- | --- |
| No model key, or no `GITHUB_TOKEN` in PR mode | `skipped` / `no-credential` |
| Neither Docker nor pipx with Python ≥ 3.12 | `skipped` / `no-runtime` |
| Tool not allowed for the mode | `skipped` / `tool-disabled` |
| Provider rate limit (HTTP 429) | `error` / `rate-limited` |
| Any other upstream failure | `error` / `upstream-error`. Details are in `<out>/qodo-pr-agent.log`, which never contains the key. |

## Examples

Pre-PR self-review of a branch (diff mode, nothing leaves the machine except the model call):

```bash
git diff origin/develop...HEAD > /tmp/pr.diff
skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh review --diff-file /tmp/pr.diff --out /tmp/qodo
```

Ask about an open PR:

```bash
GITHUB_TOKEN=… skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh ask \
  --pr-url https://github.com/lightspeedwp/.github/pull/123 --question "What does this change affect?"
```

Skipped result, returned when no key is configured:

```json
{ "status": "skipped", "reason": "no-credential", "tool": "review", "markdown": null, "data": null, "truncated": false }
```

## Testing

- `tests/js/qodo-pr-agent-integrations.test.js` checks this contract, that the image digest matches the workflow, and that every integrated asset documents its fallback.
- Manual checks are in [quickstart.md](../../.github/specs/017-qodo-pr-agent-integration/quickstart.md) ("Skill smoke test" and "Integration checks").
