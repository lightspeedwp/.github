# Folder Structure Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this guide when deciding which folders a generated local skill should include.

## Principle

A skill should be as small as possible while still being reliable. Add folders for reuse, validation, or handoff, not because a master structure exists.

## Required files

| Path | Required | Purpose |
| --- | --- | --- |
| `SKILL.md` | Always | Entrypoint, trigger description, compact workflow |
| `agents/openai.yaml` | Always | Agent UI metadata |

## Recommended folders

| Folder | Include when | Avoid when |
| --- | --- | --- |
| `references/` | Rules, source order, policy, domain context, workflow variants need progressive loading | All guidance fits cleanly in `SKILL.md` |
| `templates/` | Outputs need reusable formats | The skill only gives advice or routing |
| `examples/` | Concrete examples reduce ambiguity or support testing | Examples would be decorative only |
| `schemas/` | Outputs, memory, or templates need machine-readable checks | The task is pure prose and low-risk |
| `scripts/` | Repeatable checks, packaging, conversion, or deterministic processing matter | ChatGPT can safely reason through the task |
| `tests/` | Validators or scenarios need proof | The skill is simple and low-change |
| `memory/` | Durable context improves future runs | The context is temporary, sensitive, or project-specific to one conversation |
| `rollout/` | Shared skills need release checks, changelog, or migration notes | Personal one-off skills |

## Usually omit

- `assets/`: Include only for output assets, not reasoning references.
- `docs/`: Use only for human documentation distinct from agent references.
- top-level `fixtures/`: Prefer `tests/fixtures/`.
- `profiles/`: Include only for named operating modes.
- deep `examples/templates/` or `examples/memory/`: Prefer shallow folders.
- root `business-context.md`: Put business context under `references/`.

## Tier examples

Use these examples as starting points, then remove folders that do not support the workflow.

### Minimal

```text
skill-name/
├── SKILL.md
└── agents/
    └── openai.yaml
```

### Standard

```text
skill-name/
├── SKILL.md
├── agents/openai.yaml
├── references/
├── templates/
└── examples/
```

### Advanced

```text
skill-name/
├── SKILL.md
├── agents/openai.yaml
├── references/
├── templates/
├── examples/
├── memory/
├── schemas/
├── scripts/
├── tests/
└── rollout/
```

## Decision checklist

- Does this folder reduce repeated work?
- Does it reduce drift or QA risk?
- Will another agent know when to load it?
- Can it be validated?
- Is it likely to stay useful after the current conversation?

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
