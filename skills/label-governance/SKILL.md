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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

## Qodo PR-Agent integration

[Qodo PR-Agent](../../docs/QODO_PR_AGENT.md) is an optional input to this asset. It is the third-party tool, not the internal `agents/pr-agent/`. The full map of integrations is in the [responsibility matrix](../../.github/specs/017-qodo-pr-agent-integration/contracts/responsibility-matrix.md).

- **Invocation**: [`skills/qodo-pr-agent`](../../skills/qodo-pr-agent/SKILL.md) with `generate_labels` (publishing is always off).
- **On output**: Keep only names that exist exactly in `.github/labels.yml`. Never create or apply any other name, and record the dropped names in this asset's output. Qodo PR-Agent itself never applies labels (FR-008).
- **Fallback**: The existing labelling rules apply unchanged. When the skill returns `skipped` or `error`, say `Qodo PR-Agent input skipped: <reason>` in this asset's own output.
