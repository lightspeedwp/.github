# Implementation Plan: GitHub Label Audit & Consolidation

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
<!-- BADGES-END -->

**Branch**: `audit/label-consolidation` (merged as #3362) | **Date**: 2026-09-14, updated 2026-10-03 | **Spec**: [008-label-audit-consolidation/spec.md](spec.md)

**Status (2026-10-03)**: The audit (US1–US3) and Stages 0a, 0b and 0c are on `develop`: #3362, #3534 and #3564 merged on 2026-09-25. Since then #3725 (#3730) merged on 2026-10-02 (the T042 Linear export and the Stage 1 drafts T046b, T048, T049) and #3732 (#3731) merged on 2026-10-03 (constitution v1.4.0, which makes `branch-types.yml` the canonical routing map and locks the routing files). Open PRs:

- #3703 (#3728): this plan, the tasks and Phase 9;
- #3704 (#3729): the T062a write queue;
- #3734: the locked-files guard and the inventory token guard (T075).

Stage 0a's manual step (T040c), the org-wide inventory (T041, waiting for @ashleyshaw's short-lived inventory token and #3734) and the Stage 1 approvals are next. One governance gap is open: #3534 merged before #3556 and #3557 were fully signed off (see Constitution Check).

**Input**: Feature specification from `.github/specs/008-label-audit-consolidation/spec.md`

## Summary

Conduct a comprehensive audit of GitHub labels across the `.github` repository to identify inconsistencies, duplicates, and gaps in label governance. The audit compares canonical `labels.yml` against `issue-types.yml`, governance policy, documentation, archived workflows, and GitHub API usage to produce a reconciliation report with recommendations for consolidation and workflow restoration.

User Story 4 then consolidates labels across GitHub and Linear: prefix renames (`ai-ops:` → `aiops:`, `openspec:` → `spec:`), import of used Linear-only labels with approved merges, the Question → Decision issue-type swap, re-prefix of eight Linear type labels, the five Linear labels requested in #3554, the `meta:needs-approval` approval gate (FR-021), a guard that stops the labelling agent removing labels before the mapping exists (FR-022), the OpenSpec → Spec Kit rename, gated deletion of unapproved labels in every `lightspeedwp` repository, and a weekly drift check. The execution order is approve → update configuration → change GitHub → delete in GitHub → clean up Linear → enable drift check (see Consolidation Execution Plan).

**Key Constraints**:

- Type family: exactly 25 labels, each mapped to one issue type. The audit (2026-09-14) found 26 (25 mapped + unmapped `type:decision`); Stage 0a (T040b, #3534) applied the FR-014 swap, so `type:decision` is mapped and `type:question` is retired. No other type-family change is permitted
- Audit phase (US1-US3) is read-only; consolidation (US4) changes configuration only after `[LABEL-UPDATE-REQUEST]`, `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` approval. FR-009 exempts two earlier changes: the Stage 0a issue-type change (#3530 is approved; the implementation merged in #3534 before full approval, so #3556 is approved only in principle and #3557 is pending until T040n's dated sign-off) and the never-delete list clean-up
- Since Stage 0c (shipped in #3362), the spec artefacts, analysis reports and label docs use the target names `aiops:*`, `type:aiops` and `spec:*` (Stage 0c); the 2026-09-14 snapshot files keep the recorded names with a `target_name` added, and `renamed-label-references.json` keeps the old names. The rename in `labels.yml`, `pr_aiops.md` and the automation waits for Stage 2 (FR-011)
- Until Stage 3, labelling automation removes no label for being outside `labels.yml` (FR-022); AI assets live in `aiops:*`, with `area:ai` as the one umbrella area label (FR-012)
- All findings must be evidence-based with file/line references

## Technical Context

**Project Type**: Analysis/Audit/Documentation task (not code development)

**Scope**: Multi-source analysis across:

- Canonical label configuration files (YAML)
- GitHub issue type definitions (YAML)
- Label governance policy (YAML)
- Documentation files (Markdown)
- Archived GitHub Actions workflows (YAML)
- GitHub API label inventory (JSON)

**Tools/Technologies**:

- YAML file parsing and validation
- Markdown documentation analysis
- GitHub API (via `gh` CLI or API client)
- Shell scripting for workflow analysis
- JSON/YAML comparison and reconciliation
- Linear API (label listing, issue label updates, rename, retire/restore)
- Credentials (FR-018): org-wide GitHub App with Issues read/write and Metadata read (short-lived tokens); read-only `LINEAR_API_KEY` secret for the drift check; deletion and Linear writes run from @ashleyshaw's session; the inventory script will read a dedicated token variable and refuse the repository-scoped Actions token once T075 merges (#3734, still open); today it reads `GITHUB_TOKEN`
- GitHub Actions scheduled workflow (weekly drift check)

**Data Sources**:

- `.github/labels.yml` (canonical, 169 labels, 15+ families)
- `.github/issue-types.yml` (25 type mappings; at the audit, canonical had 26 type labels including unmapped type:decision)
- `.github/label-governance-policy.yml` (never-delete policy)
- `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md` (18+ doc files)
- `.github/workflows/archived/2026-09-11/labeling/` (11 archived workflows)
- GitHub API labels on lightspeedwp/.github repository
- Labels on every `lightspeedwp` repository (paginated; consolidation phase)
- Linear workspace labels (about 240 on 2026-09-24; all labelled issues in the LightSpeed team) and per-label issue counts

**Deliverables**:

- audit-report.md (findings summary with evidence)
- label-inventory.csv (comprehensive label catalog)
- duplicates-analysis.md (consolidation recommendations)
- workflow-analysis.md (archived workflow assessment)
- data-model.md (entity catalog for phases)

**Testing Strategy**:

- Manual verification of each finding against source files
- Cross-reference consistency checks
- Completeness validation (all labels accounted for)
- Evidence traceability (every finding has file/line reference)

**Scale/Scope**:

- 169 labels across 15+ families in canonical file
- 26 type labels in canonical at the audit (25 with issue-types.yml mappings; type:decision unmapped); 25 since Stage 0a
- 57 labels in governance never-delete policy
- 11 archived workflows to analyze
- 18+ documentation files to review
- About 454 live files referencing OpenSpec (content or path) for the Spec Kit rename
- About 70 Linear-only labels to import, merge, re-prefix, retire or team-scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **COMPLIANT** — All audit principles align with constitution:

1. **Organisation-Wide Governance Authority**: This audit serves the `.github` repository's role as authoritative source for label governance across all LightSpeed repositories. ✅

2. **Curated Assets with Locked Governance**: The audit phase is read-only. Consolidation changes `labels.yml`, `issue-types.yml` and `06-question.md` only after `[LABEL-UPDATE-REQUEST]`, `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` are approved by @ashleyshaw, with impact analysis from the label mapping. ✅

3. **Clear Asset Boundaries**: Audit clearly differentiates between canonical configuration (`.github/`) and documentation (top-level `docs/`). ✅

4. **Technology-Agnostic Guidance**: Audit findings apply universally to all repositories consuming central label configuration, regardless of tech stack. ✅

5. **Branch Naming Strategy**: Uses proper `audit/label-consolidation` branch naming (not forbidden `claude/` prefix). ✅

6. **UK English, Accessibility, Security Standards**: All deliverables will follow UK English, semantic documentation, and security-first practices. ✅

7. **Issue Type and Template Routing**: The Question → Decision swap is already reflected in constitution v1.3.1, including the rule that `06-question.md` stays until the change requests merge. Issue-type fallback PR routing is marked not yet implemented and is out of scope. ✅

8. **UK English, Accessibility, Security Standards (Principle VI)**: Organisation-wide credentials are least-privilege and short-lived, destructive runs stay out of CI, and no secret is committed (FR-018); the Accessibility issue type now cites WCAG 2.2 AA. ✅

9. **Automated Validation & Metrics-Driven Governance**: The weekly drift check (FR-017) replaces one-off manual audits for label consistency. ✅

**Post-merge re-check (2026-10-01)**: ⚠️ **One Principle II violation, already merged.** #3534 changed locked files (`issue-types.yml`, `labels.yml`, `06-decision.md`, `06-question.md`, `ISSUE_TEMPLATE/config.yml`) and merged on 2026-09-25, while #3556 was approved only in principle and #3557 was pending. The 2026-09-24 re-check below required both approvals first. Remediation, in order of preference:

1. Reopen #3557 and any other request issue closed by the #3534 merge, and keep those issues open until dated sign-off is recorded. @ashleyshaw then records a dated sign-off on #3556 and #3557 covering what #3534 shipped, and `evidence/change-requests.json` records it.
2. If either request is rejected, a revert PR restores the rejected part, and the spec, contracts and tasks are updated to match.

No later stage that changes a locked file (Stage 2 onwards) starts until this is resolved. To stop a repeat, any PR that changes a locked file is opened as a draft and leaves the merge queue until its change requests show `approved` in `change-requests.json`.

A second gap is not a constitution violation, but it blocks Stage 1. #3554 (`[LABEL-UPDATE-REQUEST]` for five imports) was closed as completed when #3534 and #3362 merged, through hand-added Development links, although none of its labels is in `labels.yml` yet. It must be reopened before T046a records it.

All other principles stay compliant with the constitution (checked against v1.3.1; v1.4.0 is now in force, see the re-check below).

**Re-check against constitution v1.4.0 (2026-10-02; merged in #3732 on 2026-10-03, so v1.4.0 is the active authority)**: ⚠️ Compliant once three task changes are made; no new violation. v1.4.0 makes these rules:

- `.github/branch-types.yml` is the canonical routing map, and `PULL_REQUEST_TEMPLATE/config.yml` MUST mirror it.
- Each routed template's `type:*` label is authoritative, and `branch-labels.yml` MUST give each branch type that same single label.
- `branch-types.yml`, `branch-labels.yml` and `config.yml` are LOCKED under `[TEMPLATE-UPDATE-REQUEST]`.

Consequences for this plan:

1. **T074 and T076 change locked files.** Both go into the T046b `[TEMPLATE-UPDATE-REQUEST]`, which already covers six PR templates, and ship in the Stage 2 configuration PR only after it is approved (Principle II).
2. **T074's ten corrections follow the template.** `branch-labels.yml` takes each routed template's type label. For example `audit/` becomes `type:audit` and `hotfix/` becomes `type:release`. The 13 branch types with no entry get one.
3. **T076 runs one way only:** `config.yml` is corrected to match `branch-types.yml`, never the reverse. Constitution v1.4.0, merged in #3732 on 2026-10-03, is the active authority for this direction.

The approver is named by login, @ashleyshaw, which is what the deletion gate checks (FR-016).

**Post-design re-check (2026-09-25, after the FR-011 rename clarifications)**: ✅ Compliant. Stage 0c changes only unlocked files on the audit branch. The rename in the locked `labels.yml` and `pr_aiops.md` waits for a new `[LABEL-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` (Principle II), and its ordering after the Stage 0b guard keeps automation from stripping labels (Principle VIII).

**Post-design re-check (2026-09-24, after FR-021 and FR-022 and the #3554 clarifications)**: ✅ Compliant, with one open gate: #3534 changes locked files and may merge only after #3556 and #3557 are approved (Principle II); auto-merge on #3534 must not merge it earlier. FR-022 keeps automation inside the approved label set (Principle VIII: auto-labelling applies only canonical labels). The FR-009 exemptions cover only changes that have their own approval or cannot delete anything.

**Earlier re-check (2026-09-24, after FR-018 to FR-020)**: ✅ Still compliant. Stage 0a's locked-file changes (T040b, PR #3534) follow the approved #3530 sign-off. Earlier re-check: Every change to a locked file is behind an approved change request; deletion is behind a per-repository approved dry run; no portable assets are added under `.github/`.

## Project Structure

### Documentation (this audit feature)

```text
.github/specs/008-label-audit-consolidation/
├── spec.md                              # Specification document
├── plan.md                              # This file (implementation plan)
├── research.md                          # Phase 0: Research findings & unknowns resolved
├── data-model.md                        # Phase 1: Entity catalog & label taxonomy
├── quickstart.md                        # Phase 1: Validation & testing guide
├── contracts/                           # Phase 1: Output format specifications
│   ├── audit-report-schema.md
│   ├── label-inventory-schema.md
│   ├── label-mapping-schema.md          # US4: mapping and linear-labels.json
│   ├── decision-issue-template.md       # US4: 06-decision.md content (U9)
│   ├── issue-types-org-settings.md      # US4: 25 issue types, descriptions, colours (FR-020)
│   └── dry-run-and-drift-report-schema.md  # US4: deletion dry run and drift report
├── checklists/
│   └── requirements.md                  # Quality validation checklist
└── tasks.md                             # Phase 2: Task decomposition (via /speckit-tasks)
```

### Audit Output (repository root: `.github/`)

```text
.github/
├── reports/
│   └── audits/
│       └── 2026-09-14-label-audit/          # Audit results directory
│           ├── 007-audit-report.md          # Main findings & summary
│           ├── label-inventory.csv          # Complete label catalog
│           ├── duplicates-analysis.md       # Consolidation recommendations
│           ├── workflow-analysis.md         # Archived workflow assessment
│           ├── evidence/
│           │   ├── label-mappings.json      # Source data comparisons
│           │   ├── missing-labels.json      # Labels in GitHub but not canonical
│           │   ├── mismatches.json          # Name/color inconsistencies
│           │   ├── linear-labels.json       # US4: Linear inventory and mapping
│           │   ├── linear-writes.jsonl       # US4: every Linear write (FR-023 point 5)
│           │   ├── linear-changes.jsonl      # US4: every Linear label change (FR-023 point 5)
│           │   ├── native-issue-types.json  # US4: organisation issue types (T040c, T041a)
│           │   ├── consolidation-log.jsonl   # US4: every destructive change (FR-023 point 10)
│           │   └── dry-run/{repo}.json      # US4: per-repository deletion dry runs
│           └── change-requests/             # US4: Stage 1 issue drafts (T046, T046b, T048, T049)
```

**Structure Decision**:

- **Documentation**: All specification, planning, and design artifacts reside in `.github/specs/008-label-audit-consolidation/` (per SpecKit convention)
- **Audit Output**: Final audit reports and findings stored in `.github/reports/audits/2026-09-14-label-audit/` (per repository governance for audit artifacts)
- **No source code development in the audit phase**: deliverables are reconciliation reports and recommendations
- **Consolidation changes (US4)**: `.github/labels.yml`, `.github/issue-types.yml`, `.github/ISSUE_TEMPLATE/06-decision.md` (replacing `06-question.md`), `.github/issue-fields.yml`, `.github/label-governance-policy.yml`, `.github/labeler.yml`, `.github/branch-labels.yml`, `.github/PULL_REQUEST_TEMPLATE/config.yml`, six locked PR templates, automation scripts that reference renamed labels (and the inventory token guard, T075), six docs files, a new scheduled drift-check workflow in `.github/workflows/`, and the OpenSpec → Spec Kit rename across live files

## Complexity Tracking

| Violation | Why it happened | Resolution |
| --- | --- | --- |
| Principle II: #3534 merged locked-file changes before #3556 and #3557 were fully approved | It merged within a minute of a maintainer's approval (2026-09-25 07:41 UTC); no required check covers the change-request approvals | Dated sign-off on #3556 and #3557, or a revert of the rejected part (see Constitution Check). Later locked-file PRs stay in draft until their requests are approved, and the T080 Locked Files Guard (#3734) fails any that are not, once T080a makes it a required check |

- Audit phase: read-only access to all configuration files; output is documentation plus structured data
- Consolidation phase: locked files change only through approved change requests (Principle II)
- The OpenSpec → Spec Kit rename touches about 454 files; it ships as its own PR so it can be reviewed separately from the label changes

## Consolidation Execution Plan (User Story 4)

Each stage starts only when the previous stage's exit check passes. Validation steps are in `quickstart.md` (Tests 9 to 17). Stages 3 to 5 follow the run-safety rules in FR-023 (research R21): they can be stopped and resumed, re-runs make no write, mutating calls are rate-limited, and every change is logged.

**Progress (2026-10-02)**:

| Stage | Status |
| --- | --- |
| 0a | Configuration done (#3534, merged 2026-09-25); full sign-off on #3556 and #3557 still to record; manual settings-page update (T040c) to do |
| 0b | Done (#3564, merged 2026-09-25); still in place after #3549 merged later that day (32 agent tests pass) |
| 0c | Done (in #3362) |
| 0 | T042 (Linear export, 294 labels) done in #3725. T041 and T041a run from @ashleyshaw's session with a fine-grained, read-only token (all `lightspeedwp` repositories, Issues and Metadata read, expiring in 7 days or less) in `LABEL_INVENTORY_TOKEN`, after T075 (#3734); the T071a App is for writes and the drift check only (FR-018). T082 confirms the `migrate:*` clean-up in Linear before T043 |
| 1 | Drafts done in #3725 (T046b template request for six templates, T048 OpenSpec migration, T049 deletion gate); waits on T040n, T046c (reopen #3554), T043 and T046, then T050 opens them |
| 3 prep | T062a write queue done in #3704 (not yet merged) |
| 2–6 | Not started |
| Phase 9 (convergence) | T074–T077 added 2026-10-02: routing labels (T074), inventory token guard (T075), `config.yml` reconciliation (T076), stage-one test upkeep (T077) |

| Stage | What happens | Gate / exit check | Requirements |
| --- | --- | --- | --- |
| 0a. Issue types and colours (configuration done in #3534; T040c to do) | PR updating `issue-types.yml` (25 entries with descriptions, Decision replaces Question) and `type:*` label colours in `labels.yml` from `contracts/issue-types-org-settings.md`, together with the Decision template and `issue-fields.yml`; then a manual update of the organisation's issue types page in the order given in the contract | for #3534, which merged on 2026-09-25 before approval, T040n's dated sign-off on #3556 and #3557 (or a revert of any rejected part); for every later locked-file PR, approval before merge (FR-009); configuration validation and `npm test` pass; settings page matches the contract (Test 10b) | FR-009, FR-014, FR-019, FR-020 |
| 0b. Labelling agent guard (done in #3564) | Separate fix PR (`fix/` branch): the agent stops removing labels for being outside `labels.yml`, honours `DRY_RUN`, and applies only `type:*` labels that exist in `labels.yml` | Test 16 passes; the agent's own tests pass | FR-017, FR-022 |
| 0c. Label names on the audit branch (done in #3362) | On `audit/label-consolidation`: replace `ai-ops`/`type:ai-ops` label names with `aiops`/`type:aiops` and `openspec:` with `spec:` in the spec 008 artefacts, the audit's analysis reports and recommendation files, `docs/LABEL_INVENTORY.md` and `docs/LABELING_FAQ.md`; add `target_name` to the four snapshot files (`canonical-labels.json`, `label-families.json`, `label-inventory.json`, `label-inventory.csv`) and a note in `evidence/README.md`; leave `renamed-label-references.json` unchanged. No locked file, script, workflow or test changes | Test 17 passes; the evidence test still passes | FR-011 |
| 0. Evidence | Paginated label inventory for every repository (after the T075 token guard); `evidence/linear-labels.json` with issue counts and proposed mappings (`contracts/label-mapping-schema.md`) | Mapping validation rules pass (Test 9); the inventory lists private repositories | FR-006, FR-010, FR-012, FR-018 |
| 1. Approve | Raise `[LABEL-UPDATE-REQUEST]` (mapping table, referencing #3554 for its five imports), `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` (Question → Decision), a `[LABEL-UPDATE-REQUEST]` for the 16 FR-011 prefix renames and the `spec:NNN` → `spec-id:NNN` move, a `[TEMPLATE-UPDATE-REQUEST]` for the six PR templates (`type:ai-ops` → `type:aiops`, `type:documentation` → `type:docs`, `meta:needs-review` removed) that also covers the routing files `branch-labels.yml` (T074) and `PULL_REQUEST_TEMPLATE/config.yml` (T076), locked since constitution v1.4.0, a migration issue for OpenSpec paths, and a new gate issue replacing #95; each waiting request carries `meta:needs-approval` once the label exists | @ashleyshaw approves all requests | FR-009, FR-011, FR-013, FR-014, FR-016, FR-021 |
| 2. Configuration PR | One PR: `labels.yml` (renames, imports including the five #3554 labels with the FR-012 colour rule, the `area:*` → `aiops:*` AI merges), `label-governance-policy.yml` (new gate issue, `enabled: false`), `labeler.yml`, `branch-labels.yml` (one canonical `type:*` label per branch type, matching its routed template: T074), `PULL_REQUEST_TEMPLATE/config.yml` (mirrors `branch-types.yml`: T076), scripts, workflows (including `orchestrate-phase-progression.yml`), validators (`validate-labeling-configs.cjs` prefix list) and tests referencing `ai-ops:` or `openspec:` labels, `pr_aiops.md`, the `spec:NNN` → `spec-id:NNN` move (`prd-combined-agent` plan, `bulk-label-issues.sh` and its test), the six docs files, and the FR-021 policy in `docs/LABEL_STRATEGY.md`. The `type:question` removal, `issue-types.yml`, `06-decision.md` and `issue-fields.yml` belong to Stage 0a; the never-delete list clean-up shipped in #3362 (T055 stays open only for `gated_by_issue`, which waits for the new gate issue) | Merges only after #3564 (Stage 0b), and its label renames are applied in GitHub (Stage 3) in the same session, so no item loses an `ai-ops:*` or `openspec:*` label. CI green; Test 10 and Test 15 pass | FR-011, FR-012, FR-014, FR-021 |
| 2b. Spec Kit rename PR | Separate PR for the OpenSpec → Spec Kit rename in live files and paths, with links updated | Test 11 passes | FR-013 |
| 3. GitHub changes | First turn off the GitHub issue sync in Linear for every synced team (T071, FR-017) and record the time on the gate issue, so the sync cannot add labels during Stages 3–5; it is turned back on when Stage 5 ends. Then, per repository: rename in place; create/update from `labels.yml`; relabel where the target already exists; convert open `type:question` issues to Discussions and relabel closed ones. Those conversions and fallback relabels are done by hand, so each is recorded through `label-consolidate.js record` (T062b) as an `intended` record before and a `done` record after, under the same run lock, and reconciled on resume like any other change. Organisation native issue types were already changed by hand in Stage 0a (T040c); this stage only verifies them (T064a/T064b). From this stage the labelling agent uses the approved mapping as its alias list (FR-022). Every change is logged to `evidence/consolidation-log.jsonl` as an `intended` record before the call and a `done` record after it; a stopped run resumes from the repositories without `executed_at` for its stage and first reconciles any `intended` record that has no `done` record | No issue left without exactly one `type:*` label; native issue types match `issue-types.yml`; every open `type:question` issue converted (T063) | FR-011, FR-012, FR-014, FR-015, FR-019, FR-022, FR-023 |
| 4. GitHub deletion | Starts only when every item in `checklists/destructive-changes.md` is reviewed (T064c). Per repository: generate dry run and snapshot; @ashleyshaw approves on the gate issue; run the deletion with `--apply --confirm-gate <gate issue>` (refused for unapproved repositories), which first re-reads the repository and skips it if anything differs from the approved dry run; `destructive_cleanup.enabled` stays `false` in the repository | Test 12 passes for every approved repository; unapproved repositories untouched; SC-011 and SC-012 hold | FR-016, FR-023 |
| 5. Linear clean-up | Relabel issues for merges and re-prefixes, retire zero-use and merged labels, team-scope project labels, update colours and descriptions (including `spec:*`). Labels are matched by ID and scope, and every issue write is logged to `evidence/linear-writes.jsonl` and every label change to `evidence/linear-changes.jsonl` (`intended` before the call, `done` after it) | Test 13 passes | FR-012, FR-015, FR-017, FR-023 |
| 6. Drift check | Enable the weekly scheduled workflow; run it once manually | "No drift" report (Test 14) | FR-017, SC-009 |

**Why this order**: The Linear GitHub integration copies GitHub labels into Linear (`status:done` was recreated in Linear on 2026-09-24). Finishing GitHub first stops Linear clean-up being undone. See research R3.

**Rollback**: Renames are reversed by renaming back. Deletions are reversed from the stage 4 snapshot (recreate the label, reapply it to the recorded issues). Linear retirements are reversed with restore. See research R8.

### Issue Type List (FR-020)

Full list: `contracts/issue-types-org-settings.md`: 25 names, labels, hex colours from `docs/LABEL_COLOR_STRATEGY.md`, native colour names (GitHub's issue types accept only named colours; Teal maps to green), descriptions, and the ordered steps for the organisation settings page.

### Decision Issue Template (U9)

Full contract: `contracts/decision-issue-template.md`.

- **File**: `.github/ISSUE_TEMPLATE/06-decision.md`, replacing `06-question.md`
- **Title**: `decision: {scope} - {short description}`
- **Default labels**: `type:decision`, `status:needs-triage`, `priority:normal`, `area:governance`
- **Recommended branch**: `docs/` (routes to `pr_docs.md`)
- **Sections**: Summary, Context, Options Considered, Decision, Consequences, Linked Work, then Definition of Ready and Definition of Done

---

## Phase 0: Outline & Research

### Research Tasks

No significant NEEDS CLARIFICATION markers in the specification. Technical approach is well-defined:

1. **Data Source Inventory** (Resolved)
   - Canonical labels: `.github/labels.yml` — 169 labels, 15 families, YAML format
   - Issue types: `.github/issue-types.yml` — 25 types (26 `type:*` labels in canonical until the FR-014 swap), YAML format
   - Governance policy: `.github/label-governance-policy.yml` — never-delete list, YAML format
   - Documentation: 18+ files in `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md`
   - Archived workflows: 11 YAML files in `.github/workflows/archived/2026-09-11/labeling/`
   - GitHub API: Current labels on lightspeedwp/.github repository

2. **Analysis Method** (Resolved)
   - Direct file comparison (canonical vs. policy vs. documentation)
   - Label family taxonomy extraction and validation
   - Duplicate detection algorithm (name similarity, semantic overlap)
   - Workflow code analysis (extract label references from archived workflows)
   - GitHub API query (identify labels not in canonical file — orphans)

3. **Evidence Collection** (Resolved)
   - All findings traceable to file path + line number
   - Structured output: JSON/CSV for machine consumption, Markdown for human review
   - Examples and quotations from source files for each finding

### Research Output: `research.md`

```markdown
# Research Findings: GitHub Label Audit

## Data Source Analysis

### Canonical Labels (labels.yml)
- **Total**: 169 labels across 15 families
- **Families**: status, priority, type, meta, release, area, comp, lang, env, compat, cpt, aiops (was `ai-ops`), contrib, discussion, spec (was `openspec`)
- **Format**: YAML key-value with name, color, description
- **Status**: Manually curated, locked, no recent changes

### Issue Types (issue-types.yml)
- **Total**: 25 types; 26 `type:*` labels in canonical today, 25 after the FR-014 swap
- **Mapping**: Each type maps to a `type:*` label
- **Constraint**: All 25 must exist in canonical labels.yml with matching name and color
- **Status**: Confirmed present and correct

### Governance Policy (label-governance-policy.yml)
- **Never-delete list**: 57 labels that must be preserved for compatibility
- **Includes labels**: Some not present in canonical labels.yml (gap identified)
- **Key mismatches**:
  - `type:documentation` in policy vs `type:docs` in canonical
  - `type:ai-ops` in policy vs `type:aiops` in canonical
  - Additional labels (type:maintenance, type:story, type:support, type:enhancement, type:help, type:investigation) in policy but missing from canonical

### Documentation Files
- **LABEL_STRATEGY.md**: Describes 8 label families; may have gaps
- **ISSUE_LABELS.md**: Documents issue labeling workflow
- **PR_LABELS.md**: Documents PR labeling workflow
- **Other ISSUE_*.md and PR_*.md**: Specific labeling guidance
- **Gap identified**: Documentation may reference labels not in canonical file

### Archived Workflows (11 files)
- **Purpose**: Automation for label management (issue labeling, PR labeling, meta-label sync, cleanup)
- **Status**: Disabled/archived due to functionality issues
- **Analysis needed**: Why each was archived and what automation gaps remain

### GitHub API Labels (Current State)
- **Query method**: `gh label list --repo lightspeedwp/.github`
- **Expected**: All current labels should be subset of canonical file
- **Analysis needed**: Identify any orphan/undocumented labels

## Key Unknowns Resolved

✅ All technical details confirmed; no ambiguities remain.

## Implementation Approach

1. **Phase 1 (Design)**: Create data model for label taxonomy, reconciliation logic, and output contracts
2. **Phase 2 (Tasks)**: Break down into specific analysis, documentation, and report-generation tasks
3. **Phase 3+ (Implementation)**: Execute analysis according to defined tasks, generate deliverables
```

---

## Phase 1: Design & Contracts

### Entity Catalog (`data-model.md`)

```markdown
# Label Audit Data Model

## Key Entities

### Label Family
- **Definition**: Top-level category for grouping related labels (status, priority, type, area, etc.)
- **Attributes**:
  - name: string (family name without trailing colon)
  - total_count: integer (number of labels in family)
  - description: string (family purpose)
  - is_fixed_family: boolean (true for type: family; changes only via FR-014)
  - source_file: string (canonical definition location)

### Label
- **Definition**: Individual GitHub label with metadata and usage information
- **Attributes**:
  - full_name: string (e.g., "status:in-progress")
  - family: string (category)
  - color: string (hex color code)
  - description: string (label purpose)
  - in_canonical_file: boolean
  - in_governance_policy: boolean
  - in_documentation: boolean
  - used_in_workflows: boolean (reference in archived workflows)
  - github_api_present: boolean (currently used on repository)
  - duplication_flag: string (if duplicate, reference to canonical variant)

### Reconciliation Finding
- **Definition**: Discrepancy identified between sources
- **Attributes**:
  - finding_type: enum (missing, misnamed, mismatched-color, duplicate, orphan)
  - source_label: string (label as it appears in source)
  - canonical_reference: string (how it should be)
  - affected_files: string[] (files where inconsistency appears)
  - impact_level: enum (critical, high, medium, low)
  - evidence: string (quotation or file reference)

### Workflow Analysis
- **Definition**: Assessment of archived labeling workflow
- **Attributes**:
  - workflow_file: string (path in workflows/archived/)
  - original_purpose: string (what it was meant to automate)
  - labels_referenced: string[] (labels it operated on)
  - failure_reason: string (why it was archived)
  - restoration_feasibility: enum (high, medium, low)
  - gap_filled_by: string or null (if covered by unified labeling agent)

## Relationships

- Label → Family (many-to-one)
- Label → Reconciliation Finding (one-to-many)
- Workflow Analysis → Label (many-to-many through labels_referenced)
```

### Output Contracts (`contracts/`)

```markdown
# Audit Report Schema (audit-report-schema.md)

## Structure

- **Header**: Audit date, scope, methodology
- **Executive Summary**: Key findings count, critical issues, summary recommendations
- **Label Inventory Section**: Complete catalog by family with counts and status
- **Findings Section**: 
  - Missing Labels (labels in GitHub API but not canonical)
  - Misnamed Labels (same label with different names across sources)
  - Duplicates (consolidation opportunities)
  - Governance Gaps (labels in policy but not implemented)
- **Workflow Analysis Section**: Status of each archived workflow
- **Recommendations Section**: Prioritized actions with impact assessment
- **Evidence Appendix**: Supporting data in JSON/CSV format

# Label Inventory Schema (label-inventory-schema.md)

## CSV Format

```

family,label_name,color,canonical_file,governance_policy,documentation,workflows,api_present,status
status,in-progress,1D76DB,yes,no,yes,yes,yes,CURRENT
type,documentation,9198A1,no,yes,yes,yes,no,DUPLICATE_OF_type:docs
area:ai,0F448A,C5DEF5,yes,no,yes,no,yes,MISMATCH

```

# Findings Evidence Schema (findings-evidence-schema.md)

## JSON Format per Finding

```json
{
  "finding_id": "F-001",
  "finding_type": "duplicate",
  "severity": "high",
  "title": "Type label naming inconsistency: documentation vs docs",
  "description": "...",
  "source_label": "type:documentation",
  "canonical_label": "type:docs",
  "evidence": {
    "in_governance_policy": {
      "file": ".github/label-governance-policy.yml",
      "line": 15,
      "text": "- type:documentation"
    },
    "in_canonical_file": {
      "file": ".github/labels.yml",
      "line": 183,
      "text": "- name: type:docs"
    },
    "in_issue_types": {
      "file": ".github/issue-types.yml",
      "line": 81,
      "text": "label: type:docs"
    }
  },
  "recommendation": "Governance policy should reference type:docs (canonical) not type:documentation"
}
```

```

### Validation Guide (`quickstart.md`)

```markdown
# Label Audit Validation Guide

## Quick Start: Verify Audit Findings

### Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Access to lightspeedwp/.github repository
- Bash shell for running commands

### Step 1: Extract Label Inventory

Run this to see all current labels on the repository:

\`\`\`bash
gh label list --repo lightspeedwp/.github --json name,color,description | jq .
\`\`\`

Compare output against:
- `.github/labels.yml` (canonical expected state)
- Audit report's label-inventory.csv (reconciliation findings)

**Pass Condition**: Every label in GitHub API output is documented in canonical file OR identified as an orphan/finding in the audit report.

### Step 2: Validate Type Labels (26 at the audit, 25 since Stage 0a)

Extract type labels from canonical file:

\`\`\`bash
grep "^- name: type:" .github/labels.yml | wc -l
# Should output: 25
\`\`\`

Verify each has a corresponding entry in issue-types.yml:

\`\`\`bash
grep "label: type:" .github/issue-types.yml | wc -l
# Should output: 25
\`\`\`

**Pass Condition**: Before consolidation, canonical outputs 26 and issue-types.yml 25 (difference is `type:decision`). After consolidation, both output exactly 25.

### Step 3: Verify Governance Policy Consistency

Check governance policy never-delete list against canonical file:

\`\`\`bash
# Extract labels from policy file
grep "^ *- " .github/label-governance-policy.yml | head -20

# Compare against canonical file for each label
# (audit report will have detailed findings)
\`\`\`

**Pass Condition**: All labels in policy are present in canonical file or documented as intentional gaps in audit report.

### Step 4: Test Archived Workflow Analysis

Examine each archived workflow file:

\`\`\`bash
ls -la .github/workflows/archived/2026-09-11/labeling/
\`\`\`

For each workflow, check if its functionality is covered by:
1. Current unified labeling agent (`labeling.agent.js`)
2. Active `.github/labeler.yml` file
3. GitHub Actions workflows in `.github/workflows/` (active)

**Pass Condition**: Each archived workflow has documented assessment in audit report with reasoning for archival.

### Step 5: Documentation Consistency

Spot-check 3 random label families mentioned in docs against canonical file:

\`\`\`bash
# Example: check "status" family size in docs vs canonical
grep "^- name: status:" .github/labels.yml | wc -l
# Compare against docs/LABEL_STRATEGY.md description
\`\`\`

**Pass Condition**: Documentation descriptions align with actual label count and purposes.

## Acceptance Criteria

✅ All 4 user stories from spec have independent tests (above)
✅ No NEEDS CLARIFICATION markers in findings
✅ Every finding includes evidence (file path + line number)
✅ Recommendations are actionable and prioritized
✅ Type family is 26 before consolidation and exactly 25 after (FR-014)
```

---

## Phase 1 Artifacts Generated

✅ **research.md** — Research findings and unknowns resolved
✅ **data-model.md** — Entity catalog for label audit domain
✅ **contracts/** — Output format specifications for audit reports, plus US4 contracts: label mapping, Decision issue template, dry-run and drift report, issue types list (names, descriptions, colours)
✅ **quickstart.md** — Validation & testing guide for audit completeness

---

**Next Step**: Run `/speckit-tasks` to add tasks for User Story 4 (stages 0 to 6) alongside the existing audit tasks.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
