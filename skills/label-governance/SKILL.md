---
name: "lightspeed-label-governance"
description: "Review label governance quality across labels, templates, saved replies, and triage conventions."
---

# lightspeed-label-governance

## Scope

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `.github/ISSUE_TEMPLATE/`
- `.github/SAVED_REPLIES/`

## Workflow

1. Validate naming consistency and taxonomy coverage.
2. Check issue-template alignment with label categories.
3. Check saved-reply reuse and triage workflow consistency.
4. Report duplication, stale labels, and mapping gaps.

## Safety

- Read-only by default; do not mutate labels automatically.

## Qodo PR-Agent integration

[Qodo PR-Agent](../../docs/QODO_PR_AGENT.md) is an optional input to this asset. It is the third-party tool, not the internal `agents/pr-agent/`. The full map of integrations is in the [responsibility matrix](../../.github/specs/019-qodo-pr-agent-integration/contracts/responsibility-matrix.md).

- **Invocation**: none available. There is no working Qodo PR-Agent path for label suggestions: `/generate_labels` is refused by the receiver as `command-not-allowed`, and `generate_labels` stores no result at PR-Agent v0.46.0, so [`skills/qodo-pr-agent`](../../skills/qodo-pr-agent/SKILL.md) cannot return it either. Label suggestions come from the labelling agent's own analysis of the diff (publishing is always off).
- **On output**: Keep only names that exist exactly in `.github/labels.yml`. Never create or apply any other name, and record the dropped names in this asset's output. Qodo PR-Agent itself never applies labels (FR-008).
- **Fallback**: The existing labelling rules apply unchanged. When the skill returns `skipped` or `error`, say `Qodo PR-Agent input skipped: <reason>` in this asset's own output.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
