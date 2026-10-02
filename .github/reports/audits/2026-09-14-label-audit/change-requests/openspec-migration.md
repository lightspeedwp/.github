# chore: spec - Rename OpenSpec paths to Spec Kit

> Draft issue body for spec 008 task T048 (FR-013). Not opened yet: T050 opens it after Stage 0 evidence and the Stage 1 approvals. Generated from `git ls-files` on `develop` (`d9c27f5a`) on 2026-10-01.

## Chore Summary

Migration issue for the OpenSpec → Spec Kit rename (spec 008 FR-013, Stage 2b). The repository no longer uses OpenSpec; specifications are produced with Spec Kit under `.github/specs/`. This issue lists every live path that contains `openspec`, the path it moves to, and the rule that decides it, so the rename PR (tasks T060 and T061) can be reviewed against an approved list.

- 149 live paths contain `openspec` (excluding `*/reports/*`, `*/archived/*` and `node_modules/`).
- 116 follow the agreed T048 rules, 33 need a decision (marked **Proposed** below). No path is left unchanged.
- 468 live files mention OpenSpec in their content. T061 replaces those references with `speckit` (the tool and process) or `spec` / `specs` (artefacts and labels). Label names themselves (`openspec:*` → `spec:*`) change in the Stage 2 configuration PR, not here (FR-011).

## Linked Stories/Tasks/PRs

- Spec: `.github/specs/008-label-audit-consolidation/spec.md` (FR-013), tasks T048, T050, T060, T061
- Depends on: the Stage 2 configuration PR (T059), because both touch files such as `scripts/validation/__tests__/openspec-labels.test.js`
- Related: #2385 (pending OpenSpec namespace work)
- Parent: #449

## Milestones & Timeline

- Approve before the Stage 2b rename PR is opened.
- The rename PR merges after the Stage 2 configuration PR.

## Scope / Affected Areas

Rules (T048):

1. `OPENSPEC*.md` → `SPEC*.md`, in place.
2. `skills/openspec-estimate-planner/` → `skills/speckit-estimate-planner/`.
3. The root `openspec` symlink is removed, and its target `.github/projects/active/openspec/` is renamed to `.github/projects/active/speckit-changes/`.

Proposed for the paths the rules do not cover (needs approval):

