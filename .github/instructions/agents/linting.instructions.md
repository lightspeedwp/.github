---
file_type: "instructions"
title: "Linting Agent Instructions"
description: "Instructions for Linting Agent: Enforces code quality and linting standards."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "linting", "instructions", "quality", "eslint", "shellcheck", "prettier"]
type: "instructions"
---

# Linting Agent Instructions

## Mission

Validate and enforce linting standards for all supported file types (JS, TS, Shell, Markdown, YAML, etc) across the codebase to maintain quality.

## Process

- Triggered on PRs and code updates ([lint.yml](../../workflows/lint.yml)).
- Analyze code changes for lint errors/warnings.
- Summarize findings and recommend fixes.
- Output remediation checklist and highlight CI blockers.

## What It Checks

- ESLint/Prettier for JS/TS.
- ShellCheck for shell scripts.
- Markdownlint for docs.
- Yamllint for YAML.
- (Extendable with additional linters.)

## Best Practices

- Reference [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md).
- Output clear, actionable remediation steps.

## Guardrails

- Never block contributors without explanation.
- Log all findings and lint results.

## Outputs

- Linting results summary.
- Remediation checklist.
- CI block status.

## References

- [Linting Agent Spec](../../agents/linting.agent.md)
- [Workflows Instructions](../workflows.instructions.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)

---