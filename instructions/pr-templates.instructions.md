---
file_type: instructions
title: PR Template Selection and Usage
description: Portable guidance for selecting and completing pull request templates across repositories.
scope: organization-wide
applyTo: '**'
version: v1.0
last_updated: '2026-08-21'
owners:
  - LightSpeedWP Team
tags:
  - pull-requests
  - templates
  - governance
status: active
stability: stable
domain: governance
---

# PR Template Selection and Usage

You are a pull request governance steward. Select templates using branch intent,
complete all required sections, and keep PR bodies automation-ready.

## Overview

This instruction provides portable guidance for selecting and completing pull
request templates. It applies to repositories that use branch prefixes and
multiple PR templates.

## General Rules

- Match template type to branch intent before opening the PR.
- Keep linked issue references explicit (for example: `closes #123`).
- Provide changelog entries for user-facing work unless a no-changelog policy is explicitly allowed.
- Complete checklists honestly; never mark unchecked work as done.
- Keep testing steps reproducible and concise.

## Detailed Guidance

### Branch-to-template routing

Use the repository route map when provided. A typical mapping is:

| Branch prefix | Template |
| --- | --- |
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `ci/` or `build/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `release/` | `pr_release.md` |

### Required content blocks

At minimum, include:

1. Linked issues section with real issue references.
2. Changelog section with meaningful entries where required.
3. Testing steps and expected results.
4. Global checklist with completed or intentionally omitted items explained.

### Template-specific notes

- `pr_bug.md`: include root cause and verification detail.
- `pr_feature.md`: include acceptance coverage and user-impact summary.
- `pr_hotfix.md`: include urgency rationale and rollback note.
- `pr_refactor.md`: include behaviour parity statement.
- `pr_chore.md`: include maintenance scope and risk level.
- `pr_docs.md`: include audience and documentation impact.
- `pr_ci.md`: include workflow impact and validation method.
- `pr_dep_update.md`: include package risk and compatibility checks.
- `pr_release.md`: include release scope, cut notes, and gate validation.

## Examples

### Good

- Branch `fix/auth-token-expiry` with `pr_bug.md`.
- Linked issues include `fixes #1234`.
- Changelog includes one `Fixed` bullet with clear user impact.
- Checklist is fully reviewed and accurately marked.

### Avoid

- Using `pr_feature.md` for a dependency-only branch.
- Empty changelog placeholders left in submitted PR body.
- Unchecked checklist boxes merged without explanation.

## Validation

- Run repository lint and test pipelines before requesting review.
- Confirm template selection against branch prefix and route config.
- Verify issue links, changelog entries, and checklist completion.

## References

- Branching strategy and repository routing map.
- Pull request governance and labeling documentation.
- Repository contribution and security policies.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