- `openspec-methodology-summary.md` (in the skill's `references/`) → `speckit-methodology-summary.md`.
- Folders `openspec-labels-automation/` → `spec-labels-automation/` and `openspec-strict/` → `spec-strict/`.
- `openspec.json` → `spec.json`, `.openspec.yml` / `.openspec.yaml` → `.spec.yml` / `.spec.yaml`, and `PHASE2_OPENSPEC.md` → `PHASE2_SPEC.md`.
- `scripts/validation/__tests__/openspec-labels.test.js` → `spec-labels.test.js`. This is renamed after the Stage 2 configuration PR has updated its contents.

Out of scope: `*/reports/*` and `*/archived/*` (historical records keep their names), label names (Stage 2), and the Linear `spec:*` descriptions (Stage 5).

## Steps / Checklist

- [ ] @ashleyshaw approves the rules and the **Proposed** rows (comment on this issue)
- [ ] Rename every path below with `git mv` (T060)
- [ ] Update every link to a renamed path (T060)
- [ ] Replace OpenSpec text references in live files (T061)
- [ ] Run quickstart Test 11
- [ ] Open the rename PR from a `chore/` branch, separately from the configuration PR

## Acceptance Criteria

- [ ] No live path contains `openspec` (quickstart Test 11)
- [ ] No link points to an old path
- [ ] No live file mentions OpenSpec, including files that describe the history of the rename — historical wording lives only under `*/reports/*` or `*/archived/*` (FR-013, quickstart Test 11)
- [ ] `*/reports/*` and `*/archived/*` are unchanged

## Additional Context

### Path mapping (149 paths)

| Current path | New path | Rule |
| --- | --- | --- |
| `.github/projects/_templates/OPENSPEC_TEMPLATE.md` | `.github/projects/_templates/SPEC_TEMPLATE.md` | T048 rule |
| `.github/projects/active/adr-agent-portability-org/OPENSPEC.md` | `.github/projects/active/adr-agent-portability-org/SPEC.md` | T048 rule |
| `.github/projects/active/agent-skills-standards-comprehensive/OPENSPEC.md` | `.github/projects/active/agent-skills-standards-comprehensive/SPEC.md` | T048 rule |
| `.github/projects/active/agent-standards-initiative/OPENSPEC.md` | `.github/projects/active/agent-standards-initiative/SPEC.md` | T048 rule |
| `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/OPENSPEC_REQUIREMENTS.md` | `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/SPEC_REQUIREMENTS.md` | T048 rule |
| `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/openspec.json` | `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/spec.json` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/badges-workflow-integration-2026-08-08/OPENSPEC.md` | `.github/projects/active/badges-workflow-integration-2026-08-08/SPEC.md` | T048 rule |
| `.github/projects/active/badges-workflow-integration-2026-08-08/OPENSPEC_ANALYSIS.md` | `.github/projects/active/badges-workflow-integration-2026-08-08/SPEC_ANALYSIS.md` | T048 rule |
| `.github/projects/active/branch-naming-enforcement-2026-08-11/OPENSPEC.md` | `.github/projects/active/branch-naming-enforcement-2026-08-11/SPEC.md` | T048 rule |
| `.github/projects/active/branch-naming-enforcement-phases-6-7/OPENSPEC.md` | `.github/projects/active/branch-naming-enforcement-phases-6-7/SPEC.md` | T048 rule |
| `.github/projects/active/changelog-automation-hardening/OPENSPEC.md` | `.github/projects/active/changelog-automation-hardening/SPEC.md` | T048 rule |
| `.github/projects/active/changelog-automation-hardening/OPENSPEC_2026-09-03.md` | `.github/projects/active/changelog-automation-hardening/SPEC_2026-09-03.md` | T048 rule |
| `.github/projects/active/develop-branch-stability-2026-08-10/OPENSPEC_ANALYSIS.md` | `.github/projects/active/develop-branch-stability-2026-08-10/SPEC_ANALYSIS.md` | T048 rule |
| `.github/projects/active/github-actions-v7-upgrade-2026-08-09/OPENSPEC_ANALYSIS.md` | `.github/projects/active/github-actions-v7-upgrade-2026-08-09/SPEC_ANALYSIS.md` | T048 rule |
| `.github/projects/active/github-projects-creation-system/OPENSPEC.md` | `.github/projects/active/github-projects-creation-system/SPEC.md` | T048 rule |
| `.github/projects/active/issue-and-pr-template-improvements/.openspec.yml` | `.github/projects/active/issue-and-pr-template-improvements/.spec.yml` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/issue-maintenance-phase-5-2-staging-2026-08-12/OPENSPEC.md` | `.github/projects/active/issue-maintenance-phase-5-2-staging-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/issue-maintenance-phase-5-3-production-readiness-2026-08-12/OPENSPEC.md` | `.github/projects/active/issue-maintenance-phase-5-3-production-readiness-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/issue-maintenance-phase-5-planning-2026-08-11/OPENSPEC.md` | `.github/projects/active/issue-maintenance-phase-5-planning-2026-08-11/SPEC.md` | T048 rule |
| `.github/projects/active/issue-maintenance-scripts-2026-08-10/OPENSPEC.md` | `.github/projects/active/issue-maintenance-scripts-2026-08-10/SPEC.md` | T048 rule |
| `.github/projects/active/issue-management-agent-planning-2026-08-12/OPENSPEC.md` | `.github/projects/active/issue-management-agent-planning-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/issue-management-audit-polish-2026-08-27/OPENSPEC.md` | `.github/projects/active/issue-management-audit-polish-2026-08-27/SPEC.md` | T048 rule |
| `.github/projects/active/issue-metadata-triage-expansion/OPENSPEC.md` | `.github/projects/active/issue-metadata-triage-expansion/SPEC.md` | T048 rule |
| `.github/projects/active/issue-triage-automation-system/OPENSPEC.md` | `.github/projects/active/issue-triage-automation-system/SPEC.md` | T048 rule |
| `.github/projects/active/issue-type-workflow-automation/OPENSPEC.md` | `.github/projects/active/issue-type-workflow-automation/SPEC.md` | T048 rule |
| `.github/projects/active/label-prefix-audit-2026-08-05/OPENSPEC.md` | `.github/projects/active/label-prefix-audit-2026-08-05/SPEC.md` | T048 rule |
| `.github/projects/active/label-prefix-audit-2026-08-05/OPENSPEC_COMPLETE.md` | `.github/projects/active/label-prefix-audit-2026-08-05/SPEC_COMPLETE.md` | T048 rule |
| `.github/projects/active/label-prefix-enforcement-2026-08-05/OPENSPEC.md` | `.github/projects/active/label-prefix-enforcement-2026-08-05/SPEC.md` | T048 rule |
| `.github/projects/active/label-prefix-enforcement-2026-08-05/OPENSPEC_RFC_REFINED.md` | `.github/projects/active/label-prefix-enforcement-2026-08-05/SPEC_RFC_REFINED.md` | T048 rule |
| `.github/projects/active/label-prefix-enforcement-2026-08-05/PHASE2_OPENSPEC.md` | `.github/projects/active/label-prefix-enforcement-2026-08-05/PHASE2_SPEC.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/labeling-consolidation-2026-09-03/OPENSPEC.md` | `.github/projects/active/labeling-consolidation-2026-09-03/SPEC.md` | T048 rule |
| `.github/projects/active/linting-agent-2026-08-12/OPENSPEC.md` | `.github/projects/active/linting-agent-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/markdown-audit-ci-optimization/OPENSPEC.md` | `.github/projects/active/markdown-audit-ci-optimization/SPEC.md` | T048 rule |
| `.github/projects/active/meta-agent-v2-2026-08-12/OPENSPEC_VALIDATION.md` | `.github/projects/active/meta-agent-v2-2026-08-12/SPEC_VALIDATION.md` | T048 rule |
| `.github/projects/active/metrics-agent-specification-2026-08-12/OPENSPEC.md` | `.github/projects/active/metrics-agent-specification-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/milestone-automation/OPENSPEC.md` | `.github/projects/active/milestone-automation/SPEC.md` | T048 rule |
| `.github/projects/active/milestone-planning-v1/OPENSPEC.md` | `.github/projects/active/milestone-planning-v1/SPEC.md` | T048 rule |
| `.github/projects/active/nodejs-upgrade-2026-q3-post-merge-monitoring/OPENSPEC.md` | `.github/projects/active/nodejs-upgrade-2026-q3-post-merge-monitoring/SPEC.md` | T048 rule |
| `.github/projects/active/nodejs-upgrade-2026-q3/OPENSPEC.md` | `.github/projects/active/nodejs-upgrade-2026-q3/SPEC.md` | T048 rule |
| `.github/projects/active/openspec-labels-automation/AUDIT-VERIFICATION-2026-08-21.md` | `.github/projects/active/spec-labels-automation/AUDIT-VERIFICATION-2026-08-21.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-2-SUMMARY-operations.md` | `.github/projects/active/spec-labels-automation/PHASE-2-SUMMARY-operations.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-2-SUMMARY.md` | `.github/projects/active/spec-labels-automation/PHASE-2-SUMMARY.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-3-HANDOFF-operations.md` | `.github/projects/active/spec-labels-automation/PHASE-3-HANDOFF-operations.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-3-HANDOFF.md` | `.github/projects/active/spec-labels-automation/PHASE-3-HANDOFF.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-3-IMPLEMENTATION-COMPLETE.md` | `.github/projects/active/spec-labels-automation/PHASE-3-IMPLEMENTATION-COMPLETE.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-4-ARCHITECTURE.md` | `.github/projects/active/spec-labels-automation/PHASE-4-ARCHITECTURE.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PHASE-4-IMPLEMENTATION-PLAN.md` | `.github/projects/active/spec-labels-automation/PHASE-4-IMPLEMENTATION-PLAN.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PLANNING.md` | `.github/projects/active/spec-labels-automation/PLANNING.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/PROJECT-COMPLETION-REPORT.md` | `.github/projects/active/spec-labels-automation/PROJECT-COMPLETION-REPORT.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec-labels-automation/README.md` | `.github/projects/active/spec-labels-automation/README.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec/COORDINATION_PLAN.md` | `.github/projects/active/speckit-changes/COORDINATION_PLAN.md` | T048 rule |
| `.github/projects/active/openspec/OPENSPEC.md` | `.github/projects/active/speckit-changes/SPEC.md` | T048 rule |
| `.github/projects/active/openspec/PHASE-2-SUMMARY.md` | `.github/projects/active/speckit-changes/PHASE-2-SUMMARY.md` | T048 rule |
| `.github/projects/active/openspec/PHASE-2-TEMPLATE-VALIDATION.md` | `.github/projects/active/speckit-changes/PHASE-2-TEMPLATE-VALIDATION.md` | T048 rule |
| `.github/projects/active/openspec/PHASE-3-HANDOFF.md` | `.github/projects/active/speckit-changes/PHASE-3-HANDOFF.md` | T048 rule |
| `.github/projects/active/openspec/PHASE-3-IMPLEMENTATION-STARTED.md` | `.github/projects/active/speckit-changes/PHASE-3-IMPLEMENTATION-STARTED.md` | T048 rule |
| `.github/projects/active/openspec/PLANNING.md` | `.github/projects/active/speckit-changes/PLANNING.md` | T048 rule |
| `.github/projects/active/openspec/README.md` | `.github/projects/active/speckit-changes/README.md` | T048 rule |
| `.github/projects/active/openspec/RFC.md` | `.github/projects/active/speckit-changes/RFC.md` | T048 rule |
| `.github/projects/active/openspec/changes/agent-tool-permission-alignment/.openspec.yaml` | `.github/projects/active/speckit-changes/changes/agent-tool-permission-alignment/.spec.yaml` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec/changes/agent-tool-permission-alignment/design.md` | `.github/projects/active/speckit-changes/changes/agent-tool-permission-alignment/design.md` | T048 rule |
| `.github/projects/active/openspec/changes/agent-tool-permission-alignment/proposal.md` | `.github/projects/active/speckit-changes/changes/agent-tool-permission-alignment/proposal.md` | T048 rule |
| `.github/projects/active/openspec/changes/agent-tool-permission-alignment/specs/agent-tool-permission-contract/spec.md` | `.github/projects/active/speckit-changes/changes/agent-tool-permission-alignment/specs/agent-tool-permission-contract/spec.md` | T048 rule |
| `.github/projects/active/openspec/changes/agent-tool-permission-alignment/tasks.md` | `.github/projects/active/speckit-changes/changes/agent-tool-permission-alignment/tasks.md` | T048 rule |
| `.github/projects/active/openspec/changes/archive/.gitkeep` | `.github/projects/active/speckit-changes/changes/archive/.gitkeep` | T048 rule |
| `.github/projects/active/openspec/changes/chat-closure-agent/design.md` | `.github/projects/active/speckit-changes/changes/chat-closure-agent/design.md` | T048 rule |
| `.github/projects/active/openspec/changes/chat-closure-agent/proposal.md` | `.github/projects/active/speckit-changes/changes/chat-closure-agent/proposal.md` | T048 rule |
| `.github/projects/active/openspec/changes/chat-closure-agent/specs/chat-closure-agent/spec.md` | `.github/projects/active/speckit-changes/changes/chat-closure-agent/specs/chat-closure-agent/spec.md` | T048 rule |
| `.github/projects/active/openspec/changes/phase-2-task-planning-agents-implementation/.openspec.yaml` | `.github/projects/active/speckit-changes/changes/phase-2-task-planning-agents-implementation/.spec.yaml` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec/changes/phase-2-task-planning-agents-implementation/design.md` | `.github/projects/active/speckit-changes/changes/phase-2-task-planning-agents-implementation/design.md` | T048 rule |
| `.github/projects/active/openspec/changes/phase-2-task-planning-agents-implementation/proposal.md` | `.github/projects/active/speckit-changes/changes/phase-2-task-planning-agents-implementation/proposal.md` | T048 rule |
| `.github/projects/active/openspec/changes/portable-prompt-engineer-agent/PHASE_2_STATUS.md` | `.github/projects/active/speckit-changes/changes/portable-prompt-engineer-agent/PHASE_2_STATUS.md` | T048 rule |
| `.github/projects/active/openspec/changes/portable-prompt-engineer-agent/PHASE_3_PLAN.md` | `.github/projects/active/speckit-changes/changes/portable-prompt-engineer-agent/PHASE_3_PLAN.md` | T048 rule |
| `.github/projects/active/openspec/changes/portable-prompt-engineer-agent/README.md` | `.github/projects/active/speckit-changes/changes/portable-prompt-engineer-agent/README.md` | T048 rule |
| `.github/projects/active/openspec/changes/portable-prompt-engineer-agent/tasks.md` | `.github/projects/active/speckit-changes/changes/portable-prompt-engineer-agent/tasks.md` | T048 rule |
| `.github/projects/active/openspec/changes/pr-creation-agent/.openspec.yaml` | `.github/projects/active/speckit-changes/changes/pr-creation-agent/.spec.yaml` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec/changes/pr-creation-agent/README.md` | `.github/projects/active/speckit-changes/changes/pr-creation-agent/README.md` | T048 rule |
| `.github/projects/active/openspec/changes/pr-creation-agent/tasks.md` | `.github/projects/active/speckit-changes/changes/pr-creation-agent/tasks.md` | T048 rule |
| `.github/projects/active/openspec/changes/scripts-consolidation-audit/README.md` | `.github/projects/active/speckit-changes/changes/scripts-consolidation-audit/README.md` | T048 rule |
| `.github/projects/active/openspec/changes/test-coverage-implementation/.openspec.yaml` | `.github/projects/active/speckit-changes/changes/test-coverage-implementation/.spec.yaml` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/openspec/changes/test-coverage-implementation/README.md` | `.github/projects/active/speckit-changes/changes/test-coverage-implementation/README.md` | T048 rule |
| `.github/projects/active/openspec/changes/test-coverage-implementation/design.md` | `.github/projects/active/speckit-changes/changes/test-coverage-implementation/design.md` | T048 rule |
| `.github/projects/active/openspec/changes/test-coverage-implementation/proposal.md` | `.github/projects/active/speckit-changes/changes/test-coverage-implementation/proposal.md` | T048 rule |
| `.github/projects/active/openspec/changes/test-coverage-implementation/specs/coverage-programme-issue-chain/spec.md` | `.github/projects/active/speckit-changes/changes/test-coverage-implementation/specs/coverage-programme-issue-chain/spec.md` | T048 rule |
| `.github/projects/active/openspec/changes/test-coverage-implementation/tasks.md` | `.github/projects/active/speckit-changes/changes/test-coverage-implementation/tasks.md` | T048 rule |
| `.github/projects/active/openspec/config.yaml` | `.github/projects/active/speckit-changes/config.yaml` | T048 rule |
| `.github/projects/active/openspec/specs/.gitkeep` | `.github/projects/active/speckit-changes/specs/.gitkeep` | T048 rule |
| `.github/projects/active/phase-2b-skills-audit/OPENSPEC.md` | `.github/projects/active/phase-2b-skills-audit/SPEC.md` | T048 rule |
| `.github/projects/active/phase-2c-script-optimization/OPENSPEC.md` | `.github/projects/active/phase-2c-script-optimization/SPEC.md` | T048 rule |
| `.github/projects/active/phase-5-goal-2-agent-spec-generator-cli-2026-09-02/OPENSPEC.md` | `.github/projects/active/phase-5-goal-2-agent-spec-generator-cli-2026-09-02/SPEC.md` | T048 rule |
| `.github/projects/active/phase-5-goal-4-operational-monitoring/OPENSPEC.md` | `.github/projects/active/phase-5-goal-4-operational-monitoring/SPEC.md` | T048 rule |
| `.github/projects/active/portable-task-planning-agents-2026-08-12/OPENSPEC.md` | `.github/projects/active/portable-task-planning-agents-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/portable-task-planning-agents-2026-08-12/OPENSPEC_DESIGN.md` | `.github/projects/active/portable-task-planning-agents-2026-08-12/SPEC_DESIGN.md` | T048 rule |
| `.github/projects/active/portable-task-planning-agents-2026-08-12/OPENSPEC_PROPOSAL.md` | `.github/projects/active/portable-task-planning-agents-2026-08-12/SPEC_PROPOSAL.md` | T048 rule |
| `.github/projects/active/pr-creation-agent-design-2026-08-12/OPENSPEC.md` | `.github/projects/active/pr-creation-agent-design-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/pr-creation-agent-phase-2-2026-08-12/OPENSPEC.md` | `.github/projects/active/pr-creation-agent-phase-2-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/pr-finalisation-workflow/OPENSPEC.md` | `.github/projects/active/pr-finalisation-workflow/SPEC.md` | T048 rule |
| `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/OPENSPEC-PROJECT.md` | `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/SPEC-PROJECT.md` | T048 rule |
| `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/OPENSPEC.md` | `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/SPEC.md` | T048 rule |
| `.github/projects/active/pr-labeling-enforcement-issue-2352-plan/OPENSPEC_STATUS_FRAMEWORK.md` | `.github/projects/active/pr-labeling-enforcement-issue-2352-plan/SPEC_STATUS_FRAMEWORK.md` | T048 rule |
| `.github/projects/active/pr-review-project-planning-2026-08-04/OPENSPEC.md` | `.github/projects/active/pr-review-project-planning-2026-08-04/SPEC.md` | T048 rule |
| `.github/projects/active/prd-combined-agent/OPENSPEC.md` | `.github/projects/active/prd-combined-agent/SPEC.md` | T048 rule |
| `.github/projects/active/project-maintenance-agent-phase-1-2026-08-12/OPENSPEC.md` | `.github/projects/active/project-maintenance-agent-phase-1-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/OPENSPEC.md` | `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/OPENSPEC_ALIGNMENT.md` | `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/SPEC_ALIGNMENT.md` | T048 rule |
| `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/OPENSPEC_FLESHED_OUT.md` | `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/SPEC_FLESHED_OUT.md` | T048 rule |
| `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/OPENSPEC_IMPLEMENTATION_VALIDATION.md` | `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/SPEC_IMPLEMENTATION_VALIDATION.md` | T048 rule |
| `.github/projects/active/release-agentic-workflows-2026-08-11/OPENSPEC.md` | `.github/projects/active/release-agentic-workflows-2026-08-11/SPEC.md` | T048 rule |
| `.github/projects/active/release-process-redesign-2026-08-05/OPENSPEC.md` | `.github/projects/active/release-process-redesign-2026-08-05/SPEC.md` | T048 rule |
| `.github/projects/active/release-process-redesign-2026-08-05/OPENSPEC_ANALYSIS_REPORT.md` | `.github/projects/active/release-process-redesign-2026-08-05/SPEC_ANALYSIS_REPORT.md` | T048 rule |
| `.github/projects/active/release-process-redesign-2026-08-05/OPENSPEC_ISSUES_SUMMARY.md` | `.github/projects/active/release-process-redesign-2026-08-05/SPEC_ISSUES_SUMMARY.md` | T048 rule |
| `.github/projects/active/release-process-redesign-2026-08-05/OPENSPEC_REVALIDATION_PHASE_5-7.md` | `.github/projects/active/release-process-redesign-2026-08-05/SPEC_REVALIDATION_PHASE_5-7.md` | T048 rule |
| `.github/projects/active/release-process-redesign-2026-08-05/OPENSPEC_SETUP.md` | `.github/projects/active/release-process-redesign-2026-08-05/SPEC_SETUP.md` | T048 rule |
| `.github/projects/active/release-workflow-authorization-fixes/OPENSPEC.md` | `.github/projects/active/release-workflow-authorization-fixes/SPEC.md` | T048 rule |
| `.github/projects/active/repo-restructuring-2026-07-25/OPENSPEC.md` | `.github/projects/active/repo-restructuring-2026-07-25/SPEC.md` | T048 rule |
| `.github/projects/active/reports-projects-restructuring-2026-08-11/OPENSPEC.md` | `.github/projects/active/reports-projects-restructuring-2026-08-11/SPEC.md` | T048 rule |
| `.github/projects/active/repository-maintenance-infrastructure/OPENSPEC.md` | `.github/projects/active/repository-maintenance-infrastructure/SPEC.md` | T048 rule |
| `.github/projects/active/repository-restructuring-phase-1/OPENSPEC.md` | `.github/projects/active/repository-restructuring-phase-1/SPEC.md` | T048 rule |
| `.github/projects/active/reusable-prompts/openspec.json` | `.github/projects/active/reusable-prompts/spec.json` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/reviewer-agent-v2-2026-08/OPENSPEC_INPUT.md` | `.github/projects/active/reviewer-agent-v2-2026-08/SPEC_INPUT.md` | T048 rule |
| `.github/projects/active/reviewer-agent-v2-2026-08/OPENSPEC_PLAN.md` | `.github/projects/active/reviewer-agent-v2-2026-08/SPEC_PLAN.md` | T048 rule |
| `.github/projects/active/status-needs-review-audit-2026-08-04/OPENSPEC.md` | `.github/projects/active/status-needs-review-audit-2026-08-04/SPEC.md` | T048 rule |
| `.github/projects/active/template-enforcement-governance/OPENSPEC.md` | `.github/projects/active/template-enforcement-governance/SPEC.md` | T048 rule |
| `.github/projects/active/template-enforcement-governance/openspec-strict/README.md` | `.github/projects/active/template-enforcement-governance/spec-strict/README.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/template-enforcement-governance/openspec-strict/children/01-issue-template-governance-enforcement.md` | `.github/projects/active/template-enforcement-governance/spec-strict/children/01-issue-template-governance-enforcement.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/template-enforcement-governance/openspec-strict/children/02-pr-template-governance-enforcement.md` | `.github/projects/active/template-enforcement-governance/spec-strict/children/02-pr-template-governance-enforcement.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/OPENSPEC.md` | `.github/projects/active/test-coverage-implementation/SPEC.md` | T048 rule |
| `.github/projects/active/test-coverage-implementation/openspec-strict/README.md` | `.github/projects/active/test-coverage-implementation/spec-strict/README.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/children/01-phase-1-baseline-measurement.md` | `.github/projects/active/test-coverage-implementation/spec-strict/children/01-phase-1-baseline-measurement.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/children/02-phase-2-metrics-agent-tests.md` | `.github/projects/active/test-coverage-implementation/spec-strict/children/02-phase-2-metrics-agent-tests.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/children/03-phase-3-linting-agent-tests.md` | `.github/projects/active/test-coverage-implementation/spec-strict/children/03-phase-3-linting-agent-tests.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/children/04-phase-4-release-agent-enhancement.md` | `.github/projects/active/test-coverage-implementation/spec-strict/children/04-phase-4-release-agent-enhancement.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/children/05-phase-5-utility-edge-cases.md` | `.github/projects/active/test-coverage-implementation/spec-strict/children/05-phase-5-utility-edge-cases.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/children/06-phase-6-validation-and-reporting.md` | `.github/projects/active/test-coverage-implementation/spec-strict/children/06-phase-6-validation-and-reporting.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/test-coverage-implementation/openspec-strict/parents/01-parent-test-coverage-hardening.md` | `.github/projects/active/test-coverage-implementation/spec-strict/parents/01-parent-test-coverage-hardening.md` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/testing-agent-architecture-2026-08-12/.openspec.yaml` | `.github/projects/active/testing-agent-architecture-2026-08-12/.spec.yaml` | Proposed (not covered by the T048 rules; needs approval) |
| `.github/projects/active/testing-agent-architecture-2026-08-12/OPENSPEC.md` | `.github/projects/active/testing-agent-architecture-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/testing-agent-multi-framework-2026-08-12/OPENSPEC.md` | `.github/projects/active/testing-agent-multi-framework-2026-08-12/SPEC.md` | T048 rule |
| `.github/projects/active/wave-5-documentation-audit/OPENSPEC.md` | `.github/projects/active/wave-5-documentation-audit/SPEC.md` | T048 rule |
| `.github/projects/active/workflows-consolidation-2026-q3/OPENSPEC.md` | `.github/projects/active/workflows-consolidation-2026-q3/SPEC.md` | T048 rule |
| `.github/projects/active/workflows-consolidation-2026-q3/OPENSPEC_MULTIPROJECT_ANALYSIS_2026_08_07.md` | `.github/projects/active/workflows-consolidation-2026-q3/SPEC_MULTIPROJECT_ANALYSIS_2026_08_07.md` | T048 rule |
| `.github/projects/active/workflows-consolidation-2026-q3/OPENSPEC_WORKFLOW_CONSOLIDATION.md` | `.github/projects/active/workflows-consolidation-2026-q3/SPEC_WORKFLOW_CONSOLIDATION.md` | T048 rule |
| `openspec` | — | T048 rule. Root symlink to `.github/projects/active/openspec/`; removed, not renamed |
| `scripts/validation/__tests__/openspec-labels.test.js` | `scripts/validation/__tests__/spec-labels.test.js` | Proposed (not covered by the T048 rules; needs approval) |
| `skills/openspec-estimate-planner/SKILL.md` | `skills/speckit-estimate-planner/SKILL.md` | T048 rule |
| `skills/openspec-estimate-planner/agents/openai.yaml` | `skills/speckit-estimate-planner/agents/openai.yaml` | T048 rule |
| `skills/openspec-estimate-planner/assets/icon.svg` | `skills/speckit-estimate-planner/assets/icon.svg` | T048 rule |
| `skills/openspec-estimate-planner/references/openspec-methodology-summary.md` | `skills/speckit-estimate-planner/references/speckit-methodology-summary.md` | Proposed (not covered by the T048 rules; needs approval) |
| `skills/openspec-estimate-planner/references/output-templates.md` | `skills/speckit-estimate-planner/references/output-templates.md` | T048 rule |

### Impact analysis

- Dependent systems: links in project docs and READMEs, the `openspec` symlink used by older scripts, and `scripts/validation/__tests__/openspec-labels.test.js`. T060 searches for every link to a renamed path before the PR is opened.
- Breaking changes: bookmarks to old paths stop working. Nothing outside this repository is known to depend on these paths.
- Rollback: revert the rename PR.

---

## Definition of Ready (DoR)

- [x] Task/goal described and scoped
- [x] Confirms it does not fit the Code Refactor or Maintenance templates
- [x] Acceptance criteria listed
- [ ] Estimate added (if applicable)

## Definition of Done (DoD)

- [ ] Affected files renamed and links updated
- [ ] PR uses correct branch prefix (`chore/`)
- [ ] Branch deleted after merge
- [ ] Approved by at least one maintainer
- [ ] Issue is verified as completed (quickstart Test 11)
- [ ] Documentation/changelog updated if needed
- [ ] Linked issue(s) updated with latest status and closed after merge
- [ ] The related epic (#449) is not closed; it is updated with a comment reflecting the closed issue
