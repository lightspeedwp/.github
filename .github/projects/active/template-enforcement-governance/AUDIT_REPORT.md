---
title: "Template Enforcement Governance - Full Audit"
description: "Comprehensive audit of backlog tasks, template assets, workflow coverage, and OpenSpec execution readiness."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-08"
authors: ["github-copilot"]
maintainer: "LightSpeed Team"
status: active
---

# Template Enforcement Governance Full Audit

## Scope

- Reviewed project backlog and action plan files in this folder.
- Audited current repository state for all 13 backlog tasks.
- Executed required OpenSpec proposal command sequence for both tracks.
- Recorded blockers and evidence.

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
| 2 | `.github/PULL_REQUEST_TEMPLATE/config.yml` | File missing | Not started |
| 3 | Enhance `.github/ISSUE_TEMPLATE/config.yml` metadata | File exists but only minimal keys (`blank_issues_enabled`, `contact_links`) | Not started |
| 4 | Root PR router at `.github/pull_request_template.md` | File exists but remains general template, not branch router | Partial |
| 5 | `instructions/pr-templates.instructions.md` | File missing | Not started |
| 6 | `instructions/issue-templates.instructions.md` | File missing | Not started |
| 7 | AGENTS canonical template governance section | Section not present | Not started |
| 8 | CLAUDE template routing quick-reference section | Section not present | Not started |
| 9 | Workflow `.github/workflows/validate-pr-template.yml` | File missing; related checks live in `.github/workflows/template-enforcement.yml` | Partial (different implementation path) |
| 10 | Agent spec `.github/agents/pr-template-enforcement.md` | File missing | Not started |
| 11 | Branch protection requires `validate-pr-template` | Cannot verify repository settings locally; workflow name mismatch risk | Blocked (remote settings) |
| 12 | Fixtures `.github/tests/fixtures/pr-templates/` | Path missing | Not started |
| 13 | BRANCHING_STRATEGY includes PR template mapping table | No PR template mapping section/table found | Not started |

## Critical Findings

1. Backlog baseline assumptions now diverge from repository reality:
   - Planning text repeatedly references 25 issue types/templates alignment, while current repo has 26 issue templates and 35 issue-type entries.
2. Core routing contract for PR templates is absent:
   - `.github/PULL_REQUEST_TEMPLATE/config.yml` does not exist, so branch-to-template routing has no canonical machine-readable source.
3. OpenSpec proposal execution is currently non-operational from shell:
   - Required `/opsx:propose` flow cannot run due to missing command runtime.

## Major Risks

1. Inconsistent governance source-of-truth:
   - AGENTS, CLAUDE, and BRANCHING_STRATEGY do not expose the template-routing rules requested by the backlog.
2. Validation workflow naming mismatch:
   - Backlog expects `validate-pr-template.yml` and status check `validate-pr-template`; implementation currently exists in `template-enforcement.yml` and may not map cleanly to branch-protection expectations.
3. Missing fixture harness:
   - No PR template fixture set exists for deterministic validation regression tests.

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
