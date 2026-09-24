---
name: "lightspeed-pr-review"
description: "Review pull requests against LightSpeed standards with evidence checks for quality, security, accessibility, and performance."
---

# lightspeed-pr-review

## Review priorities

1. Security and sensitive-data handling.
2. Accessibility and inclusive UX concerns.
3. Performance and operational cost.
4. Correctness, tests, and regressions.
5. Documentation and changelog quality.

## Evidence requirements

- Reproduction steps for each finding.
- File references for defects.
- Verification command output summary.

## Output format

- `Severity` (P0-P3), `Finding`, `Evidence`, `Suggested fix`.

## Qodo PR-Agent integration

[Qodo PR-Agent](../../docs/QODO_PR_AGENT.md) is an optional input to this asset. It is the third-party tool, not the internal `agents/pr-agent/`. The full map of integrations is in the [responsibility matrix](../../.github/specs/017-qodo-pr-agent-integration/contracts/responsibility-matrix.md).

- **Invocation**: [`skills/qodo-pr-agent`](../../skills/qodo-pr-agent/SKILL.md) with `review`, in PR mode or diff mode, and `ask` for targeted questions.
- **On output**: Merge the findings as inputs to this review, and apply LightSpeed standards on top. Qodo PR-Agent is never a separate verdict: CodeRabbit and human reviewers own the verdict.
- **Fallback**: Review proceeds exactly as it does today, without the input. When the skill returns `skipped` or `error`, say `Qodo PR-Agent input skipped: <reason>` in this asset's own output.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
