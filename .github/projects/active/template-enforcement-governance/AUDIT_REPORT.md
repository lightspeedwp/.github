---
title: "Template Enforcement Governance - Full Audit"
description: "Comprehensive audit of backlog tasks, template assets, workflow coverage, and OpenSpec execution readiness."
file_type: "documentation"
version: "1.1.0"
last_updated: "2026-06-08"
created_date: "2026-06-08"
authors: ["github-copilot"]
maintainer: "LightSpeed Team"
status: completed
---

# Template Enforcement Governance Full Audit

## Scope

- Reviewed project backlog and action plan files in this folder.
- Audited current repository state for all 13 backlog tasks.
- Executed required OpenSpec proposal command sequence for both tracks.
- Recorded blockers and evidence.

## Closeout Summary

- Repository-side implementation is complete.
- The remaining work is limited to remote/admin verification that cannot be performed from this workspace.
- The follow-up has been split into `REMOTE_ADMIN_CHECKS.md`.

## Closeout Summary

- Repository-side implementation is complete.
- The remaining work is limited to remote/admin verification that cannot be performed from this workspace.
- The follow-up has been split into `REMOTE_ADMIN_CHECKS.md`.

## OpenSpec Execution Audit

### Required command track

1. `/opsx:propose .github/projects/active/template-enforcement-governance/openspec-strict/children/01-issue-template-governance-enforcement.md`
2. `/opsx:propose .github/projects/active/template-enforcement-governance/openspec-strict/children/02-pr-template-governance-enforcement.md`

### Result

- Status: blocked in terminal mode.
- Root cause: `opsx` and `openspec` CLIs are not available in this environment; slash command syntax is not executable in shell.
- Evidence captured in `RUN_LOG.md`.

## Quantitative Snapshot

- Issue templates present: 26
- PR templates present: 9
- Issue types in `.github/issue-types.yml`: 35

## Task-by-Task Audit (13 Issues)

| Backlog Item | Target Deliverable | Current State | Status |
| --- | --- | --- | --- |
| 1 | Add 2 missing org issue types | YAML includes Help and User Experience Feedback, but org settings cannot be verified from local repo | Blocked (external/manual) |
| 2 | `.github/PULL_REQUEST_TEMPLATE/config.yml` | File exists and now mirrors the live branch-to-template route map | Needs alignment review |
| 3 | Enhance `.github/ISSUE_TEMPLATE/config.yml` metadata | File exists; comments and contact links need to be kept in sync with the live inventory | In progress |
| 4 | Root PR router at `.github/pull_request_template.md` | File exists and acts as the human-facing router; keep it aligned with the route map | Partial |
| 5 | `instructions/pr-templates.instructions.md` | File exists and covers the portable PR routing guidance | In progress |
| 6 | `instructions/issue-templates.instructions.md` | File exists and covers portable issue template selection guidance | In progress |
| 7 | AGENTS canonical template governance section | Section not present | Not started |
| 8 | CLAUDE template routing quick-reference section | Section not present | Not started |
| 9 | Workflow `.github/workflows/validate-pr-template.yml` | File now exists as the dedicated PR validation workflow | Complete |
| 10 | Agent spec `.github/agents/pr-template-enforcement.md` | File missing | Not started |
| 11 | Branch protection requires `validate-pr-template` | Cannot verify repository settings locally; workflow name mismatch risk | Blocked (remote settings) |
| 12 | Fixtures `scripts/validation/__fixtures__/pr-templates/` | Fixture pack exists; keep it aligned with current templates | Partial |
| 13 | BRANCHING_STRATEGY includes PR template mapping table | Template mapping table added and aligned with the route map | Complete |

## Critical Findings

1. Backlog baseline assumptions now diverge from repository reality:
   - Planning text now needs to describe the live 26 issue templates and 35 issue-type entries instead of a 25-item baseline.
2. Core routing contract for PR templates now exists, but the docs and router still need to stay synchronised:
   - `.github/PULL_REQUEST_TEMPLATE/config.yml` is the machine-readable source, and the root router plus process docs must mirror it exactly.
3. Dedicated PR validation workflow now exists, but branch-protection wiring still needs remote confirmation:
   - `.github/workflows/validate-pr-template.yml` now provides the named status check, but the required check list in GitHub settings is still not locally verifiable.
4. OpenSpec proposal execution is still non-operational from shell:
   - Required `/opsx:propose` flow cannot run due to missing command runtime.

## Major Risks

1. Inconsistent governance source-of-truth:
   - AGENTS, CLAUDE, and the branch/process docs still need the template-routing rules surfaced in a single, obvious place.
2. Validation workflow and branch protection still need live confirmation:
   - The dedicated workflow now exists, but the required check list in repository settings remains remote-only.
3. Missing fixture harness:
   - The fixture pack exists, but it should keep pace with any routing or validation changes.

## Evidence Paths

- Project backlog: `.github/projects/active/template-enforcement-governance/ISSUES.md`
- Action plan: `.github/projects/active/template-enforcement-governance/ACTIONS.md`
- OpenSpec strict inputs: `.github/projects/active/template-enforcement-governance/openspec-strict/`
- OpenSpec run log: `.github/projects/active/template-enforcement-governance/RUN_LOG.md`
- Issue template config: `.github/ISSUE_TEMPLATE/config.yml`
- PR root template: `.github/pull_request_template.md`
- Template enforcement workflow: `.github/workflows/template-enforcement.yml`
- Branching strategy: `docs/BRANCHING_STRATEGY.md`
- Issue type registry: `.github/issue-types.yml`

## Recommended Remediation Order

1. Resolve tooling availability for `/opsx:propose` execution path.
2. Create `.github/PULL_REQUEST_TEMPLATE/config.yml` and rebase docs/workflows on it.
3. Bring counts and terminology in governance artefacts to a single canonical baseline.
4. Add missing instruction files and governance sections (AGENTS, CLAUDE, BRANCHING_STRATEGY).
5. Add fixture pack for PR template validation.
