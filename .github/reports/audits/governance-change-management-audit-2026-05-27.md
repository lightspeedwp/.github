---
title: "Governance And Change Management Audit"
description: "Audit findings for governance/process documentation consistency, ownership clarity, and change-tracking posture."
version: "v0.1.0"
last_updated: "2026-05-27"
file_type: "audit-report"
owners: ["LightSpeed Team"]
tags: ["governance", "audit", "change-management", "documentation"]
domain: "governance"
stability: "active"
---

# Governance And Change Management Audit (Issue #20)

## Scope

Reviewed files:

- `AGENTS.md`
- `.github/custom-instructions.md`
- `.github/instructions/*.instructions.md`
- `CONTRIBUTING.md`
- `README.md`
- `docs/README.md`
- `docs/AUTOMATION_GOVERNANCE.md`

Standards used:

- `instructions/file-organisation.instructions.md`
- `instructions/documentation-formats.instructions.md`
- `instructions/community-standards.instructions.md`

## Findings

| ID | Severity | Finding | Evidence | Risk |
| --- | --- | --- | --- | --- |
| GOV-001 | High | Governance docs contain stale internal links to non-existent files/paths. | Broken references detected in `.github/custom-instructions.md`, `CONTRIBUTING.md`, `docs/AUTOMATION_GOVERNANCE.md`, and `README.md`. | Contributors follow invalid guidance, causing drift and failed adoption. |
| GOV-002 | Medium | Governance source-of-truth paths are inconsistent (`.github/instructions` vs top-level `instructions`). | Mixed path references across `AGENTS.md`, `.github/custom-instructions.md`, and `docs/AUTOMATION_GOVERNANCE.md`. | Maintainers may update the wrong instruction layer and create policy divergence. |
| GOV-003 | Medium | Governance change-tracking process is not explicit for non-release policy updates. | No dedicated governance revision log or formal update workflow beyond generic PR process. | Governance decisions become hard to audit over time; rationale and approval context become opaque. |
| GOV-004 | Low | Some contributor-facing references use outdated file targets/formatting. | `CONTRIBUTING.md` referenced `DOCS.md`, `SAVED_REPLIES.md`, and duplicate-slash docs paths. | Lower confidence and unnecessary friction for maintainers. |

## Quick Wins Completed In This Audit

- Updated `CONTRIBUTING.md` reference from `DOCS.md` to `docs/README.md`.
- Updated `CONTRIBUTING.md` saved replies link to `.github/SAVED_REPLIES/README.md`.
- Normalised duplicate-slash links in `CONTRIBUTING.md` (`docs//` -> `docs/`).
- Replaced stale related-project links in `.github/custom-instructions.md` with current active project references.

## Remediation Plan

| Finding | Action | Delivery Type |
| --- | --- | --- |
| GOV-001 | Run a targeted governance-docs link hygiene sweep and repair stale references across governance files. | Follow-up issue |
| GOV-002 | Define and document canonical rule: when governance docs must reference `.github/instructions/` vs `instructions/`. | Follow-up issue |
| GOV-003 | Introduce a lightweight governance change log/revision history process with ownership and review cadence. | Follow-up issue |
| GOV-004 | Completed in this audit branch. | Completed quick win |

## Recommendation: Governance Change Tracking

Introduce a lightweight governance revision log under `docs/` and require one
dated entry for substantive governance/process policy changes. Keep this lean:

- one short entry per governance change;
- linked issue and PR references;
- rationale and rollback note when applicable.

This adds auditability without heavy operational overhead.

## Follow-Up Issues To Create

- [#424](https://github.com/lightspeedwp/.github/issues/424) - Link hygiene remediation for governance documentation.
- [#422](https://github.com/lightspeedwp/.github/issues/422) - Governance instruction source-of-truth alignment.
- [#423](https://github.com/lightspeedwp/.github/issues/423) - Lightweight governance revision log process.

## Validation

- `npx markdownlint-cli2 ".github/reports/audits/governance-change-management-audit-2026-05-27.md" "CONTRIBUTING.md" ".github/custom-instructions.md"`
- `git diff --check`
